$(function () {

    var $formContatos = $('table#contatos thead tr[role=form]'),
        lastInsertId = 0,
        botoes = `
            <td class="col-lg-2">
                <a href="javascript:void(0)" class="editar-contato btn btn-sm btn-primary">
                    <i class="fas fa-edit"></i>
                </a>
                <a href="javascript:void(0)" class="excluir-contato btn btn-sm btn-danger">
                    <i class="fas fa-trash-alt"></i>
                </a>
            </td>
        `;

    // [Editar] Esse trecho de código abaixo serve para quando a pagina for carregada
    // Ler o campo hidden e montar a tabela com os contatos daquele registro
    Contatos().forEach(function (contato) {
        Popula(contato);
    });

    $('#contatos-form').submit(function (event) {
        
        event.preventDefault();

        var $form = $(this)[0],
            $fields = $($form).find('.form-control');

        // Desfocar os campos para validar
        $fields.trigger('blur');

        if ($form.checkValidity() && !$($form).find('.is-invalid').length) {

            Save();

            // Limpar formulario
            $form.reset();
            $($form).removeClass('was-validated');
            
            $fields
                .removeClass('is-valid is-invalid')
                .removeAttr('data-anterior');

            $fields.first().focus();
        } else {
            $($form).addClass('was-validated');

            // Da foco no primeiro campo com erro
            $($form).find('.is-invalid, :invalid').first().focus();
        }
    });

    // Retorna um array de contatos puxados do campo hidden com o atributo nome igual a contatos
    function Contatos() {
        var returnContatos = [];
        if ($('[name=contatos]') && $('[name=contatos]').val().length) {
            var contatos = $('[name=contatos]').val().split('[');
            for (var i = 0; i < contatos.length; i++) {
                var contato = contatos[i];
                if (contato.length) {
                    contato = contato.replace(']', '');
                    var dadosContato = contato.split(' * ');
                    returnContatos.push(dadosContato);
                }
            }
        };
        return returnContatos;
    };

    // Escreve o html na tabela
    function Popula(values) {

        if (!values) return;

        var currentId = $formContatos.attr('data-current-id'),
            tds = '';

        // Coloca a tag html TD em volta de cada valor vindo do form de contatos
        values.forEach(value => tds += `<td class="col-lg text-truncate">` + value + `</td>`);

        if (!currentId) {
            // Se for undefined então o contato está sendo criado

            // Auto incrementa os ID's dos contatos
            lastInsertId += 1;

            $('#contatos tbody')
                .prepend('<tr class="d-flex flex-column flex-lg-row" data-id="' + lastInsertId + '">' + tds + botoes + '</tr>');

        } else {
            // Caso tenha algum valor é por que o contato está sendo editado

            $('#contatos tbody tr[data-id="' + currentId + '"]')
                .html(tds + botoes);

            // Seta o data id como undefined para novos contatos poderem ser cadastrados
            $formContatos.removeAttr('data-current-id');
        }

        $('.editar-contato').bind('click', Edit);
        $('.excluir-contato').bind('click', Delete);
    };

    // Pega as linhas da tabela auxiliar e manipula o hidden de contatos
    function SetInput() {
        var content = '';
        $('#contatos tbody tr').each(function () {
            var par = $(this).closest('tr');
            var tdNome = par.children("td:nth-child(1)");
            var tdSetor = par.children("td:nth-child(2)");
            var tdTelefone = par.children("td:nth-child(3)");
            var tdRamal = par.children("td:nth-child(4)");
            var tdCelular = par.children("td:nth-child(5)");
            var tdEmail = par.children("td:nth-child(6)");

            content += '[' + tdNome.text() + ' * ' + tdSetor.text() + ' * ' + tdTelefone.text() + ' * ' + tdRamal.text() + ' * ' + tdCelular.text() + ' * ' + tdEmail.text() + ']';
        });

        $('[name=contatos]')
            .val(content)
            .attr('data-anterior-aux', content)
            .change();
    };

    // Delete contato da tabela e do hidden
    function Delete() {
        var par = $(this).closest('tr');
        par.remove();
        SetInput();
    };

    // Seta no form o contato clicado para editar, desabilita os botoes de ações deste contato e seta o id desse contato
    // no form dos contatos
    function Edit() {

        // Volta para válido todos os botoões de editar e excluir
        $('table#contatos tbody tr .btn')
            .removeClass('disabled');


        var $par = $(this).closest('tr'),
            tdNome = $par.children("td:nth-child(1)"),
            tdSetor = $par.children("td:nth-child(2)"),
            tdTelefone = $par.children("td:nth-child(3)"),
            tdRamal = $par.children("td:nth-child(4)")
            tdCelular = $par.children("td:nth-child(5)"),
            tdEmail = $par.children("td:nth-child(6)");

        // Desabilita ele mesmo e os botões irmãos de editar e excluir da linha atual
        $par
            .find('.btn')
            .addClass('disabled');

        $('input[name=contato_nome]').val(tdNome.text()).attr('data-anterior', tdNome.text()).focus();
        $('input[name=contato_setor]').val(tdSetor.text()).attr('data-anterior', tdSetor.text());
        $('input[name=contato_telefone]').val(tdTelefone.text()).attr('data-anterior', tdTelefone.text());
        $('input[name=contato_ramal]').val(tdRamal.text()).attr('data-anterior', tdRamal.text());
        $('input[name=contato_celular]').val(tdCelular.text()).attr('data-anterior', tdCelular.text());
        $('input[name=contato_email]').val(tdEmail.text()).attr('data-anterior', tdEmail.text());

        $('table#contatos thead tr[role=form]')
            .attr('data-current-id', $par.attr('data-id'))
            .find('.is-valid, .is-invalid')
            .removeClass('is-valid is-invalid');
    };

    // Ao dar submit neste form, chama essa função que pega os dados do formula e Popula a tabela
    function Save() {

        Popula([
            $('input[name=contato_nome]').val(),
            $('input[name=contato_setor]').val(),
            $('input[name=contato_telefone]').val(),
            $('input[name=contato_ramal]').val(),
            $('input[name=contato_celular]').val(),
            $('input[name=contato_email]').val()
        ]);

        SetInput();
    };

    // Validação se o nome já existe entre os contatos daquela tabela auxiliar
    $('[name=contato_nome]').blur(function () {

        var $this = $(this),
            contatos = Contatos(),
            nomes = [];

        $this.removeClass('is-valid is-invalid');
        $this.siblings('.invalid-feedback').remove();

        if (contatos) {

            // Posição 0 é o nome do contato
            contatos.forEach(contato => nomes.push(contato[0].toLowerCase()));

            if ($this.val()) {

                var value = $this.val().toLowerCase(),
                    dtAnteriorLower = $this.attr('data-anterior') ? $this.attr('data-anterior') : '';

                if (dtAnteriorLower.toLowerCase() != value) {

                    $this.removeClass('is-invalid is-valid');
                    $this[0].setCustomValidity('');
                    
                    if (nomes.indexOf(value) == -1) {
                        // Não existe, pode seguir

                        $this.addClass('is-valid');

                        $this[0].setCustomValidity('');
                    } else {
                        // Já existe, erro

                        $this.addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Já existe um contato com este nome</div>');
                    }
                }
            }

        }
    });
});