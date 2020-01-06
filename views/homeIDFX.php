<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>

<style>
    @media (max-width: 768px) {
        .col-charts {
            height: 70vh;
            min-height: 300px;
        }
    }
</style>

<?php if( in_array("relatoriofluxocaixa_ver", $infoUser["permissoesUsuario"]) && in_array("relatorioordensservico_ver", $infoUser["permissoesUsuario"]) ): ?>

<script src="<?php echo BASE_URL?>/assets/js/home.js" type="text/javascript"></script>

    <ul class="nav nav-tabs mt-2" id="myTab" role="tablist" >
        <li class="nav-item">
            <a class="nav-link active" id="financ-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true"><h2>Financeiro</h2> </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="operacoes-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false"><h2>Operações</h2> </a>
        </li>
    </ul>

    <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="financ-tab">
        <!-- inicio financeiro -->
            <!-- Header com o Select de opções de intervalo de dias -->
            <div class="card my-3">
                <div class="card-header">
                    <div class="row">
                        <div class="col-lg">
                            <h4 class="text-weight-bold text-dark">Financeiro</h4>
                        </div>
                        <div class="col-lg-2">
                            <select class="custom-select" id="selectGraficosTemporais">
                                <option selected disabled>Selecione o Período</option>
                                <option value="0" >Hoje</option>
                                <option value="7" >7 dias</option>
                                <option value="15">15 dias</option>
                                <option value="30">30 dias</option>
                            </select>
                        </div>
                    </div>        
                </div>
            </div>
        
            <!-- Fluxo de caxia realizado -->
            <div class="card card-body my-3">
                <div class="row">
                    <div class="col-lg-5">
                        <div class="row">

                            <div class="col-lg-6">
                                <div class="card text-center mb-3">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-angle-double-up"></i> Receita Realizada</small>
                                        <h5 class="card-text" id="receita_realizada">R$ 0,00</h5>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div class="col-lg-6">
                                <div class="card text-center mb-3">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-angle-double-down"></i> Despesa Realizada</small>
                                        <h5 class="card-text" id="despesa_realizada">R$ 0,00</h5>
                                    </div>
                                    
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-dollar-sign"></i> Lucro</small>
                                        <h5 class="card-text" id="lucro_realizado">R$ 0,00</h5>
                                    </div>
                                    
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-percent"></i> Lucratividade</small>
                                        <h5 class="card-text" id="lucratividade_realizada"> 0%</h5>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7 col-charts">
                        <canvas id="chart-div2"></canvas>
                    </div>
                </div>
            </div>

            <!-- Fluxo de caixa Previsto -->
            <div class="card card-body my-3">
                <div class="row">
                    <div class="col-lg-5">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card text-center mb-3">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-angle-double-up"></i> Receita Prevista</small>
                                        <h5 class="card-text" id="receita_prevista">R$ 0,00</h5>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div class="col-lg-6">
                                <div class="card text-center mb-3">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-angle-double-down"></i> Despesa Prevista</small>
                                        <h5 class="card-text" id="despesa_prevista">R$ 0,00</h5>
                                    </div>
                                    
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-dollar-sign"></i> Lucro Previsto</small>
                                        <h5 class="card-text" id="lucro_previsto">R$ 0,00</h5>
                                    </div>
                                    
                                
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-percent"></i> Lucrativ. Prevista</small>
                                        <h5 class="card-text" id="lucratividade_prevista"> 30%</h5>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7 col-charts">
                        <canvas id="chart-div3"></canvas>
                    </div>
                </div>
            </div>

            <!-- Gráficos de Saldos e Fluxo de caixa agrupado por Conta Analitica -->
            <div class="card card-body my-3">
                <div class="row">
                    <div class="col-lg-4">
                        <canvas id="graf_saldos"></canvas>
                    </div>
                    <div class="col-lg-4">
                        <canvas id="graf_receita_analitica"></canvas>
                    </div>
                    <div class="col-lg-4">
                        <canvas id="graf_despesa_analitica"></canvas>
                    </div>
                </div>
            </div>

            <!-- Gráfico de saldos do Ano -->
            <div class="card card-body my-3">
                <div class="row">
                    <div class="col-lg" >
                        <canvas id="graf_saldosAno"></canvas>
                    </div>
                </div>
            </div>

            <!-- Tabelas de lançamentos vencidos e por vencer -->
            <div class="card card-body my-3" >
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card card-body">
                            <div class="card-header text-center"><h6 class="text-weight-bold text-dark">Lançamento Vencidos</h6></div>
                            <div class="card-body" >
                                <div class="table-responsive tableFixHead" >
                                    <table id="lancamentos_vencidos" class="table  table-hover bg-white table-nowrap" >
                                        <thead>
                                            <tr>
                                                <th class="border-top-0">Movimentação</th>
                                                <th class="border-top-0">Conta Analítica </th>
                                                <th class="border-top-0">Detalhe </th>
                                                <th class="border-top-0">Data de Vencimento </th>
                                                <th class="border-top-0">Valor </th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                        </tbody>                                            
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card card-body">
                            <div class="card-header text-center"><h6 id="titulo_proxVenc" class="text-weight-bold text-dark">Lançamento Com Vencimento Próximo</h6></div>
                            <div class="card-body" >
                                <div class="table-responsive tableFixHead" >
                                    <table id="lancamentos_vencProximo" class="table table-hover bg-white table-nowrap" >
                                        <thead>
                                            <tr>
                                                <th class="border-top-0">Movimentação</th>
                                                <th class="border-top-0">Conta Analítica </th>
                                                <th class="border-top-0">Detalhe </th>
                                                <th class="border-top-0">Data de Vencimento </th>
                                                <th class="border-top-0">Valor </th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                        </tbody>                                            
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <!-- fim financeiro -->
        </div>

        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="operacoes-tab">
        <!-- inicio operacoes -->
        <!-- Header com o Select de opções de intervalo de dias -->
            <div class="card my-3">
                <div class="card-header">
                    <div class="row">
                        <div class="col-lg">
                            <h4 class="text-weight-bold text-dark">Vendas e  Clientes</h4>
                        </div>
                        <div class="col-lg-2">
                            <select class="custom-select" id="selectGraficosVendas">
                                <option selected disabled>Selecione o Período</option>
                                <option value="0" >Hoje</option>
                                <option value="7" >7 dias</option>
                                <option value="15">15 dias</option>
                                <option value="30">30 dias</option>
                            </select>
                        </div>
                    </div>        
                </div>
            </div>

            <!-- Orçamento e Vendas -->
            <div class="card card-body my-3">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="card text-center mb-3">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-book"></i>  Qtd. Orçamentos</small>
                                        <h5 class="card-text" id="qtd_orc">0</h5>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div class="col-lg-3">
                                <div class="card text-center mb-3">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-chevron-circle-up"></i> Valor Orçado</small>
                                        <h5 class="card-text" id="valor_orc">R$ 0,00</h5>
                                    </div>
                                    
                                </div>
                            </div>

                            <div class="col-lg-3">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-cart-arrow-down"></i>  Qtd Vendas</small>
                                        <h5 class="card-text" id="qtd_venda">0</h5>
                                    </div>
                                    
                                </div>
                            </div>

                            <div class="col-lg-3">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <small class="card-title"><i class="fas fa-chevron-circle-up"></i>  Valor Vendido</small>
                                        <h5 class="card-text" id="valor_venda"> R$ 0,00</h5>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12" style="height: 300px;">
                        <canvas id="orcVendas"  style="height: 300px;"></canvas>
                    </div>
                </div>
            </div>

            <!-- Tabelas de lançamentos vencidos e por vencer -->
            <div class="card card-body my-3">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card card-body">
                            <div class="card-header text-center"><h6 class="text-weight-bold text-dark">Orçamentos Em Aberto / Recontato</h6></div>
                            <div class="card-body" >
                                <div class="table-responsive tableFixHead" style="max-height: 300px; overflow-y: auto; overflow-x: auto;">
                                    <table id="orcamentos_abertos" class="table  table-hover bg-white table-nowrap" >
                                        <thead>
                                            <tr>
                                                <th class="border-top-0">Ações</th>
                                                <th class="border-top-0">Título </th>
                                                <th class="border-top-0">Valor </th>
                                                <th class="border-top-0">Cliente </th>
                                                <th class="border-top-0">E-mail </th>
                                                <th class="border-top-0">Data de Emissão </th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                        </tbody>                                            
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card card-body">
                            <div class="card-header text-center"><h6 id="titulo_proxOrc" class="text-weight-bold text-dark">Orçamentos com data de retorno dentro dos próximos 5 dias</h6></div>
                            <div class="card-body" >
                                <div class="table-responsive tableFixHead" style="max-height: 300px; overflow-y: auto; overflow-x: auto;">
                                    <table id="orcamentos_retornar" class="table table-hover bg-white table-nowrap" >
                                        <thead>
                                            <tr>
                                                <th class="border-top-0">Ações</th>
                                                <th class="border-top-0">Título </th>
                                                <th class="border-top-0">Valor </th>
                                                <th class="border-top-0">Cliente </th>
                                                <th class="border-top-0">E-mail </th>
                                                <th class="border-top-0">Data de Emissão </th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                        </tbody>                                            
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabelas de ordens de serviço em produção e o.s. com revisões próximas -->
            <div class="card card-body my-3">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card card-body">
                            <div class="card-header text-center"><h6 class="text-weight-bold text-dark">O.S. Em Produção</h6></div>
                            <div class="card-body" >
                                <div class="table-responsive tableFixHead" style="max-height: 300px; overflow-y: auto; overflow-x: auto;">
                                    <table id="os_emproducao" class="table  table-hover bg-white table-nowrap" >
                                        <thead>
                                            <tr>
                                                <th class="border-top-0">Ações</th>
                                                <th class="border-top-0">Data de Aprovação </th>
                                                <th class="border-top-0">Título </th>
                                                <th class="border-top-0">Valor </th>
                                                <th class="border-top-0">Cliente </th>
                                                <th class="border-top-0">Téc. Responsável </th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                        </tbody>                                            
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card card-body">
                            <div class="card-header text-center"><h6 id="titulo_proxRev" class="text-weight-bold text-dark">O.S. com revisão dentro dos próximos dias</h6></div>
                            <div class="card-body" >
                                <div class="table-responsive tableFixHead" style="max-height: 300px; overflow-y: auto; overflow-x: auto;">
                                    <table id="revisoes" class="table table-hover bg-white table-nowrap" >
                                        <thead>
                                            <tr>
                                                <th class="border-top-0">Ações</th>
                                                <th class="border-top-0">Data de Aprovação </th>
                                                <th class="border-top-0">Data da Revisão </th>
                                                <th class="border-top-0">Título </th>
                                                <th class="border-top-0">Valor </th>
                                                <th class="border-top-0">Cliente </th>
                                                <th class="border-top-0">Téc. Responsável </th>
                                                <th class="border-top-0">Qual Revisão</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                        </tbody>                                            
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabelas de clientes de aniversário -->
            <div class="card card-body my-3">
                <div class="row">
                    <div class="col-12">
                        <div class="card card-body">
                            <div class="card-header text-center"><h6 id="tit_aniver" class="text-weight-bold text-dark">Clientes de Aniversário nos próximos dias</h6></div>
                            <div class="card-body" >
                                <div class="table-responsive tableFixHead" style="max-height: 300px; overflow-y: auto; overflow-x: auto;">
                                    <table id="anivers" class="table  table-hover bg-white table-nowrap" >
                                        <thead>
                                            <tr>
                                                <th class="border-top-0">Nome do Cliente </th>
                                                <th class="border-top-0">Data de Nasc. </th>
                                                <th class="border-top-0">E-mail </th>
                                                <th class="border-top-0">Celular </th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                        </tbody>                                            
                                    </table>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
        <!-- fim operacoes -->
        </div>
    </div>
<?php else:?>
    <h1 class="display-4 font-weight-bold py-4">Home</h1>
<?php endif ?>