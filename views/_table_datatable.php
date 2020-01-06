<?php if (isset($_SESSION["returnMessage"])): ?>

    <div class="alert <?php echo $_SESSION["returnMessage"]["class"] ?> alert-dismissible">
    
        <?php echo $_SESSION["returnMessage"]["mensagem"] ?>
    
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

    </div>

<?php endif?>

<table class="table table-striped table-hover dataTable bg-white table-nowrap first-column-fixed">
    <thead>
        <tr>
            <?php foreach ($colunas as $key => $value): ?> 
                <?php if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") : ?>
                    <th class="border-top-0">
                        <?php if ($modulo == "fluxocaixa" && (array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "acoes")): ?>
                            <input type="checkbox" name="checkboxFluxoCaixa" class="select-all">
                        <?php endif ?>
                        <span><?php echo (isset($value["Comment"]["label"]) && !is_null($value["Comment"]["label"]) && !empty($value["Comment"]["label"])) ? $value["Comment"]["label"] : ucwords(str_replace("_", " ", $value['Field'])) ?></span>
                        <i class="small text-muted fas fa-sort ml-2"></i>
                    </th>
                <?php endif ?>
            <?php endforeach ?>
        </tr>
    </thead>
</table>