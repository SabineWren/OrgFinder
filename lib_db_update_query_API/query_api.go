/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package lib_db_update_query_API

import   "encoding/json"
import   "errors"
import   "html"
import   "os"
import   "os/exec"
import   "strconv"
import   "strings"

type ResultOrgContainer struct {
	Data ResultOrg
}
type ResultOrg struct {
	Archetype       string
	Banner          string//unused
	Charter         string
	Cover_image     string//unused
	Cover_video     string//unused
	Commitment      string
	Headline        string
	History         string
	Logo            string
	Manifesto       string
	Member_count    string
	Primary_focus   string
	Recruiting      string
	Roleplay        string
	Secondary_focus string
	Title           string
}

func cleanString(in string) string {
	in = html.UnescapeString(in)
	in = strings.Replace(in, `\/`, "/", -1)
	return in
}

func getApiPath() string {
	pathToApi, err := os.Getwd()
	if err != nil { panic(err) }
	pathToApi += "/../sc-api-downstream/index.php"
	return pathToApi
}

func MakeGroupQueryString(currentPage int) string {
	var query string
	query  = "api_source=live&system=organizations&action=all_organizations&source=rsi"
	query += "&start_page=" + strconv.Itoa(currentPage)
	query += "&end_page=" + strconv.Itoa(currentPage)
	query += "&items_per_page=1&sort_method=&sort_direction=ascending&expedite=0&format=raw"
	return query
}

func MakeMemberQueryString(sid string, currentPage int) string {
	var query string
	query  = "api_source=live&system=organizations&action=organization_members"
	query += "&target_id=" + sid
	query += "&start_page=" + strconv.Itoa(currentPage)
	query += "&end_page=" + strconv.Itoa(currentPage)
	query += "&items_per_page=1&sort_method=&sort_direction=ascending&expedite=0&format=raw"
	return query
}

func MakeOrgQueryString(sid string) string {
	var query string
	query  = "api_source=live&system=organizations&action=single_organization&target_id="
	query += sid + "&expedite=0&format=raw"
	return query
}

func ParseQueryOrg(sid string, dataRaw []byte) (ResultOrg, error) {
	var resultContainer ResultOrgContainer
	json.Unmarshal(dataRaw, &resultContainer)
	
	if resultContainer.Data == (ResultOrg{}) {
		return resultContainer.Data, errors.New("query org: " + sid + " returned null")
	}
	
	resultContainer.Data.Archetype       = cleanString(resultContainer.Data.Archetype)
	//resultContainer.Data.Banner          string//unused
	resultContainer.Data.Charter         = cleanString(resultContainer.Data.Charter)
	//resultContainer.Data.Cover_image     string//unused
	//resultContainer.Data.Cover_video     string//unused
	resultContainer.Data.Commitment      = cleanString(resultContainer.Data.Commitment)
	resultContainer.Data.Headline        = cleanString(resultContainer.Data.Headline)
	resultContainer.Data.History         = cleanString(resultContainer.Data.History)
	resultContainer.Data.Logo            = cleanString(resultContainer.Data.Logo)
	resultContainer.Data.Manifesto       = cleanString(resultContainer.Data.Manifesto)
	resultContainer.Data.Member_count    = cleanString(resultContainer.Data.Member_count)
	resultContainer.Data.Primary_focus   = cleanString(resultContainer.Data.Primary_focus)
	resultContainer.Data.Recruiting      = cleanString(resultContainer.Data.Recruiting)
	resultContainer.Data.Roleplay        = cleanString(resultContainer.Data.Roleplay)
	resultContainer.Data.Secondary_focus = cleanString(resultContainer.Data.Secondary_focus)
	resultContainer.Data.Title           = cleanString(resultContainer.Data.Title)
	
	return resultContainer.Data, nil
}

type ResultOrgsGroup struct {
	Data []OrgInGroup
}
/* OrgInGroup.Logo has url ending in avatar/<sid>.<png/jpg>
 * inner query returns logo/ <sid>.<png/jpg>
 * the logo/ link has a higher quality image
 * however, we use avatar/ so it's easier to check if it changed
**/
type OrgInGroup struct {
	Lang         string//inner query always has null lang on live results
	Logo         string//used for image file checking
	Member_count string//not guaranteed to be correct
	Sid          string//Converted to uppercase before inserting
}
func ParseQueryOrgs(groupResultRaw []byte) ([]OrgInGroup, error) {
	var groupResult ResultOrgsGroup
	var err error = json.Unmarshal(groupResultRaw, &groupResult)
	if err != nil {
		panic(err)
	}
	if groupResult.Data == nil {
		return groupResult.Data, errors.New("Org group query returned null")
	}
	
	for k, _ := range groupResult.Data {
		groupResult.Data[k].Lang         = cleanString(groupResult.Data[k].Lang)
		groupResult.Data[k].Logo         = cleanString(groupResult.Data[k].Logo)
		groupResult.Data[k].Member_count = cleanString(groupResult.Data[k].Member_count)
		groupResult.Data[k].Sid          = cleanString(groupResult.Data[k].Sid)
	}
	
	return groupResult.Data, nil
}

func QueryApi(groupQuery string) []byte {
	var apiResult []byte
	var err       error
	var pathToApi string = getApiPath()
	
	apiResult, err = exec.Command("php", pathToApi, groupQuery).Output()
	if err != nil {
		err = errors.New("Error trying to run this command:\n" + "php " + pathToApi + " " + groupQuery + "\n" + err.Error())
		panic(err)
	}
	
	return apiResult
}
