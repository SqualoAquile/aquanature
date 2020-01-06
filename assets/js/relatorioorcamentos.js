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
            valor_total: 23,
            data_emissao: 8,
            data_validade: 9,
            status:16
        }
    
    
    // dataTable.page.len(-1).draw();
    // dataTable.draw();
    // $('#DataTables_Table_0_length').addClass('d-none');

    dataTable.on('xhr.dt', function (e, settings, json, xhr) {
        resumo(json.dataSemPaginacao);
    });

    function resumo (jsonData) {
        // dataTable.page.len(-1).draw();
        // dataTable.draw();
        
        var rowData = jsonData,
        quantidadeOrcamentos = 0,
        totalOrcado = 0;
    
        i = 0;
        rowData.forEach(function () {
            // if (rowData[i][indexColumns.status].toLowerCase() == 'ativo') {
                                              
                var valor = rowData[i][indexColumns.valor_total];
                valor = valor.replace('R$  ', '');
                valor = floatParaPadraoInternacional(valor);
                totalOrcado = parseFloat(totalOrcado) + parseFloat(valor);
                quantidadeOrcamentos++;
            // }
            i++;
        });

        i = 0;

        $('#quantidadeOrcamentos').text(parseInt(quantidadeOrcamentos));
        $('#totalOrcado').text(floatParaPadraoBrasileiro(totalOrcado));

    };

    $('#DataTables_Table_0_length').addClass('d-none');
    $('#DataTables_Table_0_wrapper').addClass('d-none');
    $('#graficos').addClass('d-none');

    // EVENTOS -----------------------------------------------------------------

    $('#collapseFluxocaixaResumo').on('shown.bs.collapse', function () {
        //resumo();
        // dataTable.page.len(10).draw();
        // dataTable.draw();
        $('#DataTables_Table_0_wrapper').removeClass('d-none');
      });

    $('#collapseFluxocaixaResumo').on('hidden.bs.collapse', function () {
        $('#DataTables_Table_0_wrapper').addClass('d-none');
        // dataTable.page.len(-1).draw();
        // dataTable.draw();
    });

    $('#limpar-filtro').on('click', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });

    // $('#graficos').on('click', function () {
    //     $('#collapseFiltros').collapse('hide');
    //     $('#collapseFluxocaixaResumo').collapse('hide');
    //     $('#DataTables_Table_0_wrapper').addClass('d-none');
    // });

    $('#card-body-filtros').on('change', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
        // $('#DataTables_Table_0_wrapper').addClass('d-none');
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
