<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>

<script src="<?php echo BASE_URL?>/assets/js/vendor/html2canvas.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/vendor/jspdf.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/vendor/FileSaver.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/orcamentos-imp.js" type="text/javascript"></script>


<style>
    p.small {
    line-height: 1.5;
    }

    p.big {
    line-height: 1.8;
    }

    .borderless td, .borderless th {
        border: none;
    }

    .table {
    font-size: 12px;
    }

    .table tr,.table td {
    height: 10px;
    }

    .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th{
    padding:0; 
    }
    
    header, footer{
    display:none;
    }

 @media print {


    @page {
        size: A4;
        margin-top: 15mm;
        margin-bottom: 10mm;
    }

    /* body {margin-top: 15mm; margin-bottom: 10mm; 
           margin-left: 3mm; margin-right: 3mm} */

    /* html, body { height: auto; } */

    body > table:last-of-type{page-break-after:auto}

   /* .break-before { page-break-before: always; } */

    #cardOpcoes, #header, .footer, .header { display:none !important;}

    /* table { page-break-after:auto; margin-bottom:3rem }
    tr    { page-break-inside:avoid; page-break-after:auto }
    td    { page-break-inside:avoid; page-break-after:auto }
    thead { display:table-header-group }
    tfoot { display:table-footer-group } */

    /* tbody::after {
        content: ''; display: block;
        page-break-after: always;
        page-break-inside: avoid;
        page-break-before: always;        
    } */
 } 

</style>

<?php $temAlternativo = false;?>


<!-- PRIMEIRO CABEÇALHO - INFORMAÇÕES DA EMPRESA -->
<div class="card">
    <div class="card-body">
        <div class="row">

            <div class="col-4">
                <img class="card-img-left img-fluid" src="<?php echo BASE_URL?>/assets/images/IDFX.png" width = "50%" height = "auto">
            </div>

            <div class="col-8 text-left">
                <p class="h2">Identifixe</p>
                <p class="small"> AV. TERESÓPOLIS, 2547 - TERESÓPOLIS - PORTO ALEGRE - RS </p>
                <p class="small"> CNPJ: 10.639.459/0001-93 | CEP: 90.870-001 | (51) 3109 - 2500 </p>
                <p class="small"> www.identifixe.com.br | contato@identifixe.com.br</p>
            </div>
        </div>
    </div>
</div>


<!-- BOTOES DE IMPRESSAO E CHECKBOX DAS COLUNAS -->
<div class="card my-4 px-1" id="cardOpcoes">
    <div class="card-body">
        <div class="row">

            <div class="col-2">
                <button type="button" class="btn btn-sm btn-info" id="imprimirPDF"> 
                    <a onClick="window.print();">
                        Imprimir/ Salvar em PDF
                    </a>
                </button>

                <button type="button" class="btn btn-sm btn-info mt-2" id="imprimirJPG"> 
                    Salvar como imagem
                </button>
            </div>            

            <div class="col-2"> 
                <input type="checkbox" name="checkMedidas" value="medidas" checked> Medidas<br>
                <input type="checkbox" name="checkUnitario" value="unitario" checked> Preço Unitário <br>
                <input type="checkbox" name="checkAvisos" value="avisos"> Avisos <br>
            </div>

<!-- DROPDOWN COM AVISOS -->
            <div class="col-8 collapse" id="collapseAvisos">
                <div class="h4">Selecionar avisos:</div>
                <div class="relacional-dropdown-wrapper dropdown"> 
                    <input 
                    type="text" 
                    class="dropdown-toggle form-control relacional-dropdown-input" 
                    data-toggle="dropdown" 
                    autocomplete="new-password"
                    aria-haspopup="true" 
                    aria-expanded="false"
                    />
                    <label data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent" class="btn btn-sm text-secondary icon-dropdown m-0 toggle-btn dropdown-toggle">
                        <i class="fas fa-caret-down"></i>
                    </label>
                    <div class="dropdown-menu w-100 p-0 list-group-flush relacional-dropdown">
                        <div class="p-3 nenhum-result d-none">Nenhum resultado encontrado</div>
                        <div class="dropdown-menu-wrapper"></div>
                    </div>
                </div>        
            </div>
<!-- FIM DROPDOWN -->
        </div>
    </div>
</div>

