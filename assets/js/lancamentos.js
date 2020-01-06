window.onload = function () {
    window.onload = function () {

    //ativa as opções de despesas
    $('#ireceita').click();
    $('#ireceita').change();
    $('#idespesa').click();

    $("#ianalitica").css("background-color", "#CCC");
    $("#ianalitica").attr("disabled", "disabled");


    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    $("#idtop").attr("type", "date");
    $("#idtop").attr("value", today);

    limpaCondPgto();

    $('.edicaoinfo').hide();
    $('.itenscaixa').hide();

    $("#infocartao").hide();
    $("#infoparcela").hide();
    $("#infocusto").hide();

};
}
function limpaCondPgto() {
    $("#icondpgto").val("");
    $("#icondpgto").css("background-color", "#CCC");
    $("#icondpgto").attr("disabled", "disabled");

    $("#iadmcartao").val("");
    $("#iadmcartao").css("background-color", "#CCC");
    $("#iadmcartao").attr("disabled", "disabled");
    $("#ibandeira").val("");
    $("#ibandeira").css("background-color", "#CCC");
    $("#ibandeira").attr("disabled", "disabled");

    $("#infocartao").hide();

    $("#inroparcela").val("");
    $("#inroparcela").css("background-color", "#CCC");
    $("#inroparcela").attr("disabled", "disabled");
    $("#idiavenc").val("");
    $("#idiavenc").css("background-color", "#CCC");
    $("#idiavenc").attr("disabled", "disabled");

    $("#infoparcela").hide();

    $("#itxcobrada").val("");
    $("#itxcobrada").css("background-color", "#CCC");
    $("#itxcobrada").attr("disabled", "disabled");
    $("#icustofin").val("");
    $("#icustofin").css("background-color", "#CCC");
    $("#icustofin").attr("disabled", "disabled");

    $("#infocusto").hide();
}

