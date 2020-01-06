<style>
    #campos_tabela { list-style-type: none; margin: 1px; padding: 1px; width: 100%; }
    #campos_tabela li { margin: 0px; padding: 0.4em; padding-left: 1em; padding-right: 1em; font-size: 1em; height: auto; overflow-x: auto; white-space: nowrap;}
    input[type=checkbox] { width: 100%; height: auto;}
</style>
<script>
    var tabelasDB;
        tabelasDB = <?php echo json_encode($tabelasDB);?>,
        tabelasINFO = <?php echo json_encode($tabelasINFO);?>;
        // console.log(tabelasDB);
</script>
<script src="<?php echo BASE_URL?>/assets/js/vendor/jquery-ui.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL;?>/assets/js/create_table.js" type="text/javascript"></script>

    
    <div class="row">
        <button class="btn btn-primary m-2 text-center font-weight-bold" type="button" data-toggle="collapse" data-target="#criarTabela" aria-expanded="false" aria-controls="collapseExample">Criar Tabela Normal</button>

        <button class="btn btn-success m-2 text-center font-weight-bold" type="button" data-toggle="collapse" data-target="#editarTabela" aria-expanded="false" aria-controls="collapseExample">Editar Tabela</button>
        
        <button class="btn btn-warning m-2 text-center font-weight-bold" type="button" data-toggle="collapse" data-target="#criarTabelaParametro" aria-expanded="false" aria-controls="collapseExample">Criar Tabela Parêmetro</button>
        
        <div class="col-lg">
            <div class="alert bg-info text-white m-2 text-center font-weight-bold" role="alert">
                Campos 'ID', 'ALTERACOES' e 'SITUACAO' são criados automaticamente 
            </div>
        </div>
    </div>
    
        

<div class="collapse my-3" id="criarTabela">
    <div class="card card-body">
        <div class="row mb-4">
        <div class="col-lg">
            <label for="nome_tabela" class="font-weight-bold" >* Nome da Tabela</label>
            <input 
                type="text" 
                class="form-control" 
                id="nome_tabela" 
                name="nome_tabela" 
                data-mascara_validacao="false"
                maxlength="40" 
                required
            >
        </div>
        <div class="col-lg">
            <div class="row">
                <div class="col-lg">
                    <label for="lbl_brownser" class="font-weight-bold" >* Label Brownser</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="lbl_brownser" 
                        name="lbl_brownser" 
                        data-mascara_validacao="false"
                        maxlength="40" 
                        required
                    >
                </div>
                <div class="col-lg">
                    <label for="lbl_form" class="font-weight-bold" >* Label Form</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="lbl_form" 
                        name="lbl_form" 
                        data-mascara_validacao="false"
                        maxlength="40" 
                        required
                    >
                </div>
            </div>
        </div>
        <div class="col-lg-2 d-flex align-self-end">
            <div id="btn_criarBD" class="btn btn-success btn-block">Criar BD</div>                
        </div>
    </div>
    </div>
</div>
<div class="collapse my-3" id="editarTabela">
    <div class="card card-body">
        <div class="row">
            <div class="col-lg-3 mb-2">
                <label for="tabelas" class="font-weight-bold" >* Tabelas BD</label>
                <select id="tabelas" 
                        name="tabelas"
                        class="form-control"
                        data-anterior=""
                        data-mascara_validacao = "false"
                        required
                >
                    <option value="" selected >Selecione</option>
                    <?php foreach ($tabelasDB as $key => $value):?> 
                        <option value='<?php echo $key?>' ><?php echo ucfirst($key)?></option> 
                    <?php endforeach;?>      
                </select>
            </div>
            <div class="col-lg d-flex align-self-end mb-2">
                <div id="btn_editarBD" class="btn btn-success btn-block">Editar BD</div>                
            </div>
            <div class="col-lg d-flex align-self-end mb-2">
                <div id="btn_excluirBD" class="btn btn-danger btn-block">Excluir BD</div>                
            </div>
            <div class="col-lg d-flex align-self-end mb-2">
                <div id="btn_criarMVC" class="btn btn-primary btn-block">Criar MVC</div>                
            </div>
            <div class="col-lg d-flex align-self-end mb-2">
                <div id="btn_excluirMVC" class="btn btn-warning  btn-block">Excluir MVC</div>                
            </div>
            <div class="col-lg d-flex align-self-end mb-2">
                <a href="<?php echo BASE_URL?>/modulo/adicionar" target="_blank" id="btn_verForm" class="btn btn-dark btn-block">Ver Form</a>             
            </div>
        </div>
    </div>
