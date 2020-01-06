<?php
$modulo = str_replace("-form", "", basename(__FILE__, ".php"));

require "_header_browser.php";
require "_table_datatable.php";
?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>',
        campoPesquisa = '',
        valorPesquisa = '';
</script>