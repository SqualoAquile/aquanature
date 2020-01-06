var charts = [];

$(function () {

    var $selectGrafTemporal = $('#selectGraficosTemporal'),
        $selectGrafOpcoes = $('#selectGrafOpcoes'),
        dataTable = window.dataTable,
        modo = "agrupar", // agrupar (doughnut, bar, horizontalBar), temporal(line, bar, combo)
        id = "#chart-div2",
        tipo = "bar",
        ctx = document.getElementById(id.substr(1)).getContext('2d');

    $('.dataTable') 
        .on('draw.dt', function() {
            drawChart(id,tipo);
        });

    $selectGrafTemporal
        .on('change', function() {
            drawChart(id,tipo);
        });

    $selectGrafOpcoes
        .on('change', function() {
            drawChart(id,tipo);
        });

    function drawChart(id, tipo) {
        var coluna, titulo, intervalo = [];

            if (!$selectGrafTemporal.val() && !$selectGrafOpcoes.val() ) {

                $selectGrafTemporal.val($selectGrafTemporal.find('option:not([disabled])').first().val()).change();
                $selectGrafOpcoes.val($selectGrafOpcoes.find('option:not([disabled])').first().val()).change();
            };

            coluna = "data_quitacao";
            titulo = 'Fluxo de Caixa Realizado de ' + $selectGrafOpcoes.children("option:selected").text().trim() +' até hoje.';
            intervalo = intervaloDatas($selectGrafOpcoes.val());
            
            $.ajax({ 
                url: baselink + '/ajax/gerarGraficoFiltroIntervaloDatas', 
                type: 'POST', 
                data: {
                    columns: dataTable.ajax.params(), 
                    coluna: coluna,
                    intervalo: intervalo,
                    modulo: currentModule
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){    
                        var eixoDatas = [], receitas = [], despesas = [], result = [], resultAcul = [];

                        for (var i = 0; i < Object.keys(resultado[0]).length; i++) {
                            eixoDatas[i] = Object.keys(resultado[0])[i];
                            despesas[i] =  parseFloat(parseFloat(-1) * parseFloat(Object.values(resultado[0])[i]));
                            receitas[i] = parseFloat(Object.values(resultado[1])[i]);
                            result[i] = parseFloat(parseFloat(Object.values(resultado[1])[i]) - parseFloat(Object.values(resultado[0])[i]));
                            if(i == 0){
                                resultAcul[i] = parseFloat(result[i]).toFixed(2);    
                            }else{
                                resultAcul[i] = parseFloat(parseFloat(resultAcul[i-1]) + parseFloat(result[i])).toFixed(2);      
                            }   
                            
                        }
                        
                        var config = {
                            type: 'bar',
                            data: {
                                labels: eixoDatas,
                                datasets: [{
                                    type: 'line',
                                    label: 'Resultado Acumulado',
                                    backgroundColor: 'black',
                                    fill:false,
                                    data: resultAcul,
                                    borderColor: 'black',
                                    borderWidth: 3
                                },{
                                    type: 'line',
                                    label: 'Resultado',
                                    backgroundColor: 'blue',
                                    fill:false,
                                    data: result,
                                    borderColor: 'blue',
                                    borderWidth: 2
                                }, {
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