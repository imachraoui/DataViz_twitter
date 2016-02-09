#######################################################################################################################
#############################FRAUD DETECTION ON SOCIAL MEDIA - MAIN SCRIPT#############################################
#######################################################################################################################

#############################WORKSPACE AND DATA LOADING################################################################

# Importing necessary libraries
import os
import tweepy
import pymongo
import time
import argparse
import string
import json

#Setting up directories (important for running in console)
os.chdir('D:/Users/acombess/Dropbox/ENSAE/Semestre 2/Dataviz/Dataviz-Twitter-Project/2-Code') ###CHANGE THIS
import sys
import os.path
sys.path.insert(0, ".")

db_location="D:/Users/acombess/Database_Twitter_FrenchPolitics/" ###CHANGE THIS

#Importing custom modules
import module_twitterscraping as twscrap
from module_twitterscraping import api

#############################DATA EXPLORATION################################################################

#Get your own timeline
for status in tweepy.Cursor(api[0].home_timeline).items(10):
    # Process a single status
    print(status.text)

#Get your friends
for friend in tweepy.Cursor(api[1].friends).items(10):
    printjson(friend)

#Returns a collection of the most recent Tweets posted by the user indicated by the screen_name or user_id parameters.
for tweet in tweepy.Cursor(api[1].user_timeline).items(10):
    printjson(tweet)

#Search queries - entire json dumps
for tweet in tweepy.Cursor(api[0].search,q='transilien',lang='fr').items(2):
        print(json.dumps(tweet._json))

#Search queries - just the user and tweet text
for tweet in tweepy.Cursor(api[0].search,q='transilien',lang='fr').items(2):
        print(tweet.user.name,tweet.text)

#Get the remaining API calls
search_limit(api[0])
time_search_limit(api[1])

#Efficient way to store results from search queries as a json file in the database location
storejson(tweepy.Cursor(api[1].search,q='transilien',lang='fr'),1000,"test2.json")
os.listdir(db_location)
test=readjson("test2.json")
for tweet in test:
    print(tweet["text"])

#Efficient way to store results from the Twitter Stream for specific queries and languages, and a given time
storetwitterstream(api=api[0],destinationfile="testp2",lang=["en"],query=["#NationalSigningDay"],timelimit=30)
#Function to be adapted (cases of empty lines)
##test2=readjson("testp2.json")
##for tweet in test:
    ##print(tweet["text"])