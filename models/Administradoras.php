
<?php

class Administradoras extends model {

    protected $table = "administradoras";
    protected $permissoes;
    protected $shared;

    public function __construct() {
        $this->permissoes = new Permissoes();
        $this->shared = new Shared($this->table);
    }
    
    public function pegarListaBandeiras() {
       $array = array();
       
       $sql = "SELECT id, nome FROM bandeiras WHERE situacao = 'ativo'";      
       $sql = self::db()->query($sql);
       if($sql->rowCount()>0){
         $array = $sql->fetchAll(); 
       }
       return $array; 
    }

    public function adicionar($request) {
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

        // INSERT 1
        $nome = addslashes(trim($request["nome"]));
        
        $insertAdministradoras = "INSERT INTO " . $this->table . " (nome, alteracoes, situacao) VALUES ('" . $nome . "', '" . $alteracoes . "', 'ativo')";
        
        self::db()->query($insertAdministradoras);

        // INSERT 2
        $id_adm = self::db()->lastInsertId();
        
        $insertBandeirasAceitasKeys = "INSERT INTO bandeirasaceitas (nome, informacoes, txantecipacao, txcredito, id_adm, alteracoes, situacao) VALUES ";
        
        $insertBandeirasAceitasValues = [];
        foreach ($request["bandeira"] as $idBandeira => $nomeBandeira) {
            $insertBandeirasAceitasValues[] = "('" . $idBandeira . "', '" . $request["infos"][$idBandeira] . "', '" . $request["txant"][$idBandeira] . "', '" . $request["txcre"][$idBandeira] . "', '" . $id_adm . "', '" . $alteracoes . "', 'ativo')";
        }

        $insertBandeirasAceitasValues = implode(",", $insertBandeirasAceitasValues);

        $insertBandeirasAceitas = $insertBandeirasAceitasKeys . $insertBandeirasAceitasValues;

        self::db()->query($insertBandeirasAceitas);

        // RETURN
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

    public function pegarBandeirasAceitas($id_adm){
        if(!empty($id_adm)) {
            $sql = "SELECT * FROM bandeirasaceitas WHERE id_adm = '$id_adm' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            return $sql->fetchAll();
        }
    }  
    
    public function pegarListaBandeirasAceitas($idadm){
        $array = array();
        if(!empty($idadm)){
            $sql = "SELECT id FROM administradoras WHERE nome = '$idadm'";
            $sql = self::db()->query($sql);
            if($sql->rowCount()>0){
                $sql = $sql->fetch();
                $idadmaux = $sql['id'];
                
                $sqlA = "SELECT bandeirasaceitas.id, bandeirasaceitas.informacoes, bandeirasaceitas.txantecipacao, bandeirasaceitas.txcredito, bandeiras.nome ".
                    "FROM bandeirasaceitas INNER JOIN bandeiras ON bandeirasaceitas.nome = bandeiras.id ".
                    "WHERE bandeirasaceitas.id_adm ='$idadmaux'";
                    
                    $sqlA = self::db()->query($sqlA);
                    if($sqlA->rowCount()>0){
                        $sqlA = $sqlA->fetchAll();
                        foreach ($sqlA as $chave => $valor){
                            $array[$chave] = array("id" => $valor["id"], "nome" => utf8_encode(ucwords($valor["nome"])), "informacoes" => $valor["informacoes"],
                                                    "txantecipacao" => $valor["txantecipacao"], "txcredito" => $valor["txcredito"]);
                        }   
                    }    
            }
        }
        return $array;
    }
    
    public function pegarInfoAdm($id_adm){
       if(!empty($id_adm)){
            $sql = "SELECT * FROM " . $this->table . " WHERE id = '$id_adm' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            return $sql->fetch();
        }
    }
    
    public function editar($id_adm, $nome, $bandeiras, $informacoes, $txantecipacoes, $txcreditos, $alter){

        if(!empty($id_adm) && !empty($nome) && !empty($bandeiras) && !empty($informacoes) && !empty($txantecipacoes) && !empty($txcreditos) && !empty($alter)){
            
            $ipcliente = $this->permissoes->pegaIPcliente();

            $hist = explode("##", addslashes($alter));

            if(!empty($hist[1])) {
                $altera = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$hist[1];
            } else {
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> Registro sem histórico de alteração.",
                    "class" => "alert-danger"
                ];
                return false;
            }
            
            /////// atualiza o nome e as alterações da administradora
            $sqlAdm = "UPDATE administradoras SET nome='$nome', alteracoes='$altera' WHERE id='$id_adm'";          
            $sqlAdm = self::db()->query($sqlAdm);
            
            //busca as informações das bandeiras cadastradas
            $idCad = [];
            $alterCad = [];

            $sql = "SELECT id, alteracoes FROM bandeirasaceitas WHERE id_adm = '$id_adm' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            $bandeirasAceitas = $sql->fetchAll();

            if($sql->rowCount() > 0){
                foreach ($bandeirasAceitas as $idChave => $idValor){
                    $idCad[] = $idValor["id"];
                    $alterCad[] = [
                        $idValor["id"] => $idValor["alteracoes"]
                    ];
                }
            }

            //// atualiza as bandeiras da administradora >>>> se já existe atualiza >>> se não existe insere
            foreach ($bandeiras as $idBand => $nomeBand){
                
                $bandeiraaceita_id = $_POST["bandeiraaceita_id" . $idBand];

                if (intval($idBand)) {
                    $aux = array_column($alterCad, intval($bandeiraaceita_id));
                    $altera1 = $aux[0];
                }

                if ($nomeBand == "EXCLUIDA") {

                    $alteracoesDelete = $altera1 . " | " . ucwords($_SESSION["nomeUsuario"]) . " - $ipcliente - " . date('d/m/Y H:i:s') . " - EXCLUSÃO";
                    $sqlDelete = "UPDATE bandeirasaceitas SET situacao='excluido', alteracoes='$alteracoesDelete' WHERE id='$bandeiraaceita_id' AND id_adm='$id_adm'";
                    $sqlDelete = self::db()->query($sqlDelete);

                    
                } elseif (in_array($bandeiraaceita_id, $idCad)) {
                    
                    //foi encontrada deve ser atualizada
                    $altera1 = $altera1 . " | " . ucwords($_SESSION["nomeUsuario"]) . " - $ipcliente - " . date('d/m/Y H:i:s') . " - ALTERACAO";
                    $sqlA = "UPDATE bandeirasaceitas SET nome='$idBand', informacoes='$informacoes[$idBand]', txantecipacao='$txantecipacoes[$idBand]', txcredito='$txcreditos[$idBand]'," . " alteracoes='$altera1' WHERE id='$bandeiraaceita_id' AND id_adm='$id_adm'";
                    $sqlA = self::db()->query($sqlA);

                } else {

                    // não foi encontrada deve ser inserida
                    $alteracoes = ucwords($_SESSION["nomeUsuario"])." - " . $ipcliente . " - " . date('d/m/Y H:i:s') . " - CADASTRO";
                    $sqlInsert ="INSERT INTO bandeirasaceitas (nome, informacoes, txantecipacao, txcredito, id_adm, alteracoes, situacao) VALUES" . " ('$idBand', '$informacoes[$idBand]','$txantecipacoes[$idBand]', '$txcreditos[$idBand]', '$id_adm', '$alteracoes', 'ativo')";
                    $sqlInsert = self::db()->query($sqlInsert);

                }
            }

            // RETURN
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

                $erroA = self::db()->errorInfo();

                if (empty($erroA[2])){

                    $sqlB = "SELECT id, alteracoes FROM bandeirasaceitas WHERE id_adm = '$id' AND situacao = 'ativo'";
                    $sqlB = self::db()->query($sqlB);

                    if($sqlB->rowCount() > 0){

                        $sqlB = $sqlB->fetchAll(PDO::FETCH_ASSOC);

                        foreach ($sqlB as $valorBand) {

                            $alter = $valorBand["alteracoes"];
                            $alter = $alter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSAO";
                            $sqlC = "UPDATE bandeirasaceitas SET alteracoes = '$alter', situacao = 'excluido' WHERE id_adm = '$id' AND id=" . $valorBand['id'];
                            self::db()->query($sqlC);
                        }

                        $erroB = self::db()->errorInfo();

                        if (empty($erroB[2])){
                            $_SESSION["returnMessage"] = [
                                "mensagem" => "Registro deletado com sucesso!",
                                "class" => "alert-success"
                            ];
                        } else {
                            $_SESSION["returnMessage"] = [
                                "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erroB[2],
                                "class" => "alert-danger"
                            ];
                        }
                    }
                } else {
                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erroA[2],
                        "class" => "alert-danger"
                    ];
                }
            }
        }
    }
    
    public function buscaAdmPeloNome($nome){
        $array = array();
        if(!empty($nome)){
            $sql = "SELECT nome FROM administradoras WHERE nome='$nome' AND situacao='ativo'";
            $sql = self::db()->query($sql);
            if($sql->rowCount()>0){
                $array = $sql->fetchAll();
            } 
        }
        return $array;
    }
}