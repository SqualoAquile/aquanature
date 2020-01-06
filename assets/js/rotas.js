$(document).ready(function () {
    
    $("#id_vendedor").attr('readonly','readonly');
    $("#vendedor").attr('readonly','readonly');

    if($('#id_vendedor').attr('data-anterior') == ''){ //significa que o formulário está sendo editado    
        $("#id_vendedor").val(idUsuario);       
        $("#vendedor").val(usuario);
    }

});

