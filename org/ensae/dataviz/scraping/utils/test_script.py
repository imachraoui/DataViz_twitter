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
#os.chdir('D:/Users/acombess/Dropbox/ENSAE/Semestre 2/Dataviz/Dataviz-Twitter-Project/2-Code') ###CHANGE THIS
os.chdir('C:/Users/wymeka/Documents/ENSAE/DataViz_twitter')
import sys
import os.path
sys.path.insert(0, ".")

#db_location="D:/Users/acombess/Database_Twitter_FrenchPolitics/" ###CHANGE THIS
db_location ="C:/Users/wymeka/Documents/ENSAE/DataViz_twitter"

#Importing custom modules
from org.ensae.dataviz.scraping.utils.module_twitterscraping import TwitterApiUtil

#############################DATA EXPLORATION################################################################
twitter_util = TwitterApiUtil(db_location)

#Get your own timeline
for status in tweepy.Cursor(twitter_util.get_current_api().home_timeline).items(10):
    # Process a single status
    print(status.text)

#Get your friends
for friend in tweepy.Cursor(twitter_util.get_current_api().friends).items(10):
    twitter_util.printjson(friend)

#Returns a collection of the most recent Tweets posted by the user indicated by the screen_name or user_id parameters.
for tweet in tweepy.Cursor(twitter_util.get_current_api().user_timeline).items(10):
    twitter_util.printjson(tweet)

#Search queries - entire json dumps
for tweet in tweepy.Cursor(twitter_util.get_current_api().search,q='transilien',lang='fr').items(2):
        print(json.dumps(tweet._json))

#Search queries - just the user and tweet text
for tweet in tweepy.Cursor(twitter_util.get_current_api().search,q='transilien',lang='fr').items(2):
        print(tweet.user.name,tweet.text)

#Get the remaining API calls
twitter_util.search_limit(twitter_util.get_current_api())
twitter_util.time_search_limit(twitter_util.get_current_api())

#Efficient way to store results from search queries as a json file in the database location
twitter_util.storejson(tweepy.Cursor(twitter_util.get_current_api().search,q='transilien',lang='fr'),1000,"test2.json")
os.listdir(db_location)
test=twitter_util.readjson("test2.json")
for tweet in test:
    print(tweet["text"])

#Efficient way to store results from the Twitter Stream for specific queries and languages, and a given time
twitter_util.storetwitterstream(destinationfile="testp2",lang=["en"],query=["#NationalSigningDay"],timelimit=30)

#Function to be adapted (cases of empty lines)
##test2=readjson("testp2.json")
##for tweet in test:
    ##print(tweet["text"])