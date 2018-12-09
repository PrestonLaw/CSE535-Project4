# -*- coding: utf-8 -*-

import json
import sys


# This is a script to print out all the trending sub topics from a json file
# in a readable format.  I am only going to print out the top 4 words in each subtopic.
# Requires python3


topic='infrastructure'
if len(sys.argv) > 1:
    topic = sys.argv[1]



filename = "trending_topics_%s.json"%topic.replace(' ', '_')
with open(filename, 'r') as fp:
    clusters = json.load(fp)




print(topic)
for cluster in clusters:
    count, words, tweet = cluster
    print("-----------------------------------------")
    print(count, end=": ")
    for idx in range(5):
        word = words[idx]
        print("%s (%0.2f),"%(word[0], word[1]), end=" ")
    print("")
    print(tweet['translation'])















