<?php

class Permissoes extends model {

    protected $table = "permissoes";
    
    public function __construct($id = "") {
    }
        
    public function getPermissoes($id_grupopermissao){
        
        $array = array();
        if(!empty($id_grupopermissao)){
           //busca os id dos parametros correspondentes do grupo de permissao pesquisado 
           $sql = "SELECT parametros FROM permissoes WHERE id = '$id_grupopermissao' AND situacao = 'ativo'";
           $sql = self::db()->query($sql);
           if($sql->rowCount() > 0){
                $pr = $sql->fetch();
                //caso não tenha nenhum parametro, é setado como 0 para não dar erro na pesquisa sequente
                if(empty($pr["parametros"])){
                    $pr["parametros"] = 0;
                }
                
                //busca os nomes dos parametros de permissão do grupo de permissao pesquisado
                $sqlA = "SELECT nome FROM permissoesparametros WHERE id IN (".$pr["parametros"].")";
                $sqlA = self::db()->query($sqlA);
                if($sqlA->rowCount()>0){
                    foreach ($sqlA->fetchAll() as $item){
                        $array[] = $item["nome"];
                    } 
                }
           }
        }
        return $array;
    }

    public function pegarListaPermissoes(){
       $array = array();
       
       $sql = "SELECT id, nome FROM permissoesparametros";
       $sql = self::db()->query($sql);
       if($sql->rowCount()>0){
         $array = $sql->fetchAll(); 
       }
       return $array;
    }
    
    public function pegarListaGrupos() {
       $array = array();
       
       $sql = "SELECT id, nome FROM permissoes as pg WHERE situacao = 'ativo' ORDER BY id DESC";      
       $sql = self::db()->query($sql);
       
       if($sql->rowCount()>0){
         $array = $sql->fetchAll(); 
       }
       return $array; 
    }

    public function adicionarGrupo($nome,$permLista){
        
        if(!empty($nome) && !empty($permLista)){
            
            $params = implode(",", $permLista);
            $ipcliente = $this->pegaIPcliente();

            $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
            $sql = "INSERT INTO " . $this->table . " (nome,parametros,alteracoes,situacao) VALUES ('$nome', '$params','$alteracoes', 'ativo')";
            self::db()->query($sql); 

            $erro = self::db()->errorInfo();

            if (empty($erro[2])){

                $_SESSION["returnMessage"] = [
                    "mensagem" => "Grupo de permissão inserido com sucesso!",
                    "class" => "alert-success"
                ];
            } else {
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                    "class" => "alert-danger"
                ];
            }
        }           
    }

    public function pegarPermissoesAtivas($id_grupo){
       $array = array();
       if(!empty($id_grupo)){
            $sql = "SELECT * FROM permissoes WHERE id = '$id_grupo' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
                
            if($sql->rowCount() > 0){
                $array = $sql->fetch();
                $array["params"] = explode(",", $array["parametros"]);
            }
        }
        return $array;
    }  
    
    public function editarGrupo($id, $request){
        
        if(!empty($id)){

            $id = addslashes(trim($id));
            $nome = addslashes(trim($request["nome"]));

            $ipcliente = $this->pegaIPcliente();
            $hist = explode("##", addslashes($request['alteracoes']));

            if(!empty($hist[1])){ 
                $alteracoes = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$hist[1];
            }else{
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> Registro sem histórico de alteração.",
                    "class" => "alert-danger"
                ];
                return false;
            }

            $params = implode(",", $request["permissoes"]);
            
            $sql = "UPDATE " . $this->table . " SET nome = '$nome', parametros = '$params', alteracoes = '$alteracoes' WHERE id = '$id'";

            self::db()->query($sql);
            
            $erro = self::db()->errorInfo();

            if (empty($erro[2])){

                $_SESSION["returnMessage"] = [
                    "mensagem" => "Grupo de permissão alterado com sucesso!",
                    "class" => "alert-success"
                ];
            } else {
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                    "class" => "alert-danger"
                ];
            }
        }
    }

    public function excluirGrupo($id_grupo){
        if(!empty($id_grupo)){
            
            $numFunc = 0;
            $usuario = new Usuarios();
            $numFunc = $usuario->qtdFuncionariosGrupo($id_grupo);
            
            if($numFunc == 0){
                
                // Se não achar nenhum usuario associado ao grupo - pode deletar, ou seja, tornar o cadastro situacao=excluído
                $sql = "SELECT alteracoes FROM " . $this->table . " WHERE id = '$id_grupo' AND situacao = 'ativo'";

                $sql = self::db()->query($sql);
                
                if($sql->rowCount() > 0){ 

                    $sql = $sql->fetch(); 
                    $palter = $sql["alteracoes"];
                    $ipcliente = $this->pegaIPcliente();
                    $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - ".$ipcliente." - ".date('d/m/Y H:i:s')." - EXCLUSAO";
                    $sqlA = "UPDATE " . $this->table . " SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id_grupo'";
                    self::db()->query($sqlA);

                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Registro deletado com sucesso!",
                        "class" => "alert-success"
                    ];
                }
            } else {
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Nenhum usuário pode estar associado ao grupo para ocorrer a exclusão.<br/>" . $numFunc . " funcionário(s) está(ão) associado(s) ao grupo.",
                    "class" => "alert-danger"
                ];
            }
        }
    }
    
    public function pegaIPcliente(){
        $remote_addr = $_SERVER["REMOTE_ADDR"];
        $ip = "000.00.00.00";
        $ip = $remote_addr;
        return $ip ;
    }

}