/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "database/sql"
import   "encoding/json"
import   "errors"
import   "fmt"
import _ "github.com/go-sql-driver/mysql"
import   "os"
import   "os/exec"
import   "strconv"
import   "strings"
import   "time"

type resultOrgsGroup    struct {
	Data []orgInGroup
}
/* orgInGroup.Logo has url ending in avatar/<sid>.<png/jpg>
 * inner query returns logo/ <sid>.<png/jpg>
 * the logo/ link has a higher quality image
 * however, we use avatar/ so it's easier to check if it changed
**/
type orgInGroup struct {
	Lang         string//inner query always has null lang on live results
	Logo         string//used for image file checking
	Member_count string//not guaranteed to be correct
	Sid          string//Converted to uppercase before inserting
}


type resultOrgContainer struct {
	Data resultOrg
}
type resultOrg struct {
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

type validStmtArgs struct {
	archetype      string
	charter        string
	commitment     string
	customIcon     int8//MySQL boolean aliases to TINYINT
	focusPrimary   string
	focusSecondary string
	growthRate     int
	headline       string
	history        string
	iconURL        string
	language       string
	manifesto      string
	name           string
	recruitment    bool//for conditional logic
	roleplay       bool//for conditional logic
	size           int
	sizeMain       int
	sizeAffil      int
	sizeHidden     int
	spectrumID     string
}

func main(){
	var username, dbname, dbpassword string = parseArgs( os.Args[1:] )
	var db *sql.DB
	var err error
	db, err = sql.Open("mysql", username + ":" + dbpassword + "@/" + dbname)
	checkError(err)
	defer db.Close()
	
	var pathToApi string = getApiPath()
	
	var stmtInsertHistory *sql.Stmt
	stmtInsertHistory, err = db.Prepare("INSERT INTO tbl_OrgMemberHistory (Organization, ScrapeDate, Size, Main, Affiliate, Hidden) VALUES (?, CURDATE(), ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ScrapeDate = CURDATE(), Size = ?, Main = ?, Affiliate = ?, Hidden = ?")
	checkError(err)
	defer stmtInsertHistory.Close()
	
	var stmtSelHistory *sql.Stmt
	stmtSelHistory, err = db.Prepare("SELECT Size, Main, Affiliate, Hidden FROM tbl_OrgMemberHistory WHERE Organization = ? ORDER BY ScrapeDate DESC LIMIT 1")
	checkError(err)
	defer stmtSelHistory.Close()
	
	var stmtSelIconURL *sql.Stmt
	stmtSelIconURL, err = db.Prepare("SELECT Icon FROM tbl_IconURLs WHERE Organization = ?")
	checkError(err)
	defer stmtSelIconURL.Close()
	
	var stmtSelRecent *sql.Stmt
	stmtSelRecent, err = db.Prepare("SELECT Size, DATEDIFF( CURDATE(), ScrapeDate ) as DaysAgo FROM tbl_OrgMemberHistory WHERE Organization = ? ORDER BY ScrapeDate DESC LIMIT 8")
	checkError(err)
	defer stmtSelRecent.Close()
	
	var stmtUpdateGrowth *sql.Stmt
	stmtUpdateGrowth, err = db.Prepare("UPDATE tbl_Organizations SET GrowthRate = ? WHERE SID = ?")
	checkError(err)
	defer stmtUpdateGrowth.Close()
	
	// OUTER LOOP (query all orgs):
	var networkBackoff float64 = 1.0
	for orgPage := int(1); ; orgPage++ {
		var groupQuery     string = makeGroupQueryString(orgPage)
		var groupResultRaw []byte = queryApi(pathToApi, groupQuery)
		var groupResult resultOrgsGroup
		json.Unmarshal(groupResultRaw, &groupResult)
		
		if groupResult.Data == nil {
			time.Sleep( time.Second * time.Duration(networkBackoff) )
			if networkBackoff > 300 {
				fmt.Println( "backoff limit reached at api page: " + strconv.FormatFloat(networkBackoff, 'E', 2, 64) )
				break
			}
			networkBackoff *= 4.0
			orgPage--
			continue
		}
		networkBackoff = 1.0
		
		//INNER LOOP (query one Org):
		for _, orgDataFromGroup := range groupResult.Data {
			var sid             string = strings.ToUpper(orgDataFromGroup.Sid)
			var expectedSize    int
			expectedSize, err = strconv.Atoi(orgDataFromGroup.Member_count)
			checkError(err)
			
			var size, main, affil, hidden int
			var previouslySavedIcon       string
			size, main, affil, hidden, previouslySavedIcon = selectOrganization(sid, stmtSelHistory, stmtSelIconURL)
			
			if size != expectedSize || previouslySavedIcon != "" && previouslySavedIcon != orgDataFromGroup.Logo {
				size, main, affil, hidden, err = queryMembers(sid, expectedSize, db, pathToApi)
				if err != nil {
					fmt.Println( err.Error() )
					continue
				}
				
				var org resultOrg
				org, err = queryOrg(sid, pathToApi)
				if err != nil {
					fmt.Println( err.Error() )
					continue
				}
				
				stmtArgsOrgResult := assignArgsOrgResult(org, orgDataFromGroup, sid, size, main, affil, hidden)
				err = insertOrg(stmtArgsOrgResult, db)
				checkError(err)
				
				if stmtArgsOrgResult.customIcon == int8(1) && previouslySavedIcon != orgDataFromGroup.Logo {
					err = DownloadIcon(sid, orgDataFromGroup.Logo)
					checkError(err)
				}
			}
			
			_, err := stmtInsertHistory.Exec(sid, size, main, affil, hidden, size, main, affil, hidden)
			checkError(err)
			
			err = updateGrowthRate(sid, stmtSelRecent, stmtUpdateGrowth)
			checkError(err)
		}
	}
	err = ReclusterTables(db)
	checkError(err)
}

func assignArgsOrgResult(org resultOrg, orgDataFromGroup orgInGroup, sid string, size int, main int, affil int, hidden int) validStmtArgs {
	var stmtArgs validStmtArgs
	
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
	switch org.Logo {
	case urlOrganization, urlCorporation, urlPMC, urlFaith, urlSyndicate:
		stmtArgs.customIcon = int8(0)
		stmtArgs.iconURL    = ""
	default:
		stmtArgs.customIcon = int8(1)
		stmtArgs.iconURL    = orgDataFromGroup.Logo
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

func checkError(err error) {
	if err != nil {
		fmt.Println(err)
		panic(err)//POSSIBLY TEMPORARY -- SHOULD MAKE BETTER ERROR HANDLING
	}
}

func executeStatements(stmts map[string]*sql.Stmt, a validStmtArgs) error {
	var err error
	
	_, err = stmts["InsOrg"].Exec(a.spectrumID, a.name, a.size, a.sizeMain, a.customIcon, a.name, a.size, a.sizeMain, a.customIcon)
	checkError(err)
	
	_, err = stmts["InsDate"].Exec(a.spectrumID, a.size, a.sizeMain, a.sizeAffil, a.sizeHidden, a.size, a.sizeMain, a.sizeAffil, a.sizeHidden)
	checkError(err)
	
	if a.iconURL != "" {
		_, err = stmts["InsIconURL"].Exec(a.spectrumID, a.iconURL, a.iconURL)
		checkError(err)
	}
	
	_, err = stmts["InsCommitment"].Exec(a.spectrumID, a.commitment, a.commitment)
	checkError(err)
	
	if a.recruitment {
		_, err = stmts["InsFull"].Exec(a.spectrumID, a.spectrumID)
		checkError(err)
	} else {
		_, err = stmts["DelFull"].Exec(a.spectrumID)
		checkError(err)
	}
	
	_, err = stmts["InsFocusPrimary"].Exec(a.focusPrimary, a.spectrumID, a.focusPrimary)
	checkError(err)
	_, err = stmts["InsFocusSecondary"].Exec(a.focusSecondary, a.spectrumID, a.focusSecondary)
	checkError(err)
	_, err = stmts["InsFocusBoth"].Exec(a.focusPrimary, a.focusSecondary, a.spectrumID, a.focusPrimary, a.focusSecondary)
	checkError(err)
	
	_, err = stmts["InsArchetype"].Exec(a.spectrumID, a.archetype, a.archetype)
	checkError(err)
	_, err = stmts["InsArchetypeMatView"].Exec(a.archetype, a.spectrumID, a.archetype)
	checkError(err)
	
	if a.roleplay {
		_, err = stmts["InsRoleplay"].Exec(a.spectrumID, a.spectrumID)
		checkError(err)
	} else {
		_, err = stmts["DelRoleplay"].Exec(a.spectrumID)
		checkError(err)
	}

	_, err = stmts["InsLanguage"].Exec(a.spectrumID, a.language, a.language)
	checkError(err)
	_, err = stmts["InsLanguageMatView"].Exec(a.language, a.spectrumID, a.language)
	checkError(err)
	
	_, err = stmts["InsDescription"].Exec(a.spectrumID, a.headline, a.manifesto, a.headline, a.manifesto)
	return err
}

func getApiPath() string {
	pathToApi, err := os.Getwd()
	checkError(err)
	pathToApi += "/../sc-api-downstream/index.php"
	return pathToApi
}

func insertOrg(stmtArgs validStmtArgs, db *sql.DB) error {
	//use transaction to ensure serial execution on a single DB connection
	tx, err := db.Begin()
	checkError(err)
	
	defer func() {
		r := recover()
		if r != nil {
			tx.Rollback()
			panic(r)
		}
		err = tx.Commit()
		checkError(err)
	}()
	
	var stmts map[string]*sql.Stmt = prepareStatements(tx)
	defer func() {
		for _, v := range stmts {
			v.Close()
		}
	}()
	
	err = executeStatements(stmts, stmtArgs)
	return err
}

func makeGroupQueryString(currentPage int) string {
	var query string
	query  = "api_source=live&system=organizations&action=all_organizations&source=rsi"
	query += "&start_page=" + strconv.Itoa(currentPage)
	query += "&end_page=" + strconv.Itoa(currentPage)
	query += "&items_per_page=1&sort_method=&sort_direction=ascending&expedite=0&format=raw"
	return query
}

func makeMemberQueryString(sid string, currentPage int) string {
	var query string
	query  = "api_source=live&system=organizations&action=organization_members"
	query += "&target_id=" + sid
	query += "&start_page=" + strconv.Itoa(currentPage)
	query += "&end_page=" + strconv.Itoa(currentPage)
	query += "&items_per_page=1&sort_method=&sort_direction=ascending&expedite=0&format=raw"
	return query
}

func makeOrgQueryString(sid string) string {
	var query string
	query  = "api_source=live&system=organizations&action=single_organization&target_id="
	query += sid + "&expedite=0&format=raw"
	return query
}

func parseArgs(args []string) (string, string, string) {
	if len(args) != 3 {
		fmt.Println("Expected three args: username, dbname, and dbpassword. Received:")
		fmt.Println(args)
		os.Exit(1)
	}
	return args[0], args[1], args[2]
}

func prepareStatements( tx *sql.Tx ) ( map[string]*sql.Stmt ) {
	var stmts map[string]*sql.Stmt = make( map[string]*sql.Stmt )
	var err error
	
	defer func() {
		if r := recover(); r != nil {
			for _, v := range stmts {
				v.Close()
			}
			panic(r)
		}
	}()
	
	stmts["InsOrg"], err = tx.Prepare("INSERT INTO tbl_Organizations (SID, Name, Size, Main, CustomIcon) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Name = ?, Size = ?, Main = ?, CustomIcon = ?")
	checkError(err)
	
	stmts["InsDate"], err = tx.Prepare("INSERT INTO tbl_OrgMemberHistory (Organization, ScrapeDate, Size, Main, Affiliate, Hidden) VALUES (?, CURDATE(), ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ScrapeDate = CURDATE(), Size = ?, Main = ?, Affiliate = ?, Hidden = ?")
	checkError(err)
	
	stmts["InsIconURL"], err = tx.Prepare("INSERT INTO tbl_IconURLs(Organization, Icon) VALUES (?, ?) ON DUPLICATE KEY UPDATE Icon = ?")
	checkError(err)
	
	stmts["InsCommitment"], err = tx.Prepare("INSERT INTO tbl_Commits(Organization, Commitment) VALUES (?, ?) ON DUPLICATE KEY UPDATE Commitment = ?")
	checkError(err)
	
	stmts["InsFull"], err = tx.Prepare("INSERT INTO tbl_FullOrgs(Organization) VALUES (?) ON DUPLICATE KEY UPDATE Organization = ?")
	checkError(err)
	stmts["DelFull"], err = tx.Prepare("DELETE from tbl_FullOrgs WHERE Organization = ?")
	checkError(err)
	
	stmts["InsFocusPrimary"], err = tx.Prepare("INSERT INTO tbl_PrimaryFocus  (PrimaryFocus,   Organization) VALUES (?, ?) ON DUPLICATE KEY UPDATE PrimaryFocus = ?")
	checkError(err)
	stmts["InsFocusSecondary"], err = tx.Prepare("INSERT INTO tbl_SecondaryFocus(SecondaryFocus, Organization) VALUES (?, ?) ON DUPLICATE KEY UPDATE SecondaryFocus = ?")
	checkError(err)
	stmts["InsFocusBoth"], err = tx.Prepare("INSERT INTO tbl_Performs(PrimaryFocus, SecondaryFocus, Organization) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE PrimaryFocus = ?, SecondaryFocus = ?")
	checkError(err)
	
	stmts["InsArchetype"], err = tx.Prepare("INSERT INTO tbl_OrgArchetypes(Organization, Archetype) VALUES (?, ?) ON DUPLICATE KEY UPDATE Archetype = ?")
	checkError(err)
	stmts["InsArchetypeMatView"], err = tx.Prepare("INSERT INTO tbl_FilterArchetypes(Archetype, Organization) VALUES (?, ?) ON DUPLICATE KEY UPDATE Archetype = ?")
	checkError(err)
	
	stmts["InsRoleplay"], err = tx.Prepare("INSERT INTO tbl_RolePlayOrgs(Organization) VALUES (?) ON DUPLICATE KEY UPDATE Organization = ?")
	checkError(err)
	stmts["DelRoleplay"], err = tx.Prepare("DELETE from tbl_RolePlayOrgs WHERE Organization = ?")
	checkError(err)
	
	stmts["InsLanguage"], err = tx.Prepare("INSERT INTO tbl_OrgFluencies(Organization, Language) VALUES (?, ?) ON DUPLICATE KEY UPDATE Language = ?")
	checkError(err)
	stmts["InsLanguageMatView"], err = tx.Prepare("INSERT INTO tbl_FilterFluencies(Language, Organization) VALUES (?, ?) ON DUPLICATE KEY UPDATE Language = ?")
	checkError(err)
	
	stmts["InsDescription"], err = tx.Prepare("INSERT INTO tbl_OrgDescription(SID, Headline, Manifesto) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE Headline = ?, Manifesto = ?")
	checkError(err)
	
	return stmts
}

func queryApi(pathToApi string, groupQuery string) []byte {
	var apiResult []byte
	var err       error
	
	apiResult, err = exec.Command("php", pathToApi, groupQuery).Output()
	if err != nil {
		fmt.Println("Error trying to run this command:")
		fmt.Println("php " + pathToApi + " " + groupQuery)
		panic(err)
	}
	
	return apiResult
}

func selectOrganization(sid string, stmtSelHistory *sql.Stmt, stmtSelIconURL *sql.Stmt) (int, int, int, int, string) {
	var size, main, affil, hidden int
	var previouslySavedIcon       string
	var err                       error
	
	err = stmtSelHistory.QueryRow(sid).Scan(&size, &main, &affil, &hidden)
	if err == sql.ErrNoRows {
		size   = 0
		main   = 0
		affil  = 0
		hidden = 0
	} else if err != nil {
		panic(err)
	}
	
	err = stmtSelIconURL.QueryRow(sid).Scan(&previouslySavedIcon)
	if err == sql.ErrNoRows {
		previouslySavedIcon = ""
	} else if err != nil {
		panic(err)
	}
	
	return size, main, affil, hidden, previouslySavedIcon
}

type resultMembersContainer    struct {
	Data []resultMember
}
type resultMember struct {
	Handle     string
	Rank       string
	Stars      int
	Type       string
	Visibility string
}
func queryMembers(sid string, expectedSize int, db *sql.DB, pathToApi string) (int, int, int, int, error) {
	var backoff float64 = 1.0
	var size, main, affil, hidden int = 0, 0, 0, 0
	for currentPage := int(1); ; currentPage++ {
		var query string = makeMemberQueryString(sid, currentPage)
		var pageResultRaw []byte = queryApi(pathToApi, query)
		var resultContainer resultMembersContainer
		json.Unmarshal(pageResultRaw, &resultContainer)
		
		//RSI webpage often has the total size off-by-one
		//However, if a query fails while summing members, we get the wrong size
		//Here we ensure all members are scraped (success) or none (skip org)
		//keep backoff short for the orgs that are off-by-one
		if resultContainer.Data == nil {
			if size == expectedSize { return size, main, affil, hidden, nil }//done
			if backoff > 5.0 {
				if (size+1) == expectedSize { return size, main, affil, hidden, nil }//RSI's off-by-one error
				if (size-1) == expectedSize { return size, main, affil, hidden, nil }//RSI's off-by-one error
				return 0, 0, 0, 0, errors.New("Cannot sum member sizes for SID: " + sid)
			}
			time.Sleep( time.Second * time.Duration(backoff) )
			backoff *= 4.0
			currentPage--
			continue
		}
		
		var currentMember resultMember
		for _, currentMember = range resultContainer.Data{
			size++
			switch currentMember.Visibility {
			case "visible":
				if currentMember.Type == "affiliate" {
					affil++
				} else if currentMember.Type == "main" {
					main++
				}
			case "hidden", "redacted":
				hidden++
			default:
				panic( errors.New("Error -- Member: " + currentMember.Handle + " in org: " + sid + " has unknown type: " + currentMember.Type) )
			}
		}
	}
	return size, main, affil, hidden, nil
}

func queryOrg(sid string, pathToApi string) (resultOrg, error) {
	var orgQuery     string = makeOrgQueryString(sid)
	var orgResultRaw []byte = queryApi(pathToApi, orgQuery)
	var resultContainer resultOrgContainer
	json.Unmarshal(orgResultRaw, &resultContainer)
	
	if resultContainer.Data == (resultOrg{}) {
		//try once more
		time.Sleep(time.Second)
		orgResultRaw = queryApi(pathToApi, orgQuery)
		json.Unmarshal(orgResultRaw, &resultContainer)
		
		if resultContainer.Data == (resultOrg{}) {
			return resultContainer.Data, errors.New("cannot query org: " + sid + " (API returned null)")
		}
	}
	return resultContainer.Data, nil
}

func updateGrowthRate(sid string, stmtSelRecent *sql.Stmt, stmtUpdateGrowth *sql.Stmt) error {
	rows, err := stmtSelRecent.Query(sid)
	checkError(err)
	defer rows.Close()
	
	var scrapes []Scrape = make([]Scrape, 0)
	for rows.Next() {
		var currentScrape Scrape
		err = rows.Scan(&currentScrape.size, &currentScrape.daysAgo)
		checkError(err)
		scrapes = append(scrapes, currentScrape)
	}
	err = rows.Err()
	checkError(err)
	
	growthRate, err := CalculateGrowth(scrapes, sid)
	checkError(err)
	
	_, err = stmtUpdateGrowth.Exec(growthRate, sid)
	return err
}
