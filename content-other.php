<?php

if (!empty($params[1])) {
	$ciphers = array("enigma");
	if (in_array($params[1], $ciphers)) {
		if ($params[2] === "explain") require_once("./pages/explain/$params[1]-explain.php");
		else require_once("./cipher-other/$params[1].php");
		
	}
}

?>