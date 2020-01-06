<?php

class Estoque extends model {
    
    public function buscaProdsForn($nome,$empresa){
        $array = array();
        $string = '';
        if(!empty($nome) && !empty($empresa)){
            $sql = "SELECT produto FROM estoque WHERE fornecedor='$nome' AND id_empresa = '$empresa' AND situacao='ativo'";
            $sql = self::db()->query($sql);
            if($sql->rowCount()>0){
                $sql = $sql->fetchAll();
                foreach ($sql as $valor){
                    $aux = ucwords( strtolower( $valor['produto'] ) );       
                    $array[] = mb_convert_encoding($aux, "UTF-8", "auto");
                }
            } 
        }
        //print_r($array);exit;
        return $array;
    }
    
    public function confereEstoque($nome,$empresa){
        $quant = 0;
        
        if(!empty($nome) && !empty($empresa)){
            $nome = strtoupper($nome);
            $sql = "SELECT quant_atual FROM estoque WHERE codigo='$nome' AND id_empresa = '$empresa' AND situacao='ativo'";
            $sql = self::db()->query($sql);
            if($sql->rowCount()>0){
                $sql = $sql->fetch();
                $quant = $sql['quant_atual'];
            }
        }
        //print_r($array);exit;
        return $quant;
    }
    
    public function buscaCodigoProduto($cod, $forn, $empresa){
        $array = array();
        if(!empty($cod) && !empty($forn) && !empty($empresa)){
            $sqlA = "SELECT sigla FROM fornecedores WHERE nomefantasia='$forn' AND id_empresa='$empresa'";
            $sqlA = self::db()->query($sqlA);
            if($sqlA->rowCount()>0){
                $sqlA = $sqlA->fetch();
                $sigla = $sqlA[0];
                $cod = $cod.$sigla;
                $sqlB = "SELECT codigo FROM estoque WHERE codigo='$cod' AND id_empresa = '$empresa' AND situacao='ativo'";
                $sqlB = self::db()->query($sqlB);
                if($sqlB->rowCount()>0){
                    $array = $sqlB->fetchAll();
                } 
            }             
        }
        return $array;
    }

    
    public function excluirItens($ids,$alteracoes,$empresa){
        
        if(!empty($ids) && !empty($alteracoes) && !empty($empresa)){
            $resp = 0;
            $p = new Permissoes();
            $ipcliente = $p->pegaIPcliente();

            $sqlAux = "";
            
            foreach ($ids as $idChave => $idVal){

                $id =  addslashes($idVal);
                $alter = addslashes($alteracoes[$idChave])." | ".ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSAO";

                $sqlAux = $sqlAux."UPDATE estoque SET alteracoes = '$alter', situacao = 'excluido' WHERE id = '$id' AND id_empresa = '$empresa'; ";    

            }
            
            $resp = self::db()->query($sqlAux);
            
            if($resp->rowCount()<=0){
                $resp = 0;
            }else{
                $resp = $resp->rowCount();
            }
            return $resp;
        }           
    }

    public function adicionar($txts,$empresa){
        
        if(count($txts) > 0 && !empty($empresa)){
            $resp = array();
            $forn = trim(addslashes($txts[0]));
            $sqlA = "SELECT sigla FROM fornecedores WHERE nomefantasia='$forn' AND id_empresa='$empresa'";
            $sqlA = self::db()->query($sqlA);
            if($sqlA->rowCount()>0){
                $sqlA = $sqlA->fetch();
                $sigla = $sqlA[0];
                
                
                $p = new Permissoes();
                $ipcliente = $p->pegaIPcliente();
                $alteracoes = ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

                //tratamento das informações vindas do formulário
                $txt1 =  trim(addslashes(utf8_decode($txts[0])));        // forn
                $txt2 =  trim(addslashes(utf8_decode($txts[1]))).$sigla; // cod
                $txt3 =  trim(addslashes(utf8_decode($txts[2])));        // prod
                $txt4 =          floatval(addslashes($txts[3]));    // custo
                $txt5 =          floatval(addslashes($txts[4]));    // venda
                $txt6 =  trim(addslashes(utf8_decode($txts[5])));        // unid
                $txt7 =  trim(addslashes(utf8_decode($txts[6])));        // granel
                $txt8 =          floatval(addslashes($txts[7]));    // qtd
                $txt9 =          floatval(addslashes($txts[8]));    // qtd min
                $txt10 = trim(addslashes(utf8_decode($txts[9])));        // localiz
                $txt11 = trim(addslashes(utf8_decode($txts[10])));       // ncm
                $txt12 = trim(addslashes(utf8_decode($txts[11])));       // observ

                //montagem da query

                $sql = "INSERT INTO estoque (id, id_empresa, fornecedor, codigo, produto, valor_custo, valor_venda, unidade, venda_a_granel, quant_atual, quant_min, localizacao, ncm, observacao, alteracoes, situacao) VALUES ".

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
                "'$alteracoes', ".
                "'ativo')";
                
                //echo $sql; exit;
                $sql = self::db()->query($sql);
                $resp["id"] = self::db()->lastInsertId();
                $resp["alter"] = $alteracoes;
                $resp["sigla"] = $sigla;
                return $resp;
            }
        }    
    }    
    
    
public function editarItem($info,$empresa){
        
        if(!empty($info) && !empty($empresa)){
            $forn = trim(addslashes($info[1]));
            $sqlA = "SELECT sigla FROM fornecedores WHERE nomefantasia='$forn' AND id_empresa='$empresa'";
            $sqlA = self::db()->query($sqlA);
            
            if($sqlA->rowCount()>0){
                $sqlA = $sqlA->fetch();
                $sigla = $sqlA[0];
                
                $resp = 0;
                $p = new Permissoes();
                $ipcliente = $p->pegaIPcliente();

                //tratamento das informações vindas do formulário
                $id     =                     addslashes($info[0]);
                $forn   =    trim(addslashes(utf8_decode($info[1])));        // forn
                $cod   =     trim(addslashes(utf8_decode($info[2]))).$sigla; // cod
                $prod   =    trim(addslashes(utf8_decode($info[3])));        // prod
                $custo   =           floatval(addslashes($info[4]));         // custo
                $venda   =           floatval(addslashes($info[5]));         // venda
                $unid   =    trim(addslashes(utf8_decode($info[6])));        // unid
                $granel   =  trim(addslashes(utf8_decode($info[7])));        // granel
                $qtdatual   =        floatval(addslashes($info[8]));         // qtd
                $qtdmin   =          floatval(addslashes($info[9]));         // qtd min
                $local  =    trim(addslashes(utf8_decode($info[10])));       // localiz
                $ncm  =      trim(addslashes(utf8_decode($info[11])));       // ncm
                $observ  =   trim(addslashes(utf8_decode($info[12])));       // observ
                $altera = addslashes($info[13])." | ".ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERACOES >> ".addslashes($info[14]);

                $sql =  "UPDATE estoque SET ".
                        "fornecedor = '$forn', codigo = '$cod', produto = '$prod', valor_custo = '$custo', valor_venda = '$venda', ".
                        "unidade = '$unid', venda_a_granel = '$granel', quant_atual = '$qtdatual', quant_min = '$qtdmin', ".
                        "localizacao = '$local', ncm = '$ncm', observacao = '$observ', alteracoes = '$altera' ".
                        "WHERE id = '$id' AND id_empresa = '$empresa'";
                
//                echo $sql; exit;
                $resp = self::db()->query($sql);

                if($resp->rowCount()<=0){
                    $resp = 0;
                }else{
                    $resp = $resp->rowCount();
                }
                return $resp;
            }    
        }           
    }
    
}
