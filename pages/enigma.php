<div id="page-columnar" class="page">
	<div class="page-title">Engima Machine Cipher</div>
	<p>
		More detail behind the Enigma Machine cihper <a href="<?php echo $__ROOTDIR__ ?>other/enigma/explain.php">here</a>. Note: I haven't quite figured out what I'm
		doing wrong with the ring/offsets. I was able to get proper encipherment according to <a href="https://en.wikipedia.org/wiki/Enigma_rotor_details">this</a>
		Wikipedia article (AAAAA -> BZDGO) .
	</p>
	<div class="page-content">
		<?php require_once("module/cipherdirection.php") ?>
		<div id="decipher-box">
			<div class="page-section-title">Cipher Text</div>
			<div class="textarea-container">
				<textarea id="textarea-ciphertext"></textarea>
			</div>
        </div>
		<div class="page-section-title">Key</div>
		<div>
			<div><input type="button" value="--" /><input type="button" value="++" /> Rotors:
				<span class="enigma-select-container">1. <select>
					<option>I</option>
					<option>II</option>
					<option>III</option>
				</select></span><span class="enigma-select-container">2. <select>
					<option>I</option>
					<option>II</option>
					<option>III</option>
				</select></span><span class="enigma-select-container">3. <select>
					<option>I</option>
					<option>II</option>
					<option>III</option>
				</select></span>
			</div>
		</div>
		<div id="encipher-box">
			<div class="page-section-title">Plain Text <span id="plaintext-options" class="title-options"><input id="auto-spaces" type="checkbox" /> Auto-Spaces</span></div>
			<div class="textarea-container">
				<textarea id="textarea-plaintext"></textarea>
			</div>
		</div>
	</div>

</div>
<script src="<?php echo $__ROOTDIR__ ?>resources/cipher-other/enigma.js" type="module"></script>