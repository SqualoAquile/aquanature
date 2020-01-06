$(function () {
  //
  // Variável global que vai ser usada para guardar o valor do total de material e valor total do subitem do orçamento
  //

  let valorTotalSubitem, custoTotalSubitem, quantTotalMaterial;

  //
  // Inicializa os inputs da página - parte do orçamento
  //

  $("#motivo_desistencia")
    .parent()
    .parent("[class^=col-]")
    .addClass("d-none col-lg-12");

  $(
    "#status, #custo_total, #sub_total, #valor_total, #custo_deslocamento, #desconto_porcent"
  ).attr("readonly", "readonly");

  $("#titulo_orcamento").attr("placeholder", "Nome - Trabalho...");

  if ($('[name="alteracoes"]').val() == '') {

    //
    // Só seta as datas se for adicionar
    //

    $("#data_emissao")
      .val(dataAtual())
      .datepicker("update");
  
    $("#data_validade")
      .val(proximoDiaUtil($("#data_emissao").val(), 15))
      .datepicker("update");
  
    $("#data_retorno")
      .val(proximoDiaUtil(dataAtual(), 3))
      .datepicker("update");
    
  }


  //
  // Tipo Material
  //

  let $tipoMaterialBody = $("#tipo_material").parent(".form-group");

  $tipoMaterialBody.find("#tipo_material").remove();

  $tipoMaterialBody.append(`
    <div class="form-check-wrapper">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="tipo_material" id="tipo_material1" value="principal" checked>
        <label class="form-check-label" for="tipo_material1">Principal</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="tipo_material" id="tipo_material2" value="alternativo">
        <label class="form-check-label" for="tipo_material2">Alternativo</label>
      </div>
    </div>
  `);

  toggleTipoMaterial();

  //
  // Inicializa os inputs da pagina - parte de itens do orçamento
  //

  $("#quant_usada").attr("disabled", "disabled");

  $("#custo_tot_subitem").attr("disabled", "disabled");

  $("#unidade").attr("disabled", "disabled");

  //
  // Ajax para pegar informacoes da tabela de parametros
  //

  $.ajax({
    url: baselink + "/ajax/buscaParametrosMaterial",
    type: "POST",
    data: {
      tabela: "parametros"
    },
    dataType: "json",
    success: function (data) {
      var bocarolo, margem, segop;
      if (data["tamanho_boca_rolo"]) {
        bocarolo = floatParaPadraoInternacional(
          data["tamanho_boca_rolo"]
        );
        $("#unidade").attr("data-bocarolo", bocarolo);
      }
      if (data["margem_erro_material"]) {
        margem = floatParaPadraoInternacional(
          data["margem_erro_material"]
        );
        $("#unidade").attr("data-margemerro", margem);
      }
      if (data["taxa_seg_op"]) {
        segop = floatParaPadraoInternacional(data["taxa_seg_op"]);
        $("#preco_tot_subitem").attr("data-seg_op", segop);
      }

      if (data["desconto_max"]) {
        $('#desconto_porcent').attr('data-descontomax', data["desconto_max"]);
        // setar desconto absoluto
        var $desconPorcentagem = $("#desconto_porcent");
        var subtotal = parseFloat(floatParaPadraoInternacional($("#sub_total").val()));
        var desc_max_porcent = parseFloat($desconPorcentagem.attr('data-descontomax'));
        var desc_max_abs = parseFloat( parseFloat(subtotal) * parseFloat(parseFloat(desc_max_porcent)/parseFloat(100))).toFixed(2);
        $('#desconto').attr('data-desconto_maximo',desc_max_abs);
      }

      if (data["custo_deslocamento"]) {
        custodesloc = floatParaPadraoInternacional(
          data["custo_deslocamento"]
        );
        $("#custo_deslocamento").attr("data-custodesloc", custodesloc);
      }

      valorTotal();
      habilitaBotaoOrcamento();
      checarAlternativo();
      tabindex();
    }
  });

  //
  //
  // SELECT tipo_servico_produto
  //
  //
  //

  // coloca as opções de produtos/serviços
  let htmlTipoServicoProduto = `
    <option value="produtos" selected>Produtos</option>
    <option value="servicos">Serviços</option>
    <option value="servicoscomplementares">Serviços Complementares</option>
  `;

  $("#tipo_servico_produto")
    .append(htmlTipoServicoProduto)
    .on("change", function () {
      changeTipoServicoProduto();
      toggleTipoMaterial();

      $("#unidade, #custo_tot_subitem, #preco_tot_subitem")
        .removeClass("is-valid is-invalid")
        .val("");

      $('#camposOrc').find('#largura, #comprimento').removeAttr('disabled');
      
    });

  //
  //
  // INPUT data_emissao
  //
  //
  //

  $("#data_emissao").on("change blur", function () {
    if ($("#data_emissao").val() != "") {
      $("#data_validade")
        .val(proximoDiaUtil($("#data_emissao").val(), 15))
        .datepicker("update")
        .blur();
      $("#data_retorno")
        .val(proximoDiaUtil($("#data_emissao").val(), 3))
        .datepicker("update")
        .blur();
    }
  });

  //
  //
  // INPUT data_validade
  //
  //
  //

  $("#data_validade").on("change blur", function () {
    if ($("#data_validade").val() != "") {
      if ($("#data_emissao").val() != "") {
        var dtEmis, dtValid;
        dtEmis = $("#data_emissao").val();
        dtEmis = dtEmis.split("/");
        dtEmis = parseInt(dtEmis[2] + dtEmis[1] + dtEmis[0]);

        dtValid = $("#data_validade").val();
        dtValid = dtValid.split("/");
        dtValid = parseInt(dtValid[2] + dtValid[1] + dtValid[0]);

        if (dtValid < dtEmis) {
          alert(
            "A data de validade não pode ser maior do que a data de emissão."
          );
          $("#data_validade").val("");
          $("#data_emissao").focus();
        }
      } else {
        alert("Preencha a Data de Emissão.");
        $("#data_validade").val("");
        $("#data_emissao").focus();
      }
    }
  });

  //
  //
  // INPUT data_retorno
  //
  //
  //

  $("#data_retorno").on("change blur", function () {
    if ($("#data_retorno").val() != "") {
      if ($("#data_emissao").val() != "") {
        var dtEmis, dtRetor;
        dtEmis = $("#data_emissao").val();
        dtEmis = dtEmis.split("/");
        dtEmis = parseInt(dtEmis[2] + dtEmis[1] + dtEmis[0]);

        dtRetor = $("#data_retorno").val();
        dtRetor = dtRetor.split("/");
        dtRetor = parseInt(dtRetor[2] + dtRetor[1] + dtRetor[0]);

        if (dtRetor < dtEmis) {
          alert(
            "A data de retorno não pode ser maior do que a data de emissão."
          );
          $("#data_retorno").val("");
          $("#data_emissao").focus();
        }
      }
    }
  });

  //
  //
  // INPUT unidade
  //
  //
  //

  $("#unidade").on("change blur", function () {
    calculaQuantidadeUsadaMaterial();
    calculaMaterialCustoPreco();
  });

  //
  //
  // INPUT quant
  //
  //
  //

  $("#quant").on("change blur", function () {
    calculaQuantidadeUsadaMaterial();
    calculaMaterialCustoPreco();
  });

  //
  //
  // INPUT largura
  //
  //
  //

  $("#largura").on("change blur", function () {
    calculaQuantidadeUsadaMaterial();
    calculaMaterialCustoPreco();
  });

  //
  //
  // INPUT comprimento
  //
  //
  //

  $("#comprimento").on("change blur", function () {
    calculaQuantidadeUsadaMaterial();
    calculaMaterialCustoPreco();
  });

  //
  //
  // INPUT preco_tot_subitem
  //
  //
  //

  $("#preco_tot_subitem").on("change", function () {
    var $custo = $("#custo_tot_subitem");
    var $preco = $("#preco_tot_subitem");
    var $material = $("#material_servico");
    var tx_segop, precoaux;

    tx_segop = parseFloat(
      parseFloat($("#preco_tot_subitem").attr("data-seg_op")) /
      parseFloat(100)
    );

    if ($("#preco_tot_subitem").attr("data-seg_op") != undefined) {
      if ($custo.val() != "" && $preco.val() == "") {
        precoaux = parseFloat(
          parseFloat($material.attr("data-preco")) *
          parseFloat(parseFloat(1) + tx_segop)
        );
        $preco.val(floatParaPadraoBrasileiro(precoaux));
        return;
      }

      if ($custo.val() != "" && $preco.val() != "") {
        if (
          parseFloat(floatParaPadraoInternacional($custo.val())) >=
          parseFloat(floatParaPadraoInternacional($preco.val()))
        ) {

          let dataPreco = $material.attr("data-preco");

          if (!$material.attr("data-preco")) {
            dataPreco = $preco.attr("data-preco_anterior");
          }

          precoaux = parseFloat(
            parseFloat(dataPreco) *
            parseFloat(parseFloat(1) + tx_segop)
          );

          $preco.val(floatParaPadraoBrasileiro(precoaux));
        } else {

          precoaux = parseFloat(
            parseFloat(floatParaPadraoInternacional($preco.val())) *
            parseFloat(parseFloat(1) + tx_segop)
          );
          $preco.val(floatParaPadraoBrasileiro(precoaux));
        }
      }
    }

    calculaMaterialCustoPreco();
  });

  $('#desconto').on('change blur', function() {

    let $this = $(this),
      descontoMax = $this.attr('data-desconto_maximo');

    if (descontoMax && parseFloat($this.val()) > parseFloat(descontoMax)) {
      $this.val('0,00');
      $('#desconto_porcent').val('0,00');
      alert('O desconto máximo é de ' + descontoMax + '.');
    }

  });

  $("#recontato").on("click", function () {
    if (confirm("Tem Certeza?")) {
      $.ajax({
        url: baselink + "/ajax/changeStatusOrcamento",
        type: "POST",
        data: {
          id_orcamento: $("#form-principal").attr(
            "data-id-orcamento"
          ),
          status: "Recontato"
        },
        dataType: "json",
        success: function (data) {
          if (data) {
            window.location.href = baselink + "/orcamentos";
          }
        }
      });
    }
  });

  $("#duplica_orcamento").on("click", function () {
    if (confirm("Tem Certeza?")) {
      $.ajax({
        url: baselink + "/ajax/duplicarOrcamento",
        type: "POST",
        data: {
          id_orcamento: $("#form-principal").attr("data-id-orcamento")
        },
        dataType: "json",
        success: function (data) {
          if (data) {
            window.location.href = baselink + "/orcamentos";
          }
        }
      });
    }
  });
  
  ////////////////////////// COMENTADO BEM ATÉ AQUI ////////////////////////////////

  $(document)
    .ready(function () {
      ajaxPopulaClientes();
    })
    .on(
      "click",
      '[name="nome_cliente"] ~ .relacional-dropdown .relacional-dropdown-element-cliente',
      function () {
        var $this = $(this),
          $esquerda = $("#esquerda");

        $this
          .siblings(".relacional-dropdown-element-cliente")
          .removeClass("active");
        $this.addClass("active");

        $esquerda.find("[name=faturado_para]").val($this.text());

        $esquerda
          .find("[name=telefone]")
          .val($this.attr("data-telefone"));

        $esquerda
          .find("[name=celular]")
          .val($this.attr("data-celular"));

        $esquerda.find("[name=email]").val($this.attr("data-email"));

        $esquerda.find("[name=id_cliente]").val($this.attr("data-id"));

        if ($this.attr("data-comoconheceu") === 'Contato') {

          let $optionContato = $esquerda.find("[name=como_conheceu]").find('option').filter(function() {
            if ($(this).text() == 'Contato') {
              return this;
            }
          });

          $esquerda
            .find("[name=como_conheceu]")
            .val($optionContato.val())
            .change();
          
        } else {
          $esquerda
            .find("[name=como_conheceu]")
            .val($this.attr("data-comoconheceu"))
            .change();
        }

        collapseObsCliente($this.attr("data-observacao"));

      }
    )
    .on(
      "click",
      '[name="material_servico"] ~ .relacional-dropdown .relacional-dropdown-element-orcamento',
      function () {
        let $this = $(this),
          $material = $('[name="material_servico"]'),
          $unidade = $('[name="unidade"]'),
          $custo = $('[name="custo_tot_subitem"]'),
          $preco = $('[name="preco_tot_subitem"]'),
          $largura = $('[name="largura"]'),
          $comprimento = $('[name="comprimento"]'),
          data_tabela = $this.attr("data-tabela"),
          data_unidade = $this.attr("data-unidade"),
          data_preco = $this.attr("data-preco"),
          data_custo = $this.attr("data-custo"),
          unidade = data_tabela != "servicos" ? data_unidade : "M²";

        $this
          .siblings(".relacional-dropdown-element-orcamento")
          .removeClass("active");
        $this.addClass("active");

        $preco.val(floatParaPadraoBrasileiro(data_preco)).change();

        $custo.val(floatParaPadraoBrasileiro(data_custo)).change();

        $preco.val(floatParaPadraoBrasileiro(data_preco)).change();

        $unidade.val(unidade).change();

        $material
          .attr("data-tabela", data_tabela)
          .attr("data-unidade", unidade)
          .attr("data-preco", data_preco)
          .attr("data-custo", data_custo);

        toggleTipoMaterial($unidade.val());

        // Ao trocar de produto sempre voltar para o radio de material principal marcado
        $("input:radio[name=tipo_material]:first").click();

        $(".tipo-material-repetido").remove();

        if ($unidade.val() == "ML" || $unidade.val() == "M²") {
          $largura
            .removeAttr("disabled")
            .removeClass("is-valid is-invalid");

          $comprimento
            .removeAttr("disabled")
            .removeClass("is-valid is-invalid");
        } else {
          $largura
            .val("")
            .blur()
            .attr("disabled", "disabled")
            .removeClass("is-valid is-invalid");

          $comprimento
            .val("")
            .blur()
            .attr("disabled", "disabled")
            .removeClass("is-valid is-invalid");

          $('#quant_usada')
            .val("")
            .blur()
            .attr("disabled", "disabled")
            .removeClass("is-valid is-invalid");

        }
      }
    )
    .on("change", '#form-principal [name="pf_pj"]', function () {
      let $this = $(this),
        $elements = $(
          '#esquerda [name="nome_cliente"] ~ .relacional-dropdown .relacional-dropdown-element-cliente'
        ),
        $filtereds = $elements.filter(function () {
          return $(this).attr("data-tipo_pessoa") == $this.attr("id");
        });

      $elements.removeClass("filtered active").hide();

      $filtereds.addClass("filtered").show();

      $(
        '[name="nome_cliente"], [name=faturado_para], [name=telefone], [name=celular], [name=email], #observacao_cliente'
      )
        .removeClass("is-valid is-invalid")
        .val("");

      changeRequiredsPfPj();
    })
    .on("change", '[name="id_cliente"]', function () {
      checarClienteCadastrado();
    });

  // Eventos responsáveis pelo: Select Dropdown com Pesquisa
  // do campo Material Serviço dos Itens do Orçamento
  $(document)
    .on("click", ".relacional-dropdown-element-orcamento", function () {
      var $this = $(this),
        $input = $this
          .parents(".relacional-dropdown-wrapper")
          .find(".relacional-dropdown-input-orcamento");

      $input.val($this.text()).change();
    })
    .on("keyup", ".relacional-dropdown-input-orcamento", function (event) {
      var code = event.keyCode || event.which;

      if (code == 27) {
        $(this)
          .dropdown("hide")
          .blur();
        return;
      }

      if (
        code == 91 ||
        code == 93 ||
        code == 92 ||
        code == 9 ||
        code == 13 ||
        code == 16 ||
        code == 17 ||
        code == 18 ||
        code == 19 ||
        code == 20 ||
        code == 33 ||
        code == 34 ||
        code == 35 ||
        code == 36 ||
        code == 37 ||
        code == 38 ||
        code == 39 ||
        code == 40 ||
        code == 45
      ) {
        return;
      }

      var $this = $(this),
        $dropdownMenu = $this.siblings(".dropdown-menu"),
        $nenhumResult = $dropdownMenu.find(".nenhum-result"),
        $elements = $dropdownMenu.find(
          ".relacional-dropdown-element-orcamento"
        );

      var $filtereds = $elements.filter(function () {
        return (
          $(this)
            .text()
            .toLowerCase()
            .indexOf($this.val().toLowerCase()) != -1
        );
      });

      if (!$filtereds.length) {
        $nenhumResult.removeClass("d-none");
      } else {
        $nenhumResult.addClass("d-none");
      }

      $elements.not($filtereds).hide();
      $filtereds.show();
    });

  $(".relacional-dropdown-input-orcamento")
    .click(function () {
      var $this = $(this);
      if ($this.parents(".dropdown").hasClass("show")) {
        $this.dropdown("toggle");
      }
    })
    .on("blur change", function () {
      var $this = $(this),
        $dropdownMenu = $this.siblings(".dropdown-menu"),
        $active = $dropdownMenu.find(
          ".relacional-dropdown-element-orcamento.active"
        );

      $this.removeClass("is-valid is-invalid");

      if ($this.val()) {
        $dropdownMenu.find(".nenhum-result").addClass("d-none");

        $filtereds = $dropdownMenu
          .find(".relacional-dropdown-element-orcamento")
          .filter(function () {
            return (
              $(this)
                .text()
                .toLowerCase()
                .indexOf($this.val().toLowerCase()) != -1
            );
          });

        if (!$filtereds.length) {
          if ($this.attr("data-pode_nao_cadastrado") == "false") {
            $this.removeClass("is-valid").addClass("is-invalid");

            this.setCustomValidity("invalid");
            $this.after(
              '<div class="invalid-feedback">Selecione um item existente.</div>'
            );
          } else {
            $this.addClass("is-valid");
            this.setCustomValidity("");
          }
        } else {
          $this.addClass("is-valid");
          this.setCustomValidity("");
        }

        if (
          !$active.length ||
          $active.text().toLowerCase() != $this.val().toLowerCase()
        ) {
          $this.val("");
        }
      } else {
        if ($active.length) {
          $this.val($active.text());
        }
      }
    })
    .attr("autocomplete", "off");

  $("#como_conheceu")
    .on("change", function () {
      var $this = $(this);

      $(".column-quem-indicou").remove();

      if (!$this.val() && $this.attr("data-anterior")) {
        if ($this.attr("data-anterior").startsWith("Contato - ")) {
          $this.val("Contato");
        }
      }

      if ($this.val()) {
        if (
          $this.val().toLocaleLowerCase() == "contato" ||
          $this.val().startsWith("Contato - ")
        ) {
          $this.parent(".form-group").parent("[class^=col]").after(`
            <div class="column-quem-indicou col-xl-12">
              <div class="form-group">
                <label class="font-weight-bold" for="quem_indicou">
                  <i data-toggle="tooltip" data-placement="top" title="" data-original-title="Campo Obrigatório">*</i>
                  <span>Quem Indicou</span>
                </label>
                <input type="text" class="form-control" name="quem_indicou" value="" required data-unico="" data-anterior="" id="quem_indicou" data-mascara_validacao="false">
              </div>
            </div>
          `);

          var $quemIndicou = $("#quem_indicou");

          if ($this.attr("data-anterior").startsWith("Contato - ")) {

            let valContatoReplace = $this.attr("data-anterior").replace("Contato - ", "");

            $quemIndicou
              .val(valContatoReplace)
              .attr('data-anterior', valContatoReplace)
              .blur();
          }

          var valueQuemIndicou = $quemIndicou.val(),
            $comoConhec = $("#como_conheceu"),
            textOptSelc = $comoConhec
              .children("option:selected")
              .text(),
            camposConcat = textOptSelc + " - " + valueQuemIndicou;

          if (valueQuemIndicou) {
            $comoConhec
              .children("option:contains(" + textOptSelc + ")")
              .attr("value", camposConcat);
          }
        } else {
          $this
            .children('option:contains("Contato")')
            .attr("value", "Contato");
        }
      }

      tabindex();

    })
    .change();

  $(document)
    .on("blur", "#quem_indicou", function () {
      var $this = $(this),
        value = $this.val(),
        $comoConhec = $("#como_conheceu"),
        textOptSelc = $comoConhec.children("option:selected").text(),
        camposConcat = textOptSelc + " - " + value;

      $this.removeClass("is-valid is-invalid");
      $this[0].setCustomValidity("");

      if (value) {
        $comoConhec
          .children("option:contains(" + textOptSelc + ")")
          .attr("value", camposConcat);

        $this.attr('data-anterior', value);

        $this.addClass("is-valid");
        $this[0].setCustomValidity("");
      }
    })
    .on("submit", "#form-principalModalOrcamentos", event => {
      event.preventDefault();

      if (event.target.checkValidity()) {
        if (confirm('Tem Certeza?')) {
          $.ajax({
            url: baselink + "/ajax/adicionarCliente",
            type: "POST",
            data: $(event.target).serialize(),
            dataType: "json",
            success: cliente => setarClienteCadastrado(cliente)
          });
        }
      }
    });

  $("#modalCadastrarCliente").on("show.bs.modal", function (e) {
    let $formClienteModal = $("#form-principalModalOrcamentos"),
      $formClienteEsquerda = $("#esquerda");

    let $pjModal = $formClienteModal.find("#pj"),
      $pfModal = $formClienteModal.find("#pf");

    $pjModal.attr("id", "pj_modal");
    $pfModal.attr("id", "pf_modal");

    $pjModal.siblings('[for="pj"]').attr("for", "pj_modal");
    $pfModal.siblings('[for="pf"]').attr("for", "pf_modal");

    $formClienteModal
      .find(
        '[name="tipo_pessoa"][value="' +
        $formClienteEsquerda
          .find("[name=pf_pj]:checked")
          .attr("id") +
        '"]'
      )
      .prop("checked", true)
      .change();

    // Nome
    $formClienteModal
      .find("[name=nome]")
      .val($formClienteEsquerda.find("[name=nome_cliente]").val());

    // Telefone
    $formClienteModal
      .find("[name=telefone]")
      .val($formClienteEsquerda.find("[name=telefone]").val());

    // Celular
    $formClienteModal
      .find("[name=celular]")
      .val($formClienteEsquerda.find("[name=celular]").val());

    // Email
    $formClienteModal
      .find("[name=email]")
      .val($formClienteEsquerda.find("[name=email]").val());

    let comoConheceuVal = $formClienteEsquerda.find("[name=como_conheceu]").val();

    if (comoConheceuVal && comoConheceuVal.startsWith('Contato - ')) {
      comoConheceuVal = 'Contato';
    }

    // Como Conheceu
    $formClienteModal
      .find("[name=comoconheceu]")
      .val(comoConheceuVal);

  });

  $("#itensOrcamento").on("alteracoes", function (e, data) {

    let $msgAlert = $("#invalid-feedback-zero-itens");

    $msgAlert.addClass("d-none");
    if (!$("[name=itens]").val().length && $('#form-principal').hasClass('was-validated')) {
      $msgAlert.removeClass("d-none");
    }

    if (data && data.zerarDesconto) {
      $('#desconto, #desconto_porcent').val(0);
    }


    valorTotal();
    habilitaBotaoOrcamento();
    checarAlternativo();
    tabindex();

  });

  $("#main-form").click(function (event) {
    let $msgAlert = $("#invalid-feedback-zero-itens"),
      $forms = $("#form-principal, #camposOrc");

    $('#embaixo input').blur();

    $msgAlert.addClass("d-none");

    if (!$("[name=itens]").val().length) {
      $forms.addClass("was-validated");

      $forms
        .find(":invalid")
        .first()
        .focus();

      $msgAlert.removeClass("d-none");
      event.preventDefault();
    }
  });

  $("#nome_cliente")
    .on("change", function () {
      
      let $this = $(this),
        $elements = $this
          .siblings(".relacional-dropdown")
          .find(".relacional-dropdown-element-cliente");

      let $filtereds = $elements.filter(function () {
        if ($this.val() && $(this).text()) {
          return (
            $this.val().toLowerCase() ==
            $(this)
              .text()
              .toLowerCase()
          );
        }
      });

      // Se não encontrar nenhum cliente com mesmo nome, tira o valor do id_cliente
      // Dizendo para o software que não tem nenhum cliente cadastrado naquele orçamento
      if (!$filtereds.length) {
        $("[name=id_cliente]").val("0");
        limparDadosCliente();
      }

      // Toda vez que usuario sai do campo nome do cliente
      // Seta o valor desse campo no campo faturado_para
      // Mantendo sempre os dois iguais, se o usuario quiser pode alter faturada_para manualmente
      $("[name=faturado_para]").val($this.val());

      checarClienteCadastrado();
      
    })
    .on("focus", function () {
      let $radio = $('#form-principal [name="pf_pj"]:checked'),
        $elements = $(
          '#esquerda [name="nome_cliente"] ~ .relacional-dropdown .relacional-dropdown-element-cliente'
        ),
        $filtereds = $elements.filter(function () {
          return (
            $(this).attr("data-tipo_pessoa") == $radio.attr("id")
          );
        });

      $elements.removeClass("filtered").hide();

      $filtereds.addClass("filtered").show();
    });

  $("#aprovar-orcamento").click(function () {
    if ($("[name=id_cliente]").val() != "0") {
      // Cliente já é cadastrado
      if (confirm("Tem Certeza?")) {
        $("#modalConfImp")
          .attr('data-model', 'ordemservico')
          .modal("show");
      }
    } else {
      // Necessário cadastrar o cliente antes de aprovar um orçamento
      $("#modalCadastrarCliente").modal("show");
    }
  });

  $(document)
    .on('submit', '#modalConfImp[data-model="ordemservico"] #formModal', function(event) {
      event.preventDefault();
      aprovarOrcamento($(event.target).serialize());
    });

  $("#embaixo input").on("change", function () {
    valorTotal();
    habilitaBotaoOrcamento();
    checarAlternativo();
  });

  $("#esquerda input, #esquerda select").on("change", () => {
    habilitaBotaoOrcamento();
    checarAlternativo();
  });

  $("#chk_cancelamentoOrc").click(function () {
    let $motivoDesistencia = $("#motivo_desistencia");

    $motivoDesistencia.val("");

    if ($(this).is(":checked")) {
      $("#col-cancelar").removeClass("d-none");
      $(
        "#col-aprovar, #col-salvar, #col-recontato, #col-historico, #col-duplicar, #col-imprimir"
      ).addClass("d-none");

      $motivoDesistencia
        .parent()
        .parent()
        .removeClass("d-none");
      $motivoDesistencia.focus();
    } else {
      $("#col-cancelar").addClass("d-none");
      $(
        "#col-aprovar, #col-salvar, #col-recontato, #col-historico, #col-duplicar, #col-imprimir"
      ).removeClass("d-none");

      $motivoDesistencia
        .parent()
        .parent()
        .addClass("d-none");
    }

    tabindex();

  });

  $("#btn_cancelamentoOrc").click(function () {
    var $motivoCancela = $("#motivo_desistencia");

    if ($motivoCancela.val() == "") {
      alert("Preencha o Motivo da Desistência.");
      $motivoCancela.focus();
      return;
    }

    if (
      confirm("Tem Certeza que quer Cancelar esse Orçamento?") == true &&
      $motivoCancela.val() != ""
    ) {
      var idOrcamento = $("#form-principal").attr("data-id-orcamento");
      var motivo = $motivoCancela.val() + "a";

      $.ajax({
        url: baselink + "/ajax/cancelarOrcamento",
        type: "POST",
        data: {
          motivo_desistencia: motivo,
          id: idOrcamento
        },
        dataType: "json",
        success: data => {
          if (data == true) {
            // deu certo o cancelamento
            // vai ser redirecionado pro browser, não precisa fazer nada
            window.location.href = baselink + "/orcamentos";
          } else {
            alert(
              "Não foi possível realizar o cancelamento.\nTente Novamente."
            );
            return;
          }
        }
      });
    }
  });

  // Eventos responsáveis pelo: Select Dropdown com Pesquisa de Cliente
  // Cliente
  $(document)
    .on("click", ".relacional-dropdown-element-cliente", function () {
      var $this = $(this),
        $input = $this
          .parents(".relacional-dropdown-wrapper")
          .find(".relacional-dropdown-input-cliente");

      $input.val($this.text()).change();
    })
    .on("keyup", ".relacional-dropdown-input-cliente", function (event) {
      var code = event.keyCode || event.which;

      if (code == 27) {
        $(this)
          .dropdown("hide")
          .blur();

        return;
      }

      if (
        code == 91 ||
        code == 93 ||
        code == 92 ||
        code == 9 ||
        code == 13 ||
        code == 16 ||
        code == 17 ||
        code == 18 ||
        code == 19 ||
        code == 20 ||
        code == 33 ||
        code == 34 ||
        code == 35 ||
        code == 36 ||
        code == 37 ||
        code == 38 ||
        code == 39 ||
        code == 40 ||
        code == 45
      ) {
        return;
      }

      var $this = $(this),
        $dropdownMenu = $this.siblings(".dropdown-menu"),
        $nenhumResult = $dropdownMenu.find(".nenhum-result"),
        $elements = $dropdownMenu.find(
          ".relacional-dropdown-element-cliente.filtered"
        );

      if ($this.attr("data-anterior").length != $this.val()) {
        var $filtereds = $elements.filter(function () {
          return (
            $(this)
              .text()
              .toLowerCase()
              .indexOf($this.val().toLowerCase()) != -1
          );
        });

        if (!$filtereds.length) {
          $nenhumResult.removeClass("d-none");
        } else {
          $nenhumResult.addClass("d-none");
        }

        $elements.not($filtereds).hide();
        $filtereds.show();
      } else {
        $nenhumResult.addClass("d-none");
        $elements.show();
      }
    });

  $(".relacional-dropdown-input-cliente")
    .click(function () {
      var $this = $(this);

      $this.keyup();

      if ($this.parents(".dropdown").hasClass("show")) {
        $this.dropdown("toggle");
      }
    })
    .on("blur change", function () {
      var $this = $(this),
        $dropdownMenu = $this.siblings(".dropdown-menu"),
        $active = $dropdownMenu.find(
          ".relacional-dropdown-element-cliente.filtered.active"
        ),
        $elements = $dropdownMenu.find(
          ".relacional-dropdown-element-cliente.filtered"
        );

      $this.removeClass("is-valid is-invalid");
      $dropdownMenu.find(".nenhum-result").addClass("d-none");

      if ($this.val()) {
        $filtereds = $elements.filter(function () {
          return (
            $(this)
              .text()
              .toLowerCase()
              .indexOf($this.val().toLowerCase()) != -1
          );
        });

        if (!$filtereds.length) {
          if ($this.attr("data-pode_nao_cadastrado") == "false") {
            $this.removeClass("is-valid").addClass("is-invalid");

            this.setCustomValidity("invalid");
            $this.after(
              '<div class="invalid-feedback">Selecione um item existente.</div>'
            );
          } else {
            $this.addClass("is-valid");
            this.setCustomValidity("");
          }
        } else {
          $this.addClass("is-valid");
          this.setCustomValidity("");
        }
      } else {
        if ($active.length) {
          $this.val($active.text());
        }
      }

      var $equals = $elements.filter(function () {
        return (
          $(this)
            .text()
            .toLowerCase() == $this.val().toLowerCase()
        );
      });

      if (!$equals.length) {
        $elements.removeClass("active");
      }
    })
    .attr("autocomplete", "off");


  $('#desconto').on('blur', function(){
  //calculaDesconto();

  var $custo   = $("#custo_total");
  var $subtotal = $("#sub_total");
  var subtotal = floatParaPadraoInternacional($("#sub_total").val());
  var deslocamento = floatParaPadraoInternacional($("#custo_deslocamento").val());
  var $desconPorcentagem = $("#desconto_porcent");
  var $desconto = $("#desconto");
  var $valorFinal = $("#valor_total");

  var desc_max, precoaux, custoaux, descaux;

  // setar desconto absoluto
  var desc_max_porcent = parseFloat($desconPorcentagem.attr('data-descontomax'));
  var desc_max_abs = parseFloat( parseFloat(subtotal) * parseFloat(parseFloat(desc_max_porcent)/parseFloat(100))).toFixed(2);
  $desconto.attr('data-desconto_maximo',desc_max_abs);

  desc_max = parseFloat( $desconto.attr('data-desconto_maximo'));
  
  
  if( desc_max != undefined && desc_max != '' ){
      
    if( $desconto.val() != undefined && $desconto.val() != ''){
      if( parseFloat( floatParaPadraoInternacional( $desconto.val() ) ) > desc_max ){
        alert('O valor máximo de desconto é ' + floatParaPadraoBrasileiro(desc_max));
        $desconPorcentagem.val('0,00');
        $desconto.val('0,00');
        return;
      }
    } else {
      $desconPorcentagem.val('0,00');
      $desconto.val('0,00');
    }
  
    if( $custo.val() != '' && $custo.val() != undefined && $subtotal.val() != '' && $subtotal.val() != undefined){

      precoaux = parseFloat( parseFloat( parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) - parseFloat( parseFloat( floatParaPadraoInternacional( $desconto.val() ) ) ) ).toFixed(2) );
      custoaux = parseFloat( parseFloat( floatParaPadraoInternacional( $custo.val() ) ).toFixed(2) );
      if( precoaux < custoaux ){
        if (precoaux && custoaux) {
            alert( 'O desconto dado faz o valor final ser menor do que custo total.' );
            $desconto.val('0,00');
        }
      }else if( precoaux == custoaux ){
        if (precoaux && custoaux) {
          alert( 'O desconto dado faz o valor final ser igual custo total.' );
        }
        $desconto.val('0,00');
      }else{

        descaux =  parseFloat(parseFloat(100) - parseFloat(parseFloat(parseFloat(precoaux) / parseFloat(subtotal)) * parseFloat(100))).toFixed(2);  
        
        $desconPorcentagem.val( floatParaPadraoBrasileiro( descaux ) + '%' );
        
        $valorFinal.val( floatParaPadraoBrasileiro( parseFloat(parseFloat(precoaux) + parseFloat(deslocamento))) ) ;

      }
    }
  }
  });

  $('#modalConfImp').on('show.bs.modal', function (event) {
    let $btnSubmitModal = $('#modalConfImp .modal-footer [type="submit"]');
    $btnSubmitModal.text('Imprimir');
    if (!$(event.relatedTarget).length) {
      if ($('#form-principal #esquerda #status').val() == 'Em Espera') {
        $btnSubmitModal.text('Aprovar Orçamento e Imprimir OS');
      }
    }
  });
});

