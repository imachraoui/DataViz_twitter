origin=['alteralec',
        'giftguru',
		'imachraoui']

consumer_key = ['oPlTDlvWDxeaGY3AywHCgoFBE',
                'XQBdDD1W08DSrtZDmuiKTHckd',
				'4PEMlhk99arGUIdrRBg3dERn0']
consumer_secret = ['1Vv7XHp7eyWLEMka972Ux1EFULTR2hBgAzCDZvDZUGAIFfwAiH',
                   '9KTKICCCSua0byweBdkzqJODFh19gQ8t7NORpiAvpwrte7Sldj',
				   '2j5EXly523LytDa78KSoHm6R3Bvfkik7tpexmpPBpmRYU4zJTY']
access_token = ['933164058-v4VsyYf3QNz2OhbBarffAQEqjG22qUHDcF0jjVTw',
                '303836743-pj0EoXhixdCUJUjveldhqDBoCDunTyuweLhmvgCh',
				'78860088-0q9zUHoQMnYw9a8xXb3cXLxonrNex0N8ccppKJDuY']
access_secret = ['3nwamio985wqSf7qBf92GEbM7qEsKN20YSfL0NFRErO0k',
                 'ORgtO6LWDi1bw4cmsnBj4dy3qLusGXpy9WcWSxeENzrNm',
				 'iBRomdmwuhufZv9k62LptQmuNeHpvMeSk68YZ6DPByLCy']


import tweepy
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import json
import time
import string
import os

class TwitterApiUtil() :

    def __init__(self, db_location):
        self.auth=[None] * len(consumer_key)
        self.apis=[None] * len(consumer_key)
        self.db_location = db_location
        for i in range(len(consumer_key)):
            self.auth[i] = OAuthHandler(consumer_key[i], consumer_secret[i])
            self.auth[i].set_access_token(access_token[i], access_secret[i])
            self.apis[i] = tweepy.API(self.auth[i])
        self.current_api_index = 0

    def get_apis(self):
        return(self.apis)

    def get_current_api(self):
        remaining = self.search_limit(self.apis[self.current_api_index])['remaining']
        i=1
        while remaining == 0 & i<4 :
            self.current_api_index = (self.current_api_index + 1) % len(self.apis)
            remaining = self.search_limit(self.apis[self.current_api_index])['remaining']
            i=i+1
        return self.apis[self.current_api_index]

    def printjson(self,x):
        print(json.dumps(x._json))

    def storejson(self,x,n,outfile):
        with open(self.db_location+outfile, 'w') as f:
            for i in x.items(n):
                json.dump(i._json, f)
                f.write('\n')

    def readjson(self,file):
        data=[]
        with open(self.db_location+file) as f:
            for line in f:
                if line != "\n":
                    data.append(json.loads(line))
        return(data)

    def search_limit(self,api):
        return(api.rate_limit_status()["resources"]["search"]["/search/tweets"])

    def time_search_limit(self,api):
            return(api.rate_limit_status()["resources"]["search"]["/search/tweets"]["reset"]-time.time())


    def storetwitterstream(self, destinationfile, query, lang=["fr"], starttime=time.time(), timelimit=60):

        class MyListener(StreamListener):
            def __init__(self, destinationfile, starttime, timelimit):
                self.outfile = self.TwitterApiUtil.db_location+destinationfile+".json"
                self.starttime=starttime
                self.timelimit=timelimit

            def on_data(self, data):
                while (time.time()-self.starttime)<self.timelimit:
                    try:
                        with open(self.outfile, 'a') as f:
                            f.write(data)
                            print(data)
                            return(True)
                    except BaseException as e:
                        print("Error on_data: %s" % str(e))
                        time.sleep(5)
                        pass
                    return(True)
                else: return(False)

            def on_error(self, status):
                print(status)
                return(True)

        twitter_stream = Stream(self.get_current_api().auth, MyListener(destinationfile,starttime,timelimit))
        twitter_stream.filter(track=query,languages=lang)

