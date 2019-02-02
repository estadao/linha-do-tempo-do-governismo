 function drawAllPartiesBars(datapath, annotations, div, voteIdsHighlight, voteIdsAnnotate) {
  

  // Configura margens do svg
  var margin = { top: 30, left: 35, right: 35, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  var svg = d3.select(div)
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("class", "svg-container")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define escalas e geradores
  var xPositionScale = d3.scaleTime()
    .range([ 0, width ]);

  var heightScale = d3.scaleLinear()
    .range([ 0, height / 2 ]);

  var yUpwardScale = d3.scaleLinear()
    .range([ height / 2, 0 ]);

  var yDownwardScale = d3.scaleLinear()
    .range([ (height / 2), height ]);

  var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");


  // Lê dados

  d3.queue()
    .defer(d3.csv, datapath)
    .defer(d3.csv, annotations)
    .await(ready);

  function ready(error, datapoints, annotations) {

    console.log(datapoints);
    console.log(annotations);

    // Define domínio das escalas
    var dates          = datapoints.map(function(d) { return parseTime(d.dataHoraFim) });
    var upwardValues   = datapoints.map(function(d) { return +d.com_governo           });
    var downwardValues = datapoints.map(function(d) { return +d.contra_governo        });

    var extentDate           = [ parseTime("2002-06-01 00:00:00"), parseTime("2019-01-01 00:00:00") ]; // Note que colocamos datas além dos nossos dados para adicionar um efeito de padding
    var extentValues         = [ 0, 513 * 1.2 ]; // 20% além do valor estipulado

    xPositionScale.domain( extentDate );
    yUpwardScale.domain( extentValues );
    yDownwardScale.domain( extentValues );
    heightScale.domain( extentValues )

    /* Esses gráficos vão crescer "para baixo", devido 
    ao comportamento dos elementos 'rect' de svg.
    Primeiro posicionamos as barras na altura correta 
    e depois calculamos quanto elas precisam descer até
    o ponto que representa o valor zero. */

    // Adiciona paths
    svg.selectAll(".bar")
      .data(datapoints)
      .enter().append("rect")
      .attr("class", "upper-bar")
      .attr("voteId", function(d){
        return d.voteId;
      })
      .attr("x", function(d){
        return xPositionScale(parseTime(d.dataHoraFim));
      })
      .attr("y", function(d){
        return yUpwardScale(+d.com_governo);
      })
      .attr("height", function(d){
        return heightScale(+d.com_governo);
      })
      .attr("width", 2)
      .attr("fill", "#b9e5e1")
      .attr("opacity", 1);

    // Adiciona paths
    svg.selectAll(".bar")
      .data(datapoints)
      .enter().append("rect")
      .attr("class", "down-bar")
      .attr("voteId", function(d){
        return d.voteId;
      })
      .attr("x", function(d){
        return xPositionScale(parseTime(d.dataHoraFim))
      })
      .attr("y", function(d){
        return yDownwardScale(0) // A posição base é o centro do gráfico
      })
      .attr("width", 2)
      .attr("height", function(d){
        return heightScale(+d.contra_governo) // A altura é o quanto precisa descer
      })
      .attr("fill", "#e0bedf")
      .attr("opacity", 1);

    // Adiciona eixos
    var yAxisUp = d3.axisLeft(yUpwardScale)
      .tickPadding([10])
      .tickValues([0, 125, 250, 375, 500]);

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxisUp)
      .select(".domain").remove();

    var yAxisDown = d3.axisLeft(yDownwardScale)
      .tickPadding([10])
      .tickValues([0, 125, 250, 375, 500]);

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
      .attr("y1", -(yDownwardScale(500)))
      .attr("y2", -(yUpwardScale(500)));

    // Adiciona marcas de maioria absoluta, PEC e impeachment
    
    svg.append("line")
      .attr("class", "height-marker")
      .attr("x1", xPositionScale(parseTime("2003-01-01 00:00:00")))
      .attr("x2", xPositionScale(parseTime("2018-12-31 00:00:00")))
      .attr("y1", yUpwardScale(513 / 3 * 2))
      .attr("y2", yUpwardScale(513 / 3 * 2))
    svg.append("text")
      .text("2/3")
      .attr("class", "height-marker")
      .attr("x", xPositionScale(parseTime("2019-02-01 00:00:00")))
      .attr("dx", 3)
      .attr("y", yUpwardScale(513 / 3 * 2))
      .attr("dy", 3)


    svg.append("line")
      .attr("class", "height-marker")
      .attr("x1", xPositionScale(parseTime("2003-01-01 00:00:00")))
      .attr("x2", xPositionScale(parseTime("2018-12-31 00:00:00")))
      .attr("y1", yUpwardScale(513 / 5 * 3))
      .attr("y2", yUpwardScale(513 / 5 * 3))
    svg.append("text")
      .text("3/5")
      .attr("class", "height-marker")
      .attr("x", xPositionScale(parseTime("2019-02-01 00:00:00")))
      .attr("dx", 3)
      .attr("y", yUpwardScale(513 / 5 * 3))
      .attr("dy", 3)


    svg.append("line")
      .attr("class", "height-marker")
      .attr("x1", xPositionScale(parseTime("2003-01-01 00:00:00")))
      .attr("x2", xPositionScale(parseTime("2018-12-31 00:00:00")))
      .attr("y1", yUpwardScale(513 / 2))
      .attr("y2", yUpwardScale(513 / 2))
    svg.append("text")
      .text("1/2")
      .attr("class", "height-marker")
      .attr("x", xPositionScale(parseTime("2019-02-01 00:00:00")))
      .attr("dx", 3)
      .attr("y", yUpwardScale(513 / 2))
      .attr("dy", 3)

    if (voteIdsHighlight) {
      highlightBars(div, voteIdsHighlight);
    }

    if (voteIdsAnnotate) {
      annotateBars(div, voteIdsAnnotate, annotations, datapoints, 
                   xPositionScale, yUpwardScale, yDownwardScale, parseTime);
    }

  }

}