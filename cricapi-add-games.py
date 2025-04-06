import requests
import json

api_key = ""
series_ids = set([])

def addTeam(payload):
    url = "http://localhost:8000/teams/add"
    response = requests.request("POST", url, data=payload)
    print(response.text)

def getCurrentSeries():
    url = "https://api.cricapi.com/v1/series?apikey=" + api_key + "&offset=0"
    response = requests.request("GET", url)
    res = json.loads(response.text)
    for series in res["data"]:
        series_ids.add(series["id"])
        print(series["id"], series["name"])
    return res

def getMatchesInSeries(series_id):
    url = "https://api.cricapi.com/v1/series_info?apikey=" + api_key + "&id=" + series_id
    response = requests.request("GET", url)
    return json.loads(response.text)

def getMatchesFromDb():
    r = requests.get('http://localhost:8000/teams/all')
    teams = json.loads(r.text)
    return teams

def getTeamId(teamName, teams):
	for obj in teams:
		if obj['fullName'] == teamName:
			return obj['teamId']
	print(teamName, "not found in database")
 
def addGame(body):
    r = requests.post('http://localhost:8000/game/add', data=body)
    print (r.text)

if __name__ == "__main__":
    if api_key == "":
        print("Please add API key from https://cricketdata.org/")
        exit()
        
    getCurrentSeries()
    series_id = input("\nEnter series id to be loaded: ")
    
    if series_id not in series_ids:
        print("Invalid series id", series_id)
        exit() 
        
    matches_response = getMatchesInSeries(series_id)
    
    teams = getMatchesFromDb()
    teamsAdded = True
    for match in matches_response["data"]["matchList"]:
        team1 = getTeamId(match["teams"][0], teams)
        team2 = getTeamId(match["teams"][1], teams)
        if team1 == None or team2 == None:
            teamsAdded = False
    
    if not teamsAdded:
        exit()
        
    all_matches = {}
    for match in matches_response["data"]["matchList"]:
        team1 = getTeamId(match["teams"][0], teams)
        team2 = getTeamId(match["teams"][1], teams)
        all_matches[match["dateTimeGMT"]] = {
            "team1": team1,
            "team2": team2,
            "startTime": match["dateTimeGMT"] + ".000Z",
            "cricApiMatchId": match["id"]
        }
    
    startTimes = sorted(all_matches.keys())
    
    for index, startTime in enumerate(startTimes):
        payload = all_matches[startTime]
        payload["gameNumber"] = index + 1
        addGame(payload)
    
    print("All matches loaded")
