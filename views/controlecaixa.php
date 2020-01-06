<!-- <link href="<?php echo BASE_URL;?>/assets/css/controlecaixa.css" rel="stylesheet" type="text/css"/>
<script src="<?php echo BASE_URL;?>/assets/js/controlecaixa.js" type="text/javascript"></script> -->
<script type="text/javascript">var baselink = '<?php echo BASE_URL;?>'; var targetCols = 11;</script>

<h1 class="titulo_lc">CONTROLE LANÇAMENTOS FLUXO DE CAIXA</h1>


<div class="input-pai"><div class="input-filho">
        <div id="ititulo1">Filtros</div>
        <div id="ifiltros">
            <div class="input-pai">
                <div class="input-filho">            
                    <input type="button" value="Limpar Filtros" class="botao_lcAux" onclick="limparFiltros()"/><br/>
                </div>
                <div class="input-filho">            
                    <input type="text" id="ipesqglobal" class="input-block" placeholder="Pesquisar em TODAS as Colunas por:"/>
                </div>
                <div class="input-filho">
                    <div class="radio-50">
                        <label for="idespesa"><input type="radio" id="idespesa" name="movimentacao" value="despesa"/>Despesa</label>
                    </div> 
                    <div class="radio-50">
                        <label for="ireceita"><input type="radio" id="ireceita" name="movimentacao" value="receita" />Receita</label>
                    </div>
                </div>
            </div>
            
            <div class="input-pai">
                <div class="input-filho">
                    <select class="select-block" id="idatas" style="width: 98.8%">
                        <option value="">Filtrar Datas Pela Coluna:</option>
                        <?php for($i = 2; $i< count($listaColunas)-2; $i++):?>
                            <?php if($listaColunas[$i]["tipo"] == "date"):?>
                                <option value="<?php echo ($i-1);?>"><?php echo ucwords(str_replace("_", " ", $listaColunas[$i]['nomecol']))?></option>
                            <?php endif;?>    
                    <?php endfor;?>
                    </select>
                </div>
            </div>    
            <div class="input-pai">
                <div class="input-filho align-items-center">            
                    <input type="text" id="idtmin" class="input-block" placeholder="Data Inicial"/>
                </div>
                <div class="input-filho">            
                    <input type="text" id="idtmax" class="input-block" placeholder="Data Final"/>
                </div>
            </div>    

            <div class="input-pai">
                <div class="input-filho">
                    <select class="select-block" id="icampo1">
                        <option value="">Procurar pela Coluna:</option>
                        <?php for($i = 2; $i< count($listaColunas)-2; $i++):?>
                            <?php if($listaColunas[$i]["tipo"] != "date" && ($i-1) != 4):?>
                                <option value="<?php echo ($i-1);?>"><?php echo ucwords(str_replace("_", " ", $listaColunas[$i]['nomecol']))?></option>
                            <?php endif;?>
                        <?php endfor;?>
                    </select>
                </div>
                <div class="input-filho">            
                    <input type="text" id="ifiltro1" class="input-block" placeholder="Procurar Por:"/>
                </div>
            </div>

            <div class="input-pai">
                <div class="input-filho">
                    <select class="select-block" id="icampo2">
                        <option value="">Procurar pela Coluna:</option>
                        <?php for($i = 2; $i< count($listaColunas)-2; $i++):?>
                            <?php if($listaColunas[$i]["tipo"] != "date" && ($i-1) != 4):?>
                                <option value="<?php echo ($i-1);?>"><?php echo ucwords(str_replace("_", " ", $listaColunas[$i]['nomecol']))?></option>
                            <?php endif;?>
                        <?php endfor;?>
                    </select>
                </div>
                <div class="input-filho">            
                    <input type="text" id="ifiltro2" class="input-block" placeholder="Procurar Por:"/>
                </div>
            </div>
        </div>    
</div></div>        

<div class="input-pai" id="iselecitens"><div class="input-filho">
        <div id="ititulo2"> Resumo da Seleção</div>
        <div id="iresumo">
        <div class="input-pai">
            <div class="input-filho"> <p id="iitens"></p></div>
            <div class="input-filho"> <p id="idesps"></p></div>
            <div class="input-filho"> <p id="irecs"></p></div>
        </div>

        <div class="input-pai">
            <div class="input-filho">
                <input type="text" id="idtquitacao" class="input-block" placeholder="Data de Quitação" />
            </div>
            <div class="input-filho">
                <div class="botao_lc" onclick="quitar()">Quitar Selecionados</div>
            </div>
        </div>    
    </div>   
</div></div>   