</div>
<div class="collapse my-3" id="criarTabelaParametro">
    <div class="card card-body">
        <div class="row mb-4">
            <div class="col-lg-3">
                <label for="nome_tabela_parametro" class="font-weight-bold" >* Nome da Tabela</label>
                <input type="text" class="form-control" id="nome_tabela_parametro" 
                    name="nome_tabela_parametro" data-mascara_validacao="false">
            </div>
            <div class="col-lg-3">
                <label for="label_tabela_parametro" class="font-weight-bold" >* Label </label>
                <input type="text" class="form-control" id="label_tabela_parametro" 
                    name="label_tabela_parametro" data-mascara_validacao="false" >
            </div>
            <div class="col-lg-1">
                <label for="column_tabela_parametro" class="font-weight-bold" >* Column</label>
                <input type="text" class="form-control" id="column_tabela_parametro" 
                    name="column_tabela_parametro" data-mascara_validacao="numero" maxlength='2' >
            </div>
            <div class="col-lg-2">
                <label for="campo_tabela_parametro" class="font-weight-bold" >* Parâmetro Campo</label>
                <input type="text" class="form-control" id="campo_tabela_parametro" 
                    name="campo_tabela_parametro" data-mascara_validacao="false" >
            </div>
           <div class="col-lg-3">
                <div class="form-group">
                    <label class="font-weight-bold" for="tipo_parametro">Tipo de Parâmetro</label>
                    
                    <div class="form-check-wrapper form-radio position-relative pr-4" >
                        <div class="form-check form-check-inline position-static">
                            <input type="radio" id="Simples" value="simples" name="tipo_parametro"   class="form-check-input" >
                            <label class="form-check-label" for="Simples">Simples</label>
                        </div>
                        <div class="form-check form-check-inline position-static">
                            <input type="radio" id="Dependente" value="dependente" name="tipo_parametro" class="form-check-input">
                            <label class="form-check-label" for="Dependente">Dependente</label>
                        </div>
                    </div>    
                </div>
            </div>
            <div class="col-lg-6">
                <label for="inforela_tabela_parametro" class="font-weight-bold" >* Info Relação</label>
                <input type="text" class="form-control" id="inforela_tabela_parametro" 
                    name="inforela_tabela_parametro" data-mascara_validacao="false" >
            </div>
           <!--  -->
           <!--  -->
        <div class="col-lg d-flex align-self-end">
            <div id="btn_criarTabParam" class="btn btn-success btn-block">Criar BD</div>                
        </div>
    </div>
    </div>
</div>

