<?php

class Shared extends model {

    protected $config;
    protected $table;

    public function __construct($table) {
        global $config;
        $this->config = $config;
        $this->table = $table; 
    }

    public function formataacoes($id, $row){

        $stringBtn = '';

        if ($this->table == "fluxocaixa") {
                
            $stringBtn .=  '<input type="checkbox" name="checkboxFluxoCaixa" value="' . $id . '">';
            if( in_array( $this->table.'_edt' , $_SESSION["permissoesUsuario"]) ){
                if (strtolower($row["Status"]) != "quitado") {
                    $stringBtn .= '<button class="btn btn-primary btn-sm mx-1" id="editar" data-id="' . $id . '"><i class="fas fa-edit"></i></button>';
                }
            }

        } else {

            $stringBtn .= '<form method="POST">';
            
            if( in_array( $this->table.'_edt' , $_SESSION["permissoesUsuario"]) ){
                $stringBtn .=  '<a href="' . BASE_URL . '/' . $this->table . '/editar/' . $id . '" class="btn btn-primary btn-sm mx-1"><i class="fas fa-edit"></i></a>';
            }
    
            if(in_array($this->table."_exc", $_SESSION["permissoesUsuario"])){
                $stringBtn .= '<input type="hidden" name="id" value="'. $id .'"><button type="submit" onclick="return confirm(\'Tem Certeza?\')" class="btn btn-sm btn-danger mx-1"><i class="fas fa-trash-alt"></i></button>';
            }

            // btn de check na entrega distribuidor
            if( ($this->table == "pedidos") && in_array( $this->table.'_edt' , $_SESSION["permissoesUsuario"]) && in_array( 'podetudo_ver' , $_SESSION["permissoesUsuario"]) ){
                $stringBtn .=  '<a href="' . BASE_URL . '/' . $this->table . '/check/' . $id . '" class="btn btn-warning btn-sm mx-1" onclick="return confirm(\'Tem Certeza?\')" ><i class="fas fa-check"></i></a>';
            }
            

            if(($this->table == "ordemservico") && in_array( $this->table.'_ver' , $_SESSION["permissoesUsuario"]) ){
                $stringBtn .=  '<button type="button" class="btn btn-warning btn-sm mx-1" data-id="' . $id . '" data-toggle="modal" data-target="#modalConfImp"><i class="fas fa-print"></i></button>';
            }      
            
            $stringBtn .= '</form>';
        }
        
        return $stringBtn;
    }

