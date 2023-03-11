import { Alphabet, text_sanitize, WordFinder } from '../main.js';
import { Cipher } from '../cipher.js';
import { CipherDirection } from '../cipherdirection.js';




// This file contains all of the code needed to do
// Cryptanalysis for the Shift cipher
const ShiftCipher = {

	// All related DOM elements
	ele: {
		decipherBox: 		document.getElementById("decipher-box"),
		encipherBox: 		document.getElementById("encipher-box"),
		ptOptions:			document.getElementById("plaintext-options"),
		textareaCiphertext: document.getElementById("textarea-ciphertext"),
		textareaPlaintext:  document.getElementById("textarea-plaintext"),
		selectKeyLetter:    document.getElementById("key-element"),
		btnKeyDec:			document.getElementById("key-dec"),
		btnKeyInc:			document.getElementById("key-inc"),
		checkboxAutoSpaces: document.getElementById("auto-spaces"),
		keyPt: 				document.getElementById("key-pt"),
		keyCt: 				document.getElementById("key-ct"),
		keyNum:				document.getElementById("key-num"),
	},

	get key() { return parseInt(this.ele.selectKeyLetter.value) },
	set key(x) { this.ele.selectKeyLetter.value = x },

	cipherDirection: null,


	_decipher: function () {
		var key = Cipher.mono._getShiftKey(Alphabet[this.key]),
			ct  = text_sanitize(this.ele.textareaCiphertext.value),
			pt  = Cipher.mono.shift._decipher(key, ct);
		if (this.ele.checkboxAutoSpaces.checked) {
			pt = WordFinder._wordFind(pt);
		}
		this.ele.textareaPlaintext.value = pt;
	},

	_encipher: function () {
		var key = Cipher.mono._getShiftKey(Alphabet[this.key]),
			pt  = text_sanitize(this.ele.textareaPlaintext.value),
			ct  = Cipher.mono.shift._encipher(key, pt);

		this.ele.textareaCiphertext.value = ct;
	},

	// Re-cipher with key
	_updateKey: function () {
		this._updateKeyCt();
		if (this.cipherDirection.isEncipher) this._encipher();
		else this._decipher();
	},

	// Update the cipher alphabet span and the number
	_updateKeyCt: function () {
		this.ele.keyNum.innerHTML = this.key;
		this.ele.keyCt.innerHTML = Cipher.mono._getShiftKey(Alphabet[this.key]);
	},

	// Initialize key select element
	_initSelectKey: function () {
		this.ele.selectKeyLetter.innerHTML = "";
		for (var i = 0; i < Alphabet.length; i++) {
			var option = document.createElement("option");
			option.setAttribute("value", i);
			option.innerHTML = Alphabet[i];
			this.ele.selectKeyLetter.appendChild(option);
		}
	},

	_init: function () {
		var self = this;

		this.cipherDirection = new CipherDirection(
			document.getElementById("control-encipher"),
			document.getElementById("control-decipher"),
			() => {
				// Disable plaintext options
				self.ele.ptOptions.style.display = "none";

				// Swap the encipher / decipher boxes
				var a = self.ele.decipherBox.nextElementSibling;
				var b = self.ele.decipherBox.parentNode;
				self.ele.encipherBox.replaceWith(self.ele.decipherBox);
				b.insertBefore(self.ele.encipherBox, a);

			},
			() => {
				// Enable plaintext options
				self.ele.ptOptions.style.display = "";

				// Swap the encipher / decipher boxes
				var a = self.ele.decipherBox.nextElementSibling;
				var b = self.ele.decipherBox.parentNode;
				self.ele.encipherBox.replaceWith(self.ele.decipherBox);
				b.insertBefore(self.ele.encipherBox, a);
			},
		);

		this._initSelectKey();

		this.ele.textareaCiphertext.addEventListener("input", function (e) {
			if (!self.cipherDirection.isEncipher) {
				self._decipher();
			}
		});

		this.ele.textareaPlaintext.addEventListener("input", function (e) {
			if (self.cipherDirection.isEncipher) {
				self._encipher();
			}
		});

		this.ele.selectKeyLetter.addEventListener("change", function(e) {
			self._updateKey();
		});

		this.ele.btnKeyDec.addEventListener("click", function (e) {
			self.key = (self.key + Alphabet.length - 1) % Alphabet.length;
			self._updateKey();
		});

		this.ele.btnKeyInc.addEventListener("click", function (e) {
			self.key = (self.key + 1) % Alphabet.length;
			self._updateKey();
		});

		this.ele.checkboxAutoSpaces.addEventListener("change", function (e) {
			self._updateKey();
		});
	},

}

ShiftCipher._init();
