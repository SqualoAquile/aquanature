var charts = [];

$(function () {

    var $botaoGraficos = $('#graficos'),
        
        dataTable = window.dataTable,
        modo = "agrupar", // agrupar (doughnut, bar, horizontalBar), temporal(line, bar, combo)
        id = "#chart-div2",
        ctx = document.getElementById(id.substr(1)).getContext('2d');

    $('.dataTable') 
        .on('draw.dt', function() {
            drawChart(id); 
        });
    
    $('.input-filtro-faixa').on('change',function(){
        drawChart(id); 
    });


    function drawChart(id) {
        var coluna, titulo, dt1,dt2;

            coluna = "mes_ref";
            dt1 = $('.input-filtro-faixa').siblings('.min').val();
            dt2 = $('.input-filtro-faixa').siblings('.max').val();
            titulo = 'Balanço de Saldos';

            $.ajax({ 
                url: baselink + '/ajax/gerarGraficoSaldos', 
                type: 'POST', 
                data: {
                    columns: dataTable.ajax.params(), 
                    coluna: 'mes_ref',
                    dt1: dt1,
                    dt2: dt2,
                    modulo: currentModule
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){
                        var eixoDatas = [], saldo_total_final = [];

                        for (var i = 0; i < resultado.length; i++) {
                            eixoDatas[i] = resultado[i][0];
                            saldo_total_final[i] =  parseFloat(parseFloat(resultado[i][1])); 
                        }
                        
                        var config = {
                            type: 'bar',
                            data: {
                                labels: eixoDatas,
                                datasets: [  {
                                    type: 'bar',
                                    label: 'Saldo Final',
                                    backgroundColor: 'green',
                                    data: saldo_total_final,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                animation: false,
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
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }
                        }
    
                        if(typeof charts[id] == "undefined") {   
                            charts[id]= new (function(){
                            this.ctx=$(id); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id].chart.destroy();
                            charts[id].chart=new Chart(charts[id].ctx, config); 
                        }
                    }
                }
            });

    }
});

function intervaloDatas(intervalo) {
    var hoje, dtaux, dtaux1, dia, mes, ano, dia1, mes1, ano1, retorno = [];

        // calculando o valor de HOJE
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

        // criando o array de DATAS

        if(parseInt(intervalo) != parseInt(0)){
            k=0;
            for(i = parseInt(intervalo) ; i > 0 ; i--){
                dtaux1 = new Date(ano, parseInt(mes) - 1, dia); 
                dtaux1.setDate(dtaux1.getDate() - i);

                dia1 = dtaux1.getDate();
                if (dia1.toString().length == 1) {
                    dia1 = "0" + dtaux1.getDate();
                }
                
                mes1 = dtaux1.getMonth() + 1;
                if (mes1.toString().length == 1) {
                    mes1 = "0" + mes1;
                }
                ano1 = dtaux1.getFullYear();

                retorno[k] = ano1 + '-' + mes1 + '-' + dia1;
                k++;
            }
        }
        
        retorno[parseInt(intervalo)] = hoje;

        return retorno;

}