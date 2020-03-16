import bs4
import requests
import flask
from flask import request, jsonify
from datetime import datetime

timeObj = datetime.now()

app = flask.Flask(__name__)
app.config["DEBUG"] = True

def getNumber(tag):
    total = ''
    for i in tag:
        if i.isdigit():
            total = total + i
    return int(total)

# Send a request to the website to fetch data
worldometers = requests.get("https://www.worldometers.info/coronavirus/")
responseContent = worldometers.content

# Creating a beautifulSoup object and searching for all html div tags that contain this unique class and style
soupVariable = bs4.BeautifulSoup(responseContent, features="lxml")
divs = soupVariable.findAll("div", {"class": "maincounter-number"}, {"style": "color:#aaa"})

# Separating the count for the total number of cases from the remainder of letters
cases = str(divs[0])
totalCases = getNumber(cases)

# Finding the total number of deaths
divs = soupVariable.findAll("div", {"class": "maincounter-number"})
cases = str(divs[1])
totalDeaths = getNumber(cases)

# Finding the total number of recovered cases
divs = soupVariable.findAll("div", {"class": "maincounter-number"})
cases = str(divs[2])
refinedCases = ''
for i in cases:
    if i.isdigit():
        refinedCases = refinedCases + i
totalRecovered = ''
for i in refinedCases[2::]:
    totalRecovered = totalRecovered + i
totalRecovered = int(totalRecovered)

stats = [
        {"name": "totalCases",
          "stat": totalCases,
          "time": str(timeObj.hour - 12) + ":" + str(timeObj.minute)
        },
         {
            "name": "totalDeaths",
          "stat": totalDeaths,
          "time": str(timeObj.hour - 12) + ":" + str(timeObj.minute)
         },
         {
            "name": "totalRecovered",
          "stat": totalRecovered,
          "time": str(timeObj.hour - 12) + ":" + str(timeObj.minute)
         }
         ]

@app.route('/', methods=['GET'])
def home():
    return "<h1>COVID-19 LIVE UPDATE</h1>"

@app.route('/stats', methods=["GET"])
def api_return():
    return jsonify(stats)

app.run()
