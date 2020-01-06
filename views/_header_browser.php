<?php if(!empty($aviso)): ?>
    <div class="alert alert-danger position-fixed my-toast m-3 shadow-sm alert-dismissible" role="alert"> 
        <?php echo $aviso ?>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
<?php endif ?>
<header class="pt-4 pb-5"> <!-- Cabeçalho -->
    <div class="row align-items-center"> <!-- Alinhar as linhas -->
        <div class="col-lg"> <!--Colunas da esquerda -->
            <h1 class="display-4 text-capitalize font-weight-bold"><?php echo isset($labelTabela["labelBrowser"]) && !empty($labelTabela["labelBrowser"]) ? $labelTabela["labelBrowser"] : $modulo ?></h1>
        </div>
        <div class="col-lg"> 
            <div class="input-group mb-3 mb-lg-0">
                <!--Input com os dados da tabela-->
                <input type="text" name="searchDataTable" id="searchDataTable" aria-label="Pesquise por qualquer campo..." class="form-control" placeholder="Pesquise por qualquer campo..." aria-describedby="search-addon">
                <div class="input-group-append">
                    <span class="input-group-text" id="search-addon">
                        <i class="fas fa-search"></i>
                    </span>
                </div>
            </div>
        </div>
        <!-- Verifica se o funcionário tem permissao pra adicionar -->
        <?php if(in_array($modulo . "_add", $infoUser["permissoesUsuario"])):?> <!--$infoUser é um vetor que pega os dados da sessao e armazena, entre outros dados, a permissao do usuario -->
            <div class="col-lg-2">
                <a href="<?php echo BASE_URL . "/" . (isset($headerData["adicionar"]) ? $headerData["adicionar"]["url"] : $modulo . "/adicionar") ?>" class="btn btn-success btn-block">
                    <i class="fas fa-plus-circle mr-1"></i>
                    <span>Adicionar</span>
                </a>
            </div>
        <?php endif ?>
    </div>
</header>