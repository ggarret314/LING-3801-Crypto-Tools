<div id="page-shift" class="page">
	<div class="page-title">Shift Cipher</div>
	<p>
		More detail behind the shift cipher and the cryptanalysis <a href="<?php echo $__ROOTDIR__ ?>mono/shift/explain">here</a>.
	</p>
	<div class="page-content">
		<div class="page-section-title control-direction-container">
			<div id="control-encipher" class="control-direction">Encipher</div><div id="control-decipher" class="control-direction" style="background-color: #eee">Decipher</div>
		</div>
		<div class="page-section-title">Cipher Text</div>
		<div class="textarea-container">
			<textarea id="shift-textarea-ciphertext"></textarea>
		</div>
		<!--
			insert unigram analysis here
		!-->
		<div class="page-section-title">Key</div>
		<div>
			A &rarr; <select id="page-shift-key-element"><option>Q</option></select> <input type="button" value="--" /> <input type="button" value="++" />
		</div>
		<div>
			Pt shifted <span id="page-shift-key-num">16</span> letters forward.
		</div>
		<div>
			<div class="bigger-text monospace">PT: <span id="page-shift-key-pt">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span></div>
			<div class="bigger-text monospace">CT: <span id="page-shift-key-ct">QRSTUVWXYZABCDEFGHIJKLMNOP</span></div>
		</div>
		<div class="page-section-title">Plain Text <span class="title-options"><input type="checkbox" /> Auto-Spaces</span></div>
		<div class="textarea-container">
			<textarea id="shift-textarea-plaintext"></textarea>
		</div>
	</div>

</div>
<script src="<?php echo $__ROOTDIR__ ?>resources/cipher-mono/shift.js" type="module"></script>