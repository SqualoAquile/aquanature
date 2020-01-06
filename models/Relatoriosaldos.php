<?php
class Relatoriosaldos extends model {

    protected $table = "controlesaldos";
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

    public function selectMeses(){

        $retorno = [];

        $sql = "SELECT mes_ref,mes_ano FROM `controlesaldos` WHERE situacao='ativo' group BY MONTH(mes_ano)";
        $sql = self::db()->query($sql);

        if($sql->rowCount()>0){
            $i=0;
            $sql = $sql->fetchAll(PDO::FETCH_ASSOC);
            $retorno = $sql;
        }else{
            $retorno = false;
        }

        for ($i=0; $i < count($retorno); $i++) { 
            $data = explode("-",$retorno[$i]["mes_ano"]);
            $dataAux = $data[2] . "/" . $data[1] . "/" . $data[0];
            $retorno[$i]["mes_ano"] = $dataAux;
        }

        return $retorno;

    }

    public function saldosMeseAno($request){
        
        $interval_meses = $request['intervaloMeses'];

        if(count($interval_meses) == 1){
			$dt1 = 	$interval_meses[0];
			$dt2 =  $interval_meses[0];
		}else{
			$dt1 = $interval_meses[0];
			$dt2 = $interval_meses[count($interval_meses)-1];
        }

        // echo 'inicio ano: '.$dataInicioAno.' \n mes anterior: '.$dataAtual; exit;

        $sql1 = "SELECT mes_ano, saldo_total_final FROM `controlesaldos` WHERE situacao = 'ativo' AND mes_ano BETWEEN '$dt1' and '$dt2' ";
        
        // echo $sql1; exit;
        $sql1 = self::db()->query($sql1);

        if( $sql1->rowCount() > 0 ){
            $saldosAno = $sql1->fetchAll();
        }else{
            $saldosAno = array();
        }

        $saldos = array();
        if (count($saldosAno) > 0 ){
            for($i = 0; $i < count($saldosAno); $i++){
                for($j = 0; $j < count($interval_meses); $j++ ){
                    if($interval_meses[$j] == $saldosAno[$i][0]){
                        
                        $saldos[$interval_meses[$j]] = floatval($saldosAno[$i][1]);
                    }
                }
            }

        }else{

            for($j = 0; $j < count($interval_meses); $j++ ){
                $saldos[$interval_meses[$j]] = floatval(0);
            }
        }

		// Verifica se as datas do $interval_meses existem no array $saldos
		for($j = 0; $j < count($interval_meses); $j++ ){
			if (array_key_exists($interval_meses[$j],$saldos) == 0){
				$saldos[$interval_meses[$j]] = 0;
			}
        }

		// Ordena o array pela ordem das keys
		ksort($saldos);

		//reescreve as chave do array , para datas no padrão brasileiro
		foreach ($saldos as $key => $value) {
			$aux = explode('-',$key);
			$aux = $aux[2].'/'.$aux[1].'/'.$aux[0];
			unset($saldos[$key]);
			$saldos[$aux] = $value;
			
        }

        // até aqui o vetor de saldos está OK - pode ser enviado pro gráfico
        // print_r($saldos);
        $p = count($saldos);
        foreach ($saldos as $key => $value) {
            if($p > 1){
                $saldoTotalMesAnterior = $value;
            }
            $p--;

        }
       
        $dt1 = $dt2;
        $dt2 = date('Y-m-d');

        // echo $saldoTotalMesAnterior . ' ----- ' . $dt1 . ' ------- '. $dt2; ;

        $sql2 = "SELECT SUM(valor_total) as total FROM `fluxocaixa` WHERE situacao='ativo' AND despesa_receita = 'Despesa' AND status = 'Quitado' AND data_quitacao BETWEEN '$dt1' AND '$dt2' ";
        
        // echo $sql2;
        $sql2 = self::db()->query($sql2);
        
        if($sql2->rowCount()>0){
            $sql2 = $sql2->fetch();
            $despesaRealizada = floatval($sql2['total']);
        }else{
            $despesaRealizada = floatval(0);
        }

        $sql3 = "SELECT SUM(valor_total) as total FROM `fluxocaixa` WHERE situacao='ativo' AND despesa_receita = 'Receita' AND status = 'Quitado' AND data_quitacao BETWEEN '$dt1' AND '$dt2' ";
        
        $sql3 = self::db()->query($sql3);
        
        if($sql3->rowCount()>0){
            $sql3 = $sql3->fetch();
            $receitaRealizada = floatval($sql3['total']);
        }else{
            $receitaRealizada = floatval(0);
        }
        
        
        $resultadoMes = $receitaRealizada - $despesaRealizada;
        $saldoAtualizado = $saldoTotalMesAnterior + $resultadoMes;

        // echo 'receita: '.$receitaRealizada. ' ---------- despesa:  '.$despesaRealizada. ' -------- resultado:  '.$resultadoMes;
		$data = array();
		$data[0] = $saldos;
        $data[1] = array("saldoAnterior"=>$saldoTotalMesAnterior, "resultadoMesAtual"=>$resultadoMes,  "saldoAtual" =>  $saldoAtualizado);
        
        //  print_r($data); exit;
		return $data; 
		
    }
}