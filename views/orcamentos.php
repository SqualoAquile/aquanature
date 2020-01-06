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

    $(document).ready(function() {
        dataTable.on('draw', function() {
            $('table.dataTable').each(function() {
                $(this).find('tbody tr').each(function() {
                    let status = $(this).find('td:eq(15)').text();
                    if (status) {
                        status = status.toLowerCase();
                        if (status == 'aprovado') {
                            $(this).find('.btn-danger').hide();
                        }
                    }
                });
            });
        });
    });

</script>