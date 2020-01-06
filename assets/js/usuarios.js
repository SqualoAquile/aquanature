$(function () {

    if( $('#senha')[0].hasAttribute('required') ){
        //o campo senha só tem o atributo required quando o form for de adicionar
        $('#email').val('');
        $('#email').change().blur();
        
    }else{
        var $label = $('#senha').siblings();
        $label.text('Senha');
        $label.removeClass('font-weight-bold');
        $('#nome').blur();

    }

    $('#email').attr('autocomplete','off');
    $('#senha').attr('autocomplete','off');
    $('#senha').val('').blur();
    $('#senhaaux').val('').blur();
    $('#senhaaux').attr('autocomplete','off');

    
    $('#form-principal').on('submit', function(e){
        if($(this)[0].checkValidity() == true ) {
            if($('#email').attr('data-anterior') != ''){
                if( ( $('#senha').val() != '' && $('#senhaaux').val() == '' ) || ( $('#senhaaux').val() != '' && $('#senha').val() == '' ) ){
                    alert('Caso queira alterar a senha, os dois campos devem estar preenchidos.');
                    return false;
                }
            }

        }else{
            e.preventDefault();
            e.stopPropagation();
            return false;
        }    
    });
    ///////////////////////////////////////////////////////////////////////
    ///                                                                /// 
    ///                                                                /// 
    ///     CÓDIGO COPIADO DO FUNCIONÁRIO DO CLIENTEA                  /// 
    ///                                                                /// 
    ///////////////////////////////////////////////////////////////////////    

    function formatoCerto(senha){
        if( senha != ""){

            if( senha.length <= 8 ){
                    //a senha é menor ou igual a  caracteres
                    return false;

            }else{
                //a senha é maior que 6 caracteres
                if($.isNumeric(senha) == true){
                    // senha composta somente por números
                    return false;

                }else{
                    // senha não composta só por números
                    var ok = false;
                    for(var i =0; i< senha.length; i++){
                        if( $.isNumeric(senha.charAt(i)) ){
                            ok = true;
                        }
                    }
                    if(ok == false){
                        // senha composta somente por letras
                        return false;

                    }else{
                        // senha composta por números, letras e maior que 8 caracteres
                        return true;
                    }
                }
            }    
        }

    }

    $("#senha").blur(function(){
        var $senha1 = $(this);
        var $senha2 = $("#senhaaux");

        $senha1.removeClass('is-valid is-invalid');
        $senha1.siblings('.invalid-feedback').remove();

        $senha2.removeClass('is-valid is-invalid');
        $senha2.siblings('.invalid-feedback').remove();

        if( $senha1.val() != "" ){

            if( formatoCerto($senha1.val()) == false){
                //senha1 não está no formato certo
                $senha1.removeClass('is-valid').addClass('is-invalid');
                $senha1[0].setCustomValidity('invalid');
                $senha1.after('<div class="invalid-feedback">A senha deve ter mais de 8 caracteres e ser composta por letras e números.</div>');
                $senha1.val("");
                return;

            }else{
                // senha1 no formato certo e senha2 vazia
                if($senha2.val() == ""){
                    //e senha2 vazia
                    $senha1.removeClass('is-invalid').addClass('is-valid');
                    $senha1[0].setCustomValidity('');   
                    return;

                }else{
                    // senha1 no formato certo e senha2 preenchida
                    if( formatoCerto($senha2.val()) == true ){
                        // senha1 no formato certo e senha2 no formato certo
                        //testa se as 2 são iguais
                        if(  $senha1.val().length == $senha2.val().length  &&  $senha1.val().trim() == $senha2.val().trim()  ){
                            //as duas senhas preenchidas e iguais
                            $senha1.removeClass('is-invalid').addClass('is-valid');
                            $senha1[0].setCustomValidity('');
                            
                            $senha2.removeClass('is-invalid').addClass('is-valid');
                            $senha2[0].setCustomValidity('');

                            return;  
                        }else{ 
                            //as duas senhas preenchidas e com valores diferentes  
                            $senha1.removeClass('is-invalid').addClass('is-valid');
                            $senha1[0].setCustomValidity('');
                            
                            $senha2.removeClass('is-valid').addClass('is-invalid');
                            $senha2[0].setCustomValidity('invalid');
                            $senha2.after('<div class="invalid-feedback">As senhas devem ter o mesmo valor.</div>');
                            $senha2.val("");
                            return;   
                        }

                    }else{
                        // senha1 no formato certo e senha2 no formato errado
                        $senha1.removeClass('is-invalid').addClass('is-valid');
                        $senha1[0].setCustomValidity('');
                        
                        $senha2.removeClass('is-valid').addClass('is-invalid');
                        $senha2[0].setCustomValidity('invalid');
                        $senha2.after('<div class="invalid-feedback">A senha deve ter mais de 8 caracteres e ser composta por letras e números.</div>');
                        $senha2.val("");
                        return;
                    }
                }
            }
        }
    });

    $("#senhaaux").blur(function(){
        var $senha1 = $(this);
        var $senha2 = $("#senha");

        $senha1.removeClass('is-valid is-invalid');
        $senha1.siblings('.invalid-feedback').remove();

        $senha2.removeClass('is-valid is-invalid');
        $senha2.siblings('.invalid-feedback').remove();

        if( $senha1.val() != "" ){

            if( formatoCerto($senha1.val()) == false){
                //senha1 não está no formato certo
                $senha1.removeClass('is-valid').addClass('is-invalid');
                $senha1[0].setCustomValidity('invalid');
                $senha1.after('<div class="invalid-feedback">A senha deve ter mais de 8 caracteres e ser composta por letras e números.</div>');
                $senha1.val("");
                return;

            }else{
                // senha1 no formato certo e senha2 vazia
                if($senha2.val() == ""){
                    //e senha2 vazia
                    $senha1.removeClass('is-invalid').addClass('is-valid');
                    $senha1[0].setCustomValidity('');   
                    return;

                }else{
                    // senha1 no formato certo e senha2 preenchida
                    if( formatoCerto($senha2.val()) == true ){
                        // senha1 no formato certo e senha2 no formato certo
                        //testa se as 2 são iguais
                        if(  $senha1.val().length == $senha2.val().length  &&  $senha1.val().trim() == $senha2.val().trim()  ){
                            //as duas senhas preenchidas e iguais
                            $senha1.removeClass('is-invalid').addClass('is-valid');
                            $senha1[0].setCustomValidity('');
                            
                            $senha2.removeClass('is-invalid').addClass('is-valid');
                            $senha2[0].setCustomValidity('');

                            return;  
                        }else{ 
                            //as duas senhas preenchidas e com valores diferentes  
                            $senha2.removeClass('is-invalid').addClass('is-valid');
                            $senha2[0].setCustomValidity('');
                            
                            $senha1.removeClass('is-valid').addClass('is-invalid');
                            $senha1[0].setCustomValidity('invalid');
                            $senha1.after('<div class="invalid-feedback">As senhas devem ter o mesmo valor.</div>');
                            $senha1.val("");
                            return;   
                        }

                    }else{
                        // senha1 no formato certo e senha2 no formato errado
                        $senha1.removeClass('is-invalid').addClass('is-valid');
                        $senha1[0].setCustomValidity('');
                        
                        $senha2.removeClass('is-valid').addClass('is-invalid');
                        $senha2[0].setCustomValidity('invalid');
                        $senha2.after('<div class="invalid-feedback">A senha deve ter mais de 8 caracteres e ser composta por letras e números.</div>');
                        $senha2.val("");
                        return;
                    }
                }
            }
        }
    });

});