<div id="content">
	<div id="page-shift" class="page">
		<div class="page-title">Crypto Auto Solver</div>
		<div class="page-description">
			Given a set of enciphers and parameters, find the key to a particular ciphertext.
		</div>
		<div id="decipher-box">
			<div class="page-section-title">Cipher Text</div>
			<div class="textarea-container">
				<textarea id="textarea-ciphertext"></textarea>
			</div>
		</div>

		<div class="page-section-title">Number of Ciphers <input id="num-cipher-update" type="button" value="Update" /></div>
		<div>Min: <input id="num-cipher-min" type="number" value="1" /> Max: <input id="num-cipher-max" type="number" value="1" /></div>
		<!--<div><input id="num-cipher-exact-checkbox" type="checkbox" /> Exact: <input id="num-cipher-exact" type="number" /></div>!-->

		<div class="page-section-title">Ciphers in Use</div>
		<ol id="cipher-list">
			<li><select><option>Unknown</option></select></li>
		</ol>

		<div class="page-section-title">Solution <input id="solve-btn" type="button" value="Solve" /></div>
		<ol id="key-list">
			<li>Key: <span id="auto-key1">-</span></li>
		</ol>
		<div id="encipher-box">
			<div class="page-section-title">Plain Text <span id="plaintext-options" class="title-options"><input id="auto-spaces" type="checkbox" /> Auto-Spaces</span></div>
			<div class="textarea-container">
				<textarea id="textarea-plaintext"></textarea>
			</div>
		</div>
	</div>
</div>
<script src="<?php echo $__ROOTDIR__ ?>resources/auto.js" type="module"></script>