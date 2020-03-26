<?php
class Fechamento extends model {

    protected $table = "fechamento";
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

    public function fechamentoMensalCondominio($request){
        
        $dt_fch = addslashes($request['dt_fechamento']);
        $condominio = addslashes($request['condominio']);
        $dialimite = addslashes($request['dialimite']);
        $dtaux = explode('-',$dt_fch);
        $dataLimiteIsencaoMin = $dtaux[0].'-'.$dtaux[1].'-'.$dialimite;

        if( intval($dtaux[1]) == intval(1) || intval($dtaux[1]) == intval(3) || intval($dtaux[1]) == intval(5)
         || intval($dtaux[1]) == intval(7) || intval($dtaux[1]) == intval(8) || intval($dtaux[1]) == intval(10) || intval($dtaux[1]) == intval(12) ){
        
            $dataLimiteIsencaoMax = $dtaux[0].'-'.$dtaux[1].'-31';

        }else if(   intval($dtaux[1]) == intval(4) || intval($dtaux[1]) == intval(6) || 
                    intval($dtaux[1]) == intval(9) || intval($dtaux[1]) == intval(11) ){

            $dataLimiteIsencaoMax = $dtaux[0].'-'.$dtaux[1].'-30';
        }else{

            $dataLimiteIsencaoMax = $dtaux[0].'-'.$dtaux[1].'-28';
        }    
        
        // print_r($dataLimiteIsencaoMin);print_r($dataLimiteIsencaoMax);  exit;
        $array = array();
        
        // verificar na tabela de cartões todos que estão ativos e cancelados até a data limite 
        $sql1 = "SELECT * FROM `cartoes` WHERE ( situacao = 'ativo' AND condominio LIKE '%$condominio%' AND  situacaoatual = 'Ativo' ) OR ( situacao = 'ativo' AND condominio LIKE '%$condominio%' AND ( situacaoatual = 'Cancelado' AND dt_cancelamento BETWEEN '$dataLimiteIsencaoMin' AND '$dataLimiteIsencaoMax' )) ORDER BY situacaoatual, bloco, ap, nome_usuario ASC";

        // print_r($sql1); exit;
        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();

        $qtdAtivos = 0;
        $qtdCanc = 0;
        $valorTotal = 0;
        $precoMedio = 0;
        $cobrados = '';

        if($sql1->rowCount() > 0){  
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);
            // print_r($nomesAux); exit;
            foreach ($nomesAux as $key => $value) {
                $value["situacaoatual"] == 'Ativo' ? $qtdAtivos++ : $qtdCanc++;
                $valorTotal = floatval($valorTotal) + floatval($value['mensalidade']);
                $cobrados .= '['. ucfirst($value["nome_usuario"]) .' * '. ucfirst($value["bloco"]) .' * '. ucfirst($value["ap"]) .' * '. ucfirst($value["situacaoatual"]) .']';      
            }
        }

        if( intval( $qtdAtivos + $qtdCanc ) > 0 ){
            $precoMedio = floatval( floatval($valorTotal) / intval( $qtdAtivos + $qtdCanc ) );

            $array = array(
                "mes_ref" => $dtaux[0].'/'.$dtaux[1],
                "condominio" => $condominio,
                "qtd_ativos" => $qtdAtivos,
                "qtd_cancelados" => $qtdCanc,
                "qtd_cobrados" => intval( $qtdAtivos + $qtdCanc ),
                "preco_medio" => $precoMedio,
                "valor_total" => floatval( $valorTotal ),
                "cobrados" => $cobrados
            );
        }
        // print_r($array); exit;
        return $array;
    }

    public function condominiosSemFechamento($request){
        
        $dt_fch = addslashes($request['dt_fechamento']);
        $dtaux = explode('-',$dt_fch);
        $dataLimiteIsencaoMin = $dtaux[0].'-'.$dtaux[1].'-01';

        if( intval($dtaux[1]) == intval(1) || intval($dtaux[1]) == intval(3) || intval($dtaux[1]) == intval(5)
         || intval($dtaux[1]) == intval(7) || intval($dtaux[1]) == intval(8) || intval($dtaux[1]) == intval(10) || intval($dtaux[1]) == intval(12) ){
        
            $dataLimiteIsencaoMax = $dtaux[0].'-'.$dtaux[1].'-31';

        }else if(   intval($dtaux[1]) == intval(4) || intval($dtaux[1]) == intval(6) || 
                    intval($dtaux[1]) == intval(9) || intval($dtaux[1]) == intval(11) ){

            $dataLimiteIsencaoMax = $dtaux[0].'-'.$dtaux[1].'-30';
        }else{

            $dataLimiteIsencaoMax = $dtaux[0].'-'.$dtaux[1].'-28';
        }    
        
        // print_r($dataLimiteIsencaoMin);echo '  ---  ';print_r($dataLimiteIsencaoMax);  exit;
        $sql1 = "SELECT * FROM `condominios` WHERE situacao = 'ativo' ORDER BY nome_fantasia ASC";

        // print_r($sql1); exit;
        $sql1 = self::db()->query($sql1);
        $options = array();

        if($sql1->rowCount() > 0){  
            
            $condominios = $sql1->fetchAll(PDO::FETCH_ASSOC);

            if ( count($condominios) > 0 ){
                // verificar na tabela de fechamentos os condominios que não fizeram ainda nesse periodo 
                $sql2 = "SELECT * FROM `fechamento` WHERE situacao = 'ativo' AND data_fechamento BETWEEN '$dataLimiteIsencaoMin' AND '$dataLimiteIsencaoMax' ORDER BY condominio ASC";

                $sql2 = self::db()->query($sql2);
        
                if($sql2->rowCount() > 0){  
                    $condFxAux = $sql2->fetchAll(PDO::FETCH_ASSOC);
                    $condominiosFechados = array();
                    
                    foreach ($condFxAux as $key => $value) {
                        $condominiosFechados[ trim(strtolower($value['condominio'])) ] = $value['condominio'];    
                    }
                    
                    foreach ($condominios as $key => $value) {
                        if( !array_key_exists(trim(strtolower($value['nome_fantasia'])), $condominiosFechados) ){
                            $options[] = $value['nome_fantasia'];
                        }
                    }
                }else{
                    foreach ($condominios as $key => $value) {
                        $options[] = $value['nome_fantasia'];                        
                    }
                }    
            }
        }    
        
        // print_r($options); exit;
        return $options;
    }

}