<div id="content">
	<div id="page-shift" class="page">
		<p>
			On this site, you will find the means to solve the various ciphers in the 
			<a href="https://linguistics.osu.edu/courses/ling-3801">LING 3801 - Codes and Codebreaking</a> course given at Ohio State.
			The cryptanalysis tools are all built into this site and are meant to be inspected so as to prove I made them.
			I have a Github repository holding the code for this site <a href="https://github.com/ggarret314/LING-3801-Crypto-Tools" target="_blank">here</a>.
		</p>
		<p>
			Check out the <a href="<?php echo $__ROOTDIR__ ?>auto">Auto Solver</a>
		</p>
		<h2>Ciphers Available</h2>
		<h3>Monoalphabetic</h3>
		<ul class="cipher-list">
			<li><a href="<?php echo $__ROOTDIR__ ?>mono/shift">Shift</a></li>
			<li><a href="<?php echo $__ROOTDIR__ ?>mono/substitution">Substitution</a></li>
		</ul>
		<h3>Polyalphabetic</h3>
		<ul class="cipher-list">
			<li><a href="<?php echo $__ROOTDIR__ ?>poly/vigenere">Vigenere</a></li>
		</ul>
		<h3>Digraph</h3>
		<ul class="cipher-list">
			<li><a href="<?php echo $__ROOTDIR__ ?>digraph/playfair">Playfair</a></li>
		</ul>
		<h3>Transposition</h3>
		<ul class="cipher-list">
			<li><a href="<?php echo $__ROOTDIR__ ?>trans/columnar">Columnar</a></li>
			<!--<li><a href="<?php echo $__ROOTDIR__ ?>trans/railfence">Railfence</a></li>!-->
		</ul>
		<!--<h3>Other</h3>
		<ul class="cipher-list">
			<li><a href="<?php echo $__ROOTDIR__ ?>other/enigma">Enigma</a></li>
		</ul>!-->
		<!--
		<div class="page-description">
			The Auto-Solver makes use of a <a href="https://en.wikipedia.org/wiki/Simulated_annealing">Simulated Annealing algorithm</a>, where
			potential keys are checked until finding one that makes the plain text look the most like English.
			In order to automatically determine other parameters of the ciphers, like the key length in the vigenere and transposition ciphers,
			the Auto-Solver conducts analysis as taught in class to determine the most practical parameters. If these fail, then it exhaustively
			checks other parameters near those until it finds the right ones.
		</div>
		!-->
	</div>
</div>