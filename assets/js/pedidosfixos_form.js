// tirar os console.log()

$(function () {
    //Quando Clica em editar -  faz a função de ler o hidden de pedidos e monta a tabela
    // Ler o campo hidden e montar a tabela com os contatos daquele registro
    console.log('pedido fixo:',$('[name=pedido_fixo]').val());
    Pedidos();
    var pedi = Pedidos();
    PreencheTabelaPedidos(pedi);
   // no blur dos campos da tabela, vai ser setado o input hidden com os pedidos no padrão que o histórico lê
   
   $('tbody .form-control').blur(function(){
    //   console.log( $(this).parents('td').text().trim() )
      if( $(this).val() == '' ){
        $(this).val(0);
      }
        SetInput();
   });

   $('input').keypress(function (event) {
    
       console.log(event.keyCode);
       
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

});

// Pega as linhas da tabela e manipula o hidden de pedidos fixos
function SetInput() {
    var content = '';
    for(var linha = 0; linha < $('tbody tr').length; linha++){
        content += '['
        for(var coluna = 0; coluna < $("tbody tr:eq("+linha+") td").length; coluna++ ){
            if(coluna < parseInt( $("tbody tr:eq("+linha+") td").length - 1 ) ){

                content +=  $('tbody tr:eq('+linha+') td:eq('+coluna+')').text().trim() + ' - ' + 
                        $('tbody tr:eq('+linha+') td:eq('+coluna+')').find('input').val() + ' * ' ;

            }else{

                content +=  $('tbody tr:eq('+linha+') td:eq('+coluna+')').text().trim() + ' - ' + 
                        $('tbody tr:eq('+linha+') td:eq('+coluna+')').find('input').val() ;
            
                    }
        }
        content += ']';
    }    
    // console.log(content);
    $('[name=pedido_fixo]')
        .val(content)           
        .change();
    console.log('pedido fixo: ',$('[name=pedido_fixo]').val());    
};

function Pedidos() {
    var returnPedidos = [];
    if ($('[name=pedido_fixo]') && $('[name=pedido_fixo]').val().length) {
        var contatos = $('[name=pedido_fixo]').val().split('[');
        for (var i = 0; i < contatos.length; i++) {
            var contato = contatos[i];
            if (contato.length) {
                contato = contato.replace(']', '');
                var dadosContato = contato.split(' * ');
                returnPedidos.push(dadosContato);
            }
        }
    };
    console.log(returnPedidos)
    return returnPedidos;
};

function PreencheTabelaPedidos(pedidos){
    var $tabela = $('tbody');

    for(var linhaPedido = 0; linhaPedido < pedidos.length; linhaPedido++){
        var rota = '';
        rota = pedidos[linhaPedido][0].split('-')[1].trim();
        
        $('tbody tr:eq('+linhaPedido+') td:eq(0)').find('input').val(rota);
        $('tbody tr:eq('+linhaPedido+') td:eq(0)').find('input').attr('data-anterior', rota);

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