window.onload = function() {
  habilitaBotaoOrcamento();
  checarAlternativo();
  tabindex();
};

function calculaDesconto() {
  
  var $custo   = $("#custo_total");
  var $subtotal = $("#sub_total");
  var subtotal = floatParaPadraoInternacional($("#sub_total").val());
  var deslocamento = floatParaPadraoInternacional($("#custo_deslocamento").val());
  var $desconPorcentagem = $("#desconto_porcent");
  var $desconto = $("#desconto");
  var $valorFinal = $("#valor_total");

  var desc_max, precoaux, custoaux, descaux;

  // setar desconto absoluto
  var desc_max_porcent = parseFloat($desconPorcentagem.attr('data-descontomax'));
  var desc_max_abs = parseFloat( parseFloat(subtotal) * parseFloat(parseFloat(desc_max_porcent)/parseFloat(100))).toFixed(2);
  $desconto.attr('data-desconto_maximo',desc_max_abs);

  desc_max = parseFloat( $desconto.attr('data-desconto_maximo'));

  // if( desc_max != undefined && desc_max != '' ){
      
  //   if( $desconto.val() != undefined && $desconto.val() != ''){
  //     if( parseFloat( floatParaPadraoInternacional( $desconto.val() ) ) > desc_max ){
  //       alert('O valor máximo de desconto é ' + floatParaPadraoBrasileiro(desc_max));
  //       $desconPorcentagem.val('0,00');
  //       $desconto.val('0,00');
  //       return;
  //     }
  //   } else {
  //     $desconPorcentagem.val('0,00');
  //     $desconto.val('0,00');
  //   }
  
  //   if( $custo.val() != '' && $custo.val() != undefined && $subtotal.val() != '' && $subtotal.val() != undefined){

  //     precoaux = parseFloat( parseFloat( parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) - parseFloat( parseFloat( floatParaPadraoInternacional( $desconto.val() ) ) ) ).toFixed(2) );
  //     custoaux = parseFloat( parseFloat( floatParaPadraoInternacional( $custo.val() ) ).toFixed(2) );
  //     if( precoaux < custoaux ){
  //       if (precoaux && custoaux) {
  //           alert( 'O desconto dado faz o valor final ser menor do que custo total.' );
  //           $desconto.val('0,00');
  //       }
  //     }else if( precoaux == custoaux ){
  //       if (precoaux && custoaux) {
  //         alert( 'O desconto dado faz o valor final ser igual custo total.' );
  //       }
  //       $desconto.val('0,00');
  //     }else{

  //       descaux =  parseFloat(parseFloat(100) - parseFloat(parseFloat(parseFloat(precoaux) / parseFloat(subtotal)) * parseFloat(100))).toFixed(2);  
        
  //       $desconPorcentagem.val( floatParaPadraoBrasileiro( descaux ) + '%' );
        
  //       $valorFinal.val( floatParaPadraoBrasileiro( parseFloat(parseFloat(precoaux) + parseFloat(deslocamento))) ) ;

  //     }
  //   }
  // }
};

