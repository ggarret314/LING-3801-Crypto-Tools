import { Alphabet, text_sanitize, WordFinder } from '../main.js';
import { Cipher } from '../cipher.js';
import { CipherDirection } from '../classes/cipherdirection.js';
import { FrequencyTable } from '../classes/frequencytable.js';
import { DecipheringContainer } from '../classes/decipheringcontainer.js';





// This file contains all of the code needed to do
// Cryptanalysis for the Substitution cipher

const SubstitutionCipher = {
	
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
		frequencyTable: document.getElementById("frequency-table"),
		viewAnalysis: document.getElementById("view-analysis"),
		analysisContainer: document.getElementById("analysis-container"),
		checkboxAutoSpaces: document.getElementById("auto-spaces"),
	},

	frequencyTable: null,
	cipherDirection: null,
	decipheringContainer: null,

	__cipherAlphabet: "..........................",
	get cipherAlphabet() { return this.__cipherAlphabet },
	set cipherAlphabet(s) {
		this.__cipherAlphabet = s;
		if (this.cipherDirection.isEncipher) this._encipher();
		else this._decipher();
	},

	_decipher: function () {
		var key = this.cipherAlphabet,
			ct  = text_sanitize(this.ele.textareaCiphertext.value),
			pt  = Cipher.mono.substitution._decipher(key, ct);
		
		this.frequencyTable._updateFrequencyTable(ct);
		this.decipheringContainer._update(ct, pt[0].toLowerCase());
		this.ele.textareaPlaintext.value = (this.ele.checkboxAutoSpaces.checked ? WordFinder._wordFind(pt[1]) : pt[1]).toLowerCase();
	},

	_encipher: function () {
		var key = this.cipherAlphabet,
			pt  = text_sanitize(this.ele.textareaPlaintext.value),
			ct  = Cipher.mono.substitution._encipher(key, pt);
		
			this.frequencyTable._updateFrequencyTable(ct);
			this.decipheringContainer._update(ct, pt[0].toLowerCase());
			this.ele.textareaCiphertext.value = ct;
	},

	_updateDecipheringBlock: function () {

	},

	_initAlphabet: function () {
		for (var i = 0; i < Alphabet.length; i++) {
			var a = document.createElement("div"),
				b = document.createElement("div"),
				c = document.createElement("div"),
				d = document.createElement("input");

			a.setAttribute("class", "key-letter-container2");
			b.innerHTML = Alphabet[i];
			d.setAttribute("class", "key-letter-input2");
			d.setAttribute("type", "text");
			d.setAttribute("data-i", i);
			
			c.appendChild(d);
			a.appendChild(b);
			a.appendChild(c);

			this.ele.keyLetters.push(d);

			this.ele.keyLettersContainer.appendChild(a);
		}
	},

	_init: function () {
		var self = this;

		
		this._initAlphabet();

		this.frequencyTable = new FrequencyTable(this.ele.frequencyTable, [1, 2, 3, 4]);
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
		
		this.decipheringContainer = new DecipheringContainer(document.getElementById("deciphering-container"));

		this.ele.keySetCipherBtn.addEventListener("click", function (e) {
			self.cipherAlphabet = Cipher.mono._getFullKey(self.ele.keyPhrase.value);
			
			self.ele.keyCt.innerHTML = self.cipherAlphabet;

			for (var i = 0; i < Alphabet.length; i++) {
				self.ele.keyLetters[i].value = self.cipherAlphabet[i];
			}

		});

		this.ele.keyClearBtn.addEventListener("click", function (e) {

			self.cipherAlphabet = "..........................";
			self.ele.keyCt.innerHTML = self.cipherAlphabet;

			for (var i = 0; i < Alphabet.length; i++) {
				self.ele.keyLetters[i].value = "";
			}
		});

		for (var i = 0; i < Alphabet.length; i++) {
			
			this.ele.keyLetters[i].addEventListener("input", function (e) {
				e.target.value = e.target.value.length == 0 ? "" : text_sanitize(e.target.value[e.target.value.length - 1]);
				var j = parseInt(e.target.getAttribute("data-i"));
				self.cipherAlphabet = 
					self.cipherAlphabet.substring(0, j) + 
					(e.target.value == "" ? "." : e.target.value) + 
					self.cipherAlphabet.substring(j + 1);
				self.ele.keyCt.innerHTML = self.cipherAlphabet;
			});

		}
		
		this.ele.viewAnalysis.addEventListener("change", function (e) {
			self.ele.analysisContainer.style.display = self.ele.viewAnalysis.checked ? "" : "none";
		});

		this.ele.textareaCiphertext.addEventListener("input", function (e) {
			if (!self.cipherDirection.isEncipher) self._decipher();
		});

		this.ele.textareaPlaintext.addEventListener("input", function (e) {
			if (self.cipherDirection.isEncipher) self._encipher();
		});

		this.ele.checkboxAutoSpaces.addEventListener("change", function (e) {
			if (!self.cipherDirection.isEncipher) self._decipher();
		});
	}
}


