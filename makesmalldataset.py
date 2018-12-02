import pdb
import json



def save_tweets(tweets):
  print("Taving tweets...")
  with open("./smalldataset.json", 'w') as outfile:
    json.dump(tweets, outfile)



if __name__ == "__main__":

  data_en = []
  data_es = []
  data_fr = []
  data_th = []
  data_hi = []

  with open("../all_tweets.json") as infile:
    data = json.load(infile)


  #pdb.set_trace()

  #tweet = data[0]

  count = 1

  l1 = True
  l2 = True
  l3 = True
  l4 = True
  l5 = True

  for tweet in data:
    
    if tweet['tweet_lang'] == 'en' and l1:
      data_en.append(tweet)
    elif tweet['tweet_lang'] == 'es' and l2:
      data_es.append(tweet)
    elif tweet['tweet_lang'] == 'fr' and l3:
      data_fr.append(tweet)
    elif tweet['tweet_lang'] == 'th' and l4:
      data_th.append(tweet)
    elif tweet['tweet_lang'] == 'hi' and l5:
      data_hi.append(tweet)

    if len(data_en) >= 1000:
      l1 = False
    if len(data_es) >= 1000:
      l2 = False
    if len(data_fr) >= 1000:
      l3 = False
    if len(data_th) >= 1000:
      l4 = False
    if len(data_hi) >= 1000:
      l5 = False

    if not l1 and not l2 and not l3 and not l4 and not l5:
      break

  mydata = data_en + data_es + data_fr + data_th + data_hi

  save_tweets(mydata)
