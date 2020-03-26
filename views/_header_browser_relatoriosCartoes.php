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
            <h1 class="display-4 text-capitalize font-weight-bold">Relatório de Cartões</h1>
        </div>
    </div>
        <div class="card mt-4" id="cardFiltros">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="m-0 h5" id="tituloHeader"><span class="cursor-pointer"><i class="fas fa-minus text-secondary mr-3" id="botaoCardFiltros" data-toggle="collapse" data-target="#collapseFiltros"></i></span>
                Filtros</h5>
            <div>
        </div>
    </div>

            <div class="collapse show" id="collapseFiltros">
                <form id="card-body-filtros" class="card-body pb-1">                   
                    <div class="filtros-wrapper">
                        <div class="filtros row mb-3">
                            <div class="filtros-faixa col-lg-6">
                                <div class="input-group">
                                    <select class="custom-select input-filtro-faixa">
                                        <option selected disabled value="">Filtrar por...</option>
                                        <?php for($j = 1; $j < count($colunas); $j++): ?>
                                            <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                                                <?php if(array_key_exists("label", $colunas[$j]["Comment"]) && array_key_exists("filtro_faixa", $colunas[$j]["Comment"]) && $colunas[$j]["Comment"]["filtro_faixa"] == 'true' ) : ?>
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
                                                <?php if(array_key_exists("label", $colunas[$j]["Comment"]) && array_key_exists("filtro_faixa", $colunas[$j]["Comment"]) && $colunas[$j]["Comment"]["filtro_faixa"] == 'false' ): ?>
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