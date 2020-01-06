<?php
setlocale(LC_TIME, "pt_BR", "pt_BR.utf-8", "pt_BR.utf-8", "portuguese");
date_default_timezone_set("America/Sao_Paulo");

header("Content-Type: text/html; charset=utf-8", true);

session_start();
require_once "config.php";

spl_autoload_register(function($class){
    if (strpos($class, "Controller") > -1){
    if(file_exists("controllers/".$class.".php")){
        require_once "controllers/".$class.".php";  
    }
    }
    else if(file_exists("models/".$class.".php")){
        require_once "models/".$class.".php";
    }
    else if(file_exists("core/".$class.".php")){
        require_once "core/".$class.".php";
    }
    
});

$core = new core();
$core->run();