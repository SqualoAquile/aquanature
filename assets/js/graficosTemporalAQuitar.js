var charts2 = [];

$(function () {

    var $selectGrafTemporal = $('#selectGraficosTemporal'),
        $selectGrafOpcoes = $('#selectGrafOpcoes2'),
        dataTable = window.dataTable,
        modo = "agrupar", // agrupar (doughnut, bar, horizontalBar), temporal(line, bar, combo)
        id = "#chart-div3",
        tipo = "bar",
        ctx = document.getElementById(id.substr(1)).getContext('2d');

    $('.dataTable') 
        .on('draw.dt', function() {
            drawChart2(id,tipo);
        });

    $selectGrafTemporal
        .on('change', function() {
            drawChart2(id,tipo);
        });

    $selectGrafOpcoes
        .on('change', function() {
            drawChart2(id,tipo);
        });

    function drawChart2(id, tipo) {
        var coluna, titulo, intervalo = [];

            if (!$selectGrafTemporal.val() && !$selectGrafOpcoes.val() ) {

                $selectGrafTemporal.val($selectGrafTemporal.find('option:not([disabled])').first().val()).change();
                $selectGrafOpcoes.val($selectGrafOpcoes.find('option:not([disabled])').first().val()).change();
            };

            coluna = "data_vencimento";
            titulo = 'Fluxo de Caixa A Realizar de hoje até ' + $selectGrafOpcoes.children("option:selected").text().trim() +'.';
            intervalo = intervaloDatas2($selectGrafOpcoes.val());
            
            $.ajax({ 
                url: baselink + '/ajax/gerarGraficoFiltroIntervaloDatas2', 
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
    
                        if(typeof charts2[id] == "undefined") {   
                            charts2[id]= new (function(){
                            this.ctx=$(id); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts2[id].chart.destroy();
                            charts2[id].chart=new Chart(charts2[id].ctx, config); 
                        }
                    }
                }
            });

    }
});

function intervaloDatas2(intervalo) {
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
            k=1;
            for(i = 1; i < parseInt(intervalo)  ; i++){
                dtaux1 = new Date(ano, parseInt(mes) - 1, dia); 
                dtaux1.setDate(dtaux1.getDate() + i);
                
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
        
        retorno[0] = hoje;
        
        return retorno;

}