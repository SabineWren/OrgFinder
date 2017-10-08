/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "errors"
import   "io/ioutil"
import   "strconv"
import   "testing"

/******* All Orgs *******/

func compareSlices(expectedSlice, resultSlice []OrgInGroup) bool {
	if len(expectedSlice) != len(resultSlice) { return false }
	
	for k, _ := range expectedSlice {
		if expectedSlice[k] != resultSlice[k] { return false }
	}
	return true
}

func TestQueryOrgs(t * testing.T) {
	var filename string
	var err      error
	var page     int
	
	var resultQuery   string
	var expectedQuery string
	
	var resultRaw   []byte
	var expectedRaw []byte
	
	page = 3
	expectedQuery  = "api_source=live&system=organizations&action=all_organizations&source=rsi"
	expectedQuery += "&start_page=3&end_page=3&items_per_page=1&sort_method=&sort_direction=ascending&expedite=0&format=raw"
	resultQuery    = MakeGroupQueryString(page)
	if resultQuery != expectedQuery { t.Error("wrong query string; see log") }
	
	filename  = "testdata/" + "orgsPage3" + ".json"
	expectedRaw, err  = ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	resultRaw = QueryApi(resultQuery)
	
	var expectedSlice []OrgInGroup
	var resultSlice   []OrgInGroup
	expectedSlice, err = ParseQueryOrgs(expectedRaw)
	if err != nil {
		panic(err)
	}
	resultSlice,   err = ParseQueryOrgs(resultRaw)
	if err != nil {
		panic(err)
	}
	if !compareSlices(expectedSlice, resultSlice) {
		t.Error("slices don't match")
	}
}

/******* Single Org *******/

func compareOrgs(expected, result ResultOrg) (bool, error) {
	if expected == (ResultOrg{}) && result == (ResultOrg{}) { 
		return true, errors.New("expected and result are empty") 
	}
	if expected == (ResultOrg{}) { 
		return false, errors.New("expected is empty") 
	}
	if result   == (ResultOrg{}) { 
		return false, errors.New("result is empty") 
	}
	if expected != result {
		return false, errors.New("expected != result")
	}
	return true, nil
}

func TestQueryOrg(t * testing.T) {
	var filename    string
	var err         error
	var pass        bool
	
	var resultRaw   []byte
	var expectedRaw []byte
	var result      string
	var expected    string
	var resOrg      ResultOrg
	var expOrg      ResultOrg
	
	sids := []string{"OVNI", "SNSANGNIM"}//, "AVOCADO"
	
	for k, sid := range sids {
		filename  = "testdata/" + sid + ".json"
		expectedRaw, err  = ioutil.ReadFile(filename)
		if err != nil {
			panic(err)
		}
		resultRaw = QueryApi(MakeOrgQueryString(sid))
		
		resOrg, err = ParseQueryOrg(sid, resultRaw)
		if err != nil {
			panic(err)
		}
		expOrg, err = ParseQueryOrg(sid, expectedRaw)
		if err != nil {
			panic(err)
		}
		
		pass, err = compareOrgs(expOrg, resOrg)
		if err != nil {
			err1 := ioutil.WriteFile("testdata/logs/expected" + strconv.Itoa(k), []byte(expected), 0644)
			if err1 != nil { panic(err) }
			err1  = ioutil.WriteFile("testdata/logs/result"   + strconv.Itoa(k), []byte(result),   0644)
			if err1 != nil { panic(err) }
			t.Error(err.Error())
		} else if !pass {
			t.Error()
		}
	}
	
	
	var sid string = "SHOSHINSHA"
	filename  = "testdata/" + sid + ".json"
	expectedRaw, err  = ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	resultRaw = QueryApi(MakeOrgQueryString(sid))
	
	resOrg, err = ParseQueryOrg(sid, resultRaw)
	if err == nil {
		t.Error()
	}
	expOrg, err = ParseQueryOrg(sid, expectedRaw)
	if err == nil {
		t.Error()
	}
	pass, err = compareOrgs(expOrg, resOrg)
	if err == nil {
		t.Error()
	}
	if !pass {
		t.Error()
	}
}
