<?php

if (!empty($params[1])) {
	$ciphers = array("columnar");
	if (in_array($params[1], $ciphers)) {
		if ($params[2] === "explain") require_once("./ciphers-trans/$params[1]-explain.php");
		else require_once("./cipher-trans/$params[1].php");
		
	}
}

?>