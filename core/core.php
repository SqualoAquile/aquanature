<?php

class core {

    private function redirectMessage($partial = "Erro no endereço, você foi redirecionado para o início.") {
        return '
            <div class="alert alert-danger alert-dismissible m-0 rounded-0">
                ' . $partial . '
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        ';
    }
    
    public function run(){

        $url = '/'.(isset($_GET['q'])?$_GET['q']:'');
        $params = array();
        
        if(!empty($url) && $url != '/'){

           $url = explode("/", $url);
           array_shift($url);
           
           $currentController = $url[0]."Controller";
           array_shift($url);
           
           if(isset($url[0]) && !empty($url[0])){
               $currentAction = $url[0];
               array_shift($url) ;
           }else{ //Assim que uma mensagem de erro foi exibida no navegador, unsetar pra que ela suma no resto da sessão
               $currentAction = "index"; 
           }
           
           if(count($url)>0){
               $params = $url;
           }
            
        }else{
            $currentController = "homeController";
            $currentAction = "index";
        }
        
        if (class_exists($currentController)){
            $a = new $currentController(); 
            if(method_exists($a,$currentAction)){
                // echo 'O Controller existe e o método tbm! ';exit;
                
                if( strtolower($currentAction) == 'excluir' || 
                    strtolower($currentAction) == 'editar'  || 
                    strtolower($currentAction) == 'lerpdf'   ){
                    
                     
                    if(count($params) != 1 || empty($params[0])){
                        $_SESSION["returnMessage"] = [
                            "mensagem" => "Erro no endereço, você foi redirecionado para ".ucfirst(str_replace("Controller","",$currentController)),
                            "class" => "alert-danger"
                        ];
                        $currentAction = "index";
                        $params = array();   
                    }
                }
                if(strtolower($currentAction) == 'adicionar'){ 

                    if(count($params) != 0){
                        $_SESSION["returnMessage"] = [
                            "mensagem" => "Erro no endereço, você foi redirecionado para ".ucfirst(str_replace("Controller","",$currentController)),
                            "class" => "alert-danger"
                        ];
                        $currentAction = "index";   
                        $params = array();
                    }
                }
                // if(strtolower($currentAction) == 'excluirpdf'){ 

                //     if(count($params) != 3){
                //         $_SESSION["returnMessage"] = [
                //             "mensagem" => "Erro no endereço, você foi redirecionado para ".ucfirst(str_replace("Controller","",$currentController)),
                //             "class" => "alert-danger"
                //         ];
                //         $currentAction = "index";   
                //         $params = array();
                //     }
                // }

            }else{
                //echo 'O Controller existe, mas o método NÂO!';exit;  
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Erro no endereço, você foi redirecionado para ".ucfirst(str_replace("Controller","",$currentController)),
                    "class" => "alert-danger"
                ];
                // echo $this->redirectMessage("Erro no endereço, você foi redirecionado para " .ucfirst(str_replace("Controller","",$currentController)));
                $currentAction = "index";
            }
        }else{
            //echo 'O Controller não existe!';exit;
            // echo "Estamos aquiiiii";
            // echo $currentAction; exit;
            // echo $this->redirectMessage();
            $_SESSION["returnMessage"] = [
                "mensagem" => "Erro no endereço, você foi redirecionado para o início.",
                "class" => "alert-danger"
            ];
            $currentController = "homeController";
            $currentAction = "index";
        }
        ////////////////////////////////////////       

        if (isset($_SESSION["returnMessage"])) {
            if (array_key_exists("show", $_SESSION["returnMessage"]) && $_SESSION["returnMessage"]["show"]) {
                unset($_SESSION["returnMessage"]);
            } else {
                $_SESSION["returnMessage"]["show"] = true;
            }
        }
        
        $c = new $currentController();
        call_user_func_array(array($c,$currentAction), $params);
        
    }    

}

?>