$(function () {
    
    //inicializa os inputs da página - parte do orçamento

    $('#data_aprovacao').attr('disabled', 'disabled');
    $('#titulo_orcamento').attr('disabled', 'disabled');
    $('#nome_razao_social').attr('disabled', 'disabled');
    $('#custo_total').attr('disabled', 'disabled');
    $('#subtotal').attr('disabled', 'disabled');
    $('#desconto_porcent').attr('disabled', 'disabled');
    $('#valor_final').attr('disabled', 'disabled');
    $('#status').attr('disabled', 'disabled');
    $('#id_orcamento').attr('disabled', 'disabled').parent().parent().hide();
    $('#garantia_vitalicia').attr('disabled', 'disabled').parent().parent().hide();
    $('#motivo_cancelamento').parent().parent().hide();
    $('#btn_cancelamentoVenda').parent().hide();
    $('#desconto_porcent').attr('disabled', 'disabled');

    $('#id').attr('disabled', 'disabled').parent().parent().css('order','1').show();
    $('#id').siblings('label').text('* Número do Pedido');


    if( $('#data_revisao_1').attr('data-anterior') == '00/00/0000'){
        $('#data_revisao_1').attr('data-anterior','');
    }

    if( $('#data_revisao_2').attr('data-anterior') == '00/00/0000'){
        $('#data_revisao_2').attr('data-anterior','');
    }

    if( $('#data_revisao_3').attr('data-anterior') == '00/00/0000'){
        $('#data_revisao_3').attr('data-anterior','');
    }

    if( $('#data_emissao_nf').attr('data-anterior') == '00/00/0000'){
        $('#data_emissao_nf').attr('data-anterior','');
    }

    if( $('#data_inicio').val() == '00/00/0000'){
        $('#data_inicio').attr('data-anterior','');
        $('#data_inicio').attr('value','');
        $('#data_inicio').val('').datepicker('update');
    }

    if( $('#data_fim').val() == '00/00/0000'){
        $('#data_fim').attr('data-anterior','');
        $('#data_fim').attr('value','');
        $('#data_fim').val('').datepicker('update');
    }

    if( $('#data_aprovacao').val() == '00/00/0000' || $('#data_aprovacao').val() == '' ){
        $('#data_inicio').val('');
    }else{
        if( $('#status').val() == 'Em Produção' ){
            $('#data_inicio').val($('#data_aprovacao').val()).datepicker('update');
        }else if( $('#status').val() == 'Cancelada' ){
            $('#data_inicio').val('');
        }
        
    }

    if( $('#data_emissao_nf').val() == '00/00/0000'){
        $('#data_emissao_nf').val('').datepicker('update');
    }

    // inicialização dos campos status EM PRODUÇÃO
    if($('#status').val() == 'Em Produção'){ 

        $('#data_revisao_1').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#presenca_rev1').val('').attr('disabled', 'disabled').parent().parent().hide();

        $('#data_revisao_2').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#presenca_rev2').val('').attr('disabled', 'disabled').parent().parent().hide();

        $('#data_revisao_3').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#presenca_rev3').val('').attr('disabled', 'disabled').parent().parent().hide();

        $('#btn_salvarOS').parent().show();
        $('#btn_historicoOS').parent().show();
        $('#btn_lancamentoVenda').parent().show();
        $('#chk_cancelamentoVenda').parent().parent().show();

    // inicialização dos campos status FINALIZADA    
    }else if($('#status').val() == 'Finalizada'){

        $('input, select,  textarea').attr('disabled','disabled');
        $('#observacao').removeAttr('disabled');

        $('#btn_historicoOS').parent().show();
        $('#btn_lancamentoVenda').parent().hide();
        $('#chk_cancelamentoVenda').parent().parent().hide();
        
        if( $('#presenca_rev1').attr('data-anterior') == '' &&
            $('#presenca_rev2').attr('data-anterior') == '' &&
            $('#presenca_rev3').attr('data-anterior') == '' ){

            $('#presenca_rev1').empty()
            .append('<option value="" selected  >Selecione</option>')
            .append('<option value="SIM" >Sim</option>')
            .append('<option value="NAO" >Não</option>');
            
            if( maiorData( $('#data_revisao_1').val(), dataAtual() ) == dataAtual() || 
                maiorData( $('#data_revisao_1').val(), dataAtual() ) == 'iguais' ){
                $('#presenca_rev1').val('').removeAttr('disabled').focus();
            }
            
        }else if (  $('#presenca_rev1').attr('data-anterior') == 'SIM' && 
                    $('#presenca_rev2').attr('data-anterior') == '' && 
                    $('#presenca_rev3').attr('data-anterior') == '' ){
            
            $('#presenca_rev1, #presenca_rev2').empty()
            .append('<option value="" selected  >Selecione</option>')
            .append('<option value="SIM" >Sim</option>')
            .append('<option value="NAO" >Não</option>');

            $('#presenca_rev1').val($('#presenca_rev1').attr('data-anterior'));
            
            if( maiorData( $('#data_revisao_2').val(), dataAtual() ) == dataAtual() ||
                maiorData( $('#data_revisao_2').val(), dataAtual() ) == 'iguais' ){
                $('#presenca_rev2').val('').removeAttr('disabled').focus();
            }

        }else if (  $('#presenca_rev1').attr('data-anterior') == 'SIM' && 
                    $('#presenca_rev2').attr('data-anterior') == 'SIM' && 
                    $('#presenca_rev3').attr('data-anterior') == '' ){

            $('#presenca_rev1, #presenca_rev2, #presenca_rev3').empty()
            .append('<option value="" selected  >Selecione</option>')
            .append('<option value="SIM" >Sim</option>')
            .append('<option value="NAO" >Não</option>');

            $('#presenca_rev1').val($('#presenca_rev1').attr('data-anterior'));
            $('#presenca_rev2').val($('#presenca_rev2').attr('data-anterior'));

            if( maiorData( $('#data_revisao_3').val(), dataAtual() ) == dataAtual() ||
                maiorData( $('#data_revisao_3').val(), dataAtual() ) == 'iguais' ){
                $('#presenca_rev3').val('').removeAttr('disabled').focus();
            }
            

        }else{
            $('#btn_salvarOS').parent().hide();
            $('#observacao').attr('disabled','disabled');
            
            $('#presenca_rev1, #presenca_rev2, #presenca_rev3').empty()
            .append('<option value="" selected  >Selecione</option>')
            .append('<option value="SIM" >Sim</option>')
            .append('<option value="NAO" >Não</option>');

            $('#presenca_rev1').val($('#presenca_rev1').attr('data-anterior'));
            $('#presenca_rev2').val($('#presenca_rev2').attr('data-anterior'));
            $('#presenca_rev3').val($('#presenca_rev3').attr('data-anterior'));
        }
    
    // inicialização dos campos status CANCELADO        
    }else{

        $('input, select,  textarea').attr('disabled','disabled');
        $('#btn_salvarOS').parent().hide();
        $('#btn_historicoOS').parent().show();
        $('#btn_lancamentoVenda').parent().hide();
        $('#chk_cancelamentoVenda').parent().parent().hide();

        $('#data_revisao_1').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#data_revisao_2').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#data_revisao_3').val('').attr('disabled', 'disabled').parent().parent().hide();
    }

    $.ajax({
        url: baselink + "/ajax/buscaParametrosMaterial",
        type: "POST",
        data: {
          tabela: "parametros"
        },
        dataType: "json",
        success: function(data) {
          var desconto_maximo;
          if (data["desconto_max"]) {
            desconto_maximo = floatParaPadraoInternacional(data["desconto_max"]);
            $("#desconto_porcent").attr("data-desconto_maximo", desconto_maximo);

            // setar desconto absoluto
            var $desconPorcentagem = $("#desconto_porcent");
            var subtotal = parseFloat(floatParaPadraoInternacional($("#subtotal").val()));
            var desc_max_porcent = parseFloat($desconPorcentagem.attr('data-desconto_maximo'));
            var desc_max_abs = parseFloat( parseFloat(subtotal) * parseFloat(parseFloat(desc_max_porcent)/parseFloat(100))).toFixed(2);
            $('#desconto').attr('data-desconto_maximo',desc_max_abs);
          }
        }
      });
      
    $('#data_inicio').on('change blur', function () {
        if ($('#data_inicio').val() != '') {
            var dtAprov, dtInicio, dtFim;
           
            dtInicio = $('#data_inicio').val();
            dtInicio = dtInicio.split('/');
            dtInicio = parseInt(dtInicio[2] + dtInicio[1] + dtInicio[0]);
            
            if ($('#data_aprovacao').val() != '') {
              
                dtAprov = $('#data_aprovacao').val();
                dtAprov = dtAprov.split('/');
                dtAprov = parseInt(dtAprov[2] + dtAprov[1] + dtAprov[0]);

                if (dtInicio < dtAprov) {
                    alert('A data de aprovação não pode ser maior do que a data de início.');
                    $('#data_inicio').val('').focus();
                }
            } else {
                alert('Preencha a Data de Aprovação.');
                $('#data_inicio').val('').focus();
            }

            if ($('#data_fim').val() != '') {

                dtFim = $('#data_fim').val();
                dtFim = dtFim.split('/');
                dtFim = parseInt(dtFim[2] + dtFim[1] + dtFim[0]);

                if (dtFim < dtInicio) {
                    alert('A data de início não pode ser maior do que a data de finalização.');
                    $('#data_inicio').val( $('#data_aprovacao').val() ).datepicker('update');
                    $('#data_fim').val('').focus();
                }
            } 
        }else{
            // $('#data_inicio').val( $('#data_aprovacao').val() ).datepicker('update');
        }
    });

    $('#data_fim').on('change blur', function () {
        if ($('#data_fim').val() != '') {
            if ($('#data_inicio').val() != '') {
                var dtInicio, dtFim;
                dtInicio = $('#data_inicio').val();
                dtInicio = dtInicio.split('/');
                dtInicio = parseInt(dtInicio[2] + dtInicio[1] + dtInicio[0]);

                dtFim = $('#data_fim').val();
                dtFim = dtFim.split('/');
                dtFim = parseInt(dtFim[2] + dtFim[1] + dtFim[0]);

                if (dtFim < dtInicio) {
                    alert('A data de início não pode ser maior do que a data de finalização.');
                    $('#data_inicio').val( $('#data_aprovacao').val() ).datepicker('update');
                    $('#data_fim').val('').focus();
                }
            }
        }
    });

    $('#data_revisao_1').on('change blur', function () {
        if ($('#data_fim').val() != '') {
            if ($('#data_revisao_1').val() != '') {
                var dtRev1, dtFim;
                dtFim = $('#data_fim').val();
                dtFim = dtFim.split('/');
                dtFim = parseInt(dtFim[2] + dtFim[1] + dtFim[0]);

                dtRev1 = $('#data_revisao_1').val();
                dtRev1 = dtRev1.split('/');
                dtRev1 = parseInt(dtRev1[2] + dtRev1[1] + dtRev1[0]);

                if (dtRev1 < dtFim) {
                    alert('A data da primeira revisão deve ser maior do que a data de finalização.');
                    $('#data_revisao_1').val('').datepicker('update');
                    $('#data_revisao_1').focus();
                }
            }
        }
    });

    $('#data_revisao_2').on('change blur', function () {
        if ($('#data_revisao_1').val() != '') {
            if ($('#data_revisao_2').val() != '') {
                var dtRev1, dtRev2;
                dtRev1 = $('#data_revisao_1').val();
                dtRev1 = dtRev1.split('/');
                dtRev1 = parseInt(dtRev1[2] + dtRev1[1] + dtRev1[0]);

                dtRev2 = $('#data_revisao_2').val();
                dtRev2 = dtRev2.split('/');
                dtRev2 = parseInt(dtRev2[2] + dtRev2[1] + dtRev2[0]);

                if (dtRev2 < dtRev1) {
                    alert('A data da segunda revisão deve ser maior do que a data da primeira revisão.');
                    $('#data_revisao_2').val('').datepicker('update');
                    $('#data_revisao_2').focus();
                }
            }
        }
    });

    $('#data_revisao_3').on('change blur', function () {
        if ($('#data_revisao_2').val() != '') {
            if ($('#data_revisao_3').val() != '') {
                var dtRev2, dtRev3;
                dtRev2 = $('#data_revisao_2').val();
                dtRev2 = dtRev2.split('/');
                dtRev2 = parseInt(dtRev2[2] + dtRev2[1] + dtRev2[0]);

                dtRev3 = $('#data_revisao_3').val();
                dtRev3 = dtRev3.split('/');
                dtRev3 = parseInt(dtRev3[2] + dtRev3[1] + dtRev3[0]);

                if (dtRev3 < dtRev2) {
                    alert('A data da terceira revisão deve ser maior do que a data da segunda revisão.');
                    $('#data_revisao_3').val('').datepicker('update');
                    $('#data_revisao_3').focus();
                }
            }
        }
    });

    // busca as despesas do ID da OS pra completar o custo
    
    if( $('#custo_total').attr('data-anterior') != '' && 
        $('#status').val() != 'Cancelada' && 
        $('#presenca_rev1').attr('data-anterior') != 'NAO' &&
        $('#presenca_rev2').attr('data-anterior') != 'NAO' &&
        $('#presenca_rev3').attr('data-anterior') == '' ){ //significa que o formulário está sendo editado e a OS está em produção ou Finalizada
        
        var $idOS = $("#id");
        var $idOrc = $("#id_orcamento");
        var $custo = $("#custo_total");
        var $desconPorcentagem = $("#desconto_porcent");
        
         // preenche os valores dos campos que são necessários
         var idOrdemServico, idOrcamento;
         idOrdemServico = $idOS.val();
         idOrcamento = $idOrc.val();

         $.ajax({
             url: baselink + '/ajax/buscaDespesasId',
             type: 'POST',
             data: {
                idOrdemServico: idOrdemServico,
                idOrcamento: idOrcamento
             },
             dataType: 'json',
             success: function (dado) {
                
                 if(dado != ''){               
                    var custosExtras, custoaux;                            
                    custosExtras = parseFloat(dado['DespesaId']).toFixed(2);

                    if( custosExtras > 0 ){  

                        custoaux = parseFloat( floatParaPadraoInternacional( $custo.val() ) );
                        custoaux = parseFloat(custosExtras) + parseFloat( custoaux );
                        $custo.val( floatParaPadraoBrasileiro( custoaux ) );
                        
                        $desconPorcentagem.blur();

                        alert(  `Existe alteração no valor do Custo Total.
                               \nEla será salva quando a Ordem de Serviço for finalizada.`);
                        
                    }
                 }
                 
             }
         });
    }

    $('#chk_cancelamentoVenda').click(function(){
       
        if( $(this).is(':checked') ){

            $('#btn_cancelamentoVenda').parent().show();
            $('#btn_lancamentoVenda').parent().hide();

            $('#motivo_cancelamento').val('').blur().parent().parent().show();
            $('#motivo_cancelamento').focus();

        }else{

            $('#btn_cancelamentoVenda').parent().hide();
            $('#btn_lancamentoVenda').parent().show();
            $('#motivo_cancelamento').val('').blur().parent().parent().hide();
        }

    });

    $('#btn_cancelamentoVenda').click(function(){
        var $motivoCancela = $('#motivo_cancelamento');

        if( $motivoCancela.val() == '' ){
            alert('Preencha o Motivo do Cancelamento.');
            $motivoCancela.focus();
            return;
        }

        if ( confirm('Tem Certeza que quer Cancelar essa Ordem de Serviço?') ==  true && $motivoCancela.val() != '' ){  
            var idOS = $('#id').val();
            var motivo = $motivoCancela.val()+'a';

            $.ajax({
                url: baselink + "/ajax/cancelarOS",
                type: "POST",
                data: {
                        motivo: motivo,
                        idOS: idOS
                      }, 
                dataType: "json",
                success: data => {
                    if(data == true){
                        // deu certo o cancelamento
                        // vai ser redirecionado pro browser, não precisa fazer nada
                        window.location.href = baselink+"/ordemservico";
                    }else{
                        alert('Não foi possível realizar o cancelamento.\nTente Novamente.');
                        return;
                    }                      
                }      
            });

        }        
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //////////////                                                            /////////////////////
    ////////////// INÍCIO DO MODAL DE LANÇAMENTO NO FLUXO DE CAIXA DA VENDA   /////////////////////
    //////////////                                                            /////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $('#btn_lancamentoVenda').click(function(){
        if( $('#vendedor').val() == '' ){
            alert('Preencha o campo Vendedor.');
            $('#vendedor').focus();
            return;
        } if( $('#tec_responsavel').val() == '' ){
            alert('Preencha o campo Técnico Responsável.');
            $('#tec_responsavel').focus();
            return;
        } if( $('#data_inicio').val() == '' ){
            alert('Preencha o campo Data de Início.');
            $('#data_inicio').focus();
            return;
        } if( $('#data_fim').val() == '' ){
            alert('Preencha o campo Data de Finalização.');
            $('#data_fim').focus();
            return;
        } if( $('#desconto_porcent').val() == '' ){
            alert('O campo Desconto (%) deve estra preenchido.');
            $('#desconto_porcent').focus();
            return;
        }if( $('#desconto').val() == '' ){
            alert('Preencha o campo Desconto (R$).');
            $('#desconto_porcent').focus();
            return;
        }if( $('#valor_final').val() == '' ){
            alert('Preencha o campo Valor Final.');
            $('#valor_final').focus();
            return;
        }

        var $alteracoes = $('[name=alteracoes]');

        if ($alteracoes.val() != '') { // Editar

            $('#data_revisao_1').val( proximoDiaUtil( dataAtual(), 15 ) );
            $('#data_revisao_2').val( proximoDiaUtil( dataAtual(), 30 ) );
            $('#data_revisao_3').val( proximoDiaUtil( dataAtual(), 185 ) );
            // Faz um foreach em todos os campos do formulário para ver os valores atuais e os valores anteiores
            var campos_alterados = '';
            $('#form-principal').find('input[type=text], input[type=hidden]:not([name=alteracoes]), input[type=radio]:checked, textarea, select').each(function (index, el) {

                var valorAtual = $(el).val(),
                    dataAnterior = $(el).attr('data-anterior'),
                    text_label = $(el).siblings('label').find('span').text();

                valorAtual = String(valorAtual).trim().toUpperCase();
                dataAnterior = String(dataAnterior).trim().toUpperCase();

                if (dataAnterior == "00/00/0000" ){
                    dataAnterior = '';
                }

                if (dataAnterior != valorAtual) {                    

                    campos_alterados += '{' + text_label.toUpperCase() + ' de (' + dataAnterior + ') para (' + valorAtual + ')}';
                    
                }
            });

            if (campos_alterados != '') {

                $alteracoes.val($alteracoes.val() + '##' + campos_alterados);
                // console.log('alterações: ',$alteracoes.val());
                if( $('#historico').is(':visible') == true ){
                    $('#btn_historicoOS').click();
                }
                $('#modalLancamentoVenda').modal('show');

            } else {
                // Se o usuario entrou para editar e submitou sem alterar nada
                alert("Nenhuma alteração foi feita!");
                return;
            }
        } else { // Adicionar
            return;
        }
    });

    //FINALIZAÇÃO DA OS
    $(document).on("submit", "#form_lancamento", event => {
      event.preventDefault();

      let   $form = $("#form_lancamento")
            $formOS = $('#form-principal');

      if ( $('table.table.table-striped.table-hover tbody').length > 0 ) {

        //lança no fluxo de caixa os itens de venda e despesa financeira
        $.ajax({
          url: baselink + "/ajax/adicionarLancamento",
          type: "POST",
          data: $form.serialize(),
          dataType: "json",
          success: data => {
            // deu certo o lançamento no fluxo de caixa da receita da O.S.   
            if(data == true){
                // console.log('lançou no caixa');
                $formOS.find('#status').val('Finalizada');
                $formOS.find('input, select, textarea').removeAttr('disabled');

                
                // finaliza o Ordem de Serviço no banco
                $.ajax({
                    url: baselink + "/ajax/finalizarOS",
                    type: "POST",
                    data: $formOS.serialize(),
                    dataType: "json",
                    success: data => {
                        
                        if(data == true){
                            // console.log('finalizou a OS')
                            // deu certo a finalização da ordem de serviço
                            // vai ser redirecionado pro browser, não precisa fazer nada
                        }else{
                            // deu errado a finalização da ordem de serviço
                            // console.log('erro finalização OS')
                            // apagar os lançamentos feitos no caixa
                            var $idOS = $("#id");
                            var $titOrc = $('#titulo_orcamento');
                            var idOrdemServico, tituloOrcamento;
                            idOrdemServico = $idOS.val();
                            tituloOrcamento = $titOrc.val();
                            
                            $.ajax({
                                url: baselink + '/ajax/excluiRegistroFluxoCaixa',
                                type: 'POST',
                                data: {
                                idOrdemServico: idOrdemServico,
                                tituloOrcamento: tituloOrcamento
                                },
                                dataType: 'json',
                                success: function () {
                                
                                }
                            });                        
                        }      
                     
                    }
                  });
                
                  $("#modalLancamentoVenda").modal("hide");
                  window.location.href = baselink+"/ordemservico";
                
            }else{
                return;

            }      
          }
        });
      }
    });

    $('#modalLancamentoVenda').on('show.bs.modal', function (e) {

        let $formLancaFluxoModal = $('#modalLancamentoVenda'),
            $formOS = $('#form-principal');
        
        $formLancaFluxoModal.find('h1').text('Finalização da Ordem de Serviço');
        $('#valorOSdiv').remove();
        $formLancaFluxoModal.find('#btn_incluir').parent().parent()
        .after(`<div id="valorOSdiv" class="col-lg-5 offset-lg-4" style="order:18;">
                    <div class="card card-body py-2 text-success text-center mb-3">
                        <div class="d-flex justify-content-center align-items-center">
                            <span class="mr-3">Valor Final da O.S. </span>
                            <h3 class="m-0" id="valor_os">`+$formOS.find('[name=valor_final]').val()+`</h3>
                        </div>
                    </div>
                </div>`);
        
        $formLancaFluxoModal.find('div#btn_limparCampos').hide();
        $formLancaFluxoModal.find('button.btn.btn-dark').parent().parent().hide();
        
        $('label.btn.btn-primary.btn-lg.btn-block').hide();
        $('#alertaValorIgual').hide();

        $('table.table.table-striped.table-hover tbody').on('DOMSubtreeModified', function(){
            if( receitaOK() == true ){
                $('label.btn.btn-primary.btn-lg.btn-block').show();
                $('#alertaValorIgual').hide();
                
            }else{
                $('label.btn.btn-primary.btn-lg.btn-block').hide();
                
                if( $('table.table.table-striped.table-hover tbody').length > 0  ){
                    $('#alertaValorIgual').show();
                }else{
                    $('#alertaValorIgual').hide();
                }
                
            }
            
        });
        
        //Checkbox de Receita
        $formLancaFluxoModal
            .find('#Receita')
            .prop('checked', true)
            .attr('disabled','disabled')
            .change();
        
        //Checkbox de Receita
        $formLancaFluxoModal
            .find('#Despesa')
            .prop('checked', false)
            .attr('disabled','disabled');

        // Nro Pedido
        $formLancaFluxoModal
            .find('[name=nro_pedido]')
            .val($formOS.find('[name=id]').val())
            .attr('disabled','disabled');
            
        // Nro NF
        $formLancaFluxoModal
            .find('[name=nro_nf]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=nro_nf]').val());
        
    
        // Data Emissao NF
        $formLancaFluxoModal
            .find('[name=data_emissao_nf]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=data_emissao_nf]').val())
            .datepicker('update');
        

        // Conta Analítica
        $formLancaFluxoModal
            .find('[name=conta_analitica]')
            .attr('disabled','disabled')
            .val('Venda');

        // Detalhe
        $formLancaFluxoModal
            .find('[name=detalhe]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=titulo_orcamento]').val());

        // Vendedor
        $formLancaFluxoModal
            .find('[name=quem_lancou]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=vendedor]').val());

        // Favorecido
        $formLancaFluxoModal
            .find('[name=favorecido]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=nome_razao_social]').val());

        // Data Operacao
        $formLancaFluxoModal
            .find('[name=data_operacao]')
            .val($formOS.find('[name=data_fim]').val())
            .datepicker('update');
        
        // Valor Total
        $formLancaFluxoModal
            .find('[name=valor_total]')
            // .attr('disabled','disabled')
            .val($formOS.find('[name=valor_final]').val());
            
        // Observacao
        $formLancaFluxoModal
        .find('[name=observacao]')
        .val('');
        
    });

    $('#modalLancamentoVenda').on('hide.bs.modal', function (e) {

        var $alteracoes = $('[name=alteracoes]');
        $alteracoes.val( $alteracoes.attr('data-anterior'));

        $("table.table.table-striped.table-hover tbody tr").remove();
        calcularesumo();        

    });

    $('#desconto').on('change', function(){
        var $custo   = $("#custo_total");
              var $subtotal = $("#subtotal");
              var subtotal = floatParaPadraoInternacional($("#subtotal").val());
              var $desconPorcentagem = $("#desconto_porcent");
              var $desconto = $("#desconto");
              var $valorFinal = $("#valor_final");
        
              var desc_max, precoaux, custoaux, descaux;
        
              desc_max = parseFloat( $desconto.attr('data-desconto_maximo'));
        
              if($desconto.val() == ''){
                  $desconto.val('0,00').blur();
              }
        
              if( desc_max != undefined && desc_max != '' ){
                  
                  if( $desconto.val() != undefined && $desconto.val() != ''){
                      if( parseFloat( floatParaPadraoInternacional( $desconto.val() ) ) > desc_max ){
                          alert('O valor máximo de desconto é ' + floatParaPadraoBrasileiro(desc_max));
                          $desconto.val('0,00').blur();
                          return;
                      }
                  }
              
                  if( $custo.val() != '' && $custo.val() != undefined && $subtotal.val() != '' && $subtotal.val() != undefined && $desconto.val() != undefined && $desconto.val() != '' ){
        
                      precoaux = parseFloat( parseFloat( parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) - parseFloat( parseFloat( floatParaPadraoInternacional( $desconto.val() ) ) ) ).toFixed(2) );
                      custoaux = parseFloat( parseFloat( floatParaPadraoInternacional( $custo.val() ) ).toFixed(2) );
        
                      if( precoaux < custoaux ){
                          alert( 'O desconto dado faz o valor final ser menor do que custo total.' );
                          $desconto.val('0,00').blur();
                          return;
                      }else if( precoaux == custoaux ){
                          alert( 'O desconto dado faz o valor final ser igual custo total.' );
                          $desconto.val('0,00').blur();
                          return;
                      }else{
                          descaux =  parseFloat(parseFloat(100) - parseFloat(parseFloat(parseFloat(precoaux) / parseFloat(subtotal)) * parseFloat(100))).toFixed(2);  
                          
                          $desconPorcentagem.val( floatParaPadraoBrasileiro( descaux ) + '%' );
                          
                          $valorFinal.val( floatParaPadraoBrasileiro( precoaux ) );
                      }
                  }
              }
          });
        
        // $('#desconto_porcent').on('change', function(){
        
        //       var $custo   = $("#custo_total");
        //       var $subtotal = $("#subtotal");
        //       var subtotal = floatParaPadraoInternacional($("#subtotal").val());
        //       var $desconPorcentagem = $("#desconto_porcent");
        //       var $desconto = $("#desconto");
        //       var $valorFinal = $("#valor_final");
        
        //       var desc_max, precoaux, custoaux, descaux;
        
        //       desc_max = parseFloat( $desconPorcentagem.attr('data-desconto_maximo'));
        
        //       if($desconPorcentagem.val() == ''){
        //           $desconPorcentagem.val('0,00%').blur();
        //       }
        
        //       if( desc_max != undefined && desc_max != '' ){
                  
        //           if( $desconPorcentagem.val() != undefined && $desconPorcentagem.val() != ''){
        //               if( parseFloat( floatParaPadraoInternacional( $desconPorcentagem.val() ) ) > desc_max ){
        //                   alert('O valor máximo de desconto é ' + floatParaPadraoBrasileiro(desc_max) + '%');
        //                   $desconPorcentagem.val('0,00%').blur();
        //                   return;
        //               }
        //           }
              
        //           if( $custo.val() != '' && $custo.val() != undefined && $subtotal.val() != '' && $subtotal.val() != undefined && $desconPorcentagem.val() != undefined && $desconPorcentagem.val() != '' ){
        
        //               precoaux = parseFloat( parseFloat( parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) * parseFloat( parseFloat(1) - parseFloat( parseFloat( floatParaPadraoInternacional( $desconPorcentagem.val() ) ) / parseFloat( 100 ) ) ) ).toFixed(2) );
        //               custoaux = parseFloat( parseFloat( floatParaPadraoInternacional( $custo.val() ) ).toFixed(2) );
        
        //               if( precoaux < custoaux ){
        //                   alert( 'O desconto dado faz o valor final ser menor do que custo total.-#desconto_porcent' );
        //                   $desconPorcentagem.val('0,00%').blur();
        //                   return;
        //               }else if( precoaux == custoaux ){
        //                   alert( 'O desconto dado faz o valor final ser igual custo total.' );
        //                   $desconPorcentagem.val('0,00%').blur();
        //                   return;
        //               }else{
        //                   descaux =  parseFloat( parseFloat( parseFloat( floatParaPadraoInternacional( $desconPorcentagem.val() ) ) / parseFloat(100) ) * parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) ).toFixed(2);
        //                   $desconto.val( floatParaPadraoBrasileiro( descaux ) );
        //                   $valorFinal.val( floatParaPadraoBrasileiro( precoaux ) );
        //               }
        //           }
        //       }
        // });


    // Radio e Listener para desconto em porcentagem ou absoluto
    // $('#desconto_porcent').before('<div class="form-check form-check-inline"><input class="form-check-input position-static" type="radio" name="radioDesconto" id="radioPorcent" value="porcent" readonly="readonly"></div>');
    // $('#desconto').before('<div class="form-check form-check-inline"><input class="form-check-input position-static" type="radio" name="radioDesconto" id="radioAbsoluto" value="absoluto" readonly="readonly"></div>');

    // PADRÃO: Desconto em porcentagem
    // $('#radioPorcent').attr('checked',true);

    // PARA BLOQUEAR OU ABRIR UM CAMPO
    // $('[name=radioDesconto]').on('change', function(){
    //     var radioValue = $("input[name='radioDesconto']:checked").val();

    //     if(radioValue == 'porcent'){
    //         $('#desconto_porcent').val('0,00%');
    //         $('#desconto').val('0,00');
    //         $('#desconto_porcent').attr('readonly',false);
    //         $('#desconto').attr('readonly', 'readonly');
    //     }else if(radioValue == 'absoluto'){
    //         $('#desconto_porcent').val('0,00%');
    //         $('#desconto').val('0,00');
    //         $('#desconto').attr('readonly',false);
    //         $('#desconto_porcent').attr('readonly','readonly');
    //     }
    // });

    // PARA CALCULAR O VALOR DO DESCONTO
    // $('#desconto_porcent, #desconto').on('change', function(){

    //     var estadoAbsoluto = document.getElementById('radioAbsoluto').checked;
    //     var estadoPorcent = document.getElementById('radioPorcent').checked;

    //     if(estadoPorcent){
    //         var $custo   = $("#custo_total");
    //         var $subtotal = $("#subtotal");
    //         var $desconPorcentagem = $("#desconto_porcent");
    //         var $desconto = $("#desconto");
    //         var $valorFinal = $("#valor_final");

    //         var desc_max, precoaux, custoaux, descaux;
      
    //         desc_max = parseFloat( $desconPorcentagem.attr('data-desconto_maximo'));

    //         if($desconPorcentagem.val() == ''){
    //             $desconPorcentagem.val('0,00%').blur();
    //         }

    //         if( desc_max != undefined && desc_max != '' ){
                
    //             if( $desconPorcentagem.val() != undefined && $desconPorcentagem.val() != ''){
    //                 if( parseFloat( floatParaPadraoInternacional( $desconPorcentagem.val() ) ) > desc_max ){
    //                     alert('O valor máximo de desconto é ' + floatParaPadraoBrasileiro(desc_max) + '%');
    //                     $desconPorcentagem.val('0,00%').blur();
    //                     return;
    //                 }
    //             }
            
    //             if( $custo.val() != '' && $custo.val() != undefined && $subtotal.val() != '' && $subtotal.val() != undefined && $desconPorcentagem.val() != undefined && $desconPorcentagem.val() != '' ){

    //                 precoaux = parseFloat( parseFloat( parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) * parseFloat( parseFloat(1) - parseFloat( parseFloat( floatParaPadraoInternacional( $desconPorcentagem.val() ) ) / parseFloat( 100 ) ) ) ).toFixed(2) );
    //                 custoaux = parseFloat( parseFloat( floatParaPadraoInternacional( $custo.val() ) ).toFixed(2) );

    //                 if( precoaux < custoaux ){
    //                     alert( 'O desconto dado faz o valor final ser menor do que custo total.' );
    //                     $desconPorcentagem.val('0,00%').blur();
    //                     return;
    //                 }else if( precoaux == custoaux ){
    //                     alert( 'O desconto dado faz o valor final ser igual custo total.' );
    //                     $desconPorcentagem.val('0,00%').blur();
    //                     return;
    //                 }else{
    //                     descaux =  parseFloat( parseFloat( parseFloat( floatParaPadraoInternacional( $desconPorcentagem.val() ) ) / parseFloat(100) ) * parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) ).toFixed(2);
    //                     $desconto.val( floatParaPadraoBrasileiro( descaux ) );
    //                     $valorFinal.val( floatParaPadraoBrasileiro( precoaux ) );
    //                 }
    //             }
    //         }

    //     }else if(estadoAbsoluto){
    //         var $custo   = $("#custo_total");
    //         var $subtotal = $("#subtotal");
    //         var subtotal = floatParaPadraoInternacional($("#subtotal").val());
    //         var $desconPorcentagem = $("#desconto_porcent");
    //         var $desconto = $("#desconto");
    //         var $valorFinal = $("#valor_final");

    //         var desc_max, precoaux, custoaux, descaux;
      
    //         desc_max = parseFloat( $desconto.attr('data-desconto_maximo'));

    //         if($desconto.val() == ''){
    //             $desconto.val('0,00').blur();
    //         }

    //         if( desc_max != undefined && desc_max != '' ){
                
    //             if( $desconto.val() != undefined && $desconto.val() != ''){
    //                 if( parseFloat( floatParaPadraoInternacional( $desconto.val() ) ) > desc_max ){
    //                     alert('O valor máximo de desconto é ' + floatParaPadraoBrasileiro(desc_max));
    //                     $desconto.val('0,00').blur();
    //                     return;
    //                 }
    //             }
            
    //             if( $custo.val() != '' && $custo.val() != undefined && $subtotal.val() != '' && $subtotal.val() != undefined && $desconto.val() != undefined && $desconto.val() != '' ){

    //                 precoaux = parseFloat( parseFloat( parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) - parseFloat( parseFloat( floatParaPadraoInternacional( $desconto.val() ) ) ) ).toFixed(2) );
    //                 custoaux = parseFloat( parseFloat( floatParaPadraoInternacional( $custo.val() ) ).toFixed(2) );

    //                 if( precoaux < custoaux ){
    //                     alert( 'O desconto dado faz o valor final ser menor do que custo total.' );
    //                     $desconto.val('0,00').blur();
    //                     return;
    //                 }else if( precoaux == custoaux ){
    //                     alert( 'O desconto dado faz o valor final ser igual custo total.' );
    //                     $desconto.val('0,00').blur();
    //                     return;
    //                 }else{
    //                     descaux =  parseFloat(parseFloat(100) - parseFloat(parseFloat(parseFloat(precoaux) / parseFloat(subtotal)) * parseFloat(100))).toFixed(2);  
                        
    //                     $desconPorcentagem.val( floatParaPadraoBrasileiro( descaux ) + '%' );
                        
    //                     $valorFinal.val( floatParaPadraoBrasileiro( precoaux ) );
    //                 }
    //             }
    //         }

    //     }
    // });


    // SALVAR AS EDIÇÕES DA OS
    $('#form-principal').on('submit', function(e){
        if( $(this)[0].checkValidity() == true && confirm('Tem Certeza?') ==  true) {
            $(this).find('input, select, textarea').removeAttr('disabled');
            if( $('#presenca_rev1').attr('data-anterior') == 'SIM' &&
                $('#presenca_rev2').attr('data-anterior') == 'SIM' &&
                $('#presenca_rev3').val() == 'SIM'
            ){
                $('#garantia_vitalicia').val('Garantia Vitalícia');
            }
        }else{
            e.preventDefault();
            e.stopPropagation();
            $(this).find('.is-invalid, :invalid').first().focus();
            // return false;
            return;
        }    
    });

});

