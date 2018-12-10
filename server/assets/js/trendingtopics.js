





var trendingtopics = function(topic) {
    $('input[type="radio"]').click(function(){
	if ($(this).is(':checked')) {
	    draw($(this).val());
	}
    });
};



var drawworldcloud = function(words){
    $('#list').empty();

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        word[1] *= 50;
    }

    var canvas = $('<canvas>');
    $('#list').append(canvas);

    WordCloud(canvas[0], { list: words });
};


var bind_topic_button = function(topicbutton, words) {
    topicbutton.click(function(){
	$('#list').empty();
	//var lmax = Math.log(words[0][1]);
	//var lmin = Math.log(words[180][1]);
	var lmax = words[0][1];
	var lmin = words[180][1];
	var a = (90-12)/(lmax - lmin);
	var b = 90 - (lmax*a)
	
	for (var i = 0; i < words.length; i++) {
            var word = words[i];
            //word[1] = Math.log(word[1])*a + b;
            word[1] = word[1]*a + b;
	}

	var canvas = $('<canvas id="my_canvas" width="700" height="500">');
	$('#list').append(canvas);
	WordCloud(document.getElementById('my_canvas'), { list: words } );
    });
};


var draw = function(topic){
    $('#list').empty()
    
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
            var topicbutton = $('<button>').text("Word Cloud");
	    bind_topic_button(topicbutton, words);
	    $('#list').append(line, text1, text2, topicbutton);
	}

    });
};



