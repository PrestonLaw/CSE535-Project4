





var trendingtopics = function(topic) {
    $('H1').text("Trending Topics: " + topic);

    // Get the data
    d3.json("assets/data/trending_topics_"+topic+".json", function(error, data) {
	if (error) throw error;

	for (var i= 0; i < data.length; i++) {
	    var cluster = data[i];
	    var count = cluster[0];
	    var words = cluster[1];
	    var tweet = cluster[2];
	    var info = "("+count+"): ";
            for (var j=0; j < 5; j++) {
		word = words[j][0];
		weight = words[j][1];
		info = info + word + "(" + weight.toFixed(2) + "), ";
	    }
	    var line = $('<hr>');
	    var text1 = $('<p>').text(info);
	    var text2 = $('<p>').text(tweet.translation);
	    $('body').append(line, text1, text2)
	}

    });


}
