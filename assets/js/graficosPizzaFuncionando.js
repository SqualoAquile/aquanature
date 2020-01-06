var charts = [];

$(function () {

    var $selectGraf = $('#selectGraficos'),
        dataTable = window.dataTable,
        modo = "agrupar", // agrupar (doughnut, bar, horizontalBar), temporal(line, bar, combo)
        id = "#chart-div",
        tipo = "doughnut",
        ctx = document.getElementById(id.substr(1)).getContext('2d');
        
    $('.dataTable') 
        .on('draw.dt', function() {
            drawChart(id,tipo,modo);
        });

    $selectGraf
        .on('change', function() {
            
            drawChart(id,tipo,modo);
        });

    function drawChart(id, tipo) {
 
            if (!$selectGraf.val()) {
                $selectGraf.val($selectGraf.find('option:not([disabled])').first().val()).change();
            };

            var coluna = $selectGraf.val();
            var titulo = 'Agrupar registros por ' + $selectGraf.children("option:selected").text().trim();
    
            $.ajax({ 
                url: baselink + '/ajax/gerarGraficoFiltro', 
                type: 'POST', 
                data: {
                    columns: dataTable.ajax.params(), 
                    campo_group: coluna,
                    campo_sum: '',
                    modulo: currentModule
                },
                dataType: 'json', 
                success: function (resultado) { 
                   
                    if (resultado){
    
                        dataChart = [],
                        labelsChart = [];

                        var total =0;
    
                        for (var i = 0; i < resultado.length; i++) {
    
                            element = resultado[i];
                            
                            // NO COUNT O INDEX DOS ELEMENTOS VEM TROCADOS 
                            labelsChart.push(element[1] + ' - ' + parseInt(element[0]));
                            dataChart.push(parseInt(element[0]));
                        }
    
                        var config = {
                            type: tipo,
                            data: {
                                labels: labelsChart,
                                datasets: [{
                                    data: dataChart,
                                    backgroundColor: [
                                        '#2a4c6b',
                                        '#4a85b8',
                                        '#adcbe6',
                                        '#e7eff7',
                                        '#62abea'
                                    ]
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                title: {
                                    display: true,
                                    text: titulo,
                                    position: "top"
                                },
                                legend: {
                                    display: true,
                                    position: "top"
                                },
                            }
                        };
    
                        if(typeof charts[id] == "undefined") {   
                            charts[id]= new (function(){
                            this.ctx=$(id); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id].chart.destroy(); // "destroy" the "old chart"
                            charts[id].chart=new Chart(charts[id].ctx, config); // create the chart with same id and el
                        }
                    }
                }
            });

    }
});