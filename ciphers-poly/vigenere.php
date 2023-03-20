<div id="page-vigenere" class="page">
	<div class="page-title">Vigenere Cipher</div>
	<p>
		More detail behind the vigenere cipher and the cryptanalysis <a href="<?php echo $__ROOTDIR__ ?>poly/vigenere/explain">here</a>.
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
			<div>
				Key Phrase: <input id="key-phrase" type="text" />
				<input id="key-set-cipher-btn" type="button" value="Set Key" /> <input id="key-auto" type="checkbox" /> Auto-Key
			</div>
		</div>
		<div class="page-section-title">Analysis <span class="title-options"><input id="view-analysis" type="checkbox" /> View</span></div>
		<div id="analysis-container" style="display: none">
			<div class="repeated-table-container"><table class="repeated-table">
				<thead>
					<tr id="repeated-headers"></tr>
				</thead>
				<tbody>
					<tr id="repeated-contents"></tr>
				</tbody>
			</table></div>
			<div class="key-container">
				<div class="key-length">Suspected Key Length: <input id="key-length" type="number" value="4" /></div>
				<div id="vigenere-key-letters" class="key-letters"></div>
			</div>
			<div id="frequency-charts" class="frequency-charts"></div>
		</div>
		<div id="encipher-box">
			<div class="page-section-title">Plain Text <span id="plaintext-options" class="title-options"><input id="auto-spaces" type="checkbox" /> Auto-Spaces</span></div>
			<div class="textarea-container">
				<textarea id="textarea-plaintext"></textarea>
			</div>
		</div>
	</div>
</div>
<script src="<?php echo $__ROOTDIR__ ?>resources/cipher-poly/vigenere.js" type="module"></script>