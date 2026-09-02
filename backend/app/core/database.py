import logging
from typing import Any, Dict, List, Optional
from datetime import datetime
import uuid
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

logger = logging.getLogger("border_guard.db")

class InMemoryCollection:
    """In-memory collection mock with MongoDB-like async API for zero-friction fallback."""
    def __init__(self, name: str):
        self.name = name
        self._data: Dict[str, Dict[str, Any]] = {}

    async def insert_one(self, document: Dict[str, Any]):
        doc = dict(document)
        if "_id" not in doc:
            doc["_id"] = str(uuid.uuid4())
        elif isinstance(doc["_id"], uuid.UUID):
            doc["_id"] = str(doc["_id"])
        self._data[doc["_id"]] = doc
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc["_id"])

    async def find_one(self, filter_query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for doc in self._data.values():
            if self._matches(doc, filter_query):
                return dict(doc)
        return None

    def find(self, filter_query: Optional[Dict[str, Any]] = None):
        filter_query = filter_query or {}
        matching = [dict(doc) for doc in self._data.values() if self._matches(doc, filter_query)]
        
        class Cursor:
            def __init__(self, items):
                self.items = items
                self._sort_key = None
                self._sort_dir = 1
                self._skip = 0
                self._limit = None

            def sort(self, key_or_list, direction=1):
                if isinstance(key_or_list, list) and key_or_list:
                    self._sort_key, self._sort_dir = key_or_list[0]
                elif isinstance(key_or_list, str):
                    self._sort_key = key_or_list
                    self._sort_dir = direction
                return self

            def skip(self, n: int):
                self._skip = n
                return self

            def limit(self, n: int):
                self._limit = n
                return self

            async def to_list(self, length: Optional[int] = None) -> List[Dict[str, Any]]:
                res = list(self.items)
                if self._sort_key:
                    res.sort(
                        key=lambda x: (x.get(self._sort_key) is None, x.get(self._sort_key)),
                        reverse=(self._sort_dir == -1)
                    )
                start = self._skip
                end = None if self._limit is None else start + self._limit
                sliced = res[start:end]
                if length is not None:
                    sliced = sliced[:length]
                return sliced

        return Cursor(matching)

    async def count_documents(self, filter_query: Optional[Dict[str, Any]] = None) -> int:
        filter_query = filter_query or {}
        return sum(1 for doc in self._data.values() if self._matches(doc, filter_query))

    async def delete_one(self, filter_query: Dict[str, Any]):
        for key, doc in list(self._data.items()):
            if self._matches(doc, filter_query):
                del self._data[key]
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
        class DeleteResultZero:
            deleted_count = 0
        return DeleteResultZero()

    async def update_one(self, filter_query: Dict[str, Any], update_data: Dict[str, Any]):
        for key, doc in self._data.items():
            if self._matches(doc, filter_query):
                if "$set" in update_data:
                    doc.update(update_data["$set"])
                if "$unset" in update_data:
                    for field in update_data["$unset"]:
                        doc.pop(field, None)
                if "$inc" in update_data:
                    for field, value in update_data["$inc"].items():
                        doc[field] = doc.get(field, 0) + value
                class UpdateResult:
                    modified_count = 1
                return UpdateResult()
        class UpdateResultZero:
            modified_count = 0
        return UpdateResultZero()

    def _matches(self, doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
        for k, v in query.items():
            if k == "$or" and isinstance(v, list):
                if not any(all(self._match_field(doc, subk, subv) for subk, subv in item.items()) for item in v):
                    return False
            elif not self._match_field(doc, k, v):
                return False
        return True

    def _match_field(self, doc: Dict[str, Any], field: str, condition: Any) -> bool:
        val = doc.get(field)
        if isinstance(condition, dict):
            import re
            for operator, op_value in condition.items():
                if operator == "$regex":
                    flags = re.IGNORECASE if condition.get("$options") == "i" else 0
                    if not bool(re.search(op_value, str(val or ""), flags)):
                        return False
                elif operator == "$in":
                    if val not in op_value:
                        return False
                elif operator == "$gte":
                    if val is None or val < op_value:
                        return False
                elif operator == "$lte":
                    if val is None or val > op_value:
                        return False
                elif operator == "$gt":
                    if val is None or val <= op_value:
                        return False
                elif operator == "$lt":
                    if val is None or val >= op_value:
                        return False
                elif operator == "$ne":
                    if val == op_value:
                        return False
            return True
        return val == condition


class InMemoryDatabase:
    """Mock MongoDB database for standalone local operation."""
    def __init__(self):
        self._collections: Dict[str, InMemoryCollection] = {}

    def __getitem__(self, name: str) -> InMemoryCollection:
        if name not in self._collections:
            self._collections[name] = InMemoryCollection(name)
        return self._collections[name]

    def get_collection(self, name: str) -> InMemoryCollection:
        return self[name]


class DatabaseManager:
    """Manages Async MongoDB and fallback storage connection."""
    client: Optional[AsyncIOMotorClient] = None
    db: Any = None
    is_in_memory: bool = False

    @classmethod
    async def connect(cls):
        try:
            logger.info(f"Attempting connection to MongoDB at {settings.MONGODB_URL}...")
            client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=1500,
                connectTimeoutMS=1500
            )
            # Test ping
            await client.admin.command('ping')
            cls.client = client
            cls.db = client[settings.MONGODB_DB_NAME]
            cls.is_in_memory = False
            logger.info(f" Successfully connected to MongoDB [{settings.MONGODB_DB_NAME}]")
        except Exception as e:
            logger.warning(f"⚠️ Could not connect to live MongoDB: {e}. Falling back to In-Memory store for standalone execution.")
            cls.client = None
            cls.db = InMemoryDatabase()
            cls.is_in_memory = True
            logger.info(" In-Memory Fallback Database initialized successfully.")

    @classmethod
    async def disconnect(cls):
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed.")

    @classmethod
    def get_collection(cls, name: str):
        if cls.db is None:
            # Lazy initialize in-memory if called before connect
            cls.db = InMemoryDatabase()
            cls.is_in_memory = True
        return cls.db[name]


# Convenience getter
def get_db():
    return DatabaseManager.db

def get_collection(name: str):
    return DatabaseManager.get_collection(name)
