<div class="modal fade" id="modalConfImp" tabindex="-1" role="dialog" aria-labelledby="modalConfImpLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <form class="modal-content" method="POST" id="formModal" target="_blank" action="<?php echo BASE_URL . "/" . $modulo . "/imprimir/" ?>">
            <div class="modal-header">
                <h5 class="modal-title" id="modalConfImpLabel">Imprimir</h5>
                <button type="button" class="close"  data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col">
                        <?php if ($modulo !='ordemservico'): ?>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" checked="checked" name="checkMedidas" id="checkMedidas" value="medidas">
                                <label class="form-check-label" for="checkMedidas">Medidas</label>
                            </div>
                        <?php endif; ?>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" checked="checked" name="checkUnitario" id="checkUnitario" value="unitario">
                            <label class="form-check-label" for="checkUnitario">Preços</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="checkAvisos" id="checkAvisos" value="avisos">
                            <label class="form-check-label" for="checkAvisos">Avisos</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="collapse" id="collapseAvisos">
                            <div class="py-4">
                                <h6>Selecionar Avisos</h6>
                                <div class="relacional-dropdown-wrapper dropdown"> 
                                    <input 
                                    type="text" 
                                    class="dropdown-toggle form-control relacional-dropdown-input-avisos" 
                                    data-toggle="dropdown" 
                                    autocomplete="off"
                                    aria-haspopup="true" 
                                    aria-expanded="false"
                                    />
                                    <label data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent" class="btn btn-sm text-secondary icon-dropdown m-0 toggle-btn dropdown-toggle">
                                        <i class="fas fa-caret-down"></i>
                                    </label>
                                    <div class="dropdown-menu w-100 p-0 list-group-flush relacional-dropdown">
                                        <div class="p-3 nenhum-result d-none">Nenhum resultado encontrado</div>
                                        <div class="dropdown-menu-wrapper"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-warning">Imprimir</button>
            </div>
        </form>
    </div>
</div>
<script>

    $('#formModal').submit(function() {
        $('#modalConfImp').modal('toggle'); 
    });

    $('#modalConfImp')
        .on('show.bs.modal', function (event) {
            
            if ($(this).attr('data-model') == 'ordemservico') {
                
                let $checkMedidas = $(this).find('#checkMedidas');

                $checkMedidas.parent('.form-check').hide();
                $checkMedidas.prop('checked', false);

            } else {

                let id = $(event.relatedTarget).attr('data-id'),
                    $form = $(this).find('form');
        
                $form.attr('action', '<?php echo BASE_URL . "/" . $modulo . "/imprimir/" ?>' + id);

            }

        })
        .on('hidden.bs.modal', function (event) {

            let $this = $(this),
                $checkMedidas = $this.find('#checkMedidas'),
                $checkAvisos = $('#checkAvisos'),
                $collAvisos = $('#collapseAvisos');
            
            $checkMedidas.parent('.form-check').show();
            $checkMedidas.prop('checked', true);
            
            $checkAvisos.prop('checked', false);
            $collAvisos.find('.relacional-dropdown-input-avisos').val('');
            $collAvisos.find('.relacional-dropdown-element-avisos [name="avisos[]"]').prop('checked', false);
            $collAvisos.collapse('hide');

            $this.removeAttr('data-model');
        });

    $(document)
        .ready(function() {
            $.ajax({
                url: baselink + "/ajax/getRelacionalDropdownOrcamentos",
                type: "POST",
                data: {
                    tabela: "avisos"
                },
                dataType: "json",
                success: function(data) {

                    var htmlDropdown = "";

                    htmlDropdown += '<div id="opcoesAvisos">';

                    data.forEach(element => {
                        htmlDropdown += `
                            <label for="avisos`+ element["id"]+ `" class="list-group-item list-group-item-action relacional-dropdown-element-avisos">
                                <div class="d-flex align-items-center">
                                    <input class="lista-itens mr-3" type="checkbox" id="avisos`+ element["id"]+ `" name="avisos[]" value="`+ element["id"]+ `">
                                    <div class="body-content-avisos">
                                        <div class="titulo-avisos">`+ element["titulo"] + `</div>
                                        <small>` + element["mensagem"] + `</small>
                                    </div>
                                </div>
                            </label>
                        `;
                    });

                    htmlDropdown += '</div>';

                    $('#modalConfImp #collapseAvisos .relacional-dropdown-wrapper .dropdown-menu .dropdown-menu-wrapper').html(htmlDropdown);
                    $('#collapseAvisos .form-control').removeAttr('disabled');

                }
            });
        })
        .on('change', '#checkAvisos', function() {
            $('#collapseAvisos').collapse('toggle');
        });

        // Eventos responsáveis pelo: Select Dropdown com Pesquisa
        $(document)
            .ready(function () {

                $('.relacional-dropdown-input-avisos').each(function () {

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
                                    <div class="list-group-item list-group-item-action relacional-dropdown-element-avisos">` + element[campo] + `</div>
                                `;
                            });

                            $relacionalDropdown.find('.dropdown-menu-wrapper').html(htmlDropdown);
                        }
                    });
                });
            })
            .on('click', '.relacional-dropdown-element-avisos', function () {

                var $this = $(this),
                    $father = $this.parents('.relacional-dropdown-wrapper'),
                    $input = $father.find('.relacional-dropdown-input-avisos'),
                    $opcoes = $father.find('.dropdown-menu-wrapper'),
                    concatTitleAvisos = [];

                $opcoes.find('.lista-itens:checked').each(function() {
                    concatTitleAvisos.push($(this).siblings('.body-content-avisos').find('.titulo-avisos').text());
                });
                
                $input
                    .val(concatTitleAvisos.join(', '))
                    .change();

            })
            .on('keyup', '.relacional-dropdown-input-avisos', function (event) {

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
                    $elements = $dropdownMenu.find('.relacional-dropdown-element-avisos');

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

        $('.relacional-dropdown-input-avisos')
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
                    $('.relacional-dropdown-element-avisos').show();

                    $filtereds = $dropdownMenu.find('.relacional-dropdown-element-avisos').filter(function () {
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

</script>
<style>
#collapseAvisos .relacional-dropdown-input-avisos {
    background-image: none;
    padding-right: 2.2rem;
    border-color: #ced4da;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
#collapseAvisos .relacional-dropdown-input-avisos:focus {
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}
</style>