
$(function () {
    
    $('#imprimirJPG').on('click', function () {
        $('#cardOpcoes, #nav, #sidebar-wrapper').addClass('d-none');
        html2canvas(document.body).then(function(canvas) {
            // Export canvas as a blob 
            canvas.toBlob(function(blob) {
                // Generate file download
                window.saveAs(blob, "orcamento.jpg");
                window.location.href = baselink+"/orcamentos";
            });
        });
    });

    // TESTES PARA MELHORAR A QUALIDADE DA IMAGEM


    // function myRenderFunction (){
    //     // Export canvas as a blob 
    //     canvas.toBlob(function(blob) {
    //         // Generate file download
    //         window.saveAs(blob, "orcamento.jpg");
    //         window.location.href = baselink+"/orcamentos";
    //     });
    // }

    // $('#imprimirJPG').on('click', function () {
    //     $('#cardOpcoes, #nav, #sidebar-wrapper').addClass('d-none');
    //         html2canvas(document.body, {
    //             scale: 2,
    //             onrendered: myRenderFunction
    //         });
    //         // Create a canvas with 144 dpi (1.5x resolution).
    //         html2canvas(document.body, {
    //             dpi: 144,
    //             onrendered: myRenderFunction
    //         });
    //     });


        // $('#imprimirJPG').on('click', function () {
        //     $('#cardOpcoes, #nav, #sidebar-wrapper').addClass('d-none');
        //     var scaleBy = 5;
        //     var w = 1000;
        //     var h = 1000;
        //     var div = document.querySelector('#screen');
        //     var canvas = document.createElement('canvas');
        //     canvas.width = w * scaleBy;
        //     canvas.height = h * scaleBy;
        //     canvas.style.width = w + 'px';
        //     canvas.style.height = h + 'px';
        //     var context = canvas.getContext('2d');
        //     context.scale(scaleBy, scaleBy);
        
        //     html2canvas(document.body, {
        //         canvas:canvas,
        //         onrendered: function (canvas) {
        //             theCanvas = canvas;
        //             document.body.appendChild(canvas);
        
        //             Canvas2Image.saveAsPNG(canvas);
        //             $(body).append(canvas);
        //         }
        //     });
        // });

    $("input[name='checkMedidas']").on('click', function(){
        if($(this).is(":checked")){
            $('.medidas').show();
        }else{
            $('.medidas').hide();
        }
    });

    $("input[name='checkUnitario']").on('click', function(){
        if($(this).is(":checked")){
            $('.unitario').show();
        }else{
            $('.unitario').hide();
        }
    });

    $("input[name='checkAvisos']").on('click', function(){
        if($(this).is(":checked")){
            $('#cardAvisos, #collapseAvisos').show();
        }else{
            $('#cardAvisos, #collapseAvisos').hide();
        }
    });

    $('#dropdownAvisos').on('blur change', function() {
    
        let $this = $(this),
          $elements = $this.siblings('.relacional-dropdown').find('.relacional-dropdown-element');
    
        let $filtereds = $elements.filter(function() {
          if ($this.val() && $(this).text()) {
            return $this.val().toLowerCase() == $(this).text().toLowerCase();
          }
        }); 
      });

    $(document)

    // ESCONDER OU MOSTRAR AVISOS
    .on('click', '.lista-itens', function(){
        var id = $(this).parents().attr('data-id');
        id = "#aviso" +id;
        if($(this).is(":checked")){
            $(id).removeClass("d-none");
        }else{
            $(id).addClass("d-none");
        }
    })

    // CARREGAR LISTA DE AVISOS
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

          htmlDropdown +=`
          <div id="opcoesAvisos">
          
          `;

          data.forEach(element => {
            htmlDropdown += `
            
              <div class="list-group-item list-group-item-action relacional-dropdown-element"
                data-titulo="` + element["titulo"] + `"
                data-id="` + element["id"] + `"
                data-mensagem="` + element["mensagem"] + `"
              >
              <input class="lista-itens mx-2" type="checkbox" name="checkboxAviso" value="`+ element["titulo"]+ `">`
               + element["titulo"] + `:   ` + element["mensagem"] + `</div>
            
              `;
          });

          htmlDropdown +=`
          </div>
          `;

          $( ".relacional-dropdown-wrapper .dropdown-menu .dropdown-menu-wrapper"
          ).html(htmlDropdown);

        }
      });
    })
});
