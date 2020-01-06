$(document).ready(function () {

    $("#mes_ref").attr('disabled','disabled');    
    $("#saldo_total_inicio").attr('disabled','disabled');    
    $("#saldo_banco_inicio");    
    $("#saldo_online_inicio");    
    $("#saldo_caixa_inicio");    
    $("#entradas").attr('disabled','disabled');    
    $("#saidas").attr('disabled','disabled');
    $("#resultado").attr('disabled','disabled');    
    $("#diferenca").attr('disabled','disabled');        
    $("#saldo_total_final").attr('disabled','disabled');    
    $("#saldo_banco_final");    
    $("#saldo_online_final");    
    $("#saldo_caixa_final");       

    
    if($('#mes_ano').attr('data-anterior') != ''){ //significa que o formulário está sendo editado

        $this = $('#mes_ano');
        $this.attr('disabled','disabled');
        $entradas = $('#entradas');
        $saidas = $('#saidas');
        $resultado = $('#resultado');
        
        valor = $this.val();
        valor = valor.split('/');
        valor[0] = '01';
        var data = valor[0] + '/' + valor[1] + '/' + valor[2];

        $this.val(data);
         // preenche os valores dos campos que são necessários
         var tabela, campo, dtinicio;
         tabela = 'fluxocaixa'
         campo = 'valor_total'
         dtinicio = data;

         $.ajax({
             url: baselink + '/ajax/buscaReceitasDespesas',
             type: 'POST',
             data: {
                 tabela: tabela,
                 campo: campo,
                 dataInicio: dtinicio 
             },
             dataType: 'json',
             success: function (dado) {
                 $this.val(data);
                 if(dado == ''){
                     $entradas.val(floatParaPadraoBrasileiro(0));
                     $saidas.val(floatParaPadraoBrasileiro(0));
                     $resultado.val(floatParaPadraoBrasileiro(0));                                            

                 }else{
                    var dataanterior, resultadoAjax, diferenca;
                    dataanterior = parseFloat(floatParaPadraoInternacional($resultado.attr('data-anterior')));
                    resultadoAjax = parseFloat(dado['Resultado']).toFixed(2);
                    diferenca = parseFloat(dataanterior - resultadoAjax).toFixed(0);

                     if( diferenca != 0 ){  

                            $entradas.val(floatParaPadraoBrasileiro(dado['Receita']));
                            $saidas.val(floatParaPadraoBrasileiro(dado['Despesa']));
                            $resultado.val(floatParaPadraoBrasileiro(dado['Resultado'])); 
                            calculaDiferenca($('#saldo_total_inicio'), $('#resultado'), $('#saldo_total_final'), $('#diferenca'));                            
                            $this.blur();

                            alert('Existem alterações nos valores do Total De Entradas, Total De Saídas e Resultado. \nAperte no botão [Salvar] para registrá-las');
                            
                        }
                                                                
                 }
                 
             }
         });
    }

    calculaDiferenca($('#saldo_total_inicio'), $('#resultado'), $('#saldo_total_final'), $('#diferenca'));

    $('[data-mascara_validacao="data"]')
    .mask('00/00/0000')
    .datepicker()
    .on('change blur', function () {

        var $this = $(this),
            valor = $this.val(),
            $entradas = $("#entradas"),
            $saidas = $("#saidas"),
            $resultado = $("#resultado"),
            $mesref = $("#mes_ref"),
            meses = {"01":"jan", "02":"fev", "03":"mar", "04":"abr", "05":"mai", "06":"jun", "07":"jul", "08":"ago", "09":"set", "10":"out", "11":"nov", "12":"dez"};

        valor = valor.split('/');
        valor[0] = '01';
        var data = valor[0] + '/' + valor[1] + '/' + valor[2];

        $this.removeClass('is-valid is-invalid');
        $this.siblings('.invalid-feedback').remove();
        
        if ($this.val() != '') {
            $this.val(data);
            if ($this.attr('data-anterior') != $this.val()) {
                if (
                    (typeof valor[1] == 'undefined' || typeof valor[2] == 'undefined') ||
                    (valor[2].length > 4 || valor[0].length > 2 || valor[1].length > 2) ||
                    (validaDat(data) == false)
                ) {
                    // Inválido
                    $this.val('').removeClass('is-valid').addClass('is-invalid');
                    $this[0].setCustomValidity('invalid');
                    $this.after('<div class="invalid-feedback">Data inválida.</div>');

                    $entradas.val(floatParaPadraoBrasileiro(0));
                    $saidas.val(floatParaPadraoBrasileiro(0));
                    $resultado.val(floatParaPadraoBrasileiro(0));
                    $mesref.val('');

                } else {
                    // Valido   
                    $this.val(valor[2]+'-'+valor[1]+'-'+valor[0]);
                    $this.unico(function (json) {
                        if (!json.length) {
                            // Não existe, pode seguir
                            if( valor[0] == '01' ){
                                $this.removeClass('is-invalid').addClass('is-valid');
                                $this[0].setCustomValidity('');
                                // $this.datepicker('update');
                                $mesref.val(meses[valor[1]]+'/'+valor[2]);
                                
                                // preenche os valores dos campos que são necessários
                                var tabela, campo, dtinicio;
                                tabela = 'fluxocaixa'
                                campo = 'valor_total'
                                dtinicio = data;
            
                                $.ajax({
                                    url: baselink + '/ajax/buscaReceitasDespesas',
                                    type: 'POST',
                                    data: {
                                        tabela: tabela,
                                        campo: campo,
                                        dataInicio: dtinicio 
                                    },
                                    dataType: 'json',
                                    success: function (dado) {
                                        $this.val(data);
                                        if(dado == ''){
                                            $entradas.val(floatParaPadraoBrasileiro(0));
                                            $saidas.val(floatParaPadraoBrasileiro(0));
                                            $resultado.val(floatParaPadraoBrasileiro(0));                                            
        
                                        }else{
                                            $entradas.val(floatParaPadraoBrasileiro(dado['Receita']));
                                            $saidas.val(floatParaPadraoBrasileiro(dado['Despesa']));
                                            $resultado.val(floatParaPadraoBrasileiro(dado['Resultado']));                                            
                                        }
                                        
                                    }
                                });
        
                            }else{
                                // inválido
                                $this.val('').removeClass('is-valid').addClass('is-invalid');
                                $this[0].setCustomValidity('invalid');
                                $this.after('<div class="invalid-feedback">Somente datas com dia iguais a 01 são válidas.</div>');
        
                                $entradas.val(floatParaPadraoBrasileiro(0));
                                $saidas.val(floatParaPadraoBrasileiro(0));
                                $resultado.val(floatParaPadraoBrasileiro(0));
                                
                                
                            }

                        } else {
                            // Já existe, erro
                            $this.val('');
                            $this.removeClass('is-valid').addClass('is-invalid');
                            $this[0].setCustomValidity('invalid');
                            $this.after('<div class="invalid-feedback">Essa data já está sendo usada.</div>');

                            $entradas.val(floatParaPadraoBrasileiro(0));
                            $saidas.val(floatParaPadraoBrasileiro(0));
                            $resultado.val(floatParaPadraoBrasileiro(0));
                        }
                    });
                    $this.val(data);
                }
            }else{
                //data anterior é igual ao valor atual
                // preenche os valores dos campos que são necessários
                var tabela, campo, dtinicio;
                tabela = 'fluxocaixa'
                campo = 'valor_total'
                dtinicio = data;

                $.ajax({
                    url: baselink + '/ajax/buscaReceitasDespesas',
                    type: 'POST',
                    data: {
                        tabela: tabela,
                        campo: campo,
                        dataInicio: dtinicio 
                    },
                    dataType: 'json',
                    success: function (dado) {
                        $this.val(data);
                        if(dado == ''){
                            $entradas.val(floatParaPadraoBrasileiro(0));
                            $saidas.val(floatParaPadraoBrasileiro(0));
                            $resultado.val(floatParaPadraoBrasileiro(0));                                            

                        }else{

                            $entradas.val(floatParaPadraoBrasileiro(dado['Receita']));
                            $saidas.val(floatParaPadraoBrasileiro(dado['Despesa']));
                            $resultado.val(floatParaPadraoBrasileiro(dado['Resultado']));                                            
                        }
                        
                    }
                });
            }
        }else{
            $entradas.val(floatParaPadraoBrasileiro(0));
            $saidas.val(floatParaPadraoBrasileiro(0));
            $resultado.val(floatParaPadraoBrasileiro(0));
            $mesref.val('');
        }
        calculaDiferenca($('#saldo_total_inicio'), $('#resultado'), $('#saldo_total_final'), $('#diferenca'));
    });

    $("#saldo_banco_inicio, #saldo_caixa_inicio, #saldo_online_inicio, #saldo_total_inicio").on('blur change', function(){
        somaSaldo($('#saldo_banco_inicio'),$('#saldo_caixa_inicio'), $('#saldo_online_inicio'), $('#saldo_total_inicio'));
        calculaDiferenca($('#saldo_total_inicio'), $('#resultado'), $('#saldo_total_final'), $('#diferenca'));
    });    
    $("#saldo_banco_final, #saldo_caixa_final, #saldo_online_final, #saldo_total_final ").on('blur change', function(){
        somaSaldo($('#saldo_banco_final'),$('#saldo_caixa_final'), $('#saldo_online_final'), $('#saldo_total_final'));
        calculaDiferenca($('#saldo_total_inicio'), $('#resultado'), $('#saldo_total_final'), $('#diferenca'));
    });    

    $('#form-principal').on('submit', function(e){
        if($(this)[0].checkValidity() == true && confirm('Tem certeza?')) {
            $(this).find('input').removeAttr('disabled');
        }else{
            e.preventDefault();
            e.stopPropagation();
            return false;
        }    
    });

});

