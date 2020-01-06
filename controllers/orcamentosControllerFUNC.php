<?php
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

        $infos['infoUser'] = $_SESSION;

        $request["tabela"] = "avisos";
        $avisos = $this->model->getRelacionalDropdown($request);
        $infos["avisos"] = $avisos;

        $informacoes = $this->model->infosOrcamento($id);
        $infos["cliente"] = $informacoes[0]['nome_cliente'];
        $infos["tecnico"] = $informacoes[0]['funcionario'];
        $infos["descricao"] = $informacoes[0]['titulo_orcamento'];
        $infos["prazo_entrega"] = $informacoes[0]['prazo_entrega'];
        $infos["forma_pagamento"] = $informacoes[0]['forma_pgto_descricao'];
        $dataAux1 = explode("-",$informacoes[0]['data_emissao']);
        $infos["data_emissao"] = $dataAux1[2]."/".$dataAux1[1]. "/".$dataAux1[0];
        $dataAux2 = explode("-",$informacoes[0]['data_validade']);
        $infos["data_validade"] = $dataAux2[2]."/".$dataAux2[1]. "/".$dataAux2[0];

        $infos["preco_total"] = number_format($informacoes[0]['sub_total'],2,",",".");
        $infos["desconto"] =  number_format($informacoes[0]['desconto'],2,",",".");
        $infos["preco_final"] = number_format($informacoes[0]['valor_total'],2,",",".");

        $infos["deslocamento"] = $informacoes[0]['deslocamento_km']. " km";

        $itens = $this->model->itensOrcamento($id);
        $qtdItens = $this->model->qtdItensOrcamento($id);
        $precoItens = $this->model->precosItens($id);

        $k=0;
        $j=0;
        
        for ($i=0; $i < sizeof($itens) ; $i++) {

            if ($i>0 && ($itens[$i]['descricao_item'] != $itens[$i-1]['descricao_item'] || 
                        $itens[$i]['descricao_subitem'] != $itens[$i-1]['descricao_subitem'])) {

                $infos["itens"][$k]["nome"] = $itens[$i]['descricao_item'] . " - " . $itens[$i]['descricao_subitem'];
                $k++;
                $j=0;
            } else if ($i==0){
                $infos["itens"][$k]["nome"] = $itens[$i]['descricao_item'] . " - " . $itens[$i]['descricao_subitem'];
                $k++;
            }
            
            $infos["itens"][$k-1]["subitens"][$j]["produto_servico"] = ucfirst(str_replace("_"," ",$itens[$i]['material_servico']));
            $infos["itens"][$k-1]["subitens"][$j]["tipo_material"] = $itens[$i]['tipo_material'];
            $infos["itens"][$k-1]["subitens"][$j]["quantidade"] = $itens[$i]['quant'];
            $infos["itens"][$k-1]["subitens"][$j]["medidas"] = "L: ".$itens[$i]['largura']. " x C: ".$itens[$i]['comprimento'];
            $infos["itens"][$k-1]["subitens"][$j]["unidade"] = $itens[$i]['unidade'];
            $infos["itens"][$k-1]["subitens"][$j]["preco_unitario"] = floatval($itens[$i]['preco_tot_subitem']) / floatval(floatval($itens[$i]['quant'])*floatval($itens[$i]['quant_usada']));
            $infos["itens"][$k-1]["subitens"][$j]["preco_total"] =  $itens[$i]['preco_tot_subitem'];

            $j++;
        }
        
        $totalAlternativo = 0;
        for ($p=0; $p < $k ; $p++) {
            $precoPrincipal = 0;
            $precoAlternativo = 0;
            for ($j=0; $j < sizeof($infos["itens"][$p]["subitens"]) ; $j++) {

                $precoTotal = $infos["itens"][$p]["subitens"][$j]["preco_total"];

                if ( $infos["itens"][$p]["subitens"][$j]["tipo_material"]=='') {
                    $precoPrincipal += $precoTotal;
                    $precoAlternativo += $precoTotal;
                }else if ($infos["itens"][$p]["subitens"][$j]["tipo_material"]=='principal'){
                    $precoPrincipal += $precoTotal;
                }else if ($infos["itens"][$p]["subitens"][$j]["tipo_material"]=='alternativo'){
                    $precoAlternativo += $precoTotal;
                }
            }
            
            $infos["itens"][$p]["total_principal"] = $precoPrincipal;
            $infos["itens"][$p]["total_alternativo"] = $precoAlternativo;
            $totalAlternativo += $precoAlternativo;
        }

        $infos["preco_alternativo"] = number_format($totalAlternativo,2,",","."); 

        // FORMATAÇÃO
        for ($p=0; $p < $k ; $p++) {
            $infos["itens"][$p]["total_principal"] = number_format($infos["itens"][$p]["total_principal"],2,",",".");
            $infos["itens"][$p]["total_alternativo"] = number_format($infos["itens"][$p]["total_alternativo"],2,",",".");

            for ($j=0; $j < sizeof($infos["itens"][$p]["subitens"]) ; $j++) {
                $precoUnitFormat = $infos["itens"][$p]["subitens"][$j]["preco_unitario"];
                $precoTotalFormat =  $infos["itens"][$p]["subitens"][$j]["preco_total"];
                
                $infos["itens"][$p]["subitens"][$j]["preco_unitario"] = number_format($precoUnitFormat,2,",",".");
                $infos["itens"][$p]["subitens"][$j]["preco_total"] = number_format($precoTotalFormat,2,",",".");
            }
        }
    
        $this->loadTemplate($this->table . "-imp",$infos); 
    }
}   
            
?>


