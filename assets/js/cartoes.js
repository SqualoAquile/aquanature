
$(function () {
    
    // máscaras da posição, dos seriais, 
    // fazer lançamento das ações com o cliente

    $('#acoes_cliente').parent().parent().hide();
    $('#acoes_cliente').removeAttr('required');
    if( $('#posicao').attr('data-anterior') == '' ){
        // adicionar
        $('#acoestxt').parent().hide();   
        $('#btn_acoes').parent().hide();

        $( document ).tooltip({
            position: {
              my: "center bottom-20",
              at: "center top",
              using: function( position, feedback ) {
                $( this ).css( position );
                $( "<div>" )
                  .addClass( "arrow" )
                  .addClass( feedback.vertical )
                  .addClass( feedback.horizontal )
                  .appendTo( this );
              }
            }
        });
        $('#posicao').attr('title','(  0000  )');

    }else{
        $('#acoestxt').parent().show();
        if ($('#acoes_cliente').val() == '' ){
            $('#btn_acoes').parent().hide();
        }else{
            $('#btn_acoes').parent().show();
        }   
        
        $('#posicao').attr('readonly','readonly');

    }

    $( "#condominio" ).autocomplete({
        source: function( request, response ) {
        $.ajax( {
            url: baselink + '/ajax/buscaCondominios',
            type:"POST",
            dataType: "json",
            data: {
            term: request.term
            },
            success: function( data ) {
                // console.log('resposta:', data);
                response( data );
            }
        } );
        },
        minLength: 2,
        select: function( event, ui ) {
            
            $(this).attr('data-idclie', ui.item.id );

        },
        response: function( event, ui ) {

        }
    });
    $( "#condominio" ).focus(function(event) {
    var termo = "";
    termo = $(this).val().trim();
    $(this).autocomplete( "search" , termo );
    });
    $( "#condominio" ).parent('div').addClass('ui-widget');
    $( "#condominio" ).on('click',function(){
        $(this).keyup();
    });
    $( "#condominio" ).on('blur',function(){
        if ( $(this).val() == '' ){
            $('#posicao').focus();      
        }else{
            
            var $this = $('#posicao'), text_label = $this.siblings('label').find('span').text();
            var tabela = 'cartoes', campo = 'condominio', $cond = $('#condominio').val();
            
            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();
        
            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(4)) {
                        // Valido
                        if ($this.attr('data-unico')) {
                            var procurado = $('#posicao').val(), tabela = 'cartoes', coluna = 'condominio', condicao = $('#condominio').val()  ;
                            
                            $.ajax({
                                url: baselink + '/ajax/buscaUnicoCondicionado',
                                type: 'POST',
                                data: {
                                    valor: procurado,
                                    tabela: tabela,
                                    campo: coluna,
                                    condicao: condicao
                                },
                                dataType: 'json',
                                success: function (data) {
                                    // console.log( data );
                                    if( data == '' ){
                                        // console.log('está ok pode seguir')
                                        // Não existe, pode seguir
                                        $this.removeClass('is-invalid').addClass('is-valid');
                                        $this[0].setCustomValidity('');
                
                                    } else {
                                            // console.log('TROCAR')
                                            // Já existe: erro
                                            $this.removeClass('is-valid').addClass('is-invalid');
                                            $this[0].setCustomValidity('invalid');
                                            $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');
                                    }
                                }
                            });
                        
                        } else {
                            $this.removeClass('is-invalid').addClass('is-valid');
                            $this[0].setCustomValidity('');
                        }
                    } else {
                        // Inválido
                        $this.removeClass('is-valid').addClass('is-invalid');
                        $this[0].setCustomValidity('invalid');
                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 0000</div>');
                    }
                }
            }
        }
    });
    $( "#condominio" ).on('blur',function(){
        if ( $('#posicao').attr('data-anterior') == '' ){
            if( $(this).val() != '' ){
                var condominio = $(this).val();
                    condominio = condominio.trim();
                $.ajax( {
                    url: baselink + '/ajax/buscaUltimaPosicaoCondominio',
                    type:"POST",
                    dataType: "json",
                    data: {
                        condominio: condominio
                    },
                    success: function( data ) {
                        // console.log('resposta:', data);
                        $('#posicao').trigger('mouseout');  
                        $('#posicao').attr('title','Última Posição:   (  ' + data + '  )');
                        $('#posicao').trigger('mouseover');    
                    }
                } );

                var mensal = 0;
                $.ajax( {
                    url: baselink + '/ajax/buscaMensalidadePadrao',
                    type:"POST",
                    dataType: "json",
                    data: {
                        condominio: condominio
                    },
                    success: function( data ) {
                        // console.log('resposta:', data);
                        mensal = parseFloat( data );
                        mensal = mensal.toFixed(2).replace(".",",");
                        $('#mensalidade').val(mensal);
                    }
                } );

            }else{
                $('#posicao').attr('title','');
                $('#mensalidade').val('');
            }
        }
    });

    $('#acoestxt').blur(function(){
        if ( $(this).val() != '' ){
            var acaoatual = $(this).val() + '**' + dataAtual();
            if( $('#acoes_cliente').attr('data-anterior') == '' || $('#acoes_cliente').attr('data-anterior') == undefined){
                $('#acoes_cliente').val('');
            }  
            var valanterior = $('#acoes_cliente').attr('data-anterior');
            if( valanterior == '' ){
                $('#acoes_cliente').val( acaoatual);
            }else{
                $('#acoes_cliente').val( valanterior + ' ~~ ' + acaoatual);
            }  
            
            $('#acoes_cliente').blur();
            // console.log($('#acoes_cliente').val())

        }else{
            if( $('#acoes_cliente').attr('data-anterior') == '' || $('#acoes_cliente').attr('data-anterior') == undefined){
                $('#acoes_cliente').attr('data-anterior', '');
            }
            if( $('#acoes_cliente').attr('data-anterior') == '' ){
                $('#acoes_cliente').val( "" );
                $('#acoes_cliente').blur();
            }else{
                $('#acoes_cliente').val( $('#acoes_cliente').attr('data-anterior') );
                $('#acoes_cliente').blur();
            } 
            
            // console.log($('#acoes_cliente').val())
        }
    });

    $('#situacaoatual').on('blur', function(){
        if( $(this).val() == 'Cancelado' ){
           
            $('#dt_cancelamento').removeAttr('readonly').attr('required', 'required');
            
        }else{

            $('#dt_cancelamento').attr('readonly','readonly').removeAttr('required');
        }
    }).blur();

    $('#dt_cancelamento').on('blur', function(){
        if ( $(this).val() != '' ){
            if( $('#situacaoatual').val() == 'Cancelado' ){
                if( $(this).val() == '00/00/0000' ){
                     $(this).val('');
                }
                 
             }else{
                if ( $(this).attr('data-anterior') == '00/00/0000' ){
                    $(this).val($(this).attr('data-anterior'));
                }else{
                    $(this).val('');
                } 
                
             }
        }
    });

    $('#seriala, #serials').on('keyup', function(){
        console.log('entrei')
        if ($(this).val() != ''){
            var caixaAlta = '';
            caixaAlta =  $(this).val();
            caixaAlta = caixaAlta.trim().toLocaleUpperCase();
            $(this).val(caixaAlta);
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

