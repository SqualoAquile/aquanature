<?php
class parametrosController extends controller{

    protected $table = "parametros";

    protected $model;
    protected $shared;
    protected $usuario;

    public function __construct() {

        $this->usuario = new Usuarios();

        $this->shared = new Shared($this->table);
        $tabela = ucfirst($this->table);
        $this->model = new $tabela();

        if($this->usuario->isLogged() == false){
            header("Location: ".BASE_URL."/login"); 
        }
    }
     
    public function index() {

        $dados = array();
      
        $dados["infoUser"] = $_SESSION;
        $dados["tabelas"] = $this->model->index();
        // print_r($dados["tabelas"]); exit;
        $dados["registros"] = $this->model->pegarFixos();
        $dados["labelTabela"] = $this->shared->labelTabela();

        $this->loadTemplate($this->table, $dados); 
    }
}
?>