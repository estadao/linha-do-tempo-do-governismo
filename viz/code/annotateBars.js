function annotateBars(divName, voteIdsAnnotate, annotations, datapoints,
                      xPositionScale, yUpwardScale, yDownwardScale, parseTime) {

  // Cria anotações com base em um CSV

  // Seleciona os elementos necessários
  var div = d3.select(divName)
  var chart = div.select(".svg-container")

  // Pega os dados dos datapoints que precisam de anotações
  var annotationData = datapoints.filter(function(d){
    return voteIdsAnnotate.includes(d.voteId)
  });

  console.log(annotationData);
  console.log(annotations);

  // Coloca os elementos de ambas as listas na mesma ordem de id
  annotationData = annotationData.sort(function(a, b) {
    return a.voteId - b.voteId;
  });

  annotations = annotations.sort(function(a, b) {
    return a.voteId - b.voteId;
  });

 // Como annotationData e annotations têm o mesmo tamanho e estão 
 // ordenados, podemos fazer um laço simples para estender os objetos 
 // dessa primeira com os valores do csv de anotações

  for (i = 0; i < annotations.length; i++) {
    annotationData[i]['annLabel'] = annotations[i]['annLabel'];
    annotationData[i]['orient']   = annotations[i]['orient'];
    annotationData[i]['dx']       = annotations[i]['dx'];
    annotationData[i]['dy']       = annotations[i]['dy'];
    annotationData[i]['wrap']     = annotations[i]['wrap'];
  }

  console.log(annotationData);

  // Cria um objeto com anotações
  var annotationData = annotationData.map(function(d, i){

    if (d.orient == 'upper') {
      return {
        note: {
          label: d.annLabel,
          wrap: d.wrap, // text wrap threshold
          align: 'left', //cf. right, middle, dynamic
        },
        connector: {end: 'dot'}, // cf. arrow
        x: xPositionScale( parseTime(d.dataHoraFim) ),
        y: yUpwardScale(+d.com_governo),
        dy: d.dy, // vertical offset
        dx: d.dx,// horizontal offset
        color: "black" // send index to color scale
      }
    }

    else if (d.orient == 'lower') {
      return {
        note: {
          label: d.annLabel,
          wrap: d.wrap, // text wrap threshold
          align: 'left', //cf. right, middle, dynamic
        },
        connector: {end: 'dot'}, // cf. arrow
        x: xPositionScale( parseTime(d.dataHoraFim) ),
        y: yDownwardScale(+d.contra_governo),
        dy: d.dy, // vertical offset
        dx: d.dx,// horizontal offset
        color: "black" // send index to color scale
      }
    }

})

console.log(annotationData);

// Adiciona as anotações
const makeAnnotations = d3.annotation()
// .type(d3.annotationCalloutElbow) //cf. annotationLabel etc.
.annotations(annotationData);

// Append the annotations to the SVG 
chart.append("g")
  .attr("class", "annotation-group")
  .style("font-size", "9")
  .call(makeAnnotations);

}
