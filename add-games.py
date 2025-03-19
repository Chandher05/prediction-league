import pandas as pd
import requests
import json

r = requests.get('http://localhost:8000/teams/all')
teams = json.loads(r.text)

def getTeamId(teamName):
	for obj in teams:
		if obj['fullName'] == teamName:
			return obj['teamId']
	print(teamName, "not found")

def setTeams(row):
	arr = row['Match'].split(" vs ")
	# print(arr)
	row['Team 1'] = getTeamId(arr[0])
	row['Team 2'] = getTeamId(arr[1])
	return row

def getStartTime(row):
	arr = row['Month']
	month = "03"
	if arr == "Apr":
		month = "04"
	elif arr == "May":
		month = "05"

	date = str(row['Date'])
	if len(date) == 1:
		date = "0" + date
	time = "14:00"
	if row['Time (IST)'] == "15:30":
		time = "10:00"

	row['Start Time'] = "2025-" + month + "-" + date + "T" + time + ":00.000Z"
	return row

def updateDB(row):
	body = {
		'gameNumber': row['No'],
		'team1': row['Team 1'],
		'team2': row['Team 2'],
		'startTime': row['Start Time'],
	}
	print(body)
	r = requests.post('http://localhost:8000/game/add', data=body)
	print (r.text, row['No'])

df = pd.read_csv("ipl 2025.csv")

df['Team 1'] = ""
df['Team 2'] = ""
df = df.apply(lambda x: setTeams(x), axis='columns')

df['Start Time'] = ""
df = df.apply(lambda x: getStartTime(x), axis='columns')

# df['Match No'] = df['Match No'] + 100

df = df[['No', 'Team 1', 'Team 2', 'Start Time']]
print (df)

df.apply(lambda x: updateDB(x), axis='columns')