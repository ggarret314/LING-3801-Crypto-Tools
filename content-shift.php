<div id="page-shift" class="page">
	<div class="page-title">Shift Cipher</div>
	<div class="page-description">The shift cipher takes the plain text and shifts the letters by some number of letters in the alphabet to create the cipher text.</div>
	<div class="page-content">
		<div class="page-section-title">The Key</div>
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
		<div id="page-shift-cipher-alphabet" class="alphabet-container alphabet-ciphertext">
			<div class="alphabet-letter">A</div><div class="alphabet-letter">B</div><div class="alphabet-letter">C
			</div><div class="alphabet-letter">D</div><div class="alphabet-letter">E</div><div class="alphabet-letter">F
			</div><div class="alphabet-letter">G</div><div class="alphabet-letter">H</div><div class="alphabet-letter">I
			</div><div class="alphabet-letter">J</div><div class="alphabet-letter">K</div><div class="alphabet-letter">L							
			</div><div class="alphabet-letter">M</div><div class="alphabet-letter">N</div><div class="alphabet-letter">O
			</div><div class="alphabet-letter">P</div><div class="alphabet-letter">Q</div><div class="alphabet-letter">R
			</div><div class="alphabet-letter">S</div><div class="alphabet-letter">T</div><div class="alphabet-letter">U
			</div><div class="alphabet-letter">V</div><div class="alphabet-letter">W</div><div class="alphabet-letter">X
			</div><div class="alphabet-letter">Y</div><div class="alphabet-letter">Z</div><div class="alphabet-desc">Cipher letters</div>
		</div>
		<div id="page-shift-key-container">Shift
			<select id="page-shift-key-element"></select>
			letter(s)
			<select id="page-shift-dir-element">
				<option value="f">forward</option>
				<option value="b">backward</option>
			</select>.
			<div>NOTE: You are shifting <i>plain text</i> letters to cipher text letters. To get plain text from <i>cipher text</i>, shift this many letters the opposite direction.</div>
		</div>

		<div class="page-section-title">Manual <input id="shift-manual-mode" type="checkbox" /> Encipher</div>

		<div id="shift-textareas">
			<div class="shift-textarea-container">
				<div>Plain Text <input id="shift-manual-autospacer" type="button" value="Auto-Spaces" /> </div>
				<textarea id="shift-textarea-plaintext"></textarea>
			</div><div class="shift-textarea-container">
				<div>Cipher Text</div>
				<textarea id="shift-textarea-ciphertext"></textarea>
			</div>
		</div>

		<div class="page-section-title">Automatic</div>
		<div id="shift-textareas2">

		</div>
	</div>

</div>