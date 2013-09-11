/* global _ */

var listToArray = function(xs) {
  var pair = xs;
  var kar = xs[0];
  var a = [];

  while(pair.length == 2) {
    a.push(pair[0]);
    pair = pair[1];
  }
  return a;
};

_hist = function(samps) {

  // TODO: this is a hack. we want proper conversion of data types
  var values = listToArray(samps),
      n = values.length,
      counts = _(values)
        .uniq()
        .map(function(val) {
          return {
            value: val,
            freq: _(values).filter(function(x) { return x == val}).length / n
          };
        }),
      maxFreq = _(counts).chain().map(function(x) { return x.freq}).max().value();

  return function($div) {

    var div = $div[0];
    
    //var margin = {top: 20, right: 20, bottom: 30, left: 40},
    var margin = {top: 20, right: 20, bottom: 50, left: 20},
        width = 0.8 * $div.width() - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");

/*    var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
          .range([height, 0]);*/
    var x = d3.scale.linear()
          .domain([0, maxFreq])
          .range([0, width]);
    var y = d3.scale.ordinal()
          .domain(values)
          .rangeRoundBands([height, 0], .1);

/*    var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

    var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(formatPercent);*/
    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom")
                  .tickFormat(formatPercent);
    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left");

    var svg = d3.select(div).append("svg")
          .attr("class", "chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height+ margin.top + margin.bottom)
          .style('margin-left', '10%')
          .style('margin-top', '20px')
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // d3.tsv("data.tsv", type, function(error, data) {
    //   debugger;
    //   x.domain(data.map(function(d) { return d.letter; }));
    //   y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

/*    y.domain( values );
    x.domain( [0, maxFreq] );*/
    
    var data = counts;

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .text("Frequency")
      .attr("dy", "3em");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

/*    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.value); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.freq); })
      .attr("height", function(d) { return height - y(d.freq); });*/
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("y", function(d) {return y(d.value);})
      .attr("width", function(d) { return width - x(d.freq); })
      .attr("height", y.rangeBand());
    // });

    return data;

  };

};