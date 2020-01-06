<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>

<!-- Chama o arquivo específico do módulo, caso não exista,  -->
<!-- Este javaScript serve para fazer verificações inerentes à cada módulo, por exemplo o radio de Clientes -->
<script src="<?php echo BASE_URL?>/assets/js/<?php echo $modulo?>.js" type="text/javascript"></script>

<header class="d-lg-flex align-items-center my-5">
    <h1 class="display-4 m-0 text-capitalize font-weight-bold"><?php echo $viewInfo["title"]." ".ucfirst($labelTabela["labelForm"]); ?></h1>
</header>

<section class="mb-5">
    <div class="row">
        <?php foreach ($registros as $key => $value): ?>
            <div class="col-lg-<?php echo isset($value["comentarios"]["column"]) ? $value["comentarios"]["column"] : "12" ?>">
                <div class="card card-body my-3">
                    <form class="form-servicos" novalidate autocomplete="off" data-alteracoes="<?php echo $value["alteracoes"] ?>" data-id="<?php echo $value["id"] ?>">

                        <h3 class="pb-4"><?php echo array_key_exists("label", $value["comentarios"]) ? $value["comentarios"]["label"] : ucwords(str_replace("_", " ", $value['parametro'])) ?></h3>

                        <div class="form-group row">
                            <?php foreach ($colunas as $key_coluna => $value_coluna): ?>
                                <?php if(isset($value_coluna["Comment"]) && array_key_exists("form", $value_coluna["Comment"]) && $value_coluna["Comment"]["form"] != "false") : ?>
                                    <div class="col-lg">
                                        <label class="<?php echo $value_coluna["Null"] == "NO" ? "font-weight-bold" : "" ?>" for="<?php echo lcfirst($value_coluna["Field"] . $value["descricao"]) ?>">
                                            <!-- Asterisco de campo obrigatorio -->
                                            <?php if ($value_coluna["Null"] == "NO"): ?>
                                                <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                                            <?php endif ?>
                                            <span><?php echo array_key_exists("label", $value_coluna["Comment"]) ? $value_coluna["Comment"]["label"] : ucwords(str_replace("_", " ", $value_coluna['Field'])) ?></span>
                                        </label>
                                        <input 
                                            type="text" 
                                            class="form-control input-servicos" 
                                            name="<?php echo lcfirst($value_coluna["Field"]) ?>" 
                                            value="<?php echo $value[$value_coluna["Field"]] ?>"
                                            data-unico="<?php echo array_key_exists("unico", $value["comentarios"]) && $value["comentarios"]["unico"]  == true ? "unico" : "" ?>"
                                            data-anterior="<?php echo $value[$value_coluna["Field"]] ?>"
                                            id="<?php echo lcfirst($value_coluna["Field"] . $value["descricao"]) ?>" 
                                            maxlength="<?php echo $value_coluna["tamanhoMax"] ?>"
                                            data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["comentarios"]) ? $value["comentarios"]["mascara_validacao"] : "false" ?>"
                                            <?php echo $value_coluna['Null'] == "NO" ? "required" : "" ?>
                                            <?php if( array_key_exists("mascara_validacao", $value["comentarios"]) && 
                                                    ( $value["comentarios"]["mascara_validacao"] == "monetario" || $value["comentarios"]["mascara_validacao"] == "porcentagem" )):?>
                                                data-podeZero="<?php echo array_key_exists("pode_zero", $value["comentarios"]) && $value["comentarios"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
                                            <?php endif?>
                                        />
                                    </div>
                                <?php endif ?>
                            <?php endforeach ?>
                            <?php if(in_array($modulo . "_edt", $infoUser["permissoesUsuario"])): ?>
                                <div class="col-lg-3">
                                    <label>&nbsp;</label>
                                    <button type="submit" class="btn btn-primary btn-block">Salvar</button>
                                </div>
                            <?php endif ?>
                            <?php
                                $item = $value;
                                $iteracao = $key;
                            ?>
                            <?php if (isset($value["alteracoes"]) && strlen($value["alteracoes"])): ?>
                                <div class="col-lg flex-lg-grow-0">
                                    <label>&nbsp;</label>
                                    <button class="btn btn-dark btn-block" title="Histórico" type="button" data-toggle="collapse" data-target="#historico<?php echo $iteracao ?>" aria-expanded="false" aria-controls="historico<?php echo $iteracao ?>">
                                        <i class="fas fa-code-branch"></i>
                                    </button>
                                </div>
                            <?php endif ?>
                        </div>

                        <?php include "_historico.php" ?>

                    </form>
                </div>
            </div>
        <?php endforeach ?>
    </div>
</section>
