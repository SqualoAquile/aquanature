<?php

// use mikehaertl\wkhtmlto\Image;

class orcamentosController extends controller{

    // Protected - estas variaveis só podem ser usadas nesse arquivo
    protected $table = "orcamentos";
    protected $colunas;
    
    protected $model;
    protected $shared;
    protected $usuario;

    public function __construct() {
        
        // Instanciando as classes usadas no controller
        $this->shared = new Shared($this->table);
        $tabela = ucfirst($this->table);
        $this->model = new $tabela();
        $this->usuario = new Usuarios();
    
        $this->colunas = $this->shared->nomeDasColunas();

        // verifica se tem permissão para ver esse módulo
        if(in_array($this->table . "_ver", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/home"); 
        }
        // Verificar se está logado ou nao
        if($this->usuario->isLogged() == false){
            header("Location: " . BASE_URL . "/login"); 
        }
    }
     
    public function index() {
        
        if(isset($_POST) && !empty($_POST)){ 
            
            $id = addslashes($_POST['id']);
            if(in_array($this->table . "_exc", $_SESSION["permissoesUsuario"]) == false || empty($id) || !isset($id)){
                header("Location: " . BASE_URL . "/" . $this->table); 
            }
            if($this->shared->idAtivo($id) == false){
                header("Location: " . BASE_URL . "/" . $this->table); 
            }
            $this->model->excluir($id);
            header("Location: " . BASE_URL . "/" . $this->table);
        }
        
        $dados['infoUser'] = $_SESSION;
        $dados["colunas"] = $this->colunas;
        $dados["labelTabela"] = $this->shared->labelTabela();

        $this->loadTemplate($this->table, $dados);
    }
    
    public function adicionar() {
        
        if(in_array($this->table. "_add", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }
        
        $dados['infoUser'] = $_SESSION;
        
        if(isset($_POST) && !empty($_POST)){ 
            $this->model->adicionar($_POST);
            header("Location: " . BASE_URL . "/" . $this->table);

        }else{ 
            $dados["colunasOrcamentos"] = $this->colunas;
            $dados["viewInfo"] = ["title" => "Adicionar"];
            $dados["labelTabela"] = $this->shared->labelTabela();

            $itm = new Shared('orcamentositens');
            $dados["colunasItensOrcamentos"] = $itm->nomeDasColunas();
            
            $this->loadTemplate($this->table . "-form", $dados);
        }
    }
    
    public function editar($id) {

        if(in_array($this->table . "_edt", $_SESSION["permissoesUsuario"]) == false || empty($id) || !isset($id)){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }

        if($this->shared->idAtivo($id) == false){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }

        $dados['infoUser'] = $_SESSION;
        
        if(isset($_POST) && !empty($_POST)){

            $this->model->editar($id, $_POST);
            header("Location: " . BASE_URL . "/" . $this->table); 
        }else{

            $item = new Shared('orcamentositens');
            
            $dados["item"] = $this->model->infoItem($id); 
            $dados["viewInfo"] = ["title" => "Editar"];
            $dados["labelTabela"] = $this->shared->labelTabela();
            $dados["colunasOrcamentos"] = $this->colunas;
            $dados["colunasItensOrcamentos"] = $item->nomeDasColunas();

            $this->loadTemplate($this->table . "-form", $dados); 
        }
    }

    public function imprimir($id) {

        $request = $_POST;

        $infos['infoUser'] = $_SESSION;

        $request["tabela"] = "avisos";
        $avisosDb = $this->model->getRelacionalDropdown($request);

        $avisos = [];

        if (isset($request["avisos"])) {
            foreach ($request["avisos"] as $keyAvisos => $valueAvisos) {
                if ($avisosDb) {
                    foreach ($avisosDb as $keyAvisosDb => $valueAvisosDb) {
                        if ($valueAvisosDb["id"] == $valueAvisos) {
                            $avisos[$valueAvisosDb["id"]] = $valueAvisosDb["mensagem"];
                        }
                    }
                }
            }
        }

        $informacoes = $this->model->infosOrcamento($id);
        $infos["cliente"] = $informacoes[0]['nome_cliente'];
        $infos["tecnico"] = $informacoes[0]['funcionario'];
        $infos["descricao"] = $informacoes[0]['titulo_orcamento'];
        $infos["observacao"] = $informacoes[0]['observacao'];
        $infos["prazo_entrega"] = $informacoes[0]['prazo_entrega'];
        $infos["forma_pagamento"] = $informacoes[0]['forma_pgto_descricao'];
        $dataAux1 = explode("-",$informacoes[0]['data_emissao']);
        $infos["data_emissao"] = $dataAux1[2]."/".$dataAux1[1]. "/".$dataAux1[0];
        $dataAux2 = explode("-",$informacoes[0]['data_validade']);
        $infos["data_validade"] = $dataAux2[2]."/".$dataAux2[1]. "/".$dataAux2[0];

        $infos["preco_total"] = number_format($informacoes[0]['sub_total'],2,",",".");
        $desconto = $informacoes[0]['desconto'];
        $infos["desconto"] =  number_format($informacoes[0]['desconto'],2,",",".");
        $infos["preco_final"] = number_format($informacoes[0]['valor_total'],2,",",".");

        $itens = $this->model->itensOrcamento($id);
        $qtdItens = $this->model->qtdItensOrcamento($id);
        $precoItens = $this->model->precosItens($id);
        $custoDeslocamento = $this->model->custoDeslocamento();
        $custoDeslocamento = floatval(2) * floatval(str_replace(",",".",$custoDeslocamento));

        $infos["deslocamento"] = floatval($custoDeslocamento) * floatval($informacoes[0]['deslocamento_km']);

        $k=0;
        $j=0;
        
        for ($i=0; $i < sizeof($itens) ; $i++) {

            if ($i>0 && ($itens[$i]['descricao_item'] != $itens[$i-1]['descricao_item'] || 
                        $itens[$i]['descricao_subitem'] != $itens[$i-1]['descricao_subitem'])) {

                $infos["itens"][$k]["nome"] = addslashes($itens[$i]['descricao_item']) . " - " . addslashes($itens[$i]['descricao_subitem']);
                $k++;
                $j=0;
            } else if ($i==0){
                $infos["itens"][$k]["nome"] = addslashes($itens[$i]['descricao_item']) . " - " . addslashes($itens[$i]['descricao_subitem']);
                $k++;
            }
            
            $infos["itens"][$k-1]["subitens"][$j]["produto_servico"] = ucfirst(str_replace("_"," ",$itens[$i]['material_servico']));
            $infos["itens"][$k-1]["subitens"][$j]["tipo_material"] = $itens[$i]['tipo_material'];
            $infos["itens"][$k-1]["subitens"][$j]["quantidade"] = intval($itens[$i]['quant']);
            if ($itens[$i]['largura']!=0 && $itens[$i]['comprimento']!=0  ) {
                $infos["itens"][$k-1]["subitens"][$j]["medidas"] = "L: ".str_replace(".",",",$itens[$i]['largura']). " x C: ".str_replace(".",",",$itens[$i]['comprimento']);
            }else{
                $infos["itens"][$k-1]["subitens"][$j]["medidas"] ='';
            }
            $infos["itens"][$k-1]["subitens"][$j]["unidade"] = $itens[$i]['unidade'];
            // if (empty($itens[$i]['quant_usada'])) {
            //     $infos["itens"][$k-1]["subitens"][$j]["preco_unitario"] = floatval($itens[$i]['preco_tot_subitem']) / floatval($itens[$i]['quant']);
            // }else{
            //     $infos["itens"][$k-1]["subitens"][$j]["preco_unitario"] = floatval($itens[$i]['preco_tot_subitem']) / floatval(floatval($itens[$i]['quant'])*floatval($itens[$i]['quant_usada']));
            // }
            $infos["itens"][$k-1]["subitens"][$j]["preco_total"] =  $itens[$i]['preco_tot_subitem'];

            $j++;
        }
        
        $totalAlternativo = 0;
        $totalPrincipal = 0;
        for ($p=0; $p < $k ; $p++) {
            $precoPrincipal = 0;
            $precoAlternativo = 0;
            for ($j=0; $j < sizeof($infos["itens"][$p]["subitens"]) ; $j++) {

                $precoTotal = $infos["itens"][$p]["subitens"][$j]["preco_total"];

                if ($infos["itens"][$p]["subitens"][$j]["tipo_material"]=='') {
                    $precoPrincipal += $precoTotal;
                    $precoAlternativo += $precoTotal;
                }else if ($infos["itens"][$p]["subitens"][$j]["tipo_material"]=='principal'){

                    // Verificar se existe algum item que tem APENAS um material principal
                    $temApenasPrincipal = true;
                    for ($j2=0; $j2 < sizeof($infos["itens"][$p]["subitens"]) ; $j2++) {
                        if ($infos["itens"][$p]["subitens"][$j2]["tipo_material"]=='alternativo') {
                            $temApenasPrincipal = false;
                        }
                    }
                    
                    if ($temApenasPrincipal==true) {
                        $precoPrincipal += $precoTotal;
                        $precoAlternativo += $precoTotal;
                    }else{
                        $precoPrincipal += $precoTotal;
                    }

                }else if ($infos["itens"][$p]["subitens"][$j]["tipo_material"]=='alternativo'){
                    $precoAlternativo += $precoTotal;
                }
            }
            
            $infos["itens"][$p]["total_principal"] = $precoPrincipal;
            $infos["itens"][$p]["total_alternativo"] = $precoAlternativo;
            $totalAlternativo += $precoAlternativo;
            $totalPrincipal += $precoPrincipal;
        }

        $infos["preco_total"] = $totalPrincipal;
        $infos["preco_total"] += floatval($custoDeslocamento) * floatval($informacoes[0]['deslocamento_km']);
        $infos["preco_final"] = floatval($infos["preco_total"]) - floatval($desconto);
        $infos["preco_final"] = number_format($infos["preco_final"],2,",",".");
        $infos["preco_total"] = number_format($infos["preco_total"],2,",","."); 

        $infos["preco_alternativo"] = $totalAlternativo;
        $infos["preco_alternativo"] += floatval($custoDeslocamento) * floatval($informacoes[0]['deslocamento_km']);
        $infos["preco_alternativo"] = number_format($infos["preco_alternativo"],2,",","."); 

        // FORMATAÇÃO
        for ($p=0; $p < $k ; $p++) {
            $infos["itens"][$p]["total_principal"] = number_format($infos["itens"][$p]["total_principal"],2,",",".");
            $infos["itens"][$p]["total_alternativo"] = number_format($infos["itens"][$p]["total_alternativo"],2,",",".");
            $infos["deslocamento"] = floatval($infos["deslocamento"]);
            $infos["deslocamento"] = number_format($infos["deslocamento"],2,",",".");

            for ($j=0; $j < sizeof($infos["itens"][$p]["subitens"]) ; $j++) {
                // $precoUnitFormat = $infos["itens"][$p]["subitens"][$j]["preco_unitario"];
                $precoTotalFormat =  $infos["itens"][$p]["subitens"][$j]["preco_total"];
                
                // $infos["itens"][$p]["subitens"][$j]["preco_unitario"] = number_format($precoUnitFormat,2,",",".");
                $infos["itens"][$p]["subitens"][$j]["preco_total"] = number_format($precoTotalFormat,2,",",".");
            }
        }

        $mostraMedidas = isset($request["checkMedidas"]) ? true : false;
        $mostraPrecos = isset($request["checkUnitario"]) ? true : false;
        $mostraAvisos = isset($request["checkAvisos"]) ? true : false;
        
        require_once __DIR__ . '/../vendor/vendor/autoload.php';
        
        //$mpdf=new Mpdf\Mpdf(); 
        $mpdf = new \Mpdf\Mpdf([
            'default_font' => 'arial',
            'mode' => 'c',
            'margin_left' => 10,
            'margin_right' => 10,
            'margin_top' => 40,
            'margin_bottom' => 10,
            'margin_header' => 10,
            'margin_footer' => 10,
            'setAutoTopMargin' => 'false'
        ]);

        $mpdf->SetDisplayMode('fullpage');
        $mpdf->SetTitle("Orçamento - " . $infos['descricao']);

        $htmlHeader = '
        <table width="800" style="border:1px solid #000000; font-size:10pt;" cellPadding="9"><thead></thead>
            <tbody>
                <tr>
                    <td align="center">
                        <img class="card-img-center img-fluid" src="' . __DIR__ . '/../assets/images/IDFX.png" width = "50%" height = "auto">
                        <p class="small"> AV. TERESÓPOLIS, 2547 - TERESÓPOLIS - PORTO ALEGRE - RS </p>
                        <p class="small"> CNPJ: 10.639.459/0001-93 | CEP: 90.870-001 | (51) 3109 - 2500 </p>
                        <p class="small"> www.identifixe.com.br | contato@identifixe.com.br</p>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        ';

        $mpdf->SetHTMLHeader($htmlHeader);
        $mpdf->SetFooter('Página {PAGENO} de {nb}');

        $html ='
        <table width="800" style="border:1px solid #000000;" cellPadding="9"><thead></thead>
            <tbody>
                <tr>

                    <td align="center">
                        <h2>ORÇAMENTO</h2>
                    </td>
                </tr>
            </tbody>
        </table>
        <br></br>
        ';


        // CABEÇALHO - INFORMAÇÕES BÁSICAS DO ORÇAMENTO --------------------------------------------------------
        $html .= '
            
        <table width="800" style="border:1px solid #000000; font-size:9pt" cellPadding="9"><thead></thead>
            <tbody>
                <tr>
                    <td>
                        <p> <b>Data de Emissão: </b> '.$infos['data_emissao'].'</p>
                        <p> <b>Data de Validade:</b> '.$infos['data_validade'].'</p>
                    </td>

                    <td>
                        <p> <b>Cliente: </b>'.$infos['cliente'].' </p>
                        <p> <b>Título: </b> '.$infos['descricao'].'  </p>
                        <p> <b>Contato vendedor: </b> '.$infos['tecnico'].' </p>
                    </td>

                    <td>
                        <p class="small"> <b>Prazo de Entrega: </b> '.$infos['prazo_entrega'].' </p>
                        <p class="small"> <b>Forma de Pagamento: </b> '.$infos['forma_pagamento'].'  </p>
                    </td>   

                </tr>
            </tbody>
        </table>
        <br></br>
        ';


        // CABEÇALHO DA TABELA DE ITENS --------------------------------------------------------
        $html .='
        <table style="border:1px solid #000000; line-height:10%; font-size:9pt; padding-top:10px; padding-bottom:10px" width="800" cellPadding="8">
            <thead>
                <tr>
                    <th scope="col"><b>Item</b></th>
                    <th scope="col"><b>Quantidade</b></th>
                    <th scope="col" align="right"><b>Produto/Serviço</b></th>
                    <th scope="col" align="right" ><b>Unidade</b></th>
                    ';

                    if ($mostraMedidas==true) {
                        $html.='<th scope="col" align="right"><b>Medidas</b></th>';
                    }

                    if ($mostraPrecos==true) {
                        $html.='
                            <th scope="col" class="preco" align="right"><b>Preço Total</b> </th>
                            ';
                    }

                    $html.='
                    
                </tr>
            </thead>

        ';

        //INICIO DA LISTA DE ITENS E SUBITENS
        $htmlRows = '
        <tbody>
        ';

        for ($k=0; $k < sizeof($infos["itens"]) ; $k++){

            //NOME DO ITEM
            
            $htmlRows .='
            <tr>
                <td colspan="4"><b>'.$infos["itens"][$k]["nome"].' </b></td>
                <td></td>
                <td></td>
                <td></td>
                ';
                if ($mostraMedidas==true) { $htmlRows.='<td></td>';}
                if ($mostraPrecos==true) { $htmlRows.='<td></td> <td></td>';}
            $htmlRows.='
            </tr>
            ';
        
            // LOOP PARA DESCREVER OS SUBITENS ASSOCIADOS (ex.: material, corte, aplicação, etc)
            for ($j=0; $j < sizeof($infos["itens"][$k]["subitens"]); $j++){

                $tipo_material = $infos["itens"][$k]["subitens"][$j]["tipo_material"];

                if ($tipo_material=='alternativo') {
                    $infos["itens"][$k]["tem_alternativo"] = true;
                    $temAlternativoGlobal = true; 
                    $cor = 'style="color:red"';
                }else{
                    $cor = '';
                }

                $htmlRows .='
                    <tr>
                        <td></td>                
                        <td height="10px" align="center" '.$cor.'>'. $infos["itens"][$k]["subitens"][$j]["quantidade"].'</td>
                        <td height="10px" align="right" '.$cor.'> '.$infos["itens"][$k]["subitens"][$j]["produto_servico"].'</td>
                        <td height="10px" align="right" '.$cor.'>'. $infos["itens"][$k]["subitens"][$j]["unidade"].'</td>
                        ';

                    if ($mostraMedidas==true) {
                        $htmlRows.='<td height="10px" align="right" '.$cor.'>'.$infos["itens"][$k]["subitens"][$j]["medidas"].' </td>';
                    }

                    if ($mostraPrecos==true) {
                        $htmlRows.='
                            <td height="10px" align="right" '.$cor.'> R$ '.$infos["itens"][$k]["subitens"][$j]["preco_total"].'</td>
                        ';
                    }

                    $htmlRows.='
                    </tr>
                ';
            };

            //VALOR ALTERNATIVO E PRINCIPAL DO SUBITEM
            
            if(isset($infos["itens"][$k]["total_alternativo"]) && $infos["itens"][$k]["total_alternativo"] !=0 && (isset($infos["itens"][$k]["tem_alternativo"]) && $infos["itens"][$k]["tem_alternativo"]==true)){
                $htmlRows .='
                <tr>
                    <td> </td>
                    <td> </td>
 
                    ';
                    if ($mostraMedidas==true) { $htmlRows.='<td></td>';}   
                    if ($mostraPrecos==true) { $htmlRows.='<td></td>';}  
                $htmlRows.='
                    <td style="color:red" align="right"><b>Preço Alternativo: </b> </td>
                    <td style="color:red" align="right">R$ '.$infos["itens"][$k]["total_alternativo"].'</td>
                </tr>
                ';
            }

            $htmlRows .='
            <tr style="border-bottom-style:thin solid;">
                <td> </td>
                <td> </td>

                ';
                if ($mostraMedidas==true) { $htmlRows.='<td></td>';}     
                if ($mostraPrecos==true) { $htmlRows.='<td></td>';}
            $htmlRows.='
                <td align="right"><b>Preço Principal: </b> </td>
                <td align="right">R$ '.$infos["itens"][$k]["total_principal"].'</td>
            </tr>
            
            ';
            
        };

        $html .= $htmlRows;
        $html .= '
            </tbody>
        </table>
        <br></br>
        ';

        // BLOCO COM INFORMAÇÕES GERAIS

        $html .='
        <table style="border:1px solid #000000; font-size:9pt; padding-top:5px; padding-bottom:5px; line-height:10%" width="800" cellPadding="5">
            <tr>
                <td></td>
                <td></td>
                <td align="right"><b>Deslocamento:  </b></td>
                <td align="left"><b>R$ '.$infos["deslocamento"].'</b> </td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td></td>
                <td></td>
                <td align="right"><b>Preço Total: </b> </td>
                <td align="left"><b>R$ '.$infos["preco_total"] .' </b> </td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td></td>
                <td></td>
                <td align="right"><b>Desconto:  </b></td>
                <td align="left"><b>R$ '.$infos["desconto"].'</b></td>
                <td></td>
                <td></td>
            </tr>';

            if((isset($infos["preco_alternativo"]) && $infos["preco_alternativo"] != 0) && (isset($temAlternativoGlobal) && $temAlternativoGlobal==true)){

                $html.='
                <tr>
                    <td></td>
                    <td></td>
                    <td style="color:red" align="right"><b>Preço Alternativo:  </b></td>
                    <td style="color:red" align="left"><b>R$ '.$infos["preco_alternativo"].' </b> </td>
                    <td></td>
                    <td></td>
                 </tr>
                ';
            }
            
            $html.='
            <tr>
                <td></td>
                <td></td>
                <td align="right"><b>Preço Final:  </b></td>
                <td align="left"><b>R$ '.$infos["preco_final"].' </b> </td>
                <td></td>
                <td></td>
            </tr>
            </table>
            <br></br>
                ';

            // BLOCO COM OBSERVAÇÕES - VEM DO ORÇAMENTO

            if (isset($infos['observacao']) && !empty($infos['observacao']))  {
                $html.='
                <table style="border:1px solid #000000; line-height:100%; font-size:10pt" width="800" cellPadding="9">
                    <thead>
                        <tr>
                            <td align="center">
                                <h4>OBSERVAÇÕES</h4>
                            </td>
                        </tr>
                    </thead>    
            
                    <tr>
                        <td>
                            <p> '.$infos['observacao'].' <p> 
                        </td>
                    </tr>
                </table>
                <br></br>
            ';
            }

        // BLOCO COM AVISOS

        if ($mostraAvisos==true && !empty($avisos)) {
            $html .='
            <table style="border:1px solid #000000; line-height:120%; font-size:10pt" width="800" cellPadding="9">
                <thead>
                    <tr>
                        <td align="center">
                            <h3>AVISOS</h3>
                        </td>
                    </tr>
                </thead>
                
                <tbody>
                    <tr>
                        <td>';

                        foreach ($avisos as $key => $value) {
                            $html.='
                                <p id='.$key.'> - '. $value.'</p>
                            ';
                        }

            $html.='
                        </td>
                    </tr>
                </tbody>
            </table>
            <br></br>
            ';

        }

        // BLOCO COM NOTIFICAÇÕES

        // $html.='

        // <table style="border:1px solid #000000; line-height:120%; font-size:9pt" width="800" cellPadding="9">
        //     <tr>
        //         <td>
        //             <p class = "small">Obs.: Os itens em vermelho são feitos com material alternativo.</p>
        //             <p class = "small">* O desconto é referente aos itens descritos em preto.</p>
        //             <p class = "small">* Este trabalho tem 1 ano de garantia de aplicação.</p>
        //             <p class = "small">* O pagamento pode ser feito em até 6x sem juros no cartão</p>
        //             <p class = "small">* Este orçamento tem validade de 15 dias, a partir da sua data de emissão</p>
        //         </td>
        //         <td>
        //             <p class = "small">* Material importado tradicional, tem 5 anos de garantia de durabilidade.</p>
        //             <p class = "small">* Material nacional, tem 2 anos de garantia de durabilidade (externo)</p>
        //             <p class = "small">* Para confirmar o agendamento, solicitamos uma entrada de 30% do preço final do trabalho</p>
        //             <p class = "small">* Não aceitamos pagamentos com cheque</p>
        //         </td>
        //     </tr>
        // </table>

        // ';

        $mpdf->WriteHTML($html);
        $mpdf->Output('Orcamento.pdf','I');

    
    }
}   
            
?>


