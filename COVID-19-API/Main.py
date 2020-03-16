import bs4
import requests

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
totalRecovered = ''
for i in cases:
    if i.isdigit():
        refinedCases  = refinedCases + i

print(f"Total number of cases of COVID-19: {totalCases}")
print(f"Total number of deaths of COVID-19: {totalDeaths}")
print(f"Total number of recovered cases of COVID-19: {totalRecovered}")
