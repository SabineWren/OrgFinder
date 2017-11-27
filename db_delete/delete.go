/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "database/sql"
import   "fmt"
import _ "github.com/go-sql-driver/mysql"
import   "os"
import   "os/exec"
import   "strings"

func main() {
	var username, dbname, dbpassword string = parseArgs( os.Args[1:] )
	var db *sql.DB
	var err error
	db, err = sql.Open("mysql", username + ":" + dbpassword + "@/" + dbname)
	if err != nil { panic(err) }
	defer db.Close()
	
	var orgs []string = getNotUpdatedOrgs(db)
	var success bool
	for _, org := range orgs{
		if !doesOrgExist(org) {
			err = deleteOrgFromDB(db, org)
			if err != nil { panic(err) }
			fmt.Println("deleted org: " + org)
			success, err = deleteOrgIcon(org, "../../org_icons_fullsize/")
			if success == false { fmt.Println(err.Error()) }
			success, err = deleteOrgIcon(org, "../../org_icons/")
			if success == false { fmt.Println(err.Error()) }
		} else {
			fmt.Println("org '" + org + "' still exists but did not update")
		}
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

func deleteOrgIcon(org string, path string) (bool, error) {
	var isPathError bool
	var err error
	var pathErr *os.PathError
	
	err = os.Remove(path + org)
	if err == nil { return true, err }
	
	pathErr, isPathError = err.(*os.PathError)
	if isPathError && pathErr.Err.Error() == "no such file or directory" { return true, err }
	
	return false, err
}

//if org doesn't exist on RSI, then org page returns error 404
func doesOrgExist(org string) bool {
	var url string = "https://robertsspaceindustries.com/orgs/" + org
	var responseRaw []byte
	var err error
	responseRaw, err = exec.Command("curl", "--head", url).Output()
	if err != nil { panic(err) }

	var response       string = string(responseRaw[:])
	var headerLines  []string = strings.Split(response, "\n")
	var responseCode   string = headerLines[0]
	responseCode = responseCode[:len(responseCode)-1]//remove carriage return
	
	switch responseCode {
	case "HTTP/1.1 200 OK":
		return true
	case "HTTP/1.1 404 Not Found":
		return false
	default:
		fmt.Println("URL: " + url)
		fmt.Println("Response code: " + responseCode)
	}
	return true
}

func getNotUpdatedOrgs(db *sql.DB) []string {
	rows, err := db.Query(`SELECT SID from (
		SELECT Organization as SID, DATEDIFF( curdate(), ScrapeDate ) as daysSinceScrape
		FROM tbl_OrgMemberHistory
		GROUP BY SID
		HAVING MAX(ScrapeDate) AND daysSinceScrape > 0
	) as T;`)
	
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

func parseArgs(args []string) (string, string, string) {
	if len(args) != 3 {
		fmt.Println("Expected three args: username, dbname, and dbpassword. Received:")
		fmt.Println(args)
		os.Exit(1)
	}
	return args[0], args[1], args[2]
}
