<script src="<?php echo BASE_URL;?>/assets/js/orcamentositens_form.js" type="text/javascript"></script>

<h3 class="mt-5 mb-4">Itens do Orçamento</h3>
<div class="table-responsive tableFixHead">
    <table id="itensOrcamento" class="table table-striped table-hover bg-white table-nowrap first-column-fixed">
        <thead>
            <tr>
                <th>Ações</th>
                <th>Item</th>
                <th>SubItem</th>
                <th>Quant</th>
                <th>Largura Unit.</th>
                <th>Comprimento Unit.</th>
                <th>Quant. Usada Unit.</th>
                <th>Serviço/Produto</th>
                <th>Material/Serviço</th>
                <th>Tipo de Material</th>
                <th>Unidade</th>
                <th>Custo Total</th>
                <th>Preço Total</th>
                <th>Observação</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>
<div class="d-flex justify-content-end">
    <div class="pt-4 text-right">
        <div>Custo Total</div>
        <div class="h4" id="resumoItensCustoTotal">0,00</div>
    </div>
    <div class="pl-5 pt-4 text-right">
        <div>Sub Total</div>
        <div class="h4" id="resumoItensSubTotal">0,00</div>
    </div>
</div>