function validaDat(valor) {
    var date = valor;
    var ardt = new Array;
    var ExpReg = new RegExp('(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}');
    ardt = date.split('/');
    erro = false;
    if (date.search(ExpReg) == -1) {
        erro = true;
    }
    else if (((ardt[1] == 4) || (ardt[1] == 6) || (ardt[1] == 9) || (ardt[1] == 11)) && (ardt[0] > 30))
        erro = true;
    else if (ardt[1] == 2) {
        if ((ardt[0] > 28) && ((ardt[2] % 4) != 0))
            erro = true;
        if ((ardt[0] > 29) && ((ardt[2] % 4) == 0))
            erro = true;
    }
    if (erro) {
        return false;
    }
    return true;
}

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

function somaSaldo(sdoBanco, sdoCaixa, sdoOnline, sdoTotal){
    var sdoBanco, sdoCaixa, sdoOnline, sdoTotal, total, valAux;
    
    total = 0;

    valAux = 0;
    if(sdoBanco.val() != '' && sdoBanco.val() != undefined ){
        valAux = floatParaPadraoInternacional(sdoBanco.val());
        total +=  parseFloat(valAux);
    }

    valAux = 0;
    if(sdoCaixa.val() != '' && sdoCaixa.val() != undefined ){
        valAux = floatParaPadraoInternacional(sdoCaixa.val());
        total +=  parseFloat(valAux);
    }

    valAux = 0;
    if(sdoOnline.val() != '' && sdoOnline.val() != undefined ){
        valAux = floatParaPadraoInternacional(sdoOnline.val());
        total +=  parseFloat(valAux);
    }
    
    valAux = floatParaPadraoBrasileiro(total);
    calculaDiferenca($('#saldo_total_inicio'), $('#resultado'), $('#saldo_total_final'), $('#diferenca'));
    $("#mes_ano").change().blur();
    
    return sdoTotal.val(valAux);

}

