// import { exists } from "fs";

$(function () {

    $('#btn_editarBD').addClass('disabled');
    $('#btn_excluirBD').addClass('disabled');
    $('#btn_verForm').addClass('disabled');
    $('#btn_criarMVC').addClass('disabled');
    $('#btn_excluirMVC').addClass('disabled');

    // Inicializando a estrutura da tabela como Sortable e checkbox estilizado
    $( "#campos_tabela" ).sortable().disableSelection()
    .on( "sortupdate", function( event, ui ) {   
        acertaOrdemForm();
    });


    $( "input[type=checkbox]" ).checkboxradio({
      icon: false
    });

    // Validação se o nome da tabela já existe
    $('#nome_tabela').blur(function () {
        
        if( $(this).val() !== '' ){

            $.ajax({
                url: baselink + '/ajax/buscaTabela',
                type: 'POST',
                data: {
                    tabela: $(this).val()
                },
                dataType: 'json',
                success: function (data) {
                    if( data === true ){
                        $('#nome_tabela').val('').focus();
                        alert('Essa tabela já existe no BD. Mude!');
                        return false;
                    }
                }
            });
        }
    });

    $('#tamanho_campo').blur(function(){
        if( $(this).val() !== ''){
            if( isNaN( parseFloat( $(this).val() ) ) ){
                $('#tamanho_campo').val('').blur();
                return false;
            }
           
        }
    });
    /////////////////////////////
    $('#btn_criarBD').on('click', function(){
        
        if( $('#nome_tabela').val() == ''){
            $('#nome_tabela').focus();
            return false;
        }else if( $('#lbl_brownser').val() == ''){
            $('#lbl_brownser').focus();
            return false;
        } else if( $('#lbl_form').val() == '' ){
            $('#lbl_form').focus();
            return false;
        }else if( $('#campos_tabela li').length <= 0 ){
            alert('A tabela deve ter pelo menos um campo.')
            $('#nome_campo').focus();
            return false;
        }else{
            if(confirm('Criar a Tabela?') === true){
                // todos os requisitos estão OK para criar a tabela
                var query1 = '', nomeTab = '', lblBr = '', lblFm = '';
                nomeTab = $('#nome_tabela').val().trim().toLowerCase();
                lblBr = $('#lbl_brownser').val().trim().toLowerCase();
                lblFm = $('#lbl_form').val().trim().toLowerCase();

                query1 = "CREATE TABLE `"+nomeTab+"` ("+"`id`"+" int(11) NOT NULL COMMENT "+`'{"label": "Ações", "form": "false", "type": "acoes", "ver": "true"}',`;
                    
                //for em todas as <li>
                for(var i = 0; i < $('#campos_tabela li').length; i++ ){
                    query1 += $('#campos_tabela li:eq('+i+')').find('div.col-lg-11').text() + ",";
                }
                
                query1 += "`alteracoes` text NOT NULL COMMENT "+`'{"ver":"false","form":"true", "type":"hidden", "mascara_validacao":"false"}',`+" `situacao` varchar(8) NOT NULL COMMENT"+` '{"ver": "false", "form": "false"}') ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='{ "labelBrowser":"`+lblBr+`", "labelForm":"`+lblFm+`"}'`;

                // console.log(query1);
                

                var query2 = '', query3 = '';
                query2 = "ALTER TABLE `"+nomeTab+"` ADD PRIMARY KEY (`id`);";
                query3 = "ALTER TABLE `"+nomeTab+"` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT "+`'{"label": "Ações", "form": "false", "type": "acoes", "ver": "true"}'`;
                // console.log(query2);
                // console.log(query3); 

                if( query1 !== '' && query2 !== '' && query3 !== '' ){
                    // ajax para executar a query e criar a tabela
                    
                    $.ajax({
                        url: baselink + '/ajax/criaTabela',
                        type: 'POST',
                        data: {
                            tabela: $('#nome_tabela').val(),
                            query1: query1,
                            query2: query2,
                            query3: query3
                        },
                        dataType: 'json',
                        success: function (data) {
                            if( data === true ){
                                
                                $('#nome_tabela, #lbl_brownser, #lbl_form, #form_tabela input, #form_tabela select').val('').blur();
                                $('#campos_tabela li').remove();
                                
                                Toast({
                                    message: 'Tabela criada com sucesso, Acerte o TEMPLATE!',
                                    class: 'alert-success'
                                });
                                window.location.href = baselink + '/desenvolvimento';
                            }else{
                                Toast({
                                    message: 'A tabela não foi criada!',
                                    class: 'alert-danger'
                                });
                            }
                        }
                    });
                    // executar a função que cria o MVC dessa tabela
                }        
            }
        }
    });

    $('#btn_editarBD').on('click', function(){
        
        if( $('#tabelas').find(':selected').val() == ''){
            $('#tabelas').focus();
            return false;
        }else if( $('#campos_tabela li').length <= 0 ){
            alert('A tabela deve ter pelo menos um campo.')
            $('#nome_campo').focus();
            return false;
        }else if( 
            tabelasINFO[ $('#tabelas').find(':selected').val() ]['comentario']['labelBrowser'] == ''  || tabelasINFO[ $('#tabelas').find(':selected').val() ]['comentario']['labelBrowser'] == undefined  ||
            tabelasINFO[ $('#tabelas').find(':selected').val() ]['comentario']['labelForm'] == ''  ||
            tabelasINFO[ $('#tabelas').find(':selected').val() ]['comentario']['labelForm'] == undefined  ){
            alert('A tabela Não tem os Labels, recriá-la.')
            return false;
        
        }else{
            if(confirm('Editar a Tabela?') === true){

                // todos os requisitos estão OK para criar a tabela
                var query1 = '', nomeTab = '', lblBr = '', lblFm = '';
                nomeTab = $('#tabelas').find(':selected').val().trim().toLowerCase();
                lblBr = tabelasINFO[ $('#tabelas').find(':selected').val() ]['comentario']['labelBrowser'].trim().toLowerCase();
                lblFm =tabelasINFO[ $('#tabelas').find(':selected').val() ]['comentario']['labelForm'].trim().toLowerCase();

                query1 = "CREATE TABLE `"+nomeTab+"` ("+"`id`"+" int(11) NOT NULL COMMENT "+`'{"label": "Ações", "form": "false", "type": "acoes", "ver": "true"}',`;

                //for em todas as <li>
                for(var i = 0; i < $('#campos_tabela li').length; i++ ){
                    query1 += $('#campos_tabela li:eq('+i+')').find('div.col-lg-11').text() + ",";
                }
                
                query1 += "`alteracoes` text NOT NULL COMMENT "+`'{"ver":"false","form":"true", "type":"hidden", "mascara_validacao":"false"}',`+" `situacao` varchar(8) NOT NULL COMMENT"+` '{"ver": "false", "form": "false"}') ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='{ "labelBrowser":"`+lblBr+`", "labelForm":"`+lblFm+`"}'`;

                // console.log('query1:',query1);

                var query2 = '', query3 = '';
                query2 = "ALTER TABLE `"+nomeTab+"` ADD PRIMARY KEY (`id`);";
                query3 = "ALTER TABLE `"+nomeTab+"` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT "+`'{"label": "Ações", "form": "false", "type": "acoes", "ver": "true"}'`;
                
                // console.log('query2:',query2);
                // console.log('query3:',query3);
                // return false;
                if( query1 !== '' && query2 !== '' && query3 !== '' ){
                    // ajax para executar a query e criar a tabela
                    
                    $.ajax({
                        url: baselink + '/ajax/editaTabela',
                        type: 'POST',
                        data: {
                            tabela: nomeTab,
                            query1: query1,
                            query2: query2,
                            query3: query3
                        },
                        dataType: 'json',
                        success: function (data) {
                            if( data === true ){
                                $('#tabelas').val('');
                                $('#campos_tabela li').remove();
                                
                                Toast({
                                    message: 'Tabela editada com sucesso, Acerte o TEMPLATE!',
                                    class: 'alert-success'
                                });
                                window.location.href = baselink + '/desenvolvimento';
                            }else{
                                Toast({
                                    message: 'A tabela não foi editada!',
                                    class: 'alert-danger'
                                });
                            }
                        }
                    });
                    // executar a função que cria o MVC dessa tabela
                }        

            }else{
                return false;
            }
        }    
        
    });

    $('#btn_excluirBD').on('click', function(){
        
        if( $('#tabelas').find(':selected').val() == ''){
            $('#tabelas').focus();
            return false;        
        }else{
            if(confirm('Excluir a Tabela?') === true){

                // todos os requisitos estão OK para criar a tabela
                var nomeTab = '';
                nomeTab = $('#tabelas').find(':selected').val().trim().toLowerCase();
                
                // ajax para executar a query e excluir a tabela
                
                $.ajax({
                    url: baselink + '/ajax/excluiTabela',
                    type: 'POST',
                    data: {
                        tabela: nomeTab
                    },
                    dataType: 'json',
                    success: function (data) {
                        if( data === true ){
                            $('#tabelas').val('');
                            $('#campos_tabela li').remove();
                            
                            Toast({
                                message: 'Tabela excluída com sucesso, Acerte o TEMPLATE!',
                                class: 'alert-success'
                            });
                            window.location.href = baselink + '/desenvolvimento';
                        }else{
                            Toast({
                                message: 'A tabela não foi excluída!',
                                class: 'alert-danger'
                            });
                        }
                    }
                });
            }else{
                return false;
            }
        }    
        
    });

    $('#btn_criarMVC').on('click', function(){
        
        if( $('#tabelas').find(':selected').val() == ''){
            $('#tabelas').focus();
            return false;        
        }else{
            if(confirm('Criar a Estrutura MVC dos Arquivos?') === true){
                // todos os requisitos estão OK para criar a tabela
                var nomeTab = '';
                nomeTab = $('#tabelas').find(':selected').val().trim().toLowerCase();
                
                $.ajax({
                    url: baselink + '/ajax/criarMVC',
                    type: 'POST',
                    data: {
                        tabela: nomeTab
                    },
                    dataType: 'json',
                    success: function (data) {
                        if( data === true ){
                            $('#tabelas').val('');
                            $('#campos_tabela li').remove();
                            
                            Toast({
                                message: 'MVC criado com sucesso, Acerte o TEMPLATE!',
                                class: 'alert-success'
                            });
                            window.location.href = baselink + '/desenvolvimento';
                        }else{
                            Toast({
                                message: 'MVC não foi criado!',
                                class: 'alert-danger'
                            });
                        }
                    }
                });
            }else{
                return false;
            }
        }    
    });

    $('#btn_excluirMVC').on('click', function(){
        
        if( $('#tabelas').find(':selected').val() == ''){
            $('#tabelas').focus();
            return false;        
        }else{
            if(confirm('Criar a Estrutura MVC dos Arquivos?') === true){
                // todos os requisitos estão OK para criar a tabela
                var nomeTab = '';
                nomeTab = $('#tabelas').find(':selected').val().trim().toLowerCase();
                
                $.ajax({
                    url: baselink + '/ajax/excluirMVC',
                    type: 'POST',
                    data: {
                        tabela: nomeTab
                    },
                    dataType: 'json',
                    success: function (data) {
                        if( data === true ){
                            $('#tabelas').val('');
                            $('#campos_tabela li').remove();
                            
                            Toast({
                                message: 'MVC excluído com sucesso, Acerte o TEMPLATE!',
                                class: 'alert-success'
                            });
                            window.location.href = baselink + '/desenvolvimento';
                        }else{
                            Toast({
                                message: 'MVC não foi excluído!',
                                class: 'alert-danger'
                            });
                        }
                    }
                });
            }else{
                return false;
            }
        }    
    });

    
    $('.collapse').on('show.bs.collapse hide.bs.collapse', function () {
        limparTabela();
        limparCamposPrincipais();
        limpaCamposForm();  
    }); 

    $('#btn_incluir').on('click', function(){
        // testa se tem algum elemento que NÃO tá preenchido
        if ( formPreenchido() != '' ){
            if( $('#campos_tabela li').length > 0 ){
                // testar se já existe o nome
                var nomelinha = [];
                for(var i=0; i< $('#campos_tabela li').length; i++){
                    var aux = '', 
                    aux = $('#campos_tabela li:eq('+i+')').find('.col-lg-11').text();
                    nomelinha.push( aux.split('`')[1] );
                }
                if( nomelinha.indexOf( $('#nome_campo').val().trim() ) !== -1 ){
                    // alert('Esse nome de campo já foi utilizado. Mude!');
                    // $('#nome_campo').val('');
                    // return false;
                    var nomecampo = $('#nome_campo').val().toLocaleLowerCase().trim();
                    var nrolinha = nomelinha.indexOf( $('#nome_campo').val().trim() );
                    console.log($('#'+nomecampo));
                    console.log(nrolinha); 
                    $('#'+nomecampo).after(formPreenchido());
                    $('#campos_tabela li:eq('+nrolinha+')').remove();
                }else{
                    $('#campos_tabela').append(formPreenchido());
                }
            }else{
                $('#campos_tabela').append(formPreenchido());
            }
        }
    });

    $('#tabelas').on('change', function(){
        // testa se tem algum elemento que NÃO tá preenchido
        // console.log( tabelasDB[$(this).find(':selected').val()] )
        if ( $(this).find(':selected').val() != '' ){

            $('#btn_editarBD').removeClass('disabled');
            $('#btn_excluirBD').removeClass('disabled');

            if ( tabelasINFO[ $(this).find(':selected').val() ]['mvc_arq'] == true ){
                
                $('#btn_criarMVC').addClass('disabled');
                $('#btn_excluirMVC').removeClass('disabled');
                $('#btn_verForm').removeClass('disabled');
                $('#btn_verForm').attr('href', baselink+'/'+$(this).find(':selected').val()+'/adicionar');
                
            }else{
                $('#btn_criarMVC').removeClass('disabled');
                $('#btn_excluirMVC').addClass('disabled');
                $('#btn_verForm').addClass('disabled');
                $('#btn_verForm').attr('href','');
                
            }

            if( $('#campos_tabela li').length > 0 ){
                // limpar os campos da tabela
                $('#campos_tabela').find('li').remove();
                // remontar a tabela
                for(var j=0; j < tabelasDB[$(this).find(':selected').val()].length; j++){
                    var linha = '', nomecampo = '', aux='';
                    aux = tabelasDB[$(this).find(':selected').val()][j].split("`");
                    nomecampo = aux[1];
                    // console.log('nome campo:', nomecampo);
                    // console.log('linha do DB: ', tabelasDB[$(this).find(':selected').val()][j] );

                    if(nomecampo != 'id' && nomecampo != 'alteracoes' && nomecampo != 'situacao'){
                        linha = `<li class="ui-state-default">
                                    <div class="row" id="`+nomecampo+`">
                                        <div class="col-lg-1">
                                            <i class="btn btn-sm btn-primary fas fa-edit" onclick="edita(this)"></i>
                                            <i class="btn btn-sm btn-danger fas fa-trash-alt" onclick="remove(this)"></i>
                                        </div>
                                        <div class="col-lg-11">`+tabelasDB[$(this).find(':selected').val()][j]+`</div>
                                    </div>
                                </li>`;
                        $('#campos_tabela').append(linha);
                    }
                    
                }

            }else{
                // montar a tabela
                for(var j=0; j < tabelasDB[$(this).find(':selected').val()].length; j++){
                    var linha = '', nomecampo = '', aux='';
                    aux = tabelasDB[$(this).find(':selected').val()][j].split("`");
                    nomecampo = aux[1];
                    // console.log(nomecampo);
                    if(nomecampo != 'id' && nomecampo != 'alteracoes' && nomecampo != 'situacao'){
                        linha = `<li class="ui-state-default" id='`+nomecampo+`'>
                                    <div class="row">
                                        <div class="col-lg-1">
                                            <i class="btn btn-sm btn-primary fas fa-edit" onclick="edita(this)"></i>
                                            <i class="btn btn-sm btn-danger fas fa-trash-alt" onclick="remove(this)"></i>
                                        </div>
                                        <div class="col-lg-11">`+tabelasDB[$(this).find(':selected').val()][j]+`</div>
                                    </div>
                                </li>`;
                        $('#campos_tabela').append(linha);
                    }
                    
                }
            }
        }else{
            $('#btn_editarBD').addClass('disabled');
            $('#btn_excluirBD').addClass('disabled');
            $('#btn_criarMVC').addClass('disabled');
            $('#btn_excluirMVC').addClass('disabled');
            $('#btn_verForm').addClass('disabled');
            $('#btn_verForm').attr('href','');
        }    
        
    });

});

