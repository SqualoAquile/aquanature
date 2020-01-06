<script src="<?php echo BASE_URL?>/assets/js/graficos.js" type="text/javascript"></script>
<div class="btn-group-toggle" data-toggle="buttons">
    <label class="btn btn-info cursor-pointer" data-toggle="collapse" data-target="#collapseGraficos" aria-expanded="false" aria-controls="collapseGraficos">
        <input type="checkbox" checked autocomplete="off">
        <div class="d-flex align-items-center">
            <i class="fas fa-chart-pie mr-2"></i>
            <span>Gráficos</span>
        </div>
    </label>
</div>
<div class="collapse" id="collapseGraficos">
    <div class="card mt-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div class="row">
                <div class="col-lg-4">
                    <select class="custom-select" id="selectGraficosTemporal">
                        <option selected disabled>Filtrar campo temporal</option>
                        <?php for($j = 1; $j < count($colunas); $j++): ?>
                            <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                                <?php if(   array_key_exists("label", $colunas[$j]["Comment"]) &&
                                            $colunas[$j]["Type"] == "date"  ): ?>
                                    <option value="<?php echo $colunas[$j]["Field"] ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                                        <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                                    </option>
                                <?php endif ?>
                            <?php endif ?>
                        <?php endfor ?>
                    </select>
                </div>
                <div class="col-lg-4">
                    <select class="custom-select" id="selectGrafOpcoes">
                        <option selected disabled>Agrupar por</option>
                        <option value="d0" >Hoje</option>
                        <option value="d7"> +- 7 dias</option>
                        <option value="d15"> +- 15 dias</option>
                        <option value="d30"> +- 30 dias</option>
                        <option value="semana"> Dias da Semana</option>
                    </select>
                </div>
                <div class="col-lg-4">
                    <div class="btn-group-toggle" data-toggle="buttons">
                        <label class="btn btn-warning btn-block cursor-pointer" data-toggle="collapse" data-target="#corpoGrafico" aria-expanded="false" aria-controls="collapseGraficos">
                            <input type="checkbox" checked autocomplete="off">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-chart-pie mr-2"></i>
                                <span>GráficoW</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body" id='corpoGrafico'>
            <canvas id="fluxocaixaGrafico"></canvas>
        </div>
    </div>
</div>
<div class="collapse" id="collapseGraficos">
    <div class="card mt-4">
        <div class="card-header">
            <div class="row">
                <div class="col-lg-4">
                    <select class="custom-select" id="selectGraficosTemporal">
                        <option selected disabled>Filtrar campo temporal</option>
                        <?php for($j = 1; $j < count($colunas); $j++): ?>
                            <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                                <?php if(   array_key_exists("label", $colunas[$j]["Comment"]) &&
                                            $colunas[$j]["Type"] == "date"  ): ?>
                                    <option value="<?php echo $colunas[$j]["Field"] ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                                        <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                                    </option>
                                <?php endif ?>
                            <?php endif ?>
                        <?php endfor ?>
                    </select>
                </div>
                <div class="col-lg-4">
                    <select class="custom-select" id="selectGrafOpcoes">
                        <option selected disabled>Agrupar por</option>
                        <option value="d0" >Hoje</option>
                        <option value="d7"> +- 7 dias</option>
                        <option value="d15"> +- 15 dias</option>
                        <option value="d30"> +- 30 dias</option>
                        <option value="semana"> Dias da Semana</option>
                    </select>
                </div>
                <div class="col-lg-4">
                    <div class="col flex-lg-grow-0">
                        <div class="btn-group-toggle" data-toggle="buttons">
                            <label class="btn btn-warning btn-block cursor-pointer" data-toggle="collapse" data-target="#corpoGrafico" aria-expanded="false" aria-controls="collapseGraficos">
                                <input type="checkbox" checked autocomplete="off">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-chart-pie mr-2"></i>
                                    <span>GráficoW</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
        <div class="card-body" id='corpoGrafico'>
            <canvas id="fluxocaixaGrafico"></canvas>
        </div>
    </div>
</div>
<!-- <div class="collapse" id="collapseGraficos2">
    <div class="card mt-4">
        <div class="card-header">

            <select class="custom-select" id="selectGraficos">
                <option selected disabled>Filtrar campo pizza</option>
                <?php for($j = 1; $j < count($colunas); $j++): ?>
                    <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                        <?php if(array_key_exists("label", $colunas[$j]["Comment"]) &&
                                 array_key_exists("type", $colunas[$j]["Comment"]) &&
                                $colunas[$j]["Comment"]["type"] =="relacional"  ): ?>
                            <option value="<?php echo $colunas[$j]["Field"] ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                                <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                            </option>
                        <?php endif ?>
                    <?php endif ?>
                <?php endfor ?>
            </select>
        </div>

        <div class="card-header">
            <select class="custom-select" id="selectGraficosTemporal">
                <option selected disabled>Filtrar campo temporal</option>
                <?php for($j = 1; $j < count($colunas); $j++): ?>
                    <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                        <?php if(   array_key_exists("label", $colunas[$j]["Comment"]) &&
                                    $colunas[$j]["Type"] == "date"  ): ?>
                            <option value="<?php echo $colunas[$j]["Field"] ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                                <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                            </option>
                        <?php endif ?>
                    <?php endif ?>
                <?php endfor ?>
            </select>
        </div>

        <div class="card-header">
            <select class="custom-select" id="selectGrafOpcoes">
                <option selected disabled>Agrupar por</option>
                <option value="" data-tipograf = 'line'>Dias</option>
                <option value="WEEKDAY" data-tipograf = 'line'>Dias da Semana</option>
                <option value="WEEK" data-tipograf = 'line'>Semanas</option>
                <option value="MONTH" data-tipograf = 'line'>Mês</option>
                <option value="YEAR" data-tipograf = 'line'>Ano</option>
            </select>
        </div>

        <div class="card-body">
            <canvas id="fluxocaixaGrafico"></canvas>
        </div>
    </div>
</div> -->