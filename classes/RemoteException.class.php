<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RemoteException
 *
 * @author odi
 */
class RemoteException extends Exception {
	function __construct($url,$message) {
       parent::__construct("Error from ".$url.": ".$message);
   }
}

?>
