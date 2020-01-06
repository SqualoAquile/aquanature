<?php

class Unidades extends model {
        
    public function pegarLista() {
       $array = array();
       $arrayAux = array();
       
       $sql = "SELECT id, unidades FROM unidades WHERE situacao = 'ativo'";      
       $sql = self::db()->query($sql);
       if($sql->rowCount()>0){
         $arrayAux = $sql->fetchAll(); 
       }
       foreach ($arrayAux as $chave => $valor){
        $array[$chave] = array( "id" => $valor["id"], 
                                "nome" => utf8_encode(ucwords($valor["unidades"]))); 
        }        
       return $array; 
    }    
}