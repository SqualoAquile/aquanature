
<?php

class Contasgerenciais extends model {
        
    public function pegarListaSinteticas($nome,$empresa){
        $array = array();
        if(!empty($nome) && !empty($empresa)){
            $sqlA = "SELECT id, nome FROM contasintetica WHERE movimentacao='$nome' AND id_empresa = '$empresa' AND situacao='ativo'";
            $sqlA = self::db()->query($sqlA);
            if($sqlA->rowCount()>0){
                $sqlA = $sqlA->fetchAll();
                foreach ($sqlA as $chave => $valor){
                    $array[$chave] = array("id" => $valor["id"], "nome" => utf8_encode(ucwords($valor["nome"])));
                }   
            }
        }
        //print_r($array);exit;
        return $array;
    }
    
    public function pegarListaAnaliticas($id){
        $array = array();
        if(!empty($id) ){
            $sqlA = "SELECT id, nome FROM centrodecustos WHERE id_mov ='$id' AND situacao='ativo'";
            $sqlA = self::db()->query($sqlA);
            if($sqlA->rowCount()>0){
                $sqlA = $sqlA->fetchAll();
                foreach ($sqlA as $chave => $valor){
                    $array[$chave] = array("id" => $valor["id"], "nome" => ucwords($valor["nome"]));
                }   
            }
        }
        return $array;
    }    
}
