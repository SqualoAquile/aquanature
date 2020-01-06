<?php
class loginController extends controller{
    
    public function index() {

        $dados = array();

        if(isset($_POST["email"]) && !empty($_POST["email"]) && isset($_POST["senha"]) && !empty($_POST["senha"])){
          
            $email = addslashes($_POST["email"]);
            $senha = md5(addslashes($_POST["senha"]));
            
            $usuario = new Usuarios();
            
            
            if($usuario->fazerLogin($email,$senha)){
               header("Location: ".BASE_URL."/home");
               exit;
            }else{
                $dados["aviso"] = "E-mail e/ou senha incorretos.";
            }
        }
 
        $this->loadView("login",$dados);
    }
    
    public function sair() {
        if(isset($_SESSION["idUsuario"]) && !empty($_SESSION["idUsuario"]) && isset($_SESSION["permissoesUsuario"]) && !empty($_SESSION["permissoesUsuario"])){
            $_SESSION["nomeUsuario"] = "";
            $_SESSION["idUsuario"] = "";
            $_SESSION["emailUsuario"] = "";
            $_SESSION["permissoesUsuario"] = "";
            unset($_SESSION);
            header("Location: ".BASE_URL."/login");    
        }
    }
}
?>