(function(){
  
  // Primeiro, gráficos de toda a Câmara
  drawAllPartiesArea("./data/todos6m.csv", "#area-chart-all-parties");
  drawAllPartiesBars("./data/todos-barras.csv",  // datapoints
                     "./data/annotations/todos-barras-ann.csv", // annotations
                     "#bar-chart-all-parties", // div
                     ['0001', '0002', '0003', '0004', '0005', '1932', '1940', '2116', '2121', '7214', '7252', '7492'], // highlight
                     ['0001', '0002', '0003', '0004', '1932', '2116', '7214', '7492']); // annotations

  // Desenha gráficos duplos para os partidos mais importantes
  // Note que não há dados da CPMF para estes

  // PT
  drawPartyArea("PT", "./data/pt6m.csv", "#area-chart-pt");
  drawPartyBars( "PT",
                "./data/pt-barras.csv", 
                "./data/annotations/pt-barras-ann.csv", // annotations
                "#bar-chart-pt",
                ['1936', '1940', '2642', '6489'],
                ['1940', '2642', '6489']);

  // PSDB
    drawPartyArea("PSDB", "./data/psdb6m.csv", "#area-chart-psdb");
  drawPartyBars("PSDB", 
                "./data/psdb-barras.csv", 
                "./data/annotations/psdb-barras-ann.csv", // annotations
                "#bar-chart-psdb",
                ['1932', '1940', '2116', '2121', '6088', '6598'],
                ['1940', '2121', '6088', '6598'],
                "#bar-chart-psdb");

  // PMDB
  drawPartyArea("MDB", "./data/mdb6m.csv", "#area-chart-mdb");
  drawPartyBars("MDB", 
                "./data/mdb-barras.csv", 
                "",
                "#bar-chart-mdb",
                
                [
                // Reformas de Lula
                '1932', '1940', '2116', '2121',
                // Impeachment & denúncias
                '0001','0002', '0003',
                  // MP dos Portos
                 '5332', '5333','5334','5337','5341','5344','5349',
                 '5353','5357','5359','5360','5363','5364','5368',
                 '5370','5373','5376','5380','5383','5388']);

  // PSL
  drawPartyArea("PSL", "./data/psl6m.csv", "#area-chart-psl");
  drawPartyBars("PSL", "./data/psl-barras.csv", "#bar-chart-psl");

  // PP
  drawPartyArea("PP", "./data/pp6m.csv", "#area-chart-pp");
  drawPartyBars("PP", "./data/pp-barras.csv", "#bar-chart-pp");

  // PR
  drawPartyArea("PR", "./data/pr6m.csv", "#area-chart-pr");
  drawPartyBars("PR", "./data/pr-barras.csv", "#bar-chart-pr");

  // PSB
  drawPartyArea("PSB", "./data/psb6m.csv", "#area-chart-psb");
  drawPartyBars("PSB", "./data/psb-barras.csv", "#bar-chart-psb");

  // PRB
  drawPartyArea("PRB", "./data/prb6m.csv", "#area-chart-prb");
  drawPartyBars("PRB", "./data/prb-barras.csv", "#bar-chart-prb");

  // DEM
  drawPartyArea("DEM", "./data/dem6m.csv", "#area-chart-dem");
  // drawPartyBars("DEM", "./data/dem-barras.csv", "#bar-chart-dem");

  // PDT
  drawPartyArea("PDT", "./data/pdt6m.csv", "#area-chart-pdt");
  drawPartyBars("PDT", "./data/pdt-barras.csv", "#bar-chart-pdt");

  // SD
  drawPartyArea("SD", "./data/sd6m.csv", "#area-chart-sd");
  drawPartyBars("SD", "./data/sd-barras.csv", "#bar-chart-sd");

  // PODEMOS
  drawPartyArea("Pode", "./data/pode6m.csv", "#area-chart-pode");
  drawPartyBars("Pode", "./data/pode-barras.csv", "#bar-chart-pode");

  // PTB
  drawPartyArea("PTB", "./data/ptb6m.csv", "#area-chart-ptb");
  drawPartyBars("PTB", "./data/ptb-barras.csv", "#bar-chart-ptb");

  // PSOL
  drawPartyArea("PSOL", "./data/psol6m.csv", "#area-chart-psol");
  drawPartyBars("PSOL", "./data/psol-barras.csv", "#bar-chart-psol");

  // PCdoB
  drawPartyArea("PCdoB", "./data/pcdob6m.csv", "#area-chart-pcdob");
  drawPartyBars("PCdoB", "./data/pcdob-barras.csv", "#bar-chart-pcdob");

  // PSC
  drawPartyArea("PSC", "./data/psc6m.csv", "#area-chart-psc");
  drawPartyBars("PSC", "./data/psc-barras.csv", "#bar-chart-psc");

  // PROS
  drawPartyArea("PROS", "./data/pros6m.csv", "#area-chart-pros");
  drawPartyBars("PROS", "./data/pros-barras.csv", "#bar-chart-pros");

  // PPS
  drawPartyArea("PPS", "./data/pps6m.csv", "#area-chart-pps");
  drawPartyBars("PPS", "./data/pps-barras.csv", "#bar-chart-pps");



})();