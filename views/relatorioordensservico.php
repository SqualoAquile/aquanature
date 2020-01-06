<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>

<script src="<?php echo BASE_URL?>/assets/js/relatorioordensservico.js" type="text/javascript"></script>

<style>
.dataTable thead th:first-child, .dataTable tbody td:first-child {
    display:none;
}
</style>

<div class="d-none" id="idTaxaSeguro" data="<?php echo $taxaSeg ?>"> </div>

<?php
// Constroi o cabeçalho
require "_header_browser_relatorios.php";
?>

<div class="collapse mb-5" id="collapseFluxocaixaResumo">

    <div class="row" id="somasResumo">
        <div class="col-lg">
            
            <div class="row">
                <div class="col-lg">
                    <div class="card card-body text-dark text-center my-3 py-3 shadow">
                        <p class="m-0">Quantidade de Operações</p>
                        <h5 id="quantidadeOperacoes"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Subtotal</p>
                        <h5 id="subtotal"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body text-primary text-center my-3 py-3 shadow">
                        <p class="m-0">Desconto Total</p>
                        <h5 id="desconto"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Valor Total</p>
                        <h5 id="valor"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body text-danger text-center my-3 py-3 shadow">
                        <p class="m-0">Seguro Oper. Estimado</p>
                        <h5 id="estimativaTaxa"></h5>
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

