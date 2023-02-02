<?php 

$__ROOTDIR__ = "https://gserver.gov/ling3801/";



// Parse url path
$params = explode( "/", $_GET['dets'] );
$thingies = array(); // This is used just so code is better understood.
for($i = 0; $i < count($params); $i+=2) {
	$thingies[$params[$i]] = $params[$i+1];
}

// Valid page names. Anything else the user attempts to access is discarded.
$pageNames = array(
	"otherstuff", "shift", "monoalphabetic", "vigenere"
);

$pageScripts = array();

$page_bottomscripts = array();
array_push($page_bottomscripts, "{$__ROOTDIR__}resources/main.js");

switch($params[0]) {
	case "shift":
	case "monoalphabetic":
	case "vigenere":
		array_push($page_bottomscripts, "{$__ROOTDIR__}resources/{$params[0]}.js");
		break;
}

include_once("page-header.php");

// Determine if accessing valid page.
if (in_array($params[0],$pageNames)) {
	//  If so, include the page.
	require_once("content-{$params[0]}.php");
} elseif (empty($params[0])) {
	require_once("content-main.php");	
} else {
	// If not, this should go to a special 404 page that I have not made yet.
	print_r("Page not found: {$params[0]}");
}

include_once("page-footer.php");


?>