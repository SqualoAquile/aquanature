function floatParaPadraoBrasileiro(valor){
    var valortotal = valor;
    valortotal = number_format(valortotal,2,',','.');
    return valortotal;
}

function floatParaPadraoInternacional(valor){
    
    var valortotal = valor;
    valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    valortotal = valortotal.replace(",", ".");
    valortotal = parseFloat(valortotal).toFixed(2);
    return valortotal;
}

function number_format( numero, decimal, decimal_separador, milhar_separador ){ 
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

$(function () {

    var $collapse = $('#collapseFluxocaixaResumo'),
        $cardBodyFiltros = $('#card-body-filtros'),
        dataTable = window.dataTable,
        indexColumns = {
            acoes: 0,
            movimentacoes: 1,
            data_operacao: 5,
            valor_total: 6,
            data_vencimento: 7,
            status: 15,
            observacao: 18
        }
    
    
    // dataTable.page.len(-1).draw();
    // dataTable.draw();
    $('#DataTables_Table_0_length').addClass('d-none');

    dataTable.on('xhr.dt', function (e, settings, json, xhr) {
        resumo(json.dataSemPaginacao);
    });


    function resumo (jsonData) {

        // dataTable.page.len(-1).draw();
        // dataTable.draw();

        var rowData = jsonData,
        somasDespesasQ = 0,
        somasReceitasQ = 0,
        somasDespesasAQ = 0,
        somasReceitasAQ = 0,
        resultadoRealizado = 0,
        resultadoARealizar = 0,
        numReceitasQ = 0,
        numReceitasAQ = 0,
        numDespesasQ = 0,
        numDespesasAQ = 0,
        totalQ = 0,
        totalAQ = 0,
        previsao = 0;
    
    
        i = 0;
        rowData.forEach(function () {
            if (rowData[i][indexColumns.movimentacoes].toLowerCase() == 'despesa') {
                               
                var despesa = rowData[i][indexColumns.valor_total];
                despesa = despesa.replace('R$  ', '');
                despesa = floatParaPadraoInternacional(despesa);

                if (rowData[i][indexColumns.status].toLowerCase() == 'quitado'){
                    somasDespesasQ += parseFloat(despesa);
                    numDespesasQ +=1;
                } else {
                    somasDespesasAQ += parseFloat(despesa);
                    numDespesasAQ +=1;
                };
            }
            i++;
        });

        i = 0;
        rowData.forEach(function () {
            if (rowData[i][indexColumns.movimentacoes].toLowerCase() == 'receita') {
                               
                var receita = rowData[i][indexColumns.valor_total];
                receita = receita.replace('R$  ', '');
                receita = floatParaPadraoInternacional(receita);

                if (rowData[i][indexColumns.status].toLowerCase() == 'quitado'){
                    somasReceitasQ += parseFloat(receita);
                    numReceitasQ +=1 ;
                } else {
                    somasReceitasAQ += parseFloat(receita);
                    numReceitasAQ +=1 ;
                };
            }
            i++;
        });

        resultadoRealizado = somasReceitasQ - somasDespesasQ;
        resultadoARealizar = somasReceitasAQ - somasDespesasAQ;

        previsaoReceitas = somasReceitasQ + somasReceitasAQ;
        previsaoDespesas = somasDespesasQ + somasDespesasAQ;
        previsaoResultados = resultadoRealizado + resultadoARealizar;

        totalQ = numReceitasQ + numDespesasQ;
        totalAQ = numReceitasAQ + numDespesasAQ;
        total = totalQ + totalAQ;
       
        $('#despesasQuitadas').text(floatParaPadraoBrasileiro(somasDespesasQ));
        $('#despesasAQuitar').text(floatParaPadraoBrasileiro(somasDespesasAQ));

        $('#receitasQuitadas').text(floatParaPadraoBrasileiro(somasReceitasQ));
        $('#receitasAQuitar').text(floatParaPadraoBrasileiro(somasReceitasAQ));

        if(resultadoRealizado <= 0){
            $('#cardResultadoRealizado').removeClass('bg-success text-white');
            $('#cardResultadoRealizado').addClass('bg-danger text-white');
        } else{
            $('#cardResultadoRealizado').removeClass('bg-danger text-white');
            $('#cardResultadoRealizado').addClass('bg-success text-white');
        }

        if(resultadoARealizar <= 0){
            $('#cardResultadoARealizar').removeClass('bg-success text-white');
            $('#cardResultadoARealizar').addClass('bg-danger text-white');
        } else{
            $('#cardResultadoARealizar').removeClass('bg-danger text-white');
            $('#cardResultadoARealizar').addClass('bg-success text-white');
        }

        if(previsaoResultados <= 0){
            $('#cardPrevisaoResultados').removeClass('bg-success text-white');
            $('#cardPrevisaoResultados').addClass('bg-danger text-white');
        } else{
            $('#cardPrevisaoResultados').removeClass('bg-danger text-white');
            $('#cardPrevisaoResultados').addClass('bg-success text-white');
        }

        $('#resultadoRealizado').text(floatParaPadraoBrasileiro(resultadoRealizado));
        $('#resultadoARealizar').text(floatParaPadraoBrasileiro(resultadoARealizar));

        $('#previsaoResultados').text(floatParaPadraoBrasileiro(previsaoResultados));
        $('#previsaoReceitas').text(floatParaPadraoBrasileiro(previsaoReceitas));
        $('#previsaoDespesas').text(floatParaPadraoBrasileiro(previsaoDespesas));

        $('[data-id=total]').text(parseInt(total));
        $('[data-id=totalQ]').text(parseInt(totalQ));
        $('[data-id=totalAQ]').text(parseInt(totalAQ));

        // dataTable.page.len(10).draw();
        // $('#DataTables_Table_0_length').removeClass('d-none');
  
    };

    // $('#DataTables_Table_0_length').addClass('d-none');
    $('#DataTables_Table_0_wrapper').addClass('d-none');

    $('#collapseFluxocaixaResumo').on('show.bs.collapse', function () {
        //resumo();
        // dataTable.page.len(10).draw();
        // dataTable.draw();
        $('#DataTables_Table_0_wrapper').removeClass('d-none');
        
        $('#collapseGraficos2').removeClass('show').addClass('hide');
      });

    $('#collapseFluxocaixaResumo').on('hidden.bs.collapse', function () {
        $('#DataTables_Table_0_wrapper').addClass('d-none');
        // dataTable.page.len(-1).draw();
        // dataTable.draw();
        
    });

    $('#collapseGraficos2').on('show.bs.collapse', function () {
        $('#collapseFiltros').removeClass('show').addClass('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
        $('#collapseFluxocaixaResumo').removeClass('show').addClass('hide');
        
    });

    $('#collapseGraficos2').on('hide.bs.collapse', function () {
        $('#collapseFiltros').removeClass('hide').addClass('show');
        
    });

    $('#limpar-filtro').on('click', function () {
        $('#collapseGraficos2').collapse('hide');
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });

    $('#graficos').on('click', function () {
        $('#collapseFiltros').collapse('hide');
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });

    $('#card-body-filtros').on('change', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });

    $('#botaoRelatorio').on('click', function(){

        let pesquisar = false;

        $('.filtros').each(function() {
            if (($(this).find('select.input-filtro-faixa').val() && ($(this).find('input.input-filtro-faixa.min').val() || $(this).find('input.input-filtro-faixa.max').val())) || $(this).find('select.input-filtro-texto').val() && $(this).find('input.input-filtro-texto').val()) {
                pesquisar = true;
            }
        });

        if (pesquisar) {
            dataTable.draw();
        } else {
            alert("Aplique um filtro para emitir um relatório!");
            event.stopPropagation();
        }

    });

});
