window.onload = function(){
   
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = day + '/' + month + '/' + year;
    $("#iaux2").attr("value", today);
    
    limpaCondPgto();
    
    $('.edicaoinfo').hide();
    $('.itenscaixa').hide();
    
    $("#infoparcela").hide();
};

$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {

        if(isNaN(parseFloat(targetCols1))){
          targetCols1 = 8;  
        }
        var min = parseFloat( $('#ivlmin').val().replace(",",".") );
        var max = parseFloat( $('#ivlmax').val().replace(",",".") );
        var age = parseFloat( data[targetCols1].replace(",",".") ) || 0; // use data for the age column

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

function filtroGlobal ( proc ) {
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

function selecionaLinha(obj){
    if($(obj).is(':checked')){
        $(obj).closest('tr').addClass('selected');
    }else{
        $(obj).closest('tr').removeClass('selected');
    }
}

function selecionaTodos(obj){
    
    //if($(obj).is(':checked')){
    if($(obj).prop('checked') == true){    
        $('#tabelaestoque tbody tr td input[type=checkbox]').prop('checked',true);
        $('#tabelaestoque tbody tr').addClass('selected');
    }else{
        $('#tabelaestoque tbody input[type=checkbox]').prop('checked',false);  
        $('#tabelaestoque tbody tr.selected').removeClass('selected');
        $(obj).prop('checked', false);
    }
}

function limpaCondPgto(){
    $("#icondpgto").val("");
    $("#icondpgto").css("background-color","#CCC");
    $("#icondpgto").attr("disabled","disabled");

    $("#inroparcela").val("");
    $("#inroparcela").css("background-color","#CCC");
    $("#inroparcela").attr("disabled","disabled");
    $("#idiavenc").val("");
    $("#idiavenc").css("background-color","#CCC");
    $("#idiavenc").attr("disabled","disabled");
    
    $("#infoparcela").hide();

  }

$(document).ready(function () {
    
    
    // FILTRO DA PESQUISA DE PRODUTOS (ADICIONAR)
    
    $("#btnBusca").click(function(){
        $("#campoFlex1").slideToggle();
    });
    $("#btnComposicao").click(function(){
        $("#campoFlex2").slideToggle();
    });
    $("#btnPgto").click(function(){
        $("#campoFlex3").slideToggle();
    });
    // filtro global de texto
    $('#ipesqglobal').on('keyup change' ,function(){
        filtroGlobal( $('#ipesqglobal').val() );
    });
    
    $('#ivlmin, #ivlmax').change( function() {
        if($('#ivalores').val() != ""){
            targetCols1 = $('#ivalores').val();
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
            
        
//            "lengthMenu": [[10,15], [10,15]],
//            "dom": '<l><t><ip>',
            "dom": '<t><ip>',
        }
    );
    
    table.on( 'draw', function () {
        $('#tabelaestoque tbody input[type=checkbox]').prop('checked',false);  
        $('#tabelaestoque tbody tr.selected').removeClass('selected');
        $("#iselectodos1").prop('checked', false);
    } );
          
    
// filtro da página inicial de compras    
    $('#ifiltro').on('keyup change' ,function(){
        filterColumn( $('#icampo').val() );
    });
    
    $('#icampo').on('focus',function(){             
        if($('#ifiltro').val() != ""){
          $('#ifiltro').val("");  
          $('#ifiltro').change();  
        }
    });
    
    $('#tabelacompras').DataTable( 
        {
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
        
            "lengthMenu": [[10, 20, 30, -1], [10, 20, 30, "Todos"]],
            
            "dom": '<l><t><ip>'
        }
        
    );

    
    // coloca as máscaras nos inputs e testes
    $('#iaux3').mask("#.##0,00", {reverse: true});
    $('#iaux3').on('blur',function(){
        calcularesumo();
    });
    
// filtro das datas
    $("#iaux2").datepicker();
    
    $("#iaux2").blur(function(){
        var valor = $("#iaux2").val();
            valor = valor.split("/");
        var data = valor[0]+"/"+valor[1]+"/"+valor[2];
        if(valor != ""){
            if(typeof valor[1] == 'undefined' ||typeof valor[2] == 'undefined'){
                $('#iaux2').val("");
                alert("não é uma data válida!!!");
                return;
            }
            if(valor[2].length > 4 || valor[0].length > 2 ||  valor[1].length > 2){ 
                $('#iaux2').val("");
                alert("não é uma data válida!!!");
                return;
            }
            if(validaDat(data) == false){
                $('#iaux2').val("");
                alert("não é uma data válida!!!");
                return;
            }
        }
    });


//    $('input').keypress(function (e) { // elimina o * da digitação
//        var code = null;
//        code = (e.keyCode ? e.keyCode : e.which);                
//        return (code == 13) ? false : true;
//    });
//   
    $('#iformapgto').change(function(){
        limpaCondPgto();
        if($("#iformapgto :selected").val() != ""){
            $("#icondpgto").val("");
            $("#icondpgto").css("background-color","#FFF");
            $("#icondpgto").removeAttr("disabled");  
            
            switch ($('#iformapgto :selected').html()){
                case('Cartão Débito'):
                        $("#icondpgto").empty();
                        $('#icondpgto').append('<option value="" disabled>Condição de Pagamento</option>');
                        $("#icondpgto").append('<option value="À Vista" selected>À Vista</option>');
                        $("#icondpgto").css("background-color","#CCC");
                        $("#icondpgto").attr("disabled","disabled");
                        $("#icondpgto").change();
                        break;
                case('Cartão Crédito'):
                        $("#icondpgto").empty();
                        $('#icondpgto').append('<option value="" disabled>Condição de Pagamento</option>');
                        $("#icondpgto").append('<option value="Parcelado" selected>Parcelado</option>');
                        $("#icondpgto").css("background-color","#CCC");
                        $("#icondpgto").attr("disabled","disabled");
                        $("#icondpgto").change();
                        break;
                default:
                        $("#icondpgto").empty();
                        $('#icondpgto').append('<option value="" disabled selected>Condição de Pagamento</option>');
                        $("#icondpgto").append('<option value="À Vista">À Vista</option>');
                        $("#icondpgto").append('<option value="Parcelado">Parcelado</option>');
                        $("#icondpgto").css("background-color","#FFF");
                        $("#icondpgto").removeAttr("disabled");
                        break;
            }
        }
    });
    
    $('#icondpgto').change(function(){
        if($('#icondpgto :selected').html() == ""){
            
            $("#inroparcela").val("");
            $("#inroparcela").css("background-color","#CCC");
            $("#inroparcela").attr("disabled","disabled");
            $("#idiavenc").val("");
            $("#idiavenc").css("background-color","#CCC");
            $("#idiavenc").attr("disabled","disabled");
            
            $("#infoparcela").slideUp("fast");

            return;
        }
        if($('#iaux2').val() == "" | $('#ivalortotal').val() == ""){
            $('#iformapgto').val("");
            limpaCondPgto();
            alert("Preencha a data e/ou o valor do lançamento.");
            return;
        }     
                
        switch ($('#iformapgto :selected').html()){             
                case('Dinheiro'):
                case('Cheque'):
                case('Boleto'):
                case('TED'):
                case('DOC'):
                case('Transferência'): 
                   
                    if($('#icondpgto :selected').html() == "À Vista"){
                        $("#inroparcela").val(0);
                        $("#inroparcela").css("background-color","#CCC");
                        $("#inroparcela").attr("disabled","disabled");

                        var valor = $("#iaux2").val();
                            valor = valor.split("/");
                        var dia = valor[0];
                        $("#idiavenc").val(dia);
                        $("#idiavenc").css("background-color","#CCC");
                        $("#idiavenc").attr("disabled","disabled");   
                        
                        $("#infoparcela").slideUp("fast");
        
                    }else{                                  
                        $("#inroparcela").val("");
                        $("#inroparcela").css("background-color","#FFF");
                        $("#inroparcela").removeAttr("disabled");

                        $("#idiavenc").val("");
                        $("#idiavenc").css("background-color","#FFF");
                        $("#idiavenc").removeAttr("disabled");
                        
                        $("#infoparcela").slideDown("fast");
                    }
                    break;
                    
                case('Cartão Débito'):
                case('Cartão Crédito'):
                    if($('#icondpgto :selected').html() == "À Vista"){
                        $("#inroparcela").val(0);
                        $("#inroparcela").css("background-color","#CCC");
                        $("#inroparcela").attr("disabled","disabled");

                        var valor = $("#iaux2").val();
                            valor = valor.split("/");
                        var dia = valor[0];
                        $("#idiavenc").val(dia);
                        $("#idiavenc").css("background-color","#CCC");
                        $("#idiavenc").attr("disabled","disabled");
                        
                        $("#infoparcela").slideUp("fast");
                    }else{
                        $("#inroparcela").val("");
                        $("#inroparcela").css("background-color","#FFF");
                        $("#inroparcela").removeAttr("disabled");

                        $("#idiavenc").val(dia);
                        $("#idiavenc").css("background-color","#FFF");
                        $("#idiavenc").removeAttr("disabled");
                        
                        $("#infoparcela").slideDown("fast");
                    }  
                    break;
                default:
                    break;
        }
    });
    
});

function excluiTodosContatos(){
//    limpaAux();
//    if($('#iconts div.input-pai').length > 1){
//       for(var i = 1; i < $('#iconts div.input-pai').length; i++){
//           $('#iconts div.input-pai:eq('+i+')').remove();
//       } 
//    }
//    $("#itxt14").val($("#itxt14").attr('data-ant'));
}

function limpaAux(){
//    $("#inome").val("");
//    $("#inome").attr("data-ident","");
//    $("#isetor").val("");
//    $("#icel").val("");
//    $("#iemail").val("");
}

function adicionaContato(){
//    if($("#inome").val() == ''){
//        alert("Preencha o nome do Contato.");
//        return;
//    }else if($("#icel").val() == '' && $("#iemail").val() == ''){
//        alert("Preencha pelo menos um dos campos Celular ou Email.");
//        return;
//    }else{
//        if($("#inome").attr('data-ident') == ''){
//            //ADICIONA UM NOVO CONTATO
//            var idmax = 0;
//            var idaux = 0;
//            var nroArray = 0;
//            
//            if($('#iconts input').length > 4){
//                for(var i = 4; i < $('#iconts input').length; i++){
//                    idaux = parseInt($('#iconts input:eq('+i+')').attr('id'));
//                    if(idaux > idmax){
//                        idmax = idaux;
//                    }
//                }
//            }
//
//            var nome = $("#inome").val().trim();
//            var setor = $("#isetor").val().trim();
//            var celular = $("#icel").val().trim();
//            var email = $("#iemail").val().trim();
//            if(idmax > 0){
//                nroArray = parseInt($('#iconts input').length - 4);
//            }    
//
//            var linha = "<div class='input-pai'>"+
//                            "<div class='input-filho'>"+
//                                "<input type='text'  class='input-block' readonly='readonly' id="+(idmax+1)+" name='contatos["+nroArray+"]'"+
//                                " value = '[ "+nome+" * "+setor+" * "+celular+" * "+email+" ]' />"+
//                            "</div>"+
//                            "<div class='input-filho'>"+
//                                "<div class='botao_peq_cl1' onclick='editaContato(this)'> Edt </div>"+       
//                                "<div class='botao_peq_cl1' onclick='excluiContato(this)'> Exc </div>"+
//                            "</div>"+
//                        "</div>";
//            
//            $('#iconts').append(linha);
//
//        }else{
//            //EDITA UM CONTATO EXISTENTE
//            var idalter = $("#inome").attr('data-ident');
//            
//            if($('#iconts input').length > 4){
//                for(var i = 4; i < $('#iconts input').length; i++){
//                    if($('#iconts input:eq('+i+')').attr('id') == $("#inome").attr('data-ident')){
//                        var nome = $("#inome").val().trim();
//                        var setor = $("#isetor").val().trim();
//                        var celular = $("#icel").val().trim();
//                        var email = $("#iemail").val().trim();
//                        
//                        $('#iconts input:eq('+i+')').val("[ "+nome+" * "+setor+" * "+celular+" * "+email+" ]");
//                        
//                    }
//                }
//            }
//        }
//        
//        limpaAux();
//        atualizaContatos();
//    }
}

function editaContato(obj){
//    limpaAux();
//    
//    var conteudo = $(obj).closest('.input-pai').children('.input-filho').children('input').val();
//        conteudo = conteudo.split('*');
//    
//    var ident = $(obj).closest('.input-pai').children('.input-filho').children('input').attr('id');
//    
//    $("#inome").val(conteudo[0].trim().replace("[",""));
//    $("#inome").attr("data-ident",ident);
//    $("#isetor").val(conteudo[1].trim());
//    $("#icel").val(conteudo[2].trim());
//    $("#iemail").val(conteudo[3].trim().replace("]",""));
    
}

function excluiItem(obj){
    $(obj).closest('tr').remove();
    calcularesumo();
}

function atualizaContatos(){
//    var contatos = "";
//    if($('#iconts input').length > 4){
//        for(var i = 4; i < $('#iconts input').length; i++){
//            contatos += $('#iconts input:eq('+i+')').val();
//        }
//    }
//    $('#itxt14').val(contatos);
}

function limparPreenchimento(){
     
    for (var i = 1; i<= 14; i++){
        $('#itxt'+i+'').val("");   
    }

}

function testeEnvio(){
    event.preventDefault();
    
    var alters = '';
        
    for (var i = 1; i <= 14; i++){
        switch (i) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
                if($('#itxt'+i+'').val() == "" && $('#itxt'+i+'').attr('required') == "required" ){ 
                    alert("Preencha o campo: "+$('#itxt'+i+'').attr('placeholder'));
                    return;
                }else{
                    if($('#itxt'+i+'').val().toUpperCase().trim() != $('#itxt'+i+'').attr('data-ant').toUpperCase().trim() ){
                       alters = alters + '[ '+$('#itxt'+i+'').attr('placeholder').toUpperCase()+': de ( ' + $('#itxt'+i+'').attr('data-ant') + ' ) para ( ' + $('#itxt'+i+'').val() + ' )]'; 
                    }
                } 
        }      
    }
    
    
    if(alters != ""){
        $("#itxt16").val(alters);
//        if(confirm("Deseja editar o Item?") ==  true){
//            return true;
//        }else{
//            return false;
//        }
        if($("#ipj").is(":checked") == true ){
            if($("#itxt2").val() == "" && $('#iconts input').length < 5){
                alert("Preencha o valor do CNPJ ou algum contato da empresa.");
                return false;
            }else{
                if(confirm("Deseja adicionar o Item?") ==  true){
                    return true;
                }else{
                    return false;
                }  
            }
        }else{
            if(confirm("Deseja adicionar o Item?") ==  true){
                return true;
            }else{
                return false;
            }  
        }   
    }else{
        alert("Não foram feitas Edições. Tente Novamente.");
        return false;    
    }        
    
}

function testeEnvio1(){
    if($("#ipj").is(":checked") == true ){
        if($("#itxt2").val() == "" && $('#iconts input').length < 5){
            alert("Preencha o valor do CNPJ ou algum contato da empresa.");
            return false;
        }else{
            if(confirm("Deseja adicionar o Item?") ==  true){
                return true;
            }else{
                return false;
            }  
        }
    }else{
        if(confirm("Deseja adicionar o Item?") ==  true){
            return true;
        }else{
            return false;
        }  
    }   
    
       
    
}

function inserirItem(){
    var totlinhas = $('#tabelaestoque tbody tr.selected').length;
    var totcolunas = $('#tabelaestoque tbody tr:eq(0) td').length;
    var incluir = true;
    var idqtd = '';
    var idpct = '';
    var idpvd = '';
    // ambos os números começam do zero e vão até total - 1

    if(totlinhas <= 0 ){
        alert("Selecione algum Item.");
        return;
    }
    
    // verificar se o item já está na tabela
    // deixar o campo de quantidade útil pra mudar e testar se tem em estoque quando muda

    var arraylinhas = new Array();
    
    for(var i = 0; i < totlinhas; i++){
        
        if($("#tabelaenvio tbody").length > 0){
            var max = 0;
            $("#tabelaenvio tbody tr").each(function(){
                var maxant = parseInt($(this).find('a').attr("data-ident"));
                if(maxant > max){
                    max = maxant;
                }
            });
                max++; 
        }else{
            max = 1;
        }
        
        incluir = true;
        var codLinhaEstoque = $('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(2)').html().trim().toUpperCase();
        // testar se a linha tem na tabela de envio
        for(var j = 0; j <= parseInt($('#tabelaenvio tbody tr').length - 1); j++ ){
            var codEnvioAtual = $('#tabelaenvio tbody tr:eq('+j+') td:eq(2) input:eq(0)').val().trim().toUpperCase();
            if(codLinhaEstoque == codEnvioAtual){  
               incluir = false;
            }
        }    
        
        if(incluir == true){
                    var linha  = "<tr>"+
            "<td>"+"<a href='#' class='botao_table_cp' onclick='excluiItem(this)' data-ident='"+max+"'>Ex</a>"+"</td>"+

            "<td>"+"<input type='text' name='col1["+max+"]' class='input-table-selec' readonly='readonly' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(1)').html()+"' />"+"</td>"+

            "<td>"+"<input type='text' name='col2["+max+"]' class='input-table-selec' readonly='readonly' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(2)').html()+"' />"+"</td>"+

            "<td>"+"<input type='text' name='col3["+max+"]' class='input-table-selec' readonly='readonly' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(3)').html()+"' />"+"</td>"+

            "<td>"+"<input type='text' name='col4["+max+"]' class='input-table-selec' readonly='readonly' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(9)').html()+"' />"+"</td>"+

            "<td>"+"<input type='text' name='col5["+max+"]' class='input-table-selec' readonly='readonly' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(8)').html()+"' />"+"</td>"+

            "<td>"+"<input type='text' name='col6["+max+"]' class='input-table-selec' readonly='readonly' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(6)').html()+"' />"+"</td>"+

            "<td>"+"<input type='text' name='col7["+max+"]' class='input-table-selec' readonly='readonly' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(7)').html()+"' />"+"</td>"+

            "<td>"+"<input type='text' name='col8["+max+"]' class='input-table-selec' readonly='readonly' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(11)').html()+"'/>"+"</td>"+

            "<td>"+"<input type='text' name='col9["+max+"]' class='input-table-selec' required \n\
                           value='1'    \n\
                           id='qtd"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(2)').html()+"' \n\
                           onblur='alteraQuant(this)'                                                    />"+"</td>"+

            "<td>"+"<input type='text' name='col10["+max+"]' class='input-table-selec' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(4)').html()+"'\n\
                           id='pct"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(2)').html()+"' \n\
                           onblur='alteraCusto(this)'                                                    />"+"</td>"+

            "<td>"+"<input type='text' name='col11["+max+"]' class='input-table-selec' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(5)').html()+"'\n\
                           id='pvd"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(2)').html()+"'\n\
                           onblur='alteraPreco(this)'                                                    />"+"</td>"+

            "<td>"+"<input type='text' name='col12["+max+"]' class='input-table-selec' readonly='readonly' required \n\
                           value='"+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(12)').html()+"'/>"+"</td>";

                    linha = linha+"</tr>";
                    $('#tabelaenvio').append(linha);
                    
                    // colocar máscara nos input de qtd compra, preço custo e preço venda
                    $('#qtd'+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(2)').html()).mask("#.##0,00", {reverse: true});
                    $('#pct'+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(2)').html()).mask("#.##0,00", {reverse: true});
                    $('#pvd'+$('#tabelaestoque tbody tr.selected:eq('+i+') td:eq(2)').html()).mask("#.##0,00", {reverse: true});
        }            
    }
    
    formataTabela(); // formatar tabela
    // limpar os campos e as seleções feitas na tabela
    limparFiltros(); 
    // calcula o valor dos produtos
    calcularesumo();
    
    
}

function formataTabela(){
    
    if($('#tabelaenvio tbody tr').length > 0){
        for(var col = 1; col <= parseInt($('#tabelaenvio tbody tr:eq(0) td').length)-1; col++){
            for(var lin = 0; lin < $('#tabelaenvio tbody tr').length; lin++ ){
                var largaux = parseInt($('#tabelaenvio tbody').children('tr:eq('+lin+')').children('td:eq('+col+')').children('input:eq(0)').val().length) * 8;
                $('#tabelaenvio tbody').children('tr:eq('+lin+')').children('td:eq('+col+')').children('input:eq(0)').width(largaux);
            }
        }
    }
}

function alteraQuant(a){
        var valor = parseFloat($(a).val());
        
        if(valor != "" && valor > 0){
            
            var nome = $(a).parent().parent().children("td:eq(2)").children('input:eq(0)').val();
            var action = "ConfereQtdEstoque";
            $.ajax({
                url:baselink+"/ajax/"+action,
                type: 'POST',
                data:{q:nome},
                dataType:'json',
                success:function(json){
                    if(json.length > 0){
                       if(valor > parseFloat(json)){
                         alert("A quantidade em estoque é menor do que a quantidade digitada;");
                         $(a).val($(a).attr("value"));
                         calcularesumo();
                       }   
                    }
                }
            });
        }else{
            $(a).val($(a).attr("value"));
            calcularesumo();
        }
        calcularesumo();
}

function alteraCusto(a){
    var custo = $(a).val();
        custo = custo.replace(".","").replace(".","");
        custo = custo.replace(",",".");
        custo = parseFloat(custo);
        
    var preco = $(a).parent().parent().children("td:eq(11)").children('input:eq(0)').val();
        preco = preco.replace(".","").replace(".","");
        preco = preco.replace(",",".");
        preco = parseFloat(preco);
    
    if(custo != "" && custo > 0){
        if(custo >= preco){
            alert("O custo do produto deve ser menor que o seu preço.");
            $(a).val($(a).attr("value"));
            calcularesumo();
        }        
    }else{
        $(a).val($(a).attr("value"));
        calcularesumo();
    }
    calcularesumo();
    
}

function alteraPreco(a){
    var preco = $(a).val();
        preco = preco.replace(".","").replace(".","");
        preco = preco.replace(",",".");
        preco = parseFloat(preco);
        
    var custo = $(a).parent().parent().children("td:eq(10)").children('input:eq(0)').val();
        custo = custo.replace(".","").replace(".","");
        custo = custo.replace(",",".");
        custo = parseFloat(custo);
        
    if(preco != "" && preco > 0){
        if(custo >= preco){
            alert("O preço do produto deve ser maior que o seu custo.");
            $(a).val($(a).attr("value"));
            calcularesumo();
        }        
    }else{
        $(a).val($(a).attr("value"));
        calcularesumo();
    }
    calcularesumo();
    
}

function calcularesumo(){
        var custoProdutos = 0;
        var qtdAux = 0;
        var custoProdAux = 0;
        var frete = 0;
        var total = 0;
        
        if($("#tabelaenvio tbody tr").length > 0 ){
            $("#tabelaenvio tbody tr").each(function(){

                qtdAux = $(this).closest('tr').children('td:eq(9)').children('input:eq(0)').val();
                qtdAux = qtdAux.replace(".","").replace(".","");
                qtdAux = qtdAux.replace(",",".");
                qtdAux = parseFloat(qtdAux);

                custoProdAux = $(this).closest('tr').children('td:eq(10)').children('input:eq(0)').val();
                custoProdAux = custoProdAux.replace(".","").replace(".","");
                custoProdAux = custoProdAux.replace(",",".");
                custoProdAux = parseFloat(custoProdAux);
                
                custoProdutos = parseFloat(custoProdutos) + parseFloat(parseFloat(qtdAux) * parseFloat(custoProdAux));
                custoProdutos = parseFloat(custoProdutos).toFixed(2);
                
            });
        }else{
            custoProdutos = parseFloat(0).toFixed(2);
        }
        
        if($("#iaux3").val() != ''){
            frete = $("#iaux3").val();
            frete = frete.replace(".","").replace(".","");
            frete = frete.replace(",",".");
            frete = parseFloat(frete).toFixed(2);
        }else{
            frete = parseFloat(0).toFixed(2);
        }
        
        total = parseFloat(frete) + parseFloat(custoProdutos);
        total = parseFloat(total).toFixed(2);

        $("#icptot").html("<i>Custo dos Produtos (R$):</i> "+custoProdutos.replace(".",",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."));
        $("#ifrete").html("<i>Custo dos Frete (R$):</i> "+frete.replace(".",",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."));
        $("#itotal").html("<i>Custo Total (R$):</i> "+total.replace(".",",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."));

        
}

// alterar os valores  de quantidade e custo e calcular o resumo corretamente
// quando mudar o valor de quantidade, consultar o estoque via ajax, para garantir a quantidade correta do item
// colocar datepicker no campo de data antes do envio do form
// prevent default no form - impedir envio pressionando enter
// funcioar o botão de exclusão dos itens
// fazer forma de pagamento da compra
// 