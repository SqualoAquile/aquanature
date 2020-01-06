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

const parametrosSemAcoes = [
    'dinheiro',
    'cartão débito',
    'cartão crédito',
    'boleto',
    'cheque',
    'transferência',
    'TED',
    'DOC',
    'Elo',
    'Visa',
    'MasterCard',
    'BanriCompras',
    'Hiper',
    'Visa Electron',
    'Hipercard',
    'M²',
    'm²',
    'ml',
    'ML',
    'Contato',
    'contato'
];

function Ajax(url, callback, send = {}) {
    $.ajax({
        url: baselink + '/ajax/' + url,
        type: 'POST',
        data: send,
        dataType: 'json',
        success: callback
    });
};

function Popula($wrapper, data, campo) {
    //  console.log('param sem acoes', parametrosSemAcoes);
     
    var htmlContentSearch = '';

    data.forEach(element => {
        // console.log('foreach dentro do popula');
        // console.log('elemnet ', element);
        // console.log('element[campo]', element[campo]);
        var htmlAcoes = '';

        if (parametrosSemAcoes.indexOf(element[campo]) == -1) {

            htmlAcoes = `
                <div>
                `;

            if (data_edt == true) {
                htmlAcoes += `
                    <button class="editar btn btn-sm btn-primary" tabindex="-1">
                        <i class="fas fa-edit"></i>
                    </button>
                    `;
            }

            if (data_exc == true) {
                htmlAcoes += `
                    <button class="excluir btn btn-sm btn-danger" tabindex="-1">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    `;
            }

            htmlAcoes += `
                </div>
            `;
        }

        htmlContentSearch += `
            <div id="` + element.id + `" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text">` + element[campo] + `</span>`
            + htmlAcoes +
            `</div>
            </div>
        `;
    });

    $wrapper.html(htmlContentSearch);
};

function PopulaDependente($wrapper, data, campo) {
    // console.log('aqui carai')
    //  console.log('param sem acoes', parametrosSemAcoes);
     
    var htmlContentSearch = '';

    data.forEach(element => {
        // console.log('foreach dentro do popula');
        // console.log('elemnet ', element);
        // console.log('element[campo]', element[campo]);
        var htmlAcoes = '';

        if (parametrosSemAcoes.indexOf(element[campo]) == -1) {

            htmlAcoes = `
                <div>
                `;

            if (data_edt == true) {
                htmlAcoes += `
                    <button class="editar btn btn-sm btn-primary" tabindex="-1">
                        <i class="fas fa-edit"></i>
                    </button>
                    `;
            }

            if (data_exc == true) {
                htmlAcoes += `
                    <button class="excluir btn btn-sm btn-danger" tabindex="-1">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    `;
            }

            htmlAcoes += `
                </div>
            `;
        }

        htmlContentSearch += `
            <div id="` + element.id + `" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text">` + element[campo] + `</span>`
            + htmlAcoes +
            `</div>
            </div>
        `;
    });

    $wrapper.html(htmlContentSearch);
};