function remove(elemento){
    // console.log('cliquei na lixeira');
    if(confirm('Quer excluir a linha?')){
        elemento.closest('li').remove();
    }
};
function edita(elemento){
    
    var texto = $(elemento).closest('div').siblings().text();
    // console.log(texto)
    texto = texto.split('`');
    // console.log(texto)
    var nome = '', tipo = '', tamanho = '', comentario = '', obrigatorio = '', aux1 = '', aux2 = '';
    nome = texto[1].trim();
    aux1 = texto[2].split("'");
    // console.log('aux1',aux1)
    comentario = JSON.parse(aux1[1]);

    if ( aux1[0].indexOf(')') > 0 ){

        aux2 = aux1[0].split('(');
        tipo = aux2[0].trim();
        tamanho = aux2[1].split(')')[0];
    
    }else{

        tamanho = '';
        if( aux1[0].indexOf('NOT') > 0 ){
            aux2 = aux1[0].split('NOT');
            tipo = aux2[0].trim();
        }else{
            aux2 = aux1[0].split('NULL');
            tipo = aux2[0].trim();
        }
    }

    if( aux1[0].indexOf('NOT') > 0 ){   
        obrigatorio = true;     
    }else{
        obrigatorio = false;
    }
     
    // console.log('nome', nome)
    // console.log('tipo', tipo)
    // console.log('tamanho', tamanho)
    // console.log('obrigatorio', obrigatorio)
    
    // console.log('comentario', comentario)
    // console.log('info relacional', JSON.stringify(comentario['info_relacional']) )
    // console.log('teste ver', JSON.parse(comentario['ver']))
    // console.log('label', )
    
    var inforelacional = '';

    if ( ( comentario['type'] == 'relacional' || comentario['type'] == 'dropdown' ) && comentario['info_relacional'] != undefined && comentario['info_relacional'] != null  && comentario['info_relacional'] != '' ){
        // console.log('info_relacional ----- ', comentario['info_relacional']);
        inforelacional =  "(" + comentario['info_relacional']['tabela'] + "," + comentario['info_relacional']['campo'] + ")";
        // console.log('comentario transformado:', inforelacional );
    }else if ( comentario['options'] != undefined && comentario['options'] != null  && comentario['options'] != '' &&  comentario['type'] == 'radio' ){

        var conteudo =  JSON.stringify(comentario['options']);
        
        // console.log('radioooooo:', conteudo);
        conteudo = conteudo.replace("{" , "(");
        conteudo = conteudo.replace("}" , ")");
        conteudo = conteudo.replace('"','').replace('"','').replace('"','').replace('"','');
        conteudo = conteudo.replace('"','').replace('"','').replace('"','').replace('"','');
        conteudo = conteudo.replace('"','').replace('"','').replace('"','').replace('"','');
        conteudo = conteudo.replace('"','').replace('"','').replace('"','').replace('"','');

        conteudo = conteudo.replace(",",")(").replace(",",")(").replace(",",")(").replace(",",")(");
        conteudo = conteudo.replace(":",",").replace(":",",").replace(":",",").replace(":",",");
        // console.log('conteudo radio transform:', conteudo);

        inforelacional = conteudo;
        $('#info_relacional').val(inforelacional);

    }else{

        $('#info_relacional').val('');
    }
    
    limpaCamposForm();

    $('#nome_campo').val(nome);
    $('#nome_campo').attr('data-anterior', nome);
    $('#tipo_campo').val(tipo);
    $('#tamanho_campo').val(tamanho);
    $('#label').val(comentario['label']);
    $('#mascara_validacao').val(comentario['mascara_validacao']);
    $('#column').val(comentario['column']);
    $('#ordem_form').val(comentario['ordem_form']);
    $('#type').val(comentario['type']);
    $('#info_relacional').val(inforelacional);

    $( "#obrigatorio" ).attr('checked', obrigatorio);
    $( "#obrigatorio" ).checkboxradio( "refresh" );

    
    if( JSON.parse( comentario['ver'] ) == true ){
        if( $( "#ver" ).is(':checked') == false ){
            $( "#ver" ).click();
        }
    }else{
        if( $( "#ver" ).is(':checked') == true ){
            $( "#ver" ).click();
        }
    }

    if( JSON.parse( comentario['form'] ) == true ){
        if( $( "#form" ).is(':checked') == false ){
            $( "#form" ).click();
        }
    }else{
        if( $( "#form" ).is(':checked') == true ){
            $( "#form" ).click();
        }
    }

    if( JSON.parse( obrigatorio ) == true ){
        if( $( "#obrigatorio" ).is(':checked') == false ){
            $( "#obrigatorio" ).click();
        }
    }else{
        if( $( "#obrigatorio" ).is(':checked') == true ){
            $( "#obrigatorio" ).click();
        }
    }

    if( JSON.parse( comentario['unico'] ) == true ){
        if( $( "#unico" ).is(':checked') == false ){
            $( "#unico" ).click();
        }
    }else{
        if( $( "#unico" ).is(':checked') == true ){
            $( "#unico" ).click();
        }
    }
    

    if( JSON.parse( comentario['pode_zero'] ) == true ){
        if( $( "#pode_zero" ).is(':checked') == false ){
            $( "#pode_zero" ).click();
        }
    }else{
        if( $( "#pode_zero" ).is(':checked') == true ){
            $( "#pode_zero" ).click();
        }
    }

    if( JSON.parse( comentario['filtro_faixa'] ) == true ){
        if( $( "#filtro_faixa" ).is(':checked') == false ){
            $( "#filtro_faixa" ).click();
        }
    }else{
        if( $( "#filtro_faixa" ).is(':checked') == true ){
            $( "#filtro_faixa" ).click();
        }
    }

};
function acertaOrdemForm(){
    if( $('#campos_tabela li').length > 0 ) {
        for ( var pos = 0; pos < $('#campos_tabela li').length ; pos++ ){
            var ordemform = '', text='', aux ='', text2='';
            
            text = $('#campos_tabela li:eq('+pos+')').find('.col-lg-11').text();
            aux =  text.split("'")[1];
            ordemform = aux.split(',');
            text2 = text.replace(ordemform[3], '"ordem_form":"'+parseInt(pos+1)+'"');
            $('#campos_tabela li:eq('+pos+')').find('.col-lg-11').text(text2);
            
        }
    }
    
}

