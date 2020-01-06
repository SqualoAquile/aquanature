<link href="<?php echo BASE_URL;?>/assets/css/compras.css" rel="stylesheet" type="text/css"/>
<script src="<?php echo BASE_URL;?>/assets/js/compras.js" type="text/javascript"></script>
    <h1 class="titulo_cp">COMPRAS</h1>

<div class="aviso_cp"><?php if(!empty($aviso)){echo $aviso;}?></div>
<div class="input-pai"><div class="input-filho">
    <?php if(in_array("compras_add", $infoFunc["permissoesFuncionario"])):?>
        <a href="<?php echo BASE_URL;?>/compras/adicionar" class="botao_cp">Adicionar</a>
    <?php endif;?>
</div></div>
    
    
    <div class="input-pai">
        <div class="input-filho">
            <label class="label-block"> Procurar Por:
                <select class="select-block" id="icampo">
                    <option value="">Todos As Colunas</option>
                    <?php for($i = 2; $i< count($listaColunas)-2; $i++):?>
                    <option value="<?php echo ($i-1);?>"><?php echo ucwords(str_replace("_", " ", $listaColunas[$i]['nomecol']))?></option>
                <?php endfor;?>
                </select>
            </label>    
        </div>
        <div class="input-filho">            
            <label class="label-block" for="ifiltro">Texto Procurado:<input type="text" id="ifiltro" class="input-block" /></label>
        </div>
    </div>

    <table id="tabelacompras" class="display nowrap" cellspacing="0"  style="width: 100%" >
    <thead>
        <tr>
            <th>Ações</th>
            <?php for($i = 2; $i< count($listaColunas)-2; $i++):?>
                <th><?php echo ucwords(str_replace("_", " ", $listaColunas[$i]['nomecol']))?></th>
            <?php endfor;?>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($listaClientes as $chave => $valor ):?>
            <tr>
                <td width="100px">
                    <?php if(in_array("compras_edt", $infoFunc["permissoesFuncionario"])):?>
                        <a href="<?php echo BASE_URL;?>/compras/editar/<?php echo $valor["id"];?>" class="botao_peq_cl">Editar</a>
                    <?php endif;?>
                    <?php if(in_array("compras_exc", $infoFunc["permissoesFuncionario"])):?>
                        <a href="<?php echo BASE_URL;?>/compras/excluir/<?php echo $valor["id"];?>" class="botao_peq_cl" onclick="return confirm('Tem Certeza?')">Excluir</a>
                    <?php endif;?>
                </td>

                <?php for($col = 2; $col < count($listaColunas)-2; $col++):?>
                    <?php if($listaColunas[$col]["tipo"] == "date"):?>
                        
                        <?php if(floatval(str_replace("-", "",$listaClientes[$chave][$col])) == 0):?>
                            <td></td>
                        <?php else:?>
                            <td><?php $dtaux = explode("-",$listaClientes[$chave][$col]); echo $dtaux[2]."/".$dtaux[1]."/".$dtaux[0];?></td>
                        <?php endif;?> 
                        
                    <?php elseif ($listaColunas[$col]["tipo"] == "float"):?>
                        
                        <td><?php echo str_replace(".",",",$listaClientes[$chave][$col]);?></td>
                        
                    <?php else:?>
                        
                        <td><?php echo ucwords($listaClientes[$chave][$col]);?></td>
                        
                    <?php endif;?>
                <?php endfor;?>              
            </tr>
        <?php endforeach;?>
    </tbody>
</table>