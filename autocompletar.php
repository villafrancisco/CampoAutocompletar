<?php

include_once 'database.php';

class Autocompletar extends Database
{
    function Buscar($texto)
    {
        $res = array();
        $query = $this->connect()->prepare('SELECT * FROM mascotas WHERE nombre LIKE :texto');
        $query->execute([':texto' => $texto . '%']);

        if ($query->rowCount()()) {
            while ($r = $query->fetch()) {
                array_push($res, $r['nombre']);
            }
        }
        return $res;
    }
}
