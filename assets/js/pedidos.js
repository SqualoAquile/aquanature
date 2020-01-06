$(function () {
    // console.log('carregou pedidos.js');
    // Adição
    // Calulo dos totais - ok 
    // Verificar se tem pedido d-1 - ok
    // verificar se já tem pedido com essa data de entrega - ok
    // Verificar se a adição do pedido está sendo feita até a data e hora limite correta - ok

    // Edição
    // Calulo dos totais - ok
    // Calculo das edições dos inputs da tabela - se alterar sobrad0tem que fazer sentido com a venda e doação... ok 
    // Verificar se tem pedido d-1 - ok
    // verificar se já tem pedido com essa data de entrega - ok
    // Verificar se a edição do pedido está sendo feita até a data e hora limite correta - ok
    // verificar se os OK já foram dados e pode ou não editar? - ok
    // revisar calculaoperacao, quando tiver na etapa de dar ok na entrega não calcular venda/sobras/doacoes... ok

    // Para o Form
    // criar colunas das informações do pedido/entrega facilitar a distribuição - ok
    // criar o botão de check do vendedor e do distribuidor - brownser - ok
    // fazer verificação das conferencias no brownser igual ao do form - ok
    // separa a edição nos seguintes momentos - ok
    // edição do pedido // edição da entrega // edição das vendas/ sobras/doações e custos // ver as informações e não poder editar mais - ok
    // revisar quando vai dar o OK vnd ele atualiza a quantidade de venda e registra as vendas como se tivessem acontecido - ok
    
    // tirar todos os console.log - ok
    // acertar como aparece o histórico das alterações - ok
    // verificar na tabela pedidositens se as informações ficam corretas durante todo o fluxo de operação - ok
    
    // console.log('parametros disponíveis', 
    //     $('#main-form').attr('data-diasantesadd'),
    //     $('#main-form').attr('data-horalimiteadd'),
    //     $('#main-form').attr('data-diasantesedt'),
    //     $('#main-form').attr('data-horalimiteedt')
    // );

    //preenche a tabela de operacao com o valor do input operacao
    var pedi = Pedidos();
    PreencheTabelaPedidos(pedi);

    if($("#vendedor").attr('data-anterior') == '' ){
        //quando for adição do pedido
        $('[name=id_vendedor]').val(info_vendedor['id_usuario'])
        $("#vendedor").val(info_vendedor['nome']);
        $("#data_pedido").val(hoje());
        $("#data_entrega").change();
        
      
        $("#qtd_sobrad1").val(0);
        $("#qtd_sobrad0").val(0);
        $("#qtd_pedido").val(0);           
        $("#qtd_entrega").val(0);      
        $("#qtd_venda").val(0);      
        $("#qtd_sobrad2").val(0);
        $("#qtd_doacao").val(0);
        $('#transporte').val(0).attr('readonly','readonly');
        $('#extra').val(0).attr('readonly','readonly');
        $('#maq_cartao').val(0).attr('readonly','readonly');

        $('tbody tr#sobrad0 td input').attr('readonly','readonly');
        $('tbody tr#sobrad1 td input').attr('readonly','readonly');
        $('tbody tr#sobrad2 td input').attr('readonly','readonly');
        $('tbody tr#entrega td input').attr('readonly','readonly');
        $('tbody tr#doacao td input').attr('readonly','readonly');

        $('#conf_entrega_vnd').empty().attr('readonly','readonly').val('')
        .append('<option value="" selected  >Selecione</option>'); 
        $('#conf_entrega_dist').empty().attr('readonly','readonly').val('')
        .append('<option value="" selected  >Selecione</option>')


    }else{ // quando for edição do pedido

        $("#data_entrega").attr('readonly','readonly').datepicker('destroy');
        atualizaSobrad0();

        // console.log('o PEDIDO pode ser alterado? :', OkDataLimiteAdicaoEdicaoPedido());

        if( OkDataLimiteAdicaoEdicaoPedido() == true ){
            // enquanto o pedido puder ser editado
            // console.log('o pedido ainda pode ser editado');

            $('#conf_entrega_vnd').empty().attr('readonly','readonly').val('')
                .append('<option value="" selected  >Selecione</option>'); 
            $('#conf_entrega_dist').empty().attr('readonly','readonly').val('')
                .append('<option value="" selected  >Selecione</option>');

            $('tbody tr#entrega td').find('input').val(0).attr('readonly','readonly');
            $('tbody tr#venda td').find('input').val(0).attr('readonly','readonly');
            $('tbody tr#sobrad0 td').find('input').val(0).attr('readonly','readonly');
            $('tbody tr#sobrad2 td').find('input').val(0).attr('readonly','readonly');
            $('tbody tr#doacao td').find('input').val(0).attr('readonly','readonly');
            
            $('#transporte').val('0,00').attr('readonly','readonly');
            $('#extra').val('0,00').attr('readonly','readonly');
            $('#maq_cartao').val('0,00').attr('readonly','readonly');

        }else{
            // o pedido não pode mais ser editado
            // console.log('o pedido não pode mais ser editado');
            // console.log('Aqui conf dist', $('#conf_entrega_dist').val());
            // console.log('Aqui conf vnd', $('#conf_entrega_vnd').val());
            
            if( $('#data_entrega').val() == hoje() && $('#conf_entrega_dist').val() != 'SIM' ){
                // hoje é o dia da entrega e o dist não OK na entrega - só pode editar a entrega e vn não pode dar OK
                // console.log('pedido não altera e dist não OK') 
                $('#transporte').val('0,00').attr('readonly','readonly');
                $('#extra').val('0,00').attr('readonly','readonly');
                $('#maq_cartao').val('0,00').attr('readonly','readonly');

                $('#conf_entrega_vnd').empty().attr('readonly','readonly').val('')
                .append('<option value="" selected  >Selecione</option>'); 

                if( valorPesquisa != '' ){//significa que o usuário NÃO tem a permissão podetudo_ver
                    $('#conf_entrega_dist').empty().attr('readonly','readonly').val('')
                    .append('<option value="" selected  >Selecione</option>');   
                
                }else{

                    $('#conf_entrega_dist').empty()
                    .val('')
                    .append('<option value="" selected  >Selecione</option>')
                    .append('<option value="SIM"   >SIM</option>');
                }

                $('tbody tr#pedido td').find('input').attr('readonly','readonly');
                $('tbody tr#venda td').find('input').val(0).attr('readonly','readonly');
                $('tbody tr#sobrad0 td').find('input').val(0).attr('readonly','readonly');
                $('tbody tr#sobrad2 td').find('input').val(0).attr('readonly','readonly');
                $('tbody tr#doacao td').find('input').val(0).attr('readonly','readonly');

                inicializaQtdEntrega();

            }else if( $('#data_entrega').val() == hoje() && 
                      ( $('#conf_entrega_vnd').val() != 'SIM' && $('#conf_entrega_dist').val() == 'SIM' ) ){
                // hoje é o dia da entrega e o dist OK na entrega - vnd só pode dar OK
                // console.log('pedido não altera e dist OK') 
                $('#transporte').val('0,00').attr('readonly','readonly');
                $('#extra').val('0,00').attr('readonly','readonly');
                $('#maq_cartao').val('0,00').attr('readonly','readonly');

                $('#conf_entrega_dist').empty().attr('readonly','readonly')
                    .val('SIM').append('<option value="SIM" selected >SIM</option>');;

                $('#conf_entrega_vnd').empty()
                .val('')
                .append('<option value="" selected  >Selecione</option>')
                .append('<option value="SIM"   >SIM</option>');

                $('tbody tr#pedido td').find('input').attr('readonly','readonly');
                $('tbody tr#entrega td').find('input').attr('readonly','readonly');
                $('tbody tr#venda td').find('input').val(0).attr('readonly','readonly');
                $('tbody tr#sobrad0 td').find('input').val(0).attr('readonly','readonly');
                $('tbody tr#sobrad2 td').find('input').val(0).attr('readonly','readonly');
                $('tbody tr#doacao td').find('input').val(0).attr('readonly','readonly');

                inicializaQtdEntrega();

            }else if( $('#data_entrega').val() == hoje() && 
                      ( $('#conf_entrega_vnd').val() == 'SIM' && $('#conf_entrega_dist').val() == 'SIM' ) ){
                // hoje é o dia da entrega, dist e vnd OK na entrega - vnd pode editar venda, custo, sobras, doação
                // console.log('pedido não altera. dist OK e vnd OK') 
                $('#transporte').val( $('#transporte').attr('data-anterior') );
                $('#extra').val( $('#extra').attr('data-anterior') );
                $('#maq_cartao').val( $('#maq_cartao').attr('data-anterior') );

                $('#conf_entrega_vnd').empty().attr('readonly','readonly')
                    .val('SIM').append('<option value="SIM" selected >SIM</option>');
                    
                $('#conf_entrega_dist').empty().attr('readonly','readonly')
                    .val('SIM').append('<option value="SIM" selected >SIM</option>');

                $('tbody tr#pedido td').find('input').attr('readonly','readonly');
                $('tbody tr#entrega td').find('input').attr('readonly','readonly');
                $('tbody tr#venda td').find('input').val(0).attr('readonly','readonly');
                        
                calculaOperacao();

            }else if( maiorData( $('#data_entrega').val(),  hoje() ) == $('#data_entrega').val()  ){

                // a data da entrega é posterior a hoje 
                // console.log('dt entrega é maior que hoje.');

                $('#transporte').val('0,00').attr('readonly','readonly');
                $('#extra').val('0,00').attr('readonly','readonly');
                $('#maq_cartao').val('0,00').attr('readonly','readonly');

                $('#conf_entrega_vnd').empty().attr('readonly','readonly')
                    .val('').append('<option value="" selected >Selecione</option>');

                $('#conf_entrega_dist').empty().attr('readonly','readonly')
                    .val('').append('<option value="" selected >Selecione</option>');    

                $('tbody tr#pedido td').find('input').attr('readonly','readonly');
                $('tbody tr#entrega td').find('input').attr('readonly','readonly');
                $('tbody tr#venda td').find('input').val(0).attr('readonly','readonly');
                $('tbody tr#sobrad0 td').find('input').val(0).attr('readonly','readonly');
                $('tbody tr#sobrad2 td').find('input').val(0).attr('readonly','readonly');
                $('tbody tr#doacao td').find('input').val(0).attr('readonly','readonly');

            }else{
                // se data de entrega for mais antiga que hoje
                // console.log('se data de entrega for mais antiga que hoje');
                $('#transporte').attr('disabled','disabled');
                $('#extra').attr('disabled','disabled');
                $('#maq_cartao').attr('disabled','disabled');

                $('#observacao').attr('disabled','disabled');

                $('#conf_entrega_vnd').attr('disabled','disabled')
                $('#conf_entrega_dist').attr('disabled','disabled')   

                $('tbody tr#pedido td').find('input').attr('disabled','disabled');
                $('tbody tr#entrega td').find('input').attr('disabled','disabled');
                $('tbody tr#venda td').find('input').attr('disabled','disabled');
                $('tbody tr#sobrad0 td').find('input').attr('disabled','disabled');
                $('tbody tr#sobrad2 td').find('input').attr('disabled','disabled');
                $('tbody tr#doacao td').find('input').attr('disabled','disabled');

            }

        }
    }

    
    $("#vendedor").attr('readonly','readonly');
    $("#data_pedido").attr('readonly','readonly')
                     .datepicker('destroy'); 
    $("#dia_semana").attr('readonly','readonly');
    $("#rota_endereco").attr('readonly','readonly');
    $("#qtd_sobrad1").attr('readonly','readonly');    
    $("#qtd_pedido").attr('readonly','readonly');      
    $("#qtd_sobrad0").attr('readonly','readonly');           
    $("#qtd_entrega").attr('readonly','readonly');      
    $("#qtd_venda").attr('readonly','readonly');      
    $("#qtd_sobrad2").attr('readonly','readonly');
    $("#qtd_doacao").attr('readonly','readonly');  
    
   

    $('#data_pedido').on('change blur click', function(){
        if( $("#vendedor").attr('data-anterior') == '' ){
            if( $(this).val() == '' || $(this).val() != hoje() ){
                $(this).val( hoje() );
            }
        }else{
            if( $(this).val() == '' || $(this).val() != $(this).attr('data-anterior')){
                $(this).val( $(this).attr('data-anterior') );
            }
        }
        
    });

    // testar se já existe um pedido com essa data de entrega
    $('#data_entrega').change(function(){
        
        $dtentrega = $('#data_entrega');
        $dtpedido = $('#data_pedido');
        $rota = $('#rota_endereco');
        $diasemana = $('#dia_semana');
        idVend = $('[name=id_vendedor]').val();

        if($dtentrega.val() == ''){
            limpaOperacao();
            return;
        }

        // testar se a data de entrega é sempre maior que a data do pedido
        if ( maiorData($dtentrega.val(), $dtpedido.val()) != $dtentrega.val() ){
            alert('A data de entrega deve ser maior do que a data do pedido.');
            $dtentrega.val('');
            limpaOperacao();
            return;
        }

        // testar se a dt entrega for igual a domingo deixar vazia
        if( diaDaSemana( $dtentrega.val() ) == 'Domingo'  ){
            alert('A empresa ainda não faz entregas no Domingo.');
            $dtentrega.val('');
            limpaOperacao();           
            return;
        }

        // testa e já existe pedido com essa data de entrega
        $.ajax({
            url: baselink + '/ajax/jaExistePedido',
            type: 'POST',
            data: {
                dtentrega: $dtentrega.val(),
                idVend: idVend
            },
            dataType: 'json',
            success: function (dado) {

                if(dado == true){
                    alert('Já existe um pedido para essa data de entrega.');
                    $dtentrega.val('');
                    limpaOperacao();
                    return;
                
                }else{
                    // testa se já tem pedido de d-1 para preencher a tabela, se tem sobrad0 com dtentrega - 1
                    atualizaSobrad0();
                    
                }                                            
            }
        });

        limpaOperacao();
        pedidoDoDia(info_vendedor['pedido_fixo'], diaDaSemana($dtentrega.val()));
        
    });

    // botao de salvar - quando passa o mouse em cima dele
    $('label.btn.btn-primary.btn-block').on('mouseleave', function(){
        $('label.btn.btn-primary.btn-block').removeClass('bg-dark');
    });

    $('label.btn.btn-primary.btn-block').on('mouseenter', function(){
        $('label.btn.btn-primary.btn-block').addClass('bg-dark');
        if($('label.btn.btn-primary.btn-block').attr('disabled') == 'disabled'){
            
            $('tbody tr:eq(3) td:eq(3) input').blur().removeClass('is-valid');
            $('tbody tr#pedido td:eq(1) input').blur().removeClass('is-valid');
        
        }
    });

    // botao de salvar - quando clica
    $('label.btn.btn-primary.btn-block').on('click', function(e){
        $('label.btn.btn-primary.btn-block').addClass('bg-dark');
        if($('label.btn.btn-primary.btn-block').attr('disabled') != 'disabled'){
            if($("#vendedor").attr('data-anterior') == '' ){
                // quando for adição de operação
                if( OkDataLimiteAdicaoEdicaoPedido() == false) {
                    alert('O prazo limite para salvar a operação foi ultrapassado.');
                    e.preventDefault();
                    e.stopPropagation();
                    $('label.btn.btn-primary.btn-block').removeClass('bg-dark');
                    return false;
                }
            }else{
                // quando for edição de operação
                if( OkDataLimiteEdicaoOperacao() == false){
                    alert('O prazo limite para salvar a operação foi ultrapassado.');
                    e.preventDefault();
                    e.stopPropagation();
                    $('label.btn.btn-primary.btn-block').removeClass('bg-dark');
                    return false;
                }
            }
        }    
    });

    $('tbody tr#pedido .form-control ').blur(function(){
        SetPedido(); 
    });
    $('tbody tr#sobrad0 .form-control, tr#sobrad2 .form-control, tr#doacao .form-control  ').blur(function(){
        // calcula a operação
        if( $('#conf_entrega_vnd').val() == 'SIM' && $('#conf_entrega_dist').val() == 'SIM'  ){
            calculaOperacao();

            // calcula o totalizador da linha e seta o input 
            var idLinha = $(this).parents('tr').attr('id');
            var $Tot = $('#qtd_'+idLinha);
            var tot = 0;
            for(var i = 1; i < $('tbody tr#'+idLinha+' td').length; i++ ){
                tot = tot + parseInt( $('tbody tr#'+idLinha+' td:eq('+i+') input').val() );
            }
            $Tot.val(tot);
        }
    });
 
    $('tbody .form-control').blur(function(){
 
       if( $(this).val() == '' ){
         $(this).val(0);
       }

       $(this).val( parseInt($(this).val()) );
         // atualiza o valor do campo hidden da operação
         SetInput();

        // calcula o totalizador da linha e seta o input 
        var idLinha = $(this).parents('tr').attr('id');
        var $Tot = $('#qtd_'+idLinha);
        var tot = 0;
        for(var i = 1; i < $('tbody tr#'+idLinha+' td').length; i++ ){
            tot = tot + parseInt( $('tbody tr#'+idLinha+' td:eq('+i+') input').val() );
        }
        $Tot.val(tot);
         
         // atualiza o campo hidden do pedido
         SetPedido();
    });
 
    $('input').keypress(function (event) {
     if (    event.keyCode == 13      ||   // tecla enter
             event.keyCode == 42      ||   // tecla  *
             event.keyCode == 123     ||   // tecla {
             event.keyCode == 125     ||   // tecla }
             event.keyCode == 91      ||   // tecla [
             event.keyCode == 93      ||   // tecla ]
             event.keyCode == 124          // tecla |
         ) {
             event.preventDefault();
             event.stopPropagation();
             return false;
         }
    });

    $('#transporte, #extra, #maq_cartao').blur(function(){
        if( $(this).attr('data-anterior') != '' ){
            // if( $(this).val() == '' || parseInt( $(this).val()) == parseInt(0) ){
            if( $(this).val() == '' ){    
                $(this).val( $(this).attr('data-anterior') ).removeClass('is-valid');
            }
            if( parseInt( $(this).val()) == parseInt(0) ){
                $(this).val('0,00');
            }
        }
    });
    

    $('#conf_entrega_dist').blur(function(){
        if( valorPesquisa != '' ){//significa que o usuário NÃO tem a permissão podetudo_ver
         $(this).val( $(this).attr('data-anterior') );   
        }
        
    });

});


