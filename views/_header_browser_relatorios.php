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
        <div class="col-lg-8"> <!--Colunas da esquerda -->
            <?php if($modulo == "relatoriofluxocaixa"): ?>
                <h1 class="display-4 text-capitalize font-weight-bold">Relatório de Fluxo de Caixa</h1>
            <?php else : ?>
                <h1 class="display-4 text-capitalize font-weight-bold"><?php echo isset($labelTabela["labelBrowser"]) && !empty($labelTabela["labelBrowser"]) ? $labelTabela["labelBrowser"] : $modulo ?></h1>
            <?php endif ?>
        </div>
        <div class="col-lg d-flex justify-content-end align-items-center">
            <!-- <button id="graficos"  type="button" class="btn btn-warning cursor-pointer mr-2" data-toggle="collapse" data-target="#collapseGraficos2">Gráficos</button>          -->
            <button class="btn btn-success" id="botaoRelatorio" data-toggle="collapse" data-target="#collapseFluxocaixaResumo">Gerar Relatório</button>
        </div>
    </div>
        <div class="card mt-4" id="cardFiltros">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="m-0 h5" id="tituloHeader">
                    <span class="cursor-pointer">
                        <i class="fas fa-minus text-secondary mr-3" id="botaoCardFiltros" data-toggle="collapse" data-target="#collapseFiltros"></i>
                    </span>
                Filtros</h5>
                <div>
                    <button id="limpar-filtro" type="button" class="btn cursor-pointer btn-outline-secondary btn-sm">Limpar Filtros</button>
                    <button id="criar-filtro" type="button" class="btn cursor-pointer btn-outline-success btn-sm">Mais Filtros</button>
                </div>
            </div>

            <div class="collapse show" id="collapseFiltros">
                <form id="card-body-filtros" class="card-body pb-1">
                    <input type="reset" class="d-none" id="limpar-filtro">
                    <?php if ($modulo == "fluxocaixa"): ?>
                        <div class="row mb-3">
                            <div class="col">
                                <fieldset>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" name="movimentacao" data-index="2" id="todosCheckReceita" value="receita">
                                        <label class="form-check-label" for="todosCheckReceita">Receita</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" name="movimentacao" data-index="2" id="todosCheckDespesa" value="despesa">
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
                </form>
            </div>  
        </div>
</header>