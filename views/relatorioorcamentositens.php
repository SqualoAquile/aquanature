<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>

<script src="<?php echo BASE_URL?>/assets/js/relatorioorcamentositens.js" type="text/javascript"></script>

<style>
.dataTable thead th:first-child, .dataTable tbody td:first-child {
    display: none;
}
</style>

<?php
// Constroi o cabeçalho
require "_header_browser_relatorios.php";
?>

<div class="collapse mb-5" id="collapseFluxocaixaResumo">
    <div class="row" id="somasResumo">
        <div class="col-lg">
            <div class="row">

                <div class="col-lg">
                    <div class="card card-body py-1 text-black text-center my-3 py-3 shadow">
                        <p class="m-0">Qtd. de Produtos</p>
                        <h5 id="quantidadeProdutos"></h5>
                    </div>

                    <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Valor Total de Produtos</p>
                        <h5 id="totalProdutos"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body py-1 text-black text-center my-3 py-3 shadow">
                        <p class="m-0">Qtd. de Serviços</p>
                        <h5 id="quantidadeServicos"></h5>
                    </div>
                    <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Valor Total de Serviços</p>
                        <h5 id="totalServicos"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body py-1 text-black text-center my-3 py-3 shadow">
                        <p class="m-0">Qtd. de Serviços Compl.</p>
                        <h5 id="quantidadeServicosCompl"></h5>
                    </div>
                    <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Valor Total de Serviços Compl</p>
                        <h5 id="totalServicosCompl"></h5>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card card-body py-1 text-black text-center my-3 py-3 shadow">
                        <canvas id="chart-div"></canvas>
                    </div>
                </div>

            </div>
        </div>
    </div>  
</div>

<?php if (isset($_SESSION["returnMessage"])): ?>

    <div class="alert <?php echo $_SESSION["returnMessage"]["class"] ?> alert-dismissible">
    
        <?php echo $_SESSION["returnMessage"]["mensagem"] ?>
    
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

    </div>

<?php endif?>

<section id="relatorioorcamentoitens-section">

    <table class="table table-striped table-hover dataTableRelatorioOrcamentosItens bg-white table-nowrap first-column-fixed">
        <thead>
            <tr>
                <?php foreach ($colunas as $key => $value): ?> 
                    <?php if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") : ?>
                        <th class="border-top-0">
                            <?php if ($modulo == "fluxocaixa" && (array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "acoes")): ?>
                                <input type="checkbox" name="checkboxFluxoCaixa" class="select-all">
                            <?php endif ?>
                            <span><?php echo (isset($value["Comment"]["label"]) && !is_null($value["Comment"]["label"]) && !empty($value["Comment"]["label"])) ? $value["Comment"]["label"] : ucwords(str_replace("_", " ", $value['Field'])) ?></span>
                            <i class="small text-muted fas fa-sort ml-2"></i>
                        </th>
                    <?php endif ?>
                <?php endforeach ?>
            </tr>
        </thead>
    </table>

</section>

<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'  // usa o nome da tabela como nome do módulo, necessário para outras interações
</script>