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
            qtdativos: 4,
            qtdcancpagantes: 5,
            qtdcobrados: 6,
            precomed: 7,
            valortotal: 8,
            desconto: 10,
            valorfinal: 11,
        }
    
    
    // dataTable.page.len(-1).draw();
    // dataTable.draw();
    // $('#DataTables_Table_0_length').addClass('d-none');

    dataTable.on('xhr.dt', function (e, settings, json, xhr) {
        resumo(json.dataSemPaginacao);
    });

    function resumo (jsonData) {
        // console.log(jsonData);
        // dataTable.page.len(-1).draw();
        // dataTable.draw();
        
        var rowData = jsonData, inforelat = jsonData,
        qtdativos = 0,
        qtdcancpagantes = 0,
        qtdcobrados = 0,
        precomed = 0, precomedaux = 0,
        valortotal = 0, valortotalaux = 0,
        desconto = 0, descontoaux = 0,
        valorfinal = 0, valorfinalaux = 0;
    
        i = 0;
        rowData.forEach(function () {
            // if (rowData[i][indexColumns.status].toLowerCase() == 'ativo') {
                                              
                precomedaux = rowData[i][indexColumns.precomed];
                precomedaux = precomedaux.replace('R$  ', '');
                precomedaux = floatParaPadraoInternacional(precomedaux);
                precomed = parseFloat(precomed) + parseFloat(precomedaux);

                valortotalaux = rowData[i][indexColumns.valortotal];
                valortotalaux = valortotalaux.replace('R$  ', '');
                valortotalaux = floatParaPadraoInternacional(valortotalaux);
                valortotal = parseFloat(valortotal) + parseFloat(valortotalaux);

                descontoaux = rowData[i][indexColumns.desconto];
                descontoaux = descontoaux.replace('R$  ', '');
                descontoaux = floatParaPadraoInternacional(descontoaux);
                desconto = parseFloat(desconto) + parseFloat(descontoaux);

                valorfinalaux = rowData[i][indexColumns.valorfinal];
                valorfinalaux = valorfinalaux.replace('R$  ', '');
                valorfinalaux = floatParaPadraoInternacional(valorfinalaux);
                valorfinal = parseFloat(valorfinal) + parseFloat(valorfinalaux);
                
                qtdativos = parseInt(qtdativos) + parseInt(rowData[i][indexColumns.qtdativos]);
                qtdcancpagantes = parseInt(qtdcancpagantes) + parseInt(rowData[i][indexColumns.qtdcancpagantes]);
                qtdcobrados = parseInt(qtdcobrados) + parseInt(rowData[i][indexColumns.qtdcobrados]);
                // }
            i++;
        });
        precomed = parseFloat(precomed / i) ;
        i = 0;

        $('#qtdativos').text(parseInt(qtdativos));
        $('#qtdcancpagantes').text(parseInt(qtdcancpagantes));
        $('#qtdcobrados').text(parseInt(qtdcobrados));
        $('#precomed').text(floatParaPadraoBrasileiro(precomed));
        $('#valortotal').text(floatParaPadraoBrasileiro(valortotal));
        $('#desconto').text(floatParaPadraoBrasileiro(desconto));
        $('#valorfinal').text(floatParaPadraoBrasileiro(valorfinal));

        // limpar as informações do array que vai formar o relatório
        for (var i=0; i < inforelat.length; i++){
            inforelat[i].shift();
            // inforelat[i].pop();

            var ult = '';
            ult = inforelat[i][15];
                                  
            ult =  ult.split('<div>').join('');
            ult =  ult.split('</div>').join('');
            ult =  ult.split("div class='contatos-escondidos'>");

            var prNomeAux1 = ult[0].trim(), prNomeAux2='';
            prNomeAux1 = prNomeAux1.split('<span>');
            prNomeAux2 = prNomeAux1[1].split('</span>');
            ult[0] = prNomeAux2[0].trim();
            
            // inforelat[i][15] = JSON.stringify(ult);
            inforelat[i][15] = ult;

        }
        
        // console.log(inforelat);

        // pegar o cabeçalho da tabela
        var cabecalho=[], arrCab;
        arrCab = $('.dataTables_scrollHeadInner table thead tr th');
        for(var i=1; i< arrCab.length; i++){
            cabecalho[i-1] = $('.dataTables_scrollHeadInner table thead tr th:eq('+i+')').text().trim();
        }
        inforelat.unshift(cabecalho);

        // colocar as informações do resumo
        inforelat.unshift(['Qtd. Ativos', parseInt(qtdativos),'Qtd. Canc. Pagantes',parseInt(qtdcancpagantes), 'Qtd Cobrados',parseInt(qtdcobrados), 'Preço Médio Mensal', floatParaPadraoBrasileiro(precomed), 'Valor Total',floatParaPadraoBrasileiro(valortotal), 'Valor Desconto', floatParaPadraoBrasileiro(desconto), 'Valor Final', floatParaPadraoBrasileiro(valorfinal) ]);
        console.log('info relatório:', inforelat);
        $('#txt1').val(JSON.stringify(inforelat));

    };

    $('#DataTables_Table_0_length').addClass('d-none');
    $('#DataTables_Table_0_wrapper').addClass('d-none');
    $('#botaoRelatorioExcel').addClass('d-none');
    $('#graficos').addClass('d-none');

    // EVENTOS -----------------------------------------------------------------

    $('#collapseFluxocaixaResumo').on('shown.bs.collapse', function () {
        $('#DataTables_Table_0_wrapper').removeClass('d-none');
        $('#DataTables_Table_0_length').removeClass('d-none');
        $('#botaoRelatorioExcel').removeClass('d-none');
      });

    $('#collapseFluxocaixaResumo').on('hidden.bs.collapse', function () {
        // $('#DataTables_Table_0_wrapper').addClass('d-none');
        // dataTable.page.len(-1).draw();
        // dataTable.draw();
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
            var data = $('#txt1').val();
            if(data != ''){
                JSONToCSVConvertor(data, "Relatório Fechamento Mensal");
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