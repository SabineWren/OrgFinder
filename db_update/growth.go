/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "errors"

type Scrape struct {
	size    int
	daysAgo int
}

func CalculateGrowth(scrapes []Scrape, sid string) (float32, error) {
	if len(scrapes) == 0 {
		return 0.0, errors.New("Error -- Org:" + sid + "has no history, yet it exists in the DB")
	}
	if len(scrapes) == 1 {
		return 0.0, nil
	}
	
	const timespan int = 7// 7 gives weekly growth, 365 yearly, etc.
	
	var oldestScrape Scrape = Scrape{size: 0, daysAgo: 0}
	var newestScrape Scrape = Scrape{size: 0, daysAgo: 10}
	
	for _, currentScrape := range scrapes {
		if currentScrape.daysAgo < newestScrape.daysAgo {
			newestScrape = currentScrape
		}
		if currentScrape.daysAgo >= timespan && currentScrape.daysAgo <= oldestScrape.daysAgo {
			oldestScrape = currentScrape
		}
		if currentScrape.daysAgo > oldestScrape.daysAgo && oldestScrape.daysAgo < timespan {
			oldestScrape = currentScrape
		}
	}
	var growthRate float32 = float32(newestScrape.size - oldestScrape.size)
	return growthRate, nil
}
