<?php
class Desenvolvimento extends model {

    protected $table = "desenvolvimento";
    protected $permissoes;
    protected $shared;

    public function __construct() {
        $this->permissoes = new Permissoes();
        $this->shared = new Shared($this->table);
    }
    
    public function buscaTabela($request) {
        
        $existe = false;

        // echo 'lalalala'; exit;

        if( !empty($request) ){
            $nomeTabela = addslashes( $request['tabela'] );
            $arrayAux = array();

            $sql = "SHOW TABLES";
            $sql = self::db()->query($sql);
            
            if($sql->rowCount()>0){
                $tabelas = $sql->fetchAll(PDO::FETCH_ASSOC);

                $nome = $GLOBALS['config']['db'];

                foreach ($tabelas as $key => $value) {
                    if( trim(strtolower( $value['Tables_in_'.$nome] )) == trim(strtolower( $nomeTabela ))  ){
                        $existe = true;
                    }
                }
            }
        }
        return $existe; 
    }

    public function buscaTabelasBD() {
        // busca quais as tabelas que existem no BD
        // busca quais dessas tabelas possuem uma estrutura MVC na pasta

        $sql = "SHOW TABLES";
        $sql = self::db()->query($sql);
        
        $nome = $GLOBALS['config']['db'];
        // echo print_r($GLOBALS); exit;
         
        if($sql->rowCount()>0){
            $tabelas = $sql->fetchAll(PDO::FETCH_ASSOC);
            // print_r($tabelas); exit;
            $tabelasDB = array();
            foreach ($tabelas as $key => $value) {
                $tabAtual = '';
                $tabAtual = trim(strtolower( $value['Tables_in_'.$nome] ));
                
                $sql = self::db()->query("SHOW FULL COLUMNS FROM " . $tabAtual);
                $result = $sql->fetchAll(PDO::FETCH_ASSOC);
                 
                foreach ($result as $chave => $valor ) {
                    // $tabelasDB[$tabAtual][] = [
                    //     'nomecampo' => $valor['Field'],
                    //     'tipotamanho' => $valor['Type'],
                    //     'obrigatorio' => $valor['Null'],
                    //     'comentario' => json_decode($valor['Comment'])
                    // ];
                    if ($valor['Null'] == 'NO'){
                        $tabelasDB[$tabAtual][] = "`".$valor['Field']."` ".$valor['Type']." NOT NULL COMMENT '".$valor['Comment']."'";
                         
                    }else{
                        $tabelasDB[$tabAtual][] = "`".$valor['Field']."` ".$valor['Type']." NULL COMMENT '".$valor['Comment']."'";
                    } 
                       
                }
            }
            // print_r($tabelasDB); exit;
            return $tabelasDB;
        }
    }

    public function buscaInfoTabelasBD() {
        
        $sql = "SHOW TABLES";
        $sql = self::db()->query($sql);
        $tabelas = $sql->fetchAll();
        // print_r($tabelas); exit;
        $infosTabelas = [];
        foreach ($tabelas as $key => $value) {
            $sqlB = "SHOW TABLE STATUS WHERE Name='" . $value[0] . "'";
            $sqlB = self::db()->query($sqlB);
            $infoTab = $sqlB->fetchAll();
            // print_r($infoTab[0]); exit;

            $caminho = __FILE__;
            // print_r($caminho); exit;
            // models\Desenvolvimento.php = 26 caracteres
            $dir = substr($caminho, 0, strlen($caminho) - 26);
            $dircontroller = $dir.'controllers/'.$infoTab[0]['Name'].'Controller.php';
            $dirmodel = $dir.'models/'.ucfirst($infoTab[0]['Name']).'.php';
            $dirview = $dir.'views/'.$infoTab[0]['Name'].'.php';
            $dirviewform = $dir.'views/'.$infoTab[0]['Name'].'-form.php';

            // echo '<br>'.'controller'.'<br>'; print_r($dircontroller); echo '<br>';
            // echo '<br>'.'model'.'<br>'; print_r($dirmodel); echo '<br>';
            // echo '<br>'.'view'.'<br>'; print_r($dirview); echo '<br>';
            // echo '<br>'.'view'.'<br>'; print_r($dirviewform); echo '<br>';
            // exit;
            
            
            if ( file_exists($dircontroller) && file_exists($dirmodel) && file_exists($dirview) && file_exists($dirviewform) ){
                $infosTabelas[ $infoTab[0]['Name'] ] = array(
                    'comentario' =>  json_decode( $infoTab[0]['Comment'] ),
                    'mvc_arq' =>  true,
                ); 
                 
            }else{
                $infosTabelas[ $infoTab[0]['Name'] ] = array(
                    'comentario' =>  json_decode( $infoTab[0]['Comment'] ),
                    'mvc_arq' =>  false,
                ); 
            }
         
           
        }
        // print_r($infosTabelas); exit;
        return $infosTabelas;
    }
    