function PopulaDoisCampos($wrapper, data, campo1, campo2) {

    var htmlContentSearch = '';

    data.forEach(element => {

        var htmlAcoes = '';

        if (parametrosSemAcoes.indexOf(element[campo1]) == -1) {

            htmlAcoes = '';

            if (data_edt == true) {
                htmlAcoes += `
                    <button class="editar-doiscampos btn btn-sm btn-primary" tabindex="-1">
                        <i class="fas fa-edit"></i>
                    </button>
                `;
            }

            if (data_exc == true) {
                htmlAcoes += `
                    <button class="excluir btn btn-sm btn-danger" tabindex="-1">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
            }

        }

        htmlContentSearch += `
            <div id="` + element.id + `" class="list-group-item list-group-item-doiscampos">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="m-0 titulo-avisos">` + element[campo1] + `</h6>
                        <small>` + element[campo2] + `</small>
                    </div>
                    <div>`
                        + htmlAcoes +
                    `</div>
                </div>
            </div>
        `;
    });

    $wrapper.html(htmlContentSearch);
};

//
// falta verificar porque tá adicionando 2 vezes - porue tá chamando a função 2 vezes
//

// Dropdowns
$(document)
    .on('click', '.down-btn', function () {
        // console.log('click down-btn INDEP')
        $(this).parents('.search-body').find('.search-input.indep').focus();
    })
    .on('click', '.close-btn', function () {
        // console.log('click close-btn INDEP')
        var $searchBody = $(this).parents('.search-body'),
            $inputSearch = $searchBody.find('.search-input.indep');

        if ($inputSearch.attr('data-id')) {

            $inputSearch[0].setCustomValidity('');

            $inputSearch
                .removeClass('is-invalid is-valid')
                .removeAttr('data-id')
                .val('')
                .focus();

        } else {

            if ($searchBody.find('.elements-add').children().length) {

                $inputSearch
                    .removeClass('is-invalid is-valid')
                    .removeAttr('data-id')
                    .val('')
                    .trigger('input')
                    .focus();
            } else {

                $searchBody.find('.list-group-filtereds-wrapper').hide();
                $searchBody.removeClass('active');
            }

        }
    })
    .on('click touchstart', function (event) {
        // console.log('click INDEP')
        var $currentElement = $(event.target);

        if (!$currentElement.parents('.search-body').length) {

            var $searchBodyActive = $('.search-body');

            $searchBodyActive
                .find('.search-input.indep')
                .blur();

            $searchBodyActive
                .removeClass('active')
                .find('.list-group-filtereds-wrapper')
                .hide();

        } else {

            var $notCurrent = $('.search-body.active').not($currentElement.parents('.search-body'))

            $notCurrent
                .find('.list-group-filtereds-wrapper')
                .hide();

            $notCurrent.removeClass('active');
        }
    })
    .on('DOMNodeInserted', '.list-group-item', function (event) {
        // console.log('DOMNodeInserted INDEP')
        var $created = $(event.target),
            $inputSearch = $created.parents('.list-group-filtereds-wrapper').siblings('.search-input.indep');

        if ($created.attr('id') == $inputSearch.attr('data-id')) {

            $created
                .find('.excluir')
                .hide();

            $created
                .find('.editar')
                .removeClass('editar btn-primary')
                .addClass('salvar btn-success')
                .find('.fas')
                .removeClass('fa-edit')
                .addClass('fa-save');

        }
    })
    .on('focus', '.search-input.indep', function () {
        // console.log('focus searchInput INDEP')
        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $contentSearchThisWrapper = $searchBody.find('.list-group-filtereds-wrapper'),
            $contentSearchThis = $contentSearchThisWrapper.find('.list-group-filtereds'),
            campo = $searchBody.attr('data-campo'),
            value = $this.val();

        $searchBody.addClass('active');
        $contentSearchThisWrapper.show();

        if ($this.attr('data-id')) {
            value = $this.attr('data-anterior');
        }

        if (($this.val() && $this.attr('data-id')) || (!$this.val() && !$this.attr('data-id'))) {

            Ajax('listarParametros', function (data) {
                // console.log('conteudo pesquisado:', $contentSearchThis);
                // console.log('dados:', data);
                // console.log('campo:', campo);

                Popula($contentSearchThis, data, campo);

                if ($this.attr('data-id')) {
                    $this.trigger('input');
                }

            }, {
                    value: value,
                    tabela: $searchBody.attr('id'),
                    campo: campo
                });
        }

    })
    .on('input', '.search-input.indep', function () {
        // console.log('input searchInput INDEP')

        var $this = $(this),
            $contentSearchThis = $this.siblings('.list-group-filtereds-wrapper').find('.list-group-filtereds'),
            id = $this.attr('data-id'),
            $searchBody = $this.parents('.search-body'),
            campo = $searchBody.attr('data-campo');
            tabela = $searchBody.attr('id'),
            $elAdd = $contentSearchThis.siblings('.elements-add'),
            $saveParametros = $searchBody.find('.salvar');

        if (id == undefined) {
            // Pesquisando

            Ajax('listarParametros', function (data) {

                Popula($contentSearchThis, data, campo);

                var htmlElAdd = '';

                if (!data.length && data_add == true) {
                    htmlElAdd += `
                        <div class="p-3">
                            <small>Nenhum resultado encontrado</small>
                            <button class="salvar btn btn-success btn-block text-truncate mt-2">Adicionar: ` + $this.val() + `</button>
                        </div>
                    `;
                }

                $elAdd.html(htmlElAdd);

            }, {
                    value: $this.val(),
                    tabela: tabela,
                    campo: campo
                });

        } else {
            // Editando

            var $btnSalvar = $contentSearchThis.find('.salvar');

            $this.removeClass('is-invalid is-valid');

            if ($this.val()) {
                if ($this.val() != $this.attr('data-anterior')) {

                    $this[0].setCustomValidity('');
                    $this.addClass('is-valid');

                    $btnSalvar.removeAttr('disabled');

                } else {

                    $btnSalvar.attr('disabled', 'disabled');

                }
            } else {

                $this[0].setCustomValidity('invalid');
                $this.addClass('is-invalid');

                $btnSalvar.attr('disabled', 'disabled');
            }

            $('.list-group-filtereds #' + id + ' .text').text($this.val());

        }
    })
    .on('keydown', '.search-input.indep', function (event) {
        // console.log('keydown searchInput INDEP')

        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $inputSearch = $searchBody.find('.search-input'),
            code = event.keyCode || event.which;

        if (code == 27 || code == 9) {
            // Esc || Tab

            $inputSearch[0].setCustomValidity('');

            $inputSearch
                .removeClass('is-valid is-invalid')
                .removeAttr('data-id')
                .val('')
                .trigger('input')
                .blur();

            $searchBody
                .find('.elements-add')
                .html('');

            $searchBody.find('.icons-search-input .close-btn').click();

        }
    })
    .on('click', '.excluir', function () {
        // console.log('click .excluir INDEP')
        var $this = $(this),
            $parent = $this.closest('.list-group-item'),
            $input = $this.parents('.search-body').find('.search-input.indep')
            tabela = $parent.parents('.search-body').attr('id');

        if (confirm('Tem Certeza?')) {
            Ajax('excluirParametros/' + $parent.attr('id'), function (data) {
                if (data[0] == '00000') {

                    Toast({
                        message: 'Parâmetro excluido com sucesso!',
                        class: 'alert-success'
                    });

                    $input.val('');
                    $parent.remove();
                    $input.focus();
                }
            }, {
                    tabela: tabela
                });
        }
    })
    .on('click', '.salvar', function () {
        // console.log('click .salvar INDEP')
        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $inputSearch = $searchBody.find('.search-input.indep'),
            tabela = $searchBody.attr('id'),
            campo = $searchBody.attr('data-campo');

        if ($inputSearch.attr('data-id') != $inputSearch.val() && $inputSearch.val()) {
            if ($inputSearch.attr('data-id') == undefined) {

                Ajax('adicionarParametros', function (data) {
                    if (data[0] == '00000' || data[2] == null) {

                        Toast({
                            message: 'Parâmetro incluso com sucesso!',
                            class: 'alert-success'
                        });

                        $inputSearch
                            .removeClass('is-valid is-invalid')
                            .val('')
                            .focus()
                            .trigger('input');

                    }
                }, {
                        value: $inputSearch.val(),
                        campo: campo,
                        tabela: tabela
                    });

            } else {

                Ajax('editarParametros/' + $inputSearch.attr('data-id'), function (data) {
                    if (data[0] == '00000') {

                        Toast({
                            message: 'Parâmetro editado com sucesso!',
                            class: 'alert-success'
                        });

                        $inputSearch
                            .removeClass('is-valid is-invalid')
                            .removeAttr('data-id')
                            .val('')
                            .focus()
                            .trigger('input');
                    }
                }, {
                        value: $inputSearch.val(),
                        tabela: tabela,
                        campo: campo
                    });

            }
        } else {

            //$inputSearch[0].setCustomValidity('invalid');

            $inputSearch
                .focus()
                .addClass('is-invalid');
        }

    })
    .on('click', '.editar', function () {
        // console.log('click .editar INDEP')
        var $parent = $(this).closest('.list-group-item'),
            $inputSearch = $parent.parents('.list-group-filtereds-wrapper').siblings('.search-input.indep');

        $inputSearch
            .val($parent.find('.text').text())
            .attr('data-id', $parent.attr('id'))
            .attr('data-anterior', $parent.find('.text').text())
            .focus();
    });

// Dropdowns Dependentes de Outra Tabela
$(document)
    .on('click', '.down-btn', function () {
        // console.log('click down-btn DEPENDENTE')
        $(this).parents('.search-body').find('.search-input.dependente').focus();
    })
    .on('click', '.close-btn', function () {
        // console.log('click close-btn DEPENDENTE')
        var $searchBody = $(this).parents('.search-body'),
            $inputSearch = $searchBody.find('.search-input.dependente');

        if ($inputSearch.attr('data-id')) {

            $inputSearch[0].setCustomValidity('');

            $inputSearch
                .removeClass('is-invalid is-valid')
                .removeAttr('data-id')
                .val('')
                .focus();

        } else {

            if ($searchBody.find('.elements-add').children().length) {

                $inputSearch
                    .removeClass('is-invalid is-valid')
                    .removeAttr('data-id')
                    .val('')
                    .trigger('input')
                    .focus();
            } else {

                $searchBody.find('.list-group-filtereds-wrapper').hide();
                $searchBody.removeClass('active');
            }

        }
    })
    .on('click touchstart', function (event) {
        // console.log('click DEPENDENTE')
        var $currentElement = $(event.target);

        if (!$currentElement.parents('.search-body').length) {

            var $searchBodyActive = $('.search-body');

            $searchBodyActive
                .find('.search-input.dependente')
                .blur();

            $searchBodyActive
                .removeClass('active')
                .find('.list-group-filtereds-wrapper')
                .hide();

        } else {

            var $notCurrent = $('.search-body.active').not($currentElement.parents('.search-body'))

            $notCurrent
                .find('.list-group-filtereds-wrapper')
                .hide();

            $notCurrent.removeClass('active');
        }
    })
    .on('DOMNodeInserted', '.list-group-item', function (event) {
        // console.log('DOMNodeInserted DEPENDENTE')
        var $created = $(event.target),
            $inputSearch = $created.parents('.list-group-filtereds-wrapper').siblings('.search-input.dependente');

        if ($created.attr('id') == $inputSearch.attr('data-id')) {

            $created
                .find('.excluir')
                .hide();

            $created
                .find('.editar')
                .removeClass('editar btn-primary')
                .addClass('salvar btn-success')
                .find('.fas')
                .removeClass('fa-edit')
                .addClass('fa-save');

        }
    })
    .on('focus', '.search-input.dependente', function () {
        // console.log('focus DEPENDENTE')
        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $contentSearchThisWrapper = $searchBody.find('.list-group-filtereds-wrapper'),
            $contentSearchThis = $contentSearchThisWrapper.find('.list-group-filtereds'),
            campo = $searchBody.attr('data-campo'),
            chaveext = $searchBody.attr('data-chaveextrangeira'),
            idtabelafonte = $this.parents('.interna').find('select').find(':selected').val(),
            nometabelafonte = $this.parents('.interna').find('select').siblings('label:eq(0)').text(),
            value = $this.val();
        
        // console.log('id tab fonte:',idtabelafonte)
        if(idtabelafonte == ''){
            alert('Selecione um(uma) '+ nometabelafonte.trim());
            $this.parents('.interna').find('select').focus();
            $searchBody.find('.list-group-filtereds-wrapper').hide();
            return;
        
        }else{

            $searchBody.addClass('active');
            $contentSearchThisWrapper.show();

            if ($this.attr('data-id')) {
                value = $this.attr('data-anterior');
            }
            
            if ( ($this.val() && $this.attr('data-id')) || (!$this.val() && !$this.attr('data-id'))) {
                
                Ajax('listarParametrosDependente', function (data) {
                    // console.log('conteudo pesquisado dependente:', $contentSearchThis);
                    // console.log('dados:', data);
                    // console.log('campo:', campo);

                    PopulaDependente($contentSearchThis, data, campo);

                    if ($this.attr('data-id')) {
                        $this.trigger('input');
                    }

                }, {
                        value: value,
                        tabela: $searchBody.attr('id'),
                        campo: campo,
                        chaveext: chaveext,
                        idtabfonte: idtabelafonte
                    });
            }
        }
    })
    //verificar esse cara Aqui de baixo
    .on('input', '.search-input.dependente', function () {
        // console.log('input DEPENDENTE')
        var $this = $(this),
            $contentSearchThis = $this.siblings('.list-group-filtereds-wrapper').find('.list-group-filtereds'),
            id = $this.attr('data-id'),
            $searchBody = $this.parents('.search-body'),
            chaveext = $searchBody.attr('data-chaveextrangeira'),
            idtabelafonte = $this.parents('.interna').find('select').find(':selected').val(),
            campo = $searchBody.attr('data-campo');
            tabela = $searchBody.attr('id'),
            $elAdd = $contentSearchThis.siblings('.elements-add'),
            $saveParametros = $searchBody.find('.salvar');

        if (id == undefined) {
            // Pesquisando

            Ajax('listarParametrosDependente', function (data) {

                PopulaDependente($contentSearchThis, data, campo);

                var htmlElAdd = '';

                if (!data.length && data_add == true) {
                    htmlElAdd += `
                        <div class="p-3">
                            <small>Nenhum resultado encontrado</small>
                            <button class="salvar btn btn-success btn-block text-truncate mt-2">Adicionar: ` + $this.val() + `</button>
                        </div>
                    `;
                }

                $elAdd.html(htmlElAdd);

            }, {
                    value: $this.val(),
                    tabela: tabela,
                    campo: campo,
                    chaveext: chaveext,
                    idtabfonte: idtabelafonte
                });

        } else {
            // Editando

            var $btnSalvar = $contentSearchThis.find('.salvar');

            $this.removeClass('is-invalid is-valid');

            if ($this.val()) {
                if ($this.val() != $this.attr('data-anterior')) {

                    $this[0].setCustomValidity('');
                    $this.addClass('is-valid');

                    $btnSalvar.removeAttr('disabled');

                } else {

                    $btnSalvar.attr('disabled', 'disabled');

                }
            } else {

                $this[0].setCustomValidity('invalid');
                $this.addClass('is-invalid');

                $btnSalvar.attr('disabled', 'disabled');
            }

            $('.list-group-filtereds #' + id + ' .text').text($this.val());

        }
    })
    .on('keydown', '.search-input.dependente', function (event) {
        // console.log('keydown DEPENDENTE')
        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $inputSearch = $searchBody.find('.search-input.dependente'),
            code = event.keyCode || event.which;

        if (code == 27 || code == 9) {
            // Esc || Tab

            $inputSearch[0].setCustomValidity('');

            $inputSearch
                .removeClass('is-valid is-invalid')
                .removeAttr('data-id')
                .val('')
                .trigger('input')
                .blur();

            $searchBody
                .find('.elements-add')
                .html('');

            $searchBody.find('.icons-search-input .close-btn').click();

        }
    })
    .on('click', '.excluir', function () {
        // console.log('click excluir DEPENDENTE')
        var $this = $(this),
            $parent = $this.closest('.list-group-item'),
            $input = $this.parents('.search-body').find('.search-input.dependente')
            tabela = $parent.parents('.search-body').attr('id');

        if (confirm('Tem Certeza?')) {
            // console.log('chamou excluir')
            Ajax('excluirParametros/' + $parent.attr('id'), function (data) {
                if (data[0] == '00000') {

                    Toast({
                        message: 'Parâmetro excluido com sucesso!',
                        class: 'alert-success'
                    });

                    $input.val('');
                    $parent.remove();
                    $input.focus();
                }
            }, {
                    tabela: tabela
                });
        }
    })
    .on('click', '.salvar', function () {
        // console.log('salvar DEPENDENTE')
        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $inputSearch = $searchBody.find('.search-input.dependente'),
            tabela = $searchBody.attr('id'),
            campo = $searchBody.attr('data-campo'),
            chaveext = $searchBody.attr('data-chaveextrangeira'),
            idtabelafonte = $this.parents('.interna').find('select').find(':selected').val();

            
            if(chaveext == undefined || chaveext == '' ){
                chaveext = '';
                idtabelafonte = '';
            }
            // console.log('chave:', chaveext);
            // console.log('id:', idtabelafonte)
        if ($inputSearch.attr('data-id') != $inputSearch.val() && $inputSearch.val()) {
            if ($inputSearch.attr('data-id') == undefined) {
                // console.log('chamou AJAX adicionar Parâmetros')
                Ajax('adicionarParametros', function (data) {
                    if (data[0] == '00000') {

                        Toast({
                            message: 'Parâmetro incluso com sucesso!',
                            class: 'alert-success'
                        });

                        $inputSearch
                            .removeClass('is-valid is-invalid')
                            .val('')
                            .focus()
                            .trigger('input');

                    }
                }, {
                        value: $inputSearch.val(),
                        campo: campo,
                        tabela: tabela,
                        chaveext: chaveext,
                        idtabfonte: idtabelafonte
                    });

            } else {

                Ajax('editarParametros/' + $inputSearch.attr('data-id'), function (data) {
                    if (data[0] == '00000') {

                        Toast({
                            message: 'Parâmetro editado com sucesso!',
                            class: 'alert-success'
                        });

                        $inputSearch
                            .removeClass('is-valid is-invalid')
                            .removeAttr('data-id')
                            .val('')
                            .focus()
                            .trigger('input');
                    }
                }, {
                        value: $inputSearch.val(),
                        tabela: tabela,
                        campo: campo
                    });

            }
        } else {

            //$inputSearch[0].setCustomValidity('invalid');

            $inputSearch
                .focus()
                .addClass('is-invalid');
        }

    })
    .on('click', '.editar', function () {
        // console.log('editar DEPENDENTE')
        var $parent = $(this).closest('.list-group-item'),
            $inputSearch = $parent.parents('.list-group-filtereds-wrapper').siblings('.search-input.dependente');

        $inputSearch
            .val($parent.find('.text').text())
            .attr('data-id', $parent.attr('id'))
            .attr('data-anterior', $parent.find('.text').text())
            .focus();
    });

// Fixos
$(document)
    .on('submit', '.form-params-fixos', function (event) {

        event.preventDefault();

        var $this = $(this),
            $input = $this.find('.input-fixos');
        value = $input.val(),
            campos_alterados = '',
            id = $input.attr('data-id'),
            $label = $this.find('label span');

        $input.blur();

        if (this.checkValidity() == false) {

            $this
                .find('.is-invalid, :invalid')
                .first()
                .focus();

        } else {

            if ($input.val() != $input.attr('data-anterior')) {
                campos_alterados += '{' + $label.text().toUpperCase() + ' de (' + $input.attr('data-anterior') + ') para (' + $input.val() + ')}';
                campos_alterados = $input.attr('data-alteracoes') + '##' + campos_alterados;
            }

            if ($input.attr('data-mascara_validacao') == 'monetario') {
                value = floatParaPadraoInternacional(value);
                value = floatParaPadraoBrasileiro(value);
            }

            if (confirm('Tem Certeza?')) {
                Ajax('editarParametrosFixos/' + id, function (data) {

                    if (data.erro[0] == '00000') {

                        Toast({
                            message: 'Parâmetro editado com sucesso!',
                            class: 'alert-success'
                        });

                        $this
                            .removeClass('was-validated');

                        $input
                            .attr('data-anterior', value)
                            .attr('data-alteracoes', data.result.alteracoes)
                            .removeClass('is-valid is-invalid')
                            .keyup();

                    }

                }, {
                        value: value,
                        alteracoes: campos_alterados
                    });
            }

        }

        $this.addClass('was-validated');

    })
    .on('keyup', '.input-fixos', function () {

        var $this = $(this),
            $submit = $this.parents('form').find('[type=submit]');

        if ($this.val() != $this.attr('data-anterior')) {
            $submit.removeAttr('disabled');
        } else {
            $submit.attr('disabled', 'disabled');
        }
    })
    .on('blur', '.input-fixos', function () {
        if (!$(this).val()) {
            $(this)
                .val($(this).attr('data-anterior'))
                .keyup();
        }
    });