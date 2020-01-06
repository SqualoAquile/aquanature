<?php
class comprasController extends controller{

    protected $table = "produtos";
    protected $colunas;

    public function __construct() {
    
       $func = new Funcionarios();

       $this->colunas = $this->nomeDasColunas($this->table);
       
       //verifica se está logado
       if($func->isLogged() == false){
           header("Location: ".BASE_URL."/login"); 
       }
       //verifica se tem permissão para ver esse módulo
       if(in_array("compras_ver",$_SESSION["permissoesFuncionario"]) == FALSE){
           header("Location: ".BASE_URL."/home"); 
       }
    }
     
    public function index() {
        $dados = array();
        $dados['infoFunc'] = $_SESSION;
        
        $cp = new Compras();
        
        $dados["listaColunas"] = $this->colunas;
        $dados["listaClientes"]  = $this->shared->pegarListas($this->table);
        $this->loadTemplate("compras",$dados);      
    } 
    
    public function adicionar() {
        
        if(in_array("compras_add",$_SESSION["permissoesFuncionario"]) == FALSE){
            header("Location: ".BASE_URL."/compras"); 
        }
        
        $array = array();
        $dados['infoFunc'] = $_SESSION;
        $cp = new Compras();
        $est = new Estoque();
        
        $cc = new Contascorrentes();
        $fp = new Formaspgto();
        
        
        if(isset($_POST["txt"]) && count($_POST["txt"])> 0){
            $txts = $_POST["txt"]; 
            $cp->adicionar($txts,$_SESSION["idEmpresaFuncionario"]);
            header("Location: ".BASE_URL."/compras");
        }else{
            
            $dados["listaItens"] = $cp->nomeColunasItens();
            $dados["listaColunas"] = $this->colunas;
            
            $dados["listaColunasE"] = $est->nomeDasColunas();
            $dados["listaEstoque"]  = $est->pegarListaEstoque($_SESSION["idEmpresaFuncionario"]);
            
            $dados["listaContasCorrentes"]  = $cc->pegarListaCC($_SESSION["idEmpresaFuncionario"]);
            $dados["listaFormasPgto"]  = $fp->pegarListaFormasPgto($_SESSION["idEmpresaFuncionario"]);
                    
            $this->loadTemplate("compras-add",$dados);
        }  
    }
    
//    public function editar($id) {
//        if(in_array("compras_edt",$_SESSION["permissoesFuncionario"]) == FALSE || empty($id) || !isset($id)){
//            header("Location: ".BASE_URL."/compras"); 
//        }
//        $array = array();
//        $dados['infoFunc'] = $_SESSION;
//        $cl = new Clientes();
//        
//        $id = addslashes($id);
//        if(isset($_POST["txt"]) && count($_POST["txt"])> 0){
//            $txts = $_POST["txt"]; 
//            $cl->editar($id, $txts,$_SESSION["idEmpresaFuncionario"]);
//            header("Location: ".BASE_URL."/compras");
//        }else{
//            
//            $dados["idSelecionado"] = $id;
//            $dados["infoCliente"] = $cl->pegarInfoCliente($id,$_SESSION["idEmpresaFuncionario"]);
//            $dados["listaColunas"] = $cl->nomeDasColunas();
//            $this->loadTemplate("compras-edt",$dados);
//        }  
//    }
//
//    public function excluir($id) {       
//        if(in_array("compras_exc",$_SESSION["permissoesFuncionario"]) == FALSE || empty($id) || !isset($id)){
//            header("Location: ".BASE_URL."/compras"); 
//        }
//        
//        $cl = new Clientes();
//        $id = addslashes($id);
//        
//        $cl->excluir($id,$_SESSION["idEmpresaFuncionario"]);
//        header("Location: ".BASE_URL."/compras");  
//      }
    
}   
?>

