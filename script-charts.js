var margin = {top: 20, right: 30, bottom: 40, left: 40},
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width - 100]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);

/**************************  
	Definition of charts
***************************/

var chart_lazy = d3.select(".chart_lazy")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var info_lazy = d3.select(".info_lazy")
    .attr("width", 200)
    .attr("height", height/2)
    .attr("transform", "translate(" + margin.left + 100 + "," + margin.top + ")");

var chart_points= d3.select(".chart_points")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var info_points = d3.select(".info_points")
    .attr("width", 200)
    .attr("height", height/2)
    .attr("transform", "translate(" + margin.left + 100 + "," + margin.top + ")");

var chart_Number_of_followers = d3.select(".chart_Number_of_followers")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var info_Number_of_followers = d3.select(".info_Number_of_followers")
    .attr("width", 200)
    .attr("height", height/2)
    .attr("transform", "translate(" + margin.left + 100 + "," + margin.top + ")");

var chart_Number_of_tweets = d3.select(".chart_Number_of_tweets")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var info_Number_of_tweets = d3.select(".info_Number_of_tweets")
    .attr("width", 200)
    .attr("height", height/2)
    .attr("transform", "translate(" + margin.left + 100 + "," + margin.top + ")");

var chart_ratio_retweets = d3.select(".chart_ratio_retweets")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var info_ratio_retweets = d3.select(".info_ratio_retweets")
    .attr("width", 200)
    .attr("height", height/2)
    .attr("transform", "translate(" + margin.left + 100 + "," + margin.top + ")");
	
var chart_Following_to_follower_ratio = d3.select(".chart_Following_to_follower_ratio")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var info_Following_to_follower_ratio = d3.select(".info_Following_to_follower_ratio")
    .attr("width", 200)
    .attr("height", height/2)
    .attr("transform", "translate(" + margin.left + 100 + "," + margin.top + ")");

/*****************************
******************************/
var yaxis = d3.svg.axis()
    .scale(y)
    .orient("left");

function display_chart(error,data,chart,metric){
		if (error) throw error;

    var datatofilter = crossfilter(data);

    var datatofilterby = datatofilter.dimension(function(d) { return d[metric] });

    var topfrequency = datatofilterby.top(15);

  x.domain([0, d3.max(topfrequency, function(d) { return d[metric]; })]);
  y.domain(topfrequency.map( function(d) { return d.Name; }));

 var axis_container = chart.append("g")
                           .attr("class", "y axis")
                           .call(yaxis)
                           .style({'stroke': '#100'})
                           .attr("transform", "translate(110,0)");


  var bars_container = chart.append("g")
                            .attr("class", "bars").attr("transform", "translate(10,0)");

  var rects = bars_container.selectAll("rect")
       .data(topfrequency)
       .enter()
       .append("rect")
       .on("mouseover", hover)

  var rects_attr = rects
       .attr("class", "bar")
       .attr("width", function(d) { return x(d[metric]); })
       .attr("height", y.rangeBand() - 1)
       .attr("transform", function(d) { return "translate(100," + y(d.Name) + ")"; })
       .attr("fill", function(d) {
          if (d.Nuance_Politique === "Droite") { return "blue"; }
          if (d.Nuance_Politique === "Gauche") { return "#EB70CF"; }
          if (d.Nuance_Politique === "Extreme-Droite") { return "#000080"; }
          if (d.Nuance_Politique === "Extreme-Gauche") { return "red"; }
          if (d.Nuance_Politique === "Centre") { return "orange"; }
        });


  var texts = bars_container.selectAll("text")
       .data(topfrequency)
       .enter()
       .append("text")

  var texts_attr = texts
       .attr("x", function(d) { return x(d[metric]) - 3; })
       .attr("y", y.rangeBand() / 2)
       .attr("dy", ".35em")
       .text(function(d) { return d[metric]; })
       .attr("transform", function(d) { return "translate(100," + y(d.Name) + ")"; });

//rects.on("mouseover", function(d) {
               //var person = d3.mouse(this)[0]),

//               imgs = photo.selectAll("image")
//                     .data([0])
//                     .enter()
//                     .append("svg:image")
//                     .attr("xlink:href",d.url_image)
//                     .attr("width", 150)
//                     .attr("height", 150)
//  })

function hover(d) {
    //var num = 0,
        color = 'black';
    //if (d.change > 0) {
    //  color = 'green';
    //  num = "+" + d.change;
    //} else if (d.change < 0) {
    //  color = 'red';
    //  num = d.change;
    //}
    d3.select(".info_"+metric)
      .html(
        "<text x =" + 50 + " y=" + 20 + ">" + d.Name +" ("+ d.Acronyme_parti+")</text><br></br>" + "<text x =" + 50 + " y=" + 40 + ">" + d[metric] + " points</text>" +
       "<image xlink:href=" + d.url_image + " height =" + 100 + " width=" + 100 +" y=" + 50 +" x=" + 42 +" />");
  }


}

d3.csv('https://dl.dropboxusercontent.com/s/rd12x97rjhc3whc/data_fusion_utf8-2.csv?dl=0', type_lazy, function(error,data){
	display_chart(error,data,chart_lazy,"lazy");
});

d3.csv('https://dl.dropboxusercontent.com/s/rd12x97rjhc3whc/data_fusion_utf8-2.csv?dl=0', type_points, function(error,data){
	display_chart(error,data,chart_points,"points");
});

d3.csv('https://dl.dropboxusercontent.com/s/rd12x97rjhc3whc/data_fusion_utf8-2.csv?dl=0', type_followers, function(error,data){
	display_chart(error,data,chart_Number_of_followers,"Number_of_followers");
});

d3.csv('https://dl.dropboxusercontent.com/s/rd12x97rjhc3whc/data_fusion_utf8-2.csv?dl=0', type_tweets, function(error,data){
	display_chart(error,data,chart_Number_of_tweets,"Number_of_tweets");
});

d3.csv('https://dl.dropboxusercontent.com/s/rd12x97rjhc3whc/data_fusion_utf8-2.csv?dl=0', type_ratio, function(error,data){
	display_chart(error,data,chart_ratio_retweets,"ratio_retweets");
});

d3.csv('https://dl.dropboxusercontent.com/s/rd12x97rjhc3whc/data_fusion_utf8-2.csv?dl=0', type_FtF, function(error,data){
	display_chart(error,data,chart_Following_to_follower_ratio,"Following_to_follower_ratio");
});

function type_lazy(d) {
  d["lazy"] = +d["lazy"]; // coerce to number
  return d;
}

function type_points(d) {
  d["points"] = +d["points"]; // coerce to number
  return d;
}

function type_followers(d) {
  d["Number_of_followers"] = +d["Number_of_followers"]; // coerce to number
  return d;
}

function type_tweets(d) {
  d["Number_of_tweets"] = +d["Number_of_tweets"]; // coerce to number
  return d;
}

function type_ratio(d) {
  d["ratio_retweets"] = +d["ratio_retweets"]; // coerce to number
  return d;
}

function type_FtF(d) {
  d["Following_to_follower_ratio"] = +d["Following_to_follower_ratio"]; // coerce to number
  return d;
}