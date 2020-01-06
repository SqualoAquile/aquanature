<?php
class Parametros extends model {

    protected $table;
    protected $permissoes;
    
    public function __construct() {
        $this->permissoes = new Permissoes();
    }

    public function indexOriginal() {

        $sql = "SHOW TABLES";
        $sql = self::db()->query($sql);
        $tabelas = $sql->fetchAll();

        $infosTabelas = [];
        foreach ($tabelas as $key => $value) {

            $sqlB = "SHOW TABLE STATUS WHERE Name='" . $value[0] . "'";
            $sqlB = self::db()->query($sqlB);
            $infoTabela = $sqlB->fetchAll();

            foreach ($infoTabela as $key => $value) {

                $infoTabela[$key]["Comment"] = json_decode($value["Comment"], true);
            }

            array_push($infosTabelas, $infoTabela);
        }

        return $infosTabelas;
    }
    
    public function index() {
        $sql = "SHOW TABLES";
        $sql = self::db()->query($sql);
        $tabelas = $sql->fetchAll();
        // print_r($tabelas); exit;
        $infosTabelas = [];
        foreach ($tabelas as $key => $value) {
            $sqlB = "SHOW TABLE STATUS WHERE Name='" . $value[0] . "'";
            $sqlB = self::db()->query($sqlB);
            $infoTabela = $sqlB->fetchAll();
            // print_r($infoTabela); exit;
            foreach ($infoTabela as $key => $value) {
                $infoTabela[$key]["Comment"] = json_decode($value["Comment"], true);
                
                if( isset($infoTabela[$key]["Comment"]) && !empty($infoTabela[$key]["Comment"]) ){
                    if( array_key_exists('info_relacao', $infoTabela[$key]["Comment"] )){

                        // buscar na tabela relacionada os valores que vão ser usados no select
                        $tabela =  lcfirst($infoTabela[$key]["Comment"]["info_relacao"]["tabela"]);
                        $campo = lcfirst($infoTabela[$key]["Comment"]["info_relacao"]["campo"]);
                        $lista = array();
                        // echo '<br><br> tabela --- '. $value[0] .' <br><br>';
                        // echo '<br><br>'. $tabela. ' ---- ' . $campo . '<br><br>';
                        if( !empty($tabela) && !empty($campo) ){

                            $sql = "SELECT id, ". $campo ." FROM  ". $tabela ." WHERE situacao = 'ativo'";      
                            $sql = self::db()->query($sql);

                            if($sql->rowCount()>0){
                                $arrayAux = $sql->fetchAll(PDO::FETCH_ASSOC); 

                                foreach ($arrayAux as $chave => $valor){
                                    $lista[] = [
                                        "id" => $valor["id"], 
                                        "$campo" => trim(ucwords($valor["$campo"]))
                                    ];
                                }

                                $infoTabela[$key]["Comment"]['info_relacao']['resultado'] = $lista;
                            }

                        }else{
                            $infoTabela[$key]["Comment"]['info_relacao']['resultado'] = $lista;
                        }
                    }
                }
                
            }
            
            array_push($infosTabelas, $infoTabela);
        }
        // print_r($infosTabelas); exit;
        return $infosTabelas;
    }
    

    public function listar($request) {
        
        $this->table = $request["tabela"];

        $value_sql = "";
        if ($request["value"] && $request["campo"]) {

            $value = trim($request["value"]);
            $value = addslashes($value);
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);

            $value_sql = " AND " . $campo . " LIKE '%" . $value . "%'";
        }

        $sql = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo'" . $value_sql;

        $sql = self::db()->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarDependente($request) {

        $this->table = $request["tabela"];

        $value_sql = "";
        if ($request["value"] && $request["campo"]) {

            $value = trim($request["value"]);
            $value = addslashes($value);
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);

            $value_sql = " AND " . $campo . " LIKE '%" . $value . "%'";
        }

        $chaveext = $request["chaveext"];
        $idchaveext = $request["idtabfonte"];

        $where = " WHERE $chaveext=$idchaveext AND situacao = 'ativo' ";

        $sql = "SELECT * FROM " . $this->table . $where . $value_sql;

