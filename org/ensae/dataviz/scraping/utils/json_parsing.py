import json
import csv
import pandas
from dateutil.parser import parse
from os import listdir
from os.path import isfile, join

with open('../account_info.json', 'r') as f:
    accounts = json.loads(json.dumps(f.readlines()))


def order_by_followers(accounts,asc=0) :
    with open('../account_followers.csv', 'w+') as f:
        writer=csv.writer(f,delimiter='\t')
        writer.writerow(["screen_name","followers"])
        for user in accounts :
            user_json = json.loads(user)
            writer.writerow([user_json["screen_name"], user_json["followers_count"]])

    followers = pandas.read_csv('../account_followers.csv',sep='\t')
    return(followers.sort_values(by="followers",ascending=asc))

def order_by_creation_date(accounts,asc=1) :

    with open('../account_followers.csv', 'w+') as f:
        writer=csv.writer(f,delimiter='\t')
        writer.writerow(["screen_name","creation_date"])
        for user in accounts :
            user_json = json.loads(user)
            writer.writerow([user_json["screen_name"], parse(user_json["created_at"])])

    followers = pandas.read_csv('../account_followers.csv',sep='\t')
    return(followers.sort_values(by="creation_date",ascending=asc))

def write_in_csv(attribute1,attribute2,outputFileName):
    with open(outputFileName, 'w+') as f:
        writer=csv.writer(f,delimiter='\t')
        writer.writerow(["screen_name","creation_date"])
        for user in accounts :
            user_json = json.loads(user)
            writer.writerow([user_json[attribute1], parse(user_json[attribute2])])

def file_len(fname):
    with open(fname) as f:
        for i, l in enumerate(f):
            pass
    return i + 1

def list_files(path):
    onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]
    return(onlyfiles)

def order_by_number_tweets(asc=0):
    with open("../account_number_tweets.csv", 'w+') as f:
        writer=csv.writer(f,delimiter='\t')
        writer.writerow(["screen_name","number_tweets"])
        path="../tweets/tweets/"
        files = list_files(path)
        for file in files :
            tweets=file_len(path+file)
            writer.writerow([file, tweets])
    tweets = pandas.read_csv('../account_number_tweets.csv',sep='\t')
    return(tweets.sort_values(by="number_tweets",ascending=asc))

#print(order_by_creation_date(accounts))
print(order_by_number_tweets())