    public function montaDataTable($campoPesq = null, $valorPesq = null) {

        $index = 0;

        foreach ($this->nomeDasColunas() as $key => $value) {
            if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") {
                if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "acoes") {

                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($id, $row) {
                            return $this->formataacoes($id, $row);
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

        $clausulaWhere = "situacao='ativo'";
        if($campoPesq != null && $valorPesq != null){
            $clausulaWhere .= " AND $campoPesq = '$valorPesq'";
        }

        return Ssp::complex($_POST, $this->config, $this->table, "id", $columns, null, $clausulaWhere);
    }

    public function unico($campo, $valor) {
        $array = array();
        $sql = "SELECT " . $campo . " FROM $this->table WHERE $campo = '$valor' AND situacao = 'ativo'";      
        $sql = self::db()->query($sql);
        if($sql->rowCount()>0){
            $array = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $array;
    }

    public function getRelacionalDropdown($request) {

        if ($request["campo"]) {
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);
        }

        $sql = "SELECT " . $request["campo"] . " FROM " . $this->table . " WHERE situacao = 'ativo'";

        $sql = self::db()->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function nomeDasColunas(){

        if ($this->table == "relatoriofluxocaixa"){
            $this->table = "fluxocaixa";
        } else if ( $this->table == "relatorioorcamentos"){
            $this->table = "orcamentos";
        } else if ( $this->table == "relatoriosaldos"){
            $this->table = "controlesaldos";
        } else if ( $this->table == "relatorioordensservico"){
            $this->table = "ordemservico";
        } else if ( $this->table == "relatorioorcamentositens"){
            $this->table = "orcamentositens";
        }
        
        $sql = self::db()->query("SHOW FULL COLUMNS FROM " . $this->table);
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
         
        foreach ($result as $key => $value) {
            $result[$key]["Comment"] = json_decode($result[$key]["Comment"], true);
                
            // CRIA UMA CHAVE NOVA NO VETOR COM A INFORMAÇÃO DO TAMANHO MÁXIMO QUE O CAMPO PODE RECEBER, ALIMENTAR O MAXLEGTH
            $tipo = $result[$key]["Type"];
            $inicio = intval( strpos($tipo,"(") + 1);
            $tamanho = intval( intval(strpos($tipo, ")")) - $inicio); 
            $maxl = intval( substr ( $tipo , $inicio , $tamanho));
            $result[$key]["tamanhoMax"] = $maxl != 0 ? $maxl : '' ;          

            // PEGAS AS INFORMAÇÕES DA TABELA RELACIONAL (UNIDIMENSIONAL) NECESSÁRIA PARA MONTAR AS OPÇÕES DO CAMPO NO FORM (SELECT E CHECKBOX)
            $lista = array();
            $arrayAux = array();

            // echo '<br>nome coluna: '. $result[$key]['Field']. '<br>';
            // echo '<br>tipo coluna: '. $result[$key]['type']. '<br>';
            if(array_key_exists("type", $result[$key]["Comment"]) && $result[$key]["Comment"]["type"] == "relacional"){

                
                $tabela =  lcfirst($result[$key]["Comment"]["info_relacional"]["tabela"]);
                $campo = lcfirst($result[$key]["Comment"]["info_relacional"]["campo"]);

                if( !empty($tabela) && !empty($campo) ){

                    $sql = "SELECT id, ". $campo ." FROM  ". $tabela ." WHERE situacao = 'ativo'";      
                    $sql = self::db()->query($sql);

                    if($sql->rowCount()>0){
                        $arrayAux = $sql->fetchAll(PDO::FETCH_ASSOC); 

                        foreach ($arrayAux as $chave => $valor){
                            $lista[] = [
                                "id" => $valor["id"], 
                                "$campo" => ucwords($valor["$campo"])
                            ];
                        }

                        $result[$key]['Comment']['info_relacional']['resultado'] = $lista;
                    }

                }else{
                    $result[$key]['Comment']['info_relacional']['resultado'] = $lista;
                }
                   
            }
            if(array_key_exists("type", $result[$key]["Comment"]) && $result[$key]["Comment"]["type"] == "checkbox"){

                $tabela =  lcfirst($result[$key]["Comment"]["info_relacional"]["tabela"]);
                $campo = lcfirst($result[$key]["Comment"]["info_relacional"]["campo"]);

                $sql = "SELECT ". $campo ." FROM  ". $tabela ." WHERE situacao = 'ativo'";      
                $sql = self::db()->query($sql);

                if($sql->rowCount()>0){
                    $arrayAux = $sql->fetchAll(PDO::FETCH_ASSOC); 
                    
                    foreach ($arrayAux as $chave => $valor){
                        $lista[] = ucwords($valor["$campo"]);
                    }

                    $result[$key]['Comment']['info_relacional']['resultado'] = $lista;
                }
            }        

        }
        
        return $result;
    } 

    public function pegarListas($table) {
        $array = array();
        $sql = "SELECT * FROM " . $table . " WHERE situacao = 'ativo' ORDER BY id DESC";
        $sql = self::db()->query($sql);
        if($sql->rowCount()>0){
            $array = $sql->fetchAll(); 
        }
        return $array; 
    }

    public function gerarGraficoFiltro($requisicao){
        $index = 0;
        foreach ($this->nomeDasColunas() as $key => $value) {
            if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") {
                if (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "data") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            if(empty(strtotime($d))){
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
                                                <i class="fas fa-plus-circle"></i>
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

        return Ssp::complex_graficos_count($requisicao['columns'], $this->config, $this->table, "id", $columns, null, "situacao='ativo'", $requisicao['campo_sum'], $requisicao['campo_group']);
        // return Ssp::complex_graficos2($requisicao['columns'], $this->config, $this->table, "id", $columns, null, "situacao='ativo'", $requisicao['campo_sum'], $requisicao['campo_group'], $requisicao['opcao_group'], $requisicao['intervalo']);
    }

    public function gerarGraficoFiltroIntervaloDatas($requisicao){
        $index = 0;
        foreach ($this->nomeDasColunas() as $key => $value) {
            if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") {
                if (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "data") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            if(empty(strtotime($d))){
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
                                                <i class="fas fa-plus-circle"></i>
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
        
        return Ssp::complex_graficosIntervaloDatas($requisicao['columns'], $this->config, $this->table, "id", $columns, null, "situacao='ativo'", $requisicao['coluna'], $requisicao['intervalo']);
    }

    public function gerarGraficoFiltroIntervaloDatas2($requisicao){
        $index = 0;
        foreach ($this->nomeDasColunas() as $key => $value) {
            if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") {
                if (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "data") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            if(empty(strtotime($d))){
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
                                                <i class="fas fa-plus-circle"></i>
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
        
        return Ssp::complex_graficosIntervaloDatas2($requisicao['columns'], $this->config, $this->table, "id", $columns, null, "situacao='ativo'", $requisicao['coluna'], $requisicao['intervalo']);
    }

    public function gerarGraficoSaldos($requisicao){
        $index = 0;
        foreach ($this->nomeDasColunas() as $key => $value) {
            if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") {
                if (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "data") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            if(empty(strtotime($d))){
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
                                                <i class="fas fa-plus-circle"></i>
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

        return Ssp::complex_graficosSaldos($requisicao['columns'], $this->config, $this->table, "id", $columns, null, "situacao='ativo'", $requisicao['coluna'], $requisicao['dt1'],$requisicao['dt2'] );
    }

    public function top5produtos($requisicao){
        $index = 0;
        foreach ($this->nomeDasColunas() as $key => $value) {
            if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") {
                if (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "data") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            if(empty(strtotime($d))){
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
                                                <i class="fas fa-plus-circle"></i>
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

        return Ssp::complex_graficoTop5Produtos($requisicao['columns'], $this->config, $this->table, "id", $columns, null, "situacao='ativo'");
    }

    public function formataDadosParaBD($registro) {
        
        if(isset($registro) && !empty($registro)){
            $array = array();
            $nomeColunas = $this->nomeDasColunas();
            // busca o nome dos campos das colunas para ver qual o tipo a ser formatado
            $primeiroElemento = array_shift($nomeColunas); // usado só para retirar o primeiro elemento do array que é o ID
            $i=0;
            // print_r($nomeColunas); exit;
            // print_r($registro); exit;
            foreach ($registro as $chave => $valor){
                // echo $chave.'  ----  '.$nomeColunas[$i]['Field'].'<br>';
                //testo se é o valor referente ao mesmo campo do nome das colunas
                if($nomeColunas[$i]['Field'] == $chave){ 

                    if($nomeColunas[$i]['Type'] == 'date'){
                        if(empty($registro[$chave])){
                            
                            $array[$chave] = "0000-00-00";    
                        }else{
                            //formatação de data padrão internacional
                            $dtaux = explode("/",addslashes($registro[$chave]));
                            $array[$chave] = $dtaux[2]."-".$dtaux[1]."-".$dtaux[0];
                        }
                        
                    }elseif (substr_count($nomeColunas[$i]['Type'], "float") > 0){
                        //formatação de float padrão internacional "." - divisor decimal e "," - divisor milhão
                        $array[$chave]  = floatval(str_replace(",",".",str_replace(".", "",addslashes($registro[$chave]))));

                    }elseif (substr_count($nomeColunas[$i]['Type'], "int") > 0 ){
                        // formatação de inteiros    
                        $array[$chave] = intval(addslashes($registro[$chave]));

                    }else{
                        // só aplica o addslashes nos registros do tipo varchar e text
                        $array[$chave] = addslashes($registro[$chave]);
                    } 

                } else {
                    echo $nomeColunas[$i]['Field'] . "<br>";
                    echo $chave . "<br><br>";
                }
                $i++;
            }
            // print_r($array); exit;
            return $array;
        }
    }

    public function formataDadosParaBD2($registro) {
        
        if(isset($registro) && !empty($registro)){
            $array = array();
            $nomeColunas = $this->nomeDasColunas();
            
            $colunasAux = array();
            $chavesRegistro = array();
            foreach ($nomeColunas as $key => $value) {
                $colunasAux[ $value['Field'] ] = $value['Type'];
            }
            $primerAux = array_shift($colunasAux);
       
            // busca o nome dos campos das colunas para ver qual o tipo a ser formatado
            $primeiroElemento = array_shift($nomeColunas); // usado só para retirar o primeiro elemento do array que é o ID
            $i=0;
            // print_r($nomeColunas); exit;
            // print_r($registro); exit;
            $arrayRetorno = array();
                    // print_r($colunasAux); exit;
            foreach ($colunasAux as $keyCol => $valueCol) {
                // echo 'chave: '.$keyCol.'   -   valor:  '.$valueCol.'<br><br>';
                if( array_key_exists($keyCol, $registro) ){
                    if($valueCol == 'date'){
                        if(empty($registro[$keyCol])){
                            
                            $arrayRetorno[$keyCol] = "0000-00-00";    
                        }else{
                            //formatação de data padrão internacional
                            $dtaux = explode("/",addslashes($registro[$keyCol]));
                            $arrayRetorno[$keyCol] = $dtaux[2]."-".$dtaux[1]."-".$dtaux[0];
                        }
                        
                    // }elseif (substr_count($registro[$keyCol], "float") > 0){
                    }elseif (substr_count($valueCol, "float") > 0){ 
                        // echo 'float aqui: '.$registro[$keyCol];
                        //formatação de float padrão internacional "." - divisor decimal e "," - divisor milhão
                        $arrayRetorno[$keyCol]  = floatval(str_replace(",",".",str_replace(".", "",addslashes($registro[$keyCol]))));

                    }elseif (substr_count($valueCol, "int") > 0 ){
                        // formatação de inteiros    
                        $arrayRetorno[$keyCol] = intval(addslashes($registro[$keyCol]));

                    }else{
                        // só aplica o addslashes nos registros do tipo varchar e text
                        $arrayRetorno[$keyCol] = addslashes($registro[$keyCol]);
                    } 
                }else{
                    $arrayRetorno[$keyCol] = '';
                }
            }
            
            // print_r($arrayRetorno); exit;
            return $arrayRetorno;
        }
    }

    public function formataDadosDoBD($registro) {
        if(isset($registro) && !empty($registro)){
            $array = array();
            $nomeColunas = $this->nomeDasColunas();        // busca o nome dos campos das colunas para ver qual o tipo a ser formatado
            
            $i=0;
            foreach ($registro as $chave => $valor) {

                //testo se é o valor referente ao mesmo campo do nome das colunas
                if($nomeColunas[$i]['Field'] == $chave){ 

                    if($nomeColunas[$i]['Type'] == 'date'){
                        //formatação de data padrão internacional
                        $dtaux = explode("-",addslashes($registro[$chave]));
                        $array[$chave] = $dtaux[2]."/".$dtaux[1]."/".$dtaux[0];

                    }elseif (substr_count($nomeColunas[$i]['Type'],'float') > 0 ){
                        //formatação de float padrão internacional "." - divisor decimal e "," - divisor milhão
                        $array[$chave]  = number_format(floatval(addslashes($registro[$chave])),2,',','.');

                    }elseif (substr_count($nomeColunas[$i]['Type'], "int") > 0 ){
                        // formatação de inteiros    
                        $array[$chave] = intval(addslashes($registro[$chave]));

                    }else{
                        // só aplica o addslashes nos registros do tipo varchar e text
                        $array[$chave] = $registro[$chave];
                    } 

                }
                $i++;
            }
            return $array;
        }
    }
    
    public function labelTabela() {
        $sql = "SELECT table_comment as table_comment FROM INFORMATION_SCHEMA.TABLES WHERE table_name = '" . $this->table."'";
        $sql = self::db()->query($sql);
        $sql = $sql->fetch(PDO::FETCH_ASSOC);
        
        $labels = array();
        $labels =  json_decode($sql["table_comment"], true);

        return $labels;
    }

    public function idAtivo($id){
        
        if(!empty($id)) {
    
            $id = addslashes(trim($id));
            
            //se não achar nenhum usuario associado ao grupo - pode deletar, ou seja, tornar o cadastro situacao=excluído
            $sql = "SELECT * FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            
            if($sql->rowCount() > 0){  
                return true;
            } else {
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Erro no endereço, você foi redirecionado para ".ucwords($this->table),
                    "class" => "alert-danger"
                ];
                return false;
            }
        }
    }
    
}
?>