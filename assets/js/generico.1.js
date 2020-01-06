$(function () {

    //
    // Escuta o clique dos radios CPF/CPNJ pra mostra e esconder os inputs de CPF/CNPJ
    //
    $('[name=tipo_pessoa]').change(function () {
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

            if ($input.attr('data-anterior-aux') == undefined) {
                $input.attr('data-anterior-aux', $input.val());
            } else {
                $input
                    .val($input.attr('data-anterior-aux'))
                    .change();
            }

            if ($(this).attr('id') == 'pj') {

                $input
                    .mask('00.000.000/0000-00')
                    .siblings('label')
                    .find('span')
                    .text('CNPJ');

                    // Telefone é obrigatório para PJ, celular não
                $telefone
                    .attr('required');
                $telefone
                    .siblings('label')
                    .addClass('font-weight-bold')
                    .find('i')
                    .show();

                $celular
                    .removeAttr('required');
                $celular
                    .siblings('label')
                    .removeClass('font-weight-bold')
                    .find('i')
                    .hide();

                var dadosAnteriores = '';
                if ($hiddenContatos.attr('data-anterior-aux') != undefined) {
                    dadosAnteriores = $hiddenContatos.attr('data-anterior-aux');
                } else {
                    dadosAnteriores = $hiddenContatos.attr('data-anterior');
                }

                $contatosForm.show();
                $hiddenContatos.val(dadosAnteriores);

                $nome
                    .siblings('label')
                    .find('span')
                    .text('Nome Fantasia');

                $razaoSocial
                    .parents('[class^=col-]')
                    .show();

                $dtNascimento
                    .parents('[class^=col-]')
                    .hide();

                } else {
                    
                    $input
                        .mask('000.000.000-00')
                        .siblings('label')
                        .find('span')
                        .text('CPF');
                    
                    $telefone
                        .removeAttr('required')

                    $telefone
                        .siblings('label')
                        .removeClass('font-weight-bold')
                        .find('i')
                        .hide();
                        

                    // Celular é obrigatório para PF, telefone não
                    $celular
                        .attr('required');
                    $celular
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
    }).change();

    var $cpf_cnpj = $('[name=cpf_cnpj]');

    $cpf_cnpj
        .blur(function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($('[name=tipo_pessoa]:checked').val() == 'pj') {
                        // Cnpj
                        if ($this.validationLength(18)) {
                            // Valido
                            if ($this.attr('data-unico')) {
                                $this.unico(function (json) {
                                    if (!json.length) {

                                        // Não existe, pode seguir
                                        $this
                                            .removeClass('is-invalid')
                                            .addClass('is-valid');

                                        $this[0].setCustomValidity('');

                                    } else {

                                        // Já existe, erro
                                        var text_label = $this.siblings('label').find('span').text();

                                        $this
                                            .removeClass('is-valid')
                                            .addClass('is-invalid');

                                        $this[0].setCustomValidity('invalid');

                                        $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');
                                    }
                                });
                            } else {
                                $this
                                    .removeClass('is-invalid')
                                    .addClass('is-valid');

                                $this[0].setCustomValidity('');
                            }
                        } else {
                            // Inválido
                            $this
                                .removeClass('is-valid')
                                .addClass('is-invalid');

                            $this[0].setCustomValidity('invalid');

                            $this.after('<div class="invalid-feedback">Preencha o campo no formato: 00.000.000/0000-00</div>');
                        }
                    } else {
                        // Cpf
                        if ($this.validationLength(14)) {
                            // Valido
                            if ($this.attr('data-unico')) {
                                $this.unico(function (json) {
                                    if (!json.length) {

                                        // Não existe, pode seguir
                                        $this
                                            .removeClass('is-invalid')
                                            .addClass('is-valid');

                                        $this[0].setCustomValidity('');

                                    } else {

                                        // Já existe, erro
                                        var text_label = $this.siblings('label').find('span').text();

                                        $this
                                            .removeClass('is-valid')
                                            .addClass('is-invalid');

                                        $this[0].setCustomValidity('invalid');

                                        $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');
                                    }
                                });
                            } else {
                                $this
                                    .removeClass('is-invalid')
                                    .addClass('is-valid');

                                $this[0].setCustomValidity('');
                            }
                        } else {
                            // Inválido
                            $this
                                .removeClass('is-valid')
                                .addClass('is-invalid');

                            $this[0].setCustomValidity('invalid');

                            $this.after('<div class="invalid-feedback">Preencha o campo no formato: 000.000.000-00</div>');
                        }
                    }
                }
            }
        });

    $cpf_cnpj.addClass('has-validation');
});