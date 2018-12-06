// javascript.
var stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];

var draw_topic = function(tag) {
    var words_url = "assets/data/word_freq_"+tag+".json"
    var tweet_url = "assets/data/best_tweet_"+tag+".json"

    d3.json(words_url, function (resp) {
	var data = resp

	data = data.slice(0,500);
	
	k = 80.0 / data[0][1]
	for (var idx = 0; idx < data.length; ++idx) {
	    data[idx][1] *= k
	}
	
	// Render the cloud
	//data = [['Hello', 10], ['World', 5]];
	WordCloud(document.getElementById('my_canvas'), { list: data } );
    })

    d3.json(tweet_url, function (resp) {
	//document.getElementById('my_canvas').text(resp)
	$("#tweet").text("Closest tweet: " + resp.translation);
    });
	    
}
