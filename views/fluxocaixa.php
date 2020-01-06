<script src="<?php echo BASE_URL?>/assets/js/controlecaixa.js" type="text/javascript"></script>
<script type="text/javascript">
        campoPesquisa = '',
        valorPesquisa = '';
</script>
<?php
// Transforma o nome do arquivo para o nome do módulo
$modulo = str_replace("-form", "", basename(__FILE__, ".php"));
// Constroi o cabeçalho
require "_header_browser_filtros.php";
?>

<div class="collapse" id="collapseFluxocaixaResumo">
    <div class="card card-body">
        <div class="row mb-3" id="somasResumo">
            <div class="col-lg-3">
                <div class="card card-body py-2 text-center mb-3">
                    <p class="m-0">Itens Selecionados</p>
                    <h2 id="itensSelecionados"></h2>
                </div>
                <?php if( in_array( $this->table.'_exc' , $_SESSION["permissoesUsuario"]) ): ?>
                <button class="btn btn-danger btn-block" id="excluir">
                    <i class="fas fa-trash-alt mr-2"></i>
                    <span>Excluir</span>
                </button>
                <?php endif ?>
            </div>
            <div class="col-lg">    
                <div class="row mb-3">
                    <div class="col-lg offset-lg-1">
                        <div class="card card-body py-2 text-danger text-center">
                            <p class="m-0">Despesa Total</p>
                            <h2 id="despesasTotal"></h2>
                        </div>
                    </div>
                    <div class="col-lg">
                        <div class="card card-body py-2 text-success text-center">
                            <p class="m-0">Receita Total</p>
                            <h2 id="receitasTotal"></h2>
                        </div>
                    </div>
                </div>
                <?php if( in_array( $this->table.'_edt' , $_SESSION["permissoesUsuario"]) ): ?>
                    <div class="row">
                        <div class="col-lg offset-lg-1 col-data-quitacao">
                            <div class="row align-items-center">
                                <div class="col-lg flex-grow-0">
                                    <label for="data_quitacao" class="text-truncate m-0 font-weight-bold">
                                        <i data-toggle="tooltip" data-placement="top" title="" data-original-title="Campo Obrigatório">*</i>
                                        <span>Data de Quitação</span>
                                    </label>
                                </div>
                                <div class="col">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon-calendar">
                                                <i class="fas fa-calendar-alt"></i>
                                            </span>
                                        </div>
                                        <input type="text" id="data_quitacao" class="form-control" data-provide="datepicker" aria-label="Data de Quitação" aria-describedby="basic-addon-calendar" name="data_quitacao" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg col-btn-quitar">
                            <button class="btn btn-primary btn-block" id="quitar">Quitar <span class="lengthQuitar"></span> Lançamentos</button>
                        </div>
                    </div>
                <?php endif ?>
            </div>
        </div>
    </div>
</div>
<?php require "_table_datatable.php" ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'  // usa o nome da tabela como nome do módulo, necessário para outras interações
</script>
