/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

//import   "database/sql"
//import _ "github.com/go-sql-driver/mysql"
//import   "os"
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

/*
func TestDeleteOrgFromDB(t *testing.T) {
	deleteOrgFromDB(db *sql.DB, org string) error
}

func TestDeleteOrgIcon(t *testing.T) {
	deleteOrgIcon(org string) error
}

func TestGetNotUpdatedOrgs(t *testing.T) {
	getNotUpdatedOrgs(db *sql.DB) []string
*/