function dataAtual() {
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

function proximoDiaUtil(dataInicio, distdias) {

    if (dataInicio) {
        if (distdias != 0) {
            var dtaux = dataInicio.split("/");
            var dtvenc = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);

            //soma a quantidade de dias para o recebimento/pagamento
            dtvenc.setDate(dtvenc.getDate() + distdias);

            //verifica se a data final cai no final de semana, se sim, coloca para o primeiro dia útil seguinte
            if (dtvenc.getDay() == 6) {
                dtvenc.setDate(dtvenc.getDate() + 2);
            }
            if (dtvenc.getDay() == 0) {
                dtvenc.setDate(dtvenc.getDate() + 1);
            }

            //monta a data no padrao brasileiro
            var dia = dtvenc.getDate();
            var mes = dtvenc.getMonth() + 1;
            var ano = dtvenc.getFullYear();
            if (dia.toString().length == 1) {
                dia = "0" + dtvenc.getDate();
            }
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            dtvenc = dia + "/" + mes + "/" + ano;
            return dtvenc;
        } else {
            return dataInicio;
        }
    } else {
        return false;
    }
}

function floatParaPadraoBrasileiro(valor) {
    var valortotal = valor;
    valortotal = number_format(valortotal, 2, ',', '.');
    return valortotal;
}

