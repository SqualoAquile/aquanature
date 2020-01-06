<?php
class ajaxController extends controller{

  private $parametros;
  private $servicos;
  private $clientes;
  private $orcamentos;
  private $ordemservico;

  public function __construct() {

    $user = new Usuarios();

    $this->parametros = new Parametros;
    $this->servicos = new Servicos;
    $this->clientes = new Clientes;
    $this->orcamentos = new Orcamentos;
    $this->ordemservico = new Ordemservico;

    //verifica se está logado
    if($user->isLogged() == false){
      header("Location: ".BASE_URL."/login"); 
    }
  }

  //
  // Função para checar se registros já existem,
  // essa função busca qualquer campo de qualquertabela
  //
  // @request model | Model a ser instanciado
  // @request table | Tabela para ser feito o select
  // @request campo | Campo a ser buscado
  // @request valor | Valor a ser comparado
  //
  public function buscaUnico() {

      $campo = $_POST["campo"];
      $valor = $_POST["valor"];

      $model = new Shared($_POST["module"]);

      if(isset($valor) && !empty($valor)){
        $valor = trim(addslashes($valor));
        $dados = $model->unico($campo, $valor);
      }

      echo json_encode($dados);
  }

  public function getRelacionalDropdown() {
    if (isset($_POST) && !empty($_POST)) {
      $shared = new Shared($_POST["tabela"]);
      echo json_encode($shared->getRelacionalDropdown($_POST));
    }
  }
    
  public function index() {
      //no index não existe função específica, módulo usado para as requisições ajax  
      //é redirecionado para home
      header("Location: ".BASE_URL."/home");   
      $_SESSION["returnMessage"] = [
        "mensagem" => "Erro no endereço, você foi redirecionado para o início.",
        "class" => "alert-danger"
    ];
  } 
  
