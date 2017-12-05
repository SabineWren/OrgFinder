/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "database/sql"
import _ "github.com/go-sql-driver/mysql"

func ReclusterTables(db *sql.DB) error {
	var err error
	
	_, err = db.Exec("ALTER TABLE tbl_Organizations ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_Performs ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_PrimaryFocus ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_SecondaryFocus ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_OrgMemberHistory ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_IconURLs ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_Commits ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_RolePlayOrgs ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_OrgArchetypes ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_FilterArchetypes ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_FullOrgs ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_ExclusiveOrgs ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_OrgFluencies ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_FilterFluencies ENGINE=INNODB")
	if err != nil { return err }
	
	_, err = db.Exec("ALTER TABLE tbl_OrgDescription ENGINE=INNODB")
	return err
}
