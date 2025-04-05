import requests
import json

api_key = ""
series_ids = set([])

teamCodes = {
  "Chennai Super Kings": {
    "fullName": "Chennai Super Kings",
    "shortName": "CSK",
    "colorCode": "#FFB81C"  # Yellow and black
  },
  "Delhi Capitals": {
    "fullName": "Delhi Capitals",
    "shortName": "DC",
    "colorCode": "#1C3879"  # Blue and red
  },
  "Gujarat Titans": {
    "fullName": "Gujarat Titans",
    "shortName": "GT",
    "colorCode": "#00B5E2"  # Blue and yellow
  },
  "Kolkata Knight Riders": {
    "fullName": "Kolkata Knight Riders",
    "shortName": "KKR",
    "colorCode": "#4E1C4C"  # Purple and gold
  },
  "Lucknow Super Giants": {
    "fullName": "Lucknow Super Giants",
    "shortName": "LSG",
    "colorCode": "#1E7D1E"  # Green and gold
  },
  "Mumbai Indians": {
    "fullName": "Mumbai Indians",
    "shortName": "MI",
    "colorCode": "#007BB6"  # Blue and gold
  },
  "Punjab Kings": {
    "fullName": "Punjab Kings",
    "shortName": "PBKS",
    "colorCode": "#E30022"  # Red and white
  },
  "Rajasthan Royals": {
    "fullName": "Rajasthan Royals",
    "shortName": "RR",
    "colorCode": "#3A4E9B"  # Blue and pink
  },
  "Royal Challengers Bengaluru": {
    "fullName": "Royal Challengers Bengaluru",
    "shortName": "RCB",
    "colorCode": "#C8102E"  # Red and black
  },
  "Sunrisers Hyderabad": {
    "fullName": "Sunrisers Hyderabad",
    "shortName": "SRH",
    "colorCode": "#FF6A13"  # Orange and black
  },
  "Tbc": {
    "fullName": "Tbc",
    "shortName": "TBC",
    "colorCode": ""  # No color code available
  },
  "Afghanistan": {
    "fullName": "Afghanistan",
    "shortName": "AFG",
    "colorCode": "#D20000"  # Afghanistan's national cricket team uses red and white
  },
  "India": {
    "fullName": "India",
    "shortName": "IND",
    "colorCode": "#0066B1"  # India's cricket team is known for blue
  },
  "Australia": {
    "fullName": "Australia",
    "shortName": "AUS",
    "colorCode": "#A7C636"  # Australia's cricket team uses yellow and green
  },
  "Bangladesh": {
    "fullName": "Bangladesh",
    "shortName": "BAN",
    "colorCode": "#006747"  # Bangladesh's national cricket team is associated with green and red
  },
  "England": {
    "fullName": "England",
    "shortName": "ENG",
    "colorCode": "#E30613"  # England's national cricket team uses red and blue
  },
  "South Africa": {
    "fullName": "South Africa",
    "shortName": "RSA",
    "colorCode": "#007A33"  # South Africa's team colors are green and gold
  },
  "United States": {
    "fullName": "United States",
    "shortName": "USA",
    "colorCode": "#B22234"  # United States cricket team commonly uses red, white, and blue
  },
  "West Indies": {
    "fullName": "West Indies",
    "shortName": "WI",
    "colorCode": "#6600CC"  # West Indies cricket team is known for maroon and yellow
  },
  "Pakistan": {
    "fullName": "Pakistan",
    "shortName": "PAK",
    "colorCode": "#006B3F"  # Pakistan's team uses green
  },
  "Canada": {
    "fullName": "Canada",
    "shortName": "CAN",
    "colorCode": "#D91D2A"  # Canada's team commonly uses red
  },
  "Oman": {
    "fullName": "Oman",
    "shortName": "OMAN",
    "colorCode": "#F9A800"  # Oman's cricket team uses orange and white
  },
  "Scotland": {
    "fullName": "Scotland",
    "shortName": "SCO",
    "colorCode": "#006F8E"  # Scotland's team is associated with navy blue
  },
  "Nepal": {
    "fullName": "Nepal",
    "shortName": "NEP",
    "colorCode": "#D10F3E"  # Nepal's national cricket team uses red and blue
  },
  "Sri Lanka": {
    "fullName": "Sri Lanka",
    "shortName": "SL",
    "colorCode": "#FFD700"  # Sri Lanka's cricket team uses yellow and blue
  },
  "Papua New Guinea": {
    "fullName": "Papua New Guinea",
    "shortName": "PNG",
    "colorCode": "#E4002B"  # PNG's cricket team uses red and yellow
  },
  "Ireland": {
    "fullName": "Ireland",
    "shortName": "IRE",
    "colorCode": "#169B62"  # Ireland's cricket team uses green
  },
  "New Zealand": {
    "fullName": "New Zealand",
    "shortName": "NZ",
    "colorCode": "#000000"  # New Zealand's national cricket team is associated with black
  },
  "Uganda": {
    "fullName": "Uganda",
    "shortName": "UGA",
    "colorCode": "#F5A900"  # Uganda's national cricket team uses yellow and red
  },
  "Namibia": {
    "fullName": "Namibia",
    "shortName": "NAM",
    "colorCode": "#006B8E"  # Namibia's cricket team uses blue and yellow
  },
  "Netherlands": {
    "fullName": "Netherlands",
    "shortName": "NED",
    "colorCode": "#FF5A00"  # Netherlands cricket team uses orange
  },
  
  "Mumbai Indians Women": {
    "fullName": "Mumbai Indians Women",
    "shortName": "MIW",
    "colorCode": "#007BB6"  # Blue and gold (similar to Mumbai Indians men’s team)
  },
  "Royal Challengers Bengaluru Women": {
    "fullName": "Royal Challengers Bengaluru Women",
    "shortName": "RCBW",
    "colorCode": "#C8102E"  # Red and black (similar to Royal Challengers Bengaluru men’s team)
  },
  "Gujarat Giants Women": {
    "fullName": "Gujarat Giants Women",
    "shortName": "GGW",
    "colorCode": "#00B5E2"  # Blue and yellow (similar to Gujarat Titans men’s team)
  },
  "Delhi Capitals Women": {
    "fullName": "Delhi Capitals Women",
    "shortName": "DCW",
    "colorCode": "#1C3879"  # Blue and red (similar to Delhi Capitals men’s team)
  },
  "UP Warriorz Women": {
    "fullName": "UP Warriorz Women",
    "shortName": "UPW",
    "colorCode": "#7C3A4D"  # Maroon and gold
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
            print(team, "team code is missing. Add logo in frontend resources")
            teamNamesAvailable = False
            
    if not teamNamesAvailable:
        exit()
        
    for team in tournamentTeams:
        payload = teamCodes[team]
        print(payload)
        # addTeam(payload)
        