function dataAtual() {
  var dt, dia, mes, ano, dtretorno;
  dt = new Date();
  dia = dt.getDate();
  mes = dt.getMonth() + 1;
  ano = dt.getFullYear();

  if (dia.toString().length == 1) {
    dia = "0" + dt.getDate();
  }
  if (mes.toString().length == 1) {
    mes = "0" + mes;
  }

  dtretorno = dia + "/" + mes + "/" + ano;

  return dtretorno;
}

function proximoDiaUtil(dataInicio, distdias) {
  if (dataInicio) {
    if (distdias != 0) {
      var dtaux = dataInicio.split("/");
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
      return dtvenc;
    } else {
      return dataInicio;
    }
  } else {
    return false;
  }
}

function floatParaPadraoBrasileiro(valor) {
  var valortotal = valor;
  valortotal = number_format(valortotal, 2, ",", ".");
  return valortotal;
}

function floatParaPadraoInternacional(valor) {
  var valortotal = valor;
  valortotal = valortotal
    .replace(".", "")
    .replace(".", "")
    .replace(".", "")
    .replace(".", "");
  valortotal = valortotal.replace(",", ".");
  valortotal = parseFloat(valortotal).toFixed(2);
  return valortotal;
}

function number_format(numero, decimal, decimal_separador, milhar_separador) {
  numero = (numero + "").replace(/[^0-9+\-Ee.]/g, "");
  var n = !isFinite(+numero) ? 0 : +numero,
    prec = !isFinite(+decimal) ? 0 : Math.abs(decimal),
    sep = typeof milhar_separador === "undefined" ? "," : milhar_separador,
    dec =
      typeof decimal_separador === "undefined" ? "." : decimal_separador,
    s = "",
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };

  // Fix para IE: parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

