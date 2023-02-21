<div id="page-playfair" class="page">
	<div class="page-title">Playfair Cipher</div>
	<div class="page-description">
		The Playfair cipher uses a 5x5 letter grid to encipher bigrams. The cipher is slightly distructive, 
		as it requires all i's and j's in the plaintext to be combined. Due to the constraints of the course, we can be
		certain there will always be a key phrase at the beginning, after which follows the remaining letters in alphabetical
		order.
	</div>
	<div class="page-content">
		<div class="page-section-title">The Key</div>
		<div id="page-mono-key-container">
			Key phrase: <input id="playfair-keyphrase-textfield" type="text"> <input id="playfair-lettergrid-update" type="button" value="Update Grid">
			Raw key: <input id="playfair-keyphrase-raw-textfield" type="text">
			
		</div>

		<div class="page-section-title">Manual <input id="playfair-manual-mode" type="checkbox" /> Encipher</div>
		<div style="padding: 15px 0;">
			<div>Current Key: <span id="playfair-minkey"></span></div>
			<div>Best Key: <span id="playfair-bestkey"></span></div>
		</div>
		<div id="playfair-textareas">
			<div class="shift-textarea-container">
				<div>Plain Text <input id="playfair-manual-autospacer" type="button" value="Auto-Spaces" /> </div>
				<textarea id="playfair-textarea-plaintext"></textarea>
			</div><div class="shift-textarea-container">
				<div>Cipher Text</div>
				<textarea id="playfair-textarea-ciphertext"></textarea>
			</div>
		</div>

		<div class="page-section-title">Analysis</div>

		<div id="playfair-deciphering-container">
			<div class="deciphering-block">
				<div class="cipher-row">QQ</div>
				<div class="plain-row">qq</div>
			</div>
		</div>

		<div id="playfair-grid" class="playfair-grid-container"></div>

		<div class="page-section-title">Cribs</div>
		<div><input id="playfair-crib-input" type="text" /> <input id="playfair-crib-btn-add" type="button" value="+ Add New" />
			<input id="playfair-crib-generate" type="button" value="Generate Grids" />
		</div>
		<div id="playfair-section-cribs">
			
		</div>
		
		
		<div class="page-split">
			<div class="page-section-title">Bigram Frequency <a class="f" target="_blank" href="https://www3.nd.edu/~busiforc/handouts/cryptography/Letter%20Frequencies.html">numbers calculated from here</a></div>
			<div>
				<table id="playfair-frequency-table" class="frequency-table-two">
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
		</div><div class="page-split">
			<div class="page-section-title">Patterns</div>
			<div>
				Pattern to search for: <input id="playfair-pattern-input" type="text" />
			</div>
			<div>
				<div>Matches</div>
				<ul id="playfair-pattern-container"></ul>
			</div>
		</div>

		
	</div>

</div>