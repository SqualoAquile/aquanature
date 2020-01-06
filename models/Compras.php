<?php

class Compras extends model {

    public function nomeDasColunas(){
       $array = array();
       
       $sql = "SHOW COLUMNS FROM compras";      
       $sql = self::db()->query($sql);
       if($sql->rowCount()>0){
         $sql = $sql->fetchAll(); 
         foreach ($sql as $chave => $valor){
            $array[$chave] = array("nomecol" => utf8_encode(ucwords($valor["Field"])), "tipo" => $valor["Type"]);        
         }
       }
       
       return $array;
    }
    
    public function nomeColunasItens(){
       $array = array();
       
       $sql = "SHOW COLUMNS FROM compra_itens";      
       $sql = self::db()->query($sql);
       if($sql->rowCount()>0){
         $sql = $sql->fetchAll(); 
         foreach ($sql as $chave => $valor){
            $array[$chave] = array("nomecol" => utf8_encode(ucwords($valor["Field"])), "tipo" => $valor["Type"]);        
         }
       }
//       print_r($array);exit;
       return $array;
    }
    
    public function pegarListaCompras($empresa) {
       $array = array();
       
       $sql = "SELECT * FROM compras WHERE id_empresa = '$empresa' AND situacao = 'ativo' ORDER BY id DESC";      
       $sql = self::db()->query($sql);
       if($sql->rowCount()>0){
         $array = $sql->fetchAll(); 
       }
       return $array; 
    }
    
    public function buscaClientePeloNome($nome,$empresa){
        $array = array();
        if(!empty($nome) && !empty($empresa)){
            $sql = "SELECT nome FROM compras WHERE nome='$nome' AND id_empresa = '$empresa' AND situacao='ativo'";
            $sql = self::db()->query($sql);
            if($sql->rowCount()>0){
                $array = $sql->fetchAll();
            } 
        }
        return $array;
    }

    public function buscaClientePeloEmail($nome,$empresa){
        $array = array();
        if(!empty($nome) && !empty($empresa)){
            $sql = "SELECT email FROM compras WHERE email='$nome' AND id_empresa = '$empresa' AND situacao='ativo'";
            $sql = self::db()->query($sql);
            if($sql->rowCount()>0){
                $array = $sql->fetchAll();
            } 
        }
        return $array;
    }
   
    public function buscaClientePeloCPF($nome,$empresa){
        $array = array();
        if(!empty($nome) && !empty($empresa)){
            $sql = "SELECT cpf_cnpj FROM compras WHERE cpf_cnpj='$nome' AND id_empresa = '$empresa' AND situacao='ativo'";
            $sql = self::db()->query($sql);
            if($sql->rowCount()>0){
                $array = $sql->fetchAll();
            } 
        }
        return $array;
    }

    public function adicionar($txts,$empresa){
        
        if(count($txts) > 0 && !empty($empresa)){
            
            $p = new Permissoes();
            $ipcliente = $p->pegaIPcliente();
            $alteracoes = ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
                   
            //tratamento das informações vindas do formulário
            $txt1 =  trim(addslashes($txts[1])); // nome
            $txt2 =       addslashes($txts[2]); // cpf / cnpj
            $txt3 =       addslashes($txts[3]); // celular
            $txt4 =  trim(addslashes($txts[4])); // operadora
            $txt5 =       addslashes($txts[5]); // telefone
            $txt6 =  trim(addslashes($txts[6])); // email
            $txt7 =       addslashes($txts[7]); // cep
            $txt8 =  trim(addslashes($txts[8])); // endereço
            $txt9 =       addslashes($txts[9]); // numero
            $txt10 = trim(addslashes($txts[10])); // complemento
            $txt11 = trim(addslashes($txts[11])); // bairro
            $txt12 = trim(addslashes($txts[12]));// cidade
            $txt13 = trim(addslashes($txts[13])); // observacao
            $txt14 = trim(addslashes($txts[14])); // contatos
                        
            //montagem da query
            $sql = "INSERT INTO compras(id, id_empresa, nome, cpf_cnpj, celular, operadora, telefone, email, cep, endereco, numero, complemento, bairro, cidade, observacao, contatos, alteracoes, situacao) VALUES ".
             
            "(DEFAULT, ".
            "'$empresa', ".
            "'$txt1', ".
            "'$txt2', ".
            "'$txt3', ".
            "'$txt4', ".
            "'$txt5', ".
            "'$txt6', ".
            "'$txt7', ".
            "'$txt8', ".
            "'$txt9', ".
            "'$txt10', ".
            "'$txt11', ".
            "'$txt12', ".
            "'$txt13', ".
            "'$txt14', ".
            "'$alteracoes', ".
            "'ativo')";
            
            self::db()->query($sql);

        }
    }    
    
