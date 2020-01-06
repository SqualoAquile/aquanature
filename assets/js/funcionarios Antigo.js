window.onload = function () {

    if (typeof (valoresfunc) !== "undefined") {

        if (valoresfunc[0][17].indexOf('.') == -1) {
            $('#itxt16').val(valoresfunc[0][17] + ",00");
        } else {
            $('#itxt16').val(valoresfunc[0][17].replace(".", ","));
        }

        if ((valoresfunc[0][18].indexOf(".") != -1) && (valoresfunc[0][18].length - (valoresfunc[0][18].indexOf(".") + 1)) == 1) {
            $('#itxt17').val(valoresfunc[0][18].replace(".", ",") + "0%");
        } else {
            $('#itxt17').val(valoresfunc[0][18].replace(".", ",") + "%");
        }

        if (valoresfunc[0][19].indexOf('.') == -1) {
            $('#itxt18').val(valoresfunc[0][19] + ",00");
        } else {
            $('#itxt18').val(valoresfunc[0][19].replace(".", ","));
        }

        if (valoresfunc[0][20].indexOf('.') == -1) {
            $('#itxt19').val(valoresfunc[0][20] + ",00");
        } else {
            $('#itxt19').val(valoresfunc[0][20].replace(".", ","));
        }
    }

};

function filterColumn(i) {

    if (i != '') {
        $('#tabelafuncionarios').DataTable().column(i).search(
            $('#ifiltro').val()
        ).draw();
    } else {
        $('#tabelafuncionarios').DataTable().search(
            $('#ifiltro').val()
        ).draw();
    }
}

$(document).ready(function () {

    $('#ifiltro').on('keyup change', function () {
        filterColumn($('#icampo').val());
    });


    $('#icampo').on('focus', function () {
        if ($('#ifiltro').val() != "") {
            $('#ifiltro').val("");
            $('#ifiltro').change();
        }
    });

    $("#itxt6").mask('0000000');

    $("#itxt14").blur(function () {
        $("#itxt13").val($("#itxt14 :selected").html());
    });
    
    $('#itxt18').mask("#.##0,00", { reverse: true });
    $('#itxt19').mask("#.##0,00", { reverse: true });

    $("#senha1").blur(function () {
        if ($("#senha1").val() != "") {
            var senha = $('#senha1').val();
            if (senha.length <= 6) {
                alert("A senha deve ter mais de 6 caracteres. Composta por números e letras");
                $('#senha1').val("");
                return;
            } else {
                if ($.isNumeric(senha) == true) {
                    alert("A senha deve ter mais de 6 caracteres. Composta por números e letras");
                    $('#senha1').val("");
                    return;
                } else {
                    var ok = false;
                    for (var i = 0; i < senha.length; i++) {
                        if ($.isNumeric(senha.charAt(i))) {
                            ok = true;
                        }
                    }
                    if (ok == false) {
                        alert("A senha deve ter mais de 6 caracteres. Composta por números e letras");
                        $('#senha1').val("");
                        return;
                    }
                }
            }
        }
    });
    $("#itxt20").blur(function () {
        if ($("#itxt20").val() != "") {
            if ($("#itxt20").val() != "") {
                var senha = $('#itxt20').val();
                if (senha.length <= 6) {
                    alert("A senha deve ter mais de 6 caracteres. Composta por números e letras");
                    $('#itxt20').val("");
                    return;
                } else {
                    if ($.isNumeric(senha) == true) {
                        alert("A senha deve ter mais de 6 caracteres. Composta por números e letras");
                        $('#itxt20').val("");
                        return;
                    } else {
                        var ok = false;
                        for (var i = 0; i < senha.length; i++) {
                            if ($.isNumeric(senha.charAt(i))) {
                                ok = true;
                            }
                        }
                        if (ok == false) {
                            alert("A senha deve ter mais de 6 caracteres. Composta por números e letras");
                            $('#itxt20').val("");
                            return;
                        }
                    }
                }
            }
            if (($("#itxt20").val().length != $("#senha1").val().length) || ($("#itxt20").val() != $("#senha1").val())) {
                alert("Os campos de senha devem ser preenchidos com o mesmo valor");
                $("#itxt20").val("");
            }
        }
    });
    $("#senhanova1").blur(function () {
        if ($("#senhanova1").val() != "") {
            if ($("#senhanova1").val() != "") {
                var senha = $('#senhanova1').val();

                if (senha.length <= 6) {
                    alert("1-A senha deve ter mais de 6 caracteres. Composta por números e letras");
                    $('#senhanova1').val("");
                    return;
                } else {
                    if ($.isNumeric(senha) == true) {
                        alert("2-A senha deve ter mais de 6 caracteres. Composta por números e letras");
                        $('#senhanova1').val("");
                        return;
                    } else {
                        var ok = false;
                        for (var i = 0; i < senha.length; i++) {
                            if ($.isNumeric(senha.charAt(i))) {
                                ok = true;
                            }
                        }
                        if (ok == false) {
                            alert("3-A senha deve ter mais de 6 caracteres. Composta por números e letras");
                            $('#senhanova1').val("");
                            return;
                        }
                    }
                }
            }
        }
    });
    $("#senhanova2").blur(function () {
        if ($("#senhanova2").val() != "") {
            if ($("#senhanova2").val() != "") {
                var senha = $('#senhanova2').val();
                if (senha.length <= 6) {
                    alert("A senha deve ter mais de 6 caracteres. Composta por números e letras");
                    $('#senhanova2').val("");
                    return;
                } else {
                    if ($.isNumeric(senha) == true) {
                        alert("A senha deve ter mais de 6 caracteres. Composta por números e letras");
                        $('#senhanova2').val("");
                        return;
                    } else {
                        var ok = false;
                        for (var i = 0; i < senha.length; i++) {
                            if ($.isNumeric(senha.charAt(i))) {
                                ok = true;
                            }
                        }
                        if (ok == false) {
                            alert("A senha deve ter mais de 6 caracteres. Composta por números e letras");
                            $('#senhanova2').val("");
                            return;
                        }
                    }
                }
            }
            if (($("#senhanova2").val().length != $("#senhanova1").val().length) || ($("#senhanova2").val() != $("#senhanova1").val())) {
                alert("Os campos de senha devem ser preenchidos com o mesmo valor");
                $("#senhanova2").val("");
            }
        }
    });

    $("#ibtnsenha").click(function () {
        $("#ialtsenha").toggle('slow');
    });
});

