<?php
// Cada relatório é composto por 3 partes

// 1- _header_browser_relatorios.php - tem o cabeçalho com os filtros
// 2- relatorio.php - tem o corpo, com os cards de resultados filtrados
// 3- table_datatable.php - a tabela

//fora isso tem o javascript mas aí é um carnaval
?>

<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>

<script src="<?php echo BASE_URL?>/assets/js/relatoriofechamentos.js" type="text/javascript"></script>

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
                        <p class="m-0">Qtd Ativos</p>
                        <h5 id="qtdativos"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Qtd Canc. Pagantes</p>
                        <h5 id="qtdcancpagantes"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body py-1 text-black text-center my-3 py-3 shadow">
                        <p class="m-0">Qtd Cobrados</p>
                        <h5 id="qtdcobrados"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Preço Méd. Mensal</p>
                        <h5 id="precomed"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body py-1 text-black text-center my-3 py-3 shadow">
                        <p class="m-0">Valor Total</p>
                        <h5 id="valortotal"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Valor Desconto</p>
                        <h5 id="desconto"></h5>
                    </div>
                </div>

                <div class="col-lg">
                    <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                        <p class="m-0">Valor Final</p>
                        <h5 id="valorfinal"></h5>
                    </div>
                </div>

                <textarea id="txt1" class="d-none" ></textarea>
            </div>
        </div>
    </div>
</div>


<?php require "_table_datatable.php" ?>

<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = 'fechamento',  // usa o nome da tabela como nome do módulo, necessário para outras interações
        campoPesquisa = '', // aqui vai o campo de id-usuario caso seja necessário filtrar o datatable somente para os registros referentes ao usuário logado
        valorPesquisa = '<?php echo in_array('podetudo_ver', $_SESSION['permissoesUsuario']) ? "" : $_SESSION["idUsuario"]; ?>';
</script>