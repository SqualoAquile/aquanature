
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = parseFloat( $('#ivlmin').val().replace(",",".") );
        var max = parseFloat( $('#ivlmax').val().replace(",",".") );
        var age = parseFloat( data[targetCols].replace(",",".") ) || 0; // use data for the age column
 
        if ( ( isNaN( min ) && isNaN( max ) ) ||
             ( isNaN( min ) && age <= max ) ||
             ( min <= age   && isNaN( max ) ) ||
             ( min <= age   && age <= max ) )
        {
            return true;
        }
        return false;
    }
);

function filterColumn ( i, proc ) {
    if(i != ''){
       $('#tabelaestoque').DataTable().column( i ).search( proc, false, true ).draw();
    }
}

function filterGlobal ( proc ) {
       $('#tabelaestoque').DataTable().search( proc, false, true ).draw();
}

function limparFiltros(){ 
    
    $('#ifiltro1').val("");
    $('#ifiltro1').change();
    $('#icampo1').val("");
    
    $('#ivlmax').val("");
    $('#ivlmin').val("");
    $('#ivalores').val("");
    $('#ivalores').change();
    $('#ipesqglobal').val("");
    $('#ipesqglobal').change();

}

function validaDat(valor){
	var date=valor;
	var ardt=new Array;
	var ExpReg=new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
	ardt=date.split("/");
	erro=false;
	if ( date.search(ExpReg)==-1){
		erro = true;
		}
	else if (((ardt[1]==4)||(ardt[1]==6)||(ardt[1]==9)||(ardt[1]==11))&&(ardt[0]>30))
		erro = true;
	else if ( ardt[1]==2) {
		if ((ardt[0]>28)&&((ardt[2]%4)!=0))
			erro = true;
		if ((ardt[0]>29)&&((ardt[2]%4)==0))
			erro = true;
	}
	if (erro) {
		return false;
	}
	return true;
}

function limparInputsAdd(){
    for(var i=12; i >= 1; i--){
        $("#itxt"+i).val("");
    }
}

