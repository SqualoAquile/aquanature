
<?php

class Formaspgto extends model {
        
    public function pegarListaFormasPgto($empresa){
        $array = array();
        if(!empty($empresa)){
            $sqlA = "SELECT id, nome FROM formapgto WHERE  id_empresa = '$empresa' AND situacao='ativo'";
            $sqlA = self::db()->query($sqlA);
            if($sqlA->rowCount()>0){
                $array = $sqlA->fetchAll();
            }
        }
        return $array;
    }   
}
