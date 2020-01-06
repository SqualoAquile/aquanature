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

$(function () {

    var $collapse = $('#collapseFluxocaixaResumo'),
        $cardBodyFiltros = $('#card-body-filtros'),
        dataTable = window.dataTable,
        indexColumns = {
            acoes: 0,
            movimentacoes: 1,
            data_operacao: 4,
            valor_total: 5,
            data_vencimento: 6,
            status: 15,
            observacao: 20
        },
        $checados,
        $aQuiatares;

    function resumo () {
        
        var rowData = dataTable.rows({selected: true}).data(),
            somasDespesas = 0,
            somasReceitas = 0;

        $checados.each(function (index) {
            if (rowData[index][indexColumns.movimentacoes].toLowerCase() == 'despesa') {
                
                var despesa = $(this).parents('tr').find('td:eq(' + indexColumns.valor_total + ')').text();

                despesa = despesa.replace('R$  ', '');

                despesa = floatParaPadraoInternacional(despesa);

                somasDespesas += parseFloat(despesa);
            }
        });

        $('#despesasTotal').text(floatParaPadraoBrasileiro(somasDespesas));

        $checados.each(function (index) {
            if (rowData[index][indexColumns.movimentacoes].toLowerCase() == 'receita') {
                
                var receita = $(this).parents('tr').find('td:eq(' + indexColumns.valor_total + ')').text();

                receita = receita.replace('R$  ', '');

                receita = floatParaPadraoInternacional(receita);

                somasReceitas += parseFloat(receita);
            }
        });

        $('#receitasTotal').text(floatParaPadraoBrasileiro(somasReceitas));

        $('#itensSelecionados').text($checados.length);
    }

    function aQuitar () {

        var rowData = dataTable.rows({selected: true}).data(),
            $quitar = $('.col-data-quitacao, .col-btn-quitar');

        $aQuiatares = $checados.filter(function () {
            var indexTrChecado = $(this).parents('tr').index();
            return rowData[indexTrChecado][indexColumns.status].toLowerCase() == 'a quitar';
        });

        if ($aQuiatares.length) {
            
            $quitar.show();
            $quitar.find('span.lengthQuitar').text($aQuiatares.length);

        } else {
            $quitar.hide();
        }
    }

    $('.select-all')
        .click(function () {

            var $this = $(this),
                $table = $this.parents('.dataTables_wrapper');

            $table.find('[type=checkbox]').prop('checked', $this.prop('checked'));
        });

    $(this)
        .on('blur', '[name=data_quitacao]', function () {
            
            var $this = $(this),
                value = $this.val();

            $this
                .removeClass('is-invalid is-valid')
                .siblings('.invalid-feedback').remove();

            if (value) {

                if (validaDat(value)) {
                    
                    $this
                        .addClass('is-valid')
                        .removeClass('is-invalid');

                    $this[0].setCustomValidity('');
                    

                } else {

                    $this
                        .addClass('is-invalid')
                        .removeClass('is-valid');

                    $this[0].setCustomValidity('invalid');

                    $this.after('<div class="invalid-feedback">Data inválida!</div>');

                }
            }
        })
        .on('click', '#quitar', function () {

            // Enviar ajax com a quitares para quita-los

            var arrayQuitares = [],
                $dataQuitacao = $('[name=data_quitacao]'),
                data_quitacao = $dataQuitacao.val();

            $aQuiatares.each(function () {
                arrayQuitares.push($(this).val());
            });

            if ($dataQuitacao[0].checkValidity()) {

                if (arrayQuitares.length) {

                    if (confirm('Tem Certeza?')) {
                        
                        $.ajax({
                            url: baselink + '/fluxocaixa/quitar',
                            type: 'POST',
                            data: {
                                data_quitacao: data_quitacao,
                                aquitares: arrayQuitares
                            },
                            dataType: 'json',
                            success: function (data) {
        
                                if (data[0] == '00000') {
                                    
                                    Toast({
                                        message: 'Lançamentos quitados com sucesso!',
                                        class: 'alert-success'
                                    });

                                    // Limpar campo de data_quitacao
                                    $dataQuitacao.val('');
                                    
                                    // Atualizar dataTable
                                    // Deschecar todos os checkbox
                                    dataTable.ajax.reload();

                                    // Fechar collpase de resumo
                                    $collapse.collapse('hide');
                                }
                            }
                        });

                    }
                }
            } else {
                $dataQuitacao
                    .blur()
                    .focus();
            }
        })
        .on('click', '#excluir', function () {

            var arrayChecados = [];

            $checados.each(function () {
                arrayChecados.push($(this).val());
            });

            if (arrayChecados.length) {

                if (confirm('Tem Certeza?')) {

                    $.ajax({
                        url: baselink + '/fluxocaixa/excluirChecados',
                        type: 'POST',
                        data: {
                            checados: arrayChecados
                        },
                        dataType: 'json',
                        success: function (data) {
    
                            if (data[0] == '00000') {
                                
                                Toast({
                                    message: 'Lançamentos excluidos com sucesso!',
                                    class: 'alert-success'
                                });
    
                                $cardBodyFiltros.trigger('reset');
                                $('.collapse').collapse('hide');
                                dataTable.ajax.reload();
                            }
                        }
                    });

                }
            }
        })
        .on('click', '#editar', function () {
            
            var $this = $(this),
                $table = $this.parents('table'),
                $thead = $table.find('thead'),
                $tr = $this.parents('tr'),
                $valorTotal = $tr.find('td:eq(' + indexColumns.valor_total + ')'),
                valorTotalText = $valorTotal.text().replace('R$  ', ''),
                $dataVencimento = $tr.find('td:eq(' + indexColumns.data_vencimento + ')'),
                $observacao = $tr.find('td:eq(' + indexColumns.observacao + ')');

            $valorTotal
                .html('<input type="text" data-placeholder="' + $thead.find('th:eq(' + indexColumns.valor_total + ')').text().trim() + '" data-anterior="' + valorTotalText + '" value="' + valorTotalText + '" class="form-control" data-mascara_validacao="monetario">');
            
            $('[data-mascara_validacao="monetario"]')
                .mask('#.##0,00', {
                    reverse: true
                });

            $dataVencimento
                .html('<input type="text" data-placeholder="' + $thead.find('th:eq(' + indexColumns.data_vencimento + ')').text().trim() + '" data-anterior="' + $dataVencimento.text() + '" data-mascara_validacao="data" value="' + $dataVencimento.text() + '" class="form-control">');

            $('[data-mascara_validacao="data"]')
                .mask('00/00/0000')
                .datepicker();

            $observacao
                .html('<textarea data-placeholder="' + $thead.find('th:eq(' + indexColumns.observacao + ')').text().trim() + '" data-anterior="' + $observacao.text() + '" class="form-control">' + $observacao.text() + '</textarea>');

            $tr.find('.form-control').first().focus();

            $this
                .removeClass('btn-primary')
                .addClass('btn-success')
                .attr('id', 'salvar')
                .find('.fas')
                .removeClass('fa-edit')
                .addClass('fa-save');
        })
        .on('click', '#salvar', function () {

            var $this = $(this),
                $tr = $this.parents('tr'),
                $valorTotal = $tr.find('td:eq(' + indexColumns.valor_total + ')'),
                $dataVencimento = $tr.find('td:eq(' + indexColumns.data_vencimento + ')'),
                $observacao = $tr.find('td:eq(' + indexColumns.observacao + ')'),
                alteracao = '';

            $tr.find('.form-control').each(function () {
                if ($(this).val() != $(this).attr('data-anterior')) {
                    alteracao += '{' + $(this).attr('data-placeholder').toUpperCase() + ' de (' + $(this).attr('data-anterior') + ') para (' + $(this).val() + ')}';
                }
            });
            if(alteracao != ''){
                $.ajax({
                    url: baselink + '/fluxocaixa/inlineEdit',
                    type: 'POST',
                    data: {
                        id: $this.attr('data-id'),
                        valor_total: $valorTotal.find('input').val(),
                        data_vencimento: $dataVencimento.find('input').val(),
                        observacao: $observacao.find('textarea').val(),
                        alteracoes: '##' + alteracao
                    },
                    dataType: 'json',
                    success: function (data) {
    
                        if (data[0] == '00000') {
                            
                            Toast({
                                message: 'Lançamento editado com sucesso!',
                                class: 'alert-success'
                            });
    
                            dataTable.ajax.reload();
    
                        }
    
                        $cardBodyFiltros.trigger('reset');
                    }
                });
            }else{
                dataTable.ajax.reload();
                alert('Não ocorreram alterações nesse lançamento.');
            }
           
        })
        .on('change', '.dataTables_wrapper [type=checkbox]', function () {

            var $this = $(this),
                $pai = $this.parents('.dataTables_wrapper'),
                $allChecados = $pai.find('[type=checkbox]:checked'),
                $tbodyChecados = $allChecados.parents('tbody'),
                $trChecados = $tbodyChecados.find('tr');

            $checados = $trChecados.find('[type=checkbox]:checked');

            if ($tbodyChecados.length) {

                aQuitar();
                resumo();
                $collapse.collapse('show');
                $trChecados.addClass('selected');

                $('.select-all').prop('checked', !($tbodyChecados.find('[type=checkbox]').length != $tbodyChecados.find('[type=checkbox]:checked').length));

            } else {
                $collapse.collapse('hide');
                $trChecados.removeClass('selected');
            }
        });

    $collapse
        .on('shown.bs.collapse', function () {
            $(this)
                .find('[data-provide="datepicker"]')
                .mask('00/00/0000');
        });

    dataTable
        .on('draw', function () {
            $('.dataTables_wrapper table [type="checkbox"]')
                .prop('checked', false)
                .change();
        });

    $(this)
        .on('blur', '[data-mascara_validacao="monetario"], textarea', function () {
            
            var $this = $(this);

            if (!$this.val()) {
                if (!$this[0].checkValidity()) {
                    $this.val($this.attr('data-anterior'));
                }
            }
        })
        .on('blur change', '[data-mascara_validacao="data"]', function () {

            var $this = $(this),
                valor = $this.val()
                anterior = $this.attr('data-anterior');
            
            if (valor != '') {
            
                dtop = $this.closest('tr').children('td:eq(' + indexColumns.data_operacao + ')').text();
                dtop = dtop.split('/')[2] + dtop.split('/')[1] + dtop.split('/')[0];
                dtop = parseInt(dtop);

                dtatual = valor;
                dtatual = dtatual.split('/')[2] + dtatual.split('/')[1] + dtatual.split('/')[0];
                dtatual = parseInt(dtatual);

                valor = valor.split('/');
                var data = valor[0] + '/' + valor[1] + '/' + valor[2];
            
                if ($this.attr('data-anterior') != valor) {

                    if (
                        (typeof valor[1] == 'undefined' || typeof valor[2] == 'undefined') ||
                        (valor[2].length > 4 || valor[0].length > 2 || valor[1].length > 2) ||
                        (validaDat(data) == false)
                    ) {
                        // Inválido
                        $this.val(anterior);
                            
                    } else {
                        // Valido
                        if(dtatual <= dtop){
                            $this.val(anterior);  
                        }else{
                            $this.val(data);  
                        }                            
                    }
                }
            }else{
                // Inválido
                $this.val(anterior);
            }
            
        });
});