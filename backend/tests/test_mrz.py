import pytest
from app.services.mrz_parser import calculate_check_digit, parse_td3_passport, parse_td1_id_card

def test_icao_check_digit_calculation():
    # Test known standard ICAO values
    # "L898902C3" -> check digit is 6
    cd = calculate_check_digit("L898902C3")
    assert cd == "6"
    
    # DOB: "740812" -> check digit is 2
    cd_dob = calculate_check_digit("740812")
    assert cd_dob == "2"
    
    # Expiry: "120415" -> check digit is 9
    cd_exp = calculate_check_digit("120415")
    assert cd_exp == "9"

def test_td3_passport_valid_checksum():
    line1 = "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<"
    line2 = "L898902C36UTO7408122F1204159ZE184226B<<<<<10"
    
    mrz = parse_td3_passport([line1, line2])
    assert mrz is not None
    assert mrz.format == "TD3_PASSPORT"
    assert mrz.document_number == "L898902C3"
    assert mrz.nationality == "UTO"
    assert mrz.gender == "F"
    assert mrz.is_checksum_valid is True
    assert len(mrz.checksum_breakdown) >= 3

def test_td3_passport_tampered_checksum():
    # Artificially alter the date of birth in line 2 from 7408122 to 7408152 (check digit left unchanged)
    line1 = "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<"
    line2 = "L898902C36UTO7408152F1204159ZE184226B<<<<<10"
    
    mrz = parse_td3_passport([line1, line2])
    assert mrz is not None
    assert mrz.is_checksum_valid is False
    
    # Check that the DOB check digit failed
    dob_check = next(c for c in mrz.checksum_breakdown if c.field_name == "Date of Birth")
    assert dob_check.is_valid is False

def test_td1_id_card_parsing():
    line1 = "I<UTOD231458907<<<<<<<<<<<<<<<"
    line2 = "7408122F1204159UTO<<<<<<<<<<<6"
    line3 = "ERIKSSON<<ANNA<MARIA<<<<<<<<<<"
    
    mrz = parse_td1_id_card([line1, line2, line3])
    assert mrz is not None
    assert mrz.format == "TD1_ID_CARD"
    assert mrz.document_number == "D23145890"
    assert mrz.is_checksum_valid is True
