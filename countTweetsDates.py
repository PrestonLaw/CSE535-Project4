# -*- coding: utf-8 -*-
import pdb
import time
import json
import sys
import os
import glob


# Author: Preston Law
# 12/01/2018



# This script counts the number of tweets in all_tweets.json and prints
# out the range of tweet dates.



# This looks for the last tweet collection file, finds the lastest tweet id, and finds all tweets after that.

def custom_load_tweets(fp, date_range=None):
    tweets = []
    for line in fp:
        tweet = json.loads(line)
        tweets.append(tweet)
        date_str = my_tweet['tweet_date']
        date_list = date_str.split('-')
        year = int(date_list[0])
        month = int(date_list[1])
        date_list = date_list[2].split('T')
        day = int(date_list[0])
        tmp = month * 100 + day
        if date_range is None:
            date_range = [tmp,tmp]
        else:
            date_range[0] = min(date_range[0], tmp)
            date_range[1] = max(date_range[1], tmp)

    print(date_range)
    return tweets, date_range




def get_number_of_tweets_in_file(filename, date_range):
    month_dict = {'Jan': 1, 'Feb':2, 'Mar':3, 'Apr':4, 'May':5, 'Jun':6, 'Jul':7, 'Aug':8, 'Sep':9, 'Oct':10, 'Nov':11, 'Dec':12}
    print(filename)

    with open(filename, 'r') as fp:
        tweets = json.load(fp)

        for tweet in tweets:
            date_str = tweet['tweet_date']
            date_list = date_str.split('-')
            year = int(date_list[0])
            month = int(date_list[1])
            date_list = date_list[2].split('T')
            day = int(date_list[0])
            tmp = month * 100 + day

            if date_range is None:
                date_range = [tmp,tmp]
            else:
                date_range[0] = min(date_range[0], tmp)
                date_range[1] = max(date_range[1], tmp)

    return len(tweets), date_range
    
        


date_range = None
total = 0
filename = 'all_tweets.json'
count, date_range = get_number_of_tweets_in_file(filename, date_range)
total += count

print(total)
print(date_range)


























