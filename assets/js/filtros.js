$(function () {

    function floatPadraoInternacional(valor1){
        valor = valor1;

        if(valor != ""){
            valor = valor.replace(".","").replace(".","").replace(".","").replace(".","");
            valor = valor.replace(",",".");
            valor = parseFloat(valor);
            return valor;
        }else{
            valor = '';
            return valor;
        }
    }

    var dataTable = window.dataTable;

    function addMask (mask, $els) {

        $els.forEach(function (el) {

            if (mask == 'data') {
    
                $(el)
                    .mask('00/00/0000', {maxlength: false})
                    .datepicker();

            } else if (mask == 'monetario') {
                
                $(el)
                    .mask('#.##0,00', {
                        reverse: true
                    });
                    
            } else if (mask == 'numero') {
    
                $(el)
                    .mask('0#');
                    
            } else if (mask == 'porcentagem') {
        
                $(el)
                    .mask('00,00%');
            }
        });
    }

    function removeMask ($removeMask) {

        $elements = $removeMask ? $removeMask : $('#card-body-filtros input[type=text]');
        
        $elements.each(function () {

            var $this = $(this);

            $this
                .val('')
                .removeClass('is-invalid is-valid')
                .siblings('.invalid-feedback').remove();

            $this[0]
                .setCustomValidity('');
            
            $this
                .datepicker('destroy')
                .unmask();
        });
    }

    $(this)
        .on('click', '#excluir-linha', function () {

            var $this = $(this),
                $parent = $this.parents('.filtros');

            $parent.find('select').val('').change();

            $parent.prev(':not(:first-child)').find('.filtros-texto').removeClass('col-lg-6').addClass('col-lg-5');

            $parent.remove();
        })
        .on('change', '#card-body-filtros select', function () {

            // Change dos Selects
            var $this = $(this),
                $pai = $this.parents('.input-group'),
                $inputs = $pai.find('input[type=text]');
                
            $inputs.change();

            removeMask($inputs);

        })
        .on('change', '.filtros-faixa .input-filtro-faixa', function () {

            // Filtros Faixa

            $('.filtros-faixa .input-group').each(function () {

                var $this = $(this),
                    $select = $this.find('select'),
                    $selected = $select.find(':selected'),
                    type = $selected.attr('data-tipo'),
                    selectVal = $select.val(),
                    $min = $this.find('.min'),
                    min = $min.val(),
                    $max = $this.find('.max'),
                    max = $max.val(),
                    mascara = $selected.attr('data-mascara'),
                    stringSearch = '',
                    indexAnterior = $select.attr('data-index-anterior');

                addMask(mascara, [$min, $max]);

                if (mascara == 'monetario'){
                    min = floatPadraoInternacional(min);
                    max = floatPadraoInternacional(max);
                }

                if(mascara == 'data'){
                    min = min.split('/').reverse().join('-');
                    max = max.split('/').reverse().join('-');
                } 

                if (indexAnterior && indexAnterior != selectVal) {
                    dataTable
                        .columns(indexAnterior)
                        .search('')
                        .draw();
                }

                $max[0].setCustomValidity('');
                
                if (min && max) {
                    
                    $max.removeClass('is-invalid');
                    $max[0].setCustomValidity('');
                    $max.siblings('.invalid-feedback').remove();

                    if (min > max) {

                        $max.addClass('is-invalid');

                        $max[0].setCustomValidity('invalid');
                        $max.after('<div class="invalid-feedback col-lg-4 m-0">O valor deste campo deve ser maior que o campo anterior.</div>');
                        
                        $max.val('');
                        $min.val('');

                        dataTable.columns().search('').draw();

                        return false;
                    }
                }

                if (selectVal) {

                    if (min || max) {

                        if(mascara == 'data'){
                            min = min.split('-').reverse().join('/');
                            max = max.split('-').reverse().join('/');
                        } 

                        stringSearch = type + ':' + min + '<>' + max;
                    }

                    dataTable
                        .columns(selectVal)
                        .search(stringSearch)
                        .draw();

                    $select.attr('data-index-anterior', selectVal);
                }
            });
        })
        .on('change', '.filtros-texto .input-filtro-texto', function () {

            // Filtros Texto

            $('.filtros-texto .input-group').each(function () {

                var $this = $(this),
                    $select = $this.find('select'),
                    $input = $this.find('.texto'),
                    inputVal = $input.val(),
                    selectVal = $select.val(),
                    value = inputVal ? inputVal : '',
                    indexAnterior = $select.attr('data-index-anterior');

                if (indexAnterior) {
                    dataTable
                        .columns(indexAnterior)
                        .search('')
                        .draw();
                }

                if (selectVal) {
                    
                    dataTable
                        .columns(selectVal)
                        .search(value)
                        .draw();

                    $select.attr('data-index-anterior', selectVal);
                }
            });
        })
        .on('click', '#limpar-filtro', function () {

            // Limpar Filtros

            var $cardBodyFiltros = $('#card-body-filtros'),
            $select = $cardBodyFiltros.find('select'),
            $searchDataTable = $('#searchDataTable');
            
            removeMask();

            $select
                .val('');

            $searchDataTable
                .val('');

            $cardBodyFiltros
                .find('[type=checkbox]')
                .prop('checked', false);

            dataTable
                .columns()
                .search('')
                .draw();

            dataTable.search('').draw();
            
        })
        .on('change', '[name=movimentacao]', function () {

            // Checkbox

            var $this = $(this),
                $fieldset = $this.parents('fieldset'),
                $checkeds = $fieldset.find(':checked'),
                indexColumn = $this.attr('data-index'),
                lenght = $checkeds.length,
                search = lenght == 2 || lenght == 0 ? '' : $checkeds.val();

            dataTable
                .columns(indexColumn)
                .search(search)
                .draw();
        })
        .on('click', '#criar-filtro', function () {

            var $filtros = $('.filtros');

            if ($filtros.length < 5) {

                $cloned = $filtros.first().clone();
                $cloned.find('input').val('');

                if ($filtros.length >= 2) {
                    $filtros.not($cloned).find('.filtros-texto').removeClass('col-lg-5').addClass('col-lg-6');
                    $cloned.find('.filtros-texto').removeClass('col-lg-6').addClass('col-lg-5');
                } else {
                    $cloned.find('.filtros-texto').removeClass('col-lg-6').addClass('col-lg-5');
                }

                $cloned.find('.filtros-faixa .input-filtro-faixa').removeClass('is-invalid').siblings('.invalid-feedback').remove();

                $cloned.appendTo('#card-body-filtros .filtros-wrapper');
            }
        })
        .on('click', '#criar-filtro, #excluir-linha', function (event) {

            event.stopPropagation();

            var $criar = $('#criar-filtro'),
                $filtros = $('.filtros');

            if ($filtros.length == 5) {
                $criar.hide();
            } else if($filtros.length < 5) {
                $criar.show();
            }
        });

        $('#collapseFiltros')
            .on('hide.bs.collapse', function () {
                $('#tituloHeader .fas').removeClass('fa-minus').addClass('fa-plus');
            })
            .on('show.bs.collapse', function () {
                $('#tituloHeader .fas').removeClass('fa-plus').addClass('fa-minus');
            });
          
});