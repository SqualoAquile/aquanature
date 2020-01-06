<?php if (isset($item) && !empty($item)): ?>
    <?php $alteracoes = explode("|", $item["alteracoes"]) ?>
    <section id="historico<?php echo isset($iteracao) ? $iteracao : "" ?>" class="historico card card-body collapse my-5">
        <h4 class="text-center py-4">Histórico de Alterações</h4>
        <div class="wrapper px-3">
            <?php foreach (array_reverse($alteracoes) as $key => $alteracao): ?>
                <?php
                $alteracao = explode(">>", $alteracao);
                $alteracao_head = $alteracao[0];
                $alteracao_content = array_key_exists(1, $alteracao) ? $alteracao[1] : false;
                ?>
                <div class="cada-alteracao py-2">
                    <span class="font-weight-bold small text-muted"><?php echo $alteracao_head ?></span>
                    <?php if ($alteracao_content): ?>
                        <?php $alteracao_feita = explode("{", trim($alteracao_content)) ?>
                        <?php foreach ($alteracao_feita as $key => $cada_alteracao): ?>
                            <?php if ($cada_alteracao): ?>
                                <div class="card card-body border-0 py-0 mx-3 my-2">
                                    <div class="card-text small d-flex flex-column">
                                        <?php
                                        $cada_alteracao = str_replace("}", "", $cada_alteracao);
                                        $cada_alteracao = str_replace("()", "(&#8709;)", $cada_alteracao);
                                        $cada_alteracao = str_replace(" de (", " <strong>de</strong> <del class='text-muted'>", $cada_alteracao);
                                        $cada_alteracao = str_replace(") para (", "</del> <strong>para</strong> ", $cada_alteracao);
                                        $cada_alteracao = substr(trim($cada_alteracao), 0, -1);

                                        $cada_alteracao = explode(" ", $cada_alteracao);
                                        $cada_alteracao[0] = "<span>" . $cada_alteracao[0] . "</span>";
                                        $cada_alteracao = implode(" ", $cada_alteracao);

                                        // Para contatos
                                        $cada_alteracao = str_replace("][", " | ", $cada_alteracao);
                                        $cada_alteracao = str_replace("[", "", $cada_alteracao);
                                        $cada_alteracao = str_replace("]", "", $cada_alteracao);
                                        $cada_alteracao = str_replace(" *", ",", $cada_alteracao);
                                        ?>
                                        <div><?php echo $cada_alteracao ?></div>
                                    </div>
                                </div>
                            <?php endif ?>
                        <?php endforeach ?>
                    <?php endif ?>
                </div>
            <?php endforeach ?>
        </div>
    </section>
<?php endif ?>