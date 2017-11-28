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

func TestCompressOrgHistory(t *testing.T) {
	db, err := sql.Open("mysql", "tester" + ":" + "test" + "@/" + "testdb")
	if err != nil { panic(err) }
	defer db.Close()
	var expect []scrape
	var result []scrape
	var org string
	
	//case 1: data cannot be interpolated at all
	expect = []scrape{
		scrape{size:20, main:10, affil:8, hidden:2},
		scrape{size:19, main: 9, affil:8, hidden:2},
		scrape{size:16, main: 9, affil:5, hidden:2},
		scrape{size:14, main: 9, affil:4, hidden:1},
		scrape{size:13, main: 8, affil:4, hidden:1},
		scrape{size:12, main: 8, affil:4, hidden:0},
		scrape{size: 9, main: 7, affil:2, hidden:0},
		scrape{size: 8, main: 6, affil:2, hidden:0},
		scrape{size: 5, main: 3, affil:2, hidden:0},
		scrape{size: 3, main: 2, affil:1, hidden:0},
	}
	
	org = "NOCOMPRESS"
	err = deleteOrgFromDB(db, org)
	if err != nil { panic(err) }
	insertTestOrg(db, org, "CURDATE()", expect[0])
	for i, s := range expect[1:] {
		insertTestHistory(db, org, i+1, s)
	}
	
	result, err = getOrgHistory(db, org)
	if !compareScrapes(expect, result) { t.Error("failed to insert test history for org: " + org) }
	
	err = compressOrgHistory(db, org, expect)
	if err != nil { panic(err) }
	
	result, err = getOrgHistory(db, org)
	if !compareScrapes(expect, result) { t.Error("bad delta compression for org: " + org) }
	
	err = deleteOrgFromDB(db, org)
	if err != nil { panic(err) }
	
	//case 2: size requires interpolation
	expect = []scrape{
		scrape{size:20, main:10, affil:10, hidden:0},
		scrape{size:20, main:10, affil:10, hidden:0},
		scrape{size:20, main:10, affil:10, hidden:0},
		scrape{size:20, main:10, affil:10, hidden:0},
		scrape{size:17, main: 7, affil:10, hidden:0},
		scrape{size:17, main: 7, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
	}
	
	org = "COMPSIZE"
	err = deleteOrgFromDB(db, org)
	if err != nil { panic(err) }
	insertTestOrg(db, org, "CURDATE()", expect[0])
	for i, s := range expect[1:] {
		insertTestHistory(db, org, i+1, s)
	}
	
	result, err = getOrgHistory(db, org)
	if !compareScrapes(expect, result) { t.Error("failed to insert test history for org: " + org) }
	
	err = compressOrgHistory(db, org, expect)
	if err != nil { panic(err) }
	
	expect = []scrape{
		scrape{size:20, main:10, affil:10, hidden:0},
		scrape{size:20, main:10, affil:10, hidden:0},
		scrape{size:17, main: 7, affil:10, hidden:0},
		scrape{size:17, main: 7, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
	}
	
	result, err = getOrgHistory(db, org)
	if !compareScrapes(expect, result) { t.Error("bad delta compression for org: " + org) }
	
	err = deleteOrgFromDB(db, org)
	if err != nil { panic(err) }
	
	//case 3: partial size interpolation
	expect = []scrape{
		scrape{size:20, main:11, affil: 9, hidden:0},
		scrape{size:20, main:11, affil: 9, hidden:0},
		scrape{size:20, main:11, affil: 9, hidden:0},
		scrape{size:20, main:10, affil:10, hidden:0},
		scrape{size:17, main: 7, affil:10, hidden:0},
		scrape{size:17, main: 7, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
	}
	
	org = "AFFTOMAIN"
	err = deleteOrgFromDB(db, org)
	if err != nil { panic(err) }
	insertTestOrg(db, org, "CURDATE()", expect[0])
	for i, s := range expect[1:] {
		insertTestHistory(db, org, i+1, s)
	}
	
	result, err = getOrgHistory(db, org)
	if !compareScrapes(expect, result) { t.Error("failed to insert test history for org: " + org) }
	
	err = compressOrgHistory(db, org, expect)
	if err != nil { panic(err) }
	
	expect = []scrape{
		scrape{size:20, main:11, affil: 9, hidden:0},
		scrape{size:20, main:11, affil: 9, hidden:0},
		scrape{size:20, main:10, affil:10, hidden:0},
		scrape{size:17, main: 7, affil:10, hidden:0},
		scrape{size:17, main: 7, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
		scrape{size:15, main: 5, affil:10, hidden:0},
	}
	
	result, err = getOrgHistory(db, org)
	if !compareScrapes(expect, result) { t.Error("bad delta compression for org: " + org) }
	
	err = deleteOrgFromDB(db, org)
	if err != nil { panic(err) }
}

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
	insertTestOrg(db, org1, "CURDATE()", scrape{size: 3, main: 2, affil:1, hidden:0})
	insertTestHistory(db, org1, 1, scrape{size: 3, main: 2, affil:1, hidden:0})
	result = doesOrgHaveData(db, org1)
	if result == false {
		t.Error("failed to insert test data for org sid: " + org1)
		os.Exit(1)
	}
	//
	insertTestOrg(db, org2, "CURDATE()", scrape{size: 5, main: 3, affil:1, hidden:1})
	insertTestHistory(db, org2, 2, scrape{size: 5, main: 3, affil:1, hidden:1})
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
	var success bool
	var err error
	var isPathError bool
	var pathErr *os.PathError
	
	org = "TEST_FILE_NOT_EXIST"
	success, err = deleteOrgIcon(org, "./")
	if !success { t.Error("Deletion failed for file: " + org) }
	pathErr, isPathError = err.(*os.PathError)
	if !isPathError { t.Error("Expect path error for file: " + org + ", Received: " + err.Error()) }
	if pathErr.Err.Error() != "no such file or directory" { t.Error("wrong error message: " + pathErr.Err.Error()) }
	
	org = "TEST_FILE_EXIST"
	var fp *os.File
	fp, err = os.Create("./" + org)
	_, isPathError = err.(*os.PathError)
	if isPathError { t.Error("Expect to create file: " + org + ", Received: " + err.Error()) }
	err = fp.Close()
	if err != nil { t.Error( "attempted to close file: " + org + ", " + err.Error() ) }
	
	success, err = deleteOrgIcon(org, "./")
	if !success { t.Error("Deletion failed for file: " + org) }
	_, isPathError = err.(*os.PathError)
	if isPathError { t.Error("Expect to delete file: " + org + ", Received: " + err.Error()) }
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
	insertTestOrg(db, org, "DATE_SUB( CURDATE(), INTERVAL 3 DAY )", scrape{size:20, main:10, affil:8, hidden:2})
	
	org = "UPDATED"
	err = deleteOrgFromDB(db, org)
	if err != nil { panic(err) }
	updatedTrueFalse[org] = true
	insertTestOrg(db, org, "CURDATE()", scrape{size:10, main:5, affil:5, hidden:0})
	 
	var notUpdatedOrgs []string
	notUpdatedOrgs, err = getNotUpdatedOrgs(db)
	if err != nil { panic(err) }
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

func TestGetAllOrgs(t *testing.T) {
	db, err := sql.Open("mysql", "tester" + ":" + "test" + "@/" + "testdb")
	if err != nil { panic(err) }
	defer db.Close()
	
	var orgsExpect []string = []string{"ORG0","ORG1","ORG2","ORG3","ORG4","ORG5"}
	for _, org := range orgsExpect {
		err = deleteOrgFromDB(db, org)
		if err != nil { panic(err) }
	}
	for _, org := range orgsExpect {
		insertTestOrg(db, org, "CURDATE()", scrape{size:30, main:20, affil:9, hidden:1})
	}
	
	var orgsResult []string
	orgsResult, err = getAllOrgs(db)
	if err != nil { panic(err) }
	
	if len(orgsExpect) != len(orgsResult) { t.Error("wrong number of orgs returned") }
	for k, _ := range orgsExpect {
		if orgsExpect[k] != orgsResult[k] { t.Error("Expect org: " + orgsExpect[k] + ", Received: " + orgsResult[k]) }
	}
	
	for _, org := range orgsExpect {
		err = deleteOrgFromDB(db, org)
		if err != nil { panic(err) }
	}
}

func compareScrapes(forward, reverse []scrape) bool {
	if len(forward) != len(reverse) { return false }
	
	for i, _ := range forward {
		if forward[i] != reverse[len(reverse)-1-i] { return false }
	}
	return true
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

func insertTestHistory(db *sql.DB, org string, daysAgo int, s scrape){
	_, err := db.Exec(`
		INSERT INTO tbl_OrgMemberHistory (Organization, ScrapeDate, Size, Main, Affiliate, Hidden)
		VALUES (?, DATE_SUB(CURDATE(), INTERVAL ` + strconv.Itoa(daysAgo) + ` DAY), ?, ?, ?, ?)`,
		org, s.size, s.main, s.affil, s.hidden,
	)
	if err != nil { panic(err) }
}

func insertTestOrg(db *sql.DB, org string, date string, s scrape) {
	tx, err := db.Begin()
	if err != nil { panic(err) }
	defer func() {
		r := recover()
		if r != nil {
			tx.Rollback()
			panic(err)
		} else {
			err = tx.Commit()
		}
	}()
	_, err = tx.Exec(`
		INSERT INTO tbl_Organizations (SID, Name, Size, Main, CustomIcon)
		VALUES (?, 'orgName', ?, ?, 0)`,
		org, s.size, s.main,
	)
	if err != nil { panic(err) }
	
	_, err = tx.Exec(`
		INSERT INTO tbl_OrgMemberHistory (Organization, ScrapeDate, Size, Main, Affiliate, Hidden)
		VALUES (?, ` + date + ", ?, ?, ?, ?)",
		org, s.size, s.main, s.affil, s.hidden,
	)
	if err != nil { panic(err) }
	
	_, err = tx.Exec("INSERT INTO tbl_IconURLs (Organization, Icon) VALUES (?, 'example.com/someurl')", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_Commits (Organization, Commitment) VALUES (?, 'Hardcore')", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_FullOrgs (Organization) VALUES (?)", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_PrimaryFocus (PrimaryFocus, Organization) VALUES ('Resources', ?)", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_SecondaryFocus(SecondaryFocus, Organization) VALUES ('Exploration', ?)", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_Performs(Organization, PrimaryFocus, SecondaryFocus) VALUES (?, 'Resources', 'Exploration')", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_OrgArchetypes(Organization, Archetype) VALUES (?, 'Corporation')", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_FilterArchetypes(Archetype, Organization) VALUES ('Corporation', ?)", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_RolePlayOrgs(Organization) VALUES (?)", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_OrgFluencies(Organization, Language) VALUES (?, 'English')", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_FilterFluencies(Language, Organization) VALUES ('English', ?)", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("INSERT INTO tbl_OrgDescription(SID, Headline, Manifesto) VALUES(?, 'We do stuff!', 'we are an org blah blah blah')", org)
	if err != nil { panic(err) }
}