function limpaCamposForm(){
    $('#form_tabela').find('input[type=text]').val('').removeClass('is-valid is-invalid');
    $('#form_tabela').find('select').val('').removeClass('is-valid is-invalid');
    
    $('#form_tabela').find('input[type=checkbox]').each(function(){
        if ( $(this).is(':checked') == true ){
            $(this).click();
        }
    });    
}

function limparTabela(){
    $('#campos_tabela li').remove();
}
function limparCamposPrincipais(){
    $('#tabelas').val('').removeClass('is-valid is-invlaid');
    $('#nome_tabela').val('').removeClass('is-valid is-invlaid');
    $('#lbl_brownser').val('').removeClass('is-valid is-invlaid');
    $('#lbl_form').val('').removeClass('is-valid is-invlaid');
    // campos principais da criação da tabela parâmetros
}

// retorna a linha que deve ser incluida na tabela
function formPreenchido(){
    var ok = true, coment = '';
    
    if( $('#nome_campo').val() == '' ){
        $('#nome_campo').focus();
        ok = false;
        return false;
    }else{
        coment += '`' + $('#nome_campo').val().trim().toLowerCase() + '` ';
    }
    
    if( $('#tipo_campo').val() != '' ){
        if( $('#tipo_campo').val() == 'varchar' || 
            $('#tipo_campo').val() == 'float' || 
            $('#tipo_campo').val() == 'int' ){
                if( $('#tamanho_campo').val() != '' ){
                    coment += $('#tipo_campo').val().trim().toLowerCase() + '(' + $('#tamanho_campo').val() + ')';
                }else{
                    $('#tamanho_campo').focus();
                    ok = false;
                    return false;
                }
        }else{
            coment += $('#tipo_campo').val().trim().toLowerCase() + ' ';
        }
    }else {
        $('#tipo_campo').focus();
        ok = false;
        return false;
    }

    if( $('#obrigatorio').is(':checked') ){
        coment += ' NOT NULL ';
    }else{
        coment += ' DEFAULT NULL ';
    }
    
    // if ( $('#tabelas').find(':selected').val() == '' || $('#tabelas').find(':selected').val() == undefined ){
        coment += " COMMENT '{ ";
    // }else{
    //     coment += " COMMENT `{ ";
    // }
    

    if( $('#label').val() == '' ){
        $('#label').focus();
        ok = false;
        return false;
    }else{

        coment += '"' + $('#label').attr('name') + '":"' + $('#label').val() + '", ';
    }

    if( $('#mascara_validacao').val() == '' ){
        $('#mascara_validacao').focus();
        ok = false;
        return false;
    }else{

        coment += '"' + $('#mascara_validacao').attr('name') + '":"' + $('#mascara_validacao').find(':selected').val() + '", ';
    }

    if( $('#column').val() == '' ){
        $('#column').focus();
        ok = false;
        return false;
    }else{

        coment += '"' + $('#column').attr('name') + '":"' + $('#column').val() + '", ';
    }

    if( $('#ordem_form').val() == '' ){
        $('#ordem_form').focus();
        ok = false;
        return false;
    }else{

        coment += '"' + $('#ordem_form').attr('name') + '":"' + $('#ordem_form').val() + '", ';
    }

    if( $('#type').val() == '' ){
        $('#type').focus();
        ok = false;
        return false;
    }else{

        coment += '"' + $('#type').attr('name') + '":"' + $('#type').find(':selected').val() + '", ';
    }

    if( $('#info_relacional').val() == '' ){
        var input = $("#type").find(':selected').val();
        if( input == 'radio' || input == 'checkbox' || input == 'relacional' || input == 'dropdown' ){
            $('#info_relacional').focus();
            ok = false;
            return false;       
        }
    }else{

        var input = $("#type").find(':selected').val();
        if( input == 'radio' ){
            var contAux ='', conteudo = '';
            contAux = $('#info_relacional').val();
            contAux = contAux.split(')');
            conteudo = '"options":{';
            for(var j=0; j < contAux.length-1; j++){
                var item = []; item = contAux[j].split(',');
                //colocar a vírgula depois da dupla
                if( j < contAux.length - 2 ){
                    conteudo += '"' + item[0].substr( 1 , item[0].length ) + '":"' + item[1] + '", ';
                }else{
                    conteudo += '"' + item[0].substr( 1 , item[0].length ) + '":"' + item[1] + '"';
                }
                
            }
            conteudo += '},';
                    
        }else if( input == 'checkbox' || input == 'relacional' || input == 'dropdown' ){
            var contAux ='', conteudo = '', tabela = '', campo = '';
            contAux = $('#info_relacional').val();
            contAux = contAux.split(',');
            conteudo = '"info_relacional":{';
            
            tabela = contAux[0].substr( 1 , contAux[0].length ).trim();
            campo = contAux[1].substr( 0 , contAux[1].length - 1 ).trim();

            conteudo += '"tabela":"'+tabela+'","campo":"'+campo+'"}, ';    
            
        }
        // console.log(conteudo);
        coment += conteudo;
    }

    $( '#form_tabela input[type=checkbox]' ).each(function() {
        if( $(this).attr('name') != 'obrigatorio' ){
            if( $(this).is(':checked') == true ){
                coment += '"' + $(this).attr('name') + '":"true", ';
            }else{
                coment += '"' + $(this).attr('name') + '":"false", ';
            }
        }
    });

    coment = coment.substr( 0 , coment.length - 2 );
    // if ( $('#tabelas').find(':selected').val() == '' || $('#tabelas').find(':selected').val() == undefined ){
        coment += " }'";
    // }else{
    //     coment += " }`";
    // }
    

    var linha = '';
    if( ok == true ){    

        linha = `<li class="ui-state-default" id='`+$('#nome_campo').val().trim().toLowerCase()+`'>
                    <div class="row">
                        <div class="col-lg-1">
                            <i class="btn btn-sm btn-primary fas fa-edit" onclick="edita(this)"></i>
                            <i class="btn btn-sm btn-danger fas fa-trash-alt" onclick="remove(this)"></i>
                        </div>
                        <div class="col-lg-11">`+coment+`</div>
                    </div>
                </li>`;
    }
    
    return linha;
};