function diaDaSemana(data){
    // console.log('dt:', data)
    var dtaux = data.split("/");
    var dt = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);

    if (dt.getDay() == 1) {
        return 'Segunda';
    }
    else if (dt.getDay() == 2) {
        return 'Terça';
    }
    else if (dt.getDay() == 3) {
        return 'Quarta';
    }
    else if (dt.getDay() == 4) {
        return 'Quinta';
    }
    else if (dt.getDay() == 5) {
        return 'Sexta';
    }
    else if (dt.getDay() == 6) {
        return 'Sábado';
    }
    else if (dt.getDay() == 0) {
        return 'Domingo';
    }
}

function pedidoDoDia(pedidoFixo, diaSemana){

    var $lixo, $dia, $endereco, diaSemana, $aux = [], $pedidoFixo = [], $pedido = [];
        $pedido = pedidoFixo.split('[');
        $lixo = $pedido.shift();
        $rota = $('#rota_endereco');
        $diasemana = $('#dia_semana');
        $qtdPedido = $('#qtd_pedido');
        $dtentrega = $('#data_entrega');

        for(var i = 0; i < 6; i++){
            $aux = [];
            $aux = $pedido[i].replace(']','').split('*'); 
            
            $dia = $aux[0].split(':')[0].trim();
            $endereco = $aux[0].split(':')[1].replace('-', '').trim();
            $lixo = $aux.shift();
            
            if( $dia == diaSemana ){
                $diasemana.val(diaSemana);
                $rota.val( $endereco );
                $pedidoFixo = $aux; 
            }
        }

        var totP = 0;
        for(var linhaP = 0; linhaP < $pedidoFixo.length; linhaP++ ){

            for(var colunaT = 1 ; colunaT < $('tbody tr#pedido td').length; colunaT++){
                var codigoP = '', codigoT = '', qtdP = 0, $qtdT;

                codigoP = $pedidoFixo[linhaP].split('-')[0].trim();
                qtdP = parseInt( $pedidoFixo[linhaP].split('-')[1].trim() );

                codigoT = $('tbody tr#pedido td:eq('+colunaT+')').find('label').text().trim();
                $qtdT = $('tbody tr#pedido td:eq('+colunaT+')').find('input');
                if( codigoP == codigoT){
                    $qtdT.val( qtdP );
                    totP = parseInt( totP + qtdP );
                }
            }
        }

        $qtdPedido.val(totP);

        if(totP <= 0 ){
            alert('Não tem pedidos cadastrados para esse dia da semana.');
            $dtentrega.val('');
            limpaOperacao();
            return;    
        }
}

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

