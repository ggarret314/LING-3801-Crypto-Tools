<div id="page-vigenere" class="page">
	<div class="page-title">Vigenere Cipher</div>
	<div class="page-description">
		The Vigenere cipher works by taking a plain text and enciphering each letter by a particular shift cipher indicated by a key.
		The cryptanalysis involves checking for repeated sequences of letters. A more advanced cryptanalysis involves calculating
		<a href="https://en.wikipedia.org/wiki/Index_of_coincidence">Indexes of coincidence</a> And using those values to determine
		the key length. This method can also be applied to calculate the values of the key with some success.
	</div>
	<div class="page-content">
		<div class="page-section-title">The Key</div>
		<div id="page-mono-key-container">
			Key phrase: <input id="vigenere-keyphrase-textfield" type="text">
		</div>

		<div class="page-section-title">Manual <input id="vigenere-manual-mode" type="checkbox" /> Encipher</div>

		<div id="vigenere-textareas">
			<div class="shift-textarea-container">
				<div>Plain Text <input id="vigenere-manual-autospacer" type="button" value="Auto-Spaces" /> </div>
				<textarea id="vigenere-textarea-plaintext"></textarea>
			</div><div class="shift-textarea-container">
				<div>Cipher Text</div>
				<textarea id="vigenere-textarea-ciphertext"></textarea>
			</div>
		</div>

		<div class="page-section-title">Analysis</div>
		<div id="vigenere-analysis-container">
			<div id="vigenere-repeated-container">
				<div class="vigenere-f">Repeated Sequences</div><div class="vigenere-g">
					<div id="vigenere-repeated-numbers" class="vigenere-h">
						<div class="vigenere-repeated-number">2</div><div class="vigenere-repeated-number">3</div><div class="vigenere-repeated-number">4</div><div class="vigenere-repeated-number">5</div><div class="vigenere-repeated-number">6</div><div class="vigenere-repeated-number">7</div><div class="vigenere-repeated-number">8</div><div class="vigenere-repeated-number">9</div><div class="vigenere-repeated-number">10</div><div class="vigenere-repeated-number">11</div><div class="vigenere-repeated-number">12</div><div class="vigenere-repeated-number">13</div><div class="vigenere-repeated-number">14</div><div class="vigenere-repeated-number">15</div><div class="vigenere-repeated-number">16</div><div class="vigenere-repeated-number">17</div><div class="vigenere-repeated-number">18</div><div class="vigenere-repeated-number">19</div><div class="vigenere-repeated-number">20</div><div class="vigenere-repeated-number">21</div><div class="vigenere-repeated-number">22</div><div class="vigenere-repeated-number">23</div><div class="vigenere-repeated-number">24</div><div class="vigenere-repeated-number">25</div><div class="vigenere-repeated-number">26</div><div class="vigenere-repeated-number">27</div><div class="vigenere-repeated-number">28</div><div class="vigenere-repeated-number">29</div><div class="vigenere-repeated-number">30</div><div class="vigenere-repeated-number">31</div><div class="vigenere-repeated-number">32</div>
					</div>
					<div id="vigenere-repeated-results" class="vigenere-h"></div>
				</div>
			</div>
			<div class="key-container">
				<div class="key-length">Key Length: <input id="vigenere-key-length" type="number" min="1" max="32" /></div>
				<div id="vigenere-key-letters" class="key-letters"></div>
			</div>
			<div id="vigenere-frequency-charts" class="frequency-charts">
				<div class="frequency-chart">
					<div class="freq-column">
						<div class="freq-bar-container"><div class="freq-bar" style="height: 10%"></div></div><div class="freq-label">A</div>
					</div><div class="freq-column">
						<div class="freq-bar-container"><div class="freq-bar" style="height: 100%"></div></div><div class="freq-label">B</div>
					</div><div class="freq-column">
						<div class="freq-bar-container"><div class="freq-bar" style="height: 60%"></div></div><div class="freq-label">C</div>
					</div><div class="freq-column">
						<div class="freq-bar-container"><div class="freq-bar" style="height: 0"></div></div><div class="freq-label">D</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</div>