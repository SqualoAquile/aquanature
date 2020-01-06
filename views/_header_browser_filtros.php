<script src="<?php echo BASE_URL?>/assets/js/filtros.js" type="text/javascript"></script>

<?php if(!empty($aviso)): ?>
    <div class="alert alert-danger position-fixed my-toast m-3 shadow-sm alert-dismissible" role="alert"> 
        <?php echo $aviso ?>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
<?php endif ?>

<?php
    $indexFiltroTexto = 1;
    $indexFiltroFaixa = 1;
?>

<header class="pt-4 pb-5"> <!-- Cabeçalho -->
    <div class="row align-items-center"> <!-- Alinhar as linhas -->
        <div class="col-lg"> <!--Colunas da esquerda -->
            <h1 class="display-4 text-capitalize font-weight-bold"><?php echo isset($labelTabela["labelBrowser"]) && !empty($labelTabela["labelBrowser"]) ? $labelTabela["labelBrowser"] : $modulo ?></h1>
        </div>
        <div class="col"> 
            <div class="input-group mb-0">
                <!--Input com os dados da tabela-->
                <input type="text" name="searchDataTable" id="searchDataTable" aria-label="Pesquise por qualquer campo..." class="form-control" placeholder="Pesquise por qualquer campo..." aria-describedby="search-addon">
                <div class="input-group-append">
                    <span class="input-group-text" id="search-addon">
                        <i class="fas fa-search"></i>
                    </span>
                </div>
            </div>
        </div>
        <div class="col flex-grow-0">
            <div class="btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-info btn-block cursor-pointer" data-toggle="collapse" data-target="#collapseFiltros" aria-expanded="false" aria-controls="collapseFiltros">
                    <input type="checkbox" checked autocomplete="off">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-filter mr-2"></i>
                        <span>Filtros</span>
                    </div>
                </label>
            </div>
        </div>
    </div>
    <div class="collapse" id="collapseFiltros">
        <div class="card mt-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h3 class="m-0">Filtros</h3>
                <div>
                    <button id="limpar-filtro" class="btn cursor-pointer btn-outline-secondary btn-sm m-0">Limpar Filtros</button>
                    <button id="criar-filtro" type="button" class="btn btn-outline-success btn-sm">Mais Filtros</button>
                </div>
            </div>
            <div id="card-body-filtros" class="card-body pb-1">
                <?php if ($modulo == "fluxocaixa"): ?>
                    <div class="row mb-3">
                        <div class="col">
                            <fieldset>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" name="movimentacao" data-index="1" id="todosCheckReceita" value="receita">
                                    <label class="form-check-label" for="todosCheckReceita">Receita</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" name="movimentacao" data-index="1" id="todosCheckDespesa" value="despesa">
                                    <label class="form-check-label" for="todosCheckDespesa">Despesa</label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                <?php endif ?>
                <div class="filtros-wrapper">
                    <div class="filtros row mb-3">
                        <div class="filtros-faixa col-lg-6">
                            <div class="input-group">
                                <select class="custom-select input-filtro-faixa">
                                    <option selected disabled value="">Filtrar por...</option>
                                    <?php for($j = 1; $j < count($colunas); $j++): ?>
                                        <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                                            <?php if(array_key_exists("label", $colunas[$j]["Comment"]) && array_key_exists("filtro_faixa", $colunas[$j]["Comment"]) && $colunas[$j]["Comment"]["filtro_faixa"]): ?>
                                                <option value="<?php echo $indexFiltroFaixa ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                                                    <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                                                </option>
                                            <?php endif ?>
                                            <?php $indexFiltroFaixa++ ?>
                                        <?php endif ?>
                                    <?php endfor ?>
                                </select>
                                <input type="text" class="form-control input-filtro-faixa min" placeholder="de...">
                                <input type="text" class="form-control input-filtro-faixa max" placeholder="até...">
                            </div>
                        </div>
                        <div class="filtros-texto col-lg-6">
                            <div class="input-group">
                                <select class="custom-select input-filtro-texto">
                                    <option selected disabled value="">Filtrar por...</option>
                                    <?php for($m = 1; $m < count($colunas); $m++): ?>
                                        <?php if ($colunas[$m]["Comment"]["ver"] == "true"): ?>
                                            <?php if(!array_key_exists("filtro_faixa", $colunas[$m]["Comment"])): ?>
                                                <option value="<?php echo $indexFiltroTexto ?>" data-tipo="<?php echo $colunas[$m]["Type"] ?>">
                                                    <?php echo array_key_exists("label", $colunas[$m]["Comment"]) ? $colunas[$m]["Comment"]["label"] : $colunas[$m]["Field"] ?>
                                                </option>
                                            <?php endif ?> 
                                            <?php $indexFiltroTexto++ ?>
                                        <?php endif ?>
                                    <?php endfor ?>
                                </select>
                                <input type="text" class="form-control input-filtro-texto texto">
                            </div>
                        </div>
                        <div class="col-excluir-linha col-lg-1">
                            <button class="btn btn-outline-danger btn-block" id="excluir-linha">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>