function confirmaAdicao(){

    for (var i = 1; i <= 11; i++){
        switch (i) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 8:
            case 9:
                if($('#itxt'+i+'').val() == "" && $('#itxt'+i+'').attr('required') == "required" ){ 
                    alert("Preencha o campo: "+$('#itxt'+i+'').attr('placeholder'));
                    return;
                }
            case 6:
            case 7: //usado para os selects
                if( $('#itxt'+i+'').val() == null && $('#itxt'+i+'').attr('required') == "required" ){
                    alert("Preencha o campo: "+$('#itxt'+i+' :selected').html());
                    return;
                }
                break;    
        }      
    }
    

    if(confirm("Deseja adicionar o Item?")){
        var infos = new Array();

        infos[0] = $('#itxt1').val();
        infos[1] = $('#itxt2').val();
        infos[2] = $('#itxt3').val();
        infos[3] = parseFloat($('#itxt4').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
        infos[4] = parseFloat($('#itxt5').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
        infos[5] = $('#itxt6 :selected').html();
        infos[6] = $('#itxt7').val();
        infos[7] = parseFloat($('#itxt8').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
        infos[8] = parseFloat($('#itxt9').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
        infos[9] = $('#itxt10').val();
        infos[10] = $('#itxt11').val();
        infos[11] = $('#itxt12').val();

        var action = "adicionarItem";
        if(infos != ''){
            $.ajax({
                url:baselink+"/ajax/"+action,
                type: "POST",
                data:{info:infos}, //acentos e caracteres diferentes causam erro, precisam ser utf8 antes de receber
                dataType:"json",  //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
                success:function(json){
                    if(parseInt(json.id) > 0){ // deu certo e remove a linha quitada
                        // inserir o produto na tabela
                        var sigla = json.sigla;
                            sigla = sigla.toLowerCase();
                        var alter = json.alter;
                        var t = $('#tabelaestoque').DataTable();
                        t.row.add( [
                            '<input type="hidden" value='+alter+'/>'+
                            '<input type="checkbox" onchange="selecionaLinha(this)"/>'+
                            '<div data-ident='+json.id+' class="botao_peq_st" onclick="editar(this)">Editar</div>',
                            $('#itxt1').val(),
                            $('#itxt2').val()+sigla,
                            $('#itxt3').val(),
                            $('#itxt4').val(),
                            $('#itxt5').val(),
                            $('#itxt6 :selected').html(),
                            $('#itxt7 :selected').html(),
                            $('#itxt8').val(),
                            $('#itxt9').val(),
                            $('#itxt10').val(),
                            $('#itxt11').val(),
                            $('#itxt12').val(),
                        ] ).draw( true );

                        alert("Operação realizada com sucesso!");
                        $('#iadicao').dialog("close");
                        return;
                    }else{//deu errado - vai de novo
                        alert("A adição não foi realizada, faça novamente.");
                        return;
                    }
                },                
                error:function(){
                    // avisar que não foi feita a quitação
                    alert("A adição não foi realizada, por favor, faça novamente.");
                    return;
                }
            });
        }

    }
}

function selecionaLinha(obj){
    if($(obj).is(':checked')){
        $(obj).closest('tr').addClass('selected');
    }else{
        $(obj).closest('tr').removeClass('selected');
    }
    btnExcluir();
}

function selecionaTodos(obj){
    if($(obj).is(':checked')){
        $('#tabelaestoque tbody input[type=checkbox]').prop('checked',true);
        $('#tabelaestoque tbody tr').addClass('selected');
    }else{
        $('#tabelaestoque tbody input[type=checkbox]').prop('checked',false);  
        $('#tabelaestoque tbody tr.selected').removeClass('selected');
    }
    btnExcluir();
}

function btnExcluir(){
    var totselec = $('#tabelaestoque tbody tr.selected').length;
    if(totselec > 0){
        $("#ititulo3").show();
        $("#iedititens").hide();
    }else{
        $("#ititulo3").hide();
        $("#iedititens").hide();
    }
}

function excluir(){
        if($('#tabelaestoque tbody tr.selected').length <= 0){
        alert("Selecione pelo menos um item na tabela.");
        return;
    }
    if($('#tabelaestoque tbody tr.selected').length > 0){
        if(confirm("Tem Certeza que deseja excluir esses itens?") == true){
            var totlinhas = $('#tabelaestoque tbody tr').length;
            var id = new Array();
            var alteracoes = new Array();
            var j = 0;
            for(var i = 0; i < totlinhas; i++){
                if(typeof $('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(12)').html() != 'undefined'){
                    id[j] = $('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(0)').children('div').attr('data-ident');
                    alteracoes[j] = $('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(0)').children('input').val();
                    j++;
                }
            }
           
            var action = "excluirItens";
            
            if(id != '' && alteracoes != ''){
                $.ajax({
                    url:baselink+"/ajax/"+action,
                    type: "POST",
                    data:{ids:id,alters:alteracoes}, //acentos e caracteres diferentes causam erro, precisam ser utf8 antes de receber
                    dataType:"json",                    //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
                    success:function(json){
                        if(json > 0){ // deu certo e remove a linha quitada
                            alert("Operação realizada com sucesso!");                            
                            window.location.href = baselink+"/estoque";
                            return;
                        }else{//deu errado - vai de novo
                            alert("A quitação não foi realizada, faça novamente.");
                            return;
                        }
                    },
                    error:function(){
                        // avisar que não foi feita a quitação
                        alert("A quitação não foi realizada, por favor, faça novamente.");
                        return;
                    }
                });
            }

        }
    }
}

window.onload = function(){
//    $("#iselecitens").hide();
    $("#ifiltros").hide();
    $('#ititulo3').hide();
};

$(document).ready(function () {
    $("#ititulo1").click(function(){
        $("#ifiltros").slideToggle();
    });
//    $("#ititulo2").click(function(){
//        $("#iadicao").slideToggle();
//    });
    
    // filtro global de texto
    $('#ipesqglobal').on('keyup change' ,function(){
        filterGlobal( $('#ipesqglobal').val() );
    });
    
    $('#ivlmin, #ivlmax').change( function() {
        if($('#ivalores').val() != ""){
            targetCols = $('#ivalores').val();
            table.draw();
        }else{
            $('#ivlmin').val("");
            $('#ivlmax').val("");
            table.draw();
            alert("Escolha o campo de Valor a ser filtrado.")
        }
    } );
    
    $('#ivalores').change(function(){
        if($('#ivalores').val() != ""){
            $('#ivlmin, #ivlmax').change(); 
        }else{
            $('#ivlmin').val("");
            $('#ivlmax').val("");
            table.draw();
        }
    }); 
    
    //filtros de texto
    $('#ifiltro1').on('keyup change' ,function(){
        if($('#icampo1 :selected').val() == ""){
            $('#ifiltro1').val("");
        }else{
            filterColumn( $('#icampo1 :selected').val(), $('#ifiltro1').val() );
        }    
    });
    
    $('#icampo1').on('focus',function(){             
        if($('#ifiltro1').val() != ""){
          $('#ifiltro1').val("");  
          $('#ifiltro1').change();  
        }
    });
        
    //configuração da tabela
    var table = $('#tabelaestoque').DataTable( 
        {   
            columnDefs: [
                { orderable: false, targets: [0] },
            ],
            scrollY: '100vh',
            scrollCollapse: true,
            "scrollX": true,
            
            responsive:true,
            
            "language": {
                "decimal": ",",
                "thousands": ".",
                "sEmptyTable": "Nenhum registro encontrado",
                "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                "sInfoPostFix": "",
                "sInfoThousands": ".",
                "sLengthMenu": "_MENU_ Resultados por página",
                "sLoadingRecords": "Carregando...",
                "sProcessing": "Processando...",
                "sZeroRecords": "Nenhum registro encontrado",
                "sSearch": "Pesquisar",
                "oPaginate": {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                },
                "oAria": {
                    "sSortAscending": ": Ordenar colunas de forma ascendente",
                    "sSortDescending": ": Ordenar colunas de forma descendente"
                }
            },
        
            "lengthMenu": [[10, 20], [10, 20]],
            
            "dom": '<l><t><ip>',
        }
    );
    
    table.on( 'draw', function () {
        $('#iselectodos').prop('checked',false);
        $('#tabelaestoque tbody input[type=checkbox]').prop('checked',false);
        $('#tabelaestoque tbody tr.selected').removeClass('selected');
        btnExcluir();
    } );
    
    $("#iadicao").dialog({
        autoOpen: false,
        show: {
          effect: "blind",
          duration: 500
        },
        hide: {
          effect: "blind",
          duration: 500
        },  
        resizable: true,
        height: "auto",
        modal: true
    });
    
    $("#iedicao").dialog({
        autoOpen: false,
        show: {
          effect: "blind",
          duration: 500
        },
        hide: {
          effect: "blind",
          duration: 500
        },  
        resizable: true,
        height: "auto",
        modal: true
    });
        
    $( "#ititulo2" ).on( "click", function() {
        limparInputsAdd();
        var larg = parseInt(window.innerWidth * 0.95);
        $('#iadicao').dialog("option", "width", larg);
        $("#iadicao").dialog( "open" );
    });
    
    window.onresize = function(){
        var larg = parseInt(window.innerWidth * 0.95);
        $('#iadicao').dialog("option", "width", larg);
    };
    
    $('#itxt1').autocomplete({
      source: fornecedores
    });
    $('#itxt1').blur(function(){
        if( $("#itxt1").val() != ''){
            if($.inArray($("#itxt1").val(), fornecedores) ==  -1 ){
                alert("Fornecedor não encontrado.");
                $("#itxt1").val("");
                $("#itxt2").val("");
                $("#itxt3").val("");
            }else{
                var nome = $(this).val();
                var action = "buscaProdutosFornecedor";
                if($(this).val() != ''){
                    $.ajax({
                        url:baselink+"/ajax/"+action,
                        type: 'POST',
                        data:{q:nome},
                        dataType:'json',
                        success:function(json){
                            if(json.length > 0){
                               //preenche o autocomplete do produto
                               $( "#itxt3" ).autocomplete({
                                    source: json
                                });
                            }
                        }
                    });
                }
            }    
        }
    });
    
    $('#ietxt1').autocomplete({
      source: fornecedores
    });
    $('#ietxt1').blur(function(){
        if( $("#ietxt1").val() != ''){
            if($.inArray($("#ietxt1").val(), fornecedores) ==  -1 ){
                alert("Fornecedor não encontrado.");
                $("#ietxt1").val($("#ietxt1").attr('data-ant'));
                $("#ietxt2").val($("#ietxt2").attr('data-ant'));
                $("#ietxt3").val($("#ietxt3").attr('data-ant'));
            }else{
                var nome = $(this).val();
                var action = "buscaProdutosFornecedor";
                if($(this).val() != ''){
                    $.ajax({
                        url:baselink+"/ajax/"+action,
                        type: 'POST',
                        data:{q:nome},
                        dataType:'json',
                        success:function(json){
                            if(json.length > 0){
                               //preenche o autocomplete do produto
                               $( "#ietxt3" ).autocomplete({
                                    source: json
                                });
                            }else{
                                $( "#ietxt3" ).autocomplete({
                                    source: ""
                                });
                            }
                        }
                    });
                }
            }    
        }
    });
    
    $('#itxt2').on('blur',function(){
        if( $("#itxt1").val() != ""){
            if($("#itxt2").val() != "" ){ 
                var cod = $(this).val();
                var forn = $("#itxt1").val();
                var action = "ConfereCodProd";
                if($(this).val() != ''){
                    $.ajax({
                        url:baselink+"/ajax/"+action,
                        type: 'POST',
                        data:{codigo:cod, fornecedor:forn},
                        dataType:'json',
                        success:function(json){
                            if(json.length > 0){
                               $('#itxt2').val("");
                               alert("O Código do Produto já existe. Tente outro.");
                            }
                        }
                    });
                }
            }
        }else if($("#itxt2").val() != ""){
           alert("Preencha o Fornecedor."); 
        }    
    });
    
    $('#ietxt2').on('blur',function(){
        if( $("#ietxt1").val() != ""){
            if($("#ietxt2").val() != "" ){ 
                var cod = $(this).val();
                var forn = $("#ietxt1").val();
                var action = "ConfereCodProd";
                if($(this).val() != ''){
                    $.ajax({
                        url:baselink+"/ajax/"+action,
                        type: 'POST',
                        data:{codigo:cod, fornecedor:forn},
                        dataType:'json',
                        success:function(json){
                            if(json.length > 0){
                               $('#ietxt2').val($("#ietxt2").attr('data-ant'));
                               alert("O Código do Produto já existe. Tente outro.");
                            }
                        }
                    });
                }
            }
        }else if($("#ietxt2").val() != ""){
           alert("Preencha o Fornecedor."); 
        }    
    });
                                
    $('#itxt4').mask("#.##0,00", {reverse: true});
    $('#itxt4').on('blur',function(){
        if($("#itxt4").val() != ""){
            if($("#itxt5").val() != ""){
                var custo = $('#itxt4').val()
                    custo = custo.replace(".","").replace(".","").replace(".","").replace(".","");
                    custo = custo.replace(",",".");
                    custo = parseFloat(custo); 
                    
                var venda = $('#itxt5').val()
                    venda = venda.replace(".","").replace(".","").replace(".","").replace(".","");
                    venda = venda.replace(",",".");
                    venda = parseFloat(venda);
                
                if(custo > venda){
                   alert("O valor de venda deve ser maior do que o valor de custo.");
                   $("#itxt4").val("");
                   $("#itxt5").val("");
                }
            }else{
                if($("#itxt4").val() <= 0){
                   alert("O valor deve ser maior do que zero.");
                   $("#itxt4").val("");
                }
            }    
        }    
    });
    
    $('#ietxt4').mask("#.##0,00", {reverse: true});
    $('#ietxt4').on('blur',function(){
        if($("#ietxt4").val() != ""){
            if($("#ietxt5").val() != ""){
                var custo = $('#ietxt4').val()
                    custo = custo.replace(".","").replace(".","").replace(".","").replace(".","");
                    custo = custo.replace(",",".");
                    custo = parseFloat(custo); 
                    
                var venda = $('#ietxt5').val()
                    venda = venda.replace(".","").replace(".","").replace(".","").replace(".","");
                    venda = venda.replace(",",".");
                    venda = parseFloat(venda);
                
                if(custo > venda){
                   alert("O valor de venda deve ser maior do que o valor de custo.");
                   $("#ietxt4").val($("#ietxt4").attr('data-ant'));
                   $("#ietxt5").val($("#ietxt5").attr('data-ant'));
                }
            }else{
                if($("#ietxt4").val() <= 0){
                   alert("O valor deve ser maior do que zero.");
                   $("#ietxt4").val($("#ietxt4").attr('data-ant'));
                }
            }    
        }    
    });
    
    $('#itxt5').mask("#.##0,00", {reverse: true});
    $('#itxt5').on('blur',function(){
        if($("#itxt5").val() != ""){            
            if($("#itxt4").val() != ""){  
                var custo = $('#itxt4').val()
                    custo = custo.replace(".","").replace(".","").replace(".","").replace(".","");
                    custo = custo.replace(",",".");
                    custo = parseFloat(custo); 
                    
                var venda = $('#itxt5').val()
                    venda = venda.replace(".","").replace(".","").replace(".","").replace(".","");
                    venda = venda.replace(",",".");
                    venda = parseFloat(venda);
                
                if(custo > venda){
                   alert("O valor deve ser maior do que o valor de custo.");
                   $("#itxt5").val("");
                }
            }else{
                alert("Preencha o valor de custo.");
                $("#itxt5").val("");
            }    
        }    
    });
    
    $('#ietxt5').mask("#.##0,00", {reverse: true});
    $('#ietxt5').on('blur',function(){
        if($("#ietxt5").val() != ""){            
            if($("#ietxt4").val() != ""){  
                var custo = $('#ietxt4').val()
                    custo = custo.replace(".","").replace(".","").replace(".","").replace(".","");
                    custo = custo.replace(",",".");
                    custo = parseFloat(custo); 
                    
                var venda = $('#ietxt5').val()
                    venda = venda.replace(".","").replace(".","").replace(".","").replace(".","");
                    venda = venda.replace(",",".");
                    venda = parseFloat(venda);     

                if(custo > venda){
                   alert("O valor deve ser maior do que o valor de custo.");
                   $("#ietxt5").val($("#ietxt5").attr('data-ant'));
                }
            }else{
                alert("Preencha o valor de custo.");
                $("#ietxt5").val($("#ietxt5").attr('data-ant'));
            }    
        }    
    });
    
    $('#itxt8').mask("#.##0,00", {reverse: true});
    $('#itxt8').on('blur',function(){
        if($("#itxt8").val() != ""){            
            if($("#itxt8").val() <= 0){
               alert("O valor deve ser maior do que zero.");
               $("#itxt8").val("");
            }
        }    
    });
    
    $('#ietxt8').mask("#.##0,00", {reverse: true});
    $('#ietxt8').on('blur',function(){
        if($("#ietxt8").val() != ""){            
            if($("#ietxt8").val() <= 0){
               alert("O valor deve ser maior do que zero.");
               $("#ietxt8").val($("#ietxt8").attr('data-ant'));
            }
        }    
    });
    
    $('#itxt9').mask("#.##0,00", {reverse: true});
    $('#itxt9').on('blur',function(){
        if($("#itxt9").val() != ""){            
            if($("#itxt9").val() < 0){
               alert("O valor deve ser maior do que zero.");
               $("#itxt9").val("");
            }
        }    
    });
    
    $('#ietxt9').mask("#.##0,00", {reverse: true});
    $('#ietxt9').on('blur',function(){
        if($("#ietxt9").val() != ""){            
            if($("#ietxt9").val() < 0){
               alert("O valor deve ser maior do que zero.");
               $("#ietxt9").val($("#ietxt9").attr('data-ant'));
            }
        }    
    });
    
    $('#itxt11').mask("00000000", {reverse: true});
    $('#itxt11').on('blur',function(){
        if($("#itxt11").val() != ""){            
            if($("#itxt11").val().length < 8){
               alert("O valor deve ter 8 caracteres.");
               $("#itxt11").val("");
            }
        }    
    });
    
    $('#ietxt11').mask("00000000", {reverse: true});
    $('#ietxt11').on('blur',function(){
        if($("#ietxt11").val() != ""){            
            if($("#ietxt11").val().length < 8){
               alert("O valor deve ter 8 caracteres.");
               $("#ietxt11").val($("#ietxt11").attr('data-ant'));
            }
        }    
    });
});

function limparInputsEdt(){
    for(var i=12; i >= 1; i--){
        $("#itxt"+i).val("");
        $("#itxt"+i).attr('data-ant',"");
    }
}

function editar(obj){
    $('#iselectodos').prop('checked',false);
    $('#iselectodos').change();
    limparInputsEdt();
    
    var idlinha = $(obj).closest('tr').children('td:eq(0)').children('div:eq(0)').attr('data-ident');
    var alter = $(obj).closest('tr').children('td:eq(0)').children('input:eq(0)').val();
    
    var forn   = $(obj).closest('tr').children('td:eq(1)').html();
        forn = forn.toUpperCase();
        
    var cod    = $(obj).closest('tr').children('td:eq(2)').html();
        cod = cod.substr(0,cod.length - 2).trim();
        
    var prod   = $(obj).closest('tr').children('td:eq(3)').html();
    var custo  = $(obj).closest('tr').children('td:eq(4)').html();
    var venda  = $(obj).closest('tr').children('td:eq(5)').html();
    var unid   = $(obj).closest('tr').children('td:eq(6)').html();
        unid = unid.toUpperCase();
    var granel = $(obj).closest('tr').children('td:eq(7)').html();
        granel = granel.toUpperCase().trim();
    var qtdA   = $(obj).closest('tr').children('td:eq(8)').html(); 
    var qtdMin = $(obj).closest('tr').children('td:eq(9)').html(); 
    var local  = $(obj).closest('tr').children('td:eq(10)').html();
    var ncm    = $(obj).closest('tr').children('td:eq(11)').html();
    var observ = $(obj).closest('tr').children('td:eq(12)').html();
    
    
    $('#ietxt1').val(forn);
    $('#ietxt1').attr('data-ant',forn);
    $('#ietxt1').attr('data-ident',idlinha);
    $('#ietxt1').attr('data-alter',alter);
    $('#ietxt1').blur();
    
    $('#ietxt2').val(cod);
    $('#ietxt2').attr('data-ant',cod);
   
    $('#ietxt3').val(prod);
    $('#ietxt3').attr('data-ant',prod); 
    
    $('#ietxt4').val(custo);
    $('#ietxt4').attr('data-ant',custo); 
    
    $('#ietxt5').val(venda);
    $('#ietxt5').attr('data-ant',venda); 
    
    var opt ='';
    $('#ietxt6').attr('data-ant',unid); 
    if($('#ietxt6 option').length > 1){
       for(var i = 1; i < $('#ietxt6 option').length; i++ ){
           opt = $('#ietxt6 option:eq('+i+')').html();
           opt = opt.toUpperCase();
           if(opt == unid){
               var val = $('#ietxt6 option:eq('+i+')').val();
           }
       } 
       $('#ietxt6').val(val);
    }
    
    $('#ietxt7').attr('data-ant',granel); 
    if(granel == 'SIM'){
        $('#ietxt7').val('1');
    }else{
        $('#ietxt7').val('0'); 
    }
       
    $('#ietxt8').val(qtdA);
    $('#ietxt8').attr('data-ant',qtdA);
    
    $('#ietxt9').val(qtdMin);
    $('#ietxt9').attr('data-ant',qtdMin);
    
    $('#ietxt10').val(local);
    $('#ietxt10').attr('data-ant',local);
    
    $('#ietxt11').val(ncm);
    $('#ietxt11').attr('data-ant',ncm);
    
    $('#ietxt12').val(observ);
    $('#ietxt12').attr('data-ant',observ);
    
    $('#ietxt13').val(alter);
    
    $("#ititulo3").hide();
   
    var larg = parseInt(window.innerWidth * 0.95);
    $('#iedicao').dialog("option", "width", larg);
    $("#iedicao").dialog( "open" );
}

function confirmaEdicao(){
    
    if($("#itxt1").attr('data-ident') == '' && $("#itxt1").attr('data-alter') == '' && $("#itxt1").attr('data-ant') == '' ){
        alert("Algum problema ocorreu.");
        $("#iedicao").dialog( "close" );
        return;
    }
    
    var alters = '';
    for (var i = 1; i <= 12; i++){
        switch (i) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
                if($('#ietxt'+i+'').attr('data-ant') == '' && $('#ietxt'+i+'').attr('required') == "required" ){
                   alert("Algum problema ocorreu."+$('#ietxt'+i+'').attr('placeholder'));
                   $("#iedicao").dialog( "close" ); 
                   return;
                }   
                if($('#ietxt'+i+'').val() == "" && $('#ietxt'+i+'').attr('required') == "required" ){ 
                    alert("Preencha o campo: "+$('#ietxt'+i+'').attr('placeholder'));
                    return;
                }            
                if($('#ietxt'+i+'').val().toUpperCase().trim() != $('#ietxt'+i+'').attr('data-ant').toUpperCase().trim()){
                    alters = alters + '[ ' + $('#ietxt'+i+'').attr('placeholder') + ' - de (' + $('#ietxt'+i+'').attr('data-ant') + ') para (' + $('#ietxt'+i+'').val() + ')]';
                }
                break;
            case 6:
            case 7: 
                var atual = "", antiga = "";
                
                if($('#ietxt'+i+'').attr('required') == "required" && $('#ietxt'+i).attr('data-ant') == ''){
                    alert("Algum problema ocorreu.");
                    $("#iedicao").dialog( "close" );
                    return;
                }    
                if($('#ietxt'+i).val() == null && $('#ietxt'+i+'').attr('required') == "required" ){ 
                    alert("Preencha o campo: "+$('#ietxt'+i+' :selected').html());
                    return;
                }
                atual = ''; 
                atual = $('#ietxt'+i).children('option:selected').html();
                atual = atual.toUpperCase().trim();
                antiga = '';
                antiga = $('#ietxt'+i).attr('data-ant');
                antiga = antiga.toUpperCase().trim();
                if( atual != antiga){
                    alters = alters + '[ ' + $('#ietxt'+i+'').children('option:eq(0)').html() +
                                      ' - de (' + $('#ietxt'+i+'').attr('data-ant') + ')'+
                                      ' para (' + $('#ietxt'+i+' :selected').html().toUpperCase() + ')]';                           
                }
                break;
        }      
    }

    if(alters != ""){
        if(confirm("Deseja editar o Item?")){
            var infos = new Array();
            
            infos[0] = $('#ietxt1').attr('data-ident');  //id
            infos[1] = $('#ietxt1').val();               //forn 
            infos[2] = $('#ietxt2').val();               //cod 
            infos[3] = $('#ietxt3').val();               //prod 
            infos[4] = parseFloat($('#ietxt4').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2); //custo
            infos[5] = parseFloat($('#ietxt5').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2); //venda
            infos[6] = $('#ietxt6 :selected').html();    //unid
            infos[7] = $('#ietxt7').val();               //granel
            infos[8] = parseFloat($('#ietxt8').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2); //qtd atual
            infos[9] = parseFloat($('#ietxt9').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2); //qtd min
            infos[10] = $('#ietxt10').val();             //local 
            infos[11] = $('#ietxt11').val();             //ncm   
            infos[12] = $('#ietxt12').val();             //observ
            infos[13] = $('#ietxt1').attr('data-alter'); //alterações antigas do item
            infos[14] = alters;                         //alterações atuais do item
            

            var action = "editarItemEstoque";
            if(infos != ''){
                $.ajax({
                    url:baselink+"/ajax/"+action,
                    type: "POST",
                    data:{info:infos}, //acentos e caracteres diferentes causam erro, precisam ser utf8 antes de receber
                    dataType:"json",                    //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
                    success:function(json){
                        if(json > 0){ // deu certo e remove a linha quitada
                            alert("Operação realizada com sucesso!");
                            location.reload();
                            return;
                        }else{//deu errado - vai de novo
                            alert("A edição não foi realizada, faça novamente.");
                            return;
                        }
                    },
                    error:function(){
                        // avisar que não foi feita a quitação
                        alert("A edição não foi realizada, por favor, faça novamente.");
                        return;
                    }
                });
            }

        }
    }else{
        alert("Não foram feitas edições. Tente Novamente.");
        return;
    }
}