<?php
class Servicos extends model {

    protected $table = "servicos";
    protected $permissoes;
    protected $shared;

    public function __construct() {
        $this->permissoes = new Permissoes();
        $this->shared = new Shared($this->table);
    }

    public function listar() {
        
        $sql = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo'";
        $sql = self::db()->query($sql);
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);

        foreach ($result as $key => $value) {
            $result[$key]["preco_venda"] = number_format(floatval(addslashes($result[$key]["preco_venda"])),2,',','.');
            $result[$key]["custo"] = number_format(floatval(addslashes($result[$key]["custo"])),2,',','.');
            $result[$key]["comentarios"] = json_decode($value["comentarios"], true);
        }

        return $result;
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

    public function editar($request, $id) {

        if(!empty($id)){

            $id = addslashes(trim($id));

            $ipcliente = $this->permissoes->pegaIPcliente();
            $hist = explode("##", addslashes($request['alteracoes']));

            if(!empty($hist[1])){ 
                $request['alteracoes'] = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$hist[1];
            }

            // Cria a estrutura key = 'valor' para preparar a query do sql
            $output = implode(', ', array_map(
                function ($value, $key) {
                    return sprintf("%s='%s'", $key, $value);
                },
                $request, //value
                array_keys($request)  //key
            ));

            $update = "UPDATE " . $this->table . " SET " . $output . " WHERE id='" . $id . "'";
                
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
    }
}