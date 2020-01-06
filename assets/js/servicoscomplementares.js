$(function () {

    function floatPadroaInternacional(valor1){
        valor = valor1.val();

        if(valor != ""){
            valor = valor.replace(".","").replace(".","").replace(".","").replace(".","");
            valor = valor.replace(",",".");
            valor = parseFloat(valor);
            return valor;
        }else{
            valor = '';
            return valor;
        }
    }
    
    function maiorque (valMenor, valMaior){

        valorMenor = floatPadroaInternacional(valMenor);
        valorMaior = floatPadroaInternacional(valMaior);        

        if( valorMenor != '' && valorMaior != ''){

            if(valorMenor < valorMaior){
               return true; 
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    
    $("#custo, #preco_venda").blur(function(){
        var $custo = $("#custo");
        var $preco = $("#preco_venda");

        if( $custo.val() != "" && $preco.val() == "" ){

            return
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            $preco.removeClass('is-valid').addClass('is-invalid');
            $preco[0].setCustomValidity('invalid');
            $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo..</div>');
            $preco.val("");
            return;
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( maiorque($custo , $preco) == false){
                //custo não é maior que
                $preco.removeClass('is-valid').addClass('is-invalid');
                $preco[0].setCustomValidity('invalid');
                $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo.</div>');
                $preco.val("");
                return;
            }    
        }
    });

});