/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "testing"

func TestCalculateGrowth(t *testing.T) {
	var growthRate float32
	var expected   float32
	var err        error
	var sid        string = "mockSID"//placeholder
	var scrapes    []Scrape
	var scr        Scrape
	
	scrapes = make([]Scrape, 0)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err == nil {
		t.Error("Growth fails to check preconditions")
	}
	
	//1 day
	expected = 0.0
	scrapes = make([]Scrape, 0)
	scr.size    = 1
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//2 days, growth of 1
	expected = 1.0
	scrapes = make([]Scrape, 0)
	scr.size    = 2
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	scr.size    = 1
	scr.daysAgo = 1
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//2 days, growth of 1, reverse order
	expected = 1.0
	scrapes = make([]Scrape, 0)
	scr.size    = 1
	scr.daysAgo = 1
	scrapes = append(scrapes, scr)
	scr.size    = 2
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//2 days, growth of -1
	expected = -1.0
	scrapes = make([]Scrape, 0)
	scr.size    = 1
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	scr.size    = 2
	scr.daysAgo = 1
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//2 days, growth of 0
	expected = 0.0
	scrapes = make([]Scrape, 0)
	scr.size    = 1
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	scr.size    = 1
	scr.daysAgo = 1
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//5 days, net growth of 1
	expected = 1.0
	scrapes = make([]Scrape, 0)
	scr.size    = 5
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	scr.size    = 6
	scr.daysAgo = 1
	scrapes = append(scrapes, scr)
	scr.size    = 3
	scr.daysAgo = 2
	scrapes = append(scrapes, scr)
	scr.size    = 5
	scr.daysAgo = 3
	scrapes = append(scrapes, scr)
	scr.size    = 4
	scr.daysAgo = 4
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//6 recent days interpolated, net growth of 1
	expected = 1.0
	scrapes = make([]Scrape, 0)
	scr.size    = 5
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	scr.size    = 4
	scr.daysAgo = 1
	scrapes = append(scrapes, scr)
	scr.size    = 4
	scr.daysAgo = 5
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//15 days interpolated, net growth of 1
	expected = 1.0
	scrapes = make([]Scrape, 0)
	scr.size    = 5
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	scr.size    = 4
	scr.daysAgo = 1
	scrapes = append(scrapes, scr)
	scr.size    = 4
	scr.daysAgo = 14
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//15 days interpolated using old date, net growth of 1
	expected = 1.0
	scrapes = make([]Scrape, 0)
	scr.size    = 5
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	scr.size    = 4
	scr.daysAgo = 14
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//10 days, net growth of -2 over last 7, but other days totally different
	expected = -2.0
	scrapes = make([]Scrape, 0)
	scr.size    = 5
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	scr.size    = 13
	scr.daysAgo = 1
	scrapes = append(scrapes, scr)
	scr.size    = 12
	scr.daysAgo = 2
	scrapes = append(scrapes, scr)
	scr.size    = 11
	scr.daysAgo = 3
	scrapes = append(scrapes, scr)
	scr.size    = 10
	scr.daysAgo = 4
	scrapes = append(scrapes, scr)
	scr.size    = 9
	scr.daysAgo = 5
	scrapes = append(scrapes, scr)
	scr.size    = 8
	scr.daysAgo = 6
	scrapes = append(scrapes, scr)
	scr.size    = 7
	scr.daysAgo = 7
	scrapes = append(scrapes, scr)
	scr.size    = 6
	scr.daysAgo = 8
	scrapes = append(scrapes, scr)
	scr.size    = 5
	scr.daysAgo = 8
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//10 days, net growth of -2, other days totally different and out of order
	expected = -2.0
	scrapes = make([]Scrape, 0)
	
	scr.size    = 5
	scr.daysAgo = 8
	scrapes = append(scrapes, scr)
	scr.size    = 13
	scr.daysAgo = 1
	scrapes = append(scrapes, scr)
	scr.size    = 12
	scr.daysAgo = 2
	scrapes = append(scrapes, scr)
	scr.size    = 11
	scr.daysAgo = 3
	scrapes = append(scrapes, scr)
	scr.size    = 10
	scr.daysAgo = 4
	scrapes = append(scrapes, scr)
	scr.size    = 9
	scr.daysAgo = 5
	scrapes = append(scrapes, scr)
	scr.size    = 8
	scr.daysAgo = 6
	scrapes = append(scrapes, scr)
	scr.size    = 7
	scr.daysAgo = 7
	scrapes = append(scrapes, scr)
	scr.size    = 6
	scr.daysAgo = 8
	scrapes = append(scrapes, scr)
	scr.size    = 5
	scr.daysAgo = 0
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//2 days, only old data
	expected = 0.0
	scrapes = make([]Scrape, 0)
	scr.size    = 4
	scr.daysAgo = 8
	scrapes = append(scrapes, scr)
	scr.size    = 1
	scr.daysAgo = 15
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
	
	//2 days, only old data, but newer than default
	expected = 0.0
	scrapes = make([]Scrape, 0)
	scr.size    = 4
	scr.daysAgo = 8
	scrapes = append(scrapes, scr)
	scr.size    = 1
	scr.daysAgo = 9
	scrapes = append(scrapes, scr)
	growthRate, err = CalculateGrowth(scrapes, sid)
	if err != nil {
		t.Error( err.Error() )
	}
	if growthRate != expected {
		t.Errorf("Growth expected %f, but got %f", expected, growthRate)
	}
}
