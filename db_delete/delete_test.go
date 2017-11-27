/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "database/sql"
import _ "github.com/go-sql-driver/mysql"
import   "os"
import   "strconv"
import   "testing"

func TestDoesOrgExist(t *testing.T) {
	var org string
	var expect, result bool
	
	org    = "AOTW"
	expect = true
	result = doesOrgExist(org)
	if result != expect { t.Error("sid: " + org + ", expect: " + strconv.FormatBool(expect) + ", result: " + strconv.FormatBool(result)) }
	
	org    = "AOTWAOTW"
	expect = false
	result = doesOrgExist(org)
	if result != expect { t.Error("sid: " + org + ", expect: " + strconv.FormatBool(expect) + ", result: " + strconv.FormatBool(result)) }
}


func TestDeleteOrgFromDB(t *testing.T) {
	db, err := sql.Open("mysql", "tester" + ":" + "test" + "@/" + "testdb")
	if err != nil { panic(err) }
	defer db.Close()
	
	var result bool
	
	//Preconditions
	var org1 string = "ORGSID1"
	err = deleteOrgFromDB(db, org1)
	if err != nil { panic(err) }
	result = doesOrgHaveData(db, org1)
	if result == true {
		t.Error("pre-existing test data for org sid: " + org1)
		os.Exit(1)
	}
	//
	var org2 string = "ORGSID2"
	err = deleteOrgFromDB(db, org2)
	if err != nil { panic(err) }
	result = doesOrgHaveData(db, org2)
	if result == true {
		t.Error("pre-existing test data for org sid: " + org2)
		os.Exit(1)
	}
	
	//INSERT
	err = insertTestOrg(db, org1, "CURDATE()")
	if err != nil { panic(err) }
	result = doesOrgHaveData(db, org1)
	if result == false {
		t.Error("failed to insert test data for org sid: " + org1)
		os.Exit(1)
	}
	//
	err = insertTestOrg(db, org2, "CURDATE()")
	if err != nil { panic(err) }
	result = doesOrgHaveData(db, org2)
	if result == false {
		t.Error("failed to insert test data for org sid: " + org2)
		os.Exit(1)
	}
	
	//DELETE
	err = deleteOrgFromDB(db, org1)
	if err != nil { panic(err) }
	result = doesOrgHaveData(db, org1)
	if result == true {
		t.Error("failed to delete test data for org sid: " + org1)
		os.Exit(1)
	}
	//
	err = deleteOrgFromDB(db, org2)
	if err != nil { panic(err) }
	result = doesOrgHaveData(db, org2)
	if result == true {
		t.Error("failed to delete test data for org sid: " + org2)
		os.Exit(1)
	}
}


func TestDeleteOrgIcon(t *testing.T) {
	var org string	
	var err error
	var isPathError bool
	
	org = "TEST_FILE_NOT_EXIST"
	err = deleteOrgIcon(org, "./")
	_, isPathError = err.(*os.PathError)
	if !isPathError { t.Error("Expected path error for file: " + org + ", Received: " + err.Error()) }
	
	org = "TEST_FILE_EXIST"
	var fp *os.File
	fp, err = os.Create("./" + org)
	_, isPathError = err.(*os.PathError)
	if isPathError { t.Error("Expected to create file: " + org + ", Received: " + err.Error()) }
	err = fp.Close()
	if err != nil { t.Error( "attempted to close file: " + org + ", " + err.Error() ) }
	
	err = deleteOrgIcon(org, "./")
	_, isPathError = err.(*os.PathError)
	if isPathError { t.Error("Expected to delete file: " + org + ", Received: " + err.Error()) }
}

