function highlightBars(divName, voteIds) {

var div = d3.select(divName);

var chart = div.select(".svg-container");

chart.selectAll("rect")
  .attr("fill", function(d) {

    var standardColor = d3.select(this).attr("fill");
    var thisClass     = d3.select(this).attr("class");

    if (thisClass == 'upper-bar') {
      var darkerColor  = "#47bbb0";
      var lighterColor = "#d6f0ed";
    }
    else {
      var darkerColor  = "#ad54ab";
      var lighterColor = "#edd9ec";
    }

    //console.log(voteIds, standard, d.voteId);

    if (voteIds.includes(d.voteId)) {
      return darkerColor;
    }
    else {
      return lighterColor;
    }
  })
  .each(function(d){

    if (voteIds.includes(d.voteId)) {
      d3.select(this).raise();
    }

  })


}