function calculaMaterialCustoPreco() {
  var $qtd = $("#quant");
  var $unidade = $("#unidade");
  var $custo = $("#custo_tot_subitem");
  var $preco = $("#preco_tot_subitem");
  var $qtdUsada = $("#quant_usada");
  var custoaux, precoaux;

  if (
    $qtd.val() != "" &&
    $unidade.val() != "" &&
    $custo.val() != "" &&
    $preco.val() != ""
  ) {

    if ($unidade.val() != "ML" && $unidade.val() != "M²") {

      //material ou serviço que não tem unidade em m² ou ml, o que interessa é o preço e a quantidade
      quantTotalMaterial = parseFloat(0);

      custoaux = parseFloat(
        parseFloat($qtd.val()) *
        parseFloat(floatParaPadraoInternacional($custo.val()))
      );
      custoTotalSubitem = floatParaPadraoBrasileiro(custoaux);

      precoaux = parseFloat(
        parseFloat($qtd.val()) *
        parseFloat(floatParaPadraoInternacional($preco.val()))
      );
      valorTotalSubitem = floatParaPadraoBrasileiro(precoaux);
      
    } else {

      //material ou serviço que a unidade é m² ou ml, o que interessa é o preço e a quantidade e quantUsada
      quantTotalMaterial = parseFloat(
        parseFloat($qtd.val()) *
        parseFloat(
          floatParaPadraoInternacional($qtdUsada.val())
        ).toFixed(2)
      );

      custoaux = parseFloat(
        quantTotalMaterial *
        parseFloat(floatParaPadraoInternacional($custo.val()))
      );
      custoTotalSubitem = floatParaPadraoBrasileiro(custoaux);

      precoaux = parseFloat(
        quantTotalMaterial *
        parseFloat(floatParaPadraoInternacional($preco.val()))
      );
      valorTotalSubitem = floatParaPadraoBrasileiro(precoaux);
    }
  } else {
    quantTotalMaterial = parseFloat(0);
    custoTotalSubitem = parseFloat(0);
    valorTotalSubitem = parseFloat(0);
  }

  $custo.attr("data-totalsubitem", custoTotalSubitem);
  $preco.attr("data-totalsubitem", valorTotalSubitem);
}

