
<div id="page-monoalphabetic" class="page">
	<div class="page-title">Monoalphabetic Cipher</div>
	<div class="page-description">
		The monoalphabetic cipher is a substitution cipher. You assign a unique cipher letter for each unique plain letter. 
		Typically you write out a "key phrase" or a message in the cipher alphabet and then fill in the rest of the letters alphabetically,
		but you are able to just randomly order the cipher alphabet.
	</div>
	<div class="page-content">
		<div class="page-section-title">The Key <input type="button" value="Clear" /></div>
		<div class="alphabet-container alphabet-plaintext">
			<div class="alphabet-letter">A</div><div class="alphabet-letter">B</div><div class="alphabet-letter">C
			</div><div class="alphabet-letter">D</div><div class="alphabet-letter">E</div><div class="alphabet-letter">F
			</div><div class="alphabet-letter">G</div><div class="alphabet-letter">H</div><div class="alphabet-letter">I
			</div><div class="alphabet-letter">J</div><div class="alphabet-letter">K</div><div class="alphabet-letter">L							
			</div><div class="alphabet-letter">M</div><div class="alphabet-letter">N</div><div class="alphabet-letter">O
			</div><div class="alphabet-letter">P</div><div class="alphabet-letter">Q</div><div class="alphabet-letter">R
			</div><div class="alphabet-letter">S</div><div class="alphabet-letter">T</div><div class="alphabet-letter">U
			</div><div class="alphabet-letter">V</div><div class="alphabet-letter">W</div><div class="alphabet-letter">X
			</div><div class="alphabet-letter">Y</div><div class="alphabet-letter">Z</div><div class="alphabet-desc">Plain letters</div>
		</div>
		<div id="page-mono-cipher-alphabet" class="alphabet-container alphabet-ciphertext"></div>
		<div class="remaining-letters">
			Remaining Cipher Letters:
			<div id="page-mono-remaining-letters" style="display: inline-block">
				<div class="remaining-letter">A</div><div class="remaining-letter">A</div><div class="remaining-letter">A</div>
			</div>
		</div>
		<div id="page-mono-key-container">
			Key phrase: <input id="mono-keyphrase-checkbox" type="checkbox" /> <input id="mono-keyphrase-textfield" type="text" style="display: none">
		</div>

		<div class="page-section-title">Manual <input id="mono-manual-mode" type="checkbox" /> Encipher</div>

		<div id="mono-textareas">
			<div class="shift-textarea-container">
				<div>Plain Text <input id="mono-manual-autospacer" type="button" value="Auto-Spaces" /> <input id="mono-manual-toggle-unsolved" type="button" value="Toggle View Unsolved Letters" /> </div>
				<textarea id="mono-textarea-plaintext"></textarea>
			</div><div class="shift-textarea-container">
				<div>Cipher Text</div>
				<textarea id="mono-textarea-ciphertext"></textarea>
			</div>
		</div>

		<div class="page-section-title">Frequency Analysis <a class="f" target="_blank" href="https://www3.nd.edu/~busiforc/handouts/cryptography/Letter%20Frequencies.html">numbers calculated from here</a></div>
		<div>
			<table id="mono-frequency-table" class="frequency-table">
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
	</div>

</div>
