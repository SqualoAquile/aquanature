<?php
class Relatorioorcamentositens extends model {

    protected $config;
    protected $table = "orcamentositens";
    protected $permissoes;
    protected $shared;

    public function __construct() {
        global $config;
        $this->config = $config;
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

    public function montaDataTable() {

        $index = 0;

        foreach ($this->shared->nomeDasColunas() as $key => $value) {
            if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") {
                if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "acoes") {

                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($id, $row) {
                            return $this->shared->formataacoes($id, $row);
                        }
                    ];
                    
                // FORMATAÇÃO DE NÚMEROS E DATAS NA TABELA
                } elseif (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "data") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            if(empty(strtotime($d)) || $d == "0000-00-00"){
                                return '';
                            }else{
                                return date( 'd/m/Y', strtotime($d));
                            }
                        }
                    ];    
                } elseif (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "monetario") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            return "R$  " .number_format($d,2,",",".");
                        }
                    ];
                } elseif (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "porcentagem") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            return number_format($d, 2, ",", ".") . "%";
                        }
                    ]; 
                } elseif (array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "table") {
                    
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {

                            $return_contatos = "";

                            if (strlen($d)) {

                                $format_contato = str_replace("][", "|", $d);
                                $format_contato = str_replace(" *", ",", $format_contato);
                                $format_contato = str_replace("[", "", $format_contato);
                                $format_contato = str_replace("]", "", $format_contato);
    
                                $contatos = explode("|", $format_contato);
    
                                $first_contato = $contatos[0];
                                $resto_contatos = array_slice($contatos, 1);

                                if (count($contatos) > 1) {

                                    // Coloca cada contato que ficará escondido, em volta de uma div
                                    // Usaremos isso para depois filtrar a busca e deixar visível os contatos que o usuario esta filtrando
                                    $resto_contatos = implode('', array_map(
                                        function ($resto_contato) {
                                            return sprintf("<div class='contatos-escondidos'>%s</div>", $resto_contato);
                                        },
                                        $resto_contatos
                                    ));

                                    $return_contatos = '
                                        <div class="contatos-filtrados d-flex">
                                            <button class="btn btn-sm btn-link text-info" type="button" data-toggle="collapse" data-target="#collapseContato' . $row["id"] . '" aria-expanded="false" aria-controls="collapseContato' . $row["id"] . '">
                                                <i class="fas fa-chevron-circle-down"></i>
                                            </button>
                                            <div>
                                                <span>' . $first_contato . '</span>
                                                <div class="collapse" id="collapseContato' . $row["id"] . '">
                                                    ' . $resto_contatos . '
                                                </div>
                                            </div>
                                        </div>
                                    ';
                                } else {
                                    $return_contatos = '<div class="ml-3 pl-3">' . $first_contato . '</div>';
                                }
                            }
                            return $return_contatos;
                        }
                    ]; 
                } else {
                    $columns[] = [
                        "db" => ucwords( $value["Field"] ),
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            return ucwords($d);
                        }
                    ]; 
                }
                $index++;
            }
            
        };

        return Ssp::complex($_POST, $this->config, $this->table, "id", $columns, null, "situacao='ativo' AND data_aprovacao<>''");
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

    public function getRelacionalDropdown($request) {

        if ($request["tabela"]) {
            $tabela = trim($request["tabela"]);
            $tabela = addslashes($tabela);
        }

        $sql = "SELECT * FROM " . $tabela . " WHERE situacao = 'ativo'";

        $sql = self::db()->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
}