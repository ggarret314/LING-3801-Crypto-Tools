<div id="page-playfair" class="page">
	<div class="page-title">Playfair Cipher</div>
	<p>
		More detail behind the playfair cipher and the cryptanalysis <a href="<?php echo $__ROOTDIR__ ?>digraph/playfair/explain">here</a>.
	</p>
	<div class="page-content">
		<?php require_once("module/cipherdirection.php") ?>
		<div id="decipher-box">
			<div class="page-section-title">Cipher Text</div>
			<div class="textarea-container">
				<textarea id="textarea-ciphertext"></textarea>
			</div>
		</div>
		<div class="page-section-title">The Key</div>
		<div id="page-mono-key-container">
			Key phrase: <input id="key-phrase" type="text"> <input id="key-set-btn" type="button" value="Set key">
			Raw key: <input id="key-raw" type="text">
			
		</div>
		<div class="page-section-title">Analysis <span class="title-options"><input id="view-analysis" type="checkbox" /> View</span></div>
		<div id="analysis-container" style="display: none">
			<div id="playfair-grid" class="playfair-grid-container"></div>
			<div class="page-section-title">Deciphering</div>
			<div id="deciphering-container">
				<div class="deciphering-block">
					<div class="cipher-row">QQ</div>
					<div class="plain-row">qq</div>
				</div>
			</div>

			
			<!--
			<div class="page-section-title">Cribs</div>
			<div><input id="playfair-crib-input" type="text" /> <input id="playfair-crib-btn-add" type="button" value="+ Add New" />
				<input id="playfair-crib-generate" type="button" value="Generate Grids" />
			</div>
			<div id="playfair-section-cribs">
				
			</div>
			!-->
			
			<div class="page-split">
				<div class="page-section-title">Bigram Frequency <a class="f" target="_blank" href="https://www3.nd.edu/~busiforc/handouts/cryptography/Letter%20Frequencies.html">numbers calculated from here</a></div>
				<div>
					<table id="frequency-table" class="frequency-table-two">
						<thead>
							<tr>
								<th colspan="2">Regular text</th>
								<th colspan="2">Cipher text</th>
							</tr>
							<tr class="frequency-table-normalrow">
								<th>Bi</th>
								<th>Freq</th>
								<th>Bi</th>
								<th>Freq</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div><!--<div class="page-split">
				<div class="page-section-title">Patterns</div>
				<div>
					Pattern to search for: <input id="playfair-pattern-input" type="text" />
				</div>
				<div class="pattern-container">
					<ul id="playfair-patterns"></ul>
				</div>
			</div>!-->
		</div>
		<div id="encipher-box">
			<div class="page-section-title">Plain Text <span id="plaintext-options" class="title-options"><input id="auto-spaces" type="checkbox" /> Auto-Spaces</span></div>
			<div class="textarea-container">
				<textarea id="textarea-plaintext"></textarea>
			</div>
		</div>
	</div>

</div>
<script src="<?php echo $__ROOTDIR__ ?>resources/cipher-digraph/playfair.js" type="module"></script>