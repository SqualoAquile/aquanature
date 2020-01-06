<script src="<?php echo BASE_URL;?>/assets/js/ferias_form.js" type="text/javascript"></script>
<form id="ferias-form" autocomplete="off" novalidate>
    <h3 class="mt-5 mb-4">Férias</h3>
    <div class="table-responsive mb-lg-5 mb-3">
        
        
        <table id="ferias" class="table table-striped table-hover table-fixed bg-white">
            <thead>
                <tr role="form" class="d-flex flex-column flex-lg-row">
                    <th class="col-lg">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="ferias_inicio   ">Data de Início</label>
                        <input type="text" class="form-control" id="ferias_inicio" name="ferias_inicio" maxlength="10" data-mascara_validacao="data" required>
                    </th>
                    <th class="col-lg">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="ferias_fim   ">Data de Fim</label>
                        <input type="text" class="form-control" id="ferias_fim" name="ferias_fim" maxlength="10" data-mascara_validacao="data" required>
                    </th>
                    <th class="col-lg">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="ferias_retorno">Data de Retorno</label>
                        <input type="text" class="form-control" id="ferias_retorno" name="ferias_retorno" maxlength="10" data-mascara_validacao="data" required>
                    </th>
                    <th class="col-lg">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="ferias_dias">Dias de Gozo (corridos)</label>
                        <input type="text" class="form-control" id="ferias_dias" name="ferias_dias" data-mascara_validacao="numero" maxlength="10" required>
                    </th>
                    <th class="col-lg">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="ferias_periodo">Período Aquisitivo</label>
                        <input type="text" class="form-control" id="ferias_periodo" name="ferias_periodo" data-mascara_validacao="false" placeholder="2018/2019" required>
                    </th>
                    <th class="col-lg-1">
                        <label>Ações</label>
                        <br>
                        <button type="submit" class="btn btn-primary">Incluir</a>
                    </th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>


    </div>
</form>