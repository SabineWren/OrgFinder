/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "errors"
import   "strings"

func CombineOrgData(org ResultOrg, orgDataFromGroup OrgInGroup, sid string, size int, main int, affil int, hidden int) ValidStmtArgs {
	var stmtArgs ValidStmtArgs
	var iconParsedURL string = strings.Replace(orgDataFromGroup.Logo, `\`, "", -1)
	
	stmtArgs.archetype      = org.Archetype
	stmtArgs.charter        = org.Charter
	stmtArgs.commitment     = org.Commitment
	stmtArgs.focusPrimary   = org.Primary_focus
	stmtArgs.focusSecondary = org.Secondary_focus
	stmtArgs.headline       = org.Headline
	stmtArgs.history        = org.History
	stmtArgs.language       = orgDataFromGroup.Lang//inner query lang == null due to API bug
	stmtArgs.manifesto      = org.Manifesto
	stmtArgs.name           = org.Title
	if stmtArgs.name == "" {
		stmtArgs.name = " "//db does not currently accept null names, but spaces are ok
	}
	stmtArgs.spectrumID     = sid
	stmtArgs.size           = size
	stmtArgs.sizeMain       = main
	stmtArgs.sizeAffil      = affil
	stmtArgs.sizeHidden     = hidden
	
	const urlOrganization string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/generic.jpg"
	const urlCorporation  string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/corp.jpg"
	const urlPMC          string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/pmc.jpg"
	const urlFaith        string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/faith.jpg"
	const urlSyndicate    string = "http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/syndicate.jpg"
	switch iconParsedURL {
	case urlOrganization, urlCorporation, urlPMC, urlFaith, urlSyndicate:
		stmtArgs.customIcon = int8(0)
		stmtArgs.iconURL    = ""
	default:
		stmtArgs.customIcon = int8(1)
		stmtArgs.iconURL    = iconParsedURL
	}
	
	switch org.Recruiting {
	case "Yes":
		stmtArgs.recruitment = true
	case "No":
		stmtArgs.recruitment = false
	default:
		panic( errors.New("query for individual org does not yield valid recruitment Yes/No") )
	}
	
	switch org.Roleplay {
	case "Yes":
		stmtArgs.roleplay = true
	case "No":
		stmtArgs.roleplay = false
	default:
		panic( errors.New("query for individual org does not yield valid roleplay Yes/No") )
	}
	
	return stmtArgs
}