function dtEntregaOntem(dtEntrega){
    var dtaux = dtEntrega.split("/");
    var dtd1 = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0] - 1);

    //soma a quantidade de meses para o recebimento/pagamento
    // dtd1.setDay(dtd1.getDay() - 1);     

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
    data = dia + "/" + mes + "/" + ano;
    // console.log('ontem:',data)
    return data;
    
}

function OkDataLimiteAdicaoEdicaoPedido(){
    // console.log('disparou ok ADD')
    var dtentrega = $('#data_entrega').val();
    
    if(dtentrega != '' && dtentrega != undefined){
        
        var dtaux = dtentrega.split("/");
        var diasantesadicao = parseInt($('#main-form').attr('data-diasantesadd'));
        var dtd1 = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0] - diasantesadicao);    
        // console.log('diaantesadicao', diasantesadicao);
        // console.log('dtd1', dtd1);
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
            return horaLimiteAdicao();
        }else if( maiorData(datalimite, hoje()) == datalimite){

            return true;
        }else{

             return false;
        }

    }else{
        return false;
    }
        
    
}

function OkDataLimiteEdicaoOperacao(){
    // console.log('disparou OK EDT')
    var dtentrega = $('#data_entrega').val();
    
    if(dtentrega != '' && dtentrega != undefined){
        
        var dtaux = dtentrega.split("/");
        var diasantesedt = parseInt($('#main-form').attr('data-diasantesedt'));
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

function horaLimiteAdicao(){
    var dt = new Date();
    var horalimite = parseInt($('#main-form').attr('data-horalimiteadd'));
    var horaagora = parseInt( dt.getHours() );
    
    // console.log('hora limite: ', horalimite);
    // console.log('hora agora: ', horaagora);

    if( horalimite >= horaagora ){
        return true;
    }else{
        return false;
    }
    
}

function horaLimiteEdt(){
    var dt = new Date();
    var horalimite = parseInt($('#main-form').attr('data-horalimiteedt'));
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

function limpaOperacao(){
    $rota = $('#rota_endereco');
    $diasemana = $('#dia_semana');
    $sobrad1 = $('#qtd_sobrad1');
    $pedido = $('#qtd_pedido');
    $entrega = $('#qtd_entrega');
    $venda = $('#qtd_venda');
    $sobrad0 = $('#qtd_sobrad0');
    $sobrad2 = $('#qtd_sobrad2');
    $doacao = $('#qtd_doacao');
    
    $sobrad1.val(0);
    $pedido.val(0);
    $entrega.val(0);
    $venda.val(0);
    $sobrad0.val(0);
    $sobrad2.val(0);
    $doacao.val(0);    

    $rota.val('');
    $diasemana.val('');

    $('tbody tr td input').val(0).removeClass('is-valid');
    $('tbody .form-control').removeClass('is-valid'); 
    
}

function atualizaSobrad0(){
    
    // testa se já tem pedido de d-1 para preencher a tabela, se tem sobrad0 com dtentrega - 1
        
        var dtOntem, idVend, $qtdSobrad1, $dtentrega;
        $dtentrega = $('#data_entrega');
        idVend = $('[name=id_vendedor]').val();
        dtOntem = dtEntregaOntem( $dtentrega.val() );
        $qtdSobrad1 = $('#qtd_sobrad1');
        

        $.ajax({
            url: baselink + '/ajax/sobrad0ontem',
            type: 'POST',
            data: {
                dtOntem: dtOntem,
                idVend: idVend
            },
            dataType: 'json',
            success: function (dado) {
                // console.log('sobrad0:',dado);

                var totd1 = 0;
                for(var colunad1 = 0; colunad1 < dado.length; colunad1++ ){

                    for(var colunaT = 1 ; colunaT < $('tbody tr#sobrad1 td').length; colunaT++){
                        var codigod1 = '', codigoT = '', qtdd1 = 0, $qtdT;

                        codigod1 = dado[colunad1]['codigo'].trim();
                        qtdd1 = parseInt(  dado[colunad1]['qtd'] );

                        codigoT = $('tbody tr#sobrad1 td:eq('+colunaT+')').find('label').text().trim();
                        $qtdT = $('tbody tr#sobrad1 td:eq('+colunaT+')').find('input');
                        if( codigod1 == codigoT){
                            $qtdT.val( qtdd1 );
                            totd1 = parseInt( totd1 + qtdd1 );
                        }
                    }
                }

                $qtdSobrad1.val(totd1);                   
            }
        });
}

function inicializaQtdEntrega(){
        // console.log('dispaoru inicia qtd entrega')
        var $qtdEntrega, totEntrega = 0;
        $qtdEntrega = $('#qtd_entrega');

        for(var colunaPedido = 1 ; colunaPedido < $('tbody tr#pedido td').length; colunaPedido++){
            var qtdPedido = 0, $qtdEntrega;

            qtdPedido = parseInt(  $('tbody tr#pedido td:eq('+colunaPedido+')').find('input').val() );

            if( parseInt( $('tbody tr#entrega td:eq('+colunaPedido+')').find('input').attr('data-anterior') ) == 0 ){

                $('tbody tr#entrega td:eq('+colunaPedido+')').find('input').val(qtdPedido);
                totEntrega = parseInt( totEntrega + qtdPedido );
                $qtdEntrega.val(totEntrega); 
            }
            
        }

                          
}

function calculaOperacao(){
    // console.log('dispaoru calcula OP');
    $venda = $('#qtd_venda');
    $sobrad0 = $('#qtd_sobrad0');
    $sobrad2 = $('#qtd_sobrad2'),
    $doacao = $('#qtd_doacao');
    var totSobrad0 = 0, totSobrad2 = 0 , totDoacao = 0, totVenda = 0;
    var qtdSobrad1, qtdEntrega, qtdSobrad0, qtdSobrad2, qtdDoacao, qtdVenda;

    if( $('#conf_entrega_vnd').attr('data-anterior') == 'SIM' && 
        $('#conf_entrega_dist').attr('data-anterior') == 'SIM' ){

        for(var coluna = 1 ; coluna < $('tbody tr:eq(1) td').length; coluna++){
            // sobrad1 + entrega = venda + sobrad0 + sobrad2 + doacao
            // venda = ( sobrad1 + entrega ) - ( sobrad0 + sobrad2 + doacao )
            
            qtdSobrad1 = parseInt(  $('tbody tr#sobrad1 td:eq('+coluna+')').find('input').val() );
            qtdEntrega = parseInt(  $('tbody tr#entrega td:eq('+coluna+')').find('input').val() );
            qtdSobrad0 = parseInt(  $('tbody tr#sobrad0 td:eq('+coluna+')').find('input').val() );
            qtdSobrad2 = parseInt(  $('tbody tr#sobrad2 td:eq('+coluna+')').find('input').val() );
            qtdDoacao = parseInt(  $('tbody tr#doacao td:eq('+coluna+')').find('input').val() );

            if( qtdSobrad1 < qtdSobrad2){
                $('tbody tr#sobrad2 td:eq('+coluna+')').find('input').val(0).removeClass('is-valid');
                qtdSobrad2 = parseInt(  $('tbody tr#sobrad2 td:eq('+coluna+')').find('input').val() );
                alert('A sobra(D-2) não pode ser maior do que a sobra(D-1).');
            }

            if( qtdSobrad0 > qtdEntrega){
                $('tbody tr#sobrad0 td:eq('+coluna+')').find('input').val(0).removeClass('is-valid');
                qtdSobrad0 = parseInt(  $('tbody tr#sobrad0 td:eq('+coluna+')').find('input').val() );
                alert('A sobra(D-0) não pode ser maior do que a entrega.');
            }

            if( (qtdSobrad1 + qtdEntrega ) >= (qtdSobrad0 + qtdSobrad2 + qtdDoacao) ){
                qtdVenda = (qtdSobrad1 + qtdEntrega ) - (qtdSobrad0 + qtdSobrad2 + qtdDoacao);
            
            }else{
                qtdVenda = (qtdSobrad1 + qtdEntrega ); 

                $('tbody tr#sobrad0 td:eq('+coluna+')').find('input').val(0).removeClass('is-valid');
                $('tbody tr#sobrad2 td:eq('+coluna+')').find('input').val(0).removeClass('is-valid');
                $('tbody tr#doacao td:eq('+coluna+')').find('input').val(0).removeClass('is-valid');

                qtdSobrad0 = parseInt(  $('tbody tr#sobrad0 td:eq('+coluna+')').find('input').val() );
                qtdSobrad2 = parseInt(  $('tbody tr#sobrad2 td:eq('+coluna+')').find('input').val() );
                qtdDoacao = parseInt(  $('tbody tr#doacao td:eq('+coluna+')').find('input').val() );
                
                alert('A soma entre os valores da sobra(D-0), sobra(D-2) e Doação/Estorno não podem ser maiores do que a soma entre a sobra(D-1) e a Entrega.');
            }
            

            $('tbody tr#venda td:eq('+coluna+')').find('input').val(qtdVenda);
            
            totVenda = parseInt( totVenda + qtdVenda );
            totSobrad0 = parseInt( totSobrad0 + qtdSobrad0 );
            totSobrad2 = parseInt( totSobrad2 + qtdSobrad2 );
            totDoacao  = parseInt( totDoacao  + qtdDoacao  );

        }

        // console.log('venda: ', totVenda);
        // console.log('sobrad0: ', totSobrad0);
        // console.log('sobrad2: ', totSobrad2);
        // console.log('doacao: ', totDoacao);
        
        $venda.val(totVenda);
        $sobrad0.val(totSobrad0);  
        $sobrad2.val(totSobrad2);                     
        $doacao.val(totDoacao);  

    }
}

// Pega as linhas da tabela e manipula o hidden da operação
function SetInput() {
    var content = '';
    for(var linha = 0; linha < $('tbody tr').length; linha++){
        content += '['
        for(var coluna = 0; coluna < $("tbody tr:eq("+linha+") td").length; coluna++ ){
           
            if( coluna == 0){

                content +=  $('tbody tr:eq('+linha+') td:eq('+coluna+')').text().trim() + ' * ' ;
            
            }else{    
                if(coluna < parseInt( $("tbody tr:eq("+linha+") td").length - 1 ) ){

                    content +=  $('tbody tr:eq('+linha+') td:eq('+coluna+')').text().trim() + ' - ' + 
                            $('tbody tr:eq('+linha+') td:eq('+coluna+')').find('input').val() + ' * ' ;

                }else{

                    content +=  $('tbody tr:eq('+linha+') td:eq('+coluna+')').text().trim() + ' - ' + 
                            $('tbody tr:eq('+linha+') td:eq('+coluna+')').find('input').val() ;
                
                }
            }    
        }
        content += ']';
    }    
    // console.log(content);
    $('[name=operacao]')
        .val(content)           
        .change();
    // console.log('operação do dia: ',$('[name=operacao]').val());    
};

// Pega as linhas da tabela e manipula o hidden de pedidos fixos
function SetPedido() {
    var content = '';
    for(var coluna = 1; coluna < $("tbody tr#pedido td").length; coluna++ ){
        if(coluna < parseInt( $("tbody tr#pedido td").length - 1 ) ){

            content +=  $('tbody tr#pedido td:eq('+coluna+')').text().trim() + ' - ' + 
                    $('tbody tr#pedido td:eq('+coluna+')').find('input').val() + ' * ' ;

        }else{

            content +=  $('tbody tr#pedido td:eq('+coluna+')').text().trim() + ' - ' + 
                    $('tbody tr#pedido td:eq('+coluna+')').find('input').val() ;
        
        }     
    }    
    // console.log(content);
    $('[name=pedido_op]')
        .val(content)           
        .change();
    // console.log('pedido: ',$('[name=pedido_op]').val());    
};

function Pedidos() {
    var returnPedidos = [];
    if ($('[name=operacao]') && $('[name=operacao]').val().length) {
        var operacoes = $('[name=operacao]').val().split('[');
        for (var i = 0; i < operacoes.length; i++) {
            var operacao = operacoes[i];
            if (operacao.length) {
                operacao = operacao.replace(']', '');
                var dadosOperacao = operacao.split(' * ');
                returnPedidos.push(dadosOperacao);
            }
        }
    };
    // console.log(returnPedidos)
    return returnPedidos;
};

function PreencheTabelaPedidos(pedidos){
    var $tabela = $('tbody');

    for(var linhaPedido = 0; linhaPedido < pedidos.length; linhaPedido++){
        var op = '';
        op = pedidos[linhaPedido][0].trim();

        for(var colunaPedido = 1; colunaPedido < pedidos[linhaPedido].length; colunaPedido++){
            var codigo = '';
            var qtd = parseInt(0);
            codigo =  pedidos[linhaPedido][colunaPedido].split('-')[0].trim();
            qtd =  parseInt( pedidos[linhaPedido][colunaPedido].split('-')[1] );

            for( var colunaTabela = 1; colunaTabela <  $('tbody tr:eq('+linhaPedido+') td').length; colunaTabela++){
                if( $('tbody tr:eq('+linhaPedido+') td:eq('+colunaTabela+')').text().trim().toUpperCase() == codigo.toUpperCase() ){
                    $('tbody tr:eq('+linhaPedido+') td:eq('+colunaTabela+')').find('input').val(qtd);
                    $('tbody tr:eq('+linhaPedido+') td:eq('+colunaTabela+')').find('input').attr('data-anterior' ,qtd);
                }
            }

        }
    }

}