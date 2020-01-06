$(function () {

    function temAlteracao() {
        
        var returnBool = false;

        $('[type=checkbox]').each(function() {
            if (!!$(this).attr('data-anterior') != $(this).prop('checked')) {
                returnBool = true;
            }
        });

        $('[type=text]').each(function() {
            if ($(this).attr('data-anterior') != $(this).val()) {
                returnBool = true;
            }
        });

        return returnBool;
    }

    function temBandeirasSelecionadas() {

        var $checkboxFirst = $('[type=checkbox]').first();

        if (!$('[type=checkbox]:checked').length) {

            $checkboxFirst[0].setCustomValidity('invalid');

        } else {
            $checkboxFirst[0].setCustomValidity('');
        }
    }

    function desabilitaBotao() {

        temBandeirasSelecionadas();

        if (temAlteracao()) {
            if ($('form')[0].checkValidity()) {
                $('[type=submit]').removeAttr('disabled');
            } else {
                $('[type=submit]').attr('disabled', 'disabled');
            }
        }
    }

    function checkboxs() {

        $('[type=checkbox]').each(function () {
                    
            var $this = $(this),
                textPermissao = $this.attr('id');
    
            textPermissaoSplit = textPermissao.split('_');
    
            var nome = textPermissaoSplit[0],
                permissao = textPermissaoSplit[1],
                $brothers = $('[type=checkbox][id^=' + nome + '_]:not(#' + textPermissao + '):not(#fluxocaixa_add)');
                
            if (permissao == 'ver') {
    
                if ($this.is(':checked')) {
                    $brothers.removeAttr('disabled');
                } else {
                    $brothers.attr('disabled', 'disabled');
                    $brothers.prop('checked', false);
                }
            }
        });
    }

    $(this)
        .ready(function () {
            checkboxs();
            desabilitaBotao();
        })
        .on('change', '[name=nome]', function () {
            desabilitaBotao();
        })
        .on('change', '[type=checkbox]', function () {
            checkboxs();
            desabilitaBotao();
        })
        .on('click', '[type=submit]', function () {

            if (!$('[type=checkbox]:checked').length) {

                if ($('#nome').val()) {
                    
                    alert('É necessário ter ao menos uma permissão selecionada!');
                }

            }
        })
        .on('submit', 'form', function (event) {

            if (!this.checkValidity()) {

                $(this).find('.is-invalid, :invalid').first().focus();

                event.preventDefault();
                
            } else {

                var $alteracoes = $('[name=alteracoes]');
    
                if ($alteracoes.val() != '') {
    
                    var campos_alterados = '';
                    $('[type=checkbox]').each(function () {
    
                        var $this = $(this),
                            text_label = $this.siblings('label').text();
    
                        if (!!$this.attr('data-anterior') != $this.prop('checked')) {
                            
                            var dataAnterior = $this.attr('data-anterior') == 'true' ? 'Tem Permissão' : 'Não Tem Permissão',
                                valorAtual = $this.prop('checked') ? 'Tem Permissão' : 'Não Tem Permissão';
    
                            campos_alterados += '{' + text_label.toUpperCase() + ' de (' + dataAnterior + ') para (' + valorAtual + ')}';
                        }
                    });
    
                    $('[type=text]').each(function () {
    
                        var $this = $(this),
                            text_label = $this.siblings('label').find('span').text(),
                            dataAnterior = $this.attr('data-anterior'),
                            valorAtual = $this.val();
    
                        if (dataAnterior != valorAtual) {
                            campos_alterados += '{' + text_label.toUpperCase() + ' de (' + dataAnterior + ') para (' + valorAtual + ')}';
                        }
                    });
    
                    if (campos_alterados != '') {

                        $alteracoes.val($alteracoes.val() + '##' + campos_alterados);

                    }
                }

                if (!confirm('Tem certeza?')) {
                    event.preventDefault();
                }
    
            }
            
            this.classList.add('was-validated');

        });;
});