function floatParaPadraoInternacional(valor) {

    var valortotal = valor;
    valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    valortotal = valortotal.replace(",", ".");
    valortotal = parseFloat(valortotal).toFixed(2);
    return valortotal;
}

function number_format(numero, decimal, decimal_separador, milhar_separador) {
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

function receitaOK() {
    var resposta = false;
    var valor_os = $('#valor_os').text();
        valor_os = parseFloat( floatParaPadraoInternacional( valor_os ) );

    if ( $('table.table.table-striped.table-hover tbody tr').length > 0 ) {
        var receita = 0;
        var recaux = 0;
        var mov = "";

        $("table.table.table-striped.table-hover tbody tr").each(function () {
            mov = "";
            recaux = 0;
            mov = $(this).closest('tr').children('td:eq(1)').children('input:eq(0)').attr('value');
            
            if (mov == "Receita") {
               
                recaux = $(this).closest('tr').children('td:eq(5)').children('input:eq(0)').val();
                recaux = floatParaPadraoInternacional(recaux);
                recaux = parseFloat(recaux);
                receita = parseFloat( parseFloat( receita ) + parseFloat( recaux )) ;

            }

        });

        receita = parseFloat( parseFloat(receita).toFixed(2) );

        if( parseFloat( receita ) == parseFloat( valor_os) ){
            resposta = true;
        }else{
            resposta  = false;
        }

        return resposta;
    } 
}

function maiorData(data1, data2){
    if(data1 != '' && data1 != undefined && data2 != '' && data2 != undefined){
        var dt1aux, dt2aux;
        dt1aux = data1.split('/');
        dt1aux = parseInt( dt1aux[2]+dt1aux[1]+dt1aux[0] );
        
        dt2aux = data2.split('/');
        dt2aux = parseInt( dt2aux[2]+dt2aux[1]+dt2aux[0] );

        if( dt1aux > dt2aux ){
            return data1;
        }else if( dt1aux < dt2aux ){
            return data2;
        }else{
            return 'iguais';
        }
    }else{
        return 'erro';
    }
}