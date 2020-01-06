<?php
class fornecedoresController extends controller{

    // Protected - estas variaveis só podem ser usadas nesse arquivo
    protected $table = "fornecedores";
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
            exit;
        }
        // Verificar se está logado ou nao
        if($this->usuario->isLogged() == false){
            header("Location: " . BASE_URL . "/login"); 
            exit;
        }
    }
     
    public function index() {
        
        if(isset($_POST) && !empty($_POST)){ 
            
            $id = addslashes($_POST['id']);
            if(in_array($this->table . "_exc", $_SESSION["permissoesUsuario"]) == false || empty($id) || !isset($id)){
                header("Location: " . BASE_URL . "/" . $this->table); 
                exit;
            }
            if($this->shared->idAtivo($id) == false){
                header("Location: " . BASE_URL . "/" . $this->table); 
                exit;
            }
            $this->model->excluir($id);
            header("Location: " . BASE_URL . "/" . $this->table);
            exit;
        }
        
        $dados['infoUser'] = $_SESSION;
        $dados["colunas"] = $this->colunas;
        $dados["labelTabela"] = $this->shared->labelTabela();

        $this->loadTemplate($this->table, $dados);
    }
    
    public function adicionar() {
        
        if(in_array($this->table. "_add", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/" . $this->table); 
            exit;
        }
        
        $dados['infoUser'] = $_SESSION;
        
        if(isset($_POST) && !empty($_POST)){ 
            $this->model->adicionar($_POST);
            header("Location: " . BASE_URL . "/" . $this->table);
            exit;
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
            exit;
        }

        if($this->shared->idAtivo($id) == false){
            header("Location: " . BASE_URL . "/" . $this->table); 
            exit;
        }

        $dados['infoUser'] = $_SESSION;
        
        if(isset($_POST) && !empty($_POST)){
            $this->model->editar($id, $_POST);
            header("Location: " . BASE_URL . "/" . $this->table); 
            exit;
            
        }else{
            $dados["item"] = $this->model->infoItem($id); 
            $dados["colunas"] = $this->colunas;
            $dados["viewInfo"] = ["title" => "Editar"];
            $dados["labelTabela"] = $this->shared->labelTabela();
            $this->loadTemplate($this->table . "-form", $dados); 
        }
    }
}   
?>