<div class="input-pai" id="iedititens"><div class="input-filho">
        <div id="ititulo2"> Editar Informações do Item </div>
        <div id="iedicao">
            <div class="input-pai">
                <div class="input-filho">
                    <label for="imov"><b>Tipo Movimentação:</b> 
                        <input type="text" name="mov" id="imov" data-ident = '' data-alter = '' class="input-block" readonly="readonly" style="background-color: #CCC; min-width: 180px"/>
                    </label>
                </div>
                <div class="input-filho">
                    <label for="inropedido"><b>Número do Pedido:</b> 
                        <input type="text" name="nropedido" id="inropedido" data-ant="" class="input-block" readonly="readonly" style="background-color: #CCC; min-width: 180px"/>
                    </label>
                </div>
                <div class="input-filho">
                    <label for="idtop"><b>Data da Operação:</b> 
                        <input type="text" name="dtop" id="idtop" data-ant="" class="input-block" readonly="readonly" style="background-color: #CCC;min-width: 180px"/>
                    </label>
                </div>
                <div class="input-filho">
                    <label for="inroparc"><b>Nro Parcela:</b> 
                        <input type="text" name="nroparc" id="inroparc" data-ant="" class="input-block" readonly="readonly" style="background-color: #CCC;min-width: 180px"/>
                    </label>
                </div>
            </div>
            
            <div class="input-pai">
                <div class="input-filho">
                    <label for="idtvenc"><b>Data de Vencimento:</b> 
                        <input type="text" name="dtvenc" id="idtvenc" data-ant="" class="input-block" />
                    </label>
                </div>
                <div class="input-filho">           
                    <label for="ivtot"><b>Valor Total:</b> <input type="text" name="vtot" id="ivtot" data-ant="" class="input-block"/></label>
                </div>
                <div class="input-filho">           
                    <label for="ivpago"><b>Valor Pago:</b> <input type="text" name="vpago" id="ivpago" data-ant="" class="input-block"/></label>
                </div>
            </div>
            <div class="input-pai">    
                <div class="input-filho">           
                    <label for="idesc"><b>Detalhe:</b> <input type="text" name="desc" id="idesc" data-ant="" class="input-block"/></label>
                </div>
                <div class="input-filho">           
                    <label for="ifav"><b>Favorecido:</b> <input type="text" name="fav" id="ifav" data-ant="" class="input-block"/></label>
                </div>
                <div class="input-filho">
                    <label for="iobservaux"><b>Observação:</b> <input type="text" name="observaux" id="iobservaux" data-ant="" class="input-block"/></label>
                </div>
            </div>

            <div class="input-pai">
                <div class="input-filho">           
                    <label for="isint"><b>Conta Sintética:</b>
                        <select id="isint" name="sint"  data-ant="" class="select-block">
                            <option value="" selected >Conta Sintética</option>
                        </select>
                    </label>
                </div>
                <div class="input-filho">           
                    <label for="ianal"><b>Conta Analítica:</b>
                        <select id="ianal" name="anal"  data-ant="" class="select-block">
                            <option value="" selected >Conta Analítica</option>
                        </select>
                    </label>
                </div>
                <div class="input-filho"> 
                    <label for="icc"><b>Conta Corrente:</b>
                        <select id="icc" name="cc" data-ant="" class="select-block">
                            <option value="" selected disabled>Conta Corrente</option>
                                <?php foreach ($listaContasCorrentes as $cc):?>
                                    <option value="<?php echo $cc["id"]?>" ><?php echo ucwords($cc["nome"]);?></option>
                                <?php endforeach;?>
                        </select>
                    </label>
                </div>
            </div>
            <div class="input-pai">
                <div class="input-filho">           
                    <label for="iformapgto"><b>Forma de Pagamento:</b>
                        <select id="iformapgto" name="formapgto"  data-ant="" class="select-block">
                            <option value="" selected disabled>Forma de Pagamento</option>
                            <?php foreach ($listaFormasPgto as $fp):?>
                            <option value="<?php echo $fp["id"]?>" ><?php echo utf8_encode(ucwords($fp["nome"]));?></option>
                            <?php endforeach;?>
                        </select>
                    </label>
                </div>
                <div class="input-filho"> 
                    <label for="icondpgto"><b>Condição de Pagamento:</b>
                        <select id="icondpgto" name="condpgto"  data-ant="" class="select-block">
                            <option value="" selected disabled>Condição de Pagamento</option>
                        </select>
                    </label>
                </div>  
            </div>
            <div class="input-pai">
                <div class="input-filho">
                    <div class="botao_lcAux" onclick="confirmaEdicao()"> Editar </div>
                </div>
                <div class="input-filho">
                    <div class="botao_lcAux" onclick="cancelaEdicao()"> Cancelar </div>
                </div>
            </div>
        </div>   
</div></div>   

<div >
    <table id="tabelalancamentos" class="display nowrap dataTable" cellspacing="0"  style="width: 100%" >
        <thead>
            <tr>
                <th><input type="checkbox" onchange="selecionaTodos(this)" id="iselectodos"/>  Ações</th>
                <?php for($i = 2; $i< count($listaColunas)-2; $i++):?>
                    <th><?php echo ucwords(str_replace("_", " ", $listaColunas[$i]['nomecol']))?></th>
                <?php endfor;?>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($listaLancamentosAbertos as $chave => $valor ):?>
                <tr>
                    <td>
                        <?php if(in_array("controlecaixa_edt", $infoFunc["permissoesFuncionario"])):?>
                            <input type="hidden" value="<?php echo $listaLancamentosAbertos[$chave][count($listaColunas)-2];?>"/>
                            <input type="checkbox" onchange="selecionaLinha(this)"/>
                            <div data-ident="<?php echo $valor["id"];?>" class="botao_peq_lc" onclick="editar(this)">Editar</div>
                        <?php endif;?>
                    </td>

                    <?php for($col = 2; $col < count($listaColunas)-2; $col++):?>
                        <?php if($listaColunas[$col]["tipo"] == "date"):?>
                    
                            <?php if(floatval(str_replace("-", "",$listaLancamentosAbertos[$chave][$col])) == 0):?>
                                <td></td>
                            <?php else:?>
                                <td><?php $dtaux = explode("-",$listaLancamentosAbertos[$chave][$col]); echo $dtaux[2]."/".$dtaux[1]."/".$dtaux[0];?></td>
                            <?php endif;?>    
                                
                        <?php elseif ($listaColunas[$col]["tipo"] == "float"):?>

                            <td><?php echo str_replace(".",",",$listaLancamentosAbertos[$chave][$col]);?></td>

                        <?php else:?>

                            <td><?php echo ucwords($listaLancamentosAbertos[$chave][$col]);?></td>

                        <?php endif;?>
                    <?php endfor;?>              
                </tr>
            <?php endforeach;?>
        </tbody>
    </table>
    
</div>