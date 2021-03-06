<?php
class relatoriocartoesController extends controller{

    // Protected - estas variaveis só podem ser usadas nesse arquivo
    protected $table = "cartoes";
    protected $nome = "relatoriocartoes";
    protected $label = "Relatório Cartões";
    protected $colunas;
    
    protected $model;
    protected $shared;
    protected $usuario;

    public function __construct() {
        
        // Instanciando as classes usadas no controller
        $this->shared = new Shared($this->table);
        $tabela = ucfirst($this->table);
        $this->usuario = new Usuarios();
        
        $this->colunas = $this->shared->nomeDasColunas();

        // verifica se tem permissão para ver esse módulo
        if(in_array($this->nome."_ver", $_SESSION["permissoesUsuario"]) == false){
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
        
        $dados['infoUser'] = $_SESSION;
        $dados["colunas"] = $this->colunas;
        $dados["labelTabela"]["labelBrowser"] = $this->label;

        $this->loadTemplate($this->nome, $dados);
    }   

}   
?>