    public function criaTabelaOriginal($request) {
        
        if( !empty($request) ){
            $nomeTabela = addslashes( $request['tabela'] );
            $primeira = $request['query1'] ;
            $segunda =  $request['query2'] ;
            $terceira = $request['query3'] ;

            // print_r($primeira); exit;
            self::db()->query('START TRANSACTION;');

            self::db()->query($primeira);
            $erro1 = self::db()->errorInfo();
            
            self::db()->query($segunda);
            $erro2 = self::db()->errorInfo();

            self::db()->query($terceira);
            $erro3 = self::db()->errorInfo();

            if( empty($erro1[2]) && empty($erro2[2]) && empty($erro3[2])  ){
            
                self::db()->query('COMMIT;');

                // código para criar os arquivos padrão do MVC
                // controller
                $caminho = __FILE__;
                $controllerGenerico = str_replace('\models\Desenvolvimento.php','\controllers\genericoController.php', $caminho);
                $controllerNovo = str_replace('generico', $nomeTabela, $controllerGenerico);
                copy($controllerGenerico, $controllerNovo);

                $arq = file_get_contents($controllerNovo, FILE_TEXT);
                $arq = str_replace( 'class genericoController extends', 'class '.$nomeTabela.'Controller extends' , $arq);
                $arq = str_replace( 'protected $table = "generico"', 'protected $table = "'.$nomeTabela.'"', $arq); 
                file_put_contents($controllerNovo, $arq, FILE_TEXT);

                // model
                $modelGenerico = str_replace('Desenvolvimento', 'Generico', $caminho);
                $modelNovo = str_replace('Generico', ucfirst( $nomeTabela ), $modelGenerico);
                copy($modelGenerico, $modelNovo);

                $arq2 = file_get_contents($modelNovo, FILE_TEXT);
                $arq2 = str_replace( 'class Generico extends', 'class '.ucfirst($nomeTabela).' extends' , $arq2);
                $arq2 = str_replace( 'protected $table = "generico"', 'protected $table = "'.$nomeTabela.'"', $arq2); 
                file_put_contents($modelNovo, $arq2, FILE_TEXT);

                // views
                $viewGenerico = str_replace('\models\Desenvolvimento.php','\views\generico.php', $caminho);
                $viewNovo = str_replace('generico', $nomeTabela, $viewGenerico);
                copy($viewGenerico, $viewNovo);

                $viewFormGenerico = str_replace('\models\Desenvolvimento.php','\views\generico-form.php', $caminho);
                $viewFormNovo = str_replace('generico-form', $nomeTabela.'-form', $viewFormGenerico);
                copy($viewFormGenerico, $viewFormNovo);
                
                // insert permissoes no bancos
                $sql = "INSERT INTO `permissoesparametros`(`id`, `nome`) VALUES (DEFAULT, '".$nomeTabela."_ver'), (DEFAULT, '".$nomeTabela."_add'), (DEFAULT, '".$nomeTabela."_edt'), (DEFAULT, '".$nomeTabela."_exc')";

                self::db()->query($sql);
                // inserir no template                 
                return true;

            }else{

                self::db()->query('ROLLBACK;');
                return false;
            }
        }
    }

    public function criaTabela($request) {
        
        if( !empty($request) ){
            $nomeTabela = addslashes( $request['tabela'] );
            $primeira = $request['query1'] ;
            $segunda =  $request['query2'] ;
            $terceira = $request['query3'] ;

            // print_r($primeira); exit;
            self::db()->query('START TRANSACTION;');

            self::db()->query($primeira);
            $erro1 = self::db()->errorInfo();
            
            self::db()->query($segunda);
            $erro2 = self::db()->errorInfo();

            self::db()->query($terceira);
            $erro3 = self::db()->errorInfo();

            if( empty($erro1[2]) && empty($erro2[2]) && empty($erro3[2])  ){
            
                self::db()->query('COMMIT;');             
                return true;
            }else{

                self::db()->query('ROLLBACK;');
                return false;
            }
        }
    }

