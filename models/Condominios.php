<?php
class Condominios extends model {

    protected $table = "condominios";
    protected $permissoes;
    protected $shared;

    public function __construct() {
        $this->permissoes = new Permissoes();
        $this->shared = new Shared($this->table);
    }
    
    public function infoItem($id) {
        $array = array();
        $arrayAux = array();

        $id = addslashes(trim($id));
        $sql = "SELECT * FROM " . $this->table . " WHERE id='$id' AND situacao = 'ativo'";      
        $sql = self::db()->query($sql);

        if($sql->rowCount()>0){
            $array = $sql->fetch(PDO::FETCH_ASSOC);
            $array = $this->shared->formataDadosDoBD($array);
        }
        
        return $array; 
    }

    public function adicionar($request) {
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $request["alteracoes"] = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
        
        $request["situacao"] = "ativo";

        $keys = implode(",", array_keys($request));

        $values = "'" . implode("','", array_values($this->shared->formataDadosParaBD($request))) . "'";

        $sql = "INSERT INTO " . $this->table . " (" . $keys . ") VALUES (" . $values . ")";
        
        self::db()->query($sql);

        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            $_SESSION["returnMessage"] = [
                "mensagem" => "Registro inserido com sucesso!",
                "class" => "alert-success"
            ];
        } else {
            $_SESSION["returnMessage"] = [
                "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                "class" => "alert-danger"
            ];
        }
    }

    public function editar($id, $request) {

        if(!empty($id)){

            $id = addslashes(trim($id));

            $ipcliente = $this->permissoes->pegaIPcliente();
            $hist = explode("##", addslashes($request['alteracoes']));

            if(!empty($hist[1])){ 
                $request['alteracoes'] = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$hist[1];
            }else{
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> Registro sem histórico de alteração.",
                    "class" => "alert-danger"
                ];
                return false;
            }

            $request = $this->shared->formataDadosParaBD($request);

            // Cria a estrutura key = 'valor' para preparar a query do sql
            $output = implode(', ', array_map(
                function ($value, $key) {
                    return sprintf("%s='%s'", $key, $value);
                },
                $request, //value
                array_keys($request)  //key
            ));

            $sql = "UPDATE " . $this->table . " SET " . $output . " WHERE id='" . $id . "'";
             
            self::db()->query($sql);

            $erro = self::db()->errorInfo();

            if (empty($erro[2])){

                $_SESSION["returnMessage"] = [
                    "mensagem" => "Registro alterado com sucesso!",
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
    
    public function excluir($id){
        if(!empty($id)) {

            $id = addslashes(trim($id));

            //se não achar nenhum usuario associado ao grupo - pode deletar, ou seja, tornar o cadastro situacao=excluído
            $sql = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            
            if($sql->rowCount() > 0){  

                $sql = $sql->fetch();
                $palter = $sql["alteracoes"];
                $ipcliente = $this->permissoes->pegaIPcliente();
                $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

                $sqlA = "UPDATE ". $this->table ." SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id' ";
                self::db()->query($sqlA);

                $erro = self::db()->errorInfo();

                if (empty($erro[2])){

                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Registro deletado com sucesso!",
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
    }

    public function nomeClientes($termo){
        // echo "aquiiii"; exit;
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `generico` WHERE situacao = 'ativo' AND nome LIKE '%$termo%' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "label" => $value["nome"],
                    "value" => $value["nome"]
                );     
            }

        }

        // fazer foreach e criar um array que cada elemento tenha id: label: e value:
        // print_r($nomes); exit; 
        $array = $nomes;

       return $array;
    }

    
    public function buscaCondominios($termo){
        // echo "aquiiii"; exit;
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome_fantasia` FROM `condominios` WHERE situacao = 'ativo' AND nome_fantasia LIKE '%$termo%' ORDER BY nome_fantasia ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "label" => $value["nome_fantasia"],
                    "value" => $value["nome_fantasia"]
                );     
            }

        }

        // fazer foreach e criar um array que cada elemento tenha id: label: e value:
        // print_r($nomes); exit; 
        $array = $nomes;

       return $array;
    }

    public function buscaUltimaPosicaoCondominio($request){
        // echo "aquiiii"; exit;
        $array = array();
        $condominio = trim(addslashes($request['condominio']));
        // 
        $sql1 = "SELECT `id`, `posicao` FROM `cartoes` WHERE situacao = 'ativo' AND condominio = '$condominio' ORDER BY posicao ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $posicoes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $posicoes[] = intval( $value['posicao'] );
            }
            sort($posicoes,SORT_NUMERIC );

        }

        // fazer foreach e criar um array que cada elemento tenha id: label: e value:
        // print_r($posicoes[count($posicoes)-1]); exit; 
        if (count($posicoes) > 0 ){
            $array = $posicoes[count($posicoes)-1];
        }
        
       return $array;
    }

    public function buscaMensalidadePadrao($request){
        // echo "aquiiii"; exit;
        $array = array();
        $condominio = trim(addslashes($request['condominio']));
        // 
        $sql1 = "SELECT `mensalidade` FROM `condominios` WHERE situacao = 'ativo' AND nome_fantasia	 = '$condominio'";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetch(PDO::FETCH_ASSOC);
            $array[] = $nomesAux['mensalidade'];

        }

       return $array[0];
    }

}