// javascript.
var stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];

var test = function() {
    var url = "assets/data/crime_word_cloud.json"

    var search_url = 'search/solr/p4/select?indent=on&q=environment&wt=json'


    d3.json(search_url, function (resp) {
	//data = resp.response.docs
	var data = resp.response.docs;
	// collect all the words in the tweets and make a word frequency arary.
	max_count = 1;
	var dict = {}
	for (var i = 0; i < data.length; i++){
	    text = data[i].translation[0];
	    words = text.split(" ");
	    for (var j=0; j < words.length; j++){
		word = words[j];
		word = word.replace(/[\[\].,\/#!$%\^&\*;:{}=\-_`~()0123456789]/g,"")
		if (word != "" && stopwords.indexOf(word.toLowerCase()) == -1) {
		    if (dict[word] == undefined) {
			dict[word] = 1;
		    } else {
			dict[word] += 1;
			if (dict[word] > max_count) {
			    max_count = dict[word]; 
			}
		    }
		}
	    }	  
	}

	// reformat the words into an array for wordcloud
	word_count = []
	for (word in dict) {
	    word_count.push([word, dict[word] * 100.0 / max_count])
	}
	word_count.sort(function(a, b){return b[1] - a[1]});

	

	//data = [['Hello', 10], ['World', 5]];
	WordCloud(document.getElementById('my_canvas'), { list: word_count } );
    })
	    
}
