<?php
//include the files from the PHP FT client library
include('../lib/fusion-tables-client-php/clientlogin.php');
include('../lib/fusion-tables-client-php/sql.php');
include('../lib/fusion-tables-client-php/file.php');
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of GFTClient
 *
 * @author odi
 */
class GFTClient {
	function __construct($tableid) {
		$token = ClientLogin::getAuthToken("xy@gmail.com", "");
		$this->tableid = $tableid;
		$this->ftclient = new FTClientLogin($token);
	}
	
	function select($cols=null, $condition=null) {
		$sql = SQLBuilder::select($this->tableid,$cols,$condition);
		return $this->runSQL($sql);
	}
	
	function insert($col_values) {
		$sql = SQLBuilder::insert($this->tableid,$col_values);
		return $this->runSQL($sql);
	}
	
	function update($col_values,  $row_id) {
		$sql = SQLBuilder::update($this->tableid,$col_values, $row_id);
		return $this->runSQL($sql);
	}
	
	function delete($row_id) {
		$sql = SQLBuilder::delete($this->tableid, $row_id);
		return $this->runSQL($sql);
	}
	
	function createTable($tableName) {
		$sql = SQLBuilder::createTable($tableName);
		return $this->runSQL($sql);
	}
	
	function dropTable($table_id) {
		$sql = SQLBuilder::dropTable($table_id);
		return $this->runSQL($sql);
	}
	
	function runSQL($sql) {
		return $this->ftclient->query($sql);
	}
}

?>
