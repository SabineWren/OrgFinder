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
//import   "fmt"
import _ "github.com/go-sql-driver/mysql"
import   "os"

import input "../lib_input"

func main(){
	var username, dbname, dbpassword string = dbParseArgs( os.Args[1:] )
	var db *sql.DB
	var err error
	db, err = sql.Open("mysql", username + ":" + dbpassword + "@/" + dbname)
	if err != nil { panic(err) }
	defer db.Close()
	
	//delete stuff
}
