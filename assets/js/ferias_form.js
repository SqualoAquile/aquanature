$(function () {

    //// tabelas de férias
    var $formContatos = $('table#ferias thead tr[role=form]'),
        lastInsertId = 0,
        botoes = `
            <td class="col-lg">
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

    // Retorna um array de contatos puxados do campo hidden com o atributo nome igual a contatos
    function Contatos() {
        var returnContatos = [];
        if ($('[name=ferias]') && $('[name=ferias]').val().length) {
            var contatos = $('[name=ferias]').val().split('[');
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

            $('#ferias tbody')
                .prepend('<tr class="d-flex flex-column flex-lg-row" data-id="' + lastInsertId + '">' + tds + botoes + '</tr>');

        } else {
            // Caso tenha algum valor é por que o contato está sendo editado

            $('#ferias tbody tr[data-id="' + currentId + '"]')
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
        $('#ferias tbody tr').each(function () {
            var par = $(this).closest('tr');
            var tdInicio = par.children("td:nth-child(1)");
            var tdFim = par.children("td:nth-child(2)");
            var tdRetorno = par.children("td:nth-child(3)");
            var tdDias = par.children("td:nth-child(4)");
            var tdPeriodo = par.children("td:nth-child(5)");

            content += '[' + tdInicio.text() + ' * ' + tdFim.text() + ' * ' + tdRetorno.text() + ' * ' + tdDias.text() + ' * ' + tdPeriodo.text() + ']';
        });

        $('[name=ferias]')
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
        $('table#ferias tbody tr .btn')
            .removeClass('disabled');


        var $par = $(this).closest('tr'),
            tdInicio = $par.children("td:nth-child(1)"),
            tdFim = $par.children("td:nth-child(2)"),
            tdRetorno = $par.children("td:nth-child(3)"),
            tdDias = $par.children("td:nth-child(4)")
            tdPeriodo = $par.children("td:nth-child(5)"),

        // Desabilita ele mesmo e os botões irmãos de editar e excluir da linha atual
        $par
            .find('.btn')
            .addClass('disabled');

        $('input[name=ferias_inicio]').val(tdInicio.text()).attr('data-anterior', tdInicio.text()).focus();
        $('input[name=ferias_fim]').val(tdFim.text()).attr('data-anterior', tdFim.text());
        $('input[name=ferias_retorno]').val(tdRetorno.text()).attr('data-anterior', tdRetorno.text());
        $('input[name=ferias_dias]').val(tdDias.text()).attr('data-anterior', tdDias.text());
        $('input[name=ferias_periodo]').val(tdPeriodo.text()).attr('data-anterior', tdPeriodo.text());

        $('table#ferias thead tr[role=form]')
            .attr('data-current-id', $par.attr('data-id'))
            .find('.is-valid, .is-invalid')
            .removeClass('is-valid is-invalid');
    };

    // Ao dar submit neste form, chama essa função que pega os dados do formula e Popula a tabela
    function Save() {

        Popula([
            $('input[name=ferias_inicio]').val(),
            $('input[name=ferias_fim]').val(),
            $('input[name=ferias_retorno]').val(),
            $('input[name=ferias_dias]').val(),
            $('input[name=ferias_periodo]').val()
        ]);

        SetInput();
    };

    $('#ferias-form').submit(function (event) {
        console.log('aqui');
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

    // Validação se o nome já existe entre os contatos daquela tabela auxiliar
    $('[name=ferias_inicio]').blur(function () {

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

                        $this.after('<div class="invalid-feedback">Já existe essa data de início.</div>');
                    }
                }
            }

        }
    });

    $('#ferias_inicio, #ferias_fim').on('change blur',function(){
        var dtMaior = $('#ferias_fim');
        var dtMenor = $('#ferias_inicio');
        var dias = $('#ferias_dias');
        var diascorridos = diferencaEntreDatas(dtMenor.val(), dtMaior.val() );

        if( diascorridos != -1 ){
            return dias.val(diascorridos);
        }
    });
});

function diferencaEntreDatas(dtMenor, dtMaior){

    if (dtMenor != '' && dtMenor != undefined && dtMaior != '' && dtMaior != undefined){
        var date1 = '', dt1aux = '', date2 = '', dt2aux = '';
        // To set two dates to two variables
        dt1aux = dtMenor.split('/');
        dt1aux = dt1aux[1] + '/' + dt1aux[0] + '/' + dt1aux[2];
        
        dt2aux = dtMaior.split('/');
        dt2aux = dt2aux[1] + '/' + dt2aux[0] + '/' + dt2aux[2];

        var date1 = new Date(dt1aux); 
        var date2 = new Date(dt2aux); 
    
        // To calculate the time difference of two dates 
        var diferenca = date2.getTime() - date1.getTime(); 
    
        // To calculate the no. of days between two dates 
        var diferencaEmDias = diferenca / (1000 * 3600 * 24); 
    
        //To display the final no. of days (result) 
        return diferencaEmDias; 
    }else{
        return -1;
    }
    

};

