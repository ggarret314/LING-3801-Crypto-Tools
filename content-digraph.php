<?php

if (!empty($params[1])) {
	$ciphers = array("playfair");
	if (in_array($params[1], $ciphers)) {
		if ($params[2] === "explain") require_once("./ciphers-digraph/$params[1]-explain.php");
		else require_once("./ciphers-digraph/$params[1].php");
		exit();
	}
}

?>