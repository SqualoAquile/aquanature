$(function () {

    function floatParaPadraoBrasileiro(valor){
        var valortotal = valor;
        valortotal = number_format(valortotal,2,',','.');
        return valortotal;
    }

    function floatParaPadraoInternacional(valor){
        
        var valortotal = valor;
        valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
        valortotal = valortotal.replace(",", ".");
        valortotal = parseFloat(valortotal).toFixed(2);
        return valortotal;
    }

    function number_format( numero, decimal, decimal_separador, milhar_separador ){ 
        numero = (numero + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+numero) ? 0 : +numero,
            prec = !isFinite(+decimal) ? 0 : Math.abs(decimal),
            sep = (typeof milhar_separador === 'undefined') ? ',' : milhar_separador,
            dec = (typeof decimal_separador === 'undefined') ? '.' : decimal_separador,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
    
        // Fix para IE: parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }
    
    function maiorque (valMenor, valMaior){

        valorMenor = floatParaPadraoInternacional(valMenor.val());
        valorMaior = floatParaPadraoInternacional(valMaior.val());        

        if( valorMenor != '' && valorMaior != ''){

            if(parseFloat(valorMenor) < parseFloat(valorMaior)){
                return true; 
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    function comparar ($custo, $preco) {

        if( $custo.val() != "" && $preco.val() == "" ){
            return;
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            $preco.removeClass('is-valid').addClass('is-invalid');
            $preco[0].setCustomValidity('invalid');
            $preco.after('<div class="invalid-feedback feedback-maiorque">O valor do preço deve ser maior do que o valor do custo.</div>');
            $preco.val("");
            return;
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( maiorque($custo , $preco) == false){
                //custo não é maior que
                $preco.removeClass('is-valid').addClass('is-invalid');
                $preco[0].setCustomValidity('invalid');
                $preco.siblings('.feedback-maiorque').remove();
                $preco.after('<div class="invalid-feedback feedback-maiorque">O valor do preço deve ser maior do que o valor do custo.</div>');
                $preco.val("");
                return;
            }    
        }
    }

    $(document)
        .ready(function () {
            $('.input-servicos').keyup();
        })
        .on('submit', '.form-servicos', function (event) {
    
            event.preventDefault();
    
            var $this = $(this),
                $inputs = $this.find('.input-servicos'),
                id = $this.attr('data-id'),
                objSend = {},
                campos_alterados = '';
    
            $inputs.blur();
    
            if (this.checkValidity() == false) {
    
                $this
                    .find('.is-invalid, :invalid')
                    .first()
                    .focus();
    
            } else {
                    
                $inputs.each(function () {
    
                    var $input = $(this),
                        $label = $input.siblings('label').find('span'),
                        valInternacional = floatParaPadraoInternacional($input.val()),
                        valueBrasileiro = floatParaPadraoBrasileiro(valInternacional);
    
                    objSend[$input.attr('name')] = valInternacional;
    
                    if (valueBrasileiro != $input.attr('data-anterior')) {
                        campos_alterados += '{' + $label.text().toUpperCase() + ' de (' + $input.attr('data-anterior') + ') para (' + valueBrasileiro + ')}';
                    }

                });

                if (campos_alterados.length) {
                    campos_alterados = $this.attr('data-alteracoes') + '##' + campos_alterados;
                    objSend['alteracoes'] = campos_alterados;

                    if (confirm('Tem Certeza?')) {
                    
                        $.ajax({
                            url: baselink + '/ajax/editarServicos/' + id,
                            type: 'POST',
                            data: objSend,
                            dataType: 'json',
                            success: function (data) {
        
                                if (data.erro[0] == '00000') {
        
                                    Toast({
                                        message: 'Serviço editado com sucesso!',
                                        class: 'alert-success'
                                    });
        
                                    $this
                                        .attr('data-alteracoes', data.result.alteracoes)
                                        .removeClass('was-validated');
        
                                    $inputs.each(function () {
                                        
                                        var $input = $(this);
        
                                        $input
                                            .removeClass('is-valid is-invalid')
                                            .keyup();
        
                                    });

                                    location.reload();
                                }
                            }
                        });

                    }
                }
                
            }
    
            $this.addClass('was-validated');
    
        })
        .on('keyup', '.input-servicos', function () {
            
            var $this = $(this),
                $submit = $this.parents('form').find('[type=submit]'),
                valInternacional = floatParaPadraoInternacional($this.val()),
                valueBrasileiro = floatParaPadraoBrasileiro(valInternacional);
    
            if (valueBrasileiro != $this.attr('data-anterior')) {
                $submit.removeAttr('disabled');
            } else {
                $submit.attr('disabled', 'disabled');
            }
        });
    
    $('[name="custo"], [name="preco_venda"]').on('blur', function(){

        var $pai = $(this).parents('form'),
            $custo = $pai.find('[name="custo"]'),
            $preco = $pai.find('[name="preco_venda"]');

        comparar($custo, $preco);
    });
});