<!-- Estrutura usada tanto para criação da tabela quanto para edição -->
<div class="row mt-3">
    <!-- formulário das configurações dos campos da tabela -->
        <div class="col-lg-12">
            <div class="card card-body" >
                <div class="row">
                    <div class="col-lg-12">
                        <div id="form_tabela" class="row">
                            <div class="col-lg-2 mb-2">
                                <label for="nome_campo" class="font-weight-bold" >* Nome</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="nome_campo" 
                                    name="nome_campo" 
                                    data-mascara_validacao="false"
                                    maxlength="40" 
                                    required
                                >
                            </div>
                            <div class="col-lg-2 mb-2">
                                <label for="tipo_campo" class="font-weight-bold" >* Tipo BD</label>
                                <select id="tipo_campo" 
                                        name="tipo_campo"
                                        class="form-control"
                                        data-anterior=""
                                        data-mascara_validacao = "false"
                                        required
                                >
                                    <option value="" selected >Selecione</option>
                                    <option value="varchar" >Varchar</option>
                                    <option value="float" >Float</option>
                                    <option value="date" >Date</option>
                                    <option value="int" >Int</option>
                                    <option value="text" >Text</option>                        
                                </select>
                            </div>
                            <div class="col-lg-2 mb-2">
                                <label for="tamanho_campo" class="font-weight-bold" >* Tamanho</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="tamanho_campo" 
                                    name="tamanho_campo" 
                                    data-mascara_validacao="text"
                                    maxlength="4" 
                                    required
                                >
                            </div>
                            <div class="col-lg-2 mb-2">
                                <label for="label" class="font-weight-bold" >* Label</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="label" 
                                    name="label" 
                                    data-mascara_validacao="false"
                                    maxlength="40" 
                                    required
                                >
                            </div>
                            <div class="col-lg-2 mb-2">
                                <label for="mascara_validacao" class="font-weight-bold" >* Máscara</label>
                                <select id="mascara_validacao" 
                                        name="mascara_validacao"
                                        class="form-control"
                                        data-anterior=""
                                        data-mascara_validacao = "false"
                                        required
                                >
                                    <option value="" selected >Selecione</option>
                                    <option value="false"       >false</option>
                                    <option value="data"        >data</option>
                                    <option value="nome"        >nome</option>
                                    <option value="rg"          >rg</option>
                                    <option value="cpf"         >cpf</option>
                                    <option value="cnpj"        >cnpj</option>
                                    <option value="email"       >email</option>
                                    <option value="telefone"    >telefone</option>
                                    <option value="celular"     >celular</option>                        
                                    <option value="cep"         >cep</option>                        
                                    <option value="porcentagem" >porcentagem</option>                        
                                    <option value="monetario"   >monetario</option>                        
                                    <option value="numero"      >numero</option>                        
                                </select>
                            </div>
                            <div class="col-lg-1 mb-2">
                            <label for="column" class="font-weight-bold" >* Column</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="column" 
                                    name="column" 
                                    data-mascara_validacao="numero"
                                    maxlength="2" 
                                    required
                                >
                            </div>
                            <div class="col-lg-1 mb-2">
                                <label for="ordem_form" class="font-weight-bold" >* Ordem Form</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="ordem_form" 
                                    name="ordem_form" 
                                    data-mascara_validacao="numero"
                                    maxlength="2" 
                                    required
                                >
                            </div>
                            <div class="col-lg-2 mb-2">
                                <label for="type" class="font-weight-bold" >* Tipo no Form</label>
                                <select id="type" 
                                        name="type"
                                        class="form-control"
                                        data-anterior=""
                                        data-mascara_validacao = "false"
                                        required
                                >
                                    <option value="" selected >Selecione</option>
                                    <option value="text" >text</option>
                                    <option value="acoes" >acoes</option>
                                    <option value="hidden" >hidden</option>
                                    <option value="textarea" >textarea</option>
                                    <option value="radio" >radio</option>
                                    <option value="checkbox" >checkbox</option>
                                    <option value="relacional" >relacional</option>
                                    <option value="dropdown" >dropdown</option>
                                    <option value="table" >table</option>                
                                </select>
                            </div>
                            <div class="col-lg-3 mb-3">
                                <label for="info_relacional" class="font-weight-bold" >* Informações Relacional</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="info_relacional" 
                                    name="info_relacional" 
                                    data-mascara_validacao="false"
                                    maxlength="100" 
                                    required
                                    placeholder="relacional ( tabela, campo ) - radio( valor , label)"
                                >
                            </div>
                            <div class="col-lg-5 mb-3 align-self-end">
                                <div class="widget row">
                                    <fieldset>
                                        <input name="ver" id="ver" value="ver" type="checkbox" class="form-check-input" />
                                        <label class="form-check-label font-weight-bold mb-1" for="ver" >Ver Browser</label>
                                    
                                        <input name="form" id="form" value="form" type="checkbox" class="form-check-input" />
                                        <label class="form-check-label font-weight-bold mb-1" for="form" >Ver Form</label>
                                        
                                        <input name="obrigatorio" id="obrigatorio" value="obrigatorio" type="checkbox" class="form-check-input" />
                                        <label class="form-check-label font-weight-bold mb-1" for="obrigatorio" >Obrigatório</label>

                                        <input name="unico" id="unico" value="unico" type="checkbox" class="form-check-input" />
                                        <label class="form-check-label font-weight-bold mb-1" for="unico" >Único</label>
                                        
                                        <input name="pode_zero" id="pode_zero" value="podezero" type="checkbox" class="form-check-input" />
                                        <label class="form-check-label font-weight-bold mb-1" for="pode_zero" >Pode Zero</label>

                                        <input name="filtro_faixa" id="filtro_faixa" value="filtrofaixa" type="checkbox" class="form-check-input" />
                                        <label class="form-check-label font-weight-bold mb-1" for="filtro_faixa" >Filtro Faixa</label>
                                    </fieldset>
                                </div>
                            </div>
                            <div class="col-lg-2 mb-3 d-flex align-self-end">
                                <div class="col-lg-12 ">
                                    <div id="btn_incluir" class="btn btn-primary btn-block">Incluir</div>
                                </div>
                            </div>    
                        </div>   
                    </div> 
                </div>
            </div>
        </div>
    
    <!-- estrutura da tabela -->
    <div class="col-lg-12" >
        <div class="row" >
            <div class="col-lg-12">
                <h4 class="mt-2 text-center bg-dark text-white">Estrutura da Tabela </h4> 
            </div>
            <div class="col-lg-12" >
                <ul id="campos_tabela" class="col-lg-12" >
                </ul>
            </div>
        </div>
    </div>
</div>
