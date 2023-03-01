// Vigenere: holds code for vigenere cipher.
var Vigenere = {

	key: "A",


	get manualMode() { return document.getElementById("vigenere-manual-mode").checked },
	set manualMode(x) { document.getElementById("vigenere-manual-mode").checked = x },
	keyLength: 1,
	repeatedResultElements: [],

	freqCharts: [],

	// zfmkbdyn

	_decipher: function(key, ct) {
		var pt = "";

		for (var i = 0; i < ct.length; i++) {
			var a = Alphabet.indexOf(key[i % key.length]);
			pt += Alphabet[(Alphabet.indexOf(ct[i]) - a + 26) % 26];
		}

		return pt;
	},

	_encipher: function (key, pt) {
		var ct = "";

		for (var i = 0; i < pt.length; i++) {
			var a = Alphabet.indexOf(key[i % key.length]);
			ct += Alphabet[(Alphabet.indexOf(pt[i]) + a) % 26];
		}

		return ct;
	},

	_manualDecipher: function () {
		var ct = document.getElementById("vigenere-textarea-ciphertext").value;
		ct = ct.toUpperCase().replace(/[^A-Z]/g, "");

		var pt = this._decipher(this.key, ct);

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

	_autoSolver: function () {
		
	},

	_autoSolve: function () {

	},

	_autoSolveVisualizer: function () {

	},

	_updateRepeated: function () {

		var ct = document.getElementById("vigenere-textarea-ciphertext").value;
		ct = ct.toUpperCase().replace(/[^A-Z]/g, "");
		this._icStats(ct);
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



		//console.log("dists", dists);
		//console.log("seqs", seqs);
		//console.log("sequences", sequences);
		//console.log("repeated:", repeatedSeq);
		//console.log("spacing actors: ", spacingFactors);
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
		console.log(stats);

		return stats;
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
