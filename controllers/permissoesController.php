<?php
class permissoesController extends controller{

    protected $table = "permissoes";
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
            
            $this->model->excluirGrupo($id);
            header("Location: " . BASE_URL . "/" . $this->table);

        } else {

            $dados['infoUser'] = $_SESSION;
            $dados["colunas"] = $this->colunas;
            $dados["labelTabela"] = $this->shared->labelTabela();
    
            $this->loadTemplate($this->table, $dados);
        }
        
    }

    public function adicionar() {
        
        if(in_array($this->table. "_add", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }
        
        $dados['infoUser'] = $_SESSION;
        
        if(isset($_POST) && !empty($_POST)){

            $pnome = addslashes($_POST["nome"]);
            $pLista = $_POST["permissoes"];

            $this->model->adicionarGrupo($pnome, $pLista);

            header("Location: " . BASE_URL . "/" . $this->table);

        } else {
            
            $dados["listaPermissoes"] = $this->model->pegarListaPermissoes();
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
            $this->model->editarGrupo($id, $_POST);
            header("Location: " . BASE_URL . "/" . $this->table); 
        }else{
            $dados["listaPermissoes"] = $this->model->pegarListaPermissoes();
            $dados["permAtivas"] = $this->model->pegarPermissoesAtivas($id);
            $dados["viewInfo"] = ["title" => "Editar"];
            $dados["labelTabela"] = $this->shared->labelTabela();
            $this->loadTemplate($this->table . "-form", $dados); 
        }
    }
}
?>