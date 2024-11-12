<div id="page-columnar" class="page">
	<div class="page-title">ADFGX Cipher</div>
	<p>
		Currently this just does the substitution part of the ADFGX cipher, so you'll have to pair this with the columnar trans cipher as well.
	</p>
	<div class="page-content">
		<?php require_once("modules/cipherdirection.php") ?>
		<div id="decipher-box">
			<div class="page-section-title">Cipher Text</div>
			<div class="textarea-container">
				<textarea id="textarea-ciphertext"></textarea>
			</div>
        </div>
		<div class="page-section-title">Key</div>
		<div>
			<div>
				Key Phrase: <input id="key-phrase" type="text" />
				<input id="key-set-cipher-btn" type="button" value="Set Key" /><!-- <input id="key-auto" type="checkbox" /> Auto-Key !-->
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
<script src="<?php echo $__ROOTDIR__ ?>resources/page_scripts/adfgx.js" type="module"></script>