SubstitutionCipher._init();

/*
var MonoalphabeticCipher = {

	get keyPhrase() { return this.keyPhraseTextfieldElement.value },
	set keyPhrase(str) { this.keyPhraseTextfieldElement.value = str },

	get keyPhraseEnabled() { return this.keyPhraseCheckboxElement.checked },
	set keyPhraseEnabled(t) { 
		this.keyPhraseCheckboxElement.checked = t;
		this.keyPhraseTextfieldElement.style.display = t ? "inline" : "none";
	},

	fullKey: "..........................",

	manualPt: "",
	manualPtWithUnsolved: "",
	ptType: true,

	// manualMode: true means encipher, false means decipher. Determines whether to disable the plain text or cipher text event listener.
	get manualMode() { return document.getElementById("mono-manual-mode").checked },
	set manualMode(x) { document.getElementById("mono-manual-mode").checked = x },


	cipherAlphabetElement: document.getElementById("page-mono-cipher-alphabet"),
	keyPhraseCheckboxElement: document.getElementById("mono-keyphrase-checkbox"),
	keyPhraseTextfieldElement: document.getElementById("mono-keyphrase-textfield"),

	frequencyTableElement: document.getElementById("mono-frequency-table"),
	frequencyTable: {
		letterRegularElements: [],
		letterCipherElements: [],
		bigramRegularElements: [],
		bigramCipherElements: [],
		trigramRegularElements: [],
		trigramCipherElements: [],
		quadrigramRegularElements: [],
		quadrigramCipherElements: [],
	},

	_updateManualKey: function () {
		console.log("test");
		for (var i = 0; i < 26; i++) {
			var cipherLetter = document.getElementById("cipherLetter" + i).value;
			cipherLetter = cipherLetter.toUpperCase().replace(/[^A-Z]/g, "");
			
			if (cipherLetter.length > 0) {
				cipherLetter = cipherLetter[cipherLetter.length - 1];
				this.fullKey = this.fullKey.substring(0, i) + cipherLetter + this.fullKey.substring(i + 1);
			} else this.fullKey = this.fullKey.substring(0, i) + "." + this.fullKey.substring(i + 1);
		}
		this._updateRemainingLetters();
		if (!this.manualMode) this._manualDecipher();
		else this._manualEncipher();
	},

	_manualAutoSpacer: function () {
		var pt = document.getElementById("mono-textarea-plaintext").value;
		
		// Serialize the string. This is removing any non-letter characters and setting all letters to UPPER CASE.
		pt = pt.toUpperCase().replace(/[^A-Z]/g, "");

		// Run the auto spacing thing
		document.getElementById("mono-textarea-plaintext").value = WordFinder._wordFind(pt).toLowerCase();
	},

	_manualDecipher: function() {
		this._updateFrequencyTable();

		var ct = document.getElementById("mono-textarea-ciphertext").value;
		ct = ct.toUpperCase().replace(/[^A-Z]/g, "");

		// loop through each letter of the cipher text, substituting the letter from the key if we have the letter.
		// we'll have two plaintexts, one with and one without unsolved letters.
		var pt = "";
		var ptWithUnsolved = "";
		for (var i = 0; i < ct.length; i++) {
			var ctIndex = this.fullKey.indexOf(ct[i]);
			if (ctIndex !== -1) {
				pt += Alphabet[ctIndex].toLowerCase();
				ptWithUnsolved += Alphabet[ctIndex].toLowerCase();
			} else {
				pt += ".";
				ptWithUnsolved += ct[i];
			}
		}
		this.manualPt = pt;
		this.manualPtWithUnsolved = ptWithUnsolved;

		document.getElementById("mono-textarea-plaintext").value = ptWithUnsolved;
	},

	_manualEncipher: function () {
		var pt = document.getElementById("mono-textarea-plaintext").value;
		pt = pt.toUpperCase().replace(/[^A-Z]/g, "");

		var ct = "";
		for (var i = 0; i < pt.length; i++) {
			ct += this.fullKey[Alphabet.indexOf(pt[i])];
		}
		document.getElementById("mono-textarea-ciphertext").value = ct;
		this._updateFrequencyTable();
	},

	_initCipherAlphabet: function () {
		var alphabetContainer = document.getElementById("page-mono-cipher-alphabet");
		for (var i = 0; i < 26; i++) {
			var inputContainer = document.createElement("div");
			inputContainer.setAttribute("class", "alphabet-letter");
			var input = document.createElement("input");
			input.setAttribute("class", "page-shift-cipher-letter");
			input.setAttribute("type", "text");
			input.setAttribute("data-i", i);
			input.id = "cipherLetter" + i;
			inputContainer.appendChild(input);
			alphabetContainer.appendChild(inputContainer);
		}

		alphabetContainer.innerHTML += '<div class="alphabet-desc">Cipher letters</div>';
	},

	_updateRemainingLetters: function () {
		var element = document.getElementById("page-mono-remaining-letters");
		element.innerHTML = "";
		for (var i = 0; i < 26; i++) {
			if (this.fullKey.indexOf(Alphabet[i]) == -1) {
				var letter = Alphabet[i];
				var ele = document.createElement("div");
				ele.setAttribute("class", "remaining-letter");
				ele.innerHTML = letter;
				element.appendChild(ele);
			}

		}
	},

	_initFrequencyTable: function () {
		// Find total number of rows required.
		var totalRows = 0;
		for (var freq in EnglishFrequencies) {
			if (EnglishFrequencies[freq].length > totalRows) totalRows = EnglishFrequencies[freq].length;
		}

		// Create the rows
		var rows = [];
		for (var i = 0; i < totalRows; i++) {
			rows.push(document.createElement("tr"));
		}

		// Determine number of each thing
		var EngFreqTitles = ["freqLetters", "freqBigrams", "freqTrigrams", "freqQuadrigrams"];
		var EleTitles = [["letterRegularElements","letterCipherElements"], ["bigramRegularElements","bigramCipherElements"], 
						 ["trigramRegularElements","trigramCipherElements"], ["quadrigramRegularElements","quadrigramCipherElements"]];
		for (var i = 0; i < EngFreqTitles.length; i++) {
			var theFreq = EnglishFrequencies[EngFreqTitles[i]];
			for (var j = 0; j < theFreq.length; j++) {
				// create two regular and two cipher columns for each thing
				var p1 = document.createElement("td");
				var p2 = document.createElement("td");
				var c1 = document.createElement("td");
				var c2 = document.createElement("td");

				// fill regular columns with appropriate data
				p1.innerHTML = theFreq[j][0];
				p2.innerHTML = theFreq[j][1].toFixed(1) + "%";

				// add the columns in frequencyTable object
				this.frequencyTable[EleTitles[i][0]].push([p1, p2]);
				this.frequencyTable[EleTitles[i][1]].push([c1, c2]);

				// add the columns to the jth row
				rows[j].append(p1);
				rows[j].append(p2);
				rows[j].append(c1);
				rows[j].append(c2);
			}
		}

		// add rows to table
		for (var i = 0; i < rows.length; i++) {
			this.frequencyTableElement.children[1].append(rows[i]);
		}

	},



	_updateFrequencyTable: function() {
		// Get cipher text (ct) string
		var ct = document.getElementById("mono-textarea-ciphertext").value;
		
		// Serialize the string. This is removing any non-letter characters and setting all letters to UPPER CASE.
		ct = ct.toUpperCase().replace(/[^A-Z]/g, "");

		// Calculate the number of each letter, bigram, etc.
		var letterTotal = 0, bigramTotal = 0, trigramTotal = 0, quadrigramTotal = 0;
		var letters = {}, bigrams = {}, trigrams = {}, quadrigrams = {};
		var sortedletters = [], sortedbigrams = [], sortedtrigrams = [], sortedquadrigrams = [];
		for (var i = 0; i < ct.length; i++) {
			// letter
			if (!(ct[i] in letters)) letters[ct[i]] = 1;
			else letters[ct[i]]++;
			letterTotal++;
			// bigram
			if (i + 1 < ct.length) {
				if (!(ct.substring(i, i + 2) in bigrams)) bigrams[ct.substring(i, i + 2)] = 1;
				else bigrams[ct.substring(i, i + 2)]++;
				bigramTotal++;
			}

			// trigram
			if (i + 1 < ct.length) {
				if (!(ct.substring(i, i + 3) in trigrams)) trigrams[ct.substring(i, i + 3)] = 1;
				else trigrams[ct.substring(i, i + 3)]++;
				trigramTotal++;
			}

			// quadrigram
			if (i + 1 < ct.length) {
				if (!(ct.substring(i, i + 4) in quadrigrams)) quadrigrams[ct.substring(i, i + 4)] = 1;
				else quadrigrams[ct.substring(i, i + 4)]++;
				quadrigramTotal++;
			}
		}

		// sort them

		for (var letter in letters) {
			sortedletters.push([letter, letters[letter]]);
		}

		for (var bigram in bigrams) {
			sortedbigrams.push([bigram, bigrams[bigram]]);
		}

		for (var trigram in trigrams) {
			sortedtrigrams.push([trigram, trigrams[trigram]]);
		}

		for (var quadrigram in quadrigrams) {
			sortedquadrigrams.push([quadrigram, quadrigrams[quadrigram]]);
		}
		
		sortedletters.sort((a, b) => b[1] - a[1]);
		sortedbigrams.sort((a, b) => b[1] - a[1]);
		sortedtrigrams.sort((a, b) => b[1] - a[1]);
		sortedquadrigrams.sort((a, b) => b[1] - a[1]);

		// calculate relative frequencies.
		if (sortedletters.length > 0 && sortedbigrams.length > 0 && sortedtrigrams.length > 0 && sortedquadrigrams.length > 0) {
			var topLetterCount = sortedletters[0][1], topBigramCount = sortedbigrams[0][1], topTrigramCount = sortedtrigrams[0][1], topQuadrigramCount = sortedquadrigrams[0][1];
			sortedletters.forEach(x => x[1] = (100 * x[1] / topLetterCount).toFixed(1) + "%");
			sortedbigrams.forEach(x => x[1] = (100 * x[1] / topBigramCount).toFixed(1) + "%");
			sortedtrigrams.forEach(x => x[1] = (100 * x[1] / topTrigramCount).toFixed(1) + "%");
			sortedquadrigrams.forEach(x => x[1] = (100 * x[1] / topQuadrigramCount).toFixed(1) + "%");
	
	
			// print them out on the table
	
			for (var i = 0; i < this.frequencyTable.letterCipherElements.length && i < sortedletters.length; i++) {
				var currElements = this.frequencyTable.letterCipherElements[i];
				currElements[0].innerHTML = sortedletters[i][0];
				currElements[1].innerHTML = sortedletters[i][1];
				
			}
	
			for (var i = 0; i < this.frequencyTable.bigramCipherElements.length && i < sortedbigrams.length; i++) {
				var currElements = this.frequencyTable.bigramCipherElements[i];
				currElements[0].innerHTML = sortedbigrams[i][0];
				currElements[1].innerHTML = sortedbigrams[i][1];
				
			}
	
			for (var i = 0; i < this.frequencyTable.trigramCipherElements.length && i < sortedtrigrams.length; i++) {
				var currElements = this.frequencyTable.trigramCipherElements[i];
				currElements[0].innerHTML = sortedtrigrams[i][0];
				currElements[1].innerHTML = sortedtrigrams[i][1];
				
			}
	
			for (var i = 0; i < this.frequencyTable.quadrigramCipherElements.length && i < sortedquadrigrams.length; i++) {
				var currElements = this.frequencyTable.quadrigramCipherElements[i];
				currElements[0].innerHTML = sortedquadrigrams[i][0];
				currElements[1].innerHTML = sortedquadrigrams[i][1];
				
			}	
		}
		

	},

	_init: function () {
		this.keyPhraseEnabled = false;


		// Initialize cipher alphabet inputs
		this._initCipherAlphabet();

		// Initialize freq table
		this._initFrequencyTable();

		this._updateRemainingLetters();

		// Enable event listeners
		this.keyPhraseCheckboxElement.addEventListener("change", this.__keyPhraseCheckbox__);

		for (var i = 0; i < 26; i++) {
			document.getElementById("page-mono-cipher-alphabet")
				.getElementsByClassName("page-shift-cipher-letter")[i]
				.addEventListener("input", this.__cipherLetterInput__);
			document.getElementById("page-mono-cipher-alphabet")
				.getElementsByClassName("page-shift-cipher-letter")[i]
				.addEventListener("keydown", this.__cipherLetterControl__);
		}

		document.getElementById("mono-textarea-ciphertext").addEventListener("input", this.__ciphertextarea__);

		document.getElementById("mono-textarea-plaintext").addEventListener("input", this.__plaintextarea__);

		document.getElementById("mono-manual-autospacer").addEventListener('click', this.__shiftmanualautospacer__);

		document.getElementById("mono-manual-toggle-unsolved").addEventListener("click", this.__toggleunsolved__);
		
	},


	// Event listeners
	__keyPhraseCheckbox__: function(e) {
		MonoalphabeticCipher.keyPhraseTextfieldElement.style.display = MonoalphabeticCipher.keyPhraseEnabled ? "inline" : "none";
	},

	__cipherLetterInput__: function (e) {
		if (e.target.value.length > 0) e.target.value = e.target.value[e.target.value.length - 1].toUpperCase();
		MonoalphabeticCipher._updateManualKey();
	},

	__cipherLetterControl__: function (e) {
		switch(e.keyCode) {
			case 37:
			case 39:
				var newInputLetter = document.getElementById("cipherLetter" + ((26 + parseInt(e.target.getAttribute("data-i")) + (e.keyCode == 37 ? -1 : 1)) % 26));
				newInputLetter.focus();
				//newInputLetter.selectionStart = newInputLetter.selectionEnd = newInputLetter.value.length;
				break;
		}
		
	},

	__ciphertextarea__: function (e) {
		if (!MonoalphabeticCipher.manualMode) MonoalphabeticCipher._manualDecipher();
	},

	__plaintextarea__: function (e) {
		if (MonoalphabeticCipher.manualMode) MonoalphabeticCipher._manualEncipher();
	},

	__shiftmanualautospacer__: function (e) {
		if (!MonoalphabeticCipher.manualMode) MonoalphabeticCipher._manualAutoSpacer();
	},

	__toggleunsolved__: function (e) {
		document.getElementById("mono-textarea-plaintext").value = MonoalphabeticCipher.ptType ? MonoalphabeticCipher.manualPt : MonoalphabeticCipher.manualPtWithUnsolved;
		MonoalphabeticCipher.ptType = !MonoalphabeticCipher.ptType;
	}

}


function decipher(key, ct) {
	
	// loop through each letter of the cipher text, substituting the letter from the key if we have the letter.
	// we'll have two plaintexts, one with and one without unsolved letters.
	var pt = "";
	var ptWithUnsolved = "";
	for (var i = 0; i < ct.length; i++) {
		var ctIndex = key.indexOf(ct[i]);
		if (ctIndex !== -1) {
			pt += Alphabet[ctIndex].toLowerCase();
			ptWithUnsolved += Alphabet[ctIndex].toLowerCase();
		} else {
			ptWithUnsolved += ct[i];
		}
	}
	console.log(pt);
	console.log(ptWithUnsolved);
}

decipher(
	"NOTGUILY.......J...Q......",
//	"NOTGUILYABCDEFHJKMPQRSVWXZ", 
	"QYUJHDATUVUMUPREEHFUGNFGQYUVYHDUHIDAQQDUYN"
);

MonoalphabeticCipher._init();

*/