function calculaQuantidadeUsadaMaterial() {
  // recebe os objetos (campos)

  var $unidade = $("#unidade");
  var $largura = $("#largura");
  var $comprimento = $("#comprimento");
  var $qtdUsada = $("#quant_usada");
  var bocaRolo = parseFloat($unidade.attr("data-bocarolo"));
  var margemErro = parseFloat($unidade.attr("data-margemerro"));
  var larg, comp, quantUs, quantUsLarg, quantUsComp;

  if ($unidade.val() == "ML") {
    if ($largura.val() != "" && $comprimento.val() != "") {
      larg = parseFloat(
        parseFloat(floatParaPadraoInternacional($largura.val())) *
        parseFloat(parseFloat(1) + parseFloat(margemErro / 100))
      );

      comp = parseFloat(
        parseFloat(floatParaPadraoInternacional($comprimento.val())) *
        parseFloat(parseFloat(1) + parseFloat(margemErro / 100))
      );

      if (larg > bocaRolo && comp > bocaRolo) {
        quantUsLarg = parseFloat(
          parseFloat(Math.ceil(parseFloat(larg / bocaRolo))) *
          parseFloat(Math.ceil(comp))
        );

        quantUsComp = parseFloat(
          parseFloat(Math.ceil(parseFloat(comp / bocaRolo))) *
          parseFloat(Math.ceil(larg))
        );

        quantUs = Math.min(quantUsLarg, quantUsComp);

        quantUs = floatParaPadraoBrasileiro(quantUs);
        $qtdUsada.val(quantUs);
      } else if (larg < bocaRolo && comp < bocaRolo) {
        quantUs = floatParaPadraoBrasileiro(parseFloat(1));
        $qtdUsada.val(quantUs);
      } else {
        quantUs = parseFloat(
          Math.ceil(parseFloat(Math.max(larg, comp)))
        );
        quantUs = floatParaPadraoBrasileiro(quantUs);
        $qtdUsada.val(quantUs);
      }
    } else {
      $qtdUsada.val("");
    }
  } else if ($unidade.val() == "M²") {
    if ($largura.val() != "" && $comprimento.val() != "") {
      larg = parseFloat(
        parseFloat(floatParaPadraoInternacional($largura.val())) *
        parseFloat(parseFloat(1) + parseFloat(margemErro / 100))
      );

      comp = parseFloat(
        parseFloat(floatParaPadraoInternacional($comprimento.val())) *
        parseFloat(parseFloat(1) + parseFloat(margemErro / 100))
      );

      quantUs = parseFloat(larg * comp).toFixed(2);
      quantUs = floatParaPadraoBrasileiro(quantUs);
      $qtdUsada.val(quantUs);
    } else {
      $qtdUsada.val("");
    }
  }
}

