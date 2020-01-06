<script src="<?php echo BASE_URL?>/assets/js/graficosPizzaFuncionando.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/graficosTemporal.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/graficosTemporalAQuitar.js" type="text/javascript"></script>
<!-- <script src="<?php echo BASE_URL?>/assets/js/graficos.js" type="text/javascript"></script> -->


<div class="collapse" id="collapseGraficos">
    <div class="card mt-4">
        <div class="card-header">
            <select class="custom-select" id="selectGraficos">
                <option selected disabled>Agrupar registros por...</option>
                <?php for($j = 1; $j < count($colunas); $j++): ?>
                    <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                        <?php if(   array_key_exists("label", $colunas[$j]["Comment"]) && 
                                    array_key_exists("type", $colunas[$j]["Comment"]) && 
                                    ($colunas[$j]["Comment"]["type"] =="relacional" || $colunas[$j]["Type"] == "date" )) :?>
                            <option value="<?php echo $colunas[$j]["Field"] ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                                <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                            </option>
                        <?php endif ?>
                    <?php endif ?>
                <?php endfor ?>
            </select>
        </div>
        <div class="card-body" style="height: 400px">
            <canvas id="chart-div"></canvas>
        </div>
    </div>
</div>

<div class="collapse" id="collapseGraficos2">

    <div class="card mt-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div class="row">
                <div class="col-lg-12 h3">Fluxo de Caixa Realizado</div>
                <div class="col-lg-6">
                    <select class="custom-select" id="selectGrafOpcoes">
                        <option selected disabled>Agrupar por</option>
                        <option value="0" >Hoje</option>
                        <option value="7" >7 dias</option>
                        <option value="15">15 dias</option>
                        <option value="30">30 dias</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="card-body" style="height: 400px">
            <canvas id="chart-div2"></canvas>
        </div>
    </div>

    <div class="card mt-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div class="row">
                <div class="col-lg-12 h3">Fluxo de Caixa A Realizar</div>
                <div class="col-lg-6">
                    <select class="custom-select" id="selectGrafOpcoes2">
                        <option selected disabled>Agrupar por</option>
                        <option value="0" >Hoje</option>
                        <option value="7" >7 dias</option>
                        <option value="15">15 dias</option>
                        <option value="30">30 dias</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="card-body" style="height: 400px">
            <canvas id="chart-div3"></canvas>
        </div>
    </div>
</div>