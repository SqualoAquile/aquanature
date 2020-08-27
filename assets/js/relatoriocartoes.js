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
            valor_total: 17,
            data_emissao: 15,
            data_validade: 15,
            status:8
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
        // $('#DataTables_Table_0_length').removeClass('d-none');

        var rowData = jsonData, inforelat = jsonData,
        quantidadeOrcamentos = 0,
        totalOrcado = 0;
        // console.log(rowData)
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

        // limpar as informações do array que vai formar o relatório
        for (var i=0; i < inforelat.length; i++){
            inforelat[i].shift();
        }
        
        // pegar o cabeçalho da tabela
        var cabecalho=[], arrCab;
        arrCab = $('.dataTables_scrollHeadInner table thead tr th');
        for(var i=1; i< arrCab.length; i++){
            cabecalho[i-1] = $('.dataTables_scrollHeadInner table thead tr th:eq('+i+')').text().trim();
        }
        inforelat.unshift(cabecalho);

        // colocar as informações do resumo
        inforelat.unshift(['Quant. Cartões', parseInt(quantidadeOrcamentos),'Valor Total',floatParaPadraoBrasileiro(totalOrcado)]);
        // console.log('info relatório:', inforelat);
        $('#txt').val(JSON.stringify(inforelat));
        // JSONToCSVConvertor(JSON.stringify(rowData), 'Teste', true);

    };

    $('#DataTables_Table_0_length').addClass('d-none');
    $('#DataTables_Table_0_wrapper').addClass('d-none');
    $('#botaoRelatorioExcel').addClass('d-none');
    $('#graficos').addClass('d-none');


    // EVENTOS -----------------------------------------------------------------

    $('#collapseFluxocaixaResumo').on('shown.bs.collapse', function () {
        $('#DataTables_Table_0_wrapper').removeClass('d-none');
        $('#DataTables_Table_0_length').removeClass('d-none');
        // console.log('abriu')
        $('#botaoRelatorioExcel').removeClass('d-none');
      });

    $('#collapseFluxocaixaResumo').on('hidden.bs.collapse', function () {
        // $('#DataTables_Table_0_wrapper').addClass('d-none');
        // $('#DataTables_Table_0_length').addClass('d-none');
        // dataTable.page.len(-1).draw();
        // dataTable.draw();
        // console.log('fechou')
    });

    $('#limpar-filtro').on('click', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
        $('#botaoRelatorioExcel').addClass('d-none');
    });

    $('#card-body-filtros').on('change', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
        $('#botaoRelatorioExcel').addClass('d-none');
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
            $('#DataTables_Table_0_length').removeClass('d-none');
        } else {
            alert("Aplique um filtro para emitir um relatório!");
            event.stopPropagation(); 
        }

    });

    $('#botaoRelatorioExcel').on('click', function(){

        let pesquisar = false;

        $('.filtros').each(function() {
            if (($(this).find('select.input-filtro-faixa').val() && ($(this).find('input.input-filtro-faixa.min').val() || $(this).find('input.input-filtro-faixa.max').val())) || $(this).find('select.input-filtro-texto').val() && $(this).find('input.input-filtro-texto').val()) {
                pesquisar = true;
            }
        });

        if (pesquisar) {
            var data = $('#txt').val();
            if(data != ''){
                // pegar o cabeçalho da tabela
                // var cabecalho=[], arrCab;
                // arrCab = $('.dataTables_scrollHeadInner table thead tr th');
                
                // for(var i=1; i< arrCab.length; i++){
                //     cabecalho[i-1] = $('.dataTables_scrollHeadInner table thead tr th:eq('+i+')').text().trim();
                // }
                // console.log('cabecalho:',cabecalho);
                // $('.dataTables_scrollHead th:eq(1)').text()
                JSONToCSVConvertor(data, "Relatório Cartões");
            }else{
                return;
            }

        } else {
            alert("Aplique um filtro para emitir um relatório!");
            event.stopPropagation(); 
        }

    });
      
});


function JSONToCSVConvertor(JSONData, ReportTitle, Cabecalho='') {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '";';
            // row += '"' + arrData[i][index] + '",';
            // row += '"' + arrData[i][index] + '"\t';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = ReportTitle;
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

