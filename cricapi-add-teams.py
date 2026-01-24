import requests
import json

api_key = "4169fd56-6b03-45c5-a225-b38ddfe877ec"
series_ids = set([])

teamCodes = {
  "Chennai Super Kings": {
    "fullName": "Chennai Super Kings",
    "shortName": "CSK",
    "colorCode": "#FFB81C",
    "colorDescription": "Yellow and black"
  },
  "Delhi Capitals": {
    "fullName": "Delhi Capitals",
    "shortName": "DC",
    "colorCode": "#1C3879",
    "colorDescription": "Blue and red"
  },
  "Gujarat Titans": {
    "fullName": "Gujarat Titans",
    "shortName": "GT",
    "colorCode": "#00B5E2",
    "colorDescription": "Blue and yellow"
  },
  "Kolkata Knight Riders": {
    "fullName": "Kolkata Knight Riders",
    "shortName": "KKR",
    "colorCode": "#4E1C4C",
    "colorDescription": "Purple and gold"
  },
  "Lucknow Super Giants": {
    "fullName": "Lucknow Super Giants",
    "shortName": "LSG",
    "colorCode": "#1E7D1E",
    "colorDescription": "Green and gold"
  },
  "Mumbai Indians": {
    "fullName": "Mumbai Indians",
    "shortName": "MI",
    "colorCode": "#007BB6",
    "colorDescription": "Blue and gold"
  },
  "Punjab Kings": {
    "fullName": "Punjab Kings",
    "shortName": "PBKS",
    "colorCode": "#E30022",
    "colorDescription": "Red and white"
  },
  "Rajasthan Royals": {
    "fullName": "Rajasthan Royals",
    "shortName": "RR",
    "colorCode": "#3A4E9B",
    "colorDescription": "Blue and pink"
  },
  "Royal Challengers Bengaluru": {
    "fullName": "Royal Challengers Bengaluru",
    "shortName": "RCB",
    "colorCode": "#C8102E",
    "colorDescription": "Red and black"
  },
  "Sunrisers Hyderabad": {
    "fullName": "Sunrisers Hyderabad",
    "shortName": "SRH",
    "colorCode": "#FF6A13",
    "colorDescription": "Orange and black"
  },
  "Tbc": {
    "fullName": "Tbc",
    "shortName": "TBC",
    "colorCode": "#D9D9D9",
    "colorDescription": "No color code available"
  },
  "Afghanistan": {
    "fullName": "Afghanistan",
    "shortName": "AFG",
    "colorCode": "#D20000",
    "colorDescription": "Red and white"
  },
  "India": {
    "fullName": "India",
    "shortName": "IND",
    "colorCode": "#0066B1",
    "colorDescription": "Blue"
  },
  "Australia": {
    "fullName": "Australia",
    "shortName": "AUS",
    "colorCode": "#A7C636",
    "colorDescription": "Yellow and green"
  },
  "Bangladesh": {
    "fullName": "Bangladesh",
    "shortName": "BAN",
    "colorCode": "#006747",
    "colorDescription": "Green and red"
  },
  "England": {
    "fullName": "England",
    "shortName": "ENG",
    "colorCode": "#E30613",
    "colorDescription": "Red and blue"
  },
  "South Africa": {
    "fullName": "South Africa",
    "shortName": "RSA",
    "colorCode": "#007A33",
    "colorDescription": "Green and gold"
  },
  "United States": {
    "fullName": "United States",
    "shortName": "USA",
    "colorCode": "#B22234",
    "colorDescription": "Red, white, and blue"
  },
  "West Indies": {
    "fullName": "West Indies",
    "shortName": "WI",
    "colorCode": "#6600CC",
    "colorDescription": "Maroon and yellow"
  },
  "Pakistan": {
    "fullName": "Pakistan",
    "shortName": "PAK",
    "colorCode": "#006B3F",
    "colorDescription": "Green"
  },
  "Canada": {
    "fullName": "Canada",
    "shortName": "CAN",
    "colorCode": "#D91D2A",
    "colorDescription": "Red"
  },
  "Oman": {
    "fullName": "Oman",
    "shortName": "OMAN",
    "colorCode": "#F9A800",
    "colorDescription": "Orange and white"
  },
  "Scotland": {
    "fullName": "Scotland",
    "shortName": "SCO",
    "colorCode": "#006F8E",
    "colorDescription": "Navy blue"
  },
  "Nepal": {
    "fullName": "Nepal",
    "shortName": "NEP",
    "colorCode": "#D10F3E",
    "colorDescription": "Red and blue"
  },
  "Sri Lanka": {
    "fullName": "Sri Lanka",
    "shortName": "SL",
    "colorCode": "#FFD700",
    "colorDescription": "Yellow and blue"
  },
  "Papua New Guinea": {
    "fullName": "Papua New Guinea",
    "shortName": "PNG",
    "colorCode": "#E4002B",
    "colorDescription": "Red and yellow"
  },
  "Ireland": {
    "fullName": "Ireland",
    "shortName": "IRE",
    "colorCode": "#169B62",
    "colorDescription": "Green"
  },
  "New Zealand": {
    "fullName": "New Zealand",
    "shortName": "NZ",
    "colorCode": "#000000",
    "colorDescription": "Black"
  },
  "Uganda": {
    "fullName": "Uganda",
    "shortName": "UGA",
    "colorCode": "#F5A900",
    "colorDescription": "Yellow and red"
  },
  "Namibia": {
    "fullName": "Namibia",
    "shortName": "NAM",
    "colorCode": "#006B8E",
    "colorDescription": "Blue and yellow"
  },
  "Netherlands": {
    "fullName": "Netherlands",
    "shortName": "NED",
    "colorCode": "#FF5A00",
    "colorDescription": "Orange"
  },
  "Mumbai Indians Women": {
    "fullName": "Mumbai Indians Women",
    "shortName": "MIW",
    "colorCode": "#007BB6",
    "colorDescription": "Blue and gold"
  },
  "Royal Challengers Bengaluru Women": {
    "fullName": "Royal Challengers Bengaluru Women",
    "shortName": "RCBW",
    "colorCode": "#C8102E",
    "colorDescription": "Red and black"
  },
  "Gujarat Giants Women": {
    "fullName": "Gujarat Giants Women",
    "shortName": "GGW",
    "colorCode": "#00B5E2",
    "colorDescription": "Blue and yellow"
  },
  "Delhi Capitals Women": {
    "fullName": "Delhi Capitals Women",
    "shortName": "DCW",
    "colorCode": "#1C3879",
    "colorDescription": "Blue and red"
  },
  "UP Warriorz Women": {
    "fullName": "UP Warriorz Women",
    "shortName": "UPW",
    "colorCode": "#7C3A4D",
    "colorDescription": "Maroon and gold"
  },
  "Los Angeles Knight Riders": {
    "fullName": "Los Angeles Knight Riders",
    "shortName": "LAKR",
    "colorCode": "#3b1c4d",
    "colorDescription": "Purple and gold"
  },
  "MI New York": {
    "fullName": "MI New York",
    "shortName": "MINY",
    "colorCode": "#0000B1",
    "colorDescription": "Blue and gold"
  },
  "San Francisco Unicorns": {
    "fullName": "San Francisco Unicorns",
    "shortName": "SFU",
    "colorCode": "#1E2952",
    "colorDescription": "Orange and blue"
  },
  "Seattle Orcas": {
    "fullName": "Seattle Orcas",
    "shortName": "SEO",
    "colorCode": "#AEFF07",
    "colorDescription": "Black, white, light green, and orange"
  },
  "Texas Super Kings": {
    "fullName": "Texas Super Kings",
    "shortName": "TSK",
    "colorCode": "#FFB81C",
    "colorDescription": "Yellow and black"
  },
  "Washington Freedom": {
    "fullName": "Washington Freedom",
    "shortName": "WF",
    "colorCode": "#000028",
    "colorDescription": "Red, white, and blue"
  },
  "Zimbabwe": {
    "fullName": "Zimbabwe",
    "shortName": "ZIM",
    "colorCode": "#007749",
    "colorDescription": "Green and yellow"
  },
  "United Arab Emirates": {
    "fullName": "United Arab Emirates",
    "shortName": "UAE",
    "colorCode": "#FF0000",
    "colorDescription": "Red, green, black and white"
  },
  "United States Of America": {
    "fullName": "United States Of America",
    "shortName": "USA",
    "colorCode": "#B22234",
    "colorDescription": "Red, white, and blue"
  },
  "Italy": {
    "fullName": "Italy",
    "shortName": "ITA",
    "colorCode": "#008C45",
    "colorDescription": "Green, white, and red"
  }
}

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

if __name__ == "__main__":
    if api_key == "":
        print("Please add API key from https://cricketdata.org/")
        exit()
        
    getCurrentSeries()
    series_id = input("\nEnter series id to be loaded: ")
    
    if series_id not in series_ids:
        print("Invalid series id", series_id, series_ids)
        exit() 
        
    matches_response = getMatchesInSeries(series_id)

    tournamentTeams = set([])
    for match in matches_response["data"]["matchList"]:
        tournamentTeams.add(match["teams"][0])
        tournamentTeams.add(match["teams"][1])

    teamNamesAvailable = True
    for team in tournamentTeams:
        if team not in teamCodes:
            print(team, "team code is missing. Add team code on line 7 and add logo in frontend resources")
            teamNamesAvailable = False
            
    if not teamNamesAvailable:
        exit()
        
    for team in tournamentTeams:
        payload = teamCodes[team]
        print(payload)
        addTeam(payload)
    
    print("All teams loaded")
