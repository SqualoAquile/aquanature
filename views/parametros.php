<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL ?>',
        currentModule = '<?php echo $modulo ?>',
        campoPesquisa = '',
        valorPesquisa = '',
        data_add = '<?php echo in_array($modulo . "_add", $_SESSION["permissoesUsuario"]) ? true : false ?>',
        data_edt = '<?php echo in_array($modulo . "_exc", $_SESSION["permissoesUsuario"]) ? true : false ?>',
        data_exc = '<?php echo in_array($modulo . "_edt", $_SESSION["permissoesUsuario"]) ? true : false ?>';
</script>

<!-- Chama o arquivo específico do módulo, caso não exista,  -->
<!-- Este javaScript serve para fazer verificações inerentes à cada módulo, por exemplo o radio de Clientes -->
<script src="<?php echo BASE_URL?>/assets/js/<?php echo $modulo?>.js" type="text/javascript"></script>

<header class="pt-4 pb-5">
    <h1 class="display-4 text-capitalize text-nowrap font-weight-bold"><?php echo isset($labelTabela["labelBrowser"]) && !empty($labelTabela["labelBrowser"]) ? $labelTabela["labelBrowser"] : $modulo ?></h1>
</header>

<section class="mb-5">
    <!-- Dropdowns -->
    <div class="row">
        <?php foreach ($tabelas as $key => $value): ?>

            <?php
                $parametro = $value[0]["Name"];
                $comment = $value[0]["Comment"];
            ?>
            
            <?php if (isset($comment)): ?>

                <?php if (array_key_exists("parametro", $comment)): ?>

                    <?php if (array_key_exists("parametro_campo", $comment) && !array_key_exists("info_relacao", $comment)): ?>

                        <?php
                            //
                            // Parametros com um input
                            // Intacto 👌🏼
                            //
                        ?>
                        <!-- campo que vai aparecer os itens da tabela nas opções do dropdown -->
                        <?php $campo = $comment["parametro_campo"] ?>

                        <?php if ($comment["parametro"] == "true"): ?>

                            <div class="col-lg-<?php echo isset($comment["column"]) ? $comment["column"] : "12" ?>">

                                <div class="card card-body my-3">

                                    <label class="h3 text-capitalize">
                                        <?php echo array_key_exists("label", $comment) ? $comment["label"] : $parametro ?>
                                    </label>
                                    
                                    <ul id="<?php echo $parametro ?>" data-campo="<?php echo $campo ?>" class="search-body list-unstyled mt-2">
                                        <li>
                                            <div class="row">
                                                <div class="col-lg">
                                                    <div class="position-relative">
                                                        <input id="parametroRelacional<?php echo $key ?>" type="text" class="form-control form-control-lg search-input indep" placeholder="Procure por <?php echo $parametro ?>">
                                                        <div class="icons-search-input d-flex px-1">
                                                            <button class="btn btn-sm down-btn" tabindex="-1">
                                                                <i class="fas fa-caret-down"></i>
                                                            </button>
                                                            <button class="btn btn-sm text-secondary close-btn" tabindex="-1">
                                                                <i class="fas fa-times-circle"></i>
                                                            </button>
                                                        </div>
                                                        <div class="list-group-filtereds-wrapper position-absolute w-100 shadow bg-white">
                                                            <div class="elements-add"></div>
                                                            <div class="list-group-filtereds list-group list-group-flush"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                </div>
                            
                            </div>

                        <?php endif ?>

                    <?php elseif(array_key_exists("parametro_campos", $comment)): ?>

                        <?php
                            //
                            // Parametros com dois inputs
                            // Nova feature
                            //
                        ?>

                        <?php $campos = $comment["parametro_campos"] ?>

                        <?php if ($comment["parametro"] == "true"): ?>

                            <div class="col-lg-<?php echo isset($comment["column"]) ? $comment["column"] : "12" ?>">

                                <div class="card card-body my-3">

                                    <label class="h3 text-capitalize">
                                        <?php echo array_key_exists("label", $comment) ? $comment["label"] : $parametro ?>
                                    </label>
                                    
                                    <ul id="<?php echo $parametro ?>" class="search-body search-body-doiscampos list-unstyled mt-2">
                                        <li>
                                            <div class="row">
                                                <div class="col-lg">
                                                    <label for="parametroRelacional<?php echo $key ?>">Título</label>
                                                    <div class="position-relative">
                                                        <input id="parametroRelacional<?php echo $key ?>" type="text" class="form-control form-control-lg search-input-doiscampos">
                                                        <div class="icons-search-input d-flex px-1">
                                                            <button class="btn btn-sm down-btn" tabindex="-1">
                                                                <i class="fas fa-caret-down"></i>
                                                            </button>
                                                            <button class="btn btn-sm text-secondary close-btn close-btn-doiscampos" tabindex="-1">
                                                                <i class="fas fa-times-circle"></i>
                                                            </button>
                                                        </div>
                                                        <div class="list-group-filtereds-wrapper position-absolute w-100 shadow bg-white">
                                                            <div class="list-group-filtereds list-group list-group-flush"></div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group mt-3">
                                                        <label for="parametroRelacionalTextarea<?php echo $key ?>">Mensagem</label>
                                                        <textarea id="parametroRelacionalTextarea<?php echo $key ?>" class="form-control form-control-lg textarea-doiscampos"></textarea>
                                                    </div>
                                                    <div class="elements-add-doiscampos"></div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                </div>
                            
                            </div>

                        <?php endif ?>

                    <?php endif ?>
                    
                <?php endif ?>
                
            <?php endif ?>

        <?php endforeach ?>
    </div>
    <!-- Dropdowns Dependentes de outra Tabela -->
    <div class="row">
        <?php foreach ($tabelas as $key => $value): ?>

            <?php
                $parametro = $value[0]["Name"];
                $comment = $value[0]["Comment"];
            ?>
            
            <?php if (isset($comment)): ?>
                <?php //echo '<br><br>'; print_r($comment); echo '<br><br>'; ?>  
                <?php //array_key_exists("info_relacao", $comment) ? print_r($comment) : ''; ?>

                <?php if ( array_key_exists("parametro", $comment) && array_key_exists("parametro_campo", $comment) && array_key_exists("info_relacao", $comment) ): ?>
                    <?php// print_r($comment) ?>
                    <?php
                        //
                        // Parametros com um input dependentes de outra tabela
                        // Intacto 👌🏼
                        //
                    ?>
                    <!-- campo que vai aparecer os itens da tabela nas opções do dropdown -->
                    <?php $campo = $comment["parametro_campo"] ?>

                        <div class="col-lg-<?php echo isset($comment["column"]) ? $comment["column"] : "12" ?>">

                            <div class="card card-body my-3">
                                <div class="row interna">
                                    <div class="col-lg-6">
                                        <label class="h3 text-capitalize ">
                                            <?php echo array_key_exists("label", $comment["info_relacao"]) ? $comment["info_relacao"]["label"] : ucwords($comment["info_relacao"]["tabela"]) ?>
                                        </label>
                                        
                                        <select 
                                            id="<?php echo lcfirst($comment["info_relacao"]["campo"]);?>" 
                                            name="<?php echo lcfirst($comment["info_relacao"]["campo"]);?>" 
                                            class="form-control form-control-lg tabelafonte mb-2" >
                                            <option value="" selected >Selecione</option>
                                            <?php for($j = 0; $j < count($comment["info_relacao"]['resultado']); $j++):?>
                                                
                                                <option value="<?php echo $comment["info_relacao"]['resultado'][$j]['id'];?>">
                                                    <?php echo $comment["info_relacao"]['resultado'][$j]['nome'];?>
                                                </option>
                                                
                                            <?php endfor;?>     
                                        </select>
                                    </div> 
                                
                                    <div class="col-lg-6">
                                        <label class="h3 text-capitalize">
                                            <?php echo array_key_exists("label", $comment) ? $comment["label"] : $parametro ?>
                                        </label>
                                            
                                        <ul 
                                            id="<?php echo $parametro ?>" 
                                            data-campo="<?php echo $campo ?>"
                                            data-chaveextrangeira = <?php echo $comment["info_relacao"]['chaveextrangeira'];?> 
                                            class="search-body list-unstyled">
                                            <li>
                                                <div class="row">
                                                    <div class="col-lg">
                                                        <div class="position-relative">
                                                            <input 
                                                                id="parametroRelacional<?php echo $key ?>" 
                                                                type="text" 
                                                                class="form-control form-control-lg search-input dependente" placeholder="Procure..."
                                                            >
                                                            <div class="icons-search-input d-flex px-1">
                                                                <button class="btn btn-sm down-btn" tabindex="-1">
                                                                    <i class="fas fa-caret-down"></i>
                                                                </button>
                                                                <button class="btn btn-sm text-secondary close-btn" tabindex="-1">
                                                                    <i class="fas fa-times-circle"></i>
                                                                </button>
                                                            </div>
                                                            <div class="list-group-filtereds-wrapper position-absolute w-100 shadow bg-white">
                                                                <div class="elements-add"></div>
                                                                <div class="list-group-filtereds list-group list-group-flush"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>     
                                </div>    
                            </div>
                        
                        </div>

                <?php endif ?>    
            <?php endif ?>

        <?php endforeach ?>
    </div>
    <!-- Fixos -->
    <div class="row">
        <?php foreach ($registros as $key => $value): ?>
            <div class="col-lg-<?php echo isset($value["comentarios"]["column"]) ? $value["comentarios"]["column"] : "12" ?>">
                <div class="card card-body my-3">
                    <form novalidate autocomplete="off" class="form-params-fixos">

                        <!-- Label Geral -->
                        <label class="<?php echo !array_key_exists("null", $value["comentarios"]) ? "font-weight-bold" : "" ?>" for="<?php echo $value['parametro'] ?>">
                            
                            <!-- Asterisco de campo obrigatorio -->
                            <?php if (!array_key_exists("null", $value["comentarios"])): ?>
                                <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                            <?php endif ?>
                            <span class="h3"><?php echo array_key_exists("label", $value["comentarios"]) ? $value["comentarios"]["label"] : ucwords(str_replace("_", " ", $value['parametro'])) ?></span>
                        </label>

                        <div class="row">
                            <div class="col-lg">
                                <div class="form-group">
                                    <input 
                                        type="text" 
                                        class="form-control input-fixos" 
                                        name="<?php echo lcfirst($value["parametro"]) ?>" 
                                        value="<?php echo $value["valor"] ?>"
                                        data-alteracoes="<?php echo $value["alteracoes"] ?>"
                                        data-id="<?php echo $value["id"] ?>"
                                        data-anterior="<?php echo $value["valor"] ?>"
                                        <?php echo !array_key_exists("null", $value["comentarios"]) ? "required" : "" ?>
                                        id="<?php echo $value['parametro'] ?>"
                                        data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["comentarios"]) ? $value["comentarios"]["mascara_validacao"] : "false" ?>"
                                        <?php if( array_key_exists("mascara_validacao", $value["comentarios"]) && 
                                                    ( $value["comentarios"]["mascara_validacao"] == "monetario" || $value["comentarios"]["mascara_validacao"] == "porcentagem" )):?>
                                            data-podeZero="<?php echo array_key_exists("pode_zero", $value["comentarios"]) && $value["comentarios"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
                                        <?php endif?>
                                        <?php if(array_key_exists("maxlength", $value["comentarios"])):?>
                                            maxlength="<?php echo $value["comentarios"]["maxlength"] ?>"
                                        <?php endif?>
                                    />
                                </div>
                            </div>
                            <div class="col-lg flex-lg-grow-0">
                                <?php if (in_array($modulo . "_edt", $_SESSION["permissoesUsuario"])) : ?>
                                    <button type="submit" class="btn btn-primary btn-block" disabled="disabled">Salvar</button>
                                <?php endif ?>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        <?php endforeach ?>
    </div>
</section>