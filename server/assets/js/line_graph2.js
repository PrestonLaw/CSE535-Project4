



var search_for_tweets = function(search_str, callback) {
    search_str = search_str.replace(" ", "%20");

    //var day = 737011;
    //var search_url = 'search/solr/p4/select?fq=date_ordinal:' + day + '&q=' + searchstring + '&wt=json';

    var num = 10000
    var search_url = 'search/solr/p4/select?q='+search_str+'&rows='+num+'&start=0&wt=json'
    
    d3.json(search_url, function (resp) {
        var tweets = resp.response.docs;
	(callback)(tweets);
    })
};




var line_graph = function() {

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

    // Get the data
    d3.csv("assets/data/tweet_date_count.csv", function(error, data) {
	if (error) throw error;

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
	    console.log(d.key)
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

    });


}
