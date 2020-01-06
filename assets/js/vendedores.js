$(function () {

    if($("#nome").attr('data-anterior') != '' ){
        $("#nome").attr('readonly','readonly');    
    }

    $("#email").attr('readonly','readonly');    
    $("#id_usuario").attr('readonly','readonly');    
    
    $('#nome').change(function(){
        
        if($("#nome").attr('data-anterior') != '' ){
            $("#nome").val( $("#nome").attr('data-anterior') );
            return;    
        }
        
        var $email = $("#email");
        var $idUsuario = $("#id_usuario");

        if( $(this).val() != ''){ //significa que o formulário está sendo editado

            var nomePesq = $(this).val();
             $.ajax({
                 url: baselink + '/ajax/buscaEmaileID',
                 type: 'POST',
                 data: {
                     nome: nomePesq 
                 },
                 dataType: 'json',
                 success: function (dado) {
                     console.log(dado['email'], dado['id']);

                     if(dado != ''){
                       $email.val(dado['email']);
                       $idUsuario.val(dado['id']);                                               
    
                     }else{
                        
                        alert('Não foram encontradas as informações do Vendedor!');
                                
                    }
                                                                    
                }
            });
        }    
    });

});


 