function limparPreenchimento() {

    for (var i = 1; i <= 19; i++) {
        $('#itxt' + i + '').val("");
    }

    $("#senha1").val("");

}

function testeEnvio() {


    for (var i = 1; i <= 19; i++) {
        switch (i) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            //case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            //case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
                if ($('#itxt' + i + '').val() == "") {
                    alert("Preencha o campo: " + $('#itxt' + i + '').attr('placeholder'));
                    return;
                }
            case 14: //usado para os selects
                if ($('#itxt' + i + '').val() == null) {
                    alert("Preencha o campo: " + $('#itxt' + i + ' :selected').html());
                    return;
                }
                break;
        }
    }
    if ($('#senha1').val() == "" || $('#itxt20').val() == "") {
        alert("Preencha os campos de senha.");
        return;
    }

    if (confirm('Tem Certeza?') == true) {
        return true;
    } else {
        return false;
    }
}

function salvaSenha() {

    if ($("#senhaantiga").val() != "" && $("#senhanova1").val() != "" && $("#senhanova2").val() != "") {
        var idselec = $("form").attr('data-idselec');
        var senhaantiga = $("#senhaantiga").val();
        var senhanova = $("#senhanova2").val();
        if (senhaantiga == senhanova) {
            alert("A senha antiga deve ser diferente da senha nova. Tente Novamente.");
            $("#senhaantiga").val("");
            $("#senhanova1").val("");
            $("#senhanova2").val("");
            return;
        }
        var action = "SalvaSenhaNova";
        if (idselec != "" && senhaantiga != "" && senhanova != "") {
            $.ajax({
                url: baselink + "/ajax/" + action,
                type: 'POST',
                data: { id: idselec, senha1: senhaantiga, senha2: senhanova },
                dataType: 'json',
                success: function (json) {
                    if (json['resultado'] == 'sim') {
                        alert("Senha Nova salva com Sucesso.");
                        window.location.href = baselink + "/funcionarios";
                    }
                    if (json['resultado'] == 'senha') {
                        alert("A senha antiga não está correta. Tente Novamente.");
                    }
                    if (json['resultado'] == 'selecionado') {
                        alert("O id selecionado não foi encontrado. Tente Novamente.");
                    }
                }
            });
            $("#senhaantiga").val("");
            $("#senhanova1").val("");
            $("#senhanova2").val("");
        }
    } else {
        alert("Preencha os campos adequadamente.");
    }
}
