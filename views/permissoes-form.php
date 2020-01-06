<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL ?>',
        currentModule = '<?php echo $modulo ?>',
        campoPesquisa = '',
        valorPesquisa = '';
</script>

<!-- Chama o arquivo específico do módulo, caso não exista,  -->
<!-- Este javaScript serve para fazer verificações inerentes à cada módulo, por exemplo o radio de Clientes -->
<script src="<?php echo BASE_URL?>/assets/js/<?php echo $modulo?>.js" type="text/javascript"></script>

<header class="d-lg-flex align-items-center my-5">
    <?php if(in_array($modulo . "_ver", $infoUser["permissoesUsuario"])): ?>
        <a href="<?php echo BASE_URL . '/' . $modulo ?>" class="btn btn-secondary mr-lg-4" title="Voltar">
            <i class="fas fa-chevron-left"></i>
        </a>
    <?php endif ?>
    <h1 class="display-4 m-0 text-capitalize font-weight-bold"><?php echo $viewInfo["title"]." ".ucfirst($labelTabela["labelForm"]); ?></h1>
</header>

<form method="POST" class="mb-5" autocomplete="off" novalidate>

    <div class="form-group pb-4">
        <label for="nome" class="font-weight-bold">
            <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
            <span>Nome do Grupo</span>
        </label>
        <input type="text" data-anterior="<?php echo isset($permAtivas) ? $permAtivas["nome"] : "" ?>" data-mascara_validacao="false" name="nome" id="nome" class="form-control" value="<?php echo isset($permAtivas) ? $permAtivas["nome"] : "" ?>" required/>
    </div>

    <div class="table-responsive mb-lg-5 mb-3">
        <table class="table table-striped table-hover bg-white table-nowrap">
            <thead>
                <tr>
                    <th>Ver</th>
                    <th>Adicionar</th>
                    <th>Editar</th>
                    <th>Excluir</th>
                </tr>
            </thead>
            <tbody>
                    
                <?php for($i=0;$i<= count($listaPermissoes)-3;$i+=4):?>
                <tr>
                    <td>
                        <div class="form-check">
                            <input data-anterior="<?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+0]["id"], $permAtivas["params"])) ? 'true' : '' ?>" type="checkbox" name='permissoes[]' class="form-check-input" value="<?php echo $listaPermissoes[$i+0]["id"] ?>" id="<?php echo $listaPermissoes[$i+0]["nome"] ?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+0]["id"], $permAtivas["params"])) ? 'checked="checked"' : '' ?>/>
                            <label for="<?php echo $listaPermissoes[$i+0]["nome"] ?>" class="form-check-label"><?php echo $listaPermissoes[$i+0]["nome"] ?></label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input data-anterior="<?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+1]["id"], $permAtivas["params"])) ? 'true' : '' ?>" type="checkbox" name='permissoes[]' class="form-check-input" value="<?php echo $listaPermissoes[$i+1]["id"] ?>" id="<?php echo $listaPermissoes[$i+1]["nome"] ?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+1]["id"], $permAtivas["params"])) ? 'checked="checked"' : '' ?>/>
                            <label for="<?php echo $listaPermissoes[$i+1]["nome"] ?>" class="form-check-label"><?php echo $listaPermissoes[$i+1]["nome"] ?></label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input data-anterior="<?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+2]["id"], $permAtivas["params"])) ? 'true' : '' ?>" type="checkbox" name='permissoes[]' class="form-check-input" value="<?php echo $listaPermissoes[$i+2]["id"] ?>" id="<?php echo $listaPermissoes[$i+2]["nome"] ?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+2]["id"], $permAtivas["params"])) ? 'checked="checked"' : '' ?>/>
                            <label for="<?php echo $listaPermissoes[$i+2]["nome"] ?>" class="form-check-label"><?php echo $listaPermissoes[$i+2]["nome"] ?></label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input data-anterior="<?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+3]["id"], $permAtivas["params"])) ? 'true' : '' ?>" type="checkbox" name='permissoes[]' class="form-check-input" value="<?php echo $listaPermissoes[$i+3]["id"] ?>" id="<?php echo $listaPermissoes[$i+3]["nome"] ?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+3]["id"], $permAtivas["params"])) ? 'checked="checked"' : '' ?>/>
                            <label for="<?php echo $listaPermissoes[$i+3]["nome"] ?>" class="form-check-label"><?php echo $listaPermissoes[$i+3]["nome"] ?></label>
                        </div>
                    </td>
                </tr>  
                <?php endfor ?>

            </tbody>

        </table>
    </div>

    <input type="hidden" data-anterior="<?php echo isset($permAtivas) ? $permAtivas["alteracoes"] : "" ?>" name="alteracoes" value="<?php echo isset($permAtivas) ? $permAtivas["alteracoes"] : "" ?>">

    <div class="row">
        <div class="col-xl-2 col-lg-3">
            <button type="submit" class="btn btn-primary btn-block mb-2" disabled>Salvar</button>
        </div>

        <?php if (isset($permAtivas)): ?>
            <?php $item["alteracoes"] = $permAtivas["alteracoes"] ?>
            <div class="col-xl-2 col-lg-3">
                <button class="btn btn-dark btn-block" type="button" data-toggle="collapse" data-target="#historico" aria-expanded="false" aria-controls="historico">Histórico de Alterações</button>
            </div>
        <?php endif ?>
    </div>

    <?php include "_historico.php" ?>

</form>