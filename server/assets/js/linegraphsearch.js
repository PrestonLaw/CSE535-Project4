


var stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't",
"as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't",
"did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had",
"hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself",
"him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself",
"let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other",
"ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't",
"so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's",
"these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very",
"was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's",
"which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're",
"you've","your","yours","yourself","yourselves"];


var get_words = function(text) {
    var words = text.split(" ");
    var keep = []
    for (var j=0; j < words.length; j++){
        var word = words[j];
        word = word.replace(/[\[\].,\/#!$%\^&\*;:{}=\-_`~()0123456789?]/g,"")
        if (word.length >2 && stopwords.indexOf(word.toLowerCase()) == -1) {
	    keep.push(word.toLowerCase());
	}
    }

    return keep;
}




// var search_url = 'search/solr/p4/select?q='+search_str+'&rows='+num+'&start=0&wt=json'
var get_all_tweets = function(callback, search_url, tweets=[], num=-1) {
    
    // limit the number of tweets
    if (tweets.length > 10000) {
	//console.log("Limiting the number of tweets returned.")
	(callback)(tweets);
	return;
    }

    search_url = search_url + '&start=' + tweets.length;
    if (num > 0) {
	var remaining = num - tweets.length;
	var num = Math.min(remaining, 1000)
	search_url = search_url + '&rows=' + num;
    }
    
    d3.json(search_url, function (resp) {
        tweets = tweets.concat(resp.response.docs);
	num_found = resp.response['numFound']
	if (tweets.length < num_found) {
	    get_all_tweets(callback, search_url, tweets, num_found)
	} else {
	    (callback)(tweets);
	}
    })
};



// Convert a list of tweets into an a format consumed by the draw function / line plot.
// Tweet count per day.
var tweets_to_data = function(tweets) {
    var day_totals = {}
    for (var idx =0; idx < tweets.length; idx++) {
	tweet = tweets[idx];
	date = tweet['tweet_date'][0]
	date = date.split('T')[0]
	
	if (day_totals[date] == undefined) {
	    day_totals[date] = 1;
	} else {
	    day_totals[date] += 1;
	}
    }

    // change it into array
    var data = [];
    for (day in day_totals) {
	data.push({topic: "tweet volume", date: day, count: day_totals[day]})
    }
    data.sort(function(a, b){return a['date'] < b['date']?-1:1});

    return data;
}



var draw = function(tweets) {

    data = tweets_to_data(tweets)


    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 600 - margin.left - margin.right,
	height = 270 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.timeParse("%Y-%m-%d");

    // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Define the line
    var countline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.count); });

    // Adds the svg canvas
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
	      "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
	d.date = parseDate(d.date);
	d.count = +d.count;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // Nest the entries by symbol
    var dataNest = d3.nest()
	.key(function(d) {return d.topic;})
	.entries(data);

    var color = d3.scaleOrdinal(d3.schemeCategory10);  // set the colour scale

    // Loop through each symbol / key
    dataNest.forEach(function(d) {
	//console.log(d.key)
	svg.append("path")
	    .attr("class", "line")
	    .style("stroke", function() { // Add dynamically
		return d.color = color(d.key); })
	    .attr("d", countline(d.values));
    });

    // Add the X Axis
    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
	.attr("class", "y axis")
	.call(d3.axisLeft(y));
    

};


var linegraphsearch = function() {
    $("#mysubmit").click(function() {
        var searchstring = $("#search2").val()
        //window.alert(searchstring)

	// This is not really necesary.
	search_words = get_words(searchstring);
        searchstring = searchstring.replace(" ", "%20")
	
        //window.alert("q=" + searchstring)

        var search_url = 'search/solr/p4/select?indent=on&q=' + searchstring + '&wt=json'

	get_all_tweets(draw, search_url)

    });
};

	    