<!-- SEGUNDO CABEÇALHO - INFORMAÇÕES BÁSICAS DO ORÇAMENTO -->
<div class = "card mb-5">
    <div class = "text-center">
        <div class="card-header h2">
            Ordem de Serviço
        </div>
    </div>

    <div class="card-body">
        <div class="container">
            <div class="row-sm d-flex justify-content-between">
 
                 <div class="col-3">
                    <p class="small"> <b>Descrição: </b> <?php echo $descricao; ?></p>
                    <p class="small"> <b>Cliente: </b> <?php echo $cliente; ?> </p>
                    <p class="small"> <b>CPF/CNPJ: </b> <?php echo $cpf_cnpj; ?> </p>
                    <p class="small"> <b>Email: </b> <?php echo $email; ?> </p>
                </div>

                <div class="col-3">
                    <p class="small"> <b>Endereço: </b> <?php echo $endereco; ?> </p>
                    <p class="small"> <b>Contato do Cliente: </b> <?php echo $contato; ?> </p>
                    <p class="small"> <b>Forma de Pagamento: </b> <?php echo $forma_pagamento; ?></p>
                </div>

                <div class="col-3">
                    <p class="small"> <b>Prazo de Entrega:</b> <?php echo $prazo_entrega; ?>  </p>
                    <p class="small"> <b>Vendedor: </b> <?php echo $vendedor; ?> </p> 
                    <p class="small"> <b>Técnico: </b> <?php echo $tecnico; ?> </p>     
                </div>

                <div class="col-3">
                    <p class="small"> <b>Data de Aprovação: </b> <?php echo $data_aprovacao; ?></p>
                    <p class="small"> <b>Data de Inicio: </b> <?php echo $data_inicio; ?></p>
                    <p class="small"> <b>Data de Finalização: </b> <?php echo $data_fim; ?></p>
                </div>
            </div>
        </div>
    </div>
</div>

<table class="table borderless my-3" >
<!-- CABEÇALHO DA TABELA -->
    <thead>
        <tr>
        <th scope="col"><b>Item</b></th>
        <th scope="col"><b>Quantidade</b></th>
        <th scope="col"><b>Produto/Serviço</b></th>
        <th scope="col" class="medidas"><b>Medidas</b></th>
        <th scope="col" ><b>Unidade</b></th>
        <th scope="col" class="unitario"><b>Preço Unitário</b></th>
        <th> </th>
        <th scope="col"><b>Preço Total</b></th>
        </tr>
    </thead>


    <?php for ($k=0; $k < sizeof($itens) ; $k++): ?>
        <?php $k % 2 == 0 ? $cor = "background-color:WhiteSmoke" : $cor = ""?>

        <tbody style= "<?php $cor ?>"> 
            <div class="break-after">

            <!-- TITULO DO ITEM -->
                <tr>
                    <th scope="row"> <?php echo $itens[$k]["nome"] ?></th>
                    <td> </td>
                    <td> </td>
                    <td class="medidas"> </td>
                    <td> </td>
                    <td class="unitario"> </td>
                    <td> </td>
                    <td> </td>
                </tr>

                <!-- VERIFICACAO DE MATERIAL ALTERNATIVO -->
                    <?php for ($j=0; $j < sizeof($itens[$k]["subitens"]); $j++): ?>
                    <?php $itens[$k]["subitens"][$j]["tipo_material"] ==  'alternativo' ? $cor = "color:red" : $cor = "" ?>
                    <?php $itens[$k]["subitens"][$j]["tipo_material"] ==  'alternativo' ? $temAlternativo = true : $temAlternativo = false ?> 
                    
                        <?php if(isset($itens[$k]["subitens"][$j])): ?>
                        <!-- SUBITENS E INFORMAÇÕES -->
                            <tr style="<?php echo $cor ?>">
                                <td> </td>
                                <th scope="row"><?php echo $itens[$k]["subitens"][$j]["quantidade"] ?></th>
                                <td><?php echo $itens[$k]["subitens"][$j]["produto_servico"] ?></td>
                                <td class="medidas"><?php echo $itens[$k]["subitens"][$j]["medidas"] ?></td>
                                <td><?php echo $itens[$k]["subitens"][$j]["unidade"] ?></td>
                                <td class="unitario"><?php echo $itens[$k]["subitens"][$j]["preco_unitario"] ?></td>
                                <td> </td>
                                <td><?php echo $itens[$k]["subitens"][$j]["preco_total"] ?></td>
                            </tr>
                        <?php endif ;?>
                    <?php endfor; ?>

                <tr>
                    <td> </td>
                    <td> </td>
                    <td class="medidas"> </td>
                    <td> </td>
                    <td class="unitario"> </td>
                    <td> </td>
                    <td><b>Preço: </b> </td>
                    <td> <?php echo $itens[$k]["total_principal"] ?> </td>
                </tr>

                <?php if(isset($itens[$k]["total_alternativo"]) && $itens[$k]["total_alternativo"] !=0 && $temAlternativo==true): ?>
                    <tr>
                        <td> </td>
                        <td> </td>
                        <td class="medidas"> </td>
                        <td> </td>
                        <td class="unitario"> </td>
                        <td> </td>
                        <td style="color:red"><b>Preço Alternativo: </b> </td>
                        <td style="color:red"> <?php echo $itens[$k]["total_alternativo"] ?> </td>
                    </tr>
                <?php endif ?>

            </div>
        </tbody>
    <?php endfor ?>