        // echo $sql; exit;
        $sql = self::db()->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarDoiscampos($request) {

        $sql = "SELECT * FROM " . $request["tabela"] . " WHERE situacao = 'ativo'";

        $sql = self::db()->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function adicionar($request) {
        // print_r($request); exit;
        $this->table = $request["tabela"];
        
        if(empty($request['chaveext']) && empty($request['idtabfonte']) ){
            if ($request["value"] && $request["campo"]) {
                $value = trim($request["value"]);
                $value = addslashes($value);
                
                $campo = trim($request["campo"]);
                $campo = addslashes($campo);
            }
        }else{
            if ($request["value"] && $request["campo"]) {
                $valuuAux = trim($request["value"]);
                $valuuAux = addslashes($valuuAux);

                $value = `'`.trim($request["idtabfonte"])."','".$valuuAux.`'`;                
                
                $campoAux = trim($request["campo"]);
                $campoAux = addslashes($campoAux);

                $campo = trim($request["chaveext"]).','.$campoAux;
                
            }
        }    
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
        $sql = "INSERT INTO " . $this->table . " (" . $campo . ", alteracoes, situacao) VALUES ('" . $value . "', '" . $alteracoes . "', 'ativo')";
        
        // echo $sql; exit;
        self::db()->query($sql);
        return self::db()->errorInfo();
    }

    public function adicionarDoisCampos($request) {

        $this->table = $request["tabela"];

        if ($request["value1"] && $request["campo1"]) {

            $value1 = trim($request["value1"]);
            $value1 = addslashes($value1);
            
            $campo1 = trim($request["campo1"]);
            $campo1 = addslashes($campo1);
        }

        if ($request["value2"] && $request["campo2"]) {

            $value2 = trim($request["value2"]);
            $value2 = addslashes($value2);
            
            $campo2 = trim($request["campo2"]);
            $campo2 = addslashes($campo2);
        }

        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

        $sql = "INSERT INTO " . $this->table . " (" . $campo1 . ", " . $campo2 . ", alteracoes, situacao) VALUES ('" . $value1 . "', '" . $value2 . "', '" . $alteracoes . "', 'ativo')";
        
        self::db()->query($sql);

        return self::db()->errorInfo();
    }

    public function excluir($request, $id) {

        $this->table = $request["tabela"];

        $id = addslashes(trim($id));

        $sql = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
        $sql = self::db()->query($sql);

        if ($sql->rowCount() > 0) {
            
            $sql = $sql->fetch();
            $palter = $sql["alteracoes"];

            $ipcliente = $this->permissoes->pegaIPcliente();
            $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

            $sqlA = "UPDATE ". $this->table ." SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id' ";
            // echo $sqlA; exit;
            self::db()->query($sqlA);
        }

        return self::db()->errorInfo();
    }

    public function editar($request, $id) {
        
        $this->table = $request["tabela"];

        if ($request["value"] && $request["campo"]) {
            $value = trim($request["value"]);
            $value = addslashes($value);
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);
        }
        
        $id = addslashes(trim($id));

        $sqlW = "SELECT $campo, alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
        $sqlW = self::db()->query($sqlW);

        if ($sqlW->rowCount() > 0) {
            
            $sqlW = $sqlW->fetch();
            $palter = $sqlW["alteracoes"];
            $valorAntigo = $sqlW[$campo];

            $ipcliente = $this->permissoes->pegaIPcliente();
            $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> de ($valorAntigo) para ($value)";

            $sql = "UPDATE " . $this->table . " SET " . $campo . " = '" . $value . "', alteracoes = '$palter' WHERE id='" . $id . "'";
            self::db()->query($sql);
            return self::db()->errorInfo();
        } 
    }

    public function editarDoisCampos($request, $id) {
        
        $this->table = $request["tabela"];
        
        if ($request["value1"] && $request["campo1"]) {
            $value1 = trim($request["value1"]);
            $value1 = addslashes($value1);
            
            $campo1 = trim($request["campo1"]);
            $campo1 = addslashes($campo1);
        }

        if ($request["value2"] && $request["campo2"]) {
            $value2 = trim($request["value2"]);
            $value2 = addslashes($value2);
            
            $campo2 = trim($request["campo2"]);
            $campo2 = addslashes($campo2);
        }

        $id = addslashes(trim($id));
        $sql = "UPDATE " . $this->table . " SET " . $campo1 . " = '" . $value1 . "', " . $campo2 . " = '" . $value2 . "' WHERE id='" . $id . "'";
             
        self::db()->query($sql);
        return self::db()->errorInfo();
    }

    public function pegarFixos() {

        $this->table = "parametros";
        
        $sql = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo'";
        $sql = self::db()->query($sql);
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as $key => $value) {
            $result[$key]["comentarios"] = json_decode($value["comentarios"], true);
        }
        
        return $result;
    }

    public function editarFixos($request, $id) {
        
        $this->table = "parametros";

        $ipcliente = $this->permissoes->pegaIPcliente();
        $hist = explode("##", addslashes($request['alteracoes']));

        if(!empty($hist[1])){ 
            $alteracoes = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$hist[1];     
        }

        $value = "";
        if ($request["value"]) {
            $value = trim($request["value"]);
            $value = addslashes($value);
        }

        $id = addslashes(trim($id));

        $update = "UPDATE " . $this->table . " SET valor = '" . $value . "', alteracoes = '" . $alteracoes . "' WHERE id='" . $id . "'";
             
        $update = self::db()->query($update);

        $erro = self::db()->errorInfo();

        if (empty($erro[2])){
            $select = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo' AND id = '" . $id . "'";
            $select = self::db()->query($select);
            $select = $select->fetch(PDO::FETCH_ASSOC);
        }

        return [
            "result" => $select,
            "erro" => $erro
        ];

    }

    public function buscaParametros(){
        $result = array();
        
        $sql = "SELECT parametro, valor FROM parametros WHERE situacao = 'ativo'";
        $sql = self::db()->query($sql);

        if ($sql->rowCount() > 0) {

            $sql = $sql->fetchAll(PDO::FETCH_ASSOC);         
            foreach ($sql as $key => $value) {
                $result[ $value['parametro'] ] = $value['valor'];
            }
        }
        return $result;

    }
}