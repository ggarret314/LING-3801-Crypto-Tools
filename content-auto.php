<div id="content">
	<div id="page-shift" class="page">
		<div class="page-title">Crypto Auto Solver</div>
		<div class="page-description">
			Given a set of enciphers and parameters, find the key to a particular ciphertext.
		</div>
		<div class="shift-textarea-container">
			<div>Cipher Text</div>
			<textarea id="auto-textarea-ciphertext"></textarea>
		</div>

		<div class="page-section-title">Number of Ciphers <input type="button" value="Update" /></div>
		<div>Min: <input type="number" /> Max: <input type="number" /></div>
		<div><input type="checkbox" /> Exact: <input type="number" /></div>

		<div class="page-section-title">Ciphers in Use</div>
		<ol>
			<li><select><option>Unknown</option></select></li>
		</ol>

		<div class="page-section-title">Solution</div>
		<div>
			<div>Key: <span id="auto-key">-</span></div>
			<div class="shift-textarea-container">
				<div>Plain Text</div>
				<textarea id="auto-textarea-plaintext"></textarea>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">
const autoWorker = new Worker("resources/solver.js");

</script>