<?php
class homeController extends controller{
    public function __construct() {
    
       $usuario = new Usuarios();
       
       if($usuario->isLogged() == false){
           header("Location: ".BASE_URL."/login"); 
       }
        
    }
     
    public function index() {
      $dados = array();
      
      $dados['infoUser'] = $_SESSION;
      $this->loadTemplate("home.1", $dados); 
    }
  
}
?>