    public function editaTabela($request) {
        //CREATE TABLE new_table LIKE old_table; 
        //INSERT new_table SELECT * FROM old_table;

        if( !empty($request) ){
            $nomeTabela = addslashes( $request['tabela'] );
            

            $nomeNovo = $nomeTabela.'_copia_'.date('dmY_his');

            // echo $nomeNovo; exit;

            $copiaTabela = "CREATE TABLE $nomeNovo LIKE $nomeTabela ";
            $insereRegistros = "INSERT $nomeNovo SELECT * FROM $nomeTabela ";
            $deletaTabela = "DROP TABLE `".$nomeTabela."`";;

            // echo '<br>'.$copiaTabela.'<br>';
            // echo '<br>'.$insereRegistros.'<br>';
            // echo '<br>'.$deletaTabela.'<br>';
            

            $recriaTabela = $request['query1'] ;
            $acertaPrimary =  $request['query2'] ;
            $acertaAutoIncrem = $request['query3'] ;

            // echo '<br>'.$primeira.'<br>';
            // echo '<br>'.$segunda.'<br>';
            // echo '<br>'.$terceira.'<br>';exit;

            // print_r($primeira); exit;
            self::db()->query('START TRANSACTION;');

            self::db()->query($copiaTabela);
            $erro1 = self::db()->errorInfo();

            self::db()->query($insereRegistros);
            $erro2 = self::db()->errorInfo();

            self::db()->query($deletaTabela);
            $erro3 = self::db()->errorInfo();

            self::db()->query($recriaTabela);
            $erro4 = self::db()->errorInfo();
            
            self::db()->query($acertaPrimary);
            $erro5 = self::db()->errorInfo();

            self::db()->query($acertaAutoIncrem);
            $erro6 = self::db()->errorInfo();

            if( empty($erro1[2]) && empty($erro2[2]) && empty($erro3[2]) &&
                empty($erro4[2]) && empty($erro5[2]) && empty($erro6[2])  ){
            
                self::db()->query('COMMIT;');             
                return true;
            }else{

                self::db()->query('ROLLBACK;');
                return false;
            }
        }
    }

    public function excluiTabela($request) {
        if( !empty($request) ){
            $nomeTabela = addslashes( $request['tabela'] );
            
            $deletaTabela = "DROP TABLE `".$nomeTabela."`";;

            // print_r($deletaTabela); exit;
            self::db()->query('START TRANSACTION;');

            self::db()->query($deletaTabela);
            $erro = self::db()->errorInfo();

            if( empty($erro[2]) ){
            
                self::db()->query('COMMIT;');             
                return true;
            }else{

                self::db()->query('ROLLBACK;');
                return false;
            }
        }
    }
    
