// ShiftCipher: holds the code for solving shift ciphers.
var ShiftCipher = {
	// key: number indicates number of letters to travel forward/backward based on dir(ection) property.
	get key() { return parseInt(this.keyElement.value) },
	set key(x) { this.keyElement.value = x; this._adjustAlphabetText() },
	// dir: true means forward, false means backward.
	get dir() { return this.dirElement.value == "f" },
	set dir(x) { this.dirElement.value = x == true ? "f" : "b"; this._adjustAlphabetText() },
	// manualMode: true means encipher, false means decipher. Determines whether to disable the plain text or cipher text event listener.
	get manualMode() { return document.getElementById("shift-manual-mode").checked },
	set manualMode(x) { document.getElementById("shift-manual-mode").checked = true },

	// cipherAlphabetElement: element for visual cipher text alphabet container.
	cipherAlphabetElement: document.getElementById("page-shift-cipher-alphabet"),
	// keyElement: element for select box for number of letters to shift plaintext by.
	keyElement: document.getElementById("page-shift-key-element"),
	// dirElement: element for select box for direction to shift letters.
	dirElement: document.getElementById("page-shift-dir-element"),
	textareaManualPlaintext: document.getElementById("shift-textarea-plaintext"),
	textareaManualCiphertext: document.getElementById("shift-textarea-ciphertext"),

	// _adjustAlphabetText: method that runs when key/dir is changed to update the visual representation of the key.
	_adjustAlphabetText: function () {
		
		// Loop through Alphabet and assign it to the visual alphabet cells shifted by the key and dir properties.
		for (var i = 0; i < 26; i++) {
			this.cipherAlphabetElement.getElementsByClassName("alphabet-letter")[i].innerHTML = Alphabet[(i + (this.dir ? 1 : -1) * this.key + 26) % 26];
		}
		if (this.manualMode) this._manualEncipher();
		else this._manualDecipher();
	},

	// _manualEncipher: method that enciphers what is in the manual plaintext textarea into the cipher text textarea.
	_manualEncipher: function () {
		// Get the plain text (pt) string.
		var pt = this.textareaManualPlaintext.value;

		// Serialize the string. This is removing any non-letter characters and setting all letters to UPPER CASE.
		pt = pt.toUpperCase().replace(/[^A-Z]/g, "");

		// Initializing the cipher text (ct) string.
		var ct = "";

		// Iterate through each letter in the plain text and translate the letters by the given key amount,
		// adding the result to the cipher text string. Adding a space every five letters for good looks.
		for (var i = 0; i < pt.length; i++) {
			var ptIndex = Alphabet.indexOf(pt[i]); // where plain text letter sits in the alphabet.
			ct += Alphabet[(ptIndex + (this.dir ? 1 : -1) * this.key + 26) % 26];
			if (i > 0 && i + 1 != pt.length && (i + 1) % 5 == 0) ct += " ";
		}

		

		this.textareaManualCiphertext.value = ct;

	},

	_manualDecipher: function() {
		// Get the cipher text (ct) string.
		var ct = this.textareaManualCiphertext.value;
		
		// Serialize the string. This is removing any non-letter characters and setting all letters to UPPER CASE.
		ct = ct.toUpperCase().replace(/[^A-Z]/g, "");

		// Initializing the plain text (pt) string.
		var pt = "";

		// Iterate through each letter in the cipher text and translate the letters by the given key amount (reversed),
		// adding the result to the plain text string. Adding a space every five letters for good looks.
		for (var i = 0; i < ct.length; i++) {
			var ctIndex = Alphabet.indexOf(ct[i]); // where cipher text letter sits in the alphabet.
			pt += Alphabet[(ctIndex - (this.dir ? 1 : -1) * this.key + 26) % 26];
			if (i > 0 && i + 1 != ct.length && (i + 1) % 5 == 0) pt += " ";
		}

		this.textareaManualPlaintext.value = pt.toLowerCase();

	},

	_manualAutoSpacer: function () {
		var pt = this.textareaManualPlaintext.value;
		
		// Serialize the string. This is removing any non-letter characters and setting all letters to UPPER CASE.
		pt = pt.toUpperCase().replace(/[^A-Z]/g, "");

		// Run the auto spacing thing
		this.textareaManualPlaintext.value = WordFinder._wordFind(pt).toLowerCase();
	},

	// _init: initialize the shift cipher page
	_init: function () {
		
		// Load all numbers in key element.
		for (var i = 0; i < 26; i++) {
			var o = document.createElement("option");
			o.setAttribute("value", i);
			o.innerHTML = i;
			this.keyElement.appendChild(o);
		}

		// Setup event listeners.
		this.keyElement.addEventListener('change', this.__updateAlphabetElement__);
		this.dirElement.addEventListener('change', this.__updateAlphabetElement__);
		this.textareaManualPlaintext.addEventListener('input', this.__manualEncipher__);
		this.textareaManualCiphertext.addEventListener('input', this.__manualDecipher__);
		document.getElementById("shift-manual-autospacer").addEventListener('click', this.__shiftmanualautospacer__);

	},


	// Event Listeners...
	__updateAlphabetElement__: function (e) {
		ShiftCipher._adjustAlphabetText();
	},

	__manualEncipher__: function (e) {
		if (ShiftCipher.manualMode) ShiftCipher._manualEncipher();
	},

	__manualDecipher__: function (e) {
		if (!ShiftCipher.manualMode) ShiftCipher._manualDecipher();
	},

	__shiftmanualautospacer__: function (e) {
		if (!ShiftCipher.manualMode) ShiftCipher._manualAutoSpacer();
	}

	
}


ShiftCipher._init();