function validaDat(valor) {
    var date = valor;
    var ardt = new Array;
    var ExpReg = new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
    ardt = date.split("/");
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

function calculatxcartao() {
    $('#itxcobrada').val(0);
    $("#icustofin").val(0);
    //pegar as taxas quando o pagamento é débito - credito com jutos, parcelado e antecipado
    if ($("#iformapgto :selected").val() != "" & $("#icondpgto :selected").val() != "" & $("#iadmcartao :selected").val() != "" & $("#ibandeira :selected").val() != "" &
        $("#inroparcela :selected").val() != "" & $("#ivalortotal").val() != "" & $("#ivalortotal").val() != 0) {
        if ($("#ireceita").is(":checked")) {
            if ($("#inroparcela :selected").val() != 0) {
                $('#itxcobrada').val(0);
                if ($("#iformapgto :selected").html() == "Cartão Crédito") {
                    if ($("#icondpgto :selected").html() == "Com Juros") {
                        var txsa = $('#ibandeira :selected').attr("data-info");
                        txsa = txsa.split("-");
                        txsa = parseFloat(txsa[2]).toFixed(2);
                        $('#itxcobrada').val(txsa + "%");

                        var vltot = $("#ivalortotal").val();
                        vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                        vltot = vltot.replace(",", ".");
                        vltot = parseFloat(vltot);
                        vltot = vltot * parseFloat((txsa / 100));
                        vltot = parseFloat(vltot).toFixed(2);
                        vltot = vltot.replace(".", ",");
                        $("#icustofin").val(vltot);
                    }
                    if ($("#icondpgto :selected").html() == "Parcelado") {
                        var txsb = $('#ibandeira :selected').attr("data-txcred");
                        txsb = txsb.split("-");
                        var nropa = $("#inroparcela :selected").val();
                        txsb = parseFloat(txsb[(nropa - 1)]).toFixed(2);
                        $('#itxcobrada').val(txsb + "%");

                        var vltot = $("#ivalortotal").val();
                        vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                        vltot = vltot.replace(",", ".");
                        vltot = parseFloat(vltot);
                        vltot = vltot * parseFloat((txsb / 100));
                        vltot = parseFloat(vltot).toFixed(2);
                        vltot = vltot.replace(".", ",");
                        $("#icustofin").val(vltot);

                    }
                    if ($("#icondpgto :selected").html() == "Antecipado") {
                        var txsc = $('#ibandeira :selected').attr("data-txant");
                        txsc = txsc.split("-");
                        var nropb = $("#inroparcela :selected").val();
                        txsc = parseFloat(txsc[(nropb - 1)]).toFixed(2);
                        $('#itxcobrada').val(txsc + "%");

                        var vltot = $("#ivalortotal").val();
                        vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                        vltot = vltot.replace(",", ".");
                        vltot = parseFloat(vltot);
                        vltot = vltot * parseFloat((txsc / 100));
                        vltot = parseFloat(vltot).toFixed(2);
                        vltot = vltot.replace(".", ",");
                        $("#icustofin").val(vltot);
                    }
                    else {

                    }
                }
            }
            if ($("#iformapgto :selected").html() == "Cartão Débito") {
                var txsd = $('#ibandeira :selected').attr("data-info");
                txsd = txsd.split("-");
                txsd = parseFloat(txsd[0]).toFixed(2);
                $('#itxcobrada').val(txsd + "%");

                var vltot = $("#ivalortotal").val();
                vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                vltot = vltot.replace(",", ".");
                vltot = parseFloat(vltot);
                vltot = vltot * parseFloat((txsd / 100));
                vltot = parseFloat(vltot).toFixed(2);
                vltot = vltot.replace(".", ",");
                $("#icustofin").val(vltot);
            }
        }
    }
}

$(document).ready(function () {

    // coloca as máscaras nos inputs
    $('#inropedido').mask("0000000");
    $('#ivalortotal').mask("#.##0,00", { reverse: true });
    $('#icustofin').mask("#.##0,00", { reverse: true });
    $('#ivtotaux').mask("#.##0,00", { reverse: true });
    //validação do nro de pedido(se existe e se está em aberto)
    //verificar o favorecido do lançamento (cliente e/ou fornecedor)

    // deixa o enter destivado para submitar o formulario
    $('input').keypress(function (e) {
        var code = null;
        code = (e.keyCode ? e.keyCode : e.which);
        return (code == 13) ? false : true;
    });
    // valor total do lançamento deve ser maior do que zero
    $("#ivalortotal").blur(function () {
        var valor = $("#ivalortotal").val();
        valor = valor.replace(",", ".");
        var valortot = parseFloat(valor).toFixed(2);
        if (parseFloat(valor).toFixed(2) <= 0) {
            $("#ivalortotal").val("");
            alert("O valor deve ser maior do que zero (0).");
        } else {
            calculatxcartao();
        }

    });
    //quando muda o radio despesa/receita - buscas as contas sinteticas
    $('input[type=radio]').change(function () {

        if ($("#ireceita").is(":checked")) {
            $("#ifavorecido").attr("placeholder", "Pagante do Lançamento");
        } else {
            $("#ifavorecido").attr("placeholder", "Favorecido do Lançamento");
        }

        $('#iformapgto').val("");
        $('#iformapgto').change();

        $('#ianalitica').empty();
        $('#ianalitica').append('<option value="" selected disabled>Conta Analítica</option>');
        $('#ianalitica').attr('disabled', 'disabled');
        $("#ianalitica").css("background-color", "#CCC");

        var nome = $(this).val();
        var action = "buscaSinteticas";
        if (nome != '') {
            $.ajax({
                url: baselink + "/ajax/" + action,
                type: "POST",
                data: { q: nome },   //acentos, cedilha, caracteres diferentes causam erro, precisam ser passados para utf8 antes de receber
                dataType: "json", //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
                success: function (json) {
                    //limpei o select e coloquei a primeira opção (placeholder) 
                    $('#isintetica').empty();
                    //adiciona os options respectivos
                    $('#isintetica').append('<option value="" selected disabled>Conta Sintética</option>');
                    if (json.length > 0) {
                        //insere as contas sinteticas especificas
                        for (var i = 0; i < json.length; i++) {
                            $('#isintetica').append('<option value=' + json[i].id + '>' + json[i].nome + '</option>');
                        }
                        $('#isintetica').removeAttr('disabled');
                    }
                }
            });
        }
    });

    //quando muda o select sintetica - buscas as contas analítica respectivas
    $('#isintetica').focus(function () {
        if ($('#isintetica option').length <= 1) {
            if ($("#idespesa").is(":checked")) {
                $('#idespesa').click();
                $('#idespesa').change();
            } else {
                $('#ireceita').click();
                $('#ireceita').change();
            }
        }
    });


    $('#isintetica').change(function () {
        var id = $(this).val();
        var action = "buscaAnaliticas";
        if (id != '') {
            $.ajax({
                url: baselink + "/ajax/" + action,
                type: "POST",
                data: { q: id },   //acentos, cedilha, caracteres diferentes causam erro, precisam ser passados para utf8 antes de receber
                dataType: "json", //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
                success: function (json) {
                    //limpei o select e coloquei a primeira opção (placeholder) 
                    $('#ianalitica').empty();
                    //adiciona os options respectivos
                    $('#ianalitica').append('<option value="" selected disabled>Conta Analítica</option>');
                    if (json.length > 0) {
                        //insere as contas sinteticas especificas
                        for (var i = 0; i < json.length; i++) {
                            $('#ianalitica').append('<option value=' + json[i].id + '>' + json[i].nome + '</option>');
                        }
                    }
                    $('#ianalitica').removeAttr('disabled');
                    $("#ianalitica").css("background-color", "#FFF");
                }
            });
        }
    });
    //quando muda o select forma de pagamento - preenche adequadamente o select condição de pagamento
    $('#iformapgto').change(function () {
        limpaCondPgto();
        if ($("#iformapgto :selected").val() != "") {
            $("#icondpgto").val("");
            $("#icondpgto").css("background-color", "#FFF");
            $("#icondpgto").removeAttr("disabled");

            switch ($('#iformapgto :selected').html()) {
                case ('Cartão Débito'):
                    $("#icondpgto").empty();
                    $('#icondpgto').append('<option value="" disabled>Condição de Pagamento</option>');
                    $("#icondpgto").append('<option value="À Vista" selected>À Vista</option>');
                    $("#icondpgto").css("background-color", "#CCC");
                    $("#icondpgto").attr("disabled", "disabled");
                    $("#icondpgto").change();
                    break;
                case ('Cartão Crédito'):
                    if ($("#idespesa").is(":checked")) {
                        $("#icondpgto").empty();
                        $('#icondpgto').append('<option value="" disabled>Condição de Pagamento</option>');
                        $("#icondpgto").append('<option value="Parcelado" selected>Parcelado</option>');
                        $("#icondpgto").css("background-color", "#CCC");
                        $("#icondpgto").attr("disabled", "disabled");
                        $("#icondpgto").change();
                    } else {
                        $("#icondpgto").empty();
                        $('#icondpgto').append('<option value="" disabled selected>Condição de Pagamento</option>');
                        $("#icondpgto").append('<option value="Com Juros">Com Juros</option>');
                        $("#icondpgto").append('<option value="Parcelado">Parcelado</option>');
                        $("#icondpgto").append('<option value="Antecipado">Antecipado</option>');
                        $("#icondpgto").css("background-color", "#FFF");
                        $("#icondpgto").removeAttr("disabled");
                    }
                    break;
                default:
                    $("#icondpgto").empty();
                    $('#icondpgto').append('<option value="" disabled selected>Condição de Pagamento</option>');
                    $("#icondpgto").append('<option value="À Vista">À Vista</option>');
                    $("#icondpgto").append('<option value="Parcelado">Parcelado</option>');
                    $("#icondpgto").css("background-color", "#FFF");
                    $("#icondpgto").removeAttr("disabled");
                    break;
            }
        }
    });
    //quando muda o valor do select condição de pagamento
    $('#icondpgto').change(function () {
        if ($('#icondpgto :selected').html() == "") {
            $("#iadmcartao").val("");
            $("#iadmcartao").css("background-color", "#CCC");
            $("#iadmcartao").attr("disabled", "disabled");
            $("#ibandeira").val("");
            $("#ibandeira").css("background-color", "#CCC");
            $("#ibandeira").attr("disabled", "disabled");

            $("#infocartao").slideUp("fast");

            $("#inroparcela").val("");
            $("#inroparcela").css("background-color", "#CCC");
            $("#inroparcela").attr("disabled", "disabled");
            $("#idiavenc").val("");
            $("#idiavenc").css("background-color", "#CCC");
            $("#idiavenc").attr("disabled", "disabled");

            $("#infoparcela").slideUp("fast");

            $("#itxcobrada").val("");
            $("#itxcobrada").css("background-color", "#CCC");
            $("#itxcobrada").attr("disabled", "disabled");
            $("#icustofin").val("");
            $("#icustofin").css("background-color", "#CCC");
            $("#icustofin").attr("disabled", "disabled");

            $("#infocusto").slideUp("fast");
            return;
        }
        if ($('#idtop').val() == "" | $('#ivalortotal').val() == "") {
            $('#iformapgto').val("");
            limpaCondPgto();
            alert("Preencha a data e/ou o valor do lançamento.");
            return;
        }

        switch ($('#iformapgto :selected').html()) {
            case ('Dinheiro'):
            case ('Cheque'):
            case ('Boleto'):
            case ('TED'):
            case ('DOC'):
            case ('Transferência'):
                $("#iadmcartao").val("");
                $("#iadmcartao").css("background-color", "#CCC");
                $("#iadmcartao").attr("disabled", "disabled");

                $("#ibandeira").val("");
                $("#ibandeira").css("background-color", "#CCC");
                $("#ibandeira").attr("disabled", "disabled");

                $("#infocartao").slideUp("fast");

                $("#itxcobrada").val("0");
                $("#itxcobrada").css("background-color", "#CCC");
                $("#itxcobrada").attr("disabled", "disabled");

                if ($("#idespesa").is(":checked")) {
                    if ($('#iformapgto :selected').html() == "Dinheiro" | $('#iformapgto :selected').html() == "Boleto" | $('#iformapgto :selected').html() == "Cheque") {
                        $("#infocusto").slideUp("fast");
                    } else {
                        $("#infocusto").slideDown("fast");
                    }
                } else {
                    if ($('#iformapgto :selected').html() == "Boleto") {
                        $("#infocusto").slideDown("fast");
                    } else {
                        $("#infocusto").slideUp("fast");
                    }
                }
                if ($('#icondpgto :selected').html() == "À Vista") {
                    $("#inroparcela").val(0);
                    $("#inroparcela").css("background-color", "#CCC");
                    $("#inroparcela").attr("disabled", "disabled");

                    var valor = $("#idtop").val();
                    valor = valor.split("-");
                    var dia = valor[2];
                    $("#idiavenc").val(dia);
                    $("#idiavenc").css("background-color", "#CCC");
                    $("#idiavenc").attr("disabled", "disabled");

                    $("#infoparcela").slideUp("fast");

                } else {
                    $("#inroparcela").val("");
                    $("#inroparcela").css("background-color", "#FFF");
                    $("#inroparcela").removeAttr("disabled");

                    $("#idiavenc").val("");
                    $("#idiavenc").css("background-color", "#FFF");
                    $("#idiavenc").removeAttr("disabled");

                    $("#infoparcela").slideDown("fast");
                }
                break;

            case ('Cartão Débito'):
            case ('Cartão Crédito'):
                if ($('#icondpgto :selected').html() == "À Vista") {
                    $("#inroparcela").val(0);
                    $("#inroparcela").css("background-color", "#CCC");
                    $("#inroparcela").attr("disabled", "disabled");

                    var valor = $("#idtop").val();
                    valor = valor.split("-");
                    var dia = valor[2];
                    $("#idiavenc").val(dia);
                    $("#idiavenc").css("background-color", "#CCC");
                    $("#idiavenc").attr("disabled", "disabled");

                    $("#infoparcela").slideUp("fast");
                } else {
                    $("#inroparcela").val("");
                    $("#inroparcela").css("background-color", "#FFF");
                    $("#inroparcela").removeAttr("disabled");

                    $("#idiavenc").val(dia);
                    $("#idiavenc").css("background-color", "#FFF");
                    $("#idiavenc").removeAttr("disabled");

                    $("#infoparcela").slideDown("fast");
                }
                if ($("#idespesa").is(":checked")) {
                    $("#iadmcartao").val("");
                    $("#iadmcartao").css("background-color", "#CCC");
                    $("#iadmcartao").attr("disabled", "disabled");

                    $("#ibandeira").val("");
                    $("#ibandeira").css("background-color", "#CCC");
                    $("#ibandeira").attr("disabled", "disabled");

                    $("#infocartao").slideUp("fast");

                    $("#itxcobrada").val("0");
                    $("#itxcobrada").css("background-color", "#CCC");
                    $("#itxcobrada").attr("disabled", "disabled");

                    $("#infocusto").slideUp("fast");
                } else {
                    $("#iadmcartao").val("");
                    $("#iadmcartao").css("background-color", "#FFF");
                    $("#iadmcartao").removeAttr("disabled");

                    $("#infocartao").slideDown("fast");

                    $("#itxcobrada").val("0");
                    $("#itxcobrada").css("background-color", "#CCC");
                    $("#itxcobrada").attr("disabled", "disabled");

                    $("#infocusto").slideDown("fast");
                }
                break;
            default:
                break;
        }

        // CUSTO DE OPERAÇÃO FINANCEIRA
        $("#icustofin").val("");
        switch ($('#iformapgto :selected').html()) {
            case ('Dinheiro'):
            case ('Cartão Débito'):
            case ('Cartão Crédito'):
            case ('Cheque'):
                $("#icustofin").val(0);
                $("#icustofin").css("background-color", "#CCC");
                $("#icustofin").attr("disabled", "disabled");
                break;
            case ('TED'):
            case ('DOC'):
            case ('Transferência'):
                if ($("#idespesa").is(":checked")) {
                    $("#icustofin").val("");
                    $("#icustofin").css("background-color", "#FFF");
                    $("#icustofin").removeAttr("disabled");
                } else {
                    $("#icustofin").val(0);
                    $("#icustofin").css("background-color", "#CCC");
                    $("#icustofin").attr("disabled", "disabled");
                }
                break;
            case ('Boleto'):
                if ($("#idespesa").is(":checked")) {
                    $("#icustofin").val(0);
                    $("#icustofin").css("background-color", "#CCC");
                    $("#icustofin").attr("disabled", "disabled");
                } else {
                    $("#icustofin").val("");
                    $("#icustofin").css("background-color", "#FFF");
                    $("#icustofin").removeAttr("disabled");
                }
                break;
            default:
                $("#icustofin").val("");
                $("#icustofin").css("background-color", "#FFF");
                $("#icustofin").removeAttr("disabled");
                break;
        }
    });
    // quando troca a administradora de cartão
    $('#iadmcartao').change(function () {
        $('#itxcobrada').val(0);
        if ($("#ireceita").is(":checked")) {
            if ($('#icondpgto :selected').html() != "À Vista") {
                $('#ibandeira').val("");
                $('#ibandeira').attr('disabled', 'disabled');
                $("#ibandeira").css("background-color", "#CCC");

                $('#inroparcela').val("");
                $('#inroparcela').removeAttr('disabled');
                $("#inroparcela").css("background-color", "#FFF");

                $('#idiavenc').val("");
                $('#idiavenc').removeAttr('disabled');
                $("#idiavenc").css("background-color", "#FFF");
            }
        }
        var id = $(this).val();
        var action = "buscaBandeiras";
        if (id != '') {
            $.ajax({
                url: baselink + "/ajax/" + action,
                type: "POST",
                data: { q: id },   //acentos, cedilha, caracteres diferentes causam erro, precisam ser passados para utf8 antes de receber
                dataType: "json", //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
                success: function (json) {
                    //limpei o select e coloquei a primeira opção (placeholder) 
                    $('#ibandeira').empty();
                    //adiciona os options respectivos
                    $('#ibandeira').append('<option value="" selected disabled>Bandeira</option>');
                    if (json.length > 0) {
                        //insere as contas sinteticas especificas
                        for (var i = 0; i < json.length; i++) {
                            $('#ibandeira').append('<option value=' + json[i].id + ' data-info=' + json[i].informacoes + ' data-txant=' + json[i].txantecipacao + '\
                                                     data-txcred='+ json[i].txcredito + '>' + json[i].nome + '</option>');
                        }
                    }
                    $('#ibandeira').removeAttr('disabled');
                    $("#ibandeira").css("background-color", "#FFF");
                }
            });
        }
        calculatxcartao();
    });
    $('#iadmcartao').blur(function () {
        calculatxcartao();
    });

    //quando troca o select da bandeira
    $('#ibandeira').change(function () {
        calculatxcartao();
    });
    $('#ibandeira').blur(function () {
        calculatxcartao();
    });
    //quando sai do select número de parcelas
    $('#inroparcela').change(function () {
        if ($("#ireceita").is(":checked")) {
            calculatxcartao();
        }
    });
    $('#inroparcela').blur(function () {
        if ($('#icondpgto :selected').html() != "À Vista") {
            if ($('#inroparcela').val() == 0) {
                $('#inroparcela').val("");
                alert("O número de parcelas não pode ser igual a zero.");
                return;
            }
        }
        calculatxcartao();
    });

    $("#idtvencaux").blur(function () {
        var valor = $("#idtvencaux").val();
        valor = valor.split("-");
        var data = valor[2] + "/" + valor[1] + "/" + valor[0];
        if (valor != "") {
            if (valor[0].length > 4) {
                $("#idtop").val("");
                $("#idtop").blur();
                alert("não é uma data válida!!!");
                return;
            }
            if (validaDat(data) == false) {
                $("#idtop").val("");
                alert("não é uma data válida!!!");
                $("#idtop").blur();
                return;
            }

            var dtori = $("#idtvencaux").attr('data-dtop');
            dtori = dtori.split("/");
            var dtoriginal = new Date(dtori[2], parseInt(dtori[1]) - 1, dtori[0]);

            var dtmod = $("#idtvencaux").val();
            dtmod = dtmod.split("-");
            var dtmodificada = new Date(dtmod[0], parseInt(dtmod[1]) - 1, dtmod[2]);

            if (dtmodificada < dtoriginal) {
                $("#idtvencaux").val("");
                $("#idtvencaux").blur();
                alert("A data de vencimento deve ser maior do que a data de operação.");
                return;
            }

        }
    });
    $("#ivtotaux").blur(function () {
        var valor = $("#ivtotaux").val();
        valor = valor.replace(",", ".");
        var valortot = parseFloat(valor).toFixed(2);
        if (parseFloat(valor).toFixed(2) <= 0) {
            $("#ivtotaux").val("");
            alert("O valor deve ser maior do que zero (0).");
        }

    });
});

function limparPreenchimento() {

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;

    $("#idtop").focus();
    $("#idtop").val(today);

    $('#inropedido').val("");
    $('#inropedido').blur();
    if ($('#idespesa').is(':checked')) {
        $('#ireceita').click();
        $('#idespesa').click();
    } else {
        $('#idespesa').click();
        $('#ireceita').click();
    }
    $('#idetalhe').val("");
    $('#ifavorecido').val("");
    $('#ivalortotal').val("");
    $('#icc').val("");
    $('#iformapgto').val("");
    $('#iformapgto').change();
    $('#iobserv').val("");

}

function confirmaPreenchimento() {
    if ($('#idtop').val() == "") {
        alert("Preencha o campo de : " + $('#idtop').attr("placeholder") + " no formato dd/mm/aaaa");
        $('#idtop').focus();
        return;
    }
    if ($('#isintetica :selected').val() == "") {
        alert("Preencha o campo de : Conta Sintética");
        $('#isintetica').focus();
        return;
    }
    if ($('#ianalitica :selected').val() == "") {
        alert("Preencha o campo de : Conta Analítica");
        $('#ianalitica').focus();
        return;
    }
    if ($('#idetalhe').val() == "") {
        alert("Preencha o campo de : Descrição do Lançamento");
        $('#idetalhe').focus();
        return;
    }
    if ($('#ifavorecido').val() == "") {
        alert("Preencha o campo de : " + $('#ifavorecido').attr("placeholder"));
        $('#ifavorecido').focus();
        return;
    }
    if ($('#ivalortotal').val() == "") {
        alert("Preencha o campo de : " + $('#ivalortotal').attr("placeholder"));
        $('#ivalortotal').focus();
        return;
    }
    if ($('#icc :selected').val() == "") {
        alert("Preencha o campo de : Conta Corrente");
        $('#icc').focus();
        return;
    }
    if ($('#iformapgto :selected').val() == "") {
        alert("Preencha o campo de : Forma de Pagamento");
        $('#iformapgto').focus();
        return;
    }
    if ($('#icondpgto :selected').val() == "") {
        alert("Preencha o campo de : Condição de Pagamento");
        $('#icondpgto').focus();
        return;
    }
    if ($("#ireceita").is(":checked") & ($("#iformapgto").html() == "Cartão Débito" | $("#iformapgto").html() == "Cartão Crédito")) {
        if ($("#iadmcartao :selected").val() == "") {
            alert("Preencha o campo de : Administradora de Cartão");
            $('#iadmcartao').focus();
            return;
        }
        if ($("#ibandeira :selected").val() == "") {
            alert("Preencha o campo de : Bandeira");
            $('#ibandeira').focus();
            return;
        }
    }
    if ($('#inroparcela :selected').val() == "") {
        alert("Preencha o campo de : " + $('#inroparcela').attr("placeholder"));
        $('#inroparcela').focus();
        return;
    }
    if ($('#idiavenc :selected').val() == "") {
        alert("Preencha o campo de : " + $('#idiavenc').attr("placeholder"));
        $('#idiavenc').focus();
        return;
    }
    if ($('#itxcobrada').val() == "") {
        alert("Preencha o campo de : " + $('#itxcobrada').attr("placeholder"));
        $('#itxcobrada').focus();
        return;
    }
    if ($('#icustofin').val() == "") {
        alert("Preencha o campo de : " + $('#icustofin').attr("placeholder"));
        $('#icustofin').focus();
        return;
    }
    // termino dos testes de preenchimento dos campos necessários
    //
    //início da inserção da nova linha  
    var dtopaux = $("#idtop").val(); //padrao entrada - YYYY-MM-DD >> padrao saída dd/mm/yyyy
    dtopaux = dtopaux.split("-");
    var dtop = dtopaux[2] + "/" + dtopaux[1] + "/" + dtopaux[0];

    if ($("#inropedido").val() != "") {
        var nropedido = parseInt($("#inropedido").val());
    } else {
        var nropedido = "";
    }
    if ($("#ireceita").is(":checked")) {
        var conta = "Receita";
    } else {
        var conta = "Despesa";
    }
    var sintetica = $("#isintetica :selected").html();
    var analitica = $("#ianalitica :selected").html();
    var descricao = $("#idetalhe").val();
    var favorecido = $("#ifavorecido").val();
    var valortotal = $("#ivalortotal").val();
    valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    valortotal = valortotal.replace(",", ".");
    valortotal = parseFloat(valortotal).toFixed(2);
    valortotal = valortotal.replace(".", ",");

    var cc = $("#icc :selected").html();
    var formapgto = $("#iformapgto :selected").html();
    var condpgto = $("#icondpgto :selected").html();
    var admcartao;
    var bandeira;
    if ($("#iadmcartao :selected").val() == "") {
        admcartao = "";
        bandeira = "";
    } else {
        admcartao = $("#iadmcartao :selected").html();
        bandeira = $("#ibandeira :selected").html();
    }
    var nroparc = parseInt($("#inroparcela :selected").val());
    var diavenc = parseInt($("#idiavenc :selected").val());
    var observ = $("#iobserv").val();

    var nomeB = $("#itxcobrada").val();
    var txcobrada = parseFloat(nomeB).toFixed(2);
    //trazer a taxa para percentual
    txcobrada = txcobrada / 100;

    var custofin = $("#icustofin").val();
    custofin = custofin.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    custofin = custofin.replace(",", ".");
    custofin = parseFloat(custofin).toFixed(2);
    custofin = custofin.replace(".", ",");

    if ($("#ireceita").is(":checked")) {
        if (formapgto == "Cartão Débito" & condpgto == "À Vista") {
            var distdias = $('#ibandeira :selected').attr("data-info");
            distdias = distdias.split("-");
            distdias = parseInt(distdias[1]);

        } else if (formapgto == "Cartão Crédito" & condpgto == "Com Juros") {
            var distdias = $('#ibandeira :selected').attr("data-info");
            distdias = distdias.split("-");
            distdias = parseInt(distdias[3]);

        } else if (formapgto == "Cartão Crédito" & condpgto == "Antecipado") {
            var distdias = $('#ibandeira :selected').attr("data-info");
            distdias = distdias.split("-");
            distdias = parseInt(distdias[4]);

        } else {
            var distdias = 0;
        }
    } else {
        var distdias = 0;
    }

    //testar se já tem na tabela os itens selecionados
    if ($("#tabelaenvio tbody").length > 0) {
        var max = 0;
        $("#tabelaenvio tbody tr").each(function () {
            var maxant = parseInt($(this).find('a').attr("data-ident"));
            if (maxant > max) {
                max = maxant;
            }
        });
        max++;
    } else {
        max = 1;
    }

    // lança o valor da receita ou despesa
    var linha = new Array();
    linha = lancaFluxo(max, nropedido, conta, sintetica, analitica, descricao, cc, bandeira, favorecido, dtop, valortotal, formapgto, condpgto, nroparc, diavenc, observ, distdias);
    if (linha.length > 1) {
        for (var i = 0; i < linha.length; i++) {
            $('#tabelaenvio').append(linha[i]);
        }
    } else {
        $('#tabelaenvio').append(linha[0]);
    }

    //lança o custo financeiro caso ele exista
    if (parseFloat(custofin.replace(",", ".")) > 0) {
        //testar se já tem na tabela os itens selecionados
        if ($("#tabelaenvio tbody").length > 0) {
            var max = 0;
            $("#tabelaenvio tbody tr").each(function () {
                var maxant = parseInt($(this).find('a').attr("data-ident"));
                if (maxant > max) {
                    max = maxant;
                }
            });
            max++;
        } else {
            max = 1;
        }

        var linhab = new Array();
        linhab = lancaFluxo(max, nropedido, 'Despesa', 'Despesa Financeira', 'Taxa - ' + formapgto, descricao + ' - Custo Finan.', cc, bandeira, favorecido, dtop, custofin, formapgto, condpgto, nroparc, diavenc, observ, distdias);
        if (linhab.length > 1) {
            for (var i = 0; i < linhab.length; i++) {
                $('#tabelaenvio').append(linhab[i]);
            }
        } else {
            $('#tabelaenvio').append(linhab[0]);
        }
    }

    calcularesumo();
    formataTabela();
    limparPreenchimento();
    $('.itenscaixa').show('slow');

}

function calcularesumo() {
    if ($("#tabelaenvio tbody").length > 0) {
        var receita = 0;
        var recaux = 0;
        var despesa = 0;
        var despaux = 0;
        var total = 0;
        var mov = "";

        $("#tabelaenvio tbody tr").each(function () {
            mov = "";
            recaux = 0;
            despaux = 0;
            mov = $(this).closest('tr').children('td:eq(12)').children('input:eq(0)').attr('value');
            if (mov == "Despesa") {
                despaux = $(this).closest('tr').children('td:eq(2)').children('input:eq(0)').val();
                despaux = despaux.replace(",", ".");
                despaux = parseFloat(despaux);
                despesa = despesa + despaux;
            } else {
                recaux = $(this).closest('tr').children('td:eq(2)').children('input:eq(0)').val();
                recaux = recaux.replace(",", ".");
                recaux = parseFloat(recaux);
                receita = receita + recaux;
            }

            total = (receita - despesa);
        });

        receita = parseFloat(receita).toFixed(2);
        receita = receita.replace(".", ",");


        despesa = parseFloat(despesa).toFixed(2);
        despesa = despesa.replace(".", ",");


        total = parseFloat(total).toFixed(2);
        total = total.replace(".", ",");

        $("label#ireceita").html("<i>Receita   (R$):</i> " + receita);
        $("label#ireceita").css('color', '#265f3d');

        $("label#idespesa").html("<i>Despesa (R$):</i> " + despesa);
        $("label#idespesa").css('color', '#910309');

        $("label#itotal").html("<i>Total   (R$):</i> " + total);

        if (parseFloat(total) < 0) {
            $("label#itotal").css('color', '#910309');
        } else if (parseFloat(total) > 0) {
            $("label#itotal").css('color', '#265f3d');
        } else {
            $("label#itotal").css('color', '#000');
        }

    } else {
        $("label#ireceita").html("<i>Receita   (R$):</i> 0,00");
        $("label#ireceita").css('color', '#265f3d');
        $("label#idespesa").html("<i>Despesa (R$):</i> 0,00");
        $("label#idespesa").css('color', '#910309');
        $("label#itotal").html("<i>Total   (R$):</i> 0,00");
        $("label#itotal").css('color', 'black');
    }
}

function excluir(obj) {
    $(obj).closest('tr').remove();
    calcularesumo();
    formataTabela();
    limparPreenchimento();

    if ($('#tabelaenvio tbody tr').length <= 0) {
        $('.itenscaixa').hide('slow');
    }

}

function limparInputsAux() {
    $('#idtvencaux').val("");
    $('#idtvencaux').attr('data-dtop', "");
    $('#idtvencaux').blur();
    $('#ivtotaux').val("");
    $('#iobservaux').val("");
    $('#ilinhaid').val("");
}

function editar(obj) {

    limparInputsAux();

    var idlinha = $(obj).closest('tr').children('td:eq(0)').children('a:eq(0)').attr('data-ident');
    var vtot = $(obj).closest('tr').children('td:eq(2)').children('input:eq(0)').val();
    var observ = $(obj).closest('tr').children('td:eq(18)').children('input:eq(0)').val();
    var dtvenc = $(obj).closest('tr').children('td:eq(6)').children('input:eq(0)').val();
    dtvenc = dtvenc.split("/");
    var dia = dtvenc[2] + "-" + dtvenc[1] + "-" + dtvenc[0];
    var dtop = $(obj).closest('tr').children('td:eq(10)').children('input:eq(0)').val();

    $("#idtvencaux").focus();
    $("#idtvencaux").val(dia);
    $("#idtvencaux").attr('data-dtop', dtop);

    $('#ivtotaux').val(vtot);
    $('#iobservaux').val(observ);
    $('#ilinhaid').val(idlinha);

    $('.edicaoinfo').show('slow');
    $('#editainfo').css({
        "margin-top": "15px",
        "margin-bottom": "15px",
        "padding": "10px",
        "border": "1px solid #000",
        "border-radius": "20px",
        "background-color": "#959b9b"
    });
}

function confirmaEdicao() {
    //testes de preenchimento das variáveis auxiliares
    if ($('#idtvencaux').val() == "") {
        alert("Preencha o campo de : " + $('#idtvencaux').attr("placeholder") + " no formato dd/mm/aaaa");
        $('#idtvencaux').focus();
        return;
    } else {
        var dtedt = $('#idtvencaux').val();
    }

    if ($('#ivtotaux').val() == "") {
        alert("Preencha o campo de : " + $('#ivtotaux').attr("placeholder"));
        $('#ivtotaux').focus();
        return;
    }

    if ($('#ilinhaid').val() == "") {
        limparInputsAux();
        alert("Essa ação não será possível. Por favor, recomece o processo.");
        return;
    }

    var dtaux = $('#idtvencaux').val();
    dtaux = dtaux.split("-");
    var dtvenc = dtaux[2] + "/" + dtaux[1] + "/" + dtaux[0];

    var vtot = $('#ivtotaux').val();
    vtot = vtot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    vtot = vtot.replace(",", ".");
    vtot = parseFloat(vtot).toFixed(2);
    vtot = vtot.replace(".", ",");
    var observ = $('#iobservaux').val();
    var id = $('#ilinhaid').val();

    if ($("a[data-ident=" + id + "]").length == 2) { // reconhece a linha onde deve ser feita a edição

        $('a[data-ident=' + id + ']').closest('tr').children('td:eq(18)').children('input:eq(0)').val(observ);
        $('a[data-ident=' + id + ']').closest('tr').children('td:eq(2)').children('input:eq(0)').val(vtot);
        $('a[data-ident=' + id + ']').closest('tr').children('td:eq(6)').children('input:eq(0)').val(dtvenc);
        if ($('a[data-ident=' + id + ']').closest('tr').children('td:eq(9)').children('input:eq(0)').val() == "Quitado") {
            $('a[data-ident=' + id + ']').closest('tr').children('td:eq(7)').children('input:eq(0)').val(vtot);
            $('a[data-ident=' + id + ']').closest('tr').children('td:eq(8)').children('input:eq(0)').val(dtvenc);
        }

    }

    calcularesumo();
    formataTabela();
    limparInputsAux();

    $('.edicaoinfo').hide('slow');
}

function cancelaEdicao() {
    limparInputsAux();
    $('.edicaoinfo').hide('slow');
}

function formataTabela() {
    if ($('#tabelaenvio tbody tr').length > 0) {
        for (var col = 1; col <= 18; col++) {
            for (var lin = 0; lin < $('#tabelaenvio tbody tr').length; lin++) {
                largaux = $('#tabelaenvio tbody').children('tr:eq(' + lin + ')').children('td:eq(' + col + ')').children('input:eq(0)').val().length * 8;
                $('#tabelaenvio tbody').children('tr:eq(' + lin + ')').children('td:eq(' + col + ')').children('input:eq(0)').width(largaux);
            }
        }
    }
}

function testeEnvio() {
    if ($('#tabelaenvio tbody tr').length > 0) {
        if (confirm("Tem Certeza?")) {
            return true;
        } else {
            return false;
        }
    } else {
        alert("É necessário, no mínimo, configurar um lançamento.");
        return false;
    }
}

function lancaFluxo(proxid, nropedido, mov, sintetica, analitica, descricao, cc, bandeira, favorecido, dtop, valortotal, formapgto, condpgto, nroparc, diavenc, observ, distdias = 0) {
    /////////////////////////// LANÇAMENTO INTEIRO FEITO A VISTA - EXCLUINDO RECEITA DE CARTÃO DÉBITO
    if ((mov == "Despesa" & condpgto == "À Vista" & bandeira == "") | (mov == "Receita" & condpgto == "À Vista" & formapgto != "Cartão Débito")) {
        var arraylinhas = new Array();
        var linha = "<tr>" +
            "<td>" +
            "<a href='#' class='botao_table_lc' onclick='editar(this)' data-ident='" + proxid + "'>Ed</a>" +
            "<a href='#' class='botao_table_lc' onclick='excluir(this)' data-ident='" + proxid + "'>Ex</a>" +
            "</td>" +
            "<td>" + "<input type='text' name='descricao[" + proxid + "]'  class='input-table-selec'  value='" + descricao + "'  readonly='readonly' required/>" + "</td>" +    //detalhe
            "<td>" + "<input type='text' name='valortotal[" + proxid + "]' class='input-table-selec'  value='" + valortotal + "' readonly='readonly' required/>" + "</td>" +    //valor tot
            "<td>" + "<input type='text' name='formapgto[" + proxid + "]'  class='input-table-selec'  value='" + formapgto + "'  readonly='readonly' required/>" + "</td>" +    //forma pgto
            "<td>" + "<input type='text' name='condpgto[" + proxid + "]'   class='input-table-selec'  value='" + condpgto + "'   readonly='readonly' required/>" + "</td>" +    //cond pgto
            "<td>" + "<input type='text' name='nroparc[" + proxid + "]'    class='input-table-selec'  value='1|1'            readonly='readonly' required/>" + "</td>" +    //parcelas        
            "<td>" + "<input type='text' name='dtvenc[" + proxid + "]'     class='input-table-selec'  value='" + dtop + "'       readonly='readonly' required/>" + "</td>" +    //dt venc
            "<td>" + "<input type='text' name='valorpago[" + proxid + "]'  class='input-table-selec'  value='" + valortotal + "' readonly='readonly' required/>" + "</td>" +    //valor pago
            "<td>" + "<input type='text' name='dtquit[" + proxid + "]'     class='input-table-selec'  value='" + dtop + "'       readonly='readonly' />" + "</td>" +            //dt quit
            "<td>" + "<input type='text' name='status[" + proxid + "]'     class='input-table-selec'  value='Quitado'        readonly='readonly' required/>" + "</td>" +    //status
            "<td>" + "<input type='text' name='dtop[" + proxid + "]'       class='input-table-selec'  value='" + dtop + "'       readonly='readonly' required/>" + "</td>" +    //data op
            "<td>" + "<input type='text' name='nropedido[" + proxid + "]'  class='input-table-selec'  value='" + nropedido + "'  readonly='readonly' />" + "</td>" +            //nro pedido        
            "<td>" + "<input type='text' name='mov[" + proxid + "]'        class='input-table-selec'  value='" + mov + "'        readonly='readonly' required/>" + "</td>" +    //movimentação
            "<td>" + "<input type='text' name='sintetica[" + proxid + "]'  class='input-table-selec'  value='" + sintetica + "'  readonly='readonly' required/>" + "</td>" +    //sintetica
            "<td>" + "<input type='text' name='analitica[" + proxid + "]'  class='input-table-selec'  value='" + analitica + "'  readonly='readonly' required/>" + "</td>" +    //analitica
            "<td>" + "<input type='text' name='cc[" + proxid + "]'         class='input-table-selec'  value='" + cc + "'         readonly='readonly' required/>" + "</td>" +    //c corrente
            "<td>" + "<input type='text' name='bandeira[" + proxid + "]'   class='input-table-selec'  value='" + bandeira + "'   readonly='readonly' />" + "</td>" +            //bandeira
            "<td>" + "<input type='text' name='favorecido[" + proxid + "]' class='input-table-selec'  value='" + favorecido + "' readonly='readonly' required/>" + "</td>" +    //favorecido
            "<td>" + "<input type='text' name='observ[" + proxid + "]'     class='input-table-selec'  value='" + observ + "'     readonly='readonly' />" + "</td>" +            //observ
            "</tr>";

        arraylinhas.push(linha);
        return arraylinhas;
    }
    /////////////////////////// LANÇAMENTO INTEIRO FEITO EM UMA VEZ - DISTÂNCIA DO VENCIMENTO EM DIAS
    if ((bandeira != "" & formapgto == "Cartão Débito") | (formapgto == "Cartão Crédito" & condpgto == "Com Juros") | (formapgto == "Cartão Crédito" & condpgto == "Antecipado")) {
        var arraylinhas = new Array();
        var linha = "<tr>" +
            "<td>" +
            "<a href='#' class='botao_table_lc' onclick='editar(this)' data-ident='" + proxid + "'>Ed</a>" +
            "<a href='#' class='botao_table_lc' onclick='excluir(this)' data-ident='" + proxid + "'>Ex</a>" +
            "</td>" +
            "<td>" + "<input type='text' name='descricao[" + proxid + "]'  class='input-table-selec'  value='" + descricao + "'  readonly='readonly' required/>" + "</td>" +   //detalhe
            "<td>" + "<input type='text' name='valortotal[" + proxid + "]' class='input-table-selec'  value='" + valortotal + "' readonly='readonly' required/>" + "</td>" +   //valor tot
            "<td>" + "<input type='text' name='formapgto[" + proxid + "]'  class='input-table-selec'  value='" + formapgto + "'  readonly='readonly' required/>" + "</td>" +   //forma pgto
            "<td>" + "<input type='text' name='condpgto[" + proxid + "]'   class='input-table-selec'  value='" + condpgto + "'   readonly='readonly' required/>" + "</td>" +   //cond pgto
            "<td>" + "<input type='text' name='nroparc[" + proxid + "]'    class='input-table-selec'  value='1|1'            readonly='readonly' required/>" + "</td>";   //parcelas   

        if (distdias != 0) {
            var dtaux = dtop.split("/");
            var dtvenc = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);
            //soma a quantidade de dias para o recebimento/pagamento
            dtvenc.setDate(dtvenc.getDate() + distdias);
            //verifica se a data final cai no final de semana, se sim, coloca para o primeiro dia útil seguinte
            if (dtvenc.getDay() == 6) {
                dtvenc.setDate(dtvenc.getDate() + 2);
            }
            if (dtvenc.getDay() == 0) {
                dtvenc.setDate(dtvenc.getDate() + 1);
            }
            //monta a data no padrao brasileiro
            var dia = dtvenc.getDate();
            var mes = dtvenc.getMonth() + 1;
            var ano = dtvenc.getFullYear();
            if (dia.toString().length == 1) {
                dia = "0" + dtvenc.getDate();
            }
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            dtvenc = dia + "/" + mes + "/" + ano;
            linha += "<td>" + "<input type='text' name='dtvenc[" + proxid + "]' class='input-table-selec'  value='" + dtvenc + "'  readonly='readonly' required/>" + "</td>";     //dt venc
        } else {
            //caso a distancia em dias seja o padrão, igual a zero, a dt vencimento fica igual a dt operação
            linha += "<td>" + "<input type='text' name='dtvenc[" + proxid + "]' class='input-table-selec'  value='" + dtop + "'    readonly='readonly' required/>" + "</td>";   //dt venc
        }
        linha += "<td>" + "<input type='text' name='valorpago[" + proxid + "]'  class='input-table-selec'  value='0,00'        readonly='readonly' required/>" + "</td>";     //valor pago
        linha += "<td>" + "<input type='text' name='dtquit[" + proxid + "]'     class='input-table-selec'  value=''            readonly='readonly' />" + "</td>";             //dt quit
        linha += "<td>" + "<input type='text' name='status[" + proxid + "]'     class='input-table-selec'  value='A Quitar'    readonly='readonly' required/>" + "</td>";     //status
        linha += "<td>" + "<input type='text' name='dtop[" + proxid + "]'       class='input-table-selec'  value='" + dtop + "'       readonly='readonly' required/>" + "</td>";  //data op
        linha += "<td>" + "<input type='text' name='nropedido[" + proxid + "]'  class='input-table-selec'  value='" + nropedido + "'  readonly='readonly' />" + "</td>";          //nro pedido
        linha += "<td>" + "<input type='text' name='mov[" + proxid + "]'        class='input-table-selec'  value='" + mov + "'        readonly='readonly' required/>" + "</td>";  //movimentação
        linha += "<td>" + "<input type='text' name='sintetica[" + proxid + "]'  class='input-table-selec'  value='" + sintetica + "'  readonly='readonly' required/>" + "</td>";  //sintetica
        linha += "<td>" + "<input type='text' name='analitica[" + proxid + "]'  class='input-table-selec'  value='" + analitica + "'  readonly='readonly' required/>" + "</td>";  //analitica        
        linha += "<td>" + "<input type='text' name='cc[" + proxid + "]'         class='input-table-selec'  value='" + cc + "'         readonly='readonly' required/>" + "</td>";  //c corrente
        linha += "<td>" + "<input type='text' name='bandeira[" + proxid + "]'   class='input-table-selec'  value='" + bandeira + "'   readonly='readonly' />" + "</td>";          //bandeira
        linha += "<td>" + "<input type='text' name='favorecido[" + proxid + "]' class='input-table-selec'  value='" + favorecido + "' readonly='readonly' required/>" + "</td>";  //favorecido
        linha += "<td>" + "<input type='text' name='observ[" + proxid + "]'     class='input-table-selec'  value='" + observ + "'     readonly='readonly' />" + "</td>";          //observ
        linha += "</tr>";

        arraylinhas.push(linha);
        return arraylinhas;
    }
    /////////////////////////// LANÇAMENTO INTEIRO FEITO PARCELADO - DISTANCIA DO VENCIMENTO EM MESES
    if (condpgto == "Parcelado" & nroparc > 0) {
        var arraylinhas = new Array();
        var linha;

        var valtot = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
        valtot = valortotal.replace(",", ".");
        valtot = (parseFloat(valtot) / parseFloat(nroparc));
        valtot = parseFloat(valtot).toFixed(2);
        valtot = valtot.replace(".", ",");

        var dtaux = dtop.split("/");
        var dtvencaux = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);

        for (var pr = 0; pr < nroparc; pr++) {

            linha = "";
            linha = "<tr>" +
                "<td>" +
                "<a href='#' class='botao_table_lc' onclick='editar(this)'  data-ident='" + (proxid + pr) + "'>Ed</a>" +
                "<a href='#' class='botao_table_lc' onclick='excluir(this)' data-ident='" + (proxid + pr) + "'>Ex</a>" +
                "</td>" +
                "<td>" + "<input type='text' name='descricao[" + (proxid + pr) + "]'  class='input-table-selec'  value='" + descricao + "'          readonly='readonly' required/>" + "</td>" +  //detalhe
                "<td>" + "<input type='text' name='valortotal[" + (proxid + pr) + "]' class='input-table-selec'  value='" + valtot + "'             readonly='readonly' required/>" + "</td>" +  //valor tot
                "<td>" + "<input type='text' name='formapgto[" + (proxid + pr) + "]'  class='input-table-selec'  value='" + formapgto + "'          readonly='readonly' required/>" + "</td>" +  //forma pgto
                "<td>" + "<input type='text' name='condpgto[" + (proxid + pr) + "]'   class='input-table-selec'  value='" + condpgto + "'           readonly='readonly' required/>" + "</td>" +  //cond pgto
                "<td>" + "<input type='text' name='nroparc[" + (proxid + pr) + "]'    class='input-table-selec'  value='" + (pr + 1) + "|" + nroparc + "' readonly='readonly' required/>" + "</td>";  //parcelas

            //transforma em data para verificar o dia da semana
            var dtvenc = new Date(dtaux[2], dtvencaux.getMonth() + (pr + 1), diavenc);
            //verifica se a data final cai no final de semana, se sim, coloca para o primeiro dia útil seguinte
            if (dtvenc.getDay() == 6) {
                dtvenc.setDate(dtvenc.getDate() + 2);
            }
            if (dtvenc.getDay() == 0) {
                dtvenc.setDate(dtvenc.getDate() + 1);
            }
            //monta a data no padrao brasileiro
            var dia = dtvenc.getDate();
            var mes = dtvenc.getMonth() + 1;
            var ano = dtvenc.getFullYear();
            if (dia.toString().length == 1) {
                dia = "0" + dtvenc.getDate();
            }
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            dtvenc = dia + "/" + mes + "/" + ano;

            linha += "<td>" + "<input type='text' name='dtvenc[" + (proxid + pr) + "]'    class='input-table-selec'  value='" + dtvenc + "'      readonly='readonly' required/>" + "</td>";  //dt venc
            linha += "<td>" + "<input type='text' name='valorpago[" + (proxid + pr) + "]' class='input-table-selec'  value='0,00'            readonly='readonly' required/>" + "</td>";  //valor pago
            linha += "<td>" + "<input type='text' name='dtquit[" + (proxid + pr) + "]'    class='input-table-selec'  value=''                readonly='readonly' />" + "</td>";          //dt quit
            linha += "<td>" + "<input type='text' name='status[" + (proxid + pr) + "]'    class='input-table-selec'  value='A Quitar'        readonly='readonly' required/>" + "</td>";  //status
            linha += "<td>" + "<input type='text' name='dtop[" + (proxid + pr) + "]'       class='input-table-selec'  value='" + dtop + "'       readonly='readonly' required/>" + "</td>";  //data op
            linha += "<td>" + "<input type='text' name='nropedido[" + (proxid + pr) + "]'  class='input-table-selec'  value='" + nropedido + "'  readonly='readonly' />" + "</td>";          //nro pedido
            linha += "<td>" + "<input type='text' name='mov[" + (proxid + pr) + "]'        class='input-table-selec'  value='" + mov + "'        readonly='readonly' required/>" + "</td>";  //moviment
            linha += "<td>" + "<input type='text' name='sintetica[" + (proxid + pr) + "]'  class='input-table-selec'  value='" + sintetica + "'  readonly='readonly' required/>" + "</td>";  //sintetica
            linha += "<td>" + "<input type='text' name='analitica[" + (proxid + pr) + "]'  class='input-table-selec'  value='" + analitica + "'  readonly='readonly' required/>" + "</td>";  //analitica
            linha += "<td>" + "<input type='text' name='cc[" + (proxid + pr) + "]'         class='input-table-selec'  value='" + cc + "'         readonly='readonly' required/>" + "</td>";  //c corrente
            linha += "<td>" + "<input type='text' name='bandeira[" + (proxid + pr) + "]'   class='input-table-selec'  value='" + bandeira + "'   readonly='readonly' />" + "</td>";          //bandeira
            linha += "<td>" + "<input type='text' name='favorecido[" + (proxid + pr) + "]' class='input-table-selec'  value='" + favorecido + "' readonly='readonly' required/>" + "</td>";  //favorecido
            linha += "<td>" + "<input type='text' name='observ[" + (proxid + pr) + "]'    class='input-table-selec'   value='" + observ + "'     readonly='readonly' />" + "</td>";          //observ
            linha += "</tr>";

            arraylinhas.push(linha);

        }
        return arraylinhas;
    }

}// FINAL DA FUNÇÃO DE LANÇAMENTO NO CAIXA