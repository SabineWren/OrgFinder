/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "encoding/json"
import   "errors"
import   "html"
import   "os"
import   "os/exec"
import   "strconv"

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

func getApiPath() string {
	pathToApi, err := os.Getwd()
	checkError(err)
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
	
	return resultContainer.Data, nil
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
	
	return []byte( html.UnescapeString(string(apiResult)) )
}
