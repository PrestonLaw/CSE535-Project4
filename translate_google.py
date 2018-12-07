# -*- coding: utf-8 -*-


import twitter
import pdb
import time
import json
from emoji import UNICODE_EMOJI
import numpy as np
import tweepy
import sys
import os
import glob
import string
from pprint import pprint
from textblob import TextBlob
import urllib2
import time
from google.cloud import translate


def save_tweets(tweets):
    print("saving tweets")
    with open("translation.json", 'w') as f:
        json.dump(tweets, f)


def ascii_only(in_str):
    tmp = []
    for c in in_str:
        if c in string.ascii_letters or \
           c in string.punctuation or \
           c in string.whitespace:
            tmp.append(c)
        else:
            tmp.append(' ')
    return ''.join(tmp)




# This is for removing punctuation. I do not think I will do that.
#table = dict((ord(char), u' ') for char in string.punctuation)
#table[10] = u' '
#table[8230] = u' '
#table[8220] = None
#table[8221] = None
#table[8217] = None
#table[8216] = None
#table[39] = None
#table[175] = None
#table[12484] = None
#text = text.translate(table)



def translate_english_tweets(tweets):
    count = 0
    for tweet in tweets:
        if count % 1000 == 0:
            print(count)
        if not 'translation' in tweet and 'text_en' in tweet:
            text = tweet['text_en']
            #print("")
            #print(text)

            tweet['translation'] = ascii_only(text)
            #print(tweet['translation'])
            count += 1

    return count


def translate_tweets(tweets, lang):
    print("Translating %d tweets from %s"%(len(tweets), lang))
    text_field_key = "text_%s"%lang

    translate_client = translate.Client()

    skipped = 0
    count = 1
    for tweet in tweets:
        if text_field_key in tweet:
            if not 'translation' in tweet and text_field_key in tweet:
                text = tweet[text_field_key]

                try:
                    translation = translate_client.translate(text, target_language='en')
                    tweet['translation'] = translation['translatedText']

                    #if count%1000 == 0:
                    #print(text)
                    #print("%d  %s"%(count, tweet['translation']))
                    print((skipped,count))
                    count += 1
                except Exception as inst:
                    if isinstance(inst, urllib2.HTTPError):
                        print("HttpError")
                    if len(inst.args) == 0:
                        print("unknown {}".format(type(inst)))

                    error_str = inst.args[0] 
                    print(error_str)

                    # We might as well save if we will be sleeping.
                    if "Rate Limit" in error_str:
                        save_tweets(tweets)
                        count = 0
                        print("Sleeping for a minute")
                        time.sleep(60)
                    else:
                        #pdb.set_trace()
                        print(inst)

                if count > 10000:
                    save_tweets(tweets)
                    count = 0
            else:
                skipped += 1
                
                    
    return count


filename = 'all_tweets.json'
print(filename)
with open(filename, 'r') as fp:
    tweets = json.load(fp)

try:
    # Should we do anything with English?
    #translate_english_tweets(tweets)
    #save_tweets(tweets)
    translate_tweets(tweets, 'fr')
    #save_tweets(tweets)
    translate_tweets(tweets, 'th')
    #save_tweets(tweets)
    translate_tweets(tweets, 'es')
    #save_tweets(tweets)
    translate_tweets(tweets, 'hi')
except KeyboardInterrupt:
    print("--- keyboard interrupt")


pdb.set_trace()
save_tweets(tweets)

print("=============== Finished ==================")





























