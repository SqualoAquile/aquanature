$(function () {
    console.log('entrei aquiii')
    var $cpf_cnpj = $('[name=cpf_cnpj]');

    //
    // Escuta o clique dos radios CPF/CPNJ pra mostra e esconder os inputs de CPF/CNPJ
    //
    $('[name=tipo_pessoa]')
        .change(function () {
            if ($(this).is(':checked')) {

                var $input = $('[name=cpf_cnpj]'),
                    $contatosForm = $('#contatos-form'),
                    $hiddenContatos = $('[name=contatos]'),
                    $nome = $('[name=nome]'),
                    $dtNascimento = $('[name=data_nascimento]'),
                    $razaoSocial = $('[name=razao_social]');
                    $telefone = $('[name=telefone]');
                    $celular = $('[name=celular]');
                
                $input.removeClass('is-valid is-invalid');

                $input.siblings('.invalid-feedback').remove();
                
                $input[0].setCustomValidity('');

                if ($(this).attr('value') == 'pj') {

                    $input
                        .mask('00.000.000/0000-00')
                        .siblings('label')
                        .find('span')
                        .text('CNPJ');

                    // Telefone é obrigatório para PJ, celular não
                    $telefone
                        .attr('required', 'required')
                        .siblings('label')
                        .addClass('font-weight-bold')
                        .find('i')
                        .show();

                    $celular
                        .removeAttr('required')
                        .siblings('label')
                        .removeClass('font-weight-bold')
                        .find('i')
                        .hide();

                    $contatosForm.show();
                    $hiddenContatos.val($hiddenContatos.attr('data-anterior'));

                    $nome
                        .siblings('label')
                        .find('span')
                        .text('Nome Fantasia');

                    $razaoSocial
                        .parents('[class^=col-]')
                        .show();

                    $dtNascimento
                        .parents('[class^=col-]')
                        .show();

                } else {
                    
                    $input
                        .mask('000.000.000-00')
                        .siblings('label')
                        .find('span')
                        .text('CPF');
                    
                    $telefone
                        .removeAttr('required')
                        .siblings('label')
                        .removeClass('font-weight-bold')
                        .find('i')
                        .hide();
                        

                    // Celular é obrigatório para PF, telefone não
                    $celular
                        .attr('required', 'required')
                        .siblings('label')  
                        .addClass('font-weight-bold')
                        .find('i')
                        .show();             

                    $contatosForm.hide();
                    $contatosForm[0].reset();

                    $contatosForm
                        .find('.disabled')
                        .removeClass('disabled')

                    $('table#contatos thead tr[role=form]')
                        .removeAttr('data-current-id')
                        .find('[data-anterior]')
                        .removeAttr('data-anterior');

                    $hiddenContatos.val('');

                    $nome
                        .siblings('label')
                        .find('span')
                        .text('Nome');

                    $razaoSocial
                        .parents('[class^=col-]')
                        .hide();

                    $dtNascimento
                        .parents('[class^=col-]')
                        .show();

                }
            }
        })
        .change();

    $cpf_cnpj
        .on('blur checar', function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();
            // $this[0].setCustomValidity('');

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {

                    if ($('[name=tipo_pessoa]:checked').val() == 'pj') {
                        // Cnpj
                        if ($this.validationLength(18)) {
                            // Valido
                            if ($this.attr('data-unico')) {

                                $this.unico(function (json) {

                                    $this.removeClass('is-valid is-invalid');
                                    $this.siblings('.invalid-feedback').remove();
                                    $this[0].setCustomValidity('');

                                    if (json.length) {

                                        // Já existe, erro

                                        $this.addClass('is-invalid');

                                        $this[0].setCustomValidity('invalid');

                                        $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');

                                    } else {

                                        $this.addClass('is-valid');

                                        $this[0].setCustomValidity('');

                                    }

                                });

                            } else {

                                $this.addClass('is-valid');

                                $this[0].setCustomValidity('');

                            }
                        } else {
                            // Inválido
                            $this.addClass('is-invalid');

                            $this[0].setCustomValidity('invalid');

                            $this.after('<div class="invalid-feedback">Preencha o campo no formato: 00.000.000/0000-00</div>');
                        }
                    } else {
                        // Cpf
                        if ($this.validationLength(14)) {
                            // Valido
                            if ($this.attr('data-unico')) {
                                $this.unico(function (json) {

                                    $this.removeClass('is-valid is-invalid');
                                    $this.siblings('.invalid-feedback').remove();
                                    $this[0].setCustomValidity('');

                                    if (json.length) {

                                        // Já existe, erro

                                        $this.addClass('is-invalid');

                                        $this[0].setCustomValidity('invalid');
                                        
                                        $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');

                                    } else {

                                        $this.addClass('is-valid');

                                        $this[0].setCustomValidity('');

                                    }

                                });
                            } else {

                                $this.addClass('is-valid');

                                $this[0].setCustomValidity('');

                            }
                        } else {

                            // Inválido

                            $this.addClass('is-invalid');

                            $this[0].setCustomValidity('invalid');

                            $this.after('<div class="invalid-feedback">Preencha o campo no formato: 000.000.000-00</div>');

                        }
                    }
                }
            }
        })
        .on('keyup', function () {
            if ($('[name=tipo_pessoa]:checked').val() == 'pj') {
                if ($(this).val().length >= 18) {
                    $(this).trigger('checar');
                }
            } else {
                if ($(this).val().length >= 14) {
                    $(this).trigger('checar');
                }
            }
        });
});