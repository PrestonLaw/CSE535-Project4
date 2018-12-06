// javascript.

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



function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);

    return [x, y];
}


// cordinate ssytem
//<svg
//viewBox="-1 -1 2 2"
//style="transform: rotate(-0.25turn)"
//></svg>
// <path d=”M 1 0 A 1 1 0 0 1 0.8 0.59 L 0 0"></path>
// arc: rx ry x-axis-rotation large-arc-flag sweep-flag x y


var animation = function() {
    var url = "assets/data/crime_word_cloud.json"
    d3.json(url, function (resp) {

	if (false) {
	    data = resp
	    data = data.slice(3,600)
	    // Scale the fonts
	    scale = 200.0/data[0][1]
	    for (idx = 0; idx < data.length; idx++) {
		data[idx][1] *= scale
	    }
	    //data = [['Hello', 10], ['World', 5]];
	    WordCloud(document.getElementById('my_canvas'), { list: data } );
	}
    })

    $("#mysubmit").click(function() {
	// date ordinal range: 736981, 737031
	//var searchstring = 'search/solr/p4/select?fq=date_ordinal:737031&indent=on&q=Trump&wt=json'
	
        var searchstring = $("#search2").val()
        //window.alert(searchstring)


	search_words = get_words(searchstring);
        searchstring = searchstring.replace(" ", "%20")
	
        //window.alert("q=" + searchstring)

	var day = 737011;
        var search_url = 'search/solr/p4/select?fq=date_ordinal:' + day + '&q=' + searchstring + '&wt=json'

        d3.json(search_url, function (resp) {
            var tweets = resp.response.docs;

	    var count_pos = 0
	    var count_neg = 0
	    for (var idx = 0; idx < tweets.length; idx++){
		tweet = tweets[idx]
		if (tweet['polarity'] >= 0) {
		    count_pos += 1;
		} else {
		    count_neg += 1;
		}
	    }
	    
	    // d3 pie chart (from: https://gist.github.com/enjalot/1203641)
	    var data = [count_pos, count_neg];

	    var width = 960,
		height = 500,
		radius = Math.sqrt(tweets.length) * 20;

	    var color = d3.scaleOrdinal()
		.range(["#98abc5", "#8a89a6", "#7b6888"]);

	    var arc = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	    var labelArc = d3.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);

	    var pie = d3.pie()
		.sort(null)
		.value(function(d) { return d; });

	    var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	    var g = svg.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr("class", "arc");

	    g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data); });

	    g.append("text")
		.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.text(function(d) { return d.data; });

        });
    });



}



var search = function() {
    var searchstring = document.getElementById('search').value

    window.alert(searchstring)
}






