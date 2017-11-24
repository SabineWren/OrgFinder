/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "database/sql"
//import   "errors"
import   "fmt"
import _ "github.com/go-sql-driver/mysql"
import   "os"

import input "../lib_input"

func main() {
	var username, dbname, dbpassword string = input.ParseArgs( os.Args[1:] )
	var db *sql.DB
	var err error
	db, err = sql.Open("mysql", username + ":" + dbpassword + "@/" + dbname)
	if err != nil { panic(err) }
	defer db.Close()
	
	var orgs []string = getNotUpdatedOrgs(db)
	for _, org := range orgs{
		if isOrgDisbanded(org) {
			err = deleteOrgFromDB(db, org)
			if err != nil { panic(err) }
			fmt.Println("deleted org: " + org)
			err = deleteOrgIcon(org)
			if err != nil { panic(err) }
		} else {
			fmt.Println("org '" + org + "' still exists but did not update")
		}
		break//temporary; get one working before looping
	}
}

func deleteOrgFromDB(db *sql.DB, org string) (err error) {
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
	
	_, err = tx.Exec("DELETE FROM tbl_Cog              WHERE SID = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_OPPF             WHERE SID = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_STAR             WHERE SID = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_IconURLs         WHERE Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_Commits          where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_RolePlayOrgs     where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_OrgArchetypes    where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_FilterArchetypes where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_FullOrgs         where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_ExclusiveOrgs    where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_OrgFluencies     where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_FilterFluencies  where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_OrgDescription   where SID = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_Performs         where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_PrimaryFocus     where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_SecondaryFocus   where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_OrgMemberHistory where Organization = ?", org)
	if err != nil { panic(err) }
	_, err = tx.Exec("DELETE FROM tbl_Organizations    where SID = ?", org)
	if err != nil { panic(err) }
	
	return err//see defer
}

func deleteOrgIcon(org string) error {
	fmt.Println("IMPLEMENT DELETE ICON")
	return nil
}

func getNotUpdatedOrgs(db *sql.DB) []string {
	rows, err := db.Query("SELECT Organization as SID, DATEDIFF( curdate(), ScrapeDate ) as scrape FROM tbl_OrgMemberHistory GROUP BY SID HAVING MAX(ScrapeDate) AND scrape > 0")
	if err != nil { panic(err) }
	defer rows.Close()
	
	var orgs []string = make([]string, 0)
	var org string
	for rows.Next() {
		err = rows.Scan(&org)
		if err != nil { panic(err) }
		orgs = append(orgs, org)
	}
	err = rows.Err()
	if err != nil { panic(err) }
	return orgs
}

func isOrgDisbanded(org string) bool {
	//see if org page returns error 404 on RSI
	return false
}