    public function criarMVC($request) {
        
        if( !empty($request) ){
            $nomeTabela = addslashes( $request['tabela'] );
            
            // inserir no permissoes-parâmetros
             $sql = "INSERT INTO `permissoesparametros`(`id`, `nome`) VALUES (DEFAULT, '".$nomeTabela."_ver'), (DEFAULT, '".$nomeTabela."_add'), (DEFAULT, '".$nomeTabela."_edt'), (DEFAULT, '".$nomeTabela."_exc')";

            self::db()->query('START TRANSACTION;');
            self::db()->query($sql);

            $erro1 = self::db()->errorInfo();
    
            if( empty($erro1[2]) ){
                
                self::db()->query('COMMIT;');

                // Após criar no banco de dados os parametros de permissão
                // código para criar os arquivos padrão do MVC

                //////////////// CONTROLLER
                $caminho = __FILE__;
                $controllerGenerico = str_replace('\models\Desenvolvimento.php','\controllers\genericoController.php', $caminho);
                $controllerNovo = str_replace('generico', $nomeTabela, $controllerGenerico);
                copy($controllerGenerico, $controllerNovo);

                $arq = file_get_contents($controllerNovo, FILE_TEXT);
                $arq = str_replace( 'class genericoController extends', 'class '.$nomeTabela.'Controller extends' , $arq);
                $arq = str_replace( 'protected $table = "generico"', 'protected $table = "'.$nomeTabela.'"', $arq); 
                file_put_contents($controllerNovo, $arq, FILE_TEXT);

                /////////////////// MODEL
                $modelGenerico = str_replace('Desenvolvimento', 'Generico', $caminho);
                $modelNovo = str_replace('Generico', ucfirst( $nomeTabela ), $modelGenerico);
                copy($modelGenerico, $modelNovo);

                $arq2 = file_get_contents($modelNovo, FILE_TEXT);
                $arq2 = str_replace( 'class Generico extends', 'class '.ucfirst($nomeTabela).' extends' , $arq2);
                $arq2 = str_replace( 'protected $table = "generico"', 'protected $table = "'.$nomeTabela.'"', $arq2); 
                file_put_contents($modelNovo, $arq2, FILE_TEXT);

                /////////////////// VIEW
                $viewGenerico = str_replace('\models\Desenvolvimento.php','\views\generico.php', $caminho);
                $viewNovo = str_replace('generico', $nomeTabela, $viewGenerico);
                copy($viewGenerico, $viewNovo);

                $viewFormGenerico = str_replace('\models\Desenvolvimento.php','\views\generico-form.php', $caminho);
                $viewFormNovo = str_replace('generico-form', $nomeTabela.'-form', $viewFormGenerico);
                copy($viewFormGenerico, $viewFormNovo);

                /////////////////// JAVASCRIPT

                /////////////////// RELATÓRIO

                return true;
            }else{

                self::db()->query('ROLLBACK;');
                return false;
            }
        }else{
            return false;
        }
    }

    public function excluirMVC($request) {
        
        if( !empty($request) ){
            $nomeTabela = addslashes( $request['tabela'] );
            // inserir no permissoes-parâmetros
            $nome1 = $nomeTabela.'_ver';
            $nome2 = $nomeTabela.'_add';
            $nome3 = $nomeTabela.'_edt';
            $nome4 = $nomeTabela.'_exc';

            $sql =  "DELETE FROM permissoesparametros WHERE nome = '$nome1' OR nome = '$nome2' OR nome = '$nome3' OR nome = '$nome4' ";             

            // echo $sql; exit;
            self::db()->query('START TRANSACTION;');
            self::db()->query($sql);

            $erro1 = self::db()->errorInfo();
    
            if( empty($erro1[2]) ){
                
                self::db()->query('COMMIT;');

                // Após excluir no banco de dados os parametros de permissão
                // código para excluir os arquivos padrão do MVC

                $caminho = __FILE__;
                // models\Desenvolvimento.php = 26 caracteres
                $base = substr($caminho, 0, intval( strlen($caminho) - 27 ) );
        
                $controller = $base.'/controllers/'.$nomeTabela.'Controller.php';
                $model = $base.'/models/'.ucfirst($nomeTabela).'.php';
                $viewbr = $base.'/views/'.$nomeTabela.'.php';
                $viewfm = $base.'/views/'.$nomeTabela.'-form.php';
                // echo '<br>'.$controller.'<br>';
                // echo '<br>'.$model.'<br>';
                // echo '<br>'.$viewbr.'<br>';
                // echo '<br>'.$viewfm.'<br>';

                if ( unlink($controller) == true && unlink($model) == true && 
                        unlink($viewbr) == true && unlink($viewfm) == true ){
                            return true;
                }else{
                    return false;
                }

            }else{

                self::db()->query('ROLLBACK;');
                return false;
            }
        }else{
            return false;
        }
    }

    public function editaTabelaAntigo($request) {
        
        

        if( !empty($request) ){
            $nomeTabela = addslashes( $request['tabela'] );
            $primeira = $request['query1'] ;
            
            // echo $primeira; exit;
            self::db()->query('START TRANSACTION;');

            self::db()->query($primeira);
            $erro1 = self::db()->errorInfo();

            if( empty($erro1[2]) ){
            
                self::db()->query('COMMIT;');
                return true;

            }else{

                self::db()->query('ROLLBACK;');
                return false;
            }
        }
    }

    

    

}