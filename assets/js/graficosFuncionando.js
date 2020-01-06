$(function () {

    var $selectGraf = $('#selectGraficos'),
        dataTable = window.dataTable,
        ctx = document.getElementById('fluxocaixaGrafico').getContext('2d');

        // ainda nao esta pronto o dataTable
    $('.dataTable')
        .on('draw.dt', function() {
            drawChart();
        });

    $selectGraf
        .on('change', function() {
            drawChart();
        });

    function drawChart() {

        if (!$selectGraf.val()) {
            $selectGraf.val($selectGraf.find('option:not([disabled])').first().val()).change();
        };

        var group = $selectGraf.val();

        $.ajax({ 
            url: baselink + '/ajax/gerarGraficoFiltro', 
            type: 'POST', 
            data: {
                columns: dataTable.ajax.params(), 
                campo_group: group,
                campo_sum: 'valor_total'
            },
            dataType: 'json', 
            success: function (resultado) { 

                if (resultado.data){

                    dataChart = [],
                    labelsChart = [];

                    for (var i = 0; i < resultado.data.length; i++) {

                        var result = resultado.data,
                        element = result[i];
                        
                        labelsChart.push(element[0]);
                        dataChart.push(parseInt(element[1]));

                    }

                    var fluxocaixaGrafico = new Chart(ctx, {
                        type: 'doughnut',
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
                        }
                    });
                }
            }
        });
    }
});