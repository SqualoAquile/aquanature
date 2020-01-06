<?php
ob_start();
if (!headers_sent()) {
foreach (headers_list() as $header)
header_remove($header);
}


require_once $_SERVER['DOCUMENT_ROOT']. '/generico/vendor/tcpdf.php';

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('UseLeme');
$pdf->SetTitle('TCPDF Example 048');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 048', PDF_HEADER_STRING);
// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// ---------------------------------------------------------
// set font
$pdf->SetFont('helvetica', 'B', 20);
// add a page
$pdf->AddPage();
$pdf->Write(0, 'Example of HTML tables', '', 0, 'L', true, 0, false, false, 0);
$pdf->SetFont('helvetica', '', 8);


$html = '
<html>
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
                        <!-- <a onClick="window.print();"> -->
                            Imprimir/ Salvar em PDF
                        <!-- </a> -->
                    </button>

                    <button type="button" class="btn btn-sm btn-info mt-2" id="imprimirJPG"> 
                        Salvar como imagem
                    </button>
                </div>            

                <div class="col-2"> 
                    <input type="checkbox" name="checkMedidas" value="medidas" checked> Medidas<br>
                    <input type="checkbox" name="checkPrecos" value="preco" checked> Preço Unitário <br>
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
                Orçamento
            </div>
        </div>

        <div class="card-body">
            <div class="container">
                <div class="col-sm d-flex justify-content-between">
                    <div class="row-sm">
                        <p class="small"> <b>Data de Emissão: </b> <?php echo $data_emissao; ?></p>
                        <p class="small"> <b>Data de Validade:</b> <?php echo $data_validade; ?>  </p>      
                    </div>

                    <div class="row-sm">
                        <p class="small"> <b>Cliente: </b> <?php echo $cliente; ?> </p>
                        <p class="small"> <b>Descrição: </b> <?php echo $descricao; ?>  </p>
                        <p class="small"> <b>Contato vendedor: </b> <?php echo $tecnico; ?> </p>
                    </div>

                    <div class="row-sm">
                        <p class="small"> <b>Prazo de Entrega: </b> <?php echo $prazo_entrega; ?> </p>
                        <p class="small"> <b>Forma de Pagamento: </b> <?php echo $forma_pagamento; ?>  </p>
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
            <th scope="col" class="preco"><b>Preço Unitário</b></th>
            <th scope="col" class="preco"><b>Preço Total</b> </th>
            <th> </th>
            <th> </th>
            <th> </th>
            <th> </th>
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
                        <td class="preco"> </td>
                        <td class="preco"> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>

                    <!-- VERIFICACAO DE MATERIAL ALTERNATIVO -->
                        <?php for ($j=0; $j < sizeof($itens[$k]["subitens"]); $j++): ?>
                        <?php $itens[$k]["subitens"][$j]["tipo_material"] ==  "alternativo" ? $cor = "color:red" : $cor = "" ?>
                        <?php $itens[$k]["subitens"][$j]["tipo_material"] ==  "alternativo" ? $temAlternativo = true : $temAlternativo = false ?> 
                        
                            <?php if(isset($itens[$k]["subitens"][$j])): ?>
                            <!-- SUBITENS E INFORMAÇÕES -->
                                <tr style="<?php echo $cor ?>">
                                    <td> </td>
                                    <th scope="row"><?php echo $itens[$k]["subitens"][$j]["quantidade"] ?></th>
                                    <td><?php echo $itens[$k]["subitens"][$j]["produto_servico"] ?></td>
                                    <td class="medidas"><?php echo $itens[$k]["subitens"][$j]["medidas"] ?></td>
                                    <td><?php echo $itens[$k]["subitens"][$j]["unidade"] ?></td>
                                    <td class="preco"><?php echo $itens[$k]["subitens"][$j]["preco_unitario"] ?></td>
                                    <td class="preco"><?php echo $itens[$k]["subitens"][$j]["preco_total"] ?></td>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                </tr>
                            <?php endif ;?>
                        <?php endfor; ?>

                    <tr>
                        <td> </td>
                        <td> </td>
                        <td class="medidas"> </td>
                        <td> </td>
                        <td class="preco"> </td>
                        <td class="preco"> </td>
                        <td> </td>
                        <td><b>Preço Principal: </b> </td>
                        <td> <?php echo $itens[$k]["total_principal"] ?> </td>
                    </tr>

                    <?php if(isset($itens[$k]["total_alternativo"]) && $itens[$k]["total_alternativo"] !=0 && $temAlternativo==true): ?>
                        <tr>
                            <td> </td>
                            <td> </td>
                            <td class="medidas"> </td>
                            <td> </td>
                            <td class="preco"> </td>
                            <td class="preco"> </td>
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
            <td class="preco"> </td>
            <td class="preco"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        </tr>
        <tr>
            <td> </td>
            <td> </td>
            <td class="medidas"> </td>
            <td> </td>
            <td class="preco"> </td>
            <td class="preco"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        </tr>

    <!-- VALOR FINAL -->
        <tr>
            <td> </td>
            <td> </td>
            <td class="medidas"> </td>
            <td> </td>
            <td class="preco"> </td>
            <td class="preco"> </td>
            <td> </td>
            <td>Deslocamento:  </td>
            <td><b> <?php echo $deslocamento ?> </b> </td>
        </tr>


        <tr>
            <td> </td>
            <td> </td>
            <td class="medidas"> </td>
            <td> </td>
            <td class="preco"> </td>
            <td class="preco"> </td>
            <td> </td>
            <td>Preço Total:  </td>
            <td><b> <?php echo $preco_total ?> </b> </td>
        </tr>

        <tr>
            <td> </td>
            <td> </td>
            <td class="medidas"> </td>
            <td> </td>
            <td class="preco"> </td>
            <td class="preco"> </td>
            <td> </td>
            <td>Desconto:  </td>
            <td><b> <?php echo $desconto ?> </b> </td>
        </tr>

        <tr>
            <td> </td>
            <td> </td>
            <td class="medidas"> </td>
            <td> </td>
            <td class="preco"> </td>
            <td class="preco"> </td>
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
                <td class="preco"> </td>
                <td class="preco"> </td>
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

    <div class="card my-2" id="cardObservacoes">
        <div class="card-body">
        <small>
            <div class="row justify-content-between">
                <div class="col-6-sm">
                <p class = "small">OBS. OS ITENS EM VERMELHO SÃO FEITOS COM MATERIAL ALTERNATIVO.</p>
                <p class = "small">O DESCONTO É REFERENTE AOS ITENS DESCRITOS EM PRETO.</p>
                <p class = "small">* ESTE TRABALHO TEM 1 ANO DE GARANTIA DE APLICAÇÃO.</p>
                <p class = "small">* O PAGAMENTO P ODE SER FEITO EM ATÉ 6X SEM JUROS NO CARTÃO</p>
                <p class = "small">* ESTE ORÇAMENTO TEM VALIDADE DE 15 DIAS, A PARTIR DA SUA DATA DE EMISSÃO</p>
                </div>
                <div class="col-6-sm">
                <p class = "small">* MATERIAL IMPORTADO TRADICIONAL, TEM 5 ANOS DE GARANTIA DE DURABILIDADE.</p>
                <p class = "small">* MATERIAL NACIONAL, TEM 2 ANOS DE GARANTIA DE DURABILIDADE (EXTERNO)</p>
                <p class = "small">* PARA CONFIRMAR O AGENDAMENTO, SOLICITAMOS UMA ENTRADA DE 30% DO PREÇO FINAL DO TRABALHO.</p>
                <p class = "small">* NÃO ACEITAMOS PAGAMENTOS COM CHEQUE.</p>
                </div>
            </div>
        </small>
        </div>
    </div>

</html>';

//arranjar outro jeito de direcionar o require
ob_end_clean();
$pdf->writeHTML($html, true, false, false, false, '');
$pdf->Output('C:/Users/Dell/Downloads/example_048.pdf', 'FI');
?>