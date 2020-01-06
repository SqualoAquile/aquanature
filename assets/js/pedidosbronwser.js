$(function () {
    // console.log('carregou pedidosbronwser.js');
     // Edição
    // Verificar se a edição do pedido está sendo feita até a data e hora limite correta - ok
    // criar colunas das informações do pedido/entrega facilitar a distribuição - ok
    // criar o botão de check do vendedor e do distribuidor - brownser - ok
    // fazer verificação das conferencias no brownser igual ao do form - ok
    // tirar todos os console.log    
    var table = $('.dataTable').DataTable();
 
    table.on( 'draw', function () {
        btnCheckEntrega();
    } );
    

});

function hoje(){
    
    var dt = new Date();
    var data;     

    //monta a data no padrao brasileiro
    var dia = dt.getDate();
    var mes = dt.getMonth() + 1;
    var ano = dt.getFullYear();
    if (dia.toString().length == 1) {
        dia = "0" + dt.getDate();
    }
    if (mes.toString().length == 1) {
        mes = "0" + mes;
    }
    data = dia + "/" + mes + "/" + ano;
    // console.log(data)
    return data;
    
}
function OkDataLimiteEdicaoOperacao(dtEntrega, diasLimiteEdt){
    // console.log('disparou OK EDT')
    var dtentrega = dtEntrega;
    
    if(dtentrega != '' && dtentrega != undefined){
        
        var dtaux = dtentrega.split("/");
        var diasantesedt = parseInt(diasLimiteEdt);
        var dtd1 = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0] - diasantesedt);    
       
        //monta a data no padrao brasileiro
        var dia = dtd1.getDate();
        var mes = dtd1.getMonth() + 1;
        var ano = dtd1.getFullYear();
        if (dia.toString().length == 1) {
            dia = "0" + dtd1.getDate();
        }
        if (mes.toString().length == 1) {
            mes = "0" + mes;
        }
        datalimite = dia + "/" + mes + "/" + ano;

        // console.log('data entrega: ', dtentrega);
        // console.log('hoje: ',  hoje());
        // console.log('data limite: ', datalimite);
        // console.log('maior data: ',  maiorData(datalimite, hoje()));
        if( maiorData(datalimite, hoje()) == hoje()  ){
            return false;
        }else if(maiorData(datalimite, hoje()) == 'iguais'){
            // testar se a hora está ok
            return horaLimiteEdt();
        }else if( maiorData(datalimite, hoje()) == datalimite){

            return true;
        }else{

             return false;
        }

    }else{
        return false;
    }
        
    
}
function horaLimiteEdt(){
    var dt = new Date();
    var horalimite = parseInt(parametros['hora_limite_edicao']);
    var horaagora = parseInt( dt.getHours() );
    
    // console.log('hora limite: ', horalimite);
    // console.log('hora agora: ', horaagora);

    if( horalimite >= horaagora ){
        return true;
    }else{
        return false;
    }
    
}
function maiorData(data1, data2){
    // console.log('dt1:',data1);
    // console.log('dt2:', data2);
    if(data1 != '' && data1 != undefined && data2 != '' && data2 != undefined){
        var dt1aux, dt2aux;
        dt1aux = data1.split('/');
        dt1aux = parseInt( dt1aux[2]+dt1aux[1]+dt1aux[0] );
        
        dt2aux = data2.split('/');
        dt2aux = parseInt( dt2aux[2]+dt2aux[1]+dt2aux[0] );

        if( dt1aux > dt2aux ){
            return data1;
        }else if( dt1aux < dt2aux ){
            return data2;
        }else{
            return 'iguais';
        }
    }else{
        return 'erro';
    }
}

function btnCheckEntrega (){

    for(var i=0; i < $('div.dataTables_scrollBody table tbody tr').length; i++ ){

        dataEntrega = $('div.dataTables_scrollBody table tbody tr:eq('+i+') td:eq(2)').text();
        conf_dist = $('div.dataTables_scrollBody table tbody tr:eq('+i+') td:eq(6)').text();
        conf_vnd = $('div.dataTables_scrollBody table tbody tr:eq('+i+') td:eq(5)').text();

        // console.log('dt entrega | dist | vnd: ', dataEntrega, conf_dist, conf_vnd)

        if( dataEntrega == hoje() && ( conf_vnd == '' && conf_dist == '' ) ){
    
            if( valorPesquisa == '' ){// usuário NÃO tem a permissão podetudo_ver
                // é dist, aparece o botão só enquanto não tiver SIM naquela operação
                if( OkDataLimiteEdicaoOperacao(dataEntrega, parametros['dias_antes_edicao']) == true){
                    $('div.dataTables_scrollBody table tbody tr:eq('+i+') td:eq(0)').find('a.btn.btn-warning').show();
                }else{
                    $('div.dataTables_scrollBody table tbody tr:eq('+i+') td:eq(0)').find('a.btn.btn-warning').hide();
                } 
            }
    
        }else{
           
            $('div.dataTables_scrollBody table tbody tr:eq('+i+') td:eq(0)').find('a.btn.btn-warning').hide();
                
        }
    }
}

