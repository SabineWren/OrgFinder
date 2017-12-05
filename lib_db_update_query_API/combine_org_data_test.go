/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package lib_db_update_query_API

import   "testing"

func TestCombineOrgData(t *testing.T) {
	var org                       ResultOrg
	var orgDataFromGroup          OrgInGroup
	var sid                       string
	var size, main, affil, hidden int
	var result                    ValidStmtArgs
	var expected                  ValidStmtArgs
	
	org = ResultOrg {
		Archetype:       `Organization`,
		Banner:          `abc`,
		Charter:         `<p>Page Under Construction. Please check back soon!</p>`,
		Cover_image:     `abc`,
		Cover_video:     `abc`,
		Commitment:      `Regular`,
		Headline:        `N’hésite pas à rejoindre l’Elite des Baroudeurs de l’Espace !\nForum en préparation.\nActivation du discord le 7 octobre 2947.`,
		History:         `<p>En 2947, les plus valeureux pilotes de la Galaxie d\u00e9cid\u00e8rent de se regrouper pour former une organisation polyvalente.<br />\nAdepte du professionnalisme ; elle f\u00fbt tr\u00e8s vite reconnue au sein de l\u2019UEE et pris\u00e9e par tous les marchands de la galaxie pour ces prix attractifs et \u00e7a perspicacit\u00e9. </p>`,
		Logo:            `http://robertsspaceindustries.com/media/gdnha6gjtp5y2r/logo/OVNI-Logo.png`,
		Manifesto:       `<p>Page Under Construction. Please check back soon!</p>`,
		Member_count:    `3`,
		Primary_focus:   `Trading`,
		Recruiting:      `Yes`,
		Roleplay:        `Yes`,
		Secondary_focus: `Resources`,
		Title:           `L’Ordre des Vétérans Navigateurs Interstellaire`,
	}
	orgDataFromGroup = OrgInGroup {
		Lang:         `French`,
		Logo:         `http://robertsspaceindustries.com/media/gdnha6gjtp5y2r/logo/OVNI-Logo.png`,
		Member_count: `10`,
		Sid:          `SOMEID`,
	}
	sid = "OVNI"
	size, main, affil, hidden = 3, 2, 1, 0
	result = CombineOrgData(org, orgDataFromGroup, sid, size, main, affil, hidden)
	
	expected = ValidStmtArgs {
		Archetype:      `Organization`,
		Charter:        `<p>Page Under Construction. Please check back soon!</p>`,
		Commitment:     `Regular`,
		CustomIcon:     int8(1),
		FocusPrimary:   `Trading`,
		FocusSecondary: `Resources`,
		Headline:       `N’hésite pas à rejoindre l’Elite des Baroudeurs de l’Espace !\nForum en préparation.\nActivation du discord le 7 octobre 2947.`,
		History:        `<p>En 2947, les plus valeureux pilotes de la Galaxie d\u00e9cid\u00e8rent de se regrouper pour former une organisation polyvalente.<br />\nAdepte du professionnalisme ; elle f\u00fbt tr\u00e8s vite reconnue au sein de l\u2019UEE et pris\u00e9e par tous les marchands de la galaxie pour ces prix attractifs et \u00e7a perspicacit\u00e9. </p>`,
		IconURL:        `http://robertsspaceindustries.com/media/gdnha6gjtp5y2r/logo/OVNI-Logo.png`,
		Language:       `French`,
		Manifesto:      `<p>Page Under Construction. Please check back soon!</p>`,
		Name:           `L’Ordre des Vétérans Navigateurs Interstellaire`,
		Recruitment:    true,
		Roleplay:       true,
		Size:           3,
		SizeMain:       2,
		SizeAffil:      1,
		SizeHidden:     0,
		SpectrumID:     `OVNI`,
	}
	if expected != result {
		t.Error()
	}
	
	org.Logo              = `http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/pmc.jpg`
	orgDataFromGroup.Logo = `http://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/pmc.jpg`
	result = CombineOrgData(org, orgDataFromGroup, sid, size, main, affil, hidden)
	expected.IconURL      = ""
	expected.CustomIcon   = int8(0)
	if expected != result {
		t.Error()
	}
	
}
