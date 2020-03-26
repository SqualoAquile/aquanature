
$(function () {

    $.ajax({
        url: baselink + "/ajax/buscaParametros",
        type: "POST",
        data: {
          tabela: "parametros"
        },
        dataType: "json",
        success: function (data) {
          var dia_limite;
          if (data["dia_limite_isencao"]) {
            dia_limite = parseInt( data["dia_limite_isencao"] );
            $("#cond").attr("data-dialimite", dia_limite);
          }
          
        }
      });
    
    $('#data_fechamento').parent().parent().hide();
    $('form input').not('#valor_desc').attr('readonly','readonly');

    if( $('#mes_ref').attr('data-anterior') == '' ){
        
        $('form').hide();   
       
    }else{
        $('#card').hide();
        Contatos().forEach(function (contato) {
            Popula(contato);
        });
    }

    $('#dt_fechamento').focus();
    $('#dt_fechamento').on('change', function(){
        LimpaInputs()
        
        if( $(this).val() == '' ){
            $('#cond').val('');
        
        }else{
            // verificar quais os condomínios que ainda não tiveram o fechamento desse mês
            var $dt_fechamento = $('#dt_fechamento'), dt_fch = $dt_fechamento.val();            
            dt_fch = dt_fch.split('/').reverse().join('-');
            
            $.ajax({
                url: baselink + '/ajax/condominiosSemFechamento',
                type: 'POST',
                data: {
                    dt_fechamento: dt_fch
                },
                dataType: 'json',
                success: function (data) {
                    // console.log( data );
                    if( data != '' ){
                        // preenche os options do select
                        $('#cond').empty().append('<option value="" selected  >Selecione</option>') 
                        for(var i=0; i< data.length; i++){  
                            $('#cond').append("<option value='"+data[i]+"' >"+data[i]+"</option>")
                        }

                    } else {
                      // limpa todos os input e a tabela 
                      LimpaInputs();
                      alert('Não foram encontrados condomínios para fazer Fechamento nessa Data!');
                    }
                }
            });
        }
    });    

    $('#cond').on('change', function(){
        LimpaInputs();
        if( $('#dt_fechamento').val() == '' ){
            $('#cond').val('');
            return;
        
        }else{
            
            var $dt_fechamento = $('#dt_fechamento'), 
                $condominio = $('#cond');
            var dt_fch = $dt_fechamento.val(), 
                cond = $condominio.find(':selected').val();
                
            if (dt_fch != '' && cond != '' ) {
                // Valido
                dt_fch = dt_fch.split('/').reverse().join('-');
                dialimite = parseInt( $('#cond').attr('data-dialimite'));
                
                $.ajax({
                    url: baselink + '/ajax/fechamentoMensalCondominio',
                    type: 'POST',
                    data: {
                        dt_fechamento: dt_fch,
                        condominio: cond,
                        dialimite: dialimite
                    },
                    dataType: 'json',
                    success: function (data) {
                        // console.log( data );
                        LimpaInputs()
                        if( data != '' ){
                            // preenche os inputs e a tabela
                            $('#data_fechamento').val($dt_fechamento.val());
                            $('#mes_ref').val(data['mes_ref']);
                            $('#condominio').val(cond);
                            $('#qtd_ativos').val(data['qtd_ativos']);
                            $('#qtd_canc_pagos').val(data['qtd_cancelados']);
                            $('#qtd_cobrados').val(data['qtd_cobrados']);
                            $('#preco_medio').val(floatParaPadraoBrasileiro(data['preco_medio']));
                            $('#valor_total').val(floatParaPadraoBrasileiro(data['valor_total']));
                            $('#valor_desc').val(floatParaPadraoBrasileiro(0));
                            $('#valor_final').val(floatParaPadraoBrasileiro(data['valor_total']));
                            $('input[name=cobrados]').val(data['cobrados']);

                            Contatos().forEach(function (contato) {
                                Popula(contato);
                            });
                            
                            SetInput();

                            $('form').show();
    
                        }else {
                          // limpa todos os input e a tabela 
                          LimpaInputs();
                          alert('Não foram encontrados cartões pagantes desse Condomínio nesse período.');
                        }
                    }
                });
            }
        }
    });

    $("#valor_desc").blur(function(){
        var $total = $('#valor_total'), $desconto = $('#valor_desc'), $final = $('#valor_final'), 
        $descricao = $('#descricao_desc');
        var tot, desc, fim;
        desc = floatParaPadraoInternacional($desconto.val());
        // console.log('desc', desc);   
        if( desc > 0 && $descricao.val() == '' ){
            alert('Preencha a descrição do desconto.');
            $desconto.val('0,00');
            $final.val( $total.val() );
            $desconto.removeClass('is-valid is-invalid');
            return;
        }

        if( desc > 0 ){
            tot = floatParaPadraoInternacional( $total.val() );
            // console.log('tot', tot)
            if ( parseFloat(tot) <= parseFloat(desc) ){
                $desconto.val('0,00');
                $final.val( $total.val() );
                alert('O desconto deve ser menor do que o valor total.');

            }else{
                fim = parseFloat( parseFloat(tot) - parseFloat(desc) );
                $final.val( floatParaPadraoBrasileiro( fim ) );
            }
        }
    });

    $('#descricao_desc').blur(function(){
        var $total = $('#valor_total'), $desconto = $('#valor_desc'), $final = $('#valor_final'), 
        $descricao = $('#descricao_desc');
        var desc = parseFloat($desconto.val());
        if( desc > 0 && $descricao .val() == '' ){
            alert('Preencha a descrição do desconto.');
            $desconto.val('0,00');
            $final.val( $total.val() );
            $desconto.removeClass('is-valid is-invalid');
            return;
        }
    });

});// fim do $(function () {

