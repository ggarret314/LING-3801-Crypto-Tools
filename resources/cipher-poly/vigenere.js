import { Alphabet, text_sanitize, WordFinder } from '../main.js';
import { Cipher } from '../cipher.js';
import { CipherDirection } from '../cipherdirection.js';

// VigenereCipher: holds code for vigenere cipher.

const VigenereCipher = {

	key: "AAAA",
	maxKeyLength: 32,

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
		frequencyCharts: document.getElementById("frequency-charts")
	},

	freqCharts: [],

	__keyLength: 4,

	get keyLength() { return this.__keyLength },
	
	set keyLength(x) {
		x = parseInt(x);
		this.__keyLength = x > 0 && x < this.maxKeyLength ? x : 1;
		if (this.keyLength > this.key.length) {
			for (var i = this.key.length; i < this.keyLength; i++) this.key += "A";
		} else if (this.keyLength < this.key.length) {
			this.key = this.key.slice(0, this.keyLength);
		}
		if (this.cipherDirection.isEncipher) this._encipher();
		else this._decipher();
	},

	_initRepeated: function() {
		this.ele.repeatedHeaders.innerHTML = "";
		this.ele.repeatedContents.innerHTML = "";
		for (var i = 2; i <= this.maxKeyLength; i++) {
			var th = document.createElement("th"),
				td = document.createElement("td");
			
			th.innerHTML = i;
			td.innerHTML = "0";

			this.ele.repeatedHeaders.appendChild(th);
			this.ele.repeatedContents.appendChild(td);
		}
	},

	_updateRepeated: function () {

		var ct = text_sanitize(this.ele.textareaCiphertext.value);
		var icStats = this._icStats(ct);
		var seqs = [];
		for (var i = 0; i < 6; i++) seqs.push([]);
		// fill the sequences
		for (var i = 0; i < ct.length - 2; i++) {
			for (var j = 3; j <= 6; j++) {
				var seq = ct.substring(i, i + j);
				seqs[j - 1].push(seq);
			}
		}

		var dists = [];
		for (var i = seqs.length - 1; i > 1; i--) {
			var seqA = seqs[i];
			for(var j = 0; j < seqA.length; j++) {
				if (seqA[j] !== null && seqA.indexOf(seqA[j], j + 1) !== -1) {
					dists.push(seqA.indexOf(seqA[j], j + 1) -  j);
					for (var k = i - 1; k > 1; k--) {
						for (var l = 0; l < 6 - k && j + l < seqs[i].length; l++) {
							seqs[k][j + l] = null;
						}
					}
				}
			}
		}
		
		// spacingFactors: will hold all the factors of the repeated sequences
		var spacingFactors = [];
		for (var i = 2; i < 33; i++) spacingFactors[i] = 0;

		for (var i = 0; i < dists.length; i++) {
			for (var j = 2; j <= 32; j++) {
				if (dists[i] % j == 0) spacingFactors[j]++;
			}
		}




		// Put the factors in their elements
		for (var i = 0; i < this.maxKeyLength - 1; i++) {
			this.ele.repeatedContents.children[i].innerHTML = spacingFactors[i + 2];
		}

	},

	_decipher: function () {
		var key = this.key,
			ct  = text_sanitize(this.ele.textareaCiphertext.value),
			pt  = Cipher.poly.vigenere._decipher(key, ct);
		
		this._updateRepeated();
		//this.frequencyTable._updateFrequencyTable(ct);
		//this.decipheringContainer._update(ct, pt[0].toLowerCase());
		this.ele.textareaPlaintext.value = (this.ele.checkboxAutoSpaces.checked ? WordFinder._wordFind(pt) : pt).toLowerCase();
		this._updateFreqCharts();
	},

	_encipher: function () {
		var key = this.key,
			pt  = text_sanitize(this.ele.textareaPlaintext.value),
			ct  = Cipher.poly.vigenere._encipher(key, pt);
		
			this._updateRepeated();
			//this.frequencyTable._updateFrequencyTable(ct);
			//this.decipheringContainer._update(ct, pt[0].toLowerCase());
			this.ele.textareaCiphertext.value = ct;
			this._updateFreqCharts();
	},

	_updateFreqCharts: function (index = -1) {
		if (index !== -1) {
			// update a specific table
			var pt = text_sanitize(this.ele.textareaPlaintext.value);
			
			// get list of letters incrementing by the key length starting at index
			var letters = {}
			for (var i = index; i < pt.length; i += this.keyLength) {
				if (!(pt[i] in letters)) letters[pt[i]] = 0;
				letters[pt[i]]++;
			}

			// get letter with max value
			var maxLetterValue = 0;
			for (var letter in letters) {
				if (letters[letter] > maxLetterValue) maxLetterValue = letters[letter];
			}

			// update the chart with relative letter frequencies
			var freqChart = this.freqCharts[index];
			for (var i = 0; i < 26; i++) {
				var bar = freqChart.getElementsByClassName("freq-bar")[i];
				var val = (Alphabet[i] in letters ? letters[Alphabet[i]] : 0) * 100 / maxLetterValue;
				val = parseInt(val) + "%";
				bar.style.height = val;
			}

		} else {
			// destroy and rebuild all the tables
			this.ele.frequencyCharts.innerHTML = "";
			this.freqCharts = [];
			for (var i = 0; i < this.keyLength; i++) {
				var freqChart = document.createElement("div");
				freqChart.setAttribute("class", "frequency-chart");
				freqChart.innerHTML = "<div class='freq-chart-title'><input data-i='" + i + "' class='small-btn' type='button' value='<' /> " + this.key[i] + " <input data-i='" + i + "' class='small-btn' type='button' value='>' /></div>";
				for (var j = 0; j < 26; j++) {
					var freqColumn = document.createElement("div");
					freqColumn.setAttribute("class", "freq-column");
					freqColumn.innerHTML = 
						"<div class='freq-bar-container'><div class='freq-bar' style='height: 0%'></div></div><div class='freq-label'>" + Alphabet[j] + "</div>";
					freqChart.appendChild(freqColumn);
				}
				this.ele.frequencyCharts.appendChild(freqChart);
				this.freqCharts.push(freqChart);
				freqChart.getElementsByTagName("input")[0].addEventListener("click", this.__decreaseLetter__);
				freqChart.getElementsByTagName("input")[1].addEventListener("click", this.__increaseLetter__);
			}

			for (var i = 0; i < this.keyLength; i++) this._updateFreqCharts(i);
		}
		

	},

	_icStats: function (s, maxKeyLength=32) {
		var stats = {
			bestKeyLengths: [],
		} 
		
		var cosets = {}
		for (var i = 1; i <= maxKeyLength; i++) {
			var unigrams = [];
			cosets[i] = [];
			for (var j = 0; j < i; j++) {
				cosets[i].push("");
				unigrams[j] = {_: 0, 
					A: 0, B: 0, C: 0, D: 0, E: 0, 
					F: 0, G: 0, H: 0, I: 0, J: 0, 
					K: 0, L: 0, M: 0, N: 0, O: 0, 
					P: 0, Q: 0, R: 0, S: 0, T: 0, 
					U: 0, V: 0, W: 0, X: 0, Y: 0, 
					Z: 0
				};
			}

			for (var j = 0; j < s.length; j++) {
				cosets[i][j % i] += s[j];
				unigrams[j % i][s[j]]++;
				unigrams[j % i]._++;
			}

			//console.log(unigrams);
			var avgIC = 0;
			for (var j = 0; j < unigrams.length; j++) {
				var ic = 0;
				for (var k = 0; k < 26; k++) {
					ic += unigrams[j][Alphabet[k]] * (unigrams[j][Alphabet[k]] - 1);
				}
				ic *= 1 / (unigrams[j]._ * (unigrams[j]._ - 1));
				avgIC += ic;
			}

			avgIC /= unigrams.length;
			stats.bestKeyLengths.push([unigrams.length, avgIC]);

		}

		stats.bestKeyLengths.sort((a, b) => b[1] - a[1]);

		// hold values for each key length
		
		
		//console.log(cosets);

		return stats;
	},

	_init: function () {
		var self = this;

		this._initRepeated();

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

		this.ele.viewAnalysis.addEventListener("change", function (e) {
			self.ele.analysisContainer.style.display = self.ele.viewAnalysis.checked ? "" : "none";
		});

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

		this.ele.keyLength.addEventListener("input", function (e) {
			self.keyLength = e.target.value;
		});

		this.ele.checkboxAutoSpaces.addEventListener("change", function (e) {
			if (!self.cipherDirection.isEncipher) self._decipher();
		});

		this.ele.keySetCipherBtn.addEventListener("click", function (e) {
			self.key = text_sanitize(self.ele.keyPhrase.value);
			self.keyLength = self.key.length;
			self.ele.keyLength.value = self.key.length;
		});
	},

	__increaseLetter__: function (e) {
		var index = parseInt(e.target.getAttribute("data-i"));

		var currKey = VigenereCipher.key[index];
		var nextKey = Alphabet[(26 + Alphabet.indexOf(currKey) + 1) % 26];
		VigenereCipher.key = VigenereCipher.key.slice(0, index) + nextKey + VigenereCipher.key.slice(index + 1);
		e.target.parentNode.parentNode.children[1].innerHTML = nextKey;
		VigenereCipher.ele.keyPhrase.value = VigenereCipher.key;

		VigenereCipher.cipherDirection.isEncipher ? VigenereCipher._encipher() : VigenereCipher._decipher();
		//VigenereCipher._updateFreqCharts();
		//VigenereCipher._updateRepeated();
	},

	__decreaseLetter__: function (e) {
		var index = parseInt(e.target.getAttribute("data-i"));

		var currKey = VigenereCipher.key[index];
		var nextKey = Alphabet[(26 + Alphabet.indexOf(currKey) - 1) % 26];
		VigenereCipher.key = VigenereCipher.key.slice(0, index) + nextKey + VigenereCipher.key.slice(index + 1);
		e.target.parentNode.parentNode.children[1].innerHTML = nextKey;
		VigenereCipher.ele.keyPhrase.value = VigenereCipher.key;

		VigenereCipher.cipherDirection.isEncipher ? VigenereCipher._encipher() : VigenereCipher._decipher();
		//VigenereCipher._updateFreqCharts();
		//VigenereCipher._updateRepeated();
	},
}

VigenereCipher._init();

console.log(Cipher.mono._getFullKey('Corner Begins at the Weirdest Place'));
console.log(VigenereCipher._icStats("EACMSCQALPHEGFEFTZNUTHCWQMTECWIGJTTXRFQWTQXKVDLHUGXZEQHIXLDPQBJBZIGUVBDRSDKDUMSRRGIAQSUAYLUJESISORISJFWLPKURWBDPBLSJDVVVDWNRTNULIMIEZSWYBYJKDKSYZKSLQM"));