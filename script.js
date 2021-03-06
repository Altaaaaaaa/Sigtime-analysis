let count = 0;
$.ajax({
  url: "NewMat_Fm_Sig0.csv",
  dataType: "text",
}).done(successFunction);

$.ajax({
  url: "NewMat_Fm_Sig1.csv",
  dataType: "text",
}).done(successFunction);

$.ajax({
  url: "NewMat_Fm_Sig2.csv",
  dataType: "text",
}).done(successFunction);

$.ajax({
  url: "NewMat_FS_Sig0.csv",
  dataType: "text",
}).done(successFunction);

$.ajax({
  url: "NewMat_FS_Sig1.csv",
  dataType: "text",
}).done(successFunction);

$.ajax({
  url: "NewMat_FS_Sig2.csv",
  dataType: "text",
}).done(successFunction);

function successFunction(data) {
  var allRows = data.split(/\r?\n|\r/);
  var table = '<table frame="void" width="500px">';
  for (var singleRow = 0; singleRow < allRows.length - 1; singleRow++) {
    if (singleRow === 0) {
      table += "<thead>";
      table += '<tr class="fixed1">';
      table += "<th></th>";
      table += '<th colspan="5">Mutation count</th>';
      table += '<th colspan="5">DESeq Fold Change</th>';
      table += '<th colspan="2"></th>';
      table += "</tr>";
      table += '<tr class="fixed2">';
    } else {
      table += "<tr>";
    }
    var rowCells = allRows[singleRow].split(",");
    for (var rowCell = 1; rowCell < rowCells.length; rowCell++) {
      if (singleRow === 0) {
        table += "<th>";
        table += rowCells[rowCell];
        table += "</th>";
      } else {
        table += "<td>";
        table += rowCells[rowCell];
        table += "</td>";
      }
    }
    if (singleRow === 0) {
      table += "</tr>";
      table += "</thead>";
      table += "<tbody>";
    } else {
      table += "</tr>";
    }
  }
  table += "</tbody>";
  table += "</table>";
  $(`.table${count}`).append(table);
  count++;
}

// set the dimensions and margins of the graph
var margin = { top: 10, right: 100, bottom: 30, left: 30 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg0 = d3
  .select("#my_dataviz0")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg1 = d3
  .select("#my_dataviz1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3
  .select("#my_dataviz2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg_0 = d3
  .select("#my_dataviz_0")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg_1 = d3
  .select("#my_dataviz_1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg_2 = d3
  .select("#my_dataviz_2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

drawPlot("NewMat_Fm_Sig0_data.csv", svg0);
drawPlot("NewMat_Fm_Sig1_data.csv", svg1);
drawPlot("NewMat_Fm_Sig2_data.csv", svg2);
drawPlot("NewMat_FS_Sig0_data.csv", svg_0);
drawPlot("NewMat_FS_Sig1_data.csv", svg_1);
drawPlot("NewMat_FS_Sig2_data.csv", svg_2);

function drawPlot(name, svg) {
  d3.csv(name, function (data) {
    // console.log(data);
    // List of groups (here I have one group per column)
    var allGroup = ["mutation", "DESeq"];

    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = allGroup.map(function (grpName) {
      // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function (d) {
          return { time: d.time, value: +d[grpName] };
        }),
      };
    });
    // I strongly advise to have a look to dataReady with
    mergeData = [];
    dataReady[0].values.map((d) => mergeData.push(d.value));
    dataReady[1].values.map((d) => mergeData.push(d.value));

    maxValue = Math.max.apply(null, mergeData);
    minValue = Math.min.apply(null, mergeData);

    // A color scale: one color for each group
    var myColor = d3
      .scaleOrdinal()
      .domain(allGroup)
      .range([d3.schemeSet3[4], d3.schemePaired[8]]);

    var myColor2 = d3
      .scaleOrdinal()
      .domain(allGroup)
      .range([d3.schemeCategory10[0], d3.schemeCategory10[4]]);

    // Add X axis --> it is a date format
    var x = d3
      .scaleBand()
      .domain(["p25", "p35", "p45", "p55", "p65"])
      .range([0, width]);
    // d3.scaleLinear()
    //   .domain(["p25", "p35", "p45", "p55", "p65"])
    //   .range([ 0, width ]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([minValue - 1, maxValue + 1])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Add the lines
    var line = d3
      .line()
      .x(function (d) {
        return x(d.time) + 33;
      })
      .y(function (d) {
        return y(+d.value);
      });

    svg
      .selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("d", function (d) {
        return line(d.values);
      })
      .attr("stroke", function (d) {
        return myColor(d.name);
      })
      .style("stroke-width", 4)
      .style("fill", "none");

    // Add the points
    svg
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .enter()
      .append("g")
      .style("fill", function (d) {
        return myColor(d.name);
      })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function (d) {
        return d.values;
      })
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.time) + 33;
      })
      .attr("cy", function (d) {
        return y(d.value);
      })
      .attr("r", 5)
      .attr("stroke", "white");

    // Add a legend at the end of each line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
      .append("g")
      .append("text")
      .datum(function (d) {
        return { name: d.name, value: d.values[d.values.length - 1] };
      }) // keep only the last value of each time series
      .attr("transform", function (d) {
        return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")";
      }) // Put the text at the position of the last point
      .attr("x", 50) // shift the text a bit more right
      .text(function (d) {
        return d.name;
      })
      .style("fill", function (d) {
        return myColor2(d.name);
      })
      .style("font-size", 15);
  });
}

$(document).ready(function () {
  $("ul.tabs li").click(function () {
    var tab_id = $(this).attr("data-tab");

    $("ul.tabs li").removeClass("current");
    $(".tab-content").removeClass("current");

    $(this).addClass("current");
    $("#" + tab_id).addClass("current");
  });
});