function calculaHoraFinal(){
  var $horaI = $('#agnd_hora_inicio');
  var $horaF = $('#agnd_hora_final');
  var $duracao = $('#agnd_duracao') ;
  var horalimite = parseInt( $('#agnd_hora_final').attr('data-hora_limite_op') );
  var minutos = 0, horas = 0; hrmais = 0, hrplus = 0, minmais = 0, texthora = '', durac = 0;
  
  if( $horaI.val() == '' ){
      $horaI.focus();
      return ;
  }
  if( $duracao.val() == '' ){
      $duracao.focus();
      return ;
  }
  texthora = $horaI.val();
  horas = parseInt(  texthora.slice(0,2) );
  minutos = parseInt( texthora.slice(-2) );
  durac = parseInt( $duracao.val() );
  hrmais = parseFloat(  Math.floor( durac / 60 ));
  minmais = Math.round( parseFloat(( parseFloat( durac / 60 ) - hrmais ) * 60 )) ;


  if ( parseInt(minutos + minmais ) > 60 ){
      
      hrplus = parseFloat(  Math.floor( (minmais + minutos)  / 60 ));
      minmais = Math.round( parseFloat(( parseFloat( (minmais + minutos) / 60 ) - hrplus ) * 60 )) ;
      hrmais = parseInt(hrmais + hrplus);
          
  }else if ( parseInt(minutos + minmais ) == 60 ){
      hrplus = parseInt(1);
      hrmais = parseInt(hrmais + hrplus);
      minmais = parseInt(0);

  }else{

      hrplus = parseInt(0);
      minmais = parseInt( minmais + minutos );
      hrmais = parseInt(hrmais + hrplus);
  }

  hrfinal = parseInt( horas + hrmais);
  minfinal = minmais;

  if ( hrfinal >= horalimite ){
      alert('Hora Final ultrapassou a Hora Limite de Operação.');
      $horaI.val('').blur().focus();
      return ;
  }

  if(hrfinal <= 9){
      hrfinal = '0'+ hrfinal;
  }
  if( minfinal <= 9 ){
      minfinal = '0' + minfinal;
  }
  // console.log('hrmais:', hrmais);
  // console.log('minmais:', minmais);
  // console.log('hora final', hrfinal + ":" + minfinal );
  $horaF.val( hrfinal + ":" + minfinal );
}

