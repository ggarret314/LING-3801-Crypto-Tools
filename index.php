<?php 

require_once("settings.php");

$__ROOTDIR__ = $LING3801["root_dir"];



// Parse url path
$params = explode( "/", $_GET['dets'] );
$thingies = array(); // This is used just so code is better understood.
for($i = 0; $i < count($params); $i+=2) {
	$thingies[$params[$i]] = $params[$i+1];
}

// Valid page names. Anything else the user attempts to access is discarded.
$pageNames = array(
	"auto", "shift", "substitution", "vigenere", "playfair", "columnar", "enigma", "adfgx", "grandpre"
);

$pageTitles = array(
	"Auto-Solver", "Shift", "Substitution", "Vigenere", "Playfair", "Columnar Trans", "Enigma", "ADFGX", "Grandpre"
);

$cryptTypes = array(
	"digraph", "mono", "other", "poly", "trans"
);


include_once("page-header.php");

// Determine if accessing valid page.
if (in_array($params[0],$pageNames)) {
	//  If so, include the page.
	require_once("pages/{$params[0]}.php");
} elseif (empty($params[0])) {
	require_once("content-main.php");
} elseif (in_array($params[0],$cryptTypes)) {
	require_once("content-{$params[0]}.php");
} else {
	// If not, this should go to a special 404 page that I have not made yet.
	print_r("Page not found: {$params[0]}");
}

include_once("page-footer.php");


?>