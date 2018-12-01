from textblob import TextBlob

import pdb
import json





if __name__ == "__main__":

  newdata = []

  with open("./all_tweets.json") as infile:
    with open("./all_tweets2.json", 'w') as outfile:
      data = json.load(infile)

      #pdb.set_trace()

      tweet = data[0]

      count = 1

      for tweet in data:
        # Language processing: Create a 'text_trans' field with the
        """
      if tweet['tweet_lang'] != 'en':
        pdb.set_trace()

        blob = TextBlob(tweet['tweet_text'])

        trans_text = blob.translate(to='en')

        tweet['text_trans'] = trans_text

        pdb.set_trace()
      else:
        tweet['text_trans'] = tweet['text_en']
        """

        if tweet['tweet_lang'] == 'en':
          # Sentiment analysis. Add a tweet['sentiment'] = [polarity, subjectivity] field.
          if 'polarity' not in tweet.keys():
            try:
              s = TextBlob(tweet['text_en'])
              tweet['polarity'] = s.sentiment.polarity
              tweet['subjectivity'] = s.sentiment.subjectivity
              count += 1
            except:
              print("Error in sentiment analysis: %s"%tweet['text_en'])


        if count % 10000 == 0:
          count = 1
          print("10000 tweets analyzed")
          json.dump(data, outfile)
      json.dump(data, outfile)




