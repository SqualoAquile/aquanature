<?php
class servicosController extends controller{

    // Protected - estas variaveis só podem ser usadas nesse arquivo
    protected $table = "servicos";
    
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
        $dados["registros"] = $this->model->listar();
        $dados["labelTabela"] = $this->shared->labelTabela();
        $dados["colunas"] = $this->colunas;
        $dados["viewInfo"] = ["title" => "Editar"];

        $this->loadTemplate($this->table, $dados);      
    }
}   
?>