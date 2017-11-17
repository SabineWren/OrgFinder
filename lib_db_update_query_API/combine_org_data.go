/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package lib_db_update_query_API

import   "errors"

type ValidStmtArgs struct {
	Archetype      string
	Charter        string
	Commitment     string
	CustomIcon     int8//MySQL boolean aliases to TINYINT
	FocusPrimary   string
	FocusSecondary string
	Headline       string
	History        string
	IconURL        string
	Language       string
	Manifesto      string
	Name           string
	Recruitment    bool//for conditional logic
	Roleplay       bool//for conditional logic
	Size           int
	SizeMain       int
	SizeAffil      int
	SizeHidden     int
	SpectrumID     string
}

func CombineOrgData(org ResultOrg, orgDataFromGroup OrgInGroup, sid string, size int, main int, affil int, hidden int) ValidStmtArgs {
	var stmtArgs ValidStmtArgs
	
	stmtArgs.Archetype      = org.Archetype
	stmtArgs.Charter        = org.Charter
	stmtArgs.Commitment     = org.Commitment
	stmtArgs.FocusPrimary   = org.Primary_focus
	stmtArgs.FocusSecondary = org.Secondary_focus
	stmtArgs.Headline       = org.Headline
	stmtArgs.History        = org.History
	stmtArgs.Language       = orgDataFromGroup.Lang//inner query lang == null due to API bug
	stmtArgs.Manifesto      = org.Manifesto
	stmtArgs.Name           = org.Title
	if stmtArgs.Name == "" {
		stmtArgs.Name = " "//db does not currently accept null names, but spaces are ok
	}
	stmtArgs.SpectrumID     = sid
	stmtArgs.Size           = size
	stmtArgs.SizeMain       = main
	stmtArgs.SizeAffil      = affil
	stmtArgs.SizeHidden     = hidden
	
	const urlOrganization string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/generic.jpg"
	const urlCorporation  string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/corp.jpg"
	const urlPMC          string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/pmc.jpg"
	const urlFaith        string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/faith.jpg"
	const urlSyndicate    string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/syndicate.jpg"
	
	switch orgDataFromGroup.Logo {
	case urlOrganization, urlCorporation, urlPMC, urlFaith, urlSyndicate:
		stmtArgs.CustomIcon = int8(0)
		stmtArgs.IconURL    = ""
	default:
		stmtArgs.CustomIcon = int8(1)
		stmtArgs.IconURL    = orgDataFromGroup.Logo
	}
	
	switch org.Recruiting {
	case "Yes":
		stmtArgs.Recruitment = true
	case "No":
		stmtArgs.Recruitment = false
	default:
		panic( errors.New("query for individual org does not yield valid recruitment Yes/No") )
	}
	
	switch org.Roleplay {
	case "Yes":
		stmtArgs.Roleplay = true
	case "No":
		stmtArgs.Roleplay = false
	default:
		panic( errors.New("query for individual org does not yield valid roleplay Yes/No") )
	}
	
	return stmtArgs
}
