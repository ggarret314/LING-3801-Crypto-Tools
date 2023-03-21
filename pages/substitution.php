
<div id="page-monoalphabetic" class="page">
	<div class="page-title">Simple Substitution Cipher</div>
	<p>
		More detail behind the simple substitution cipher and the cryptanalysis <a href="<?php echo $__ROOTDIR__ ?>mono/substitution/explain">here</a>.
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
				<input id="key-set-cipher-btn" type="button" value="Set Cipher Alphabet" />
				<input id="key-clear-btn" type="button" value="Clear" />
			</div>
		</div>
		<div>
			<div class="bigger-text monospace">PT: <span id="key-pt">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span></div>
			<div class="bigger-text monospace">CT: <span id="key-ct">..........................</span></div>
		</div>

		<div class="page-section-title">Analysis <span class="title-options"><input id="view-analysis" type="checkbox" /> View</span></div>
		<div id="analysis-container" style="display: none">
			<div class="page-section-title">Frequency Analysis</div>
			<div style="width: 100%; overflow-x: scroll">
				<table id="frequency-table" class="frequency-table">
					<thead>
						<tr>
							<th colspan="2">Regular text</th>
							<th colspan="2">Cipher text</th>
							<th colspan="2">Regular text</th>
							<th colspan="2">Cipher text</th>
							<th colspan="2">Regular text</th>
							<th colspan="2">Cipher text</th>
							<th colspan="2">Regular text</th>
							<th colspan="2">Cipher text</th>
						</tr>
						<tr class="frequency-table-normalrow">
							<th>Letter</th>
							<th>Freq</th>
							<th>Letter</th>
							<th>Freq</th>
							<th>Bi</th>
							<th>Freq</th>
							<th>Bi</th>
							<th>Freq</th>
							<th>Tri</th>
							<th>Freq</th>
							<th>Tri</th>
							<th>Freq</th>
							<th>Quad</th>
							<th>Freq</th>
							<th>Quad</th>
							<th>Freq</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<div id="key-letters"></div>
			<div class="page-section-title">Deciphering</div>
			<div id="deciphering-container">
				<div class="deciphering-block">
					<div class="cipher-row">Q</div>
					<div class="plain-row">q</div>
				</div>
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
<script src="<?php echo $__ROOTDIR__ ?>resources/page_scripts/substitution.js" type="module"></script>