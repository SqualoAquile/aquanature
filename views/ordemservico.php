<?php
// Transforma o nome do arquivo para o nome do módulo
$modulo = str_replace("-form", "", basename(__FILE__, ".php"));
// Constroi o cabeçalho
require "_header_browser.php";
// Constroi a tabela
require "_table_datatable.php";

require "_modal_configuracoes_impressao.php";
?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'  // usa o nome da tabela como nome do módulo, necessário para outras interações
</script>
<style>
    #page-content-wrapper header .col-lg-2 { display: none; }
</style>