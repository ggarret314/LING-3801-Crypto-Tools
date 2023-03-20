import { Alphabet, text_sanitize, WordFinder } from '../main.js';
import { Cipher } from '../cipher.js';
import { CipherDirection } from '../cipherdirection.js';


const ColumnarTransCipher = {

    key: '',

    ele: {
        decipherBox: 		document.getElementById("decipher-box"),
		encipherBox: 		document.getElementById("encipher-box"),
		ptOptions:			document.getElementById("plaintext-options"),
		textareaCiphertext: document.getElementById("textarea-ciphertext"),
		textareaPlaintext:  document.getElementById("textarea-plaintext"),
		keyPhrase: document.getElementById("key-phrase"),
		keySetCipherBtn: document.getElementById("key-set-cipher-btn"),
		keyClearBtn: document.getElementById("key-clear-btn"),
		keyCt: document.getElementById("key-ct"),
		keyLettersContainer: document.getElementById("key-letters"),
		keyLetters: [],
		keyLength: document.getElementById("key-length"),
		frequencyTable: document.getElementById("frequency-table"),
		viewAnalysis: document.getElementById("view-analysis"),
		analysisContainer: document.getElementById("analysis-container"),
		checkboxAutoSpaces: document.getElementById("auto-spaces"),
		repeatedHeaders: document.getElementById("repeated-headers"),
		repeatedContents: document.getElementById("repeated-contents"),
		frequencyCharts: document.getElementById("frequency-charts"),
		keyAuto: document.getElementById("key-auto"),
    },

    _encipher: function () {
        if (this.key.length == 0) return;
        var pt = text_sanitize(this.ele.textareaPlaintext.value),
            key = this.key,
            ct = Cipher.trans.columnar._encipher(key, pt);

        this.ele.textareaCiphertext.value = ct;
    },

    _decipher: function () {
        if (this.key.length == 0) return;
        var ct = text_sanitize(this.ele.textareaCiphertext.value),
            key = this.key,
            pt = Cipher.trans.columnar._decipher(key, ct);

        this.ele.textareaPlaintext.value = (this.ele.checkboxAutoSpaces.checked ? WordFinder._wordFind(pt) : pt).toLowerCase();
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

        this.ele.checkboxAutoSpaces.addEventListener("change", function (e) {
			if (!self.cipherDirection.isEncipher) self._decipher();
		});

		this.ele.keySetCipherBtn.addEventListener("click", function (e) {
			self.key = text_sanitize(self.ele.keyPhrase.value);
            if (self.cipherDirection.isEncipher) self._encipher();
            else self._decipher();
		});

    }
}


ColumnarTransCipher._init();
