$(function () {

    var $selectGraf = $('#selectGraficosTemporal'),
        $selectGrafOpcoes = $('#selectGrafOpcoes'),
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

    $selectGrafOpcoes
    .on('change', function() {
        drawChart();
    });

    function drawChart() {

        if (!$selectGraf.val()) {
            $selectGraf.val($selectGraf.find('option:not([disabled])').first().val()).change();
        };

        if (!$selectGrafOpcoes.val()) {
            $selectGrafOpcoes.val($selectGrafOpcoes.find('option:not([disabled])').first().val());
        };

        var campoGroup = $selectGraf.val();
        var agrupamento = $selectGrafOpcoes.val();

        $.ajax({ 
            url: baselink + '/ajax/gerarGraficoFiltro', 
            type: 'POST', 
            data: {
                columns: dataTable.ajax.params(), 
                campo_group: campoGroup,
                campo_sum: 'valor_total',
                opcao_group: agrupamento
            },
            dataType: 'json', 
            success: function (resultado) {

                if (resultado){

                    var eixoDatas = [], receitas = [], despesas = [];

                    for (var i = 0; i < resultado[0].length; i++) {
                        
                        dataAux = resultado[0][i][0];
                        dataAux = dataAux.split('-').reverse().join('/');
                        eixoDatas[i] = dataAux;
                        despesas[i] = resultado[0][i][1];
                        receitas[i] = resultado[1][i][1];
                        
                    }
                    
                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: eixoDatas,
                            datasets: [{
                                type: 'bar',
                                label: 'Despesas',
                                backgroundColor: 'red',
                                data: despesas,
                                borderColor: 'white',
                                borderWidth: 1
                            }, {
                                type: 'bar',
                                label: 'Receitas',
                                backgroundColor: 'green',
                                data: receitas,
                                borderColor: 'white',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:false
                                    }
                                }]
                            }
                        }
                    });
                }
            }
        });
    }
});