<!-- ESPACO ENTRE A TABELA E O FIM -->
    <tr>
        <td> </td>
        <td> </td>
        <td class="medidas"> </td>
        <td> </td>
        <td class="unitario"> </td>
        <td> </td>
        <td> </td>
    </tr>
    <tr>
        <td> </td>
        <td> </td>
        <td class="medidas"> </td>
        <td> </td>
        <td class="unitario"> </td>
        <td> </td>
        <td> </td>
    </tr>

<!-- VALOR FINAL -->
    <tr>
        <td> </td>
        <td> </td>
        <td class="medidas"> </td>
        <td> </td>
        <td class="unitario"> </td>
        <td> </td>
        <td>Deslocamento:  </td>
        <td><b> <?php echo $deslocamento ?> </b> </td>
    </tr>


    <tr>
        <td> </td>
        <td> </td>
        <td class="medidas"> </td>
        <td> </td>
        <td class="unitario"> </td>
        <td> </td>
        <td>Preço Total:  </td>
        <td><b> <?php echo $preco_total ?> </b> </td>
    </tr>

    <tr>
        <td> </td>
        <td> </td>
        <td class="medidas"> </td>
        <td> </td>
        <td class="unitario"> </td>
        <td> </td>
        <td>Desconto:  </td>
        <td><b> <?php echo $desconto ?> </b> </td>
    </tr>

    <tr>
        <td> </td>
        <td> </td>
        <td class="medidas"> </td>
        <td> </td>
        <td class="unitario"> </td>
        <td> </td>
        <td>Preço Final:  </td>
        <td><b> <?php echo $preco_final ?> </b> </td>
    </tr>
    <?php if(isset($preco_alternativo) && $preco_alternativo != 0 && $temAlternativo==true ): ?>
        <tr style="color:red">
            <td> </td>
            <td> </td>
            <td class="medidas"> </td>
            <td> </td>
            <td class="unitario"> </td>
            <td> </td>
            <td>Preço Alternativo:  </td>
            <td><b> <?php echo $preco_alternativo ?> </b> </td>
        </tr>
    <?php endif;?>

</table>

<div class="card my-2 collapse" id="cardAvisos">
    <div class="card-body">
   
        <div class="row d-flex justify-content-center">
            <div class="h4"> AVISOS </div>
        </div>

        <div class="row justify-content-between">
            <div class="col-12-sm">
                <?php foreach ($avisos as $key => $value): ?>
                    <p class = "small d-none" id="aviso<?php echo $value["id"] ?>">- <?php echo $value["mensagem"] ?></p>
                <?php endforeach;?> 
            </div>
        </div>
    </div>
</div>

<div class="card my-2" id="cardAssinaturas">
    <div class="card-body">
    <small>
        <div class="row justify-content-between">
            <div class="col-3-sm px-2">
                <p>_________________________________</p>
                <p>Assinatura do técnico responsável</p>
            </div>
            <div class="col-8-sm px-2">
                <p>_________________________________</p>
                <p>Assinatura do cliente</p>
                <p class = "small">AFIRMO QUE LI E CONCORDO COM TODO O CONTEÚDO DESTA ORDEM DE SERVIÇO E AUTORIZO A EXECUÇÃO DA MESMA. </p>
                <p class = "small">AFIRMO QUE O SERVIÇO FOI PRESTADO DE FORMA CORRETA DE ACORDO COM O CONTEÚDO AQUI ESPECIFICADO.</p>
                <p class = "small">AUTORIZO O USO DE IMAGEM DO BEM (OBJETO DO SERVIÇO) PARA DIVULGAÇÃO EM QUALQUER TIPO DE MÍDIA.</p>
                <p class = "small">CONCORDO EM REALIZAR AS REVISÕES DO SERVIÇO EM 15 DIAS E 30 DIAS APÓS A DATA DE REALIZAÇÃO DO SERVIÇO.</p>
            </div>
        </div>
    </small>
    </div>
</div>

