<?php
class homeController extends controller{
  
    public function __construct() {

      $usuario = new Usuarios();
      
      // Verificar se está logado ou nao
      if( $usuario->isLogged() == false){
          header("Location: " . BASE_URL . "/login"); 
      }
    }
     
    public function index() {
        
      /////// FINANCEIRO
      $relatorioFinanceiro =  new Relatoriofluxocaixa();
      $sharedFinanceiro = new Shared('fluxocaixa');
      
      $dados['infoUser'] = $_SESSION;
      $dados["colunas"] = $sharedFinanceiro->nomeDasColunas();
      $dados["meta"] = $relatorioFinanceiro->meta();
      $this->loadTemplate('home', $dados);
      // $this->loadTemplate('negocios', $dados);
    }

}   
?>