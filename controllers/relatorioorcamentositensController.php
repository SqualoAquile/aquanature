<?php
class relatorioorcamentositensController extends controller{

    // Protected - estas variaveis só podem ser usadas nesse arquivo
    protected $table = "orcamentositens";
    protected $nome = "relatorioorcamentositens";
    protected $colunas;
    
    protected $model;
    protected $shared;
    protected $usuario;

    public function __construct() {
        
        // Instanciando as classes usadas no controller
        $this->shared = new Shared($this->table);
        $tabela = ucfirst($this->table);
        $this->model = new Relatorioorcamentositens();
        $this->usuario = new Usuarios();
        
        $this->colunas = $this->shared->nomeDasColunas();

        // verifica se tem permissão para ver esse módulo
        if(in_array("relatorioorcamentositens_ver", $_SESSION["permissoesUsuario"]) == false){
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
            if(in_array("relatorioorcamentositens_exc", $_SESSION["permissoesUsuario"]) == false || empty($id) || !isset($id)){
                header("Location: " . BASE_URL . "/relatorioorcamentositens"); 
            }
            if($this->shared->idAtivo($id) == false){
                header("Location: " . BASE_URL . "/relatorioorcamentositens"); 
            }
            $this->model->excluir($id);
            header("Location: " . BASE_URL . "/relatorioorcamentositens");
        }
        
        $dados['infoUser'] = $_SESSION;
        $dados["colunas"] = $this->colunas;
        $dados["labelTabela"]["labelBrowser"] = 'Relatório de Produtos e Serviços';

        $this->loadTemplate("relatorioorcamentositens", $dados);
    }
    
    public function adicionar() {
        
        if(in_array("relatorioorcamentositens_add", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/".$nome); 
        }
    
        $dados['infoUser'] = $_SESSION;

        if(isset($_POST) && !empty($_POST)){  
            $this->model->adicionar($_POST);
            header("Location: " . BASE_URL . "/" . $this->table ."/adicionar");
        }else{ 
            $dados["colunas"] = $this->colunas;
            $dados["viewInfo"] = ["title" => "Adicionar"];
            $dados["labelTabela"] = $this->shared->labelTabela();
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
            $dados["item"] = $this->model->infoItem($id); 
            $dados["colunas"] = $this->colunas;
            $dados["viewInfo"] = ["title" => "Editar"];
            $dados["labelTabela"] = $this->shared->labelTabela();
            $this->loadTemplate($this->table . "-form", $dados); 
        }
    }

    public function inlineEdit () {

        if(isset($_POST) && !empty($_POST)){
            echo json_encode($this->model->inlineEdit($_POST));
        }
    }
    

}   
?>