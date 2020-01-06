// tirar os console.log()

// $(function () {
//     //Quando Clica em editar -  faz a função de ler o hidden de pedidos e monta a tabela
//     // Ler o campo hidden e montar a tabela com os contatos daquele registro
//     // Pedidos();
//     console.log('iniciou o pedido_form.js');
//     var pedi = Pedidos();
//     PreencheTabelaPedidos(pedi);
//    // no blur dos campos da tabela, vai ser setado o input hidden com os pedidos no padrão que o histórico lê
   
//    $('tbody tr#pedido .form-control').blur(function(){
//        SetPedido(); 
//    });

//    $('tbody .form-control').blur(function(){

//       if( $(this).val() == '' ){
//         $(this).val(0);
//       }
//         // atualiza o valor do campo hidden da operação
//         SetInput();

//         // calcula o totalizador da linha e seta o input 
//         var idLinha = $(this).parents('tr').attr('id');
//         var $Tot = $('#qtd_'+idLinha);
//         var tot = 0;
//         for(var i = 1; i < $('tbody tr#'+idLinha+' td').length; i++ ){
//             tot = tot + parseInt( $('tbody tr#'+idLinha+' td:eq('+i+') input').val() );
//         }
//         $Tot.val(tot);

//         // atualiza o campo hidden do pedido
//         SetPedido();
//         // console.log('idlinha:', idLinha, 'tot: ', tot)
//    });

//     $('input').keypress(function (event) {
//     if (    event.keyCode == 13      ||   // tecla enter
//             event.keyCode == 42      ||   // tecla  *
//             event.keyCode == 123     ||   // tecla {
//             event.keyCode == 125     ||   // tecla }
//             event.keyCode == 91      ||   // tecla [
//             event.keyCode == 93      ||   // tecla ]
//             event.keyCode == 124          // tecla |
//         ) {
//             event.preventDefault();
//             event.stopPropagation();
//             return false;
//         }
//     });


// });

// // Pega as linhas da tabela e manipula o hidden da operação
// function SetInput() {
//     var content = '';
//     for(var linha = 0; linha < $('tbody tr').length; linha++){
//         content += '['
//         for(var coluna = 0; coluna < $("tbody tr:eq("+linha+") td").length; coluna++ ){
           
//             if( coluna == 0){

//                 content +=  $('tbody tr:eq('+linha+') td:eq('+coluna+')').text().trim() + ' * ' ;
            
//             }else{    
//                 if(coluna < parseInt( $("tbody tr:eq("+linha+") td").length - 1 ) ){

//                     content +=  $('tbody tr:eq('+linha+') td:eq('+coluna+')').text().trim() + ' - ' + 
//                             $('tbody tr:eq('+linha+') td:eq('+coluna+')').find('input').val() + ' * ' ;

//                 }else{

//                     content +=  $('tbody tr:eq('+linha+') td:eq('+coluna+')').text().trim() + ' - ' + 
//                             $('tbody tr:eq('+linha+') td:eq('+coluna+')').find('input').val() ;
                
//                 }
//             }    
//         }
//         content += ']';
//     }    
//     // console.log(content);
//     $('[name=operacao]')
//         .val(content)           
//         .change();
//     // console.log('operação do dia: ',$('[name=operacao]').val());    
// };

// // Pega as linhas da tabela e manipula o hidden de pedidos fixos
// function SetPedido() {
//     var content = '';
//     for(var coluna = 1; coluna < $("tbody tr#pedido td").length; coluna++ ){
//         if(coluna < parseInt( $("tbody tr#pedido td").length - 1 ) ){

//             content +=  $('tbody tr#pedido td:eq('+coluna+')').text().trim() + ' - ' + 
//                     $('tbody tr#pedido td:eq('+coluna+')').find('input').val() + ' * ' ;

//         }else{

//             content +=  $('tbody tr#pedido td:eq('+coluna+')').text().trim() + ' - ' + 
//                     $('tbody tr#pedido td:eq('+coluna+')').find('input').val() ;
        
//         }     
//     }    
//     // console.log(content);
//     $('[name=pedido_op]')
//         .val(content)           
//         .change();
//     // console.log('pedido: ',$('[name=pedido_op]').val());    
// };

// function Pedidos() {
//     var returnPedidos = [];
//     if ($('[name=operacao]') && $('[name=operacao]').val().length) {
//         var operacoes = $('[name=operacao]').val().split('[');
//         for (var i = 0; i < operacoes.length; i++) {
//             var operacao = operacoes[i];
//             if (operacao.length) {
//                 operacao = operacao.replace(']', '');
//                 var dadosOperacao = operacao.split(' * ');
//                 returnPedidos.push(dadosOperacao);
//             }
//         }
//     };
//     // console.log(returnPedidos)
//     return returnPedidos;
// };

// function PreencheTabelaPedidos(pedidos){
//     var $tabela = $('tbody');

//     for(var linhaPedido = 0; linhaPedido < pedidos.length; linhaPedido++){
//         var op = '';
//         op = pedidos[linhaPedido][0].trim();

//         for(var colunaPedido = 1; colunaPedido < pedidos[linhaPedido].length; colunaPedido++){
//             var codigo = '';
//             var qtd = parseInt(0);
//             codigo =  pedidos[linhaPedido][colunaPedido].split('-')[0].trim();
//             qtd =  parseInt( pedidos[linhaPedido][colunaPedido].split('-')[1] );

//             for( var colunaTabela = 1; colunaTabela <  $('tbody tr:eq('+linhaPedido+') td').length; colunaTabela++){
//                 if( $('tbody tr:eq('+linhaPedido+') td:eq('+colunaTabela+')').text().trim().toUpperCase() == codigo.toUpperCase() ){
//                     $('tbody tr:eq('+linhaPedido+') td:eq('+colunaTabela+')').find('input').val(qtd);
//                     $('tbody tr:eq('+linhaPedido+') td:eq('+colunaTabela+')').find('input').attr('data-anterior' ,qtd);
//                 }
//             }

//         }
//     }

// }