function toggleTipoMaterial(unidade) {
  let $tipoMaterial = $('[name="tipo_material"]'),
    $tipoProdutoServico = $("[name=tipo_servico_produto]"),
    $tipoMaterialServico = $("[name=material_servico]"),
    $colTipoProdutoServico = $tipoProdutoServico
      .parents(".form-group")
      .parent(),
    $colTipoMaterial = $tipoMaterial.parents(".form-group").parent(),
    $colTipoServico = $tipoMaterialServico.parents(".form-group").parent();

  $colTipoMaterial.addClass("d-none");
  $colTipoProdutoServico.removeClass("col-xl-4").addClass("col-xl-6");
  $colTipoServico.removeClass("col-xl-4").addClass("col-xl-6");

  if (
    $tipoProdutoServico.val() &&
    $tipoProdutoServico.val().toLowerCase() == "produtos"
  ) {
    if (unidade && unidade.toLowerCase() == "ml") {
      $colTipoMaterial.removeClass("d-none");
      $colTipoProdutoServico.removeClass("col-xl-6").addClass("col-xl-4");
      $colTipoServico.removeClass("col-xl-6").addClass("col-xl-4");
    }
  }

  tabindex();
}

function changeTipoServicoProduto(setValueSuccess) {
  
  let $this = $("#tipo_servico_produto"),
    $material = $("[name=material_servico]"),
    val = $this.val();

  if ($this.val() == 'servicoscomplementares') {
    if (!$material.attr('data-unidade') && ($material.attr('data-unidade') != 'M²' || $material.attr('data-unidade') != 'ML')) {
      $('#camposOrc')
        .find('#largura, #comprimento')
        .removeAttr('disabled')
        .removeClass('is-valid is-invalid');
    }
  }

  $.ajax({
    url: baselink + "/ajax/getRelacionalDropdownOrcamentos",
    type: "POST",
    data: {
      tabela: val
    },
    dataType: "json",
    success: function (data) {
      // JSON Response - Ordem Alfabética
      data.sort(function (a, b) {
        a = a.descricao.toLowerCase();
        b = b.descricao.toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
      });

      let $materialDropdown = $material
        .siblings(".dropdown-menu")
        .find(".dropdown-menu-wrapper"),
        htmlDropdown = "";

      data.forEach(element => {
        htmlDropdown +=
          `
          <div 
            class="list-group-item list-group-item-action relacional-dropdown-element-orcamento" 
            data-tabela="` +
          val +
          `"
            data-custo="` +
          element["custo"] +
          `"
            data-preco="` +
          element["preco_venda"] +
          `"
            data-unidade="` +
          element["unidade"] +
          `"
          >` +
          element["descricao"] +
          `</div>
        `;
      });

      $material
        .removeClass("is-valid is-invalid")
        .removeAttr("data-tabela data-custo data-preco data-unidade")
        .val(setValueSuccess ? setValueSuccess : "");

      $materialDropdown.html(htmlDropdown);

      $materialDropdown
        .find(".relacional-dropdown-element-orcamento.active")
        .removeClass("active");

      if (setValueSuccess) {
        let $elFiltered = $materialDropdown
          .find(".relacional-dropdown-element-orcamento")
          .filter(function () {
            if (
              $(this)
                .text()
                .toLowerCase() == setValueSuccess.toLowerCase()
            ) {
              return this;
            }
          });

        $elFiltered.addClass("active");
      }

    }
  });
}

