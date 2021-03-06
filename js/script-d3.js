var margin = {top: 20, right: 30, bottom: 40, left: 40},
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width - 100]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var info = d3.select(".info")
    .attr("width", 200)
    .attr("height", height/2)
    .attr("transform", "translate(" + margin.left + 100 + "," + margin.top + ")");

var yaxis = d3.svg.axis()
    .scale(y)
    .orient("left");


d3.csv('http://imachraoui.github.io/DataViz_twitter/data_fusion_utf8.csv', type, function(error, data) {
  if (error) throw error;

    var datatofilter = crossfilter(data);

    var datatofilterby = datatofilter.dimension(function(d) { return d.Number_of_tweets });

    var topfrequency = datatofilterby.top(15);

  x.domain([0, d3.max(topfrequency, function(d) { return d.Number_of_tweets; })]);
  y.domain(topfrequency.map( function(d) { return d.Name; }));

 var axis_container = chart.append("g")
                           .attr("class", "y axis")
                           .call(yaxis)
                           .style({'stroke': '#100'})
                           .attr("transform", "translate(100,0)");
      //.attr("transform", "translate(0," + height + ")")
      //.call(xAxis)
      //.style({'stroke': '#000'});

  var bars_container = chart.append("g")
                            .attr("class", "bars")
                            //.attr("transform", function(d, i) { return "translate(0," + y(d.Name) + ")"; });

  var rects = bars_container.selectAll("rect")
       .data(topfrequency)
       .enter()
       .append("rect")
       .on("mouseover", hover)

  var rects_attr = rects
       .attr("class", "bar")
       .attr("width", function(d) { return x(d.Number_of_tweets); })
       .attr("height", y.rangeBand() - 1)
       .attr("transform", function(d) { return "translate(100," + y(d.Name) + ")"; })
       .attr("fill", function(d) {
          if (d.Nuance_Politique === "Droite") { return "blue"; }
          if (d.Nuance_Politique === "Gauche") { return "pink"; }
          if (d.Nuance_Politique === "Extr�me-Droite") { return "black"; }
          if (d.Nuance_Politique === "Extr�me-Gauche") { return "red"; }
          if (d.Nuance_Politique === "Centre") { return "orange"; }
        });

  //bars_container.selectAll("rect")
    //   .append("rect")
    //   .attr("width", function(d) { return x(d.Number_of_tweets); })
    //   .attr("height", y.rangeBand() - 1);

  var texts = bars_container.selectAll("text")
       .data(topfrequency)
       .enter()
       .append("text")

  var texts_attr = texts
       .attr("x", function(d) { return x(d.Number_of_tweets) - 3; })
       .attr("y", y.rangeBand() / 2)
       .attr("dy", ".35em")
       .text(function(d) { return d.Number_of_tweets; })
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
    d3.select(".info")
      .html(
        "<text x =" + 50 + " y=" + 20 + ">" + d.Name + "</text><br></br>" + "<text x =" + 50 + " y=" + 40 + ">" + d.Number_of_tweets + " tweets</text>" +
       "<image xlink:href=" + d.url_image + " height =" + 100 + " width=" + 100 +" y=" + 50 +" x=" + 42 +" />");
  }


});


function type(d) {
  d.Number_of_tweets = +d.Number_of_tweets; // coerce to number
  return d;
}