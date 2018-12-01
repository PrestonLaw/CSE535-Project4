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
table = dict((ord(char), u' ') for char in string.punctuation)
table[10] = u' '
table[8230] = u' '
table[8220] = None
table[8221] = None
table[8217] = None
table[8216] = None
table[39] = None
table[175] = None
table[12484] = None
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
    print("Translating %s"%lang)
    text_field_key = "text_%s"%lang

    translate_client = translate.Client()

    skipped = 0
    count = 1
    for tweet in tweets:
        if count % 1000 == 0:
            print((skipped, count))
        if text_field_key in tweet:
            if not 'translation' in tweet and text_field_key in tweet:
                text = tweet[text_field_key]
                #print("")
                #print(text)

                try:
                    translation = translate_client.translate(text, target_language=lang)
                    tweet['translation'] = translation
                    #print(translation)
                    count += 1
                except:
                    print("error")
                    print(text)
                    #if count > 1:
                    #    count = 0
                    #    save_tweets(tweets)
                    #sys.exit()
                if count > 60000:
                    save_tweets(tweets)
                    count = 0
            else:
                skipped += 1
                
                    
    return count


filename = 'all_tweets.json'
print(filename)
with open(filename, 'r') as fp:
    tweets = json.load(fp)

count = 0
# Should we do anything with English?
#count += translate_english_tweets(tweets)
count += translate_tweets(tweets, 'fr')
count += translate_tweets(tweets, 'es')
count += translate_tweets(tweets, 'th')
count += translate_tweets(tweets, 'hi')

if count > 0:
    count = 0
    save_tweets(tweets)

print("=============== Finished ==================")





























