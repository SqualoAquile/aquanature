//
// Validação de Datas
//
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

$(function () {
    
    //
    // Campos Únicos
    //
    $.fn.unico = function (callback) {

        var $input = $(this),
            campo = $input.attr('name');

        $.ajax({
            url: baselink + '/ajax/buscaUnico',
            type: 'POST',
            data: {
                module: currentModule,
                campo: campo,
                valor: $input.val()
            },
            dataType: 'json',
            success: callback
        });
    }, 500;

    //
    // Validação Padrão de Email
    //
    $.fn.validaEmail = function () {

        var email = $(this).val();

        // Retirar espacos em branco do inicio e do final
        email = email.trim();

        if (email.indexOf('@') == -1 || (email.indexOf('@') >= email.lastIndexOf('.')) || (email.lastIndexOf('.') + 1 >= email.length)) {
            // Inválido
            return false;
        } else {
            // Válido
            return true;
        }
    };

    //
    // Validação com limite minimo de caracteres
    //
    $.fn.validationLength = function (length) {
        return $(this).val().length == length;
    };

    function habilitaBotao($campos) {

        var temAlteracao = false;

        $campos.each(function (i, el) {

            var $this = $(el);

            if ($this.attr('type') == 'radio') {
                $this = $this.parent().siblings().find(':checked');
            }

            var valorAtual = $this.val(),
                dataAnterior = $this.attr('data-anterior');

            valorAtual = String(valorAtual).trim().toUpperCase();
            dataAnterior = String(dataAnterior).trim().toUpperCase();


            if (dataAnterior != valorAtual) {
                temAlteracao = true;
            }

        });

        if (temAlteracao) {
            $('#main-form').removeAttr('disabled');
            $('label[for=main-form]').removeClass('disabled');
        } else {
            $('#main-form').attr('disabled', 'disabled');
            $('label[for=main-form]').addClass('disabled');
        }
    };


    // 
    // CONFIGURAÇÕES DO DATATABLE
    //
    if ( campoPesquisa != '' && campoPesquisa != undefined  && valorPesquisa != '' && valorPesquisa != undefined ){
        campoPesq = campoPesquisa;
        valorPesq = valorPesquisa;
    }else{
        campoPesq = '';
        valorPesq = '';
    }
    var dataTable = $('.dataTable').DataTable(
        {
            scrollX: true,
            responsive: true,
            processing: true,
            serverSide: true,
            autoWidth: false,
            scrollCollapse: true,
            searchHighlight: true,
            conditionalPaging: true,
            aLengthMenu: [
                [10, 25, 50, -1],
                [10, 25, 50, "Mostrar Todos"]
            ],
            order: [0, 'desc'],
            ajax: {
                url: baselink + '/ajax/dataTableAjax',
                type: 'POST',
                data: {
                    module: currentModule,
                    campoPesq: campoPesq,
                    valorPesq: valorPesq,
                }
            },
            language: {
                'decimal': ',',
                'thousands': '.',
                'sEmptyTable': 'Nenhum registro encontrado',
                'sInfo': 'Mostrando de _START_ até _END_ do total de _TOTAL_ registros',
                'sInfoEmpty': 'Mostrando 0 até 0 do total de 0 registros',
                'sInfoFiltered': '(Filtrados de _MAX_ registros)',
                'sInfoPostFix': '',
                'sInfoThousands': '.',
                'sLengthMenu': '_MENU_ Resultados por página',
                'sLoadingRecords': 'Carregando...',
                'sProcessing': 'Processando...',
                'sZeroRecords': 'Nenhum registro encontrado',
                'oPaginate': {
                    'sNext': 'Próximo',
                    'sPrevious': 'Anterior',
                    'sFirst': 'Primeiro',
                    'sLast': 'Último'
                }
            },
            dom: '<"limit-header-browser"l><t><p><r><i>'
        }
    );

    window.dataTable = dataTable;

    $('[name=searchDataTable]').on('keyup', function() {
        dataTable.search(this.value).draw();

        var searchValue = $(this).val();

        $('.contatos-filtrados').each(function () {
            var $display = $(this).find('span');
            $(this).find('.contatos-escondidos:contains("' + searchValue + '")').each(function () {
                var $filtered = $(this),
                    textFiltered = $filtered.text(),
                    textDisplay = $display.text();

                $display.text(textFiltered);
                $filtered.text(textDisplay);
            });
        });

        var body = $(dataTable.table().body());

        body.unhighlight();
        body.highlight(searchValue);


    }, 500);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///                                                                     
    ///     MÁSCARAS E VALIDAÇÕES DOS CAMPOS DO FORMULÁRIO
    ///
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //
    // Sem Mascara
    //
    $('[data-mascara_validacao="false"]')
        .on('blur touchstart keyup', function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.attr('data-unico')) {
                        $this.unico(function (json) {
                            if (!json.length) {
                                // Não existe, pode seguir

                                if (!$this.hasClass('is-invalid')) {

                                    $this
                                        .removeClass('is-invalid')
                                        .addClass('is-valid');

                                    $this[0].setCustomValidity('');

                                }

                            } else {
                                // Já existe, erro

                                var text_label = $this.siblings('label').find('span').text();

                                $this
                                    .removeClass('is-valid')
                                    .addClass('is-invalid');

                                $this[0].setCustomValidity('invalid');

                                $this.siblings('.invalid-feedback').remove();
                                $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');
                            }
                        });
                    } else {
                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    }
                }
            }
        })

    //
    // Campo Nome
    //
    $('[data-mascara_validacao="nome"]')
        .on('blur touchstart keyup', function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
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
                }
            }
        });


    //
    // Campo RG
    //
    $('[data-mascara_validacao="rg"]')
        .mask('0000000000')
        .on('blur touchstart keyup', function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(10)) {
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

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 0000000000</div>');
                    }
                }
            }
        });

    //
    // Campo CPF
    //
    $('[data-mascara_validacao="cpf"]')
        .mask('000.000.000-00')
        .on('blur touchstart keyup', function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
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
                                    // Já existe: erro

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
        });


    //
    // Campo CNPJ
    //
    $('[data-mascara_validacao="cnpj"]')
        .mask('00.000.000/0000-00')
        .on('blur touchstart keyup', function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
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
                }
            }
        });

    //
    // Campo Telefone
    //
    $('[data-mascara_validacao="telefone"]')
        .mask('(00)0000-0000')
        .on('blur touchstart', function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(13)) {
                        // Valido
                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    } else {
                        // Inválido
                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        // Função nativa javascript para setar campo com :valid :invalid
                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: (00)0000-0000</div>');
                    }
                }
            }
        });

    //
    // Campo Celular
    //
    $('[data-mascara_validacao="celular"]')
        .mask('(00)00000-0000')
        .on('blur touchstart', function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(14)) {
                        // Valido
                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    } else {
                        // Inválido
                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: (00)00000-0000</div>');
                    }
                }
            }
        });

    //
    // Campo Data
    //
    $('[data-mascara_validacao="data"]')
        .mask('00/00/0000')
        .datepicker();

    $(this)
        .on('change', '[data-mascara_validacao="data"]', function () {
            var $this = $(this),
                valor = $this.val();

            valor = valor.split('/');
            var data = valor[0] + '/' + valor[1] + '/' + valor[2];

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if (valor != '') {
                if ($this.attr('data-anterior') != $this.val()) {
                    if (
                        (typeof valor[1] == 'undefined' || typeof valor[2] == 'undefined') ||
                        (valor[2].length > 4 || valor[0].length > 2 || valor[1].length > 2) ||
                        (validaDat(data) == false)
                    ) {
                        // Inválido

                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Data inválida.</div>');
                    } else {
                        // Valido

                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    }
                }
            }
        });

    //
    // Campo Sigla
    //
    $('[data-mascara_validacao="sigla"]')
        .mask('ZZZZZ', {
            translation: {
                'Z': {
                    pattern: /[A-Za-z]/
                }
            }
        });

    //
    // Campo Email
    //
    $('[data-mascara_validacao="email"]')
        .on('blur touchstart keyup', function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();;

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validaEmail()) {
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

                        $this.after('<div class="invalid-feedback">E-mail inválido. Tente outro.</div>');
                    }
                }
            }
        });

    //
    // Campo CEP
    //
    $('[data-mascara_validacao="cep"]')
        .mask('00000-000')
        .on('blur touchstart', function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(9)) {
                        // Valido

                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');

                        $this.addClass('loading');

                        $.ajax({
                            url: 'http://api.postmon.com.br/v1/cep/' + $this.val(),
                            type: 'GET',
                            dataType: 'json',
                            success: function (json) {

                                $this.removeClass('loading');

                                if (typeof json.logradouro != 'undefined') {
                                    $('[name=endereco]').val(json['logradouro']);
                                }

                                if (typeof json.bairro != 'undefined') {
                                    $('[name=bairro]').val(json['bairro']);
                                }

                                if (typeof json.cidade != 'undefined') {
                                    $('[name=cidade]').val(json['cidade']);
                                }
                            }
                        });
                    } else {
                        // Inválido

                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 00000-000</div>');
                    }
                }
            }
        });

    //
    // Campo Número
    //
    $('[data-mascara_validacao="numero"]')
        .mask('0#')
        .on('blur touchstart', function () {

            var $this = $(this);

            var pode_zero = $this.attr('data-podeZero');
            if (pode_zero != undefined && pode_zero == 'true') {
                pode_zero = true;
            } else {
                pode_zero = false;
            }

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    var value = Number($this.val());
                    if (value != 0 || pode_zero == true) {
                        // Valido
                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    } else {
                        // Inválido
                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Número precisa ser maior que 0.</div>');
                    }
                }
            }
        });

    //
    // Campo Monetário, Salaário, Custo
    //
    $('[data-mascara_validacao="monetario"]')
        .mask('#.##0,00', {
            reverse: true
        })

    $(this)
        .on('blur touchstart', '[data-mascara_validacao="monetario"]', function () {
            var $this = $(this),
                value = $this.val(),
                anterior = $this.attr('data-anterior'),
                text_label = $this.siblings('label').find('span').text();

            var pode_zero = $this.attr('data-podeZero');
            if (pode_zero != undefined && pode_zero == 'true') {
                pode_zero = true;
            } else {
                pode_zero = false;
            }

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if (value) {

                if (anterior != value) {

                    var value = value.replace(/\./g, ''),
                        value = value.replace(/\,/g, '.');

                    value = parseFloat(value);

                    if (value <= parseFloat(0)) {

                        if (pode_zero == true) {
                            $this
                                .removeClass('is-invalid')
                                .addClass('is-valid');

                            $this[0].setCustomValidity('');

                        } else {
                            $this
                                .removeClass('is-valid')
                                .addClass('is-invalid');

                            $this[0].setCustomValidity('invalid');

                            $this.after('<div class="invalid-feedback">' + text_label + ' precisa ser maior que 0.</div>');
                        }
                    } else {

                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    }
                }
            } else {
                $this.val('');
            }
        });

    //
    // Campo Comissão, Porcentagem 
    //
    $('[data-mascara_validacao="porcentagem"]')
        .mask('00,00%', {
            reverse: true
        })
        .on('blur touchstart', function () {

            var $this = $(this),
                value = $this.val().replace('%', ''),
                dtAnterior = $this.attr('data-anterior'),
                anterior = dtAnterior ? dtAnterior.replace('%', '') : dtAnterior,
                text_label = $this.siblings('label').find('span').text();

            var pode_zero = $this.attr('data-podeZero');
            if (pode_zero != undefined && pode_zero == 'true') {
                pode_zero = true;
            } else {
                pode_zero = false;
            }

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if (value) {

                if (anterior != value) {

                    var value = value.replace('.', ''),
                        value = value.replace(',', '.')
                    value = parseFloat(value);

                    if (value <= parseFloat(0)) {

                        if (pode_zero == true) {

                            $this
                                .removeClass('is-invalid')
                                .addClass('is-valid');

                            $this[0].setCustomValidity('');

                        } else {
                            $this
                                .removeClass('is-valid')
                                .addClass('is-invalid');

                            $this[0].setCustomValidity('invalid');

                            $this.after('<div class="invalid-feedback">' + text_label + ' precisa ser maior que 0.</div>');
                        }
                    } else {

                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    }
                }
            } else {
                $this.val('');
            }
        })
        .change('blur change touchstart', function () {

            var dtAnterior = $(this).attr('data-anterior');

            if (dtAnterior && dtAnterior.length) {

                dtAnterior = dtAnterior.replace('%', '');
                dtAnterior = dtAnterior + '%';

                $(this).attr('data-anterior', dtAnterior);
            }
        })
        .change();

    //
    // Campo PIS/PASEP
    //
    $('[data-mascara_validacao="pis"]')
        .mask('000.00000.00-0')
        .on('blur touchstart keyup', function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
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

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 000.00000.00-0</div>');
                    }
                }
            }
        });
    //
    // Campo CTPS
    //
    $('[data-mascara_validacao="ctps"]')
        .mask('0000000')
        .on('blur touchstart keyup', function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(7)) {
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

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 0000000</div>');
                    }
                }
            }
        });
    //
    // Campo Série da CLT
    //
    $('[data-mascara_validacao="clt_serie"]')
        .mask('000-0')
        .on('blur touchstart keyup', function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(5)) {
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

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 000-0</div>');
                    }
                }
            }
        });
    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///                                                                     
    ///     INTERAÇÕES ENTRE OS ELEMENTOS, FUNCIONALIDADES, EVENTOS
    ///
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //
    // Desabilitar a tecla Enter
    //
    $('input').keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    });

    //
    // Função que valida as alterações necessárias para o submit
    //
    $('.needs-validation').submit(function (event) {
        // deixa o enter destivado para submitar o formulario    
        var form = this;

        // Executa o blur de todos os campos do formulário novamente
        $(form).find('.form-control, .form-check-input').trigger('blur');

        if (form.checkValidity() == false) {
            // Primeira validação de todos os campos(de todos os tipos. Ex.: required, mascara, unico)
            // Da foco no primeiro campo inválido
            $(form).find('.is-invalid, :invalid').first().focus();
            // Para o evento de submit
            event.preventDefault();

        } else {
            // Todos os campos do formulário estão válidos quando submita

            if (form.checkValidity() == false) {
                // Segunda validação de todos os campos(de todos os tipos. Ex.: required, mascara, unico)
                // Da foco no primeiro campo inválidos
                $(form).find('.is-invalid, :invalid').first().focus();
                // Para o evento de submit
                event.preventDefault();

            } else {
                // Todos os campos do formulário estão válidos novamente
                var $alteracoes = $('[name=alteracoes]');

                if ($alteracoes.val() != '') { // Editar

                    // Faz um foreach em todos os campos do formulário para ver os valores atuais e os valores anteiores
                    var campos_alterados = '';
                    $(form).find('input[type=text], input[type=password], input[type=hidden]:not([name=alteracoes]), input[type=radio]:checked, textarea, select').each(function (index, el) {

                        var valorAtual = $(el).val(),
                            dataAnterior = $(el).attr('data-anterior'),
                            text_label = $(el).siblings('label').find('span').text();

                        valorAtual = String(valorAtual).trim().toUpperCase();
                        dataAnterior = String(dataAnterior).trim().toUpperCase();

                        if (dataAnterior != valorAtual) {

                            if ($(el).attr('id') == 'senha') {
                                campos_alterados += '{ A SENHA foi alteradaa }';

                            } else if ($(el).attr('id') == 'senhaaux') {
                                //não faz nada

                            } else if ($(el).attr('id') == 'rota') {
                                text_label = 'Rota de ' + $(el).parents('tr:eq(0) td:eq(0)').text().replace(':','').trim();
                                campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';

                            } else if ($(el).attr('id') == 'pedido') {
                                // e ver como não confundir com o id pedido - do cad vendedores e da operacao
                                if( currentModule == 'vendedores' ){
                                    text_label = 'Pedido de ' + $(el).closest('tr').find('td:eq(0)').text().replace(':','').trim() + ' Sabor: ' + $(el).parents('td').text().trim();
                                    campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';
                                }
                                if( currentModule == 'pedidos' ){
                                    text_label = 'Pedido Sabor: ' + $(el).parents('td').text().trim();
                                    campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';
                                }

                            }else if ($(el).attr('id') == 'sobrad1') {
                                text_label = 'Sobra(D-1) Sabor: ' + $(el).parents('td').text().trim();
                                campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';

                                
                            }else if ($(el).attr('id') == 'entrega') {
                                text_label = 'Entrega Sabor: ' + $(el).parents('td').text().trim();
                                campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';

                            }else if ($(el).attr('id') == 'venda') {
                                text_label = 'Venda Sabor: ' + $(el).parents('td').text().trim();
                                campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';

                            }else if ($(el).attr('id') == 'sobrad0') {
                                text_label = 'Sobra(D-0) Sabor: ' + $(el).parents('td').text().trim();
                                campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';

                            }else if ($(el).attr('id') == 'sobrad2') {
                                text_label = 'Sobra(D-2) Sabor: ' + $(el).parents('td').text().trim();
                                campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';

                            }else if ($(el).attr('id') == 'doacao') {
                                text_label = 'Entrega Sabor: ' + $(el).parents('td').text().trim();
                                campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';

                            }else {
                                campos_alterados += '{' + text_label.toUpperCase() + ' de (' + $(el).attr('data-anterior') + ') para (' + $(el).val() + ')}';
                            }

                        }
                    });

                    if (campos_alterados != '') {

                        $alteracoes.val($alteracoes.val() + '##' + campos_alterados);
                        if (!confirm('Tem certeza?')) {
                            event.preventDefault();
                        }
                    } else {
                        // Se o usuario entrou para editar e submitou sem alterar nada
                        alert("Nenhuma alteração foi feita!");
                        event.preventDefault();
                    }
                } else { // Adicionar
                    if (!confirm('Tem certeza?')) {
                        event.preventDefault();

                    }
                }

            }
        }

        form.classList.add('was-validated');
    });

    // Filtrar contatos pela busca
    // $('#searchDataTable').on('keyup', function () {

    //     var searchValue = $(this).val();

    //     $('.contatos-filtrados').each(function () {
    //         var $display = $(this).find('span');
    //         $(this).find('.contatos-escondidos:contains("' + searchValue + '")').each(function () {
    //             var $filtered = $(this),
    //                 textFiltered = $filtered.text(),
    //                 textDisplay = $display.text();

    //             $display.text(textFiltered);
    //             $filtered.text(textDisplay);
    //         });
    //     });

    //     var body = $(dataTable.table().body());

    //     body.unhighlight();
    //     body.highlight(searchValue);

    // });

    $('[type=checkbox]').on('blur touchstart', function () {

        var $hidden = $(this).parent().siblings('[type=hidden]'),
            $checkeds = $(this).parents('.form-checkbox').find(':checked'),
            arrCheckeds = [];

        // Pega todos os checados e transforma em um novo array
        $checkeds.each(function (i, el) {
            arrCheckeds.push($(el).val());
        });

        // Transforma o array em uma string separada por virgula
        arrCheckeds = arrCheckeds.join(', ');

        // Seta no hidden a string com os checkbox marcados
        $hidden
            .val(arrCheckeds)
            .change()
            .blur();

        $(this)
            .parents('.form-checkbox')
            .removeClass('is-invalid is-valid');

        if ($hidden.attr('required') == 'required') {
            if ($hidden.val() == '') {
                // Inválido

                $(this)
                    .parents('.form-checkbox')
                    .addClass('is-invalid');

            } else {
                // Válido
                $(this)
                    .parents('.form-checkbox')
                    .addClass('is-valid');
            }
        } else {
            // Válido

            $(this)
                .parents('.form-checkbox')
                .addClass('is-valid');
        }
    });

    var $requiredRadios = $(':radio[required]');
    $('[type=radio]').on('blur touchstart', function () {
        if ($requiredRadios.is(':checked')) {
            if(  $requiredRadios.attr('required') == 'required'  ){
                $(this)
                    .parents('.form-radio')
                    .addClass('is-valid')
                    .removeClass('is-invalid');
            }else{

                $(this)
                .parents('.form-radio')
                .addClass('is-invalid')
                .removeClass('is-valid');
            }        
        } else {
            $(this)
                .parents('.form-radio')
                .removeClass('is-valid is-invalid');
        }
    });

    var $campos = $('#form-principal').find('input[type=text], input[type=password], input[type=hidden]:not([name=alteracoes]), input[type=radio], textarea, select');
    $campos
        .ready(function () {
            habilitaBotao($campos);
        })
        .on('change blur touchstart', function () {
            habilitaBotao($campos);
        });

    $('input, textarea, select').on('blur touchstart', function () {
        if ($(this)[0].hasAttribute('data-mascara_validacao') && $(this).attr('data-mascara_validacao') == 'false') {

            if ($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox') {
                var $element = $(this).parent().parent();
            } else {
                var $element = $(this);
            }

            if ($(this).val() != '' && $(this).attr('data-anterior') != $(this).val()) {

                $element.addClass('is-valid');

            } else {

                $element.removeClass('is-valid');
            }
        }
    });

    // Eventos responsáveis pelo: Select Dropdown com Pesquisa
    $(document)
        .ready(function () {
            // popula a  div com os elementos da tabela e campo escolhidos
            $('.relacional-dropdown-input').each(function () {

                var $this = $(this),
                    $relacionalDropdown = $this.parents('.relacional-dropdown-wrapper').find('.relacional-dropdown'),
                    campo = $this.attr('data-campo');

                $.ajax({
                    url: baselink + '/ajax/getRelacionalDropdown',
                    type: 'POST',
                    data: {
                        tabela: $this.attr('data-tabela'),
                        campo: campo
                    },
                    dataType: 'json',
                    success: function (data) {

                        // JSON Response - Ordem Alfabética
                        data.sort(function (a, b) {
                            a = a[campo].toLowerCase();
                            b = b[campo].toLowerCase();
                            return a < b ? -1 : a > b ? 1 : 0;
                        });

                        var htmlDropdown = '';
                        data.forEach(element => {
                            htmlDropdown += `
                                <div class="list-group-item list-group-item-action relacional-dropdown-element">` + element[campo] + `</div>
                            `;
                        });

                        $relacionalDropdown.find('.dropdown-menu-wrapper').html(htmlDropdown);
                    }
                });
            });
        })
        // seta o valor do input igual ao valor da div clicada
        .on('click', '.relacional-dropdown-element', function () {

            var $this = $(this),
                $input = $this.parents('.relacional-dropdown-wrapper').find('.relacional-dropdown-input');

            $input
                .val($this.text())
                .change();
        })
        // durante a digitação vai filtrando os elemnetos que foram carregados na div de opções
        .on('keyup', '.relacional-dropdown-input', function (event) {

            var code = event.keyCode || event.which;

            if (code == 27) {
                $(this)
                    .dropdown('hide')
                    .blur();
                return;
            }

            var $this = $(this),
                $dropdownMenu = $this.siblings('.dropdown-menu'),
                $nenhumResult = $dropdownMenu.find('.nenhum-result'),
                $elements = $dropdownMenu.find('.relacional-dropdown-element');

            if ($this.attr('data-anterior') != $this.val()) {

                var $filtereds = $elements.filter(function () {
                    return $(this).text().toLowerCase().indexOf($this.val().toLowerCase()) != -1;
                });

                if (!$filtereds.length) {
                    $nenhumResult.removeClass('d-none');
                } else {
                    $nenhumResult.addClass('d-none');
                }

                $elements.not($filtereds).hide();
                $filtereds.show();

            } else {

                $nenhumResult.addClass('d-none');
                $elements.show();

            }

        });

    $('.relacional-dropdown-input') // no click ele abre as opçoes do dropdown
        .click(function () {
            var $this = $(this)
            if ($this.parents('.dropdown').hasClass('show')) {
                $this.dropdown('toggle');
            }
        })
        .on('blur change', function () {

            var $this = $(this),
                $dropdownMenu = $this.siblings('.dropdown-menu');

            $this.removeClass('is-valid is-invalid');

            if ($this.val()) {

                $dropdownMenu.find('.nenhum-result').addClass('d-none');
                $('.relacional-dropdown-element').show();
                //filtra os elemento opção de acordo co o valor do input
                $filtereds = $dropdownMenu.find('.relacional-dropdown-element').filter(function () {
                    return $(this).text().toLowerCase().indexOf($this.val().toLowerCase()) != -1;
                });

                if (!$filtereds.length) {

                    if ($this.attr('data-pode_nao_cadastrado') == 'false') {

                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        this.setCustomValidity('invalid');
                        $this.after('<div class="invalid-feedback">Selecione um item existente.</div>');

                    } else {

                        $this.addClass('is-valid');
                        this.setCustomValidity('');

                    }

                } else {

                    $this.addClass('is-valid');
                    this.setCustomValidity('');

                }

            }
        })
        .attr('autocomplete', 'off');

});