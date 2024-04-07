import requests

url = "http://localhost:8000/teams/add"

teams = [{
  "fullName": "Chennai Super Kings",
  "shortName": "CSK",
  "colorCode": "#FCCA06"
},{
  "fullName": "Delhi Capitals",
  "shortName": "DC",
  "colorCode": "#0078BC"
},{
  "fullName": "Gujarat Titans",
  "shortName": "GT",
  "colorCode": "#1B2133"
},{
  "fullName": "Kolkata Knight Riders",
  "shortName": "KKR",
  "colorCode": "#3A225D"
},{
  "fullName": "Lucknow Super Giants",
  "shortName": "LSG",
  "colorCode": "#0057E2"
},{
  "fullName": "Mumbai Indians",
  "shortName": "MI",
  "colorCode": "#006CB7"
},{
  "fullName": "Punjab Kings",
  "shortName": "PBKS",
  "colorCode": "#DD1F2D"
},{
  "fullName": "Rajasthan Royals",
  "shortName": "RR",
  "colorCode": "#EA1A85"
},{
  "fullName": "Royal Challengers Bangaluru",
  "shortName": "RCB",
  "colorCode": "#84171B"
},{
  "fullName": "Sunrisers Hyderabad",
  "shortName": "SRH",
  "colorCode": "#EE7429"
}]


for payload in teams:
  response = requests.request("POST", url, data=payload)
  print(response.text)
