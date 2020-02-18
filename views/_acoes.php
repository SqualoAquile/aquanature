<?php if (isset($item) && !empty($item)): ?>
    <?php $acoesdocliente = explode("~~", $item["acoes_cliente"]) ?>
    <section id="acoes" class="historico card card-body collapse my-5">
        <h4 class="text-center py-4">Histórico de Ações do Cliente</h4>
        <div class="wrapper px-3">
            <?php if ( count($acoesdocliente) > intval(0) ):?>
                <?php foreach (array_reverse($acoesdocliente) as $key => $acoesArray): ?>
                    <?php $acoes = explode("**", $acoesArray);?>
                    <?php print_r(empty($acoes))?>
                    <?php
                        $acoes_head = '';
                        $acoes_content = ''; 
                        if( !empty($acoes) > 0 ){
                            $acoes_head = 'AÇÃO REGISTRADA em '.$acoes[1];
                            $acoes_content = ucwords($acoes[0]);
                        }
                    ?>
                        
                    <div class="cada-alteracao py-2">
                        <span class="font-weight-bold small text-muted"><?php echo $acoes_head ?></span>
                        <div class="card card-body border-0 py-0 mx-3 my-2">
                            <div class="card-text small d-flex flex-column">
                                <div><?php echo $acoes_content ?></div>
                            </div>
                        </div>
                    </div>
                        
                <?php endforeach; ?>
            <?php endif;?>    
        </div>
    </section>
<?php endif ?>