function calculaDiferenca (sdoTotInicio, resultado, sdoTotFinal, diferenca){
    var sdoTotInicio, resultado, sdoTotFinal, diferenca, valAux;

    valAux = 0;
    
    if(sdoTotInicio.val() != '' && sdoTotInicio.val() != undefined ){
        sdoTotInicio = parseFloat( floatParaPadraoInternacional(sdoTotInicio.val()) );
    }else{
        sdoTotInicio = parseFloat(0);
    }

    valAux = 0;
    
    if(resultado.val() != '' && resultado.val() != undefined ){
        resultado = parseFloat( floatParaPadraoInternacional(resultado.val()) );
    }else{
        resultado = parseFloat(0);
    }

    valAux = 0;
    
    if(sdoTotFinal.val() != '' && sdoTotFinal.val() != undefined ){
        sdoTotFinal = parseFloat( floatParaPadraoInternacional(sdoTotFinal.val()) );
    }else{
        sdoTotFinal = parseFloat(0);
    }
    
    
    valAux = 0;
    valAux =  parseFloat( parseFloat(sdoTotInicio) + parseFloat(resultado) - parseFloat(sdoTotFinal));
    
    if( valAux > parseFloat(0) ){
        diferenca.addClass('bg-success text-white');

    }else if( valAux < parseFloat(0) ){
        diferenca.addClass('bg-danger text-white');

    }else{
        diferenca.removeClass('bg-danger bg-success text-white');
    }

    valAux = floatParaPadraoBrasileiro(valAux);
    return diferenca.val(valAux);

}