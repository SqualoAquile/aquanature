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
            cmesReferencia : 2,
            ctotalInicial : 3,
            ctotalEntradas : 4,
            ctotalSaidas : 5,
            ctotalFinal : 6,
            ccaixaInicial : 7,
            conlineInicial : 8,
            cbancoInicial : 9,
            ccaixaFinal : 10,
            conlineFinal : 11,
            cbancoFinal : 12,
            cresultado : 13,
            cdiferenca : 14
        }
    
    
    // dataTable.page.len(-1).draw();
    // dataTable.order( [ 1, "asc" ] ).draw();
    // $('#DataTables_Table_0_length').addClass('d-none');

    dataTable.on('xhr.dt', function (e, settings, json, xhr) {
        resumo(json.dataSemPaginacao);
    });

    function resumo (jsonData) {
        // dataTable.page.len(-1).draw();
        // dataTable.order( [ 1, "asc" ] ).draw();

        var rowData = jsonData;

        var lastRow = 0;

        rowData.forEach(function () {
            lastRow += 1;
        });

        lastRow = lastRow-1;

       var mesReferencia = 0,
        totalInicial = 0,
        totalEntradas = 0,
        totalSaidas = 0,
        totalFinal = 0,
        caixaInicial = 0,
        onlineInicial = 0,
        bancoInicial = 0,
        caixaFinal = 0,
        onlineFinal = 0,
        bancoFinal = 0,
        resultado = 0,
        diferenca = 0,
        resultadoCaixa = 0,
        resultadoOnline = 0,
        resultadoBanco = 0,
    
        totalInicial = parseFloat(floatParaPadraoInternacional(rowData[0][indexColumns.ctotalInicial].replace('R$','')));

        caixaInicial = parseFloat(floatParaPadraoInternacional(rowData[0][indexColumns.ccaixaInicial].replace('R$','')));
        onlineInicial = parseFloat(floatParaPadraoInternacional(rowData[0][indexColumns.conlineInicial].replace('R$','')));
        bancoInicial = parseFloat(floatParaPadraoInternacional(rowData[0][indexColumns.cbancoInicial].replace('R$','')));

        caixaFinal = parseFloat(floatParaPadraoInternacional(rowData[lastRow][indexColumns.ccaixaFinal].replace('R$','')));
        onlineFinal = parseFloat(floatParaPadraoInternacional(rowData[lastRow][indexColumns.conlineFinal].replace('R$','')));
        bancoFinal = parseFloat(floatParaPadraoInternacional(rowData[lastRow][indexColumns.cbancoFinal].replace('R$','')));

        totalFinal = parseFloat(floatParaPadraoInternacional(rowData[lastRow][indexColumns.ctotalFinal].replace('R$','')));

        i = 0;
        rowData.forEach(function () {
            totalEntradas += parseFloat(floatParaPadraoInternacional(rowData[i][indexColumns.ctotalEntradas].replace('R$','')));
            totalSaidas += parseFloat(floatParaPadraoInternacional(rowData[i][indexColumns.ctotalSaidas].replace('R$','')));
            i++;
        });

        resultado = parseFloat(totalEntradas-totalSaidas);
        diferenca = parseFloat(totalInicial+resultado-totalFinal);

        $('#totalInicial').text(floatParaPadraoBrasileiro(totalInicial));
        $('#totalEntradas').text(floatParaPadraoBrasileiro(totalEntradas));
        $('#totalSaidas').text(floatParaPadraoBrasileiro(totalSaidas));
        $('#totalFinal').text(floatParaPadraoBrasileiro(totalFinal));
        $('#caixaInicial').text(floatParaPadraoBrasileiro(caixaInicial));
        $('#onlineInicial').text(floatParaPadraoBrasileiro(onlineInicial));
        $('#bancoInicial').text(floatParaPadraoBrasileiro(bancoInicial));
        $('#caixaFinal').text(floatParaPadraoBrasileiro(caixaFinal));
        $('#onlineFinal').text(floatParaPadraoBrasileiro(onlineFinal));
        $('#bancoFinal').text(floatParaPadraoBrasileiro(bancoFinal));
        $('#resultado').text(floatParaPadraoBrasileiro(resultado));
        $('#diferenca').text(floatParaPadraoBrasileiro(diferenca));

        resultadoBanco = bancoFinal - bancoInicial;
        resultadoCaixa = caixaFinal - caixaInicial;
        resultadoOnline = onlineFinal - onlineInicial;

        $('#resultadoBanco').text(floatParaPadraoBrasileiro(resultadoBanco));
        $('#resultadoCaixa').text(floatParaPadraoBrasileiro(resultadoCaixa));
        $('#resultadoOnline').text(floatParaPadraoBrasileiro(resultadoOnline));

        if(resultado < 0){
            $('#cardResultado').removeClass('bg-success text-white').addClass('bg-danger text-white');
        } else{
            $('#cardResultado').removeClass('bg-danger text-white').addClass('bg-success text-white');
        }

        if(resultadoBanco < 0){
            $('#cardResultadoBanco').removeClass('bg-success bg-light text-dark').addClass('bg-danger text-white');
        } else if(resultadoBanco ==0){
            $('#cardResultadoBanco').removeClass('bg-danger bg-success text-white').addClass('bg-light text-dark');
        } else{
            $('#cardResultadoBanco').removeClass('bg-danger bg-light text-dark').addClass('bg-success text-white');
        }

        if(resultadoOnline < 0){
            $('#cardResultadoOnline').removeClass('bg-success bg-light text-dark').addClass('bg-danger text-white');
        } else if(resultadoOnline ==0){
            $('#cardResultadoOnline').removeClass('bg-danger bg-success text-white').addClass('bg-light text-dark');
        } else{
            $('#cardResultadoOnline').removeClass('bg-danger bg-light text-dark').addClass('bg-success text-white');
        }

        if(resultadoCaixa < 0){
            $('#cardResultadoCaixa').removeClass('bg-success bg-light text-dark').addClass('bg-danger text-white');
        } else if(resultadoCaixa ==0){
            $('#cardResultadoCaixa').removeClass('bg-danger bg-success text-white').addClass('bg-light text-dark');
        } else{
            $('#cardResultadoCaixa').removeClass('bg-danger bg-light text-dark').addClass('bg-success text-white');
        }

        if(diferenca == 0){
            $('#diferenca').removeClass('text-warning');
        }else{
            $('#diferenca').addClass('text-warning');
        }
    };

    $('#DataTables_Table_0_length').addClass('d-none');
    $('#DataTables_Table_0_wrapper').addClass('d-none');
    $('#limpar-filtro').addClass('d-none');
    $('#cardFiltros').addClass('d-none');
    // Fixo o filtro em "data de referência" e só passo os valores das datas
    $('#cardFiltros').find('.custom-select').val("1");

    $('#collapseFluxocaixaResumo').on('show.bs.collapse', function () {
        //resumo();
        // dataTable.page.len(10).draw();
        // dataTable.draw();
        $('#DataTables_Table_0_wrapper').removeClass('d-none');
        $('#collapseGraficos2').collapse('hide');
      });

    $('#collapseFluxocaixaResumo').on('hidden.bs.collapse', function () {
        $('#DataTables_Table_0_wrapper').addClass('d-none');
        // dataTable.page.len(-1).draw();
    });

    $('#collapseGraficos2').on('show.bs.collapse', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
    });

    $('#card-body-filtros').on('change', function () {      
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });

    $('#selectMesesMax, #selectMesesMin').on('change', function(){
        
        $min = $('#selectMesesMin');
        min = $('#selectMesesMin').val();
        if(min != null){
            min = min.split('/').reverse().join('-');
        }

        $max = $('#selectMesesMax');
        max = $('#selectMesesMax').val();
        if (max != null) {
            max = max.split('/').reverse().join('-');   
        }

        if (min && max) {
                    
            $max.removeClass('is-invalid');
            $max[0].setCustomValidity('');
            $max.siblings('.invalid-feedback').remove();

            if (min > max) {

                $max.addClass('is-invalid');

                $max[0].setCustomValidity('invalid');
                $max.after('<div class="invalid-feedback">O valor deste campo deve ser maior que o campo anterior.</div>');
                
                $max.val('').change();
                $min.val('').change();

                dataTable.columns().search('').draw();
                $('#collapseGraficos2').removeClass('show').addClass('hide');

                return false;
            }
        }

        $('.input-filtro-faixa').siblings('.max').val($('#selectMesesMax').val()).change();
        $('.input-filtro-faixa').siblings('.min').val($('#selectMesesMin').val()).change();
        // resumo();

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

    $('#selectMesesMin, #selectMesesMax').on('change', function(){
        $('#collapseGraficos2').collapse('hide');
    });

    $('#graficos').on('click', function(){

        var selectMin = $('#selectMesesMin').val();
        var selectMax = $('#selectMesesMax').val();

        if (!selectMin || !selectMax){

            alert("Selecione um período de meses para gerar um gráfico!");
            event.stopPropagation();
        }else{
            // resumo();
            $('#collapseGraficos2').collapse('show');
        }

        // var selectFaixa = $('.input-filtro-faixa');
        // var selectF = selectFaixa.siblings('input');
        // var faixa = false;
       
        // selectF.each(function(){
        //     if($(this).val()){
        //         faixa = true;
        //     }
        // });

        // var selectTexto = $('.input-filtro-texto');
        // var selectT = selectTexto.siblings('input');
        // var texto = false;

        // selectT.each(function(){
        //     if($(this).val()){
        //         texto = true;
        //     }
        // });
    
        // if(!faixa && !texto) {
        //     alert("Aplique um filtro para gerar um gráfico!");
        //     event.stopPropagation();
        // }else{
        //     resumo();
        //     $('#collapseGraficos2').collapse('show');
        // }

    });
});