     public function pegarInfoCliente($id,$empresa) {
       $array = array();
       
       $sql = "SELECT * FROM compras WHERE id='$id' AND id_empresa = '$empresa' AND situacao = 'ativo'";      
       $sql = self::db()->query($sql);
       if($sql->rowCount()>0){
         $array = $sql->fetchAll(); 
       }
       return $array; 
    }
    
     public function editar($id, $txts, $empresa){
        if(!empty($id) && !empty($empresa) && count($txts) >0 ){
            
            $p = new Permissoes();
            $ipcliente = $p->pegaIPcliente();
            //$altera = addslashes($txts[21])." | ".ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERACAO";
            
            //tratamento das informações vindas do formulário
            //tratamento das informações vindas do formulário
            $txt1 =  trim(addslashes($txts[1])); // nome
            $txt2 =       addslashes($txts[2]); // cpf / cnpj
            $txt3 =       addslashes($txts[3]); // celular
            $txt4 =  trim(addslashes($txts[4])); // operadora
            $txt5 =       addslashes($txts[5]); // telefone
            $txt6 =  trim(addslashes($txts[6])); // email
            $txt7 =       addslashes($txts[7]); // cep
            $txt8 =  trim(addslashes($txts[8])); // endereço
            $txt9 =       addslashes($txts[9]); // numero
            $txt10 = trim(addslashes($txts[10])); // complemento
            $txt11 = trim(addslashes($txts[11])); // bairro
            $txt12 = trim(addslashes($txts[12]));// cidade
            $txt13 = trim(addslashes($txts[13])); // observacao
            $txt14 = trim(addslashes($txts[14])); // contatos
            
            $altaux = $txts[16];
            $altaux = str_replace("(*", "", $altaux);
            $altaux = str_replace("*)", "", $altaux);
            
            $altera = "$txts[15] | ".ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERACAO >> $altaux";
            
            
            //montagem da query
            $sql = "UPDATE compras SET ".
                "nome =        '$txt1', ".
                "cpf_cnpj =    '$txt2', ".
                "celular=      '$txt3', ".
                "operadora =   '$txt4', ".
                "telefone =    '$txt5', ".
                "email =       '$txt6', ".
                "cep =         '$txt7', ".
                "endereco =    '$txt8', ".
                "numero =      '$txt9', ".
                "complemento = '$txt10', ".
                "bairro =      '$txt11', ".
                "cidade =      '$txt12', ".
                "observacao =  '$txt13', ".
                "contatos =    '$txt14', ".
                "alteracoes = '$altera' WHERE id = '$id' AND id_empresa = '$empresa'";
            
            self::db()->query($sql);

        }
    }
    
    public function excluir($id,$empresa){
        if(!empty($id) && !empty($empresa)){
            
            //se não achar nenhum usuario associado ao grupo - pode deletar, ou seja, tornar o cadastro situacao=excluído
            $sql = "SELECT alteracoes FROM compras WHERE id = '$id' AND id_empresa = '$empresa' AND situacao = 'ativo'";
            
            $sql = self::db()->query($sql);
            
            if($sql->rowCount() > 0){  
               $sql = $sql->fetch();
               $palter = $sql["alteracoes"];
               $p = new Permissoes();
               $ipcliente = $p->pegaIPcliente();

               $palter = $palter." | ".ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSAO";
               
               $sqlA = "UPDATE compras SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id' AND id_empresa = '$empresa'";
               self::db()->query($sqlA);
               
            }
        }
    }
    
}
