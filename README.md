# prediction-league

Prediction League is a project that we have built to run a league along side a event. To get people to predict who will a particular match in a tournament. 


Frontend - Using React and Chakra UI
Backend - NodeJs and MongoDB 

The project is to make it entertaining to follow a league by having to fight it out in a league who got the most games right and with how much confidence 


Frontend ENV
```
REACT_APP_PUBLIC_URL=https://prediction-league.netlify.app/
REACT_APP_API_BE=https://prediction-league-production.up.railway.app/
REACT_APP_ADMIN_PASSWORD=
```

Backend ENV
```
MONGODB_URL=
PORT=8000
```

1. Create database on atlas
2. Add teams using add-teams.py
3. Sample CSV
```
No,Date,Month,Match,Time (IST)
22,8,Apr,Chennai Super Kings vs Kolkata Knight Riders,19:30
23,9,Apr,Punjab Kings vs Sunrisers Hyderabad,19:30
```
4. Add games using add-games.py