func TestGetNotUpdatedOrgs(t *testing.T) {
	db, err := sql.Open("mysql", "tester" + ":" + "test" + "@/" + "testdb")
	if err != nil { panic(err) }
	defer db.Close()
	var org string;
	var updatedTrueFalse map[string]bool = make( map[string]bool )
	
	org = "NOTUPDATED"
	err = deleteOrgFromDB(db, org)
	if err != nil { panic(err) }
	updatedTrueFalse[org] = false
	insertTestOrg(db, org, "DATE_SUB( CURDATE(), INTERVAL 3 DAY )")
	
	org = "UPDATED"
	err = deleteOrgFromDB(db, org)
	if err != nil { panic(err) }
	updatedTrueFalse[org] = true
	insertTestOrg(db, org, "CURDATE()")
	 
	var notUpdatedOrgs []string = getNotUpdatedOrgs(db)
	for _, org := range notUpdatedOrgs {
		if updatedTrueFalse[org] == true { t.Error("org sid: " + org + " wrongly reported as updated") }
		updatedTrueFalse[org] = true//mark as checked
	}
	
	var value bool
	for org, value = range updatedTrueFalse {
		if value == false { t.Error("org sid: " + org + " wrongly reported as NOT updated") }
		err = deleteOrgFromDB(db, org)
		if err != nil { panic(err) }
	}
}

func doesOrgHaveData(db *sql.DB, org string) bool {
	var err error
	var value string
	err = db.QueryRow("SELECT SID FROM tbl_Organizations WHERE SID = ?",                      org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_OrgMemberHistory WHERE Organization = ?", org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_IconURLs WHERE Organization = ?",         org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_Commits WHERE Organization = ?",          org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_FullOrgs WHERE Organization = ?",         org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_PrimaryFocus WHERE Organization = ?",     org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_SecondaryFocus WHERE Organization = ?",   org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_Performs WHERE Organization = ?",         org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_OrgArchetypes WHERE Organization = ?",    org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_FilterArchetypes WHERE Organization = ?", org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_RolePlayOrgs WHERE Organization = ?",     org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_OrgFluencies WHERE Organization = ?",     org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT Organization FROM tbl_FilterFluencies WHERE Organization = ?" , org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	err = db.QueryRow("SELECT SID FROM tbl_OrgDescription WHERE SID = ?",                     org).Scan(&value)
	if err == nil { return true } else if err != sql.ErrNoRows { panic(err) }
	return false
}

func insertTestOrg(db *sql.DB, org string, date string) (err error) {
	var tx *sql.Tx
	tx, err = db.Begin()
	if err != nil { return err }
	defer func() {
		r := recover()
		if r != nil {
			tx.Rollback()
		} else {
			err = tx.Commit()
		}
	}()
	err = tx.QueryRow("INSERT INTO tbl_Organizations    (SID, Name, Size, Main, CustomIcon) VALUES (?, 'orgName', 20, 10, 0)", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_OrgMemberHistory (Organization, ScrapeDate, Size, Main, Affiliate, Hidden) VALUES (?, " + date + ", 20, 10, 8, 2)", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_IconURLs         (Organization, Icon) VALUES (?, 'example.com/someurl')", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_Commits          (Organization, Commitment) VALUES (?, 'Hardcore')", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_FullOrgs         (Organization) VALUES (?)", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_PrimaryFocus     (PrimaryFocus, Organization) VALUES ('Resources', ?)", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_SecondaryFocus(SecondaryFocus, Organization) VALUES ('Exploration', ?)", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_Performs(Organization, PrimaryFocus, SecondaryFocus) VALUES (?, 'Resources', 'Exploration')", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_OrgArchetypes(Organization, Archetype) VALUES (?, 'Corporation')", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_FilterArchetypes(Archetype, Organization) VALUES ('Corporation', ?)", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_RolePlayOrgs(Organization) VALUES (?)", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_OrgFluencies(Organization, Language) VALUES (?, 'English')", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_FilterFluencies(Language, Organization) VALUES ('English', ?)", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	err = tx.QueryRow("INSERT INTO tbl_OrgDescription(SID, Headline, Manifesto) VALUES(?, 'We do stuff!', 'we are an org blah blah blah')", org).Scan()
	if err != sql.ErrNoRows { panic(err) }
	
	return err//see defer
}
