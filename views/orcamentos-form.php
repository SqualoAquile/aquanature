<?php
    $table = false;
    $modulo = str_replace("-form", "", basename(__FILE__, ".php"));
    $colunasOrcamentosEsquerda = array_slice($colunasOrcamentos, 0, 18);
    $colunasOrcamentosBaixo = array_slice($colunasOrcamentos, 18);
?>

<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>

<!-- Chama o arquivo específico do módulo, caso não exista,  -->
<!-- Este javaScript serve para fazer verificações inerentes à cada módulo, por exemplo o radio de Clientes -->
<script src="<?php echo BASE_URL?>/assets/js/<?php echo $modulo?>.js" type="text/javascript"></script>

<header class="d-lg-flex align-items-center my-5">
    <?php if(in_array($modulo . "_ver", $infoUser["permissoesUsuario"])): ?>
        <a href="<?php echo BASE_URL . '/' . $modulo ?>" class="btn btn-secondary mr-lg-4" title="Voltar">
            <i class="fas fa-chevron-left"></i>
        </a>
    <?php endif ?>
    <h1 class="display-4 m-0 text-capitalize font-weight-bold"><?php echo $viewInfo["title"]." ".ucfirst($labelTabela["labelForm"]); ?></h1>
</header>

<section id="orcamentos-form-section" class="mb-5">
    <div class="col-lg-7 pr-lg-0 pl-lg-3 px-0 float-lg-right">
        <div id="direita" class="card card-body my-4 my-lg-0">
            <form method="DELETE" class="row" id="camposOrc" novalidate autocomplete="off">
                <?php foreach ($colunasItensOrcamentos as $key => $value): ?>
                    <?php if(isset($value["Comment"]) && array_key_exists("form", $value["Comment"]) && $value["Comment"]["form"] != "false") : ?>
                        <!-- INÍCIO DOS TESTES PARA VER QUAL O TIPO DE CAMPO -->
                        <!-- CAMPOS DO TIPO TABELA - Ex: CONTATOS -->
                        <?php if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "table"): ?> 

                            <!-- Label Geral -->
                            <label class="d-none"><span><?php echo array_key_exists("label", $value["Comment"]) ? $value["Comment"]["label"] : ucwords(str_replace("_", " ", $value['Field'])) ?></span></label>
                            
                            <?php $table = true ?>

                            <input 
                                type="hidden" 
                                name="<?php echo $value["Field"] ?>" 
                                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                <?php echo $value["Null"] == "NO" ? "required" : "" ?>
                            />

                        <!-- CAMPOS DO TIPO HIDDEN - Ex: ALTERAÇÕES -->
                        <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "hidden"): ?>
                            <input 
                                type="hidden" 
                                name="<?php echo lcfirst($value["Field"]) ?>" 
                                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                <?php echo $value["Null"] == "NO" ? "required" : "" ?>
                            />
                        <?php else: ?>
                            <div class="col-xl-<?php echo isset($value["Comment"]["column"]) ? $value["Comment"]["column"] : "12" ?>">
                                <div class="form-group form-group-foreach">
                                    <!-- Label Geral -->
                                    <label class="<?php echo $value["Null"] == "NO" ? "font-weight-bold" : "" ?>" for="<?php echo $value['Field'] ?>">
                                        
                                        <!-- Asterisco de campo obrigatorio -->
                                        <?php if ($value["Null"] == "NO"): ?>
                                            <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                                        <?php endif ?>
                                        <span><?php echo array_key_exists("label", $value["Comment"]) ? ucwords($value["Comment"]["label"]) : ucwords(str_replace("_", " ", $value['Field'])) ?></span>
                                    </label>
                                    <!-- CAMPOS DO TIPO RELACIONAL - SELECT -->
                                    <?php if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "relacional"): ?>
                                        
                                        <select id="<?php echo lcfirst($value['Field']);?>" 
                                                name="<?php echo lcfirst($value['Field']);?>"
                                                class="form-control"
                                                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                                >
                                                <option value="" selected >Selecione</option>
                                                <?php for($j = 0; $j < count($value["Comment"]['info_relacional']['resultado']); $j++):?>
                                                    
                                                    <option value="<?php echo $value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']];?>"
                                                        <?php if(isset($item[$value["Field"]])):?>
                                                            <?php if(strtoupper($item[$value["Field"]]) == strtoupper($value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']])):?>
                                                                <?php echo "selected"?>
                                                            <?php endif?>    
                                                        <?php endif?>    

                                                    ><?php echo $value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']];?></option>
                                                    
                                                <?php endfor;?>     
                                        </select>

                                    <!-- CAMPOS DO TIPO CHECKBOX -->    
                                    <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "checkbox"): ?>

                                            <?php 
                                                $opcoes = $value['Comment']['info_relacional']['resultado'];
                                                $opcoes =  array_map('strtolower', $opcoes);
                                                $opcoes =  array_map('trim', $opcoes);
                                                
                                                $checados = array();
                                                if(isset($item) && !empty($item)){
                                                    $checados =  explode(",",$item[$value['Field']]);
                                                    $checados =  array_map('strtolower', $checados);
                                                    $checados =  array_map('trim', $checados);
                                                }
                                            ?>
                                            <div class="form-check-wrapper position-relative form-checkbox pr-4" tabindex="0">
                                                <?php for($j = 0; $j < count($opcoes); $j++):?>
                                                    <div class="form-check form-check-inline">
                                                        <input 
                                                            id="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>" 
                                                            type="checkbox" 
                                                            class="form-check-input" 
                                                            data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>" 
                                                            <?php
                                                            if(isset($item)){
                                                                if( in_array($opcoes[$j], $checados) == true){
                                                                    echo "checked='checked'";
                                                                }
                                                            }
                                                            ?>
                                                        />
                                                        <label class="form-check-label" for="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>" ><?php echo $value["Comment"]['info_relacional']['resultado'][$j];?></label>
                                                    </div>
                                                <?php endfor?>
                                                <input 
                                                    type="hidden" 
                                                    name="<?php echo lcfirst($value["Field"]) ?>" 
                                                    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                    <?php echo $value["Null"] == "NO" ? "required" : "" ?>
                                                />
                                            </div>
                                    
                                    <!-- CAMPOS DO TIPO TEXTAREA -->
                                    <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "textarea"): ?>
                                        
                                        <textarea
                                            class="form-control" 
                                            name="<?php echo lcfirst($value['Field']);?>" 
                                            id="<?php echo lcfirst($value['Field']);?>"
                                            data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                            <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                        ></textarea>

                                    <!-- CAMPOS DO TIPO RADIO -->
                                    <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "radio"): ?>
                                        <?php $indexRadio = 0 ?>
                                        <div class="form-check-wrapper form-radio d-table position-relative pr-4">
                                            <?php foreach ($value["Comment"]["options"] as $valueRadio => $label): ?>
                                                <div class="form-check form-check-inline position-static">
                                                    <input 
                                                        type="radio" 
                                                        tabindex="-1"
                                                        id="<?php echo $valueRadio ?>" 
                                                        name="<?php echo $value["Field"] ?>" 
                                                        data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                        class="form-check-input" 
                                                        <?php echo $value['Null'] == "NO" ? "required" : "" ?>

                                                        <?php if(isset($item[$value["Field"]])):?>
                                                            <?php if(strtolower($item[$value["Field"]]) == strtolower($valueRadio) ):?>
                                                                <?php echo "checked" ?>
                                                            <?php endif?>
                                                        <?php else:?>        
                                                            <?php echo $indexRadio == 0 ? "checked" : "" ?>
                                                            <?php $indexRadio++ ?>
                                                        <?php endif?>
                                                    >
                                                    <label class="form-check-label" for="<?php echo $valueRadio ?>"><?php echo $label ?></label>
                                                </div>
                                            <?php endforeach ?>
                                        </div>
                                        
                                    <!-- CAMPOS DO TIPO DROPDOWN -->
                                    <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "dropdown"): ?>
                                        <div class="relacional-dropdown-wrapper dropdown">
                                            <label class="d-none"><span><?php echo array_key_exists("label", $value["Comment"]) ? $value["Comment"]["label"] : ucwords(str_replace("_", " ", $value['Field'])) ?></span></label>

                                            <input 
                                            id="<?php echo $value['Field'] ?>" 
                                            name="<?php echo $value['Field'] ?>" 
                                            type="text" 
                                            class="dropdown-toggle form-control relacional-dropdown-input-orcamento" 
                                            data-toggle="dropdown" 
                                            aria-haspopup="true" 
                                            aria-expanded="false"
                                            maxlength="<?php echo $value["tamanhoMax"] ?>"
                                            data-tabela="<?php echo $value["Comment"]["info_relacional"]["tabela"] ?>" 
                                            data-campo="<?php echo $value["Comment"]["info_relacional"]["campo"] ?>" 
                                            data-pode_nao_cadastrado="<?php echo array_key_exists("pode_nao_cadastrado", $value["Comment"]["info_relacional"]) ? $value["Comment"]["info_relacional"]["pode_nao_cadastrado"] : "false" ?>" 
                                            data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                            data-unico="<?php echo array_key_exists("unico", $value["Comment"]) && $value["Comment"]["unico"]  == true ? "unico" : "" ?>"
                                            <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                            <?php if( array_key_exists("mascara_validacao", $value["Comment"]) && 
                                                    ( $value["Comment"]["mascara_validacao"] == "monetario" || $value["Comment"]["mascara_validacao"] == "porcentagem" || $value["Comment"]["mascara_validacao"] == "numero" )):?>
                                                data-podeZero="<?php echo array_key_exists("pode_zero", $value["Comment"]) && $value["Comment"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
                                            <?php endif?> 
                                            />

                                            <label data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent" for="<?php echo $value['Field'] ?>" class="btn btn-sm text-secondary icon-dropdown m-0 toggle-btn dropdown-toggle" tabindex="-1">
                                                <i class="fas fa-caret-down"></i>
                                            </label>
                                            
                                            <div class="dropdown-menu w-100 p-0 list-group-flush relacional-dropdown" aria-labelledby="<?php echo $value["Field"] ?>">
                                                <div class="p-3 nenhum-result d-none">Nenhum resultado encontrado</div>
                                                <div class="dropdown-menu-wrapper"></div>
                                            </div>
                                        </div>
                                    <?php else: ?>
                                        <!-- CAMPOS DO TIPO TEXT -->
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            name="<?php echo lcfirst($value["Field"]) ?>" 
                                            data-unico="<?php echo array_key_exists("unico", $value["Comment"]) && $value["Comment"]["unico"]  == true ? "unico" : "" ?>"
                                            id="<?php echo $value['Field'] ?>"
                                            <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                            maxlength="<?php echo $value["tamanhoMax"] ?>"
                                            data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                            <?php if( array_key_exists("mascara_validacao", $value["Comment"]) && 
                                                    ( $value["Comment"]["mascara_validacao"] == "monetario" || $value["Comment"]["mascara_validacao"] == "porcentagem" || $value["Comment"]["mascara_validacao"] == "numero" )):?>
                                                data-podeZero="<?php echo array_key_exists("pode_zero", $value["Comment"]) && $value["Comment"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
                                            <?php endif?>                                        
                                        />
                                    <?php endif ?>
                                </div>
                            </div>
                        <?php endif ?>
                    <?php endif ?>
                <?php endforeach ?>
                <div class="col-lg-4">
                    <button id="btn_incluir" class="btn btn-primary btn-block">Incluir</button>
                </div>
                <div id="col-cancelar_edicao" class="col-lg-4 d-none">
                    <button id="cancelar_edicao" type="reset" class="btn btn-primary btn-light btn-block">Cancelar Edição</button>
                </div>
            </form>
            <div class="row" id='tabelaOrc'>
                <div class="col-lg">
                    <?php include "_orcamentoitens_form.php" ?>
                </div>
            </div>
        </div>
    </div>
    <form id="form-principal" method="POST" class="needs-validation" novalidate autocomplete="off" data-id-orcamento="<?php echo isset($item) ? $item["id"] : "" ?>">
        <div class="col-lg-5 pl-lg-0 pr-lg-3 px-0">
            <div id="esquerda" class="card card-body my-4 my-lg-0">
                <div class="row">
                    <?php foreach ($colunasOrcamentosEsquerda as $key => $value): ?>
                        <?php if(isset($value["Comment"]) && array_key_exists("form", $value["Comment"]) && $value["Comment"]["form"] != "false") : ?>
                            
                            <!-- INÍCIO DOS TESTES PARA VER QUAL O TIPO DE CAMPO -->
                            <!-- CAMPOS DO TIPO TABELA - Ex: CONTATOS -->
                            <?php if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "table"): ?> 

                                <!-- Label Geral -->
                                <label class="d-none"><span><?php echo array_key_exists("label", $value["Comment"]) ? $value["Comment"]["label"] : ucwords(str_replace("_", " ", $value['Field'])) ?></span></label>
                                
                                <?php $table = true ?>

                                <input 
                                    type="hidden" 
                                    name="<?php echo $value["Field"] ?>" 
                                    value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                    <?php echo $value["Null"] == "NO" ? "required" : "" ?>
                                    
                                />

                            <!-- CAMPOS DO TIPO HIDDEN - Ex: ALTERAÇÕES -->
                            <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "hidden"): ?>
                                
                                <input 
                                    type="hidden" 
                                    name="<?php echo lcfirst($value["Field"]) ?>" 
                                    value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                    <?php echo $value["Null"] == "NO" ? "required" : "" ?>
                                />
                            <?php else: ?>
                                <div class="col-xl-<?php echo isset($value["Comment"]["column"]) ? $value["Comment"]["column"] : "12" ?>">
                                    <div class="form-group form-group-foreach">

                                        <!-- Label Geral -->
                                        <label class="<?php echo $value["Null"] == "NO" ? "font-weight-bold" : "" ?>" for="<?php echo $value['Field'] ?>">
                                            
                                            <!-- Asterisco de campo obrigatorio -->
                                            <i class="font-weight-bold <?php echo $value["Null"] == "NO" ? "" : "d-none" ?>" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                                            <span><?php echo array_key_exists("label", $value["Comment"]) ? ucwords($value["Comment"]["label"]) : ucwords(str_replace("_", " ", $value['Field'])) ?></span>
                                        </label>
                                        
                                        <!-- CAMPOS DO TIPO RELACIONAL - SELECT -->
                                        <?php if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "relacional"): ?>

                                            <select id="<?php echo lcfirst($value['Field']);?>" 
                                                    name="<?php echo lcfirst($value['Field']);?>"
                                                    class="form-control"
                                                    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                    <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                                    >
                                                    <option value="" selected>Selecione</option>
                                                    <?php for($j = 0; $j < count($value["Comment"]['info_relacional']['resultado']); $j++):?>
                                                        
                                                        <option value="<?php echo $value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']];?>"
                                                            <?php if(isset($item[$value["Field"]])):?>
                                                                <?php if(strtoupper($item[$value["Field"]]) == strtoupper($value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']])):?>
                                                                    <?php echo "selected"?>
                                                                <?php endif?>    
                                                            <?php endif?>    

                                                        ><?php echo $value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']];?></option>
                                                        
                                                    <?php endfor;?>     
                                            </select>

                                        <!-- CAMPOS DO TIPO CHECKBOX -->    
                                        <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "checkbox"): ?>

                                                <?php 
                                                    $opcoes = $value['Comment']['info_relacional']['resultado'];
                                                    $opcoes =  array_map('strtolower', $opcoes);
                                                    $opcoes =  array_map('trim', $opcoes);
                                                    
                                                    $checados = array();
                                                    if(isset($item) && !empty($item)){
                                                        $checados =  explode(",",$item[$value['Field']]);
                                                        $checados =  array_map('strtolower', $checados);
                                                        $checados =  array_map('trim', $checados);
                                                    }
                                                ?>
                                                <div class="form-check-wrapper position-relative form-checkbox pr-4">
                                                    <?php for($j = 0; $j < count($opcoes); $j++):?>
                                                        <div class="form-check form-check-inline">
                                                            <input 
                                                                id="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>" 
                                                                type="checkbox" 
                                                                class="form-check-input" 
                                                                value="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>"
                                                                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>" 
                                                                <?php
                                                                if(isset($item)){
                                                                    if( in_array($opcoes[$j], $checados) == true){
                                                                        echo "checked='checked'";
                                                                    }
                                                                }
                                                                ?>
                                                            />
                                                            <label class="form-check-label" for="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>" ><?php echo $value["Comment"]['info_relacional']['resultado'][$j];?></label>
                                                        </div>
                                                    <?php endfor?>
                                                    <input 
                                                        type="hidden" 
                                                        name="<?php echo lcfirst($value["Field"]) ?>" 
                                                        value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                                        data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                        data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                        <?php echo $value["Null"] == "NO" ? "required" : "" ?>
                                                    />
                                                </div>
                                        
                                        <!-- CAMPOS DO TIPO TEXTAREA -->
                                        <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "textarea"): ?>
                                            
                                            <textarea
                                                class="form-control" 
                                                name="<?php echo lcfirst($value['Field']);?>" 
                                                data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                id="<?php echo lcfirst($value['Field']);?>"
                                                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                            ><?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?></textarea>

                                        <!-- CAMPOS DO TIPO RADIO -->
                                        <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "radio"): ?>
                                            <?php $indexRadio = 0 ?>
                                            <div class="form-check-wrapper form-radio d-table position-relative pr-4">
                                                <?php foreach ($value["Comment"]["options"] as $valueRadio => $label): ?>
                                                    <div class="form-check form-check-inline position-static">
                                                        <input 
                                                            type="radio" 
                                                            tabindex="-1"
                                                            id="<?php echo $valueRadio ?>" 
                                                            value="<?php echo $valueRadio ?>" 
                                                            name="<?php echo $value["Field"] ?>" 
                                                            data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                            data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                            class="form-check-input" 
                                                            <?php echo $value['Null'] == "NO" ? "required" : "" ?>

                                                            <?php if(isset($item[$value["Field"]])):?>
                                                                <?php if(strtolower($item[$value["Field"]]) == strtolower($valueRadio) ):?>
                                                                    <?php echo "checked" ?>
                                                                <?php endif?>
                                                            <?php else:?>        
                                                                <?php echo $indexRadio == 0 ? "checked" : "" ?>
                                                                <?php $indexRadio++ ?>
                                                            <?php endif?>
                                                        >
                                                        <label class="form-check-label" for="<?php echo $valueRadio ?>"><?php echo $label ?></label>
                                                    </div>
                                                <?php endforeach ?>
                                            </div>
                                            
                                        <!-- CAMPOS DO TIPO DROPDOWN -->
                                        <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "dropdown"): ?>
                                            <div class="relacional-dropdown-wrapper dropdown">
                                                <label class="d-none"><span><?php echo array_key_exists("label", $value["Comment"]) ? $value["Comment"]["label"] : ucwords(str_replace("_", " ", $value['Field'])) ?></span></label>
                                                <input 
                                                id="<?php echo $value['Field'] ?>" 
                                                name="<?php echo $value['Field'] ?>" 
                                                type="text" 
                                                class="dropdown-toggle form-control relacional-dropdown-input-cliente" 
                                                data-toggle="dropdown" 
                                                aria-haspopup="true" 
                                                aria-expanded="false"
                                                maxlength="<?php echo $value["tamanhoMax"] ?>"
                                                value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                                data-tabela="<?php echo $value["Comment"]["info_relacional"]["tabela"] ?>" 
                                                data-campo="<?php echo $value["Comment"]["info_relacional"]["campo"] ?>" 
                                                data-pode_nao_cadastrado="<?php echo array_key_exists("pode_nao_cadastrado", $value["Comment"]["info_relacional"]) ? $value["Comment"]["info_relacional"]["pode_nao_cadastrado"] : "false" ?>" 
                                                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                data-unico="<?php echo array_key_exists("unico", $value["Comment"]) && $value["Comment"]["unico"]  == true ? "unico" : "" ?>"
                                                data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                                <?php if( array_key_exists("mascara_validacao", $value["Comment"]) && 
                                                        ( $value["Comment"]["mascara_validacao"] == "monetario" || $value["Comment"]["mascara_validacao"] == "porcentagem" || $value["Comment"]["mascara_validacao"] == "numero" )):?>
                                                    data-podeZero="<?php echo array_key_exists("pode_zero", $value["Comment"]) && $value["Comment"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
                                                <?php endif?> 
                                                />
                                                <label data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent" for="<?php echo $value['Field'] ?>" class="btn btn-sm text-secondary icon-dropdown m-0 toggle-btn dropdown-toggle" tabindex="-1">
                                                    <i class="fas fa-caret-down"></i>
                                                </label>
                                                <div class="dropdown-menu w-100 p-0 list-group-flush relacional-dropdown" aria-labelledby="<?php echo $value["Field"] ?>">
                                                    <div class="p-3 nenhum-result d-none">Nenhum resultado encontrado</div>
                                                    <div class="dropdown-menu-wrapper"></div>
                                                </div>
                                            </div>
                                        <?php else: ?>

                                            <!-- CAMPOS DO TIPO TEXT -->
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                name="<?php echo lcfirst($value["Field"]) ?>" 
                                                value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                                data-unico="<?php echo array_key_exists("unico", $value["Comment"]) && $value["Comment"]["unico"]  == true ? "unico" : "" ?>"
                                                data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                id="<?php echo $value['Field'] ?>"
                                                <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                                maxlength="<?php echo $value["tamanhoMax"] ?>"
                                                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                <?php if( array_key_exists("mascara_validacao", $value["Comment"]) && 
                                                        ( $value["Comment"]["mascara_validacao"] == "monetario" || $value["Comment"]["mascara_validacao"] == "porcentagem" || $value["Comment"]["mascara_validacao"] == "numero" )):?>
                                                    data-podeZero="<?php echo array_key_exists("pode_zero", $value["Comment"]) && $value["Comment"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
                                                <?php endif?>                                        
                                            />
                                        <?php endif ?>
                                    </div>
                                </div>
                            <?php endif ?>
                        <?php endif ?>
                    <?php endforeach ?>
                </div>
                <div class="observacao_cliente_wrapper">
                    <button class="btn btn-light" type="button" data-toggle="collapse" data-target="#collapseObsCliente" aria-expanded="false" aria-controls="collapseObsCliente">Observações</button>
                    <div class="collapse mt-3" id="collapseObsCliente">
                        <textarea id="observacao_cliente" readonly disabled name="observacao_cliente" data-anterior="" tabindex="-1" class="form-control"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div id="embaixo" class="card card-body my-4">
                    <div class="row">
                        <?php foreach ($colunasOrcamentosBaixo as $key => $value): ?>
                            <?php if(isset($value["Comment"]) && array_key_exists("form", $value["Comment"]) && $value["Comment"]["form"] != "false") : ?>
                                
                                <!-- INÍCIO DOS TESTES PARA VER QUAL O TIPO DE CAMPO -->
                                <!-- CAMPOS DO TIPO TABELA - Ex: CONTATOS -->
                                <?php if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "table"): ?> 

                                    <!-- Label Geral -->
                                    <label class="d-none"><span><?php echo array_key_exists("label", $value["Comment"]) ? $value["Comment"]["label"] : ucwords(str_replace("_", " ", $value['Field'])) ?></span></label>
                                    
                                    <?php $table = true ?>

                                    <input 
                                        type="hidden" 
                                        name="<?php echo $value["Field"] ?>" 
                                        value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                        data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                        data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                        <?php echo $value["Null"] == "NO" ? "required" : "" ?>
                                        
                                    />

                                <!-- CAMPOS DO TIPO HIDDEN - Ex: ALTERAÇÕES -->
                                <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "hidden"): ?>
                                    
                                    <input 
                                        type="hidden" 
                                        name="<?php echo lcfirst($value["Field"]) ?>" 
                                        value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                        data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                        data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                        <?php echo $value["Null"] == "NO" ? "required" : "" ?>
                                    />
                                <?php else: ?>
                                    <div class="col-lg">
                                        <div class="form-group form-group-foreach">

                                            <!-- Label Geral -->
                                            <label class="<?php echo $value["Null"] == "NO" ? "font-weight-bold" : "" ?>" for="<?php echo $value['Field'] ?>">
                                                
                                                <!-- Asterisco de campo obrigatorio -->
                                                <i class="font-weight-bold <?php echo $value["Null"] == "NO" ? "" : "d-none" ?>" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                                                <span><?php echo array_key_exists("label", $value["Comment"]) ? ucwords($value["Comment"]["label"]) : ucwords(str_replace("_", " ", $value['Field'])) ?></span>
                                            </label>
                                            
                                            <!-- CAMPOS DO TIPO RELACIONAL - SELECT -->
                                            <?php if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "relacional"): ?>

                                                <select id="<?php echo lcfirst($value['Field']);?>" 
                                                    name="<?php echo lcfirst($value['Field']);?>"
                                                    class="form-control"
                                                    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                    <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                                    >
                                                    <option value="" selected>Selecione</option>
                                                    <?php for($j = 0; $j < count($value["Comment"]['info_relacional']['resultado']); $j++):?>
                                                        
                                                        <option value="<?php echo $value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']];?>"
                                                            <?php if(isset($item[$value["Field"]])):?>
                                                                <?php if(strtoupper($item[$value["Field"]]) == strtoupper($value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']])):?>
                                                                    <?php echo "selected"?>
                                                                <?php endif?>    
                                                            <?php endif?>    

                                                        ><?php echo $value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']];?></option>
                                                        
                                                    <?php endfor;?>
                                                </select>

                                            <!-- CAMPOS DO TIPO CHECKBOX -->    
                                            <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "checkbox"): ?>

                                                <?php 
                                                    $opcoes = $value['Comment']['info_relacional']['resultado'];
                                                    $opcoes =  array_map('strtolower', $opcoes);
                                                    $opcoes =  array_map('trim', $opcoes);
                                                    
                                                    $checados = array();
                                                    if(isset($item) && !empty($item)){
                                                        $checados =  explode(",",$item[$value['Field']]);
                                                        $checados =  array_map('strtolower', $checados);
                                                        $checados =  array_map('trim', $checados);
                                                    }
                                                ?>
                                                <div class="form-check-wrapper position-relative form-checkbox pr-4">
                                                    <?php for($j = 0; $j < count($opcoes); $j++):?>
                                                        <div class="form-check form-check-inline">
                                                            <input 
                                                                id="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>" 
                                                                type="checkbox" 
                                                                class="form-check-input" 
                                                                value="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>"
                                                                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>" 
                                                                <?php
                                                                if(isset($item)){
                                                                    if( in_array($opcoes[$j], $checados) == true){
                                                                        echo "checked='checked'";
                                                                    }
                                                                }
                                                                ?>
                                                            />
                                                            <label class="form-check-label" for="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>" ><?php echo $value["Comment"]['info_relacional']['resultado'][$j];?></label>
                                                        </div>
                                                    <?php endfor?>
                                                    <input 
                                                        type="hidden" 
                                                        name="<?php echo lcfirst($value["Field"]) ?>" 
                                                        value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                                        data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                        data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                        <?php echo $value["Null"] == "NO" ? "required" : "" ?>
                                                    />
                                                </div>
                                            
                                            <!-- CAMPOS DO TIPO TEXTAREA -->
                                            <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "textarea"): ?>
                                                
                                                <textarea
                                                    class="form-control" 
                                                    name="<?php echo lcfirst($value['Field']);?>" 
                                                    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                    id="<?php echo lcfirst($value['Field']);?>"
                                                    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                    <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                                ><?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?></textarea>

                                            <!-- CAMPOS DO TIPO RADIO -->
                                            <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "radio"): ?>
                                                <?php $indexRadio = 0 ?>
                                                <div class="form-check-wrapper form-radio d-table position-relative pr-4">
                                                    <?php foreach ($value["Comment"]["options"] as $valueRadio => $label): ?>
                                                        <div class="form-check form-check-inline position-static">
                                                            <input 
                                                                type="radio" 
                                                                tabindex="-1"
                                                                id="<?php echo $valueRadio ?>" 
                                                                value="<?php echo $valueRadio ?>" 
                                                                name="<?php echo $value["Field"] ?>" 
                                                                data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                                class="form-check-input" 
                                                                <?php echo $value['Null'] == "NO" ? "required" : "" ?>

                                                                <?php if(isset($item[$value["Field"]])):?>
                                                                    <?php if(strtolower($item[$value["Field"]]) == strtolower($valueRadio) ):?>
                                                                        <?php echo "checked" ?>
                                                                    <?php endif?>
                                                                <?php else:?>        
                                                                    <?php echo $indexRadio == 0 ? "checked" : "" ?>
                                                                    <?php $indexRadio++ ?>
                                                                <?php endif?>
                                                            >
                                                            <label class="form-check-label" for="<?php echo $valueRadio ?>"><?php echo $label ?></label>
                                                        </div>
                                                    <?php endforeach ?>
                                                </div>
                                                
                                            <!-- CAMPOS DO TIPO DROPDOWN -->
                                            <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "dropdown"): ?>
                                                <div class="relacional-dropdown-wrapper dropdown">
                                                    <label class="d-none"><span><?php echo array_key_exists("label", $value["Comment"]) ? $value["Comment"]["label"] : ucwords(str_replace("_", " ", $value['Field'])) ?></span></label>
                                                    <input 
                                                    id="<?php echo $value['Field'] ?>" 
                                                    name="<?php echo $value['Field'] ?>" 
                                                    type="text" 
                                                    class="dropdown-toggle form-control relacional-dropdown-input" 
                                                    data-toggle="dropdown" 
                                                    aria-haspopup="true" 
                                                    aria-expanded="false"
                                                    maxlength="<?php echo $value["tamanhoMax"] ?>"
                                                    value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                                    data-tabela="<?php echo $value["Comment"]["info_relacional"]["tabela"] ?>" 
                                                    data-campo="<?php echo $value["Comment"]["info_relacional"]["campo"] ?>" 
                                                    data-pode_nao_cadastrado="<?php echo array_key_exists("pode_nao_cadastrado", $value["Comment"]["info_relacional"]) ? $value["Comment"]["info_relacional"]["pode_nao_cadastrado"] : "false" ?>" 
                                                    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                    data-unico="<?php echo array_key_exists("unico", $value["Comment"]) && $value["Comment"]["unico"]  == true ? "unico" : "" ?>"
                                                    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                    <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                                    <?php if( array_key_exists("mascara_validacao", $value["Comment"]) && 
                                                            ( $value["Comment"]["mascara_validacao"] == "monetario" || $value["Comment"]["mascara_validacao"] == "porcentagem" || $value["Comment"]["mascara_validacao"] == "numero" )):?>
                                                        data-podeZero="<?php echo array_key_exists("pode_zero", $value["Comment"]) && $value["Comment"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
                                                    <?php endif?> 
                                                    />
                                                    <label data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent" for="<?php echo $value['Field'] ?>" class="btn btn-sm text-secondary icon-dropdown m-0 toggle-btn dropdown-toggle" tabindex="-1">
                                                        <i class="fas fa-caret-down"></i>
                                                    </label>
                                                    <div class="dropdown-menu w-100 p-0 list-group-flush relacional-dropdown" aria-labelledby="<?php echo $value["Field"] ?>">
                                                        <div class="p-3 nenhum-result d-none">Nenhum resultado encontrado</div>
                                                        <div class="dropdown-menu-wrapper"></div>
                                                    </div>
                                                </div>
                                            <?php else: ?>

                                                <!-- CAMPOS DO TIPO TEXT -->
                                                <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    name="<?php echo lcfirst($value["Field"]) ?>" 
                                                    value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
                                                    data-unico="<?php echo array_key_exists("unico", $value["Comment"]) && $value["Comment"]["unico"]  == true ? "unico" : "" ?>"
                                                    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                                                    id="<?php echo $value['Field'] ?>"
                                                    <?php echo $value['Null'] == "NO" ? "required" : "" ?>
                                                    maxlength="<?php echo $value["tamanhoMax"] ?>"
                                                    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                                                    <?php if( array_key_exists("mascara_validacao", $value["Comment"]) && 
                                                            ( $value["Comment"]["mascara_validacao"] == "monetario" || $value["Comment"]["mascara_validacao"] == "porcentagem" || $value["Comment"]["mascara_validacao"] == "numero" )):?>
                                                        data-podeZero="<?php echo array_key_exists("pode_zero", $value["Comment"]) && $value["Comment"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
                                                    <?php endif?>                                        
                                                />
                                            <?php endif ?>
                                        </div>
                                    </div>
                                <?php endif ?>
                            <?php endif ?>
                        <?php endforeach ?>
                    </div>
                </div>
            </div>
        </div>
        <div id="invalid-feedback-zero-itens" class="row mt-3 d-none">
            <div class="col-lg">
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    É preciso ter ao menos 1 item cadastrado no orçamento.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </div>
        <div id="acoes-orcamento">
            <div class="row mt-3">


                <?php if ((isset($item) && $item["status"] != "Aprovado" && $item["status"] != "Cancelado") || !isset($item)): ?>

                    <div id="col-salvar" class="col-lg-2">
                        <button type="submit" id="main-form" class="btn btn-primary btn-block">Salvar</button>
                    </div>

                <?php endif ?>

                <?php if (isset($item)): ?>
                    
                    <div id="col-historico" class="col-lg">
                        <button class="btn btn-dark btn-block" type="button" data-toggle="collapse" data-target="#historico" aria-expanded="false" aria-controls="historico">Histórico de Alterações</button>
                    </div>

                    <?php if ($item["status"] != "Aprovado" && $item["status"] != "Cancelado"): ?>
                        <div id="col-aprovar" class="col-lg">
                            <button class="btn btn-success btn-block" type="button" id="aprovar-orcamento">Aprovar Orçamento</button>
                        </div>
                        <div id="col-cancelar" class="col-lg d-none">
                            <button id="btn_cancelamentoOrc" class="btn btn-danger btn-block" type="button">Cancelar Orçamento</button>
                        </div>
                        <div class="col-lg">
                            <label id="checkCancelar" class="btn btn-secondary btn-block d-flex align-items-center justify-content-center" for="chk_cancelamentoOrc">
                                <input 
                                    id="chk_cancelamentoOrc" 
                                    type="checkbox" 
                                    class="mr-2"
                                />
                                <span>Cancelar Orçamento</span>
                            </label>
                        </div>
                    <?php endif ?>
                    <div id="col-duplicar" class="col-lg">
                        <button id="duplica_orcamento" type="button" class="btn btn-info btn-block">
                            Duplicar
                        </button>
                    </div>
                    <div id="col-imprimir" class="col-lg">
                        <button type="button" class="btn btn-warning btn-block" data-id="<?php echo isset($item) ? $item["id"] : "" ?>" data-toggle="modal" data-target="#modalConfImp">
                            Imprimir
                        </button>
                    </div>
                <?php endif ?>
            </div>
            <?php if ((isset($item) && $item["status"] != "Recontato" && $item["status"] != "Aprovado" && $item["status"] != "Cancelado")): ?>
                <div class="row mt-3 justify-content-end">
                    <div id="col-recontato" class="col-lg-2">
                        <button type="button" id="recontato" class="btn btn-outline-primary btn-block mb-2">Recontato</button>
                    </div>
                </div>
            <?php endif ?>
        </div>
    </form>
    <?php include "_historico.php" ?>
</section>

<?php include "_modal_configuracoes_impressao.php" ?>

<!-- Modal - Adicionar Cliente -->
<div class="modal fade modais-require" id="modalCadastrarCliente" tabindex="-1" role="dialog" aria-labelledby="modalCadastrarClienteLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header border-0 position-absolute w-100">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <?php
                    $shared = new Shared('clientes');
                    $colunas = $shared->nomeDasColunas();
                    $viewInfoModal = ["title" => "Adicionar"];
                    $labelTabela = $shared->labelTabela();

                    // Em caso de edição do orçamento, a variavel $item será confundida pelo clientes-form
                    // Essa variavel $item já foi usada la em cima para setar os campos do form
                    // Aqui neste ponto do código ela pode ser destruida tranquilamente
                    // Os dados serão setados no clientes-form somente através de javascript
                    unset($item);

                    // Configurações para o submit do form
                    $formIdModal = "ModalOrcamentos";
                    
                    require "clientes-form.php";
                ?>
            </div>
        </div>
    </div>
</div>
