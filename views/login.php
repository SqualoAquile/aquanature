<!doctype html>
<html lang="pt-BR" class="h-100">
  <head>
      
    <title>Entrar - <?php echo NOME_EMPRESA;?></title>
    <base href="<?php echo BASE_URL?>">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="manifest" href="<?php echo BASE_URL?>/manifest.json">
   
    <link rel="shortcut icon" href="<?php echo BASE_URL?>/favicon.ico" type="image/x-icon">
    <link rel="icon" href="<?php echo BASE_URL?>/favicon.ico" type="image/x-icon">

    <meta name="msapplication-TileColor" content="#212936">
    <meta name="theme-color" content="#212936">

    <link href="<?php echo BASE_URL;?>/assets/css/login.css" rel="stylesheet" type="text/css"/>

    <script src="<?php echo BASE_URL;?>/assets/js/vendor/jquery-3.3.1.min.js" type="text/javascript"></script>
    <script src="<?php echo BASE_URL;?>/assets/js/vendor/popper.min.js" type="text/javascript"></script>
    <script src="<?php echo BASE_URL;?>/assets/js/vendor/bootstrap.min.js" type="text/javascript"></script>
  </head>

    <style>
        body {
            color: #215d81 ;
        }
        .btn-primary {
            background-color: #215d81;
            color: #FFF ;
        }
        .btn-primary:hover{
            background-color: #333;
        }
    </style>

  <body class="text-center h-100 d-flex align-items-center">
    <div class="container">
        <div class="row">
            <div class="col-lg-4 mx-auto">
                <form method="POST" class="form-signin">
                    <?php if(!empty($aviso)):?>
                        <div class="alert alert-danger alert-dismissible mb-5" role="alert">
                            <?php echo $aviso ?>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    <?php endif;?>
                    <h1><?php echo NOME_EMPRESA;?></h1>
                    <!-- <img class="card-img-left img-fluid" src="<?php echo BASE_URL?>/assets/images/IDFX.png" width = "auto" height = "auto"> -->
                    <p class="lead mb-4">Entre, por favor</p>
                    <label for="inputEmail" class="sr-only">Email</label>
                    <input type="email" id="inputEmail" class="form-control" name="email" placeholder="Email" required autofocus>
                    <label for="inputPassword" class="sr-only">Senha</label>
                    <input type="password" id="inputPassword" class="form-control" name="senha" placeholder="Senha" required>
                    <button class="btn btn-lg btn-primary btn-block mt-3" type="submit">Entrar</button>
                    <p class="mt-5 mb-3 text-muted">&copy; <strong>Leme</strong> 2019</p>
                </form>
            </div>
        </div>
    </div>
  </body>
</html>
