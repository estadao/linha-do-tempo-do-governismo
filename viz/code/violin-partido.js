function drawPartyArea(party, datapath, div) {
  
  // Configura margens do svg
  var margin = { top: 30, left: 35, right: 35, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  var svg = d3.select(div)
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define escalas e geradores
  var xPositionScale = d3.scaleTime()
    .range([ 0, width ]);

  var yUpwardScale = d3.scaleLinear()
    .range([ height / 2, 0 ]);

  var yDownwardScale = d3.scaleLinear()
    .range([ (height / 2), height]);

  var parseTime = d3.timeParse("%Y-%m-%d");

  var areaUpward = d3.area()
    .curve(d3.curveBasis)
    .x0(function(d) {
      return xPositionScale( parseTime(d.dataHoraFim) ) })
    .y0(function(d) {
      return yUpwardScale(+d.com_governo) })
    .x1(function(d) {
      return xPositionScale( parseTime(d.dataHoraFim) ) })
    .y1(function(d){
      return yUpwardScale(0)
    });

    var areaDownward = d3.area()
      .curve(d3.curveBasis)
      .x0(function(d) {
        return xPositionScale( parseTime(d.dataHoraFim) ) })
      .y0(function(d) {
        return yDownwardScale(+d.contra_governo) })
      .x1(function(d) {
        return xPositionScale( parseTime(d.dataHoraFim) ) })
      .y1(function(d) {
        return yDownwardScale(0) });

  // Lê dados

  d3.queue()
    .defer(d3.csv, datapath)
    .await(ready);

  function ready(error, datapoints) {

    console.log(datapoints);

    // Define domínio das escalas
    var dates          = datapoints.map(function(d) { return parseTime(d.dataHoraFim) });
    var upwardValues   = datapoints.map(function(d) { return +d.com_governo           });
    var downwardValues = datapoints.map(function(d) { return +d.contra_governo        });

    var extentDate           = [ parseTime("2002-06-01"), parseTime("2019-01-01") ]; // Note que colocamos datas além dos nossos dados para adicionar um efeito de padding
    var extentUpwardValues   = [ 0, 100 * 1.2 ]; // 20% além do valor estipulado
    var extentDownwardValues = [ 0, 100 * 1.2 ];

    xPositionScale.domain( extentDate );
    yUpwardScale.domain( extentUpwardValues );
    yDownwardScale.domain( extentDownwardValues );

    // Adiciona paths
    svg.append("path")
      .datum(datapoints)
      .attr("fill", "#b9e5e1")
      // .attr("stroke", "#b9e5e1")
      .attr("d", areaUpward);

    svg.append("path")
      .datum(datapoints)
      .attr("fill", "#e0bedf")
      // .attr("stroke", "#e0bedf")
      .attr("d", areaDownward);

    // Adiciona eixos
    var yAxisUp = d3.axisLeft(yUpwardScale)
      .tickPadding([10])
      .tickValues([0, 25, 50, 75, 100]);

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxisUp)
      .select(".domain").remove();

    var yAxisDown = d3.axisLeft(yDownwardScale)
      .tickPadding([10])
      .tickValues([0, 25, 50, 75, 100]);

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxisDown)
      .select(".domain").remove();

    var xAxis = d3.axisBottom(xPositionScale)
      .tickSizeInner(-height/2)
      .tickValues(d3.timeMonth.range(new Date(2003, 0, 1), new Date(2020, 0, 1), 12))
      .tickFormat(d3.timeFormat("%y"));

   svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .select(".domain").remove();

    // Estiliza eixos

    // Modifica texto do primeiro e último tick
    svg.select(".x-axis .tick:first-child text")
      .text("2003");

    // Modifica texto do primeiro e último tick
    svg.select(".x-axis .tick:last-child text")
      .text("2019");

    // Modifica posição do tick central
    svg.selectAll(".x-axis .tick line")
      .attr("y1", -(yDownwardScale(100)))
      .attr("y2", -(yUpwardScale(100)));

    // TO DO
    // Adiciona título baseado no nome do partido


  }

}