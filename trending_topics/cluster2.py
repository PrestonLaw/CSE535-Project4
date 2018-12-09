# -*- coding: utf-8 -*-

import math
import random
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
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


from sklearn.cluster import KMeans
import numpy as np





# 12/6: trying to make trending topics.  (specific to topics)




#nltk.download('stopwords')

# This makes a dictionary of words.
# For each word it keep track of the document count.

stop_words = set(stopwords.words('english'))
stop_words.add('quot')
stop_words.add('la')
stop_words.add('de')
stop_words.add('us')


def custom_filter(word):
    if len(word) <=2:
        return False
    if "'" in word and len(word) <= 3:
        return False
    return True



def ascii_only(in_str):
    tmp = []
    for c in in_str:
        if c in string.ascii_letters:
            tmp.append(c)
        else:
            tmp.append(' ')
    return ''.join(tmp)

my_stop_words = [ascii_only(w) for w in stop_words]


def get_tweet_words(tweet):
    global my_stop_words


    if 'words' in tweet:
        return tweet['words']
    if not 'translation' in tweet:
        return []
    
    text = tweet['translation']
    text = text.replace('&quot', ' ')

    text = ascii_only(text)
    text = text.lower()
    word_tokens = word_tokenize(text)
    words = [w for w in word_tokens if not w in my_stop_words]
    words = [w for w in words if custom_filter(w)]
    
    # Remove duplicates.
    word_set = []
    for word in words:
        if not word in word_set:
            word_set.append(word)

    tweet['words'] = word_set
    return word_set



def compute_tweet_vectors(tweets, word_indexes):
    """
    in each tweet, creates the fields: vector, and vector_magnitude.
    it returns a list of tweets that have non zero length vectors.
    """
    # remove empty words.
    good_tweets = []
    for tweet in tweets:
        vector = []
        words = get_tweet_words(tweet)
        if len(words) > 0:
            tweet['cluster'] = -1
            for word in words:
                if word in word_indexes:
                    word_idx = word_indexes[word]
                    if not word_idx in vector:
                        vector.append(word_idx)
            if len(vector) > 0:
                vector.sort()
                # Is there a benefit to converting to numpy?
                tweet['vector'] = vector
                tweet['vector_magnitude'] = math.sqrt(len(vector))
                good_tweets.append(tweet)

    return good_tweets



def assign_tweets_to_clusters(tweets, centers):
    """
    Assign each tweet to a cluster.
    Tweets get a field "cluster: set to the cluster index.
    """
    cluster_sizes = np.zeros((num_clusters), dtype=np.int)
    num_changes = 0
    for tweet in tweets:
        v = tweet['vector']
        v_mag = tweet['vector_magnitude']
        best_cluster = -1
        best_dot = 0.0
        for cluster_idx in range(len(centers)):
            dot = 0.0
            for word_idx in v:
                # dot product for cosine similarity
                dot += centers[cluster_idx,word_idx]
            dot = dot / v_mag
            if dot > best_dot:
                best_dot = dot
                best_cluster = cluster_idx
        cluster_sizes[best_cluster] += 1
        if best_cluster != tweet['cluster']:
            num_changes += 1
            tweet['cluster'] = best_cluster

    return num_changes, cluster_sizes



def recompute_cluster_centers(tweets, centers):
    """
    New centers are the average of all member vectors
    """
    centers.fill(0.0)
    for tweet in tweets:
        vector = tweet['vector']
        vector_mag = tweet['vector_magnitude']
        cluster_idx = tweet['cluster']
        for word_idx in vector:
            centers[cluster_idx, word_idx] += 1.0/vector_mag
    normalize_centers(centers)

    

def normalize_centers(centers):
    # Normalize all cluster centers
    centers_sq = np.square(centers)
    tmp = np.sum(centers_sq, axis=1)
    # tmp contains magnitudes now.
    tmp = np.sqrt(tmp)
    tmp = 1/tmp
    # stupid broadcasting rules (trailing dimensions have to be the same).
    tmp2 = np.transpose(centers) * tmp
    tmp3 = np.transpose(tmp2)
    centers[...] = tmp3[...]



def find_closest_tweet(tweets, center):
    """
    compute_tweet_vectors must be called first.
    """
    best_tweet = None
    best_dot = 0.0
    for tweet in tweets:
        v = tweet['vector']
        v_mag = tweet['vector_magnitude']
        if v_mag == 0:
            continue
        dot = 0.0
        for word_idx in v:
            # dot product for cosine similarity
            dot += center[word_idx]
        dot = dot / v_mag
        if dot > best_dot:
            best_dot = dot
            best_tweet = tweet
    return best_tweet
        
        

    
def get_topic_tweets(tweets, topic):
    return [t for t in tweets if 'topic' in t and t['topic'] == topic]


# ====================================================================

#topic = 'politics'
topic = 'environment'
#topic = 'crime'
#topic = 'social unrest'
#topic = 'infrastructure"

topic = sys.argv[1]
print(topic)


filename = "/home/claw/Preston/all_tweets.json"
#filename = "/home/claw/Preston/small_tweets.json"
with open(filename, 'r') as fp:
    all_tweets = json.load(fp)
random.shuffle(all_tweets)


tweets = get_topic_tweets(all_tweets, topic)


filename = "word_index.json"
with open(filename, 'r') as fp:
    word_indexes = json.load(fp)


# Compute vectors and prune tweets with empty vectors.
tweets = compute_tweet_vectors(tweets, word_indexes)






print("--------------- start --------------------")

# Initialize the cluster centers (verbose)
num_clusters = 40
centers = np.random.rand(num_clusters,len(word_indexes))
for cluster_idx in range(num_clusters):
    # Sample random tweet vectors as the starting clutser centers.
    tweet = tweets[cluster_idx]
    # Normalization factor for cosine distance.
    vector_mag = tweet['vector_magnitude']
    for word_idx in tweet['vector']:
        centers[cluster_idx, word_idx] += 1.0/vector_mag
normalize_centers(centers)


num_changes = len(tweets)
count = 0
while num_changes > 0:
    num_changes, _ = assign_tweets_to_clusters(tweets, centers)
    print(num_changes)
    recompute_cluster_centers(tweets, centers)
    if count > 10:
        with open("centers.pth", 'w') as fp:
            np.save(fp, centers)
        with open("cluster_tweets", 'w') as fp:
            np.dump(all_tweets, fp)
        count = 0


# we need to count the tweets in each cluster and sort from highest to lowest.
_, cluster_sizes = assign_tweets_to_clusters(tweets, centers)

clusters = zip(centers, cluster_sizes)
clusters.sort(key=lambda x:x[1], reverse=True)

# Turn the vector into a list of words.
clusters2 = []
for cluster in clusters:
    tweet_count = cluster[1]
    vector = cluster[0]
    words = [(w,vector[word_indexes[w]]) for w in word_indexes]
    words.sort(key=lambda t:t[1], reverse=True)
    words= words[0:1000]
    best_tweet = find_closest_tweet(tweets, vector)
    clusters2.append((tweet_count, words, tweet))


clusters2.sort(key=lambda c:c[0], reverse=True)
# Get the prototype tweet for each cluster. 


filename = "trending_topics_%s.json"%topic
with open(filename, 'w') as fp:
    json.dump(clusters2, fp)



















# We need the clusters (truncated)

    






