  /////// cadastro de ADM CARTOES
  public function ConfereNomeAdm(){
    $dados = array();
    $a = new Administradoras();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $a->buscaAdmPeloNome($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  /////// cadastro de ADM CARTOES
  /////// cadastro de LANÇAMENTOS CAIXA
  public function buscaReceitasDespesas(){
    
    $dados = array();
    $fc = new Fluxocaixa();
    if(isset($_POST) && !empty($_POST)){
        $dados = $fc->receitasDespesas($_POST);
    }
    echo json_encode($dados);
  }
  
  public function buscaAnaliticas(){
    $dados = array();
    $cg = new Contasgerenciais();
    if(isset($_POST["id"]) && !empty($_POST["id"])){
        $id = trim(addslashes($_POST["id"]));
        $dados = $cg->pegarListaAnaliticas($id);
    }
    echo json_encode($dados);
  }
  
  public function buscaBandeiras(){
    $dados = array();
    $a = new Administradoras();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $idadm = trim(addslashes($_POST["q"]));
        $dados = $a->pegarListaBandeirasAceitas($idadm);
    }
    echo json_encode($dados);
  }
  /////// cadastro de LANÇAMENTOS CAIXA
  /////// cadastro de FORNECEDORES
  public function ConfereNomeFantasia(){
    $dados = array();
    $fr = new Fornecedores();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $fr->buscaFornPeloNomeFantasia($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  
  public function ConfereSigla(){
    $dados = array();
    $fr = new Fornecedores();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $fr->buscaFornPelaSigla($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  
  public function ConfereRazao(){
    $dados = array();
    $fr = new Fornecedores();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $fr->buscaFornPelaRazao($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  
  public function ConfereCnpj(){
    $dados = array();
    $fr = new Fornecedores();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $fr->buscaFornPeloCnpj($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  /////// cadastro de FORNECEDORES
  /////// cadastro de FUNCIONARIOS
  public function ConfereNomeFuncionario(){
    $dados = array();
    $fn = new Funcionarios();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $fn->buscaFuncPeloNome($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }

  public function adicionaArquivo(){
    $dados = array();
    $fn = new Funcionarios();
    if(isset($_POST["titulo"]) && !empty($_POST["titulo"]) && isset($_FILES['arq']) ){
      
        $dados = $fn->adicionaFolha($_POST);
    }
    echo json_encode($dados);
  }
  
  public function excluirpdf(){
    $dados = array();
    $fn = new Funcionarios();
    // echo 'aqui'; exit;
    if( isset($_POST) && !empty($_POST) ){
        $idfunc = $_POST['idfunc'];
        $nomearq = $_POST['hash'];
        $nomeVisivel = $_POST['nomearq'];
        $senha = $_POST['senha'];
        $dados = $fn->excluirpdf($idfunc, $nomearq, $nomeVisivel, $senha);
    }
    echo json_encode($dados);
  }
  
  public function ConfereEmailFuncionario(){
    $dados = array();
    $fn = new Funcionarios();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $fn->buscaFuncPeloEmail($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  
  public function ConfereCpfFuncionario(){
    $dados = array();
    $fn = new Funcionarios();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $fn->buscaFuncPeloCPF($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  public function SalvaSenhaNova(){
    $resp = array();
    $fn = new Funcionarios();
    
    if( isset($_POST["id"]) && !empty($_POST["id"]) && isset($_POST["senha1"]) && !empty($_POST["senha1"]) && $_POST["senha2"] && !empty($_POST["senha2"])){
        $idselec = $senhavelha = trim(addslashes($_POST["id"]));
        $senhavelha = trim(addslashes($_POST["senha1"]));
        $senhanova = trim(addslashes($_POST["senha2"]));
        $resp = $fn->novaSenhaSalva($idselec,$senhavelha,$senhanova,$_SESSION["idEmpresaFuncionario"]);
    }
    //testar redirecionar daqui!
    echo json_encode($resp);
  }
  /////// cadastro de FUNCIONARIOS
  /////// CONTROLE FLUXO DE CAIXA
  public function quitarItens(){
    $resp = array();
    $lc = new Lancamentos();
    
    if( isset($_POST["ids"]) && !empty($_POST["ids"]) && isset($_POST["valtot"]) && !empty($_POST["valtot"]) && isset($_POST["dtquit"]) && !empty($_POST["dtquit"]) && isset($_POST["alters"]) && !empty($_POST["alters"])){
        $ids = $_POST["ids"];
        $valtots = $_POST["valtot"];
        $alteracoes = $_POST["alters"];
        $dtquit = $_POST["dtquit"];
        $resp = $lc->quitarItensAbertos($ids,$valtots,$dtquit,$alteracoes,$_SESSION["idEmpresaFuncionario"]);
    }
    //testar redirecionar daqui!
    
    echo json_encode($resp);
  }
  
  public function editarItem(){
    $resp = array();
    $lc = new Lancamentos();
    
    if( !empty($_POST["info"])){
        $info = $_POST["info"];
        $resp = $lc->editarItem($info,$_SESSION["idEmpresaFuncionario"]);
    }      
    echo json_encode($resp);
  }
  /////// CONTROLE FLUXO DE CAIXA
  
/////// CADASTRO DE CLIENTES
  public function ConfereNomeCliente(){
    $dados = array();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $this->clientes->buscaClientePeloNome($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  
  public function ConfereEmailCliente(){
    $dados = array();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $this->clientes->buscaClientePeloEmail($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  
  public function ConfereCpfCliente(){
    $dados = array();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $this->clientes->buscaClientePeloCPF($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }

  public function adicionarCliente() {
    if (isset($_POST) && !empty($_POST)) {
      echo json_encode($this->clientes->adicionarAjax($_POST));
    }
  }
  
  /////// CADASTRO DE CLIENTES
  
  /////// ESTOQUE
  public function buscaProdutosFornecedor(){
    $dados = array();
    $st = new Estoque();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $st->buscaProdsForn($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
      
  public function ConfereCodProd(){
      $dados = array();
      $st = new Estoque();
      if(isset($_POST["codigo"]) && !empty($_POST["codigo"]) && isset($_POST["fornecedor"]) && !empty($_POST["fornecedor"])){
          $cod = trim(addslashes($_POST["codigo"]));
          $forn = trim(addslashes($_POST["fornecedor"]));
          $dados = $st->buscaCodigoProduto($cod, $forn,$_SESSION["idEmpresaFuncionario"]);
      }
      echo json_encode($dados);
    }
    
  public function adicionarItem(){
      $resp = array();
      $st = new Estoque();
      //print_r($_POST["info"]);exit;
      if(isset($_POST["info"]) && !empty($_POST["info"])){
          $infos = $_POST["info"];
          $resp = $st->adicionar($infos,$_SESSION["idEmpresaFuncionario"]);
      }
      echo json_encode($resp);
    }
    
  public function excluirItens(){
    $resp = array();
    $st = new Estoque();
    
    if( isset($_POST["ids"]) && !empty($_POST["ids"]) && isset($_POST["alters"]) && !empty($_POST["alters"])){
        $ids = $_POST["ids"];
        $alteracoes = $_POST["alters"];
        $resp = $st->excluirItens($ids,$alteracoes,$_SESSION["idEmpresaFuncionario"]);
    }
    //testar redirecionar daqui!
    
    echo json_encode($resp);
  }
  
  public function editarItemEstoque(){
    $resp = array();
    $st = new Estoque();
    
    if( !empty($_POST["info"])){
        $info = $_POST["info"];
        $resp = $st->editarItem($info,$_SESSION["idEmpresaFuncionario"]);
    }      
    echo json_encode($resp);
  }
  /////// ESTOQUE
  
  /////// CADASTRO DE SERVIÇOS
  public function ConfereNomeServico(){
    $dados = array();
    $sv = new Servicos();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $sv->buscaServicoPeloNome($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  
  /////// COMPRAS

  public function ConfereQtdEstoque(){
    $st = new Estoque();
    if(isset($_POST["q"]) && !empty($_POST["q"])){
        $nome = trim(addslashes($_POST["q"]));
        $dados = $st->confereEstoque($nome,$_SESSION["idEmpresaFuncionario"]);
    }
    echo json_encode($dados);
  }
  
  /////// PRODUTOS
  public function dataTableAjax(){
    //  print_r($_POST['valorPesq']); exit;
      $shared = new Shared($_POST['module']);
      echo json_encode(
        $shared->montaDataTable($_POST['campoPesq'], $_POST['valorPesq'])
      );
      //print_r($shared->montaDataTable() );exit;
  }
  
  public function dataTableAjaxRelatorioOrcamentosItens(){
      $relatorioorcamentositens = new Relatorioorcamentositens;
      echo json_encode($relatorioorcamentositens->montaDataTable());
  }

  public function chart() {
      if(isset($_POST['get_chart'])) {
          $values = array(
              array('Task', 'Hours Per Day'),
              array('Work', 11),
              array('Eat', 2),
              array('Commute', 2),
              array('Watch TV', 2),
              array('Sleep', 7),
          );
      
          echo json_encode($values);
          exit;
      }
  }

  public function gerarGraficoFiltro(){
    
    if(isset($_POST) && !empty($_POST)){
      $shared = new Shared($_POST['modulo']);
      $dados = $shared->gerarGraficoFiltro($_POST);
    }
    
    echo json_encode($dados);
  }
  
  public function gerarGraficoFiltroIntervaloDatas(){
    
    if(isset($_POST) && !empty($_POST)){
      $shared = new Shared($_POST['modulo']);
      $dados = $shared->gerarGraficoFiltroIntervaloDatas($_POST);
    }
    
    echo json_encode($dados);
  }

  public function gerarGraficoFiltroIntervaloDatas2(){
    
    if(isset($_POST) && !empty($_POST)){
      $shared = new Shared($_POST['modulo']);
      $dados = $shared->gerarGraficoFiltroIntervaloDatas2($_POST);
    }
    
    echo json_encode($dados);
  }

  public function gerarGraficoSaldos(){
    
    if(isset($_POST) && !empty($_POST)){
      $shared = new Shared($_POST['modulo']);
      $dados = $shared->gerarGraficoSaldos($_POST);
    }
    
    echo json_encode($dados);
  }

  //////// ORÇAMENTOS
  public function getRelacionalDropdownOrcamentos() {
    if (isset($_POST) && !empty($_POST)) {
      echo json_encode($this->orcamentos->getRelacionalDropdown($_POST));
    }
  }
  

  public function buscaParametrosMaterial() {
    $array = array();

    if (isset($_POST) && !empty($_POST)) {
      $param = new Parametros();
      $array = $param->buscaParametrosMaterial($_POST);
      echo json_encode($array);
    }
  }
  


  //
  // PARAMETROS
  //
  public function listarParametros() {
    if (isset($_POST) && !empty($_POST)) {
      echo json_encode($this->parametros->listar($_POST));
    }
  }
  public function listarParametrosDependente() {
    if (isset($_POST) && !empty($_POST)) {
      echo json_encode($this->parametros->listarDependente($_POST));
    }
  }

  public function listarParametrosDoiscampos() {
    if (isset($_POST) && !empty($_POST)) {
      echo json_encode($this->parametros->listarDoiscampos($_POST));
    }
  }

  public function adicionarParametros() {
    if (isset($_POST) && !empty($_POST)) {
      echo json_encode($this->parametros->adicionar($_POST));
    }
  }

  public function adicionarParametrosDoisCampos() {
    if (isset($_POST) && !empty($_POST)) {
      echo json_encode($this->parametros->adicionarDoisCampos($_POST));
    }
  }

  public function excluirParametros($id) {
    if (isset($_POST) && !empty($_POST)) {
      if (isset($id) && !empty($id)) {
        echo json_encode($this->parametros->excluir($_POST, $id));
      }
    }
  }

  public function editarParametros($id) {
    if (isset($_POST) && !empty($_POST)) {
      if (isset($id) && !empty($id)) {
        echo json_encode($this->parametros->editar($_POST, $id));
      }
    }
  }

  public function editarParametrosDoisCampos($id) {
    if (isset($_POST) && !empty($_POST)) {
      if (isset($id) && !empty($id)) {
        echo json_encode($this->parametros->editarDoisCampos($_POST, $id));
      }
    }
  }

  public function editarParametrosFixos($id) {
    if (isset($_POST) && !empty($_POST)) {
      if (isset($id) && !empty($id)) {
        echo json_encode($this->parametros->editarFixos($_POST, $id));
      }
    }
  }

  //
  // DESENVOLVIMENTO
  //
  public function buscaTabela() {
    if (isset($_POST) && !empty($_POST)) {
      $p = new Desenvolvimento();
      echo json_encode($p->buscaTabela($_POST));
    }
  }

  public function criaTabela() {
    if (isset($_POST) && !empty($_POST)) {
      $p = new Desenvolvimento();
      echo json_encode($p->criaTabela($_POST));
    }
  }
   
  public function editaTabela() {
    if (isset($_POST) && !empty($_POST)) {
      $p = new Desenvolvimento();
      echo json_encode($p->editaTabela($_POST));
    }
  }

  public function excluiTabela() {
    if (isset($_POST) && !empty($_POST)) {
      $p = new Desenvolvimento();
      echo json_encode($p->excluiTabela($_POST));
    }
  }

  public function criarMVC() {
    if (isset($_POST) && !empty($_POST)) {
      $p = new Desenvolvimento();
      echo json_encode($p->criarMVC($_POST));
    }
  }

  public function excluirMVC() {
    if (isset($_POST) && !empty($_POST)) {
      $p = new Desenvolvimento();
      echo json_encode($p->excluirMVC($_POST));
    }
  }

  //
  // SERVICOS
  //
  public function editarServicos($id) {
    if (isset($_POST) && !empty($_POST)) {
      if (isset($id) && !empty($id)) {
        echo json_encode($this->servicos->editar($_POST, $id));
      }
    }
  }


  //
  // ORDENS DE SERVICO
  //
  public function buscaDespesasId() {
     
    $dados = array();
    $fc = new Fluxocaixa();
    if(isset($_POST) && !empty($_POST)){
        $dados = $fc->buscaDespId($_POST);
    }
    echo json_encode($dados);
  }

  public function excluiRegistroFluxoCaixa() {
     
    $dados = array();
    $fc = new Fluxocaixa();
    if(isset($_POST) && !empty($_POST)){
        $dados = $fc->excluiRegistroFluxo($_POST);
    }
    echo json_encode($dados);
  }
  

  public function adicionarLancamento() {
    $dados = array();
    $fc = new Fluxocaixa();
    if(isset($_POST) && !empty($_POST)){
      
      $fc->adicionar($_POST);
      
      if( $_SESSION["returnMessage"]["mensagem"] == "Registro inserido com sucesso!" ){
        unset($_SESSION["returnMessage"]);
        echo json_encode(true);

      }else{
        unset($_SESSION["returnMessage"]);
        echo json_encode(false);

      }
    }
  }

  public function finalizarOS() {
     
      $dados = array();
      $os = $this->ordemservico;

      if(isset($_POST) && !empty($_POST)){
        
        $id = array_shift($_POST);

        $os->editar($id, $_POST);

        if( $_SESSION["returnMessage"]["mensagem"] == "Registro alterado com sucesso!" ){
          echo json_encode(true);
        }else{
          echo json_encode(false);
        }

      }
  }

  public function cancelarOS() {

    $dados = array();
    $os = $this->ordemservico;

    if(isset($_POST) && !empty($_POST)){

      $motivo = $_POST['motivo'];
      $id = $_POST['idOS'];

      $os->cancelarOS($id, $motivo);

      if( $_SESSION["returnMessage"]["mensagem"] == "Registro cancelado com sucesso!" ){
        echo json_encode(true);
      }else{
        echo json_encode(false);
      }

    }
  }

  //
  // ORCAMENTO
  //

  public function cancelarOrcamento() {

    if(isset($_POST) && !empty($_POST)){

      $motivo_desistencia = $_POST['motivo_desistencia'];
      $id = $_POST['id'];

      $this->orcamentos->cancelar($id, $motivo_desistencia);

      if(isset($_SESSION["returnMessage"]) && $_SESSION["returnMessage"]["mensagem"] == "Registro cancelado com sucesso!"){
        echo json_encode(true);
      }else{
        echo json_encode(false);
      }

    }
  }

  public function aprovarOrcamento() {

    $ordemServico = $this->ordemservico;

    if(isset($_POST) && !empty($_POST)){
      $returnAprovar = $ordemServico->aprovar($_POST);
      if ($returnAprovar["message"][0] == "00000") {
        echo json_encode($this->orcamentos->aprovar($returnAprovar["id_orcamento"], $returnAprovar["id_ordemservico"]));
      }
    }
  }

  public function changeStatusOrcamento() {

    if(isset($_POST) && !empty($_POST)){

      $this->orcamentos->changeStatus($_POST["id_orcamento"], $_POST["status"]);

      if(isset($_SESSION["returnMessage"]) && $_SESSION["returnMessage"]["mensagem"] == "Registro alterado com sucesso!"){
        echo json_encode(true);
      }else{
        echo json_encode(false);
      }
    }
  }

  public function duplicarOrcamento() {

    if(isset($_POST) && !empty($_POST)){

      $this->orcamentos->duplicar($_POST["id_orcamento"]);

      if(isset($_SESSION["returnMessage"]) && $_SESSION["returnMessage"]["mensagem"] == "Registro duplicado com sucesso!"){
        echo json_encode(true);
      }else{
        echo json_encode(false);
      }
    }
  }


  //
  // DASHBOARD
  //

  public function graficoFluxoCaixaRealizado(){
    
    if(isset($_POST) && !empty($_POST)){
      $relatFC = new Relatoriofluxocaixa();
      $dados = $relatFC->graficoFluxoCaixaRealizado($_POST['intervalo']);
    }
    echo json_encode($dados);
  }

  public function graficoFluxoCaixaPrevisto(){
    
    if(isset($_POST) && !empty($_POST)){
      $relatFC = new Relatoriofluxocaixa();
      $dados = $relatFC->graficoFluxoCaixaPrevisto($_POST['intervalo']);
    }
    echo json_encode($dados);
  }

  public function graficoOrcamentosXvendas(){
    
    if(isset($_POST) && !empty($_POST)){
      $relatOS = new Relatorioordensservico();
      $dados = $relatOS->graficoOrcamentosXvendas($_POST['intervalo']);
    }
    echo json_encode($dados);
  }

  
  public function graficoReceitaDespesaAnalitica(){
    
    if(isset($_POST) && !empty($_POST)){
      $relatFC = new Relatoriofluxocaixa();
      $dados = $relatFC->graficoReceitaDespesaAnalitica($_POST['intervalo']);
    }
    echo json_encode($dados);
  }

  public function saldosMeseAno(){
    
    if(isset($_POST) && !empty($_POST)){
      $relatSaldos = new Relatoriosaldos();
      $dados = $relatSaldos->saldosMeseAno($_POST);
    }
    echo json_encode($dados);
  }

  public function buscaVencidos(){
    
    if(isset($_POST) && !empty($_POST)){
      
      $fc = new Fluxocaixa();
      $dados = $fc->buscaVencidos($_POST['intervalo']);
    }
    echo json_encode($dados);
  }

  public function buscaOrcamentos(){
    
    if(isset($_POST) && !empty($_POST)){
      $orc = $this->orcamentos;
      $dados = $orc->buscaOrcamentos($_POST['intervalo']);
    }
    echo json_encode($dados);
  }
  
  public function buscaOrdensServicos(){
    
    if(isset($_POST) && !empty($_POST)){
      $os = $this->ordemservico;
      $dados = $os->buscaOrdens($_POST['intervalo']);
    }
    echo json_encode($dados);
  }
  
  public function buscaAniversariantes(){
    
    if(isset($_POST) && !empty($_POST)){
      $cl = new Clientes();
      $dados = $cl->buscaAniversariantes($_POST['intervalo']);
    }
    echo json_encode($dados);
  }
  

  
  public function top5produtos(){
    
    if(isset($_POST) && !empty($_POST)){
      $shared = new Shared($_POST['modulo']);
      $dados = $shared->top5produtos($_POST);
    }
    
    echo json_encode($dados);
  }

  public function nomeClientes(){
    $dados = array();
    if(isset($_POST) && !empty($_POST)){
      
      $termo = trim(addslashes($_POST['term']));
      $gn = new Generico();
      $dados = $gn->nomeClientes($termo);
      
    }
    echo json_encode($dados);
  }

  public function buscaEmaileID(){
    $dados = array();
    if(isset($_POST) && !empty($_POST)){

      $nome = trim(addslashes($_POST['nome']));

      $us = new Usuarios();
      $dados = $us->buscaEmaileID($nome);
      
    }
    echo json_encode($dados);
  }
  
  public function jaExistePedido(){
    $dados = array();
    if(isset($_POST) && !empty($_POST)){

      $dtentrega = $_POST['dtentrega'];
      $idVend = trim(addslashes($_POST['idVend']));

      $pd = new Pedidos();
      $dados = $pd->jaExistePedido($dtentrega, $idVend);
      
    }
    echo json_encode($dados);
  }

  public function sobrad0ontem(){
    $dados = array();
    if(isset($_POST) && !empty($_POST)){

      $dtOntem = $_POST['dtOntem'];
      $idVend = trim(addslashes($_POST['idVend']));

      $pd = new Pedidos();
      $dados = $pd->sobrad0ontem($dtOntem, $idVend);
      
    }
    echo json_encode($dados);
  }
  
  public function buscaParametrosAdicao() {
    $array = array();

    if (isset($_POST) && !empty($_POST)) {
      $param = new Parametros();
      $array = $param->buscaParametrosAdicao($_POST);
      echo json_encode($array);
    }
  }

  public function buscaVendedores() {
    $array = array();

    if (isset($_POST) && !empty($_POST)) {
      $vnd = new Vendedores();
      $array = $vnd->buscaVendedores();
      echo json_encode($array);
    }
  }

  public function buscaAnaliticas2() {
    $array = array();

    if (isset($_POST) && !empty($_POST)) {
      
      $sintetica = addslashes($_POST['nome']);
      $tabela = ucfirst('fluxocaixa');
      $fc = new $tabela();
      // $fc = new FluxoCaixa();
      $array = $fc->buscaAnaliticas2($sintetica);
      echo json_encode($array);
    }
  }

  public function resumoLancamentoVendedor() {
    $array = array();

    if (isset($_POST) && !empty($_POST)) {
      // print_r($_POST); exit;
      $dt1 = addslashes($_POST['dt1']);
      $dt2 = addslashes($_POST['dt2']);
      $id_vnd = addslashes($_POST['id_vnd']);

      $tabela = ucfirst('fluxocaixa');
      $fc = new $tabela();
      // $fc = new FluxoCaixa();
      $array = $fc->resumoLancamentoVendedor($dt1, $dt2, $id_vnd);
      echo json_encode($array);
    }
  }

  

}   
?>