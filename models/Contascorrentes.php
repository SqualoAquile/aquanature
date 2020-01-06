
<?php

class Contascorrentes extends model {
        
    public function pegarListaCC($empresa) {
       $array = array();
       
       $sql = "SELECT id, nome FROM contascorrentes WHERE id_empresa = '$empresa' AND situacao = 'ativo'";      
       $sql = self::db()->query($sql);
       if($sql->rowCount()>0){
         $array = $sql->fetchAll(); 
       }
       return $array; 
    }    
}
