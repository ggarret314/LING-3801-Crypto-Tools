<div id="page-shift" class="page">
	<div class="page-title">Shift Cipher</div>
	<p>
		More detail behind the shift cipher and the cryptanalysis <a href="<?php echo $__ROOTDIR__ ?>mono/shift/explain">here</a>.
	</p>
	<div class="page-content">
		<?php require_once("modules/cipherdirection.php") ?>
		<div id="decipher-box">
			<div class="page-section-title">Cipher Text</div>
			<div class="textarea-container">
				<textarea id="textarea-ciphertext"></textarea>
			</div>
		</div>
		<!--
			insert unigram analysis here
		!-->
		<div class="page-section-title">Key</div>
		<div>
			A &rarr; <select id="key-element"><option>Q</option></select> 
			<input id="key-dec" type="button" value="--" /> 
			<input id="key-inc" type="button" value="++" />
		</div>
		<div>
			Pt shifted <span id="key-num">0</span> letters forward.
		</div>
		<div>
			<div class="bigger-text monospace">PT: <span id="key-pt">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span></div>
			<div class="bigger-text monospace">CT: <span id="key-ct">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span></div>
		</div>
		<div id="encipher-box">
			<div class="page-section-title">Plain Text <span id="plaintext-options" class="title-options"><input id="auto-spaces" type="checkbox" /> Auto-Spaces</span></div>
			<div class="textarea-container">
				<textarea id="textarea-plaintext"></textarea>
			</div>
		</div>
	</div>

</div>
<script src="<?php echo $__ROOTDIR__ ?>resources/page_scripts/shift.js" type="module"></script>