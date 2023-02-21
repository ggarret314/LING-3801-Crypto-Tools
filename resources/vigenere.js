// Vigenere: holds code for vigenere cipher.
var Vigenere = {

	key: "A",


	get manualMode() { return document.getElementById("vigenere-manual-mode").checked },
	set manualMode(x) { document.getElementById("vigenere-manual-mode").checked = x },
	keyLength: 1,
	repeatedResultElements: [],

	freqCharts: [],

	// zfmkbdyn

	_manualDecipher: function () {
		var ct = document.getElementById("vigenere-textarea-ciphertext").value;
		ct = ct.toUpperCase().replace(/[^A-Z]/g, "");

		var pt = "";

		for (var i = 0; i < ct.length; i++) {
			var keyIndex = Alphabet.indexOf(this.key[i % this.keyLength]);
			pt += Alphabet[(26 + Alphabet.indexOf(ct[i]) - keyIndex) % 26];
		}

		document.getElementById("vigenere-textarea-plaintext").value = pt.toLowerCase();
	},

	_manualEncipher: function () {
		var pt = document.getElementById("vigenere-textarea-plaintext").value;
		pt = pt.toUpperCase().replace(/[^A-Z]/g, "");
		
		var ct = "";

		for (var i = 0; i < pt.length; i++) {
			var keyIndex = Alphabet.indexOf(this.key[i % this.keyLength]);
			ct += Alphabet[(26 + Alphabet.indexOf(pt[i]) + keyIndex) % 26];
			if ((i + 1) % 5 == 0) ct += " ";
		}

		document.getElementById("vigenere-textarea-ciphertext").value = ct;

	},

	_updateRepeated: function () {

		var ct = document.getElementById("vigenere-textarea-ciphertext").value;
		ct = ct.toUpperCase().replace(/[^A-Z]/g, "");


		// repeatedGroups: will hold how many
		/*var sequences = { 
			2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}, 10: {}, 
			11: {}, 12: {}, 13: {}, 14: {}, 15: {}, 16: {}, 17: {}, 18: {}, 19: {}, 20: {}, 
			21: {}, 22: {}, 23: {}, 24: {}, 25: {}, 26: {}, 27: {}, 28: {}, 29: {}, 30: {}, 31: {}, 32: {}
		}*/

		// sequences: will hold all 3-32 character sequences in the cipher text
		var sequences = {}

		// fill the sequences
		for (var i = 0; i < ct.length - 1; i++) {
			for (var j = 3; j < 33; j++) if (i + j <= ct.length) {
				var seq = ct.substring(i, i + j);
				if (!(seq in sequences)) {
					sequences[seq] = [];
				}
				sequences[seq].push(i);
			}
		}
		
		// repeatedSeq: will hold all repeated sequences (things with >1 values in sequences)
		var repeatedSeq = {};
		
		// spacingFactors: will hold all the factors of the repeated sequences
		var spacingFactors = [];
		for (var i = 2; i < 33; i++) spacingFactors[i] = 0;

		// Find all of the repeated sequences
		for (var seq in sequences) {
			if (sequences[seq].length > 1) {
				var spaces = sequences[seq];
				repeatedSeq[seq] = spaces;
				for (var i = 0; i < spaces.length; i++) {
					for (var j = i + 1 ; j < spaces.length; j++) {
						var space = spaces[j] - spaces[i];
						for (var k = 2; k <= 32; k++) {
							if (space % k == 0) spacingFactors[k]++;
						}
					}
				}
			}
		}

		// I'm not sure removing duplicate sequences matters, so I'm not going to include that, but I was working on it for awhile
		// so I'm not yet comfortable deleting the code so it shall sit here in the comment void.

		/*
		
		

		// Add sequences by index. This first iteration will eliminate forward duplicated sequences.
		var repeatedByIndex = {};
		for (var seq in sequences) if (sequences[seq].length > 1) {
			sequences[seq].forEach(index => {
				if (!(index in repeatedByIndex)) {
					repeatedByIndex[index] = seq;
					//if (!(index - 1 in repeatedByIndex) || (repeatedByIndex[index - 1].indexOf(seq) == -1)) repeatedByIndex[index] = seq;
				}// else if (seq.length > repeatedByIndex[index].length) repeatedByIndex[index] = seq;
			});
		}
		
		// This iteration will eliminate backward duplicated sequences.
		console.log(Object.keys(repeatedByIndex).map(Number).reverse());
		Object.keys(repeatedByIndex).map(Number).reverse().forEach(index => {
			if (index - 1 in repeatedByIndex && repeatedByIndex[index - 1].indexOf(repeatedByIndex[index]) != -1) delete repeatedByIndex[index];

		});


		// Put all of the repeated sequences in the repeatedSeq object
		for (var index in repeatedByIndex) {
			if (!(repeatedByIndex[index] in repeatedSeq)) {
				repeatedSeq[repeatedByIndex[index]] = [];
				console.log(repeatedByIndex[index]);
			}
			repeatedSeq[repeatedByIndex[index]].push(index);
		}

		
		
		*/

		// Put the factors in their elements
		for (var i = 0; i < 31; i++) {
			this.repeatedResultElements[i].innerHTML = spacingFactors[i + 2];
		}

	},

	_updateKeyLength: function () {
		var keyLettersElement = document.getElementById("vigenere-key-letters");

		this.keyLength = parseInt(document.getElementById("vigenere-key-length").value);

		if (this.keyLength > this.key.length) {
			for (var i = this.key.length; i < this.keyLength; i++) this.key += "A";
		} else if (this.keyLength < this.key.length) {
			this.key = this.key.slice(0, this.keyLength);
		}

		keyLettersElement.innerHTML = "";
		for (var i = 0; i < this.keyLength; i++) {
			var keyContainer = document.createElement("div");
			keyContainer.setAttribute("class", "key-letter-container");
			keyContainer.innerHTML = 
				"<div class='key-letter-control'><input data-i='" + i + "' type='button' value='^'></div>" + 
				"<div class='key-letter'>" + this.key[i] + "</div>" + 
				"<div class='key-letter-control'><input data-i='" + i + "' type='button' value='v'></div>";
			keyLettersElement.append(keyContainer);
			keyContainer.getElementsByTagName("input")[0].addEventListener('click', this.__increaseLetter__);
			keyContainer.getElementsByTagName("input")[1].addEventListener('click', this.__decreaseLetter__);
		}

		document.getElementById("vigenere-keyphrase-textfield").value = Vigenere.key;
		this._updateFreqCharts();
	},

	_updateFreqCharts: function (index = -1) {
		/*<div class="frequency-chart">
			<div class="freq-column">
				<div class="freq-bar-container"><div class="freq-bar" style="height: 10%"></div></div><div class="freq-label">A</div>
			</div><div class="freq-column">
				<div class="freq-bar-container"><div class="freq-bar" style="height: 100%"></div></div><div class="freq-label">B</div>
			</div><div class="freq-column">
				<div class="freq-bar-container"><div class="freq-bar" style="height: 60%"></div></div><div class="freq-label">C</div>
			</div><div class="freq-column">
				<div class="freq-bar-container"><div class="freq-bar" style="height: 0"></div></div><div class="freq-label">D</div>
			</div>
		</div>*/
		if (index !== -1) {
			// update a specific table
			var pt = this.manualMode ? 
				document.getElementById("vigenere-textarea-ciphertext").value :
				document.getElementById("vigenere-textarea-plaintext").value;

			pt = pt.toUpperCase().replace(/[^A-Z]/g, "");

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
			var freqChartsElement = document.getElementById("vigenere-frequency-charts");
			freqChartsElement.innerHTML = "";
			this.freqCharts = [];
			for (var i = 0; i < this.keyLength; i++) {
				var freqChart = document.createElement("div");
				freqChart.setAttribute("class", "frequency-chart");
				freqChart.innerHTML = "<div class='freq-chart-title'>" + this.key[i] + "</div>";
				for (var j = 0; j < 26; j++) {
					var freqColumn = document.createElement("div");
					freqColumn.setAttribute("class", "freq-column");
					freqColumn.innerHTML = 
						"<div class='freq-bar-container'><div class='freq-bar' style='height: 0%'></div></div><div class='freq-label'>" + Alphabet[j] + "</div>";
					freqChart.appendChild(freqColumn);
				}
				freqChartsElement.appendChild(freqChart);
				this.freqCharts.push(freqChart);
			}

			for (var i = 0; i < this.keyLength; i++) this._updateFreqCharts(i);
		}
		

	},

	_manualAutoSpacer: function () {
		var pt = document.getElementById("vigenere-textarea-plaintext").value;
		
		// Serialize the string. This is removing any non-letter characters and setting all letters to UPPER CASE.
		pt = pt.toUpperCase().replace(/[^A-Z]/g, "");

		// Run the auto spacing thing
		document.getElementById("vigenere-textarea-plaintext").value = WordFinder._wordFind(pt).toLowerCase();
	},

	_initKeyLength: function () {
		document.getElementById("vigenere-key-length").value = 1;
		this._updateKeyLength();
	},

	_initRepeated: function () {
		var repeatedResultsElement = document.getElementById("vigenere-repeated-results");

		for (var i = 0; i < 31; i++) {
			var res = document.createElement("div");
			res.setAttribute("class", "vigenere-repeated-number");
			repeatedResultsElement.appendChild(res);
			this.repeatedResultElements.push(res);
		}
	},


	_init: function () {
		this._initRepeated();
		this._initKeyLength();
		this._updateRepeated();


		//document.getElementById("vigenere-keyphrase-textfield").value = "A";
		document.getElementById("vigenere-textarea-ciphertext").addEventListener("input", this.__textareaCiphertext__);
		document.getElementById("vigenere-key-length").addEventListener("input", this.__keyLength__);
		document.getElementById("vigenere-manual-autospacer").addEventListener("click", this.__shiftmanualautospacer__);
		document.getElementById("vigenere-textarea-plaintext").addEventListener("input", this.__textareaPlaintext__);
	},

	__textareaCiphertext__: function (e) {
		if (!Vigenere.manualMode) {
			Vigenere._manualDecipher();
			Vigenere._updateFreqCharts();
			Vigenere._updateRepeated();
		}

		
	},

	__textareaPlaintext__: function (e) {
		if (Vigenere.manualMode) {
			Vigenere._manualEncipher();
			Vigenere._updateFreqCharts();
			Vigenere._updateRepeated();
		}
	},

	__increaseLetter__: function (e) {
		var index = parseInt(e.target.getAttribute("data-i"));

		var currKey = Vigenere.key[index];
		var nextKey = Alphabet[(26 + Alphabet.indexOf(currKey) + 1) % 26];
		Vigenere.key = Vigenere.key.slice(0, index) + nextKey + Vigenere.key.slice(index + 1);
		e.target.parentNode.parentNode.children[1].innerHTML = nextKey;
		document.getElementById("vigenere-keyphrase-textfield").value = Vigenere.key;

		Vigenere.manualMode ? Vigenere._manualEncipher() : Vigenere._manualDecipher();
		Vigenere._updateFreqCharts();
		Vigenere._updateRepeated();
	},

	__decreaseLetter__: function (e) {
		var index = parseInt(e.target.getAttribute("data-i"));

		var currKey = Vigenere.key[index];
		var nextKey = Alphabet[(26 + Alphabet.indexOf(currKey) - 1) % 26];
		Vigenere.key = Vigenere.key.slice(0, index) + nextKey + Vigenere.key.slice(index + 1);
		e.target.parentNode.parentNode.children[1].innerHTML = nextKey;
		document.getElementById("vigenere-keyphrase-textfield").value = Vigenere.key;

		Vigenere.manualMode ? Vigenere._manualEncipher() : Vigenere._manualDecipher();
		Vigenere._updateFreqCharts();
		Vigenere._updateRepeated();
	},

	__keyLength__: function (e) {
		e.target.value = e.target.value == "" || parseInt(e.target.value) < 1 ? 1 : parseInt(e.target.value) > 32 ? 32 : e.target.value; 
		Vigenere._updateKeyLength();
	},

	__shiftmanualautospacer__: function (e) {
		if (!Vigenere.manualMode) Vigenere._manualAutoSpacer();
	},


}



Vigenere._init();
