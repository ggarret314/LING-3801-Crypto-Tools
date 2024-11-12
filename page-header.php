<!DOCTYPE html>
<html>
<head>
	<title>LING 3801 Tools</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta charset="UTF-8">
	<link href="<?php echo $__ROOTDIR__ ?>resources/main.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div id="main">
<header>
	<div class="biggest-text">LING 3801 Crypto Tools</div>
	<div class="big-text">Spring 2023</div>
	<div class="grey-hr"></div>
	<nav>
		<div class="nav-item">
			<a href="<?php echo $__ROOTDIR__ ?>">Home</a>
		</div><?php for ($i = 0; $i < count($pageTitles); $i++): ?>
		<div class="nav-item">
			<a href="<?php echo $__ROOTDIR__ . $pageNames[$i] ?>"><?php echo $pageTitles[$i] ?></a>
		</div><?php endfor ?>
	</nav>
	<div class="grey-hr"></div>
</header>
<div id="content">