function calculaHoraInicial(){
  var $horaI = $('#agnd_hora_inicio');
  var $horaF = $('#agnd_hora_final');
  var $duracao = $('#agnd_duracao') ;
  var horaInicio = parseInt( $('#agnd_hora_inicio').attr('data-hora_inicio_op') );
  
  if( $horaF.val() == '' ){
      $horaF.focus();
      return ;
  }
  if( $duracao.val() == '' ){
      $duracao.focus();
      return ;
  }
  
  texthora = $horaF.val();
  horas = parseInt(  texthora.slice(0,2) );
  minutos = parseInt( texthora.slice(-2) );
  durac = parseInt( $duracao.val() );
  hrmais = parseFloat(  Math.floor( durac / 60 ));
  minmais = Math.round( parseFloat(( parseFloat( durac / 60 ) - hrmais ) * 60 )) ;

  var mintot = parseInt(horas*60) + minutos;
      mintot = mintot - durac;
  var hrmenos = parseFloat(  Math.floor( mintot / 60 ));
      minmenos = Math.round( parseFloat(( parseFloat( mintot / 60 ) - hrmenos ) * 60 )) ;

  if ( hrmenos < horaInicio ){
      alert('Hora Inicial é menor do que a hora de Início da Operação.');
      $horaF.val('').blur().focus();
      return false;
  }

  if(hrmenos <= 9){
      hrmenos = '0'+ hrmenos;
  }
  if( minmenos <= 9 ){
      minmenos = '0' + minmenos;
  }
  
  $horaI.val( hrmenos + ":" + minmenos );
}


function dataAtual(){
  var dt, dia, mes, ano, dtretorno;
  dt = new Date();
  dia = dt.getDate();
  mes = dt.getMonth() + 1;
  ano = dt.getFullYear();

  if (dia.toString().length == 1) {
      dia = "0" + dt.getDate();
  }
  if (mes.toString().length == 1) {
      mes = "0" + mes;
  }

  dtretorno = dia + "/" + mes + "/" + ano;

  return dtretorno;
}

function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
// Decimal round
if (!Math.round10) {
  Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
  };
}
// Decimal floor
if (!Math.floor10) {
  Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
  };
}
// Decimal ceil
if (!Math.ceil10) {
  Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
  };
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
 // Escreve o html na tabela
 function Popula(values) {
    if (!values) return;
    var tds = '';
    // Coloca a tag html TD em volta de cada valor vindo do form de contatos
    values.forEach(value => tds += `<td class="col-lg text-truncate">` + value + `</td>`);
    $('#cobradostab tbody').append('<tr class="d-flex flex-column flex-lg-row" >' + tds + '</tr>');
};

// Pega as linhas da tabela auxiliar e manipula o hidden de cobradostab
function SetInput() {
    var content = '';
    $('#cobradostab tbody tr').each(function () {
        var par = $(this).closest('tr');
        var tdNome = par.children("td:nth-child(1)");
        var tdBloco = par.children("td:nth-child(2)");
        var tdAp = par.children("td:nth-child(3)");
        var tdSituacao = par.children("td:nth-child(4)");

        content += '[' + tdNome.text() + ' * ' + tdBloco.text() + ' * ' + tdAp.text() + ' * ' + tdSituacao.text() + ']';
    });

    $('[name=cobrados]')
        .val(content)
        .attr('data-anterior-aux', content)
        .change();
};

function Contatos() {
    var returnContatos = [];
    if ($('[name=cobrados]') && $('[name=cobrados]').val().length) {
        var contatos = $('[name=cobrados]').val().split('[');
        for (var i = 0; i < contatos.length; i++) {
            var contato = contatos[i];
            if (contato.length) {
                contato = contato.replace(']', '');
                var dadosContato = contato.split(' * ');
                returnContatos.push(dadosContato);
            }
        }
    };
    return returnContatos;
};

function LimpaInputs() {
    // limpa todos os input e a tabela 
    $('form input').val('').removeClass('is-valid is-invalid');
    $('form textarea').val('').removeClass('is-valid is-invalid');
    $('tbody tr').remove();
    SetInput(); 
    $('form').hide();
};

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

