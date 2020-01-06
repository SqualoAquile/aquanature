<?php
class model {

    private static $Connect = null;

    private function Conn() {
        
        global $config;
        
        // Conexão com o banco de dados
        try{
            
            if (self::$Connect == null) {
                
                self::$Connect = new PDO(
                    "mysql:dbname=" . $config["db"] . ";host=" . $config["host"] . ";",
                    $config["user"],
                    $config["pass"]
                );

                self::$Connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$Connect->exec('SET NAMES utf8');
            }

        } catch (PDOException $e){
            // Exibir mensagem de erro caso não seja possível a conexão com o banco
            echo "FALHA: " . $e->getMessage() . "<br/> Entre em contato com o administrador do sistema.";
        }

        return self::$Connect;
    }

    public function db() {
        return self::Conn();
    }
}
?>