function valorTotal() {

  let somaTotal = 0;
  $("#itensOrcamento tbody tr").each(function () {
    let $this = $(this),
      tdPrecoTotal = $this.find("td:eq(12)").text(),
      tdTipoMaterial = $this.find("td:eq(9)").text(), 
      precoTotalFormatado = parseFloat(
        floatParaPadraoInternacional(tdPrecoTotal)
      );

    if (tdTipoMaterial != "alternativo") {
      somaTotal += precoTotalFormatado;
    }
  });

  calculaDesconto();
  calculaCustoDeslocamento();

  let deslocamento = $('#custo_deslocamento').val();
  let desconto = $('#desconto').val();

  somaTotal += parseFloat(parseFloat(floatParaPadraoInternacional(deslocamento)) - parseFloat(floatParaPadraoInternacional(desconto)));
  somaTotal = parseFloat(somaTotal);

  $('[name="valor_total"]').val(floatParaPadraoBrasileiro(somaTotal));

  resumoItens();
}

function calculaCustoDeslocamento() {

  let $deslocamentoKm = $("#deslocamento_km"),
    $deslocamentoCusto = $("#custo_deslocamento"),
    $valorTotal = $("#valor_total"),
    desconto = floatParaPadraoInternacional($('#desconto').val()),
    $subTotal = $("#sub_total"),
    custoDeslocamentoParam = $deslocamentoCusto.attr("data-custodesloc"),
    custoDeslocamentoParamFormated = parseFloat(custoDeslocamentoParam),
    valorDeslocamento = $deslocamentoKm.val() || "0",
    valorDeslocamentoFormated = parseFloat(
      floatParaPadraoInternacional(valorDeslocamento)
    );

  let multiplicacaoCustoDesloc =
    valorDeslocamentoFormated * 2* custoDeslocamentoParamFormated;

  $deslocamentoCusto.val(floatParaPadraoBrasileiro(multiplicacaoCustoDesloc));
  $deslocamentoKm.val(valorDeslocamentoFormated);

  // Acrescentar valor de deslocamento ao valor total
  if ($subTotal.val()) {
    let valorTotal = $subTotal.val(),
      valorTotalFormated = parseFloat(
        floatParaPadraoInternacional(valorTotal)
      ),
      somaValorTotalCustoDesloc =
        parseFloat(parseFloat(multiplicacaoCustoDesloc) + parseFloat(valorTotalFormated) - parseFloat(desconto));

    $valorTotal.val(
      floatParaPadraoBrasileiro(somaValorTotalCustoDesloc.toFixed(2))
    );
  }
}

function resumoItens() {
  let $custo_tot = $("#custo_total"),
    $subTotal = $("#sub_total");

  if ($custo_tot.val()) {
    $("#resumoItensCustoTotal").text($custo_tot.val());
  }

  if ($subTotal.val()) {
    $("#resumoItensSubTotal").text($subTotal.val());
  }
}

function aprovarOrcamento(formOsSerialize) {

  let $id_cliente = $("[name=id_cliente]"),
    $id_orcamento = $("#form-principal"),
    $titulo_orcamento = $("[name=titulo_orcamento]"),
    $nome_razao_social = $("[name=nome_cliente]"),
    $vendedor = $("[name=funcionario]"),
    $custo_total = $("[name=custo_total]"),
    $valor_total = $("[name=valor_total]");

  let dadosParaEnviar = {
    id_cliente: $id_cliente.val(),
    id_orcamento: $id_orcamento.attr("data-id-orcamento"),
    data_aprovacao: dataAtual(),
    titulo_orcamento: $titulo_orcamento.val(),
    nome_razao_social: $nome_razao_social.val(),
    veiculo_usado: "",
    vendedor: $vendedor.val(),
    tec_responsavel: "",
    tec_auxiliar: "",
    data_inicio: "",
    data_fim: "",
    custo_total: $custo_total.val(),
    subtotal: $valor_total.val(),
    desconto_porcent: "0.00",
    desconto: "0.00",
    valor_final: $valor_total.val(),
    nro_nf: "",
    data_emissao_nf: "",
    data_revisao_1: "",
    presenca_rev1: "",
    data_revisao_2: "",
    presenca_rev2: "",
    data_revisao_3: "",
    presenca_rev3: "",
    garantia_vitalicia: "",
    status: "Em Produção",
    observacao: "",
    motivo_cancelamento: ""
  };

  ajaxAprovarOrcamento(dadosParaEnviar, formOsSerialize);

}

function ajaxAprovarOrcamento(dadosParaEnviar, formOsSerialize) {
  $.ajax({
    url: baselink + "/ajax/aprovarOrcamento",
    type: "POST",
    data: dadosParaEnviar,
    dataType: "json",
    success: function (data) {
      if (data.message[0] == "00000") {
        window.open(baselink + "/ordemservico/imprimir/" + data.id_ordemservico + "?" + formOsSerialize, "_blank");
        window.location.href = baselink + "/orcamentos";
      }
    }
  });
}

function changeRequiredsPfPj() {
  let $radio = $('#form-principal [name="pf_pj"]:checked');

  if ($radio.attr("id") == "pj") {
    $("#form-principal [name=telefone]")
      .attr("required", "required")
      .siblings("label")
      .addClass("font-weight-bold")
      .find("> i")
      .removeClass("d-none")
      .addClass("d-inline-block");

    $("#form-principal [name=celular]")
      .removeAttr("required", "required")
      .siblings("label")
      .removeClass("font-weight-bold")
      .find("> i")
      .hide();
  } else {
    $("#form-principal [name=celular]")
      .attr("required", "required")
      .siblings("label")
      .addClass("font-weight-bold")
      .find("> i")
      .show();

    $("#form-principal [name=telefone]")
      .removeAttr("required", "required")
      .siblings("label")
      .removeClass("font-weight-bold")
      .find("> i")
      .addClass("d-none")
      .removeClass("d-inline-block");
  }
}

function acoesByStatus() {

  let $status = $("#status"),
    $tabela = $("#itensOrcamento");
  
  if ($status.val()) {

    let statusLowTxt = $status.val().toLowerCase();

    if (statusLowTxt == "cancelado" || statusLowTxt == "aprovado") {

      $tabela
        .find("thead > tr > th:first-child, tbody > tr > td:first-child")
        .hide();
  
      $("#btn_incluir")
        .parent()
        .hide();

      $('#form-principal, #camposOrc').find('.form-control, .form-check-input').attr("disabled", "disabled");
    }

  } else {
    $status
      .parent(".form-group")
      .parent()
      .hide();
  }
}

