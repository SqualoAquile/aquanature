<?php
class Relatorioordensservico extends model {

    protected $table = "ordemservico";
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

  
    public function excluirChecados($request) {

        $checados = $request["checados"];
        
        if (!empty($checados)) {
            
            $ipcliente = $this->permissoes->pegaIPcliente();
            $alteracoes = " | " . ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

            $idImploded = implode(",", $checados);

            $stringUpdate = "UPDATE " . $this->table . " SET situacao='excluido', alteracoes=CONCAT(alteracoes, '" . $alteracoes . "') WHERE id IN (" . $idImploded . ")";
            
            self::db()->query($stringUpdate);

            return self::db()->errorInfo();
        }
    }

    public function adicionar($request) {

        $ipcliente = $this->permissoes->pegaIPcliente();

        $sql = '';
        foreach ($request as $linha => $arrayRegistro) {

            $arrayRegistro["alteracoes"] = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
            $arrayRegistro["situacao"] = "ativo";
            
            $keys = implode(",", array_keys($arrayRegistro));
            $values = "'" . implode("','", array_values($this->shared->formataDadosParaBD($arrayRegistro))) . "'";
            
            $sql .= "INSERT INTO " . $this->table . " (" . $keys . ") VALUES (" . $values . ");";               
        }
        
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

    public function taxaSeguroOperacional() {

        $taxa = 0;
        $sql = "SELECT valor as taxa FROM parametros WHERE parametro='taxa_seg_op'";
        $sql = self::db()->query($sql);

        if($sql){
            $sql = $sql->fetch();
            $taxa = $sql['taxa'];
            $taxa = strval($taxa);
            $taxa = str_replace("%","",$taxa);
            $taxa = str_replace(",",".",$taxa);
            $taxa = floatval($taxa)/100;
        }else{
            $taxa = floatval(0);
        }

        return $taxa;
    }

    public function graficoOrcamentosXvendas($interval_datas){
        
        if(count($interval_datas) == 1){
			$dt1 = 	$interval_datas[0];
			$dt2 =  $interval_datas[0];
		}else{
			$dt1 = $interval_datas[0];
			$dt2 = $interval_datas[count($interval_datas)-1];
		}
     
        $sql1 = "SELECT data_emissao , SUM(valor_total) as total, COUNT(data_emissao) as qtd FROM `orcamentos` WHERE situacao='ativo' AND data_emissao BETWEEN '$dt1' AND '$dt2' GROUP BY data_emissao";
        
        $sql1 = self::db()->query($sql1);
        
        if($sql1->rowCount()>0){
            $orcamentos = $sql1->fetchAll();
        }else{
            $orcamentos = array();
        }

        $orcs = array();
        $qtdorcs = array();
        if (count($orcamentos) > 0 ){
            for($i = 0; $i < count($orcamentos); $i++){
                for($j = 0; $j < count($interval_datas); $j++ ){
                    if($interval_datas[$j] == $orcamentos[$i][0]){
                        
                        $orcs[$interval_datas[$j]] = floatval($orcamentos[$i][1]);
                        $qtdorcs[$interval_datas[$j]] = intval($orcamentos[$i][2]);
                    }
                }
            }

        }else{

            for($j = 0; $j < count($interval_datas); $j++ ){
                $orcs[$interval_datas[$j]] = floatval(0);
                $qtdorcs[$interval_datas[$j]] = intval(0);
            }
        }

		// Verifica se as datas do $interval_datas existem no array $orcs
		for($j = 0; $j < count($interval_datas); $j++ ){
			if (array_key_exists($interval_datas[$j],$orcs) == 0){
                $orcs[$interval_datas[$j]] = 0;
                $qtdorcs[$interval_datas[$j]] = 0;
			}
        }

		// Ordena o array pela ordem das keys
        ksort($orcs);
        ksort($qtdorcs);

		//reescreve as chave do array , para datas no padrão brasileiro
		foreach ($orcs as $key => $value) {
			$aux = explode('-',$key);
			$aux = $aux[2].'/'.$aux[1].'/'.$aux[0];
			unset($orcs[$key]);
			$orcs[$aux] = $value;
        }

        foreach ($qtdorcs as $key => $value) {
			$aux = explode('-',$key);
			$aux = $aux[2].'/'.$aux[1].'/'.$aux[0];
			unset($qtdorcs[$key]);
			$qtdorcs[$aux] = $value;
        }

        ///// RECEITAS

        $sql2 = "SELECT data_aprovacao , SUM(valor_final) as total, COUNT(data_aprovacao) as qtd FROM `ordemservico` WHERE situacao='ativo' AND data_aprovacao BETWEEN '$dt1' AND '$dt2' GROUP BY data_aprovacao";
        
        $sql2 = self::db()->query($sql2);
        
        if($sql2->rowCount()>0){
            $ordensserv = $sql2->fetchAll();
        }else{
            $ordensserv = array();
        }

        $os = array();
        $qtdos = array();
        if (count($ordensserv) > 0 ){
            for($i = 0; $i < count($ordensserv); $i++){
                for($j = 0; $j < count($interval_datas); $j++ ){
                    if($interval_datas[$j] == $ordensserv[$i][0]){
                        
                        $os[$interval_datas[$j]] = floatval($ordensserv[$i][1]);
                        $qtdos[$interval_datas[$j]] = intval($ordensserv[$i][2]);
                    }
                }
            }

        }else{

            for($j = 0; $j < count($interval_datas); $j++ ){
                $os[$interval_datas[$j]] = floatval(0);
                $qtdos[$interval_datas[$j]] = intval(0);
            }
        }

		// Verifica se as datas do $interval_datas existem no array $despesas
		for($j = 0; $j < count($interval_datas); $j++ ){
			if (array_key_exists($interval_datas[$j],$os) == 0){
                $os[$interval_datas[$j]] = 0;
                $qtdos[$interval_datas[$j]] = 0;
			}
        }

		// Ordena o array pela ordem das keys
        ksort($os);
        ksort($qtdos);

		//reescreve as chave do array , para datas no padrão brasileiro
		foreach ($os as $key => $value) {
			$aux = explode('-',$key);
			$aux = $aux[2].'/'.$aux[1].'/'.$aux[0];
			unset($os[$key]);
			$os[$aux] = $value;
			
        }

        foreach ($qtdos as $key => $value) {
			$aux = explode('-',$key);
			$aux = $aux[2].'/'.$aux[1].'/'.$aux[0];
			unset($qtdos[$key]);
			$qtdos[$aux] = $value;
			
        }

		$data = array();
		$data[0] = $orcs;
        $data[1] = $qtdorcs;
        $data[2] = $os;
        $data[3] = $qtdos;
        
		return $data; 
		
    }
    
}