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
        var intervDatas = [];

        intervDatas = intervaloDatas(agrupamento);
        
        $.ajax({ 
            url: baselink + '/ajax/gerarGraficoFiltro', 
            type: 'POST', 
            data: {
                columns: dataTable.ajax.params(), 
                campo_group: campoGroup,
                campo_sum: 'valor_total',
                intervalo: intervDatas,
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

function intervaloDatas(nome_intervalo) {
    var hoje, dt1, dt2, dtaux, dia, mes, ano, retorno = [];

        dtaux = new Date();
        
        dia = dtaux.getDate();
        if (dia.toString().length == 1) {
            dia = "0" + dtaux.getDate();
        }
        
        mes = dtaux.getMonth() + 1;
        if (mes.toString().length == 1) {
            mes = "0" + mes;
        }
        ano = dtaux.getFullYear();

        hoje = ano + '-' + mes + '-' + dia;

        if(nome_intervalo == 'd0'){
            dt1 = hoje;
            dt2 = hoje;
        }

        if(nome_intervalo == 'd7'){
            var dtaux1 = new Date(ano, parseInt(mes) - 1, dia);            
            var dtaux2 = new Date(ano, parseInt(mes) - 1, dia);            
            dtaux1.setDate(dtaux1.getDate() - 7);
            dtaux2.setDate(dtaux2.getDate() + 7);

            dia = dtaux1.getDate();
            if (dia.toString().length == 1) {
                dia = "0" + dtaux1.getDate();
            }
            
            mes = dtaux1.getMonth() + 1;
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            ano = dtaux1.getFullYear();

            dt1 = ano + '-' + mes + '-' + dia;

            dia = dtaux2.getDate();
            if (dia.toString().length == 1) {
                dia = "0" + dtaux2.getDate();
            }
            
            mes = dtaux2.getMonth() + 1;
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            ano = dtaux2.getFullYear();

            dt2 = ano + '-' + mes + '-' + dia;

        }
        if(nome_intervalo == 'd15'){
            var dtaux1 = new Date(ano, parseInt(mes) - 1, dia);            
            var dtaux2 = new Date(ano, parseInt(mes) - 1, dia);            
            dtaux1.setDate(dtaux1.getDate() - 15);
            dtaux2.setDate(dtaux2.getDate() + 15);

            dia = dtaux1.getDate();
            if (dia.toString().length == 1) {
                dia = "0" + dtaux1.getDate();
            }
            
            mes = dtaux1.getMonth() + 1;
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            ano = dtaux1.getFullYear();

            dt1 = ano + '-' + mes + '-' + dia;

            dia = dtaux2.getDate();
            if (dia.toString().length == 1) {
                dia = "0" + dtaux2.getDate();
            }
            
            mes = dtaux2.getMonth() + 1;
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            ano = dtaux2.getFullYear();

            dt2 = ano + '-' + mes + '-' + dia;

        }
        if(nome_intervalo == 'd30'){
            var dtaux1 = new Date(ano, parseInt(mes) - 1, dia);            
            var dtaux2 = new Date(ano, parseInt(mes) - 1, dia);            
            dtaux1.setDate(dtaux1.getDate() - 30);
            dtaux2.setDate(dtaux2.getDate() + 30);

            dia = dtaux1.getDate();
            if (dia.toString().length == 1) {
                dia = "0" + dtaux1.getDate();
            }
            
            mes = dtaux1.getMonth() + 1;
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            ano = dtaux1.getFullYear();

            dt1 = ano + '-' + mes + '-' + dia;

            dia = dtaux2.getDate();
            if (dia.toString().length == 1) {
                dia = "0" + dtaux2.getDate();
            }
            
            mes = dtaux2.getMonth() + 1;
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            ano = dtaux2.getFullYear();

            dt2 = ano + '-' + mes + '-' + dia;

        }

        retorno[0] = dt1;
        retorno[1] = dt2;

        return retorno;

}