function checarClienteCadastrado() {
  let $idCliente = $('[name="id_cliente"]'),
    $btnAprovar = $("#aprovar-orcamento");

  if ($idCliente.val() == "0") {
    // Cliente não cadastrado
    $btnAprovar.text("Cadastrar Cliente");
  } else {
    $btnAprovar.text("Aprovar Orçamento");
  }
}

function setarClienteCadastrado(cliente) {

  let $form = $("#form-principal"),
    $idCliente = $form.find('[name="id_cliente"]'),
    $nome = $form.find("#nome_cliente"),
    $faturadoPara = $form.find("#faturado_para"),
    $telefone = $form.find("#telefone"),
    $celular = $form.find("#celular"),
    $email = $form.find("#email"),
    $comoConheceu = $form.find("#como_conheceu");

  if (cliente) {
    
    $("#modalCadastrarCliente").modal("hide");

    ajaxPopulaClientes();

    $form
      .find('[name="pf_pj"]#' + cliente.tipo_pessoa)
      .prop("checked", true)
      .change();

    $nome.val(cliente.nome);
    $faturadoPara.val(cliente.nome);;
    $telefone.val(cliente.telefone);
    $celular.val(cliente.celular);
    $email.val(cliente.email);

    if (cliente.comoconheceu == 'Contato') {

      let $optionContato = $comoConheceu.find('option').filter(function() {
        if ($(this).text() == 'Contato') {
          return this;
        }
      });

      $comoConheceu.val($optionContato.val()).change();
      
    } else {
      $comoConheceu.val(cliente.comoconheceu).change();
    }

    $idCliente.val(cliente.id).change();

    if (cliente.observacao) {
      collapseObsCliente(cliente.observacao);
    }

    habilitaBotaoOrcamento();
    checarAlternativo();

  }
}

function collapseObsCliente(observacao) {
  let $esquerda = $("#esquerda");

  if (observacao) {
    $("#collapseObsCliente").collapse("hide");

    $esquerda
      .find("#observacao_cliente[name=observacao_cliente]")
      .val(observacao);
  }

  tabindex();

}

function habilitaBotaoOrcamento() {

  var temAlteracao = false,
  $btnMainForm = $("#main-form"),
  $btnAprovar = $('#aprovar-orcamento');

  $('#form-principal').find('.form-control:visible, .form-check-input, input[type="hidden"]:not([name="alteracao"])').each(function () {

    var $this = $(this);

    if ($this.attr("type") == "radio") {
      $this = $this
        .parent()
        .siblings()
        .find(":checked");
    }

    var valorAtual = $this.val(),
      dataAnterior = $this.attr("data-anterior");

    valorAtual = String(valorAtual)
      .trim()
      .toUpperCase();
    dataAnterior = String(dataAnterior)
      .trim()
      .toUpperCase();

    if (dataAnterior != valorAtual) {
      if ($this.attr('name') != 'quem_indicou') {
        temAlteracao = true;
      }
    }
  });

  if (temAlteracao) {
    $btnMainForm.removeAttr("disabled");
    $btnAprovar.attr('disabled', 'disabled');
  } else {
    $btnMainForm.attr("disabled", "disabled");
    $btnAprovar.removeAttr('disabled');
  }
}

function tabindex() {

  let $camposEsquerda = $('#esquerda').find('.form-check-wrapper:visible, .form-control:visible, button.btn:visible'),
    $camposDireita = $('#direita #camposOrc').find('.form-check-wrapper:visible, .form-control:visible, button.btn:visible'),
    $camposEmbaixo = $('#embaixo').find('.form-control:visible');

  $camposEsquerda.each(function(index) {
    $(this).attr('tabindex', index + 1);
  });

  $camposDireita.each(function(index) {
    $(this).attr('tabindex', $camposEsquerda.length + (index + 1));
  });

  $camposEmbaixo.each(function(index) {
    $(this).attr('tabindex', ($camposDireita.length + $camposEsquerda.length) + (index + 1));
  });
  
  $('#acoes-orcamento').find('.btn:visible').each(function(index) {
    $(this).attr('tabindex', ($camposDireita.length + $camposEsquerda.length + $camposEmbaixo.length) + (index + 1));
  });

}

function limparDadosCliente() {
  // Telefone
  // Celular
  // Email
  // Como Conheceu
  // Quem Indicou
  // Observação do Cliente
  $('#esquerda').find('#telefone, #celular, #email, #como_conheceu, #quem_indicou, #observacao_cliente').val('');
}

function checarAlternativo() {

  let $alternativos = $('#itensOrcamento tbody tr').filter(function() {
    let tdTipoMaterial = $(this).find('td:eq(9)').text();
    if (tdTipoMaterial) {
      if (tdTipoMaterial.toLowerCase() == 'alternativo') {
        return this;
      }
    }
  }),
  $btnAprovar = $('#aprovar-orcamento');

  $('#material-alternativo-aprovar').remove();

  if ($alternativos.length) {

    if ($('[name="id_cliente"]').val() != '0') {
      
      // Não deixar aprovar
      $btnAprovar.attr('disabled', 'disabled');
  
      $('#col-aprovar').parent('.row').before(`
        <div id="material-alternativo-aprovar" class="row">
          <div class="col-lg-12">
            <div class="alert alert-warning" role="alert">
              <h4 class="alert-heading">Atenção!</h4>
              <hr>
              <p>Não é possível <b>aprovar</b> um orçamento com materias alternativos.</p>
              <p class="mb-0">Exclua-os ou transforme-os em principais.</p>
            </div>
          </div>
        </div>
      `);

    }

  } else {
    
    habilitaBotaoOrcamento();

  }
}

function ajaxPopulaClientes() {
  $.ajax({
    url: baselink + "/ajax/getRelacionalDropdownOrcamentos",
    type: "POST",
    data: {
      tabela: "clientes"
    },
    dataType: "json",
    success: function (data) {
      // JSON Response - Ordem Alfabética
      data.sort(function (a, b) {
        a = a.nome.toLowerCase();
        b = b.nome.toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
      });

      var htmlDropdown = "";

      data.forEach(element => {

        htmlDropdown +=
          `
          <div class="list-group-item list-group-item-action relacional-dropdown-element-cliente"
            data-id="` +
          element["id"] +
          `"
            data-tipo_pessoa="` +
          element["tipo_pessoa"] +
          `"
            data-telefone="` +
          element["telefone"] +
          `"
            data-celular="` +
          element["celular"] +
          `"
            data-email="` +
          element["email"] +
          `"
            data-comoconheceu="` +
          element["comoconheceu"] +
          `"
            data-observacao="` +
          element["observacao"] +
          `"
          >` +
          element["nome"] +
          `</div>
        `;

        if ($('[name="id_cliente"]').val() == element["id"]) {
          if (element["observacao"]) {
            $('#observacao_cliente')
              .attr('data-anterior', element["observacao"])
              .val(element["observacao"]);
          }
        }

      });

      $(
        "#esquerda .relacional-dropdown-wrapper .dropdown-menu .dropdown-menu-wrapper"
      ).html(htmlDropdown);
    }
  });

  $('[name="tipo_servico_produto"]').change();

  acoesByStatus();
  changeRequiredsPfPj();
  checarClienteCadastrado();

  var subtotal = floatParaPadraoInternacional($("#sub_total").val());
  var deslocamento = floatParaPadraoInternacional($("#custo_deslocamento").val());
  var desconto = floatParaPadraoInternacional($("#desconto").val());
  var $valorFinal = $("#valor_total");

  $valorFinal.val(floatParaPadraoBrasileiro( parseFloat(parseFloat(subtotal) + parseFloat(deslocamento) - parseFloat(desconto))));
}