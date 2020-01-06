<?php
// Cada relatório é composto por 3 partes

// 1- _header_browser_relatorios.php - tem o cabeçalho com os filtros
// 2- relatorio.php - tem o corpo, com os cards de resultados filtrados
// 3- table_datatable.php - a tabela

//fora isso tem o javascript mas aí é um carnaval
?>





<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>

<script src="<?php echo BASE_URL?>/assets/js/relatorioorcamentos.js" type="text/javascript"></script>

<style>
.dataTable thead th:first-child, .dataTable tbody td:first-child {
    display:none;
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
                        <p class="m-0">Quantidade de Orçamentos</p>
                        <h5 id="quantidadeOrcamentos"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Total Orçado</p>
                        <h5 id="totalOrcado"></h5>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>


<?php require "_table_datatable.php" ?>

<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'  // usa o nome da tabela como nome do módulo, necessário para outras interações
</script>