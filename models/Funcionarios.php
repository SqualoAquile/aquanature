<?php
class Funcionarios extends model {

    protected $table = "funcionarios";
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

    public function folhasFuncionario($id) {
        $array = array();
        $arrayAux = array();

        $id = addslashes(trim($id));
        $sql = "SELECT * FROM folhasponto WHERE id_funcionario ='$id' AND situacao = 'ativo' ORDER BY id DESC";      
        $sql = self::db()->query($sql);

        if($sql->rowCount()>0){
            $array = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        
        return $array; 
    }

    public function adicionaFolha($request) {

        $array = array();
        $arrayAux = array();

        $arquivo = $_FILES['arq'];
        // print_r( $arquivo ); exit;

        if( isset( $arquivo['tmp_name'] ) && empty( $arquivo['tmp_name'] ) == false ){

            $nomearq = md5( time().rand(0,99) );
            $caminho = __FILE__;
            $base = substr($caminho, 0, intval( strlen($caminho) - 23 ) );
            //models\Funcionarios.php = 23 caracteres
            // print_r($base); exit;
            
            // $destino = BASE_URL."/assets/pdf/".$nomearq.'.pdf';
            $destino = $base."assets/pdf/".$nomearq.'.pdf';
            // print_r($destino); exit;

            if ( move_uploaded_file( $arquivo['tmp_name'] , $destino ) == false ){
                // echo 'arquivo não foi movido'; exit;
                return false;
            
            }else{
                // acerta o banco de dados
                $id_funcionario = $request['id_funcionario'];
                $aux = explode("/" , $request['titulo']);
                $titulo = $aux[1].'/'.$aux[2];
                
                //busca as informações de alterações do funcionário
                $sqlA = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id_funcionario' AND situacao = 'ativo'";
                
                self::db()->query('START TRANSACTION;');
                $sqlA = self::db()->query($sqlA);
                $erroA = self::db()->errorInfo();

                if( empty($erroA[2]) ){
                        
                    if($sqlA->rowCount() > 0){  
        
                        $sqlA = $sqlA->fetch();
                        $palter = $sqlA["alteracoes"];
                        $ipcliente = $this->permissoes->pegaIPcliente();
                        $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - UPLOAD >> {NOME DO ARQUIVO $titulo"."o"." }";
                        
                        // atualiza o histórico do funcionário
                        $sqlB = "UPDATE ". $this->table ." SET alteracoes = '$palter' WHERE id = '$id_funcionario' ";
                        self::db()->query($sqlB);   
                        $erroB = self::db()->errorInfo();

                        if( empty($erroB[2]) ){
   
                             //atualiza a tabela folhas ponto que vai ter um histórico igual ao do funcionário
                            $sql = " INSERT INTO folhasponto (id, id_funcionario, titulo, hash, alteracoes, situacao) VALUES (DEFAULT, '$id_funcionario' , '$titulo' , '$nomearq','$palter', 'ativo' ) ";

                            self::db()->query($sql);
                            $erro1 = self::db()->errorInfo();

                            if( empty($erro1[2]) ){
                            
                                self::db()->query('COMMIT;');
                                return true;

                            }else{

                                self::db()->query('ROLLBACK;');
                                unlink($destino);
                                return false;
                            }
                        }else{
                            self::db()->query('ROLLBACK;');
                            unlink($destino);
                            return false;
                        }
                    }else{
                        self::db()->query('ROLLBACK;');
                        unlink($destino);
                        return false;
                    }
                }else{
                    self::db()->query('ROLLBACK;');
                    unlink($destino);
                    return false;
                }                
            }

        }else{
            return false;
        }
        
        
    }

    public function excluirpdf($idfunc, $nomearq, $nomeVisivel, $senha){
        
        // testa se a senha está correta
         $senha = MD5($senha);
         $sql = "SELECT valor FROM parametros WHERE parametro = 'senhaexclusao' AND situacao = 'ativo'";
         $sql = self::db()->query($sql);
         
        if($sql->rowCount() > 0){  

             $sql = $sql->fetch();
             if( $sql['valor'] != $senha ){
                return false;
                exit;
             }else{
                $caminho = __FILE__;
                $base = substr($caminho, 0, intval( strlen($caminho) - 23 ) );
                //models\Funcionarios.php = 23 caracteres
                // print_r($base); exit;
                $file = $base."/assets/pdf/";
                $filename = $nomearq.".pdf";
                // $destino = "C:/xampp/htdocs/divulg/assets/pdf/".$filename;
                $destino = $file.$filename;
                // $nomeVisivel = str_replace('-','/', $nomeVisivel);
                // echo $nomeVisivel; exit;
                // echo $destino; exit;
                if( unlink($destino) ){
                    // acertar o banco
                    //////////////////////
                    //////////////////////
                    $id_funcionario = $idfunc;
                    $nomeVisivel = str_replace('-','/', $nomeVisivel);
                    // $aux = explode("/" , $request['titulo']);
                    // $titulo = $aux[1].'/'.$aux[2];
                    
                    //busca as informações de alterações do funcionário
                    $sqlA = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id_funcionario' AND situacao = 'ativo'";
                    
                    self::db()->query('START TRANSACTION;');
                    $sqlA = self::db()->query($sqlA);
                    $erroA = self::db()->errorInfo();
        
                    if( empty($erroA[2]) ){
                            
                        if($sqlA->rowCount() > 0){  
            
                            $sqlA = $sqlA->fetch();
                            $palter = $sqlA["alteracoes"];
                            $ipcliente = $this->permissoes->pegaIPcliente();
                            $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO DO ARQUIVO >> {NOME DO ARQUIVO $nomeVisivel"."o"." }";
                            
                            // atualiza o histórico do funcionário
                            $sqlB = "UPDATE ". $this->table ." SET alteracoes = '$palter' WHERE id = '$id_funcionario' ";
                            self::db()->query($sqlB);   
                            $erroB = self::db()->errorInfo();
        
                            if( empty($erroB[2]) ){
        
                                    //atualiza a tabela folhas ponto que vai ter um histórico igual ao do funcionário
                                $sql = "UPDATE folhasponto SET alteracoes = '$palter', situacao = 'excluido' WHERE id_funcionario = $idfunc AND  hash = '$nomearq' ";
        
                                self::db()->query($sql);
                                $erro1 = self::db()->errorInfo();
        
                                if( empty($erro1[2]) ){
                                
                                    self::db()->query('COMMIT;');
                                    $_SESSION["returnMessage"] = [
                                        "mensagem" => "Arquivo deletado com sucesso!",
                                        "class" => "alert-success"
                                    ];
                                    return true;
        
                                }else{
        
                                    self::db()->query('ROLLBACK;');
                                    $_SESSION["returnMessage"] = [
                                        "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                                        "class" => "alert-danger"
                                    ];
                                    return false;
                                }
                            }else{
                                self::db()->query('ROLLBACK;');
                                $_SESSION["returnMessage"] = [
                                    "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                                    "class" => "alert-danger"
                                ];
                                return false;
                            }
                        }else{
                            self::db()->query('ROLLBACK;');
                            $_SESSION["returnMessage"] = [
                                "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                                "class" => "alert-danger"
                            ];
                            return false;
                        }
                    }else{
                        self::db()->query('ROLLBACK;');
                        $_SESSION["returnMessage"] = [
                            "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                            "class" => "alert-danger"
                        ];
                        return false;
                    }       
                    
                }else{
                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                        "class" => "alert-danger"
                    ];
                    return false;
                }  
             }
        }else{
            return false;
            exit;
        }    

        
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

}