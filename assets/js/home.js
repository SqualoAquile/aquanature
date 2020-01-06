var charts = [];

$(function () {
   
    var $selectGrafTemporal = $('#selectGraficosTemporais'),
        $selectGrafVendas = $('#selectGraficosVendas'),
        id1 = "#chart-div2",
        id2 = "#chart-div3",
        id3 = "#graf_despesa_analitica",
        id4 = "#graf_receita_analitica",
        id5 = "#graf_saldos",
        id6 = "#graf_saldosAno",
        id7 = "#orcVendas",
        ctx = document.getElementById(id1.substr(1)).getContext('2d');

    $selectGrafTemporal
        .val(7)
        .on('change', function() {
            fluxoCaixa_Realizado_Previsto();
            receita_despesa_analitica();
            grafico_saldos();
            lancamentos_vencidos();
        })
        .change();
    

    function fluxoCaixa_Realizado_Previsto() {
        var titulo, titulo2, intervalo = [], intervalo2 = [];
        var $receitaRealizada = $("#receita_realizada");
        var $despesaRealizada = $("#despesa_realizada");
        var $lucroRealizado = $("#lucro_realizado");
        var $lucratividadeRealizada = $("#lucratividade_realizada");

        var $receitaPrevista = $("#receita_prevista");
        var $despesaPrevista = $("#despesa_prevista");
        var $lucroPrevisto = $("#lucro_previsto");
        var $lucratividadePrevista = $("#lucratividade_prevista");


            if (!$selectGrafTemporal.val() ) {
                $selectGrafTemporal.val($selectGrafTemporal.find('option:not([disabled])').first().val()).change();
            };

            //// FLUXO DE CAIXA REALIZADO
            titulo = 'Fluxo de Caixa Realizado de ' + $selectGrafTemporal.children("option:selected").text().trim() +' até hoje.';
            intervalo = intervaloDatasRealizado($selectGrafTemporal.val());

            ///// GRÁFICO FLUXO CAIXA REALIZADO
            $.ajax({ 
                url: baselink + '/ajax/graficoFluxoCaixaRealizado', 
                type: 'POST', 
                data: {
                    intervalo: intervalo,
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){   
                         
                        var eixoDatas = [], receitas = [], despesas = [], result = [], resultAcul = [];
                        var recReal = parseFloat(0), despReal = parseFloat(0), lucroReal = parseFloat(0), lucrativReal = parseFloat(0);
                        
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
                            
                            despReal = despReal + parseFloat(Object.values(resultado[0])[i]);
                            recReal = recReal + parseFloat(Object.values(resultado[1])[i]);                         
                        }

                        lucroReal = recReal - despReal;
                        lucrativReal = parseFloat(lucroReal / recReal) * 100;

                        $receitaRealizada.text( 'R$ ' + floatParaPadraoBrasileiro(recReal) );
                        $despesaRealizada.text( 'R$ ' + floatParaPadraoBrasileiro(despReal) );
                        $lucroRealizado.text( 'R$ ' + floatParaPadraoBrasileiro(lucroReal) );
                        $lucratividadeRealizada.text( floatParaPadraoBrasileiro(lucrativReal) + ' %' );

                        var config = {
                            type: 'bar',
                            data: {
                                labels: eixoDatas,
                                datasets: [{
                                    type: 'line',
                                    label: 'Resultado Acumulado',
                                    backgroundColor: '#020627',
                                    fill:false,
                                    data: resultAcul,
                                    borderColor: '#020627',
                                    borderWidth: 3
                                },{
                                    type: 'line',
                                    label: 'Resultado',
                                    backgroundColor: '#17bae8',
                                    fill:false,
                                    data: result,
                                    borderDash: [10,5],
                                    borderColor: '#17bae8',
                                    borderWidth: 2
                                }, {
                                    type: 'bar',
                                    label: 'Despesas',
                                    backgroundColor: '#418fe2',
                                    data: despesas,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }, {
                                    type: 'bar',
                                    label: 'Receitas',
                                    backgroundColor: '#064c92',
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
    
                        if(typeof charts[id1] == "undefined") {   
                            charts[id1]= new (function(){
                            this.ctx=$(id1); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id1].chart.destroy();
                            charts[id1].chart=new Chart(charts[id1].ctx, config); 
                        }
                    }
                }
            });

            /////  FLUXO DE CAIXA PREVISTO
            titulo2 = 'Fluxo de Caixa Previsto de hoje até ' + $selectGrafTemporal.children("option:selected").text().trim() +'.';
            intervalo2 = intervaloDatasAQuitar($selectGrafTemporal.val());

            $.ajax({ 
                url: baselink + '/ajax/graficoFluxoCaixaPrevisto', 
                type: 'POST', 
                data: {
                    intervalo: intervalo2,
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){   
                         
                        var eixoDatas2 = [], receitas2 = [], despesas2 = [], result2 = [], resultAcul2 = [];
                        var recPrev = parseFloat(0), despPrev = parseFloat(0), lucroPrev = parseFloat(0), lucrativPrev = parseFloat(0);
                        
                        for (var i = 0; i < Object.keys(resultado[0]).length; i++) {
                            eixoDatas2[i] = Object.keys(resultado[0])[i];
                            despesas2[i] =  parseFloat(parseFloat(-1) * parseFloat(Object.values(resultado[0])[i]));
                            receitas2[i] = parseFloat(Object.values(resultado[1])[i]);
                            result2[i] = parseFloat(parseFloat(Object.values(resultado[1])[i]) - parseFloat(Object.values(resultado[0])[i]));
                            if(i == 0){
                                resultAcul2[i] = parseFloat(result2[i]).toFixed(2);    
                            }else{
                                resultAcul2[i] = parseFloat(parseFloat(resultAcul2[i-1]) + parseFloat(result2[i])).toFixed(2);      
                            }   
                            
                            despPrev = despPrev + parseFloat(Object.values(resultado[0])[i]);
                            recPrev = recPrev + parseFloat(Object.values(resultado[1])[i]);                         
                        }

                        lucroPrev = recPrev - despPrev;
                        lucrativPrev = parseFloat(lucroPrev / recPrev) * 100;

                        $receitaPrevista.text( 'R$ ' + floatParaPadraoBrasileiro(recPrev) );
                        $despesaPrevista.text( 'R$ ' + floatParaPadraoBrasileiro(despPrev) );
                        $lucroPrevisto.text( 'R$ ' + floatParaPadraoBrasileiro(lucroPrev) );
                        $lucratividadePrevista.text( floatParaPadraoBrasileiro(lucrativPrev) + ' %' );

                        var config = {
                            type: 'bar',
                            data: {
                                labels: eixoDatas2,
                                datasets: [{
                                    type: 'line',
                                    label: 'Resultado Acumulado',
                                    backgroundColor: '#020627',
                                    fill:false,
                                    data: resultAcul2,
                                    borderColor: '#020627',
                                    borderWidth: 3
                                },{
                                    type: 'line',
                                    label: 'Resultado',
                                    backgroundColor: '#17bae8',
                                    fill:false,
                                    data: result2,
                                    borderDash: [10,5],
                                    borderColor: '#17bae8',
                                    borderWidth: 2
                                }, {
                                    type: 'bar',
                                    label: 'Despesas',
                                    backgroundColor: '#418fe2',
                                    data: despesas2,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }, {
                                    type: 'bar',
                                    label: 'Receitas',
                                    backgroundColor: '#064c92',
                                    data: receitas2,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                title: {
                                    display: true,
                                    text: titulo2,
                                    position: "top"
                                },
                                legend: {
                                    display: true,
                                    position: "top"
                                },
                            }
                        }
    
                        if(typeof charts[id2] == "undefined") {   
                            charts[id2]= new (function(){
                            this.ctx=$(id2); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id2].chart.destroy();
                            charts[id2].chart=new Chart(charts[id2].ctx, config); 
                        }
                    }
                }
            });

    }

    function receita_despesa_analitica() {
        var titulo, titulo2, intervalo = [];

            if (!$selectGrafTemporal.val() ) {
                $selectGrafTemporal.val($selectGrafTemporal.find('option:not([disabled])').first().val()).change();
            };

            //// DESPESAS ANALÍTICAS REALIZADAS
            titulo = 'Despesas Separadas por Conta Analítica de ' + $selectGrafTemporal.children("option:selected").text().trim() +' até hoje.';
            titulo2 = 'Receitas Separadas por Conta Analítica de ' + $selectGrafTemporal.children("option:selected").text().trim() +' até hoje.';
            intervalo = intervaloDatasRealizado($selectGrafTemporal.val());

            ///// despesas e receitas agrupadas por conta analítica
            $.ajax({ 
                url: baselink + '/ajax/graficoReceitaDespesaAnalitica', 
                type: 'POST', 
                data: {
                    intervalo: intervalo,
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){   

                        var labelsDespesa = [], valoresDespesa = [], coresDespesa = [];
                        var labelsReceita = [], valoresReceita = [], coresReceita = [];
                    
                        labelsDespesa = Object.keys( resultado[0] );
                        valoresDespesa = Object.values( resultado[0] );
                        coresDespesa = ['#022346','#359db5','#0b7bff','#1e43af','#17bae8'];
                        
                        labelsReceita = Object.keys( resultado[1] );
                        valoresReceita = Object.values( resultado[1] );
                        coresReceita = ['#022346','#0b7bff'];
                        
                        var config = {
                            type: 'doughnut',
                            data: {
                                datasets: [{
                                    data: valoresDespesa,
                                    backgroundColor: coresDespesa,
                                }],
                                labels: labelsDespesa
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    position: 'right',
                                },
                                title: {
                                    display: true,
                                    text: titulo
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }
                            }
                        };
    
                        if(typeof charts[id3] == "undefined") {   
                            charts[id3]= new (function(){
                            this.ctx=$(id3); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id3].chart.destroy();
                            charts[id3].chart=new Chart(charts[id3].ctx, config); 
                        }

                        var config = {
                            type: 'doughnut',
                            data: {
                                datasets: [{
                                    data: valoresReceita,
                                    backgroundColor: coresReceita,
                                }],
                                labels: labelsReceita
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    position: 'right',
                                },
                                title: {
                                    display: true,
                                    text: titulo2
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }
                            }
                        };
    
                        if(typeof charts[id4] == "undefined") {   
                            charts[id4]= new (function(){
                            this.ctx=$(id4); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id4].chart.destroy();
                            charts[id4].chart=new Chart(charts[id4].ctx, config); 
                        }
                    }
                }
            });            
    }

    function grafico_saldos() {
        var titulo, titulo2, intervaloDiasMesAtual = [], intervaloMesesAno = [] ;

            if (!$selectGrafTemporal.val() ) {
                $selectGrafTemporal.val($selectGrafTemporal.find('option:not([disabled])').first().val()).change();
            };

            //// DESPESAS ANALÍTICAS REALIZADAS
            titulo = 'Saldo Atual do Mês';
            titulo2 = 'Saldos do Ano'
            intervaloDiasMesAtual = intervaloDatasRealizado($selectGrafTemporal.val());
            intervaloMesesAno = intervaloDatasSaldos(dataAtual());
            // intervaloMesesAno = intervaloDatasSaldos('13/12/2019');
            
            ///// saldos do ano e do mês
            $.ajax({ 
                url: baselink + '/ajax/saldosMeseAno', 
                type: 'POST', 
                data: {
                    intervaloDias: intervaloDiasMesAtual,
                    intervaloMeses: intervaloMesesAno
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){   
                        // console.log(resultado);

                        var labelSaldos = [], valoresSaldos = [], coresSaldos = [];
                        var labelSaldosAno = [], valoresSaldosAno = [];
                    
                        labelSaldos = ['Saldo Ant.', 'Result. Atual', 'Saldo Atual'];
                        valoresSaldos = Object.values( resultado[1] );
                        coresSaldos = ['#359db5','#0b7bff','#022346'];                   

                        var config = {
                            type: 'bar',
                            data: {
                                labels: labelSaldos,
                                datasets: [{
                                    type: 'bar',
                                    label: '',
                                    backgroundColor: coresSaldos,
                                    data: valoresSaldos,
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
                                    display: false,
                                    position: "top"
                                },
                                scales:{
                                    yAxes:[{
                                        ticks:{
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }
                        }
    
                        if(typeof charts[id5] == "undefined") {   
                            charts[id5]= new (function(){
                            this.ctx=$(id5); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id5].chart.destroy();
                            charts[id5].chart=new Chart(charts[id5].ctx, config); 
                        }

                        var dtAtual = dataAtual();
                            dtAtual = dtAtual.split('/');
                            
                        labelSaldosAno = ['Jan/'+dtAtual[2], 'Fev/'+dtAtual[2], 'Mar/'+dtAtual[2], 'Abr/'+dtAtual[2],'Mai/'+dtAtual[2], 'Jun/'+dtAtual[2], 'Jul/'+dtAtual[2], 'Ago/'+dtAtual[2], 'Set/'+dtAtual[2], 'Out/'+dtAtual[2], 'Nov/'+dtAtual[2], 'Dez/'+dtAtual[2]];

                        valoresSaldosAno = Object.values( resultado[0] );

                        var config = {
                            type: 'bar',
                            data: {
                                labels: labelSaldosAno,
                                datasets: [{
                                    type: 'bar',
                                    label: '',
                                    backgroundColor: '#022346',
                                    data: valoresSaldosAno,
                                    borderColor: 'white',
                                    borderWidth: 2
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                title: {
                                    display: true,
                                    text: titulo2,
                                    position: "top"
                                },
                                legend: {
                                    display: false,
                                    position: "top"
                                },scales:{
                                    yAxes:[{
                                        ticks:{
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }
                        }

                        if(typeof charts[id6] == "undefined") {   
                            charts[id6]= new (function(){
                            this.ctx=$(id6); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id6].chart.destroy();
                            charts[id6].chart=new Chart(charts[id6].ctx, config); 
                        }

                    }
                }
            });            
    }

    function lancamentos_vencidos() {
        var intervalo = [], dtTit;
        var $tituloVenc = $('#titulo_proxVenc');
            intervalo = intervaloDatasAQuitar($selectGrafTemporal.val());
            dtTit = intervalo[ intervalo.length - 1].split('-')
            dtTit = dtTit[2] + '/' + dtTit[1] + '/' + dtTit[0];
            $tituloVenc.text('Lançamentos com vencimento a partir de hoje até ' + dtTit );

        // console.log('interv vencidos:', intervalo);
        $.ajax({ 
            url: baselink + '/ajax/buscaVencidos', 
            type: 'POST', 
            data: {
                intervalo: intervalo,
            },
            dataType: 'json', 
            success: function (resultado) { 
                if (resultado){   
                    // console.log(resultado);
                    if(resultado){
                        var dataAux, vencidas = [], proximo = [];
                        var $tabela = $('#lancamentos_vencidos'), $tabela2 = $('#lancamentos_vencProximo');
                            vencidas = Object.values(resultado['vencidas']);

                        $tabela.find('tbody tr').remove();
                        for(var i = 0; i < vencidas.length; i++ ){
                            linha = "<tr>";
                            linha += "<td>" + vencidas[i]['despesa_receita'] + "</td>";
                            linha += "<td>" + vencidas[i]['conta_analitica'] + "</td>";
                            linha += "<td>" + vencidas[i]['detalhe'] + "</td>";
                            
                            dataAux = '';
                            dataAux = vencidas[i]['data_vencimento'];
                            dataAux = dataAux.split('-');
                            dataAux = dataAux[2] + '/' + dataAux[1] + '/' + dataAux[0];
                            linha += "<td>" + dataAux + "</td>";

                            linha += "<td>" + floatParaPadraoBrasileiro( vencidas[i]['valor_total'] )  + "</td>";
                            linha += "<tr>" 

                            $tabela.find('tbody').append(linha);
                        }

                        proximo = Object.values(resultado['proximo']);
                        // console.log('proximo: ', proximo);
                        $tabela2.find('tbody tr').remove();
                        for(var i = 0; i < proximo.length; i++ ){
                            linha = "<tr>";
                            linha += "<td>" + proximo[i]['despesa_receita'] + "</td>";
                            linha += "<td>" + proximo[i]['conta_analitica'] + "</td>";
                            linha += "<td>" + proximo[i]['detalhe'] + "</td>";
                            
                            dataAux = '';
                            dataAux = proximo[i]['data_vencimento'];
                            dataAux = dataAux.split('-');
                            dataAux = dataAux[2] + '/' + dataAux[1] + '/' + dataAux[0];
                            linha += "<td>" + dataAux + "</td>";

                            linha += "<td>" + floatParaPadraoBrasileiro( proximo[i]['valor_total'] )  + "</td>";
                            linha += "<tr>" 

                            $tabela2.find('tbody').append(linha);
                        }
                    }

                    


                }
            }
        });            
    }

    $selectGrafVendas
        .val(7)
        .on('change', function() {
            orcamentosXvendas();
            orcamentos();
            ordenServicos();
            aniversarios();
        })
        .change();

    function orcamentos() {
        var intervalo = intervaloDatasAQuitar($selectGrafVendas.val());
        var $tabela = $('#orcamentos_abertos'), $tabela2 = $('#orcamentos_retornar');        
        var dtTit = intervalo[ intervalo.length - 1].split('-')
            dtTit = dtTit[2] + '/' + dtTit[1] + '/' + dtTit[0];
            
        var $tituloProx = $('#titulo_proxOrc');
            $tituloProx.text('Orçamentos com data de retorno dentro dos próximos ' +  $selectGrafVendas
            .val() + ' dias');

        // console.log('interv vencidos:', intervalo);
        $.ajax({ 
            url: baselink + '/ajax/buscaOrcamentos', 
            type: 'POST', 
            data: {
                intervalo: intervalo,
            },
            dataType: 'json', 
            success: function (resultado) { 
                if (resultado){   
                    if(resultado){
                        var dataAux, vencidas = [], proximo = [];

                            vencidas = Object.values(resultado['abertos']);

                        $tabela.find('tbody tr').remove();
                        for(var i = 0; i < vencidas.length; i++ ){
                            linha = "<tr>";
                            linha += "<td><a class='btn btn-primary btn-sm ml-1' href="+baselink+"/orcamentos/editar/"+vencidas[i]['id']+"><i class='fas fa-edit'></i></a></td>";
                            linha += "<td>" + vencidas[i]['titulo_orcamento'] + "</td>";
                            linha += "<td>" + floatParaPadraoBrasileiro( vencidas[i]['valor_total'] )  + "</td>";
                            linha += "<td>" + vencidas[i]['nome_cliente'] + "</td>";
                            linha += "<td>" + vencidas[i]['email'] + "</td>";
                            
                            dataAux = '';
                            dataAux = vencidas[i]['data_emissao'];
                            dataAux = dataAux.split('-');
                            dataAux = dataAux[2] + '/' + dataAux[1] + '/' + dataAux[0];
                            linha += "<td>" + dataAux + "</td>";
                            linha += "<tr>";

                            $tabela.find('tbody').append(linha);
                        }

                        proximo = Object.values(resultado['retornar']);

                        $tabela2.find('tbody tr').remove();
                        for(var i = 0; i < proximo.length; i++ ){
                            linha = "<tr>";
                            linha += "<td><a class='btn btn-primary btn-sm ml-1' href="+baselink+"/orcamentos/editar/"+proximo[i]['id']+" ><i class='fas fa-edit'></i></a></td>";
                            linha += "<td>" + proximo[i]['titulo_orcamento'] + "</td>";
                            linha += "<td>" + floatParaPadraoBrasileiro( proximo[i]['valor_total'] )  + "</td>";
                            linha += "<td>" + proximo[i]['nome_cliente'] + "</td>";
                            linha += "<td>" + proximo[i]['email'] + "</td>";
                            
                            dataAux = '';
                            dataAux = proximo[i]['data_emissao'];
                            dataAux = dataAux.split('-');
                            dataAux = dataAux[2] + '/' + dataAux[1] + '/' + dataAux[0];
                            linha += "<td>" + dataAux + "</td>";
                            linha += "<tr>";
                            linha += "<tr>"; 

                            $tabela2.find('tbody').append(linha);
                        }
                    }

                    


                }
            }
        });            
    }

    function ordenServicos() {
        var intervalo = intervaloDatasAQuitar($selectGrafVendas.val());
        var $tabela = $('#os_emproducao'), $tabela2 = $('#revisoes');        
        var dtTit = intervalo[ intervalo.length - 1].split('-')
            dtTit = dtTit[2] + '/' + dtTit[1] + '/' + dtTit[0];
            
        var $tituloOS = $('#titulo_proxRev');
            $tituloOS.text('O.S. com data de revisão dentro dos próximos ' +  $selectGrafVendas
            .val() + ' dias');

        // console.log('interv vencidos:', intervalo);
        $.ajax({ 
            url: baselink + '/ajax/buscaOrdensServicos', 
            type: 'POST', 
            data: {
                intervalo: intervalo,
            },
            dataType: 'json', 
            success: function (resultado) { 
                if(resultado){
                    
                    var dataAux, dataRevAux, emprod = [];

                    emprod = Object.values(resultado['emproducao']);

                    $tabela.find('tbody tr').remove();
                    for(var i = 0; i < emprod.length; i++ ){
                        linha = "<tr>";
                        linha += "<td><a class='btn btn-primary btn-sm ml-1' href="+baselink+"/ordemservico/editar/"+emprod[i]['id']+"><i class='fas fa-edit'></i></a></td>";
                        
                        dataAux = '';
                        dataAux = emprod[i]['data_aprovacao'];
                        dataAux = dataAux.split('-');
                        dataAux = dataAux[2] + '/' + dataAux[1] + '/' + dataAux[0];
                        linha += "<td>" + dataAux + "</td>";

                        linha += "<td>" + emprod[i]['titulo_orcamento'] + "</td>";

                        linha += "<td>" + floatParaPadraoBrasileiro( emprod[i]['valor_final'] )  + "</td>";

                        linha += "<td>" + emprod[i]['nome_razao_social'] + "</td>";
                        linha += "<td>" + emprod[i]['tec_responsavel'] + "</td>";
                        linha += "<tr>";

                        $tabela.find('tbody').append(linha);
                    }

                    var rev15dias = [], rev30dias = [], rev6meses = [];

                    rev15dias = Object.values(resultado['rev15dias']);
                    rev30dias = Object.values(resultado['rev30dias']);
                    rev6meses = Object.values(resultado['rev6meses']);

                    $tabela2.find('tbody tr').remove();

                    for(var i = 0; i < rev15dias.length; i++ ){
                        linha = "<tr>";
                        linha += "<td><a class='btn btn-primary btn-sm ml-1' href="+baselink+"/ordemservico/editar/"+rev15dias[i]['id']+"><i class='fas fa-edit'></i></a></td>";
                        
                        dataAux = '';
                        dataAux = rev15dias[i]['data_aprovacao'];
                        dataAux = dataAux.split('-');
                        dataAux = dataAux[2] + '/' + dataAux[1] + '/' + dataAux[0];
                        linha += "<td>" + dataAux + "</td>";

                        dataRevAux = '';
                        dataRevAux = rev15dias[i]['data_revisao_1'];
                        dataRevAux = dataRevAux.split('-');
                        dataRevAux = dataRevAux[2] + '/' + dataRevAux[1] + '/' + dataRevAux[0];
                        linha += "<td>" + dataRevAux + "</td>";

                        linha += "<td>" + rev15dias[i]['titulo_orcamento'] + "</td>";

                        linha += "<td>" + floatParaPadraoBrasileiro( rev15dias[i]['valor_final'] )  + "</td>";

                        linha += "<td>" + rev15dias[i]['nome_razao_social'] + "</td>";
                        linha += "<td>" + rev15dias[i]['tec_responsavel'] + "</td>";
                        linha += "<td> Primeira Revisão </td>";
                        linha += "<tr>";

                        // console.log('15 dias: ',linha);
                        $tabela2.find('tbody').append(linha);
                    }

                    for(var i = 0; i < rev30dias.length; i++ ){
                        linha = "<tr>";
                        linha += "<td><a class='btn btn-primary btn-sm ml-1' href="+baselink+"/ordemservico/editar/"+rev30dias[i]['id']+"><i class='fas fa-edit'></i></a></td>";
                        
                        dataAux = '';
                        dataAux = rev30dias[i]['data_aprovacao'];
                        dataAux = dataAux.split('-');
                        dataAux = dataAux[2] + '/' + dataAux[1] + '/' + dataAux[0];
                        linha += "<td>" + dataAux + "</td>";

                        dataRevAux = '';
                        dataRevAux = rev30dias[i]['data_revisao_2'];
                        dataRevAux = dataRevAux.split('-');
                        dataRevAux = dataRevAux[2] + '/' + dataRevAux[1] + '/' + dataRevAux[0];
                        linha += "<td>" + dataRevAux + "</td>";

                        linha += "<td>" + rev30dias[i]['titulo_orcamento'] + "</td>";

                        linha += "<td>" + floatParaPadraoBrasileiro( rev30dias[i]['valor_final'] )  + "</td>";

                        linha += "<td>" + rev30dias[i]['nome_razao_social'] + "</td>";
                        linha += "<td>" + rev30dias[i]['tec_responsavel'] + "</td>";
                        linha += "<td> Segunda Revisão </td>";
                        linha += "<tr>";

                        // console.log('30 dias: ',linha);
                        $tabela2.find('tbody').append(linha);
                    }

                    for(var i = 0; i < rev6meses.length; i++ ){
                        linha = "<tr>";
                        linha += "<td><a class='btn btn-primary btn-sm ml-1' href="+baselink+"/ordemservico/editar/"+rev6meses[i]['id']+"><i class='fas fa-edit'></i></a></td>";
                        
                        dataAux = '';
                        dataAux = rev6meses[i]['data_aprovacao'];
                        dataAux = dataAux.split('-');
                        dataAux = dataAux[2] + '/' + dataAux[1] + '/' + dataAux[0];
                        linha += "<td>" + dataAux + "</td>";

                        dataRevAux = '';
                        dataRevAux = rev6meses[i]['data_revisao_3'];
                        dataRevAux = dataRevAux.split('-');
                        dataRevAux = dataRevAux[2] + '/' + dataRevAux[1] + '/' + dataRevAux[0];
                        linha += "<td>" + dataRevAux + "</td>";

                        linha += "<td>" + rev6meses[i]['titulo_orcamento'] + "</td>";

                        linha += "<td>" + floatParaPadraoBrasileiro( rev6meses[i]['valor_final'] )  + "</td>";

                        linha += "<td>" + rev6meses[i]['nome_razao_social'] + "</td>";
                        linha += "<td>" + rev6meses[i]['tec_responsavel'] + "</td>";
                        linha += "<td> Terceira Revisão </td>";
                        linha += "<tr>";

                        // console.log('6 meses: ',linha);
                        $tabela2.find('tbody').append(linha);
                    }
                }

            }
        });            
    }

    function aniversarios() {
        var intervalo = intervaloDatasAQuitar($selectGrafVendas.val());
        var $tabela = $('#anivers');        
        var dtTit = intervalo[ intervalo.length - 1].split('-')
            dtTit = dtTit[2] + '/' + dtTit[1] + '/' + dtTit[0];
            
        var $tituloOS = $('#tit_aniver');
            $tituloOS.text('Clientes de aniversário no mês');

        // console.log('interv vencidos:', intervalo);
        $.ajax({ 
            url: baselink + '/ajax/buscaAniversariantes', 
            type: 'POST', 
            data: {
                intervalo: intervalo,
            },
            dataType: 'json', 
            success: function (resultado) { 
                if(resultado){
                    // console.log(resultado);
                    var dataAux, anivers = [];

                    anivers = Object.values(resultado['anivers']);

                    $tabela.find('tbody tr').remove();
                    for(var i = 0; i < anivers.length; i++ ){
                        linha = "<tr>";
                        linha += "<td>" + anivers[i]['nome'] + "</td>";

                        dataAux = '';
                        dataAux = anivers[i]['data_nascimento'];
                        dataAux = dataAux.split('-');
                        dataAux = dataAux[2] + '/' + dataAux[1] + '/' + dataAux[0];
                        linha += "<td>" + dataAux + "</td>";

                        linha += "<td>" + anivers[i]['celular'] + "</td>";
                        linha += "<td>" + anivers[i]['email'] + "</td>";
                        linha += "<tr>";

                        $tabela.find('tbody').append(linha);
                    }
                }

            }
        });            
    }

    function orcamentosXvendas() {
        var titulo, intervalo = [];
        var $qtdOrc = $("#qtd_orc");
        var $valorOrc = $("#valor_orc");
        var $qtdVenda = $("#qtd_venda");
        var $valorVenda = $("#valor_venda");


            if (!$selectGrafVendas.val() ) {
                $selectGrafVendas.val($selectGrafVendas.find('option:not([disabled])').first().val()).change();
            };

            //// FLUXO DE CAIXA REALIZADO
            titulo = 'Orçamento X Vendas dos últimos ' + $selectGrafVendas.children("option:selected").text().trim() +' dias até hoje.';

            intervalo = intervaloDatasRealizado($selectGrafVendas.val());

            ///// GRÁFICO FLUXO CAIXA REALIZADO
            $.ajax({ 
                url: baselink + '/ajax/graficoOrcamentosXvendas', 
                type: 'POST', 
                data: {
                    intervalo: intervalo,
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){   
                        //  console.log(resultado)
                        var eixoDatas = [], orcamentos = [], vendas = [], qtdorcamentos = [], qtdvendas = [];
                        var valorOrcado = parseFloat(0), valorVendido = parseFloat(0), qtdOrcs = parseInt(0), qtdVnd = parseInt(0);

                        eixoDatas = Object.keys(resultado[0]);
                        orcamentos = Object.values(resultado[0]);
                        qtdorcamentos = Object.values(resultado[1])
                        vendas = Object.values(resultado[2]);
                        qtdvendas = Object.values(resultado[3]);

                        for (var i = 0; i < orcamentos.length; i++) {
                            valorOrcado = valorOrcado + parseFloat( orcamentos[i] );
                            valorVendido = valorVendido + parseFloat( vendas[i] );
                            qtdOrcs = qtdOrcs + parseInt( qtdorcamentos[i] );
                            qtdVnd = qtdVnd + parseInt( qtdvendas[i] );                         
                        }

                        $qtdOrc.text( qtdOrcs );
                        $valorOrc.text( 'R$ ' + floatParaPadraoBrasileiro(valorOrcado) );
                        $qtdVenda.text( qtdVnd );
                        $valorVenda.text( 'R$ ' + floatParaPadraoBrasileiro(valorVendido) );                      

                        var config = {
                            type: 'bar',
                            data: {
                                labels: eixoDatas,
                                datasets: [{
                                    type: 'bar',
                                    label: 'Orçamentos',
                                    backgroundColor: '#418fe2',
                                    data: orcamentos,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }, {
                                    type: 'bar',
                                    label: 'Vendas',
                                    backgroundColor: '#064c92',
                                    data: vendas,
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
                                scales:{
                                    yAxes:[{
                                        ticks:{
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }
                        }
                        
                        if(typeof charts[id7] == "undefined") {
                            charts[id7]= new (function(){
                            this.ctx=$(id7); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id7].chart.destroy();
                            charts[id7].chart=new Chart(charts[id7].ctx, config); 
                        }
                    }
                }
            });

    }


});

function dataAtual() {
    var dt, dia, mes, ano, dtretorno;
    dt = new Date();
    dia = dt.getDate();
    mes = dt.getMonth() + 1;
    ano = dt.getFullYear();

    if (dia.toString().length == 1) {
        dia = "0" + dt.getDate();
    }
    if (mes.toString().length == 1) {
        mes = "0" + mes;
    }

    dtretorno = dia + "/" + mes + "/" + ano;

    return dtretorno;
}

function proximoDiaUtil(dataInicio, distdias) {

    if (dataInicio) {
        if (distdias != 0) {
            var dtaux = dataInicio.split("/");
            var dtvenc = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);

            //soma a quantidade de dias para o recebimento/pagamento
            dtvenc.setDate(dtvenc.getDate() + distdias);

            //verifica se a data final cai no final de semana, se sim, coloca para o primeiro dia útil seguinte
            if (dtvenc.getDay() == 6) {
                dtvenc.setDate(dtvenc.getDate() + 2);
            }
            if (dtvenc.getDay() == 0) {
                dtvenc.setDate(dtvenc.getDate() + 1);
            }

            //monta a data no padrao brasileiro
            var dia = dtvenc.getDate();
            var mes = dtvenc.getMonth() + 1;
            var ano = dtvenc.getFullYear();
            if (dia.toString().length == 1) {
                dia = "0" + dtvenc.getDate();
            }
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            dtvenc = dia + "/" + mes + "/" + ano;
            return dtvenc;
        } else {
            return dataInicio;
        }
    } else {
        return false;
    }
}

function floatParaPadraoBrasileiro(valor) {
    var valortotal = valor;
    valortotal = number_format(valortotal, 2, ',', '.');
    return valortotal;
}

function floatParaPadraoInternacional(valor) {

    var valortotal = valor;
    valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    valortotal = valortotal.replace(",", ".");
    valortotal = parseFloat(valortotal).toFixed(2);
    return valortotal;
}

function number_format(numero, decimal, decimal_separador, milhar_separador) {
    numero = (numero + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+numero) ? 0 : +numero,
        prec = !isFinite(+decimal) ? 0 : Math.abs(decimal),
        sep = (typeof milhar_separador === 'undefined') ? ',' : milhar_separador,
        dec = (typeof decimal_separador === 'undefined') ? '.' : decimal_separador,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };

    // Fix para IE: parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function intervaloDatasRealizado(intervalo) {
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

function intervaloDatasAQuitar(intervalo) {
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

function intervaloDatasSaldos(dtAtual) {
    var mes1, ano1, retorno = [];

        // calculando o valor de HOJE
        dtAtual = dtAtual.split('/');
        
        mesAtual = dtAtual[1];
        anoAtual = dtAtual[2];

        // console.log('mesatual: ', mesAtual, 'anoatual: ', anoAtual);
        // console.log(parseInt(mesAtual));
        // criando o array de DATAS

        if(parseInt(mesAtual) > parseInt(0)){
            k=0;
            for(i = 1; i <= parseInt(mesAtual)  ; i++){
            
                if (i.toString().length == 1) {
                    mes1 = "0" + i;
                }else{
                    mes1 = i;
                }
                ano1 = anoAtual;
                
                retorno[k] = ano1 + '-' + mes1 + '-01';
                k++;
            }
        }
        
        // if(retorno.length == 1){
        //     retorno[1] = anoAtual + '-01-01';
        // }
        // retorno[0] = ano1 + '-01-01';
        
        return retorno;

}

function aleatorioEntre(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}