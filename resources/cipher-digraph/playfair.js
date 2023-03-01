// Playfair: holds the code for playfair cipher
var Playfair = {

	get keyPhrase() { return document.getElementById("playfair-keyphrase-textfield").value },
	set keyPhrase(s) { this.keyPhraseRaw = s },

	get keyPhraseRaw() { return document.getElementById("playfair-keyphrase-raw-textfield").value },
	set keyPhraseRaw(s) {
		document.getElementById("playfair-keyphrase-textfield").value = s;
		sRaw = this._noRepeats(s);

		document.getElementById("playfair-keyphrase-raw-textfield").value = sRaw;
	},
	
	grid: [
		'', '', '', '', '',
		'', '', '', '', '',
		'', '', '', '', '',
		'', '', '', '', '',
		'', '', '', '', ''
	],

	swappingRow: -1,
	swappingColumn: -1,

	wordPatterns: [],
	
	cribs: [
		/*{
			val: ['.O', 'OT', 'HS', 'TO'],
			encipherments: [
				 ['',   'UL', 'IF', 'LU'],
				 ['',   'CK', 'IP', 'KC'],
				 ['',   'YG', 'EF', 'GY'],
				 ['',   'IB', 'TY', 'BI'],
			],
			enabledEncipherment: 0,
			isEnabled: false,
		}
		{
			isEnabled: true,
			val: ['TH'],
			encipherments: [
				['HW']
			],
			enabledEncipherment: 0,
		}, {
			isEnabled: true,
			val: ['OT'],
			encipherments: [
				['UL']
			],
			enabledEncipherment: 0,
		}, {
			isEnabled: true,
			val: ['HS'],
			encipherments: [
				['IF']
			],
			enabledEncipherment: 0,
		}*/
		
	],

	get autoSolverType() { return document.getElementById("playfair-autosolver-type").checked },
	get autoSolverVisualSpeed() { return 1 },
	isAutoSolverPausing: false,

	manualMode_: false,
	get manualMode() { return this.manualMode_ },
	set manualMode(x) {
		if (this.manualMode_ == x) return;
		else {
			this.manualMode_ = x; 
			if (x) {
				document.getElementById("control-encipher").style.backgroundColor = "#eee";
				document.getElementById("control-decipher").style.backgroundColor = "";
			} else {
				document.getElementById("control-encipher").style.backgroundColor = "";
				document.getElementById("control-decipher").style.backgroundColor = "#eee";
			}
		}
	},

	manualPlaintextElement: document.getElementById("playfair-textarea-plaintext"),
	manualCiphertextElement: document.getElementById("playfair-textarea-ciphertext"),
	keyGridUpdateElement: document.getElementById("playfair-lettergrid-update"),
	gridElement: document.getElementById("playfair-grid"),
	decipheringContainer: document.getElementById("playfair-deciphering-container"),

	frequencyTableElement: document.getElementById("playfair-frequency-table"),
	frequencyTable: {
		bigramRegularElements: [],
		bigramCipherElements: [],
	},

	_addCrib: function () {
		// split text into bigrams
		var cribStr = document.getElementById("playfair-crib-input").value;
		if (cribStr.length % 2 == 1) return; // probably should indicate this visually
		var cribSplit = [];
		for (var i = 0; i < cribStr.length; i += 2) {
			cribSplit.push(cribStr.substring(i, i + 2));
		}
		
		var crib = {
			isEnabled: false,
			val: cribSplit,
			encipherments: [],
			enabledEncipherment: -1
		}

		this.cribs.push(crib);

		// display crib
		this._addCribElement(this.cribs.length - 1);
	},

	_autoDecipher: function (key, ct = this.manualCiphertextElement.value) {
		// Note: ct must already be sanitized!

		var pt = "";
		

		for (var i = 0; i < ct.length; i += 2) {
			var letter1 = ct[i], letter2 = ct[i + 1];
			var letter1Index = key.indexOf(letter1);
			var letter2Index = key.indexOf(letter2);
			
			if (letter1Index !== -1 && letter2Index !== -1) {
				if (letter1Index % 5 == letter2Index % 5) {
					// same column
					letter1Index = (25 + letter1Index - 5) % 25;
					letter2Index = (25 + letter2Index - 5) % 25;
				} else if (Math.floor(letter1Index / 5) == Math.floor(letter2Index / 5)) {
					// same row
					letter1Index = (5 + letter1Index - 1) % 5 + 5 * Math.floor(letter1Index / 5);
					letter2Index = (5 + letter2Index - 1) % 5 + 5 * Math.floor(letter2Index / 5);
				} else {
					// box rule
					var diff = letter2Index % 5 - letter1Index % 5;
					letter1Index += diff;
					letter2Index -= diff;
				}
				letter1 = key[letter1Index]; letter2 = key[letter2Index];
				letter1 = letter1 == "" ? "." : letter1;
				letter2 = letter2 == "" ? "." : letter2;
				pt += letter1 + letter2;
			} else {
				pt += "..";
			}
		}

		

		//this.manualPlaintextElement.value = pt;
		return pt;
		
	},
	_autoSolver: function () {
		
		if (Playfair.autoSolverType) {
			Playfair._autoSolveVisualizer(Playfair.keyPhrase, text_sanitize(Playfair.manualCiphertextElement.value), 20, 0.2, 50000);
		} else {
			Playfair._autoSolve(Playfair.keyPhrase, text_sanitize(Playfair.manualCiphertextElement.value), 20, 0.2, 50000);
			document.getElementById("playfair-bestkey").innerHTML = maxKey + " (" + maxFitness + ")";
			document.getElementById("playfair-bestkey").innerHTML = maxKey + " (" + maxFitness + ")";
			this._updateGridWithKey(maxKey);
			this._manualDecipher();
			this._manualAutoSpacer();
		}
		

	},
	_autoSolve: function(startKeyPhrase = "", ct, Temp = 20, Step = 0.2, Count = 50000) {
		var self = this;
		var newAlphabet = Alphabet.substring(0, 9) + Alphabet.substring(10);
		startKeyPhrase = self._noRepeats(startKeyPhrase);
		
		for (var i = 0; i < 25; i++) {
			if (startKeyPhrase.indexOf(newAlphabet[i]) == -1) startKeyPhrase += newAlphabet[i];
		}
		
		var pt = self._decipher(startKeyPhrase, ct);

		var bestFitness = TextFitness._calcFitness(pt);
		var maxFitness = bestFitness;
		var maxKey = startKeyPhrase;
		var bestKey = maxKey;

		for (var temp = Temp; temp >= 0; temp -= Step) { 
			for (var count = 0; count < Count; count++) {
				var newKey = self._changeKey(maxKey);
				pt = self._decipher(newKey, ct);
				var newFitness = TextFitness._calcFitness(pt);
				var dF = newFitness - maxFitness;
				if (dF >= 0) {
					maxFitness = newFitness;
					maxKey = newKey;
				} else if (temp > 0) {
					if (Math.exp(dF/temp) > Math.random()) {
						maxFitness = newFitness;
						maxKey = newKey;
					}
				}
				if (maxFitness > bestFitness) {
					
					bestFitness = maxFitness;
					bestKey = maxKey;
					console.log(bestKey, bestFitness);
				}
			}
			console.log((100 * (Temp - temp) / Temp).toFixed(0) + "% complete");
		}

		
	}, 

	_autoSolveVisualizer: function(startKeyPhrase = "", ct, Temp = 20, Step = 0.2, Count = 50000, saved=[null, null]) {
		var newAlphabet = Alphabet.substring(0, 9) + Alphabet.substring(10);
		startKeyPhrase 	= this._noRepeats(startKeyPhrase);
		for (var i = 0; i < 25; i++) {
			if (startKeyPhrase.indexOf(newAlphabet[i]) == -1) startKeyPhrase += newAlphabet[i];
		}

		var pt 			= this._decipher(startKeyPhrase, ct),
			bestFitness = TextFitness._calcFitness(pt),
			maxFitness 	= bestFitness,
			maxKey 		= startKeyPhrase,
			bestKey 	= maxKey,
			temp 		= Temp,
			count 		= 0;
		
		function loop() {
			var newKey 		= Playfair._changeKey(maxKey);
				pt 			= Playfair._decipher(newKey, ct);
			var newFitness 	= TextFitness._calcFitness(pt),
				dF 			= newFitness - maxFitness;

			document.getElementById("playfair-minkey").innerHTML = newKey + " (" + newFitness + ")";
			if (dF >= 0) {
				maxFitness 	= newFitness;
				maxKey 		= newKey;
			} else if (temp > 0) {
				if (Math.exp(dF/temp) > Math.random()) {
					maxFitness 	= newFitness;
					maxKey 		= newKey;
				}
			}

			if (maxFitness > bestFitness) {	
				bestFitness = maxFitness;
				bestKey 	= maxKey;
				document.getElementById("playfair-bestkey").innerHTML = maxKey + " (" + maxFitness + ")";
				Playfair._updateGridWithKey(maxKey);
				Playfair._manualDecipher();
				Playfair._manualAutoSpacer();
			}

			// Looping part
			if (count >= Count && temp >= 0) {
				temp -= Step;
				count = 0;
			}
			if (temp >= 0 && count < Count) {
				count++;
				if (!Playfair.isAutoSolverPausing) setTimeout(loop, Playfair.autoSolverVisualSpeed);
			}
		}

		loop();

		function autoSolver () {
			//console.log(minKey, maxFitness, bestFitness);
			var newKey = self._changeKey(maxKey);
			pt = self._autoDecipher(newKey);
			var newFitness = TextFitness._calcFitness(pt);
			var dF = newFitness - bestFitness;
			if (dF >= 0) {
				maxFitness = newFitness;
				maxKey = newKey;
			} else if (temp > 0) {
				if (Math.exp(dF/temp) > Math.random()) {
					maxFitness = newFitness;
					maxKey = newKey;
				}
			}
			document.getElementById("playfair-minkey").innerHTML = newKey + " (" + newFitness + ")";
			if (maxFitness > bestFitness) {
				
				bestFitness = maxFitness;
				bestKey = maxKey;
				console.log(bestKey, bestFitness);
				document.getElementById("playfair-bestkey").innerHTML = maxKey + " (" + maxFitness + ")";
				self._updateGridWithKey(bestKey);
			}
			//setTimeout(function() {
				if (count >= Count && temp >= 0) {
					temp -= Step;
					console.log("temp dropped (" + temp + "/" + Temp + ")");
					count = 0;
				}
				if (temp >= 0 && count < Count) {
					count++;						
					autoSolver();

				}
			//}, 0);
		}

		
		

		
/*
		for (var temp = Temp; temp >= 0; temp -= Step) {
			for (var count = 0; count < Count; count++) {
				this._changeKey(this.grid);
				var newKey = this.grid.join("");
				pt = this.manualPlaintextElement.value;
				var newFitness = TextFitness._calcFitness(pt);
				var dF = newFitness - bestFitness;
				if (dF <= 0) {
					minFitness = newFitness;
					minKey = newKey;
				} else if (temp > 0) {
					if (Math.exp(dF/temp) > Math.random()) {
						minFitness = newFitness;
						minKey = newKey;
					}
				}
			}
		}*/
	},

	_changeKey: function (key) {
		var grid = key.split("");
		var r = Math.floor(Math.random() * 50);
		switch (r) {
			case 0: this._swapRows(grid); break;
			case 1: this._swapColumns(grid); break;
			case 2: this._flipRows(grid); break;
			case 3: this._flipColumns(grid); break;
			case 4: this._reverseGrid(grid); break;
			default: this._swapLetters(grid); break;
			
		}
		return grid.join("");
		

	},

	_reverseGrid: function (grid) {
		grid = grid.reverse();
	},

	_swapLetters: function(grid) {
		var letter1 = Math.floor(Math.random() * 25);
		var letter2 = Math.floor(Math.random() * 25);

		var letter = grid[letter1];
		grid[letter1] = grid[letter2];
		grid[letter2] = letter;
	},

	_swapRows: function (grid) {
		var row1 = Math.floor(Math.random() * 5);
		var row2 = Math.floor(Math.random() * 5);

		var row    = [grid[row1 * 5 + 0], grid[row1 * 5 + 1], grid[row1 * 5 + 2], grid[row1 * 5 + 3], grid[row1 * 5 + 4]];
		
		grid[row1 * 5 + 0] = grid[row2 * 5 + 0];
		grid[row1 * 5 + 1] = grid[row2 * 5 + 1];
		grid[row1 * 5 + 2] = grid[row2 * 5 + 2];
		grid[row1 * 5 + 3] = grid[row2 * 5 + 3];
		grid[row1 * 5 + 4] = grid[row2 * 5 + 4];

		grid[row2 * 5 + 0] = row[0];
		grid[row2 * 5 + 1] = row[1];
		grid[row2 * 5 + 2] = row[2];
		grid[row2 * 5 + 3] = row[3];
		grid[row2 * 5 + 4] = row[4];
		
	},

	_swapColumns: function (grid) {
		var col1 = Math.floor(Math.random() * 5);
		var col2 = Math.floor(Math.random() * 5);
		var col = [grid[0 * 5 + col1], grid[1 * 5 + col1], grid[2 * 5 + col1], grid[3 * 5 + col1], grid[4 * 5 + col1]];
		
		grid[0 * 5 + col1] = grid[0 * 5 + col2];
		grid[1 * 5 + col1] = grid[1 * 5 + col2];
		grid[2 * 5 + col1] = grid[2 * 5 + col2];
		grid[3 * 5 + col1] = grid[3 * 5 + col2];
		grid[4 * 5 + col1] = grid[4 * 5 + col2];

		grid[0 * 5 + col2] = col[0];
		grid[1 * 5 + col2] = col[1];
		grid[2 * 5 + col2] = col[2];
		grid[3 * 5 + col2] = col[3];
		grid[4 * 5 + col2] = col[4];
	},

	_flipRows: function (grid) {
		var row1 = [grid[0], grid[1], grid[2], grid[3], grid[4]];
		var row2 = [grid[5], grid[6], grid[7], grid[8], grid[9]];
		
		for (var i = 0; i < 5; i++) {
			grid[0 + i] = grid[20 + i];
			grid[20 + i] = row1[i];

			grid[5 + i] = grid[15 + i];
			grid[15 + i] = row2[i];
		}

		
	},

	_flipColumns: function (grid) {
		var col1 = [grid[0 * 5], grid[1 * 5], grid[2 * 5], grid[3 * 5], grid[4 * 5]];
		var col2 = [grid[0 * 5 + 1], grid[1 * 5 + 1], grid[2 * 5 + 1], grid[3 * 5 + 1], grid[4 * 5 + 1]];
		
		for (var i = 0; i < 5; i++) {
			grid[i * 5] = grid[i * 5 + 4];
			grid[i * 5 + 4] = col1[i];

			grid[i * 5 + 1] = grid[i * 5 + 3];
			grid[i * 5 + 3] = col2[i];
		}

	},

	_addCribTrans: function(cribIndex) {
		crib = this.cribs[cribIndex];
		var encipherment = [];
		for (var i = 0; i < crib.val.length; i++) encipherment.push('');
		crib.encipherments.push(encipherment);

		this._addCribTransElement(cribIndex);
	},

	_addCribElement: function (cribIndex) {
		var crib = this.cribs[cribIndex];
		var cribElement 	= document.createElement("div");
		var cribLeft 		= document.createElement("div");
		var cribBtnDelete 	= document.createElement("input");
		var cribMiddle 		= document.createElement("div");
		var cribTop 		= document.createElement("div");
		var cribShuffleC 	= document.createElement("div");
		var cribShuffle 	= document.createElement("input");
		var cribEnabled 	= document.createElement("input");
		var cribAddTrans 	= document.createElement("div");
		var cribAddTransBtn = document.createElement("input");

		cribElement		.setAttribute("class", "playfair-crib");
		cribElement		.setAttribute("id",    "playfair-crib-" + cribIndex);
		cribElement		.setAttribute("data-i",    cribIndex);
		cribLeft		.setAttribute("class", "playfair-crib-left");
		cribBtnDelete	.setAttribute("class", "playfair-crib-btn-delete");
		cribBtnDelete	.setAttribute("type",  "button");
		cribBtnDelete	.setAttribute("value", "X");
		cribMiddle		.setAttribute("class", "playfair-crib-middle");
		cribTop			.setAttribute("class", "playfair-crib-top");
		cribShuffleC	.setAttribute("class", "playfair-crib-bigram");
		cribShuffle		.setAttribute("type",  "button");
		cribShuffle		.setAttribute("value", "s");
		cribEnabled 	.setAttribute("class", "playfair-crib-checkbox");
		cribEnabled 	.setAttribute("type",  "checkbox");
		cribAddTrans	.setAttribute("class", "playfair-crib-translation");
		cribAddTransBtn .setAttribute("type",  "button");
		cribAddTransBtn .setAttribute("value", "+");

		cribElement.appendChild(cribLeft);
		cribLeft.appendChild(cribBtnDelete);
		cribElement.appendChild(cribMiddle);
		cribMiddle.appendChild(cribTop);
		cribTop.appendChild(cribShuffleC);
		cribShuffleC.appendChild(cribShuffle);

		for (var i = 0; i < crib.val.length; i++) {
			var bigramVal = document.createElement("div");
			bigramVal.setAttribute("class", "playfair-crib-bigram");
			bigramVal.innerHTML = crib.val[i];
			cribTop.appendChild(bigramVal);
		}

		cribTop.appendChild(cribEnabled);

		cribMiddle.appendChild(cribAddTrans);
		cribAddTrans.innerHTML = "<div class='playfair-crib-bigram'></div><div class='playfair-crib-bigram'></div>";
		cribAddTrans.children[1].appendChild(cribAddTransBtn);

		document.getElementById("playfair-section-cribs").appendChild(cribElement);

		cribEnabled.addEventListener("change", function (e) {
			Playfair.cribs[parseInt(cribElement.getAttribute("data-i"))].isEnabled = e.target.checked;
		});

		cribAddTransBtn.addEventListener("click", function (e) {
			Playfair._addCribTrans(parseInt(cribElement.getAttribute("data-i")));

		});

		
	},

	// Using enabled cribs, generate a list of unique grids that contain all of the crib rules.
	_generateGrids: function () {
		var grids = [];

		// get all enabled cribs.
		var cribs = [];
		for (var i = 0; i < this.cribs.length; i++) {
			if (this.cribs[i].isEnabled) cribs.push(this.cribs[i]);
		}

		// create unique array of bigram encipherment pairs 
		var cribEncipherments = {};
		cribs.forEach(crib => {
			for (var i = 0; i < crib.val.length; i++) {
				if (!(crib.val[i] in cribEncipherments) && crib.val[i] !== '' && !(crib.val[i][1] + crib.val[i][0] in cribEncipherments)) cribEncipherments[crib.val[i]] = crib.encipherments[crib.enabledEncipherment][i];
				else if (crib.val[i] in cribEncipherments && cribEncipherments[crib.val[i]] !== crib.encipherments[crib.enabledEncipherment][i]) throw new Error("Duplicate crib assignments.");
			}
		});

		// determine possible patterns for each bigram pair.
		var patterns = [];
		patternTitles = ['col','row','box'];
		for (var plaingram in cribEncipherments) {
			var ciphergram = cribEncipherments[plaingram];

			if (plaingram[1] == ciphergram[0]) {
				// TH -> HW; if second letter in plain text matches first letter in cipher text,
				// then it must be either column or row rule.
				patterns.push({
					col: [
						[  plaingram[0], null, null, null, null ], 
						[  plaingram[1], null, null, null, null ], 
						[ ciphergram[1], null, null, null, null ],
						[          null, null, null, null, null ],
						[          null, null, null, null, null ],
						[          null, null, null, null, null ]
					],
					row: [
						[ plaingram[0], plaingram[1], ciphergram[1], null, null],
						[         null,         null,          null, null, null],
						[         null,         null,          null, null, null],
						[         null,         null,          null, null, null],
						[         null,         null,          null, null, null],
					],
					box: null
				});
			} else {
				patterns.push({
					col: [
						[   plaingram[0], null, null, null, null ], 
						[  ciphergram[0], null, null, null, null ], 
						[   plaingram[1], null, null, null, null ],
						[  ciphergram[1], null, null, null, null ],
						[           null, null, null, null, null ]
					],
					row: [
						[ plaingram[0], ciphergram[0], plaingram[1], ciphergram[1], null ],
						[         null,         null,          null,          null, null ],
						[         null,         null,          null,          null, null ],
						[         null,         null,          null,          null, null ],
						[         null,         null,          null,          null, null ],
					],
					box: [
						[  plaingram[0], ciphergram[0], null, null, null ], 
						[ ciphergram[1],  plaingram[1], null, null, null ],
						[          null,          null, null, null, null ],
						[          null,          null, null, null, null ],
						[          null,          null, null, null, null ],
					]
				});
			}
				
		}

		// Find all unique combinations of the patterns.
		// Definitely should optimize this to not check combinations
		// that are obviously invalid.
		var patternChecking = [];
		for (var i = 0; i < patterns.length; i++) patternChecking.push(0);
		
		function incPattern() {
			patternChecking[0]++;
			for (var i = 0; i < patternChecking.length; i++) {
				if (patternChecking[i] > 2 ) {
					patternChecking[i] = 0;
					if (i + 1 < patternChecking.length) patternChecking[i + 1]++;
				}
			}
		}
		do {
			var validGrids = [];
			
			// loop through first to check for any invalid pattern options
			var isValidSet = true;
			for (var i = 0; i < patternChecking.length && isValidSet; i++) {
				var x = patterns[i][patternTitles[patternChecking[i]]];
				if (!x) isValidSet = false;
			}
			if (isValidSet) {			
				for (var i = 0; i < patternChecking.length; i++) {
					var newValidGrids = [];
					var alternateGrids = this._alternateGrids(patterns[i][patternTitles[patternChecking[i]]], patternTitles[patternChecking[i]]);
					if (i == 0) {
						// populate validGrids with first pattern.
						for (var j = 0; j < alternateGrids.length; j++) {
							newValidGrids.push(alternateGrids[j][0]);
						}
					} else {
						for (var j = 0; j < validGrids.length; j++) {
							for (var k = 0; k < alternateGrids.length; k++) {
								var stillSearching = true;
								for (var l = 0; l < alternateGrids[k].length && stillSearching; l++) {
									var combinedGrid = this._combineGrids(validGrids[j], alternateGrids[k][l]);
									if (combinedGrid) newValidGrids.push(combinedGrid);
								}
							}
						}
					}
					validGrids = newValidGrids;
					
				}
				//console.log(validGrids);
				
			}
			//console.log(patternChecking.map(a => patternTitles[a]), validGrids);
			grids.push(...validGrids);
			incPattern();
		} while (patternChecking.reduce((a, b) => a + b, 0) !== 0);

		
		


		return grids;
	},

	_isValidGrid: function (grid) {
		// checks if grid is valid (2d array grid)
		var letters = [];
		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 5; j++) {
				if (letters.indexOf(grid[i][j]) !== -1) return false;
				else if (grid[i][j] && grid[i][j] !== '') letters.push(grid[i][j]);
			}
		}

		return true;
	},

	_manualAutoSpacer: function () {
		var pt = document.getElementById("playfair-textarea-plaintext").value;

		document.getElementById("playfair-textarea-plaintext").value = WordFinder._wordFind(text_sanitize(pt)).toLowerCase();
	},

	_alternateGrids: function(grid, pattern=null) {
		// generate possible alternate (transposed) grids.

		// if pattern is set then we have to include
		// swaps.
		var alternateGrids = [];
		var alternateGrids2 = [];
		if (pattern) {
			switch (pattern) {
				case "col":
					// assume in first column
					if (grid[3][0]) {
						// only commit if column rule has four letters
						var newGrid = this._dupeGrid(grid);
						var x = [newGrid[0][0], newGrid[1][0]];
						newGrid[0][0] = newGrid[2][0];
						newGrid[1][0] = newGrid[3][0];
						newGrid[2][0] = x[0];
						newGrid[3][0] = x[1];
						alternateGrids.push(...this._alternateGrids(newGrid));
					}
					break;
				case "row":
					// assume in first row
					if (grid[0][3]) {
						// only commit if row rule has four letters
						var newGrid = this._dupeGrid(grid);
						var x = [newGrid[0][0], newGrid[0][1]];
						newGrid[0][0] = newGrid[0][2];
						newGrid[0][1] = newGrid[0][3];
						newGrid[0][2] = x[0];
						newGrid[0][3] = x[1];
						alternateGrids.push(...this._alternateGrids(newGrid));
					}
					break;
				case "box":
					// 36 total orientations, 900 permutations
					var grid1 = this._dupeGrid(grid);
					var grid2 = this._dupeGrid(grid);
					var grid3 = this._dupeGrid(grid);
					var grid4 = this._dupeGrid(grid);

					var x = [grid1[0][0], grid1[0][1], grid1[1][0], grid1[1][1]];
					
					grid2[0][0] = x[1]; grid2[0][1] = x[0];
					grid2[1][0] = x[3]; grid2[1][1] = x[2];

					grid3[0][0] = x[3]; grid3[0][1] = x[2];
					grid3[1][0] = x[1]; grid3[1][1] = x[0];

					grid4[0][0] = x[2]; grid4[0][1] = x[3];
					grid4[1][0] = x[0]; grid4[1][1] = x[1];
					
					for (var i = 0; i < 3; i++) {
						var grids = [
							this._dupeGrid(grid1),
							this._dupeGrid(grid2),
							this._dupeGrid(grid3),
							this._dupeGrid(grid4)
						];

						
						
						for (var j = 0; j < 4; j++) {
							grids[j][1 + i][0] 	= grids[j][1][0];
							grids[j][1 + i][1] 	= grids[j][1][1];
							if (i == 0) break;
							grids[j][1][0] 		= null;
							grids[j][1][1] 		= null;
						};


						alternateGrids.push(...this._alternateGrids(grids[0]));
						alternateGrids.push(...this._alternateGrids(grids[1]));
						alternateGrids.push(...this._alternateGrids(grids[2]));
						alternateGrids.push(...this._alternateGrids(grids[3]));

						for (var j = 0; j < 2; j++) {
							for (var k = 0; k < 4; k++) {
								grids[k][0][1 + j + 1] = grids[k][0][1 + j];
								grids[k][1 + i][1 + j + 1] = grids[k][1 + i][1 + j];
								grids[k][0][1 + j] = null;
								grids[k][1 + i][1 + j] = null;
							}

							alternateGrids.push(...this._alternateGrids(grids[0]));
							alternateGrids.push(...this._alternateGrids(grids[1]));
							alternateGrids.push(...this._alternateGrids(grids[2]));
							alternateGrids.push(...this._alternateGrids(grids[3]));
						
						}
					}
					break;
			}
		}
		if (!pattern || pattern !== "box") {
			var newGrid = this._dupeGrid(grid);
			for (var i = 0; i < 5; i++) {
				newGrid.push(newGrid.shift());
				for (var j = 0; j < 5; j++) {
					newGrid[0].push(newGrid[0].shift());
					newGrid[1].push(newGrid[1].shift());
					newGrid[2].push(newGrid[2].shift());
					newGrid[3].push(newGrid[3].shift());
					newGrid[4].push(newGrid[4].shift());
					alternateGrids2.push(this._dupeGrid(newGrid));
				}
			}
			alternateGrids.push(alternateGrids2);
		}

		
		return alternateGrids;
	},

	_combineGrids: function (gridA, gridB) {
		// combine two grids. If impossible, return null.
		var gridCombined = this._dupeGrid(gridA);
		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 5; j++) {
				if (gridB[i][j] && !gridA[i][j]) gridCombined[i][j] = gridB[i][j];
				else if (gridB[i][j] && gridA[i][j] && gridB[i][j] != gridA[i][j]) return null;
			}
		}

		return this._isValidGrid(gridCombined) ? gridCombined : null;
	},

	_1DGridTo2DGrid: function (arr) {
		var grid = [[],[],[],[],[]];
		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 5; j++) {
				grid[i][j] = arr[i * 5 + j] == '' ? null : arr[i * 5 + j];
			}
		}
		return grid;
	},

	_2DGridTo1DGrid: function (grid) {
		var arr = [];
		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 5; j++) {
				arr.push(grid[i][j] ? grid[i][j] : '');
			}
		}

		return arr;
	},

	_dupeGrid: function (grid) {
		return [
			[ grid[0][0], grid[0][1], grid[0][2], grid[0][3], grid[0][4] ], 
			[ grid[1][0], grid[1][1], grid[1][2], grid[1][3], grid[1][4] ], 
			[ grid[2][0], grid[2][1], grid[2][2], grid[2][3], grid[2][4] ],
			[ grid[3][0], grid[3][1], grid[3][2], grid[3][3], grid[3][4] ],
			[ grid[4][0], grid[4][1], grid[4][2], grid[4][3], grid[4][4] ]
		];
	},

	_addCribTransElement: function (cribIndex) {
		var crib = this.cribs[cribIndex];
		var cribTransIndex = crib.encipherments.length - 1;

		var cribElement			= document.getElementById("playfair-crib-" + cribIndex);
		var cribTrans 			= document.createElement("div");
		var cribDeleteC 		= document.createElement("div");
		var cribDelete 			= document.createElement("input");
		var cribTransChoiceC 	= document.createElement("div");
		var cribTransChoice 	= document.createElement("input"); 
		
		cribTrans		.setAttribute("class", "playfair-crib-translation");
		cribDeleteC 	.setAttribute("class", "playfair-crib-bigram");
		cribDelete		.setAttribute("class", "playfair-crib-btn-delete");
		cribDelete		.setAttribute("type",  "button");
		cribDelete		.setAttribute("value", "x");
		cribTransChoiceC.setAttribute("class", "playfair-crib-bigram");
		cribTransChoiceC.style.lineHeight = "30px";
		cribTransChoice .setAttribute("class", "playfair-crib-radio");
		cribTransChoice .setAttribute("name", "playfairTrans" + cribIndex);
		cribTransChoice .setAttribute("type",  "radio");

		cribTransChoice.addEventListener("click", function (e) {
			crib.enabledEncipherment = cribTransIndex;
		});

		cribElement.children[1].insertBefore(cribTrans, cribElement.children[1].lastChild);
		cribTrans.appendChild(cribDeleteC);
		cribDeleteC.appendChild(cribDelete);
		
		for (var i = 0; i < crib.val.length; i++) {
			var bigramInputC 	= document.createElement("div");
			var bigramInput 	= document.createElement("input");
			
			bigramInputC	.setAttribute("class", "playfair-crib-bigram");
			bigramInput		.setAttribute("class", "playfair-crib-bigram-input");
			bigramInput		.setAttribute("type",  "text");
			bigramInput		.setAttribute("data-i", i);
			cribTrans.appendChild(bigramInputC);
			bigramInputC.appendChild(bigramInput);

			bigramInput.addEventListener("input", function (e) {
				if (e.target.value.length == 2) {
					crib.encipherments[cribTransIndex][parseInt(e.target.getAttribute("data-i"))] = e.target.value;
				} else {
					crib.encipherments[cribTransIndex][parseInt(e.target.getAttribute("data-i"))] = "";
				}
			});

		}

		cribTrans.appendChild(cribTransChoiceC);
		cribTransChoiceC.appendChild(cribTransChoice);

	},

	_manualEncipher: function () {
		// can't encipher if grid isn't filled out
		if (this.grid.indexOf('') !== -1) return;

		var pt_old = this.manualPlaintextElement.value;
		
		pt_old = text_sanitize(pt_old);

		var pt = "";

		// Format the plaintext for encryption.
		for (var i = 0; i < pt_old.length; i++) {
			if (i + 1 == pt_old.length || pt_old[i] == pt_old[i + 1]) pt += pt_old[i] + "X";
			else {
				pt += pt_old[i] + pt_old[i + 1];
				i++;
			}
		}
		
		var ct = this._encipher(this.grid.join(""), pt);
		this.manualCiphertextElement.value = ct;
		this._updateFrequencyTable();
	},

	_manualDecipher: function () {
		this._updateFrequencyTable();
		this.decipheringContainer.innerHTML = "";

		var ct = text_sanitize(this.manualCiphertextElement.value);

		// Error check before continuing
		if (ct.indexOf("J") !== -1 || ct.length % 2 == 1) return;

		var pt = this._decipher(this.grid.join(""), ct);


		// The deciphering section for easier pair spotting.
		for (var i = 0; i < pt.length; i += 2) {
			var decipheringBlock = document.createElement("div");
			decipheringBlock.setAttribute("class", "deciphering-block");
			
			var cipherRow = document.createElement("div");
			cipherRow.setAttribute("class", "cipher-row");
			cipherRow.innerHTML = ct[i] + ct[i + 1];

			var plainRow = document.createElement("div");
			plainRow.setAttribute("class", "plain-row");
			plainRow.innerHTML = pt[i] + pt[i + 1];

			decipheringBlock.appendChild(cipherRow);
			decipheringBlock.appendChild(plainRow);
			this.decipheringContainer.appendChild(decipheringBlock);
		}

		this.manualPlaintextElement.value = pt;
	},

	_encipher: function (key, pt) {
		var ct = "";

		for (var i = 0; i < pt.length; i += 2) {
			var a = [pt[i], pt[i + 1]];
			var b = [key.indexOf(a[0]), key.indexOf(a[1])];
			if (b[0] !== -1 && b[1] !== -1) {
				if (b[0] % 5 == b[1] % 5) b = b.map(c => c = (5 + c) % 25);
				else if (~~(b[0] / 5) == ~~(b[1] / 5)) b = b.map(c => c = (1 + c) % 5 + 5 * ~~(c / 5));
				else {
					var d = b[1] % 5 - b[0] % 5;
					b[0] += d; b[1] -= d;
				}
				a = a.map((c, d) => c = key[b[d]] == "" ? "." : key[b[d]]);
				ct += a[0] + a[1];
			} else ct += "..";
		}
		return ct;
	},
	
	_decipher: function (key, ct) {
		// Note: ct must already be sanitized!
		var pt = "";

		for (var i = 0; i < ct.length; i += 2) {
			var a = [ct[i], ct[i + 1]];
			var b = [key.indexOf(a[0]), key.indexOf(a[1])];
			if (b[0] !== -1 && b[1] !== -1) {
				if (b[0] % 5 == b[1] % 5) b = b.map(c => c = (20 + c) % 25);
				else if (~~(b[0] / 5) == ~~(b[1] / 5)) b = b.map(c => c = (4 + c) % 5 + 5 * ~~(c / 5));
				else {
					var d = b[1] % 5 - b[0] % 5;
					b[0] += d; b[1] -= d;
				}
				a = a.map((c, d) => c = key[b[d]] == "" ? "." : key[b[d]]);
				pt += a[0] + a[1];
			} else pt += "..";
		}
		return pt;
	},

	_noRepeats: function (s) {
		// returns s without any repeated letters (j's replaced with i's)
		s = text_sanitize(s).replace(/[J]/g, "I");
		var usedLetters = [];
		var sRaw = "";
		for (var i = 0; i < s.length; i++) {
			if (usedLetters.indexOf(s[i]) == -1) {
				usedLetters.push(s[i]);
				sRaw += s[i];
			}
		}
		return sRaw;
	},
	

	_updateGridWithKey: function (s) {
		// update the grid with a key phrase

		// exclude J
		var newAlphabet = Alphabet.substring(0, 9) + Alphabet.substring(10);
		s = this._noRepeats(s);
		
		// extend s to include all 25 letters
		for (var i = 0; i < 25; i++) {
			if (s.indexOf(newAlphabet[i]) == -1) s += newAlphabet[i];
		}

		for (var i = 0; i < 25; i++) {
			this.grid[i] = s[i];
		}

		this._updateGrid();
	},

	_updateGrid: function () {
		for (var i = 0; i < 25; i++) {
			document.getElementsByClassName("playfair-grid-letter-input")[i].value = this.grid[i];
		}
		if (!Playfair.manualMode) Playfair._manualDecipher();
		else Playfair._manualEncipher();
	},	

	_patternSearch: function () {
		var patternStr = document.getElementById("playfair-pattern-input").value;
		// pattern needs to be multiple of two for playfair
		if (patternStr.length % 2 == 1) return;
		var pattern = this._patternNumberify(patternStr);

		var ct = text_sanitize(this.manualCiphertextElement.value);
		var matches = [];
		var potentialMatch = "";
		for (var i = 0; i < ct.length; i += 2) {
			var letterPair = ct.substring(i, i + 2);
			potentialMatch += letterPair;
			if (potentialMatch.length <= patternStr.length) {
				var potentialPattern = this._patternNumberify(potentialMatch);
				
				var isMatching = true;
				for (var j = 0; j < potentialPattern.length && isMatching; j++) {
					if (potentialPattern[j] != pattern[j] && pattern[j] !== -1 ) isMatching = false;
				}
				
				if (!isMatching) {
					i -= potentialMatch.length - 2;
					potentialMatch = "";
				} else if (potentialMatch.length == patternStr.length) {
					matches.push([i - patternStr.length + 2, i + 2, ct.substring(i - patternStr.length + 2, i + 2)]);
					i -= potentialMatch.length - 2;
					potentialMatch = "";
				}
			}
		}

		var patternContainer = document.getElementById("playfair-pattern-container");
		patternContainer.innerHTML = "";
		matches.forEach(match => {
			var li = document.createElement("li");
			var matchBefore = ct.substring(Math.max(0, match[0] - 4), match[0]);
			var matchStr = ct.substring(match[0], match[1]);
			var matchAfter = ct.substring(match[1], match[1] + 4);
			li.innerHTML = "<div>" + (matchBefore !== "" && "...") + matchBefore + "<span class='highlighted'>" + matchStr + "</span>" + matchAfter + (matchAfter !== "" && "...") + "</div>";
			//li.innerHTML += "<div>Possible words: <input onclick='Playfair._findWords(\"" + matchStr + "\")' type='button' value='Load'></div>"
			patternContainer.appendChild(li);
		});
		console.log(matches);
	},

	// convert an even string length into pattern number array
	_patternNumberify: function (str) {
		var pattern = [];
		for (var i = 0; i < str.length; i++) {
			var letter = str.substring(i, i + 1);
			if (letter == " ") pattern.push(-1);
			else if (pattern.indexOf(letter) !== -1) pattern.push(pattern.indexOf(letter));
			else pattern.push(letter);
		}

		for (var i = 0; i < pattern.length; i++) if (typeof pattern[i] == "string") pattern[i] = pattern.indexOf(pattern[i]);

		return pattern;
	},

	// finds words that match pattern
	_wordPatternFinder: function (pattern) {
		var matches = [];
		for (var i = 0; i < WordFinder.words.length; i++) {
			var word = WordFinder.words[i];
			if (word.length >= pattern.length) {
				for (var k = 0; k < word.length - pattern.length + 1; k++) {
					var wordPattern = this._patternNumberify(word.substring(k, k + pattern.length));
					var isMatching = true;
					for (var j = 0; j < pattern.length && isMatching; j++) {
						if (wordPattern[j] !== pattern[j] && pattern[j] !== -1) isMatching = false;
					}
					if (isMatching) matches.push(word);
				}
			}
		}

		return matches;
	},

	_initFrequencyTable: function () {
		// Find total number of rows required.
		var totalRows = EnglishFrequencies["freqBigrams"].length;

		// Create the rows
		var rows = [];
		for (var i = 0; i < totalRows; i++) {
			rows.push(document.createElement("tr"));
		}

		// Determine number of each thing
		var EngFreqTitles = ["freqBigrams"];
		var EleTitles = [["bigramRegularElements","bigramCipherElements"]];
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
		var ct = this.manualCiphertextElement.value;
		
		// Serialize the string. This is removing any non-letter characters and setting all letters to UPPER CASE.
		ct = ct.toUpperCase().replace(/[^A-Z]/g, "");

		// Calculate the number of each letter, bigram, etc.
		var bigramTotal = 0;
		var bigrams = {};
		var sortedbigrams = [];
		for (var i = 0; i < ct.length; i += 2) {
			if (!(ct.substring(i, i + 2) in bigrams)) bigrams[ct.substring(i, i + 2)] = 1;
			else bigrams[ct.substring(i, i + 2)]++;
			bigramTotal++;
		}

		// sort them
		for (var bigram in bigrams) {
			sortedbigrams.push([bigram, bigrams[bigram]]);
		}

		
		sortedbigrams.sort((a, b) => b[1] - a[1]);

		// calculate relative frequencies.
		if (sortedbigrams.length > 0) {
			var topBigramCount = sortedbigrams[0][1];
			sortedbigrams.forEach(x => x[1] = (100 * x[1] / topBigramCount).toFixed(1) + "%");
	
			// print them out on the table
			for (var i = 0; i < this.frequencyTable.bigramCipherElements.length && i < sortedbigrams.length; i++) {
				var currElements = this.frequencyTable.bigramCipherElements[i];
				currElements[0].innerHTML = sortedbigrams[i][0];
				currElements[1].innerHTML = sortedbigrams[i][1];
				
			}
		}
		

	},

	_initGrid: function () {
		this.gridElement.innerHTML = "";
		for (var i = 0; i < 5; i++) {
			var row = document.createElement("div");
			row.setAttribute("class", "playfair-grid-row");
			for (var j = 0; j < 5; j++) {
				var letter = document.createElement("div");
				letter.setAttribute("class", "playfair-grid-letter");
				var input = document.createElement("input");
				input.setAttribute("class", "playfair-grid-letter-input");
				input.setAttribute("type", "text");
				input.setAttribute("data-i", i * 5 + j);
				input.value = this.grid[i * 5 + j];
				letter.appendChild(input);
				row.appendChild(letter);
			}
			
			var controlMover = document.createElement("div");
			controlMover.setAttribute("class", "playfair-grid-mover");
			controlMover.setAttribute("data-row", i);
			controlMover.setAttribute("id", "playfair-moverow-" + i);
			controlMover.addEventListener("click", function (e) {
				if (Playfair.swappingRow == -1) {
					e.target.style.backgroundColor = "orange";
					Playfair.swappingRow = parseInt(e.target.getAttribute("data-row"));
				} else {
					var row1Index = parseInt(e.target.getAttribute("data-row"));
					var row1 = Playfair.grid.slice(row1Index * 5, row1Index * 5 + 5);
					var row2 = Playfair.grid.slice(Playfair.swappingRow * 5, Playfair.swappingRow * 5 + 5);

					for (var k = 0; k < 5; k++) {
						Playfair.grid[Playfair.swappingRow * 5 + k] = row1[k];
						Playfair.grid[row1Index * 5 + k] = row2[k];
					}

					document.getElementById("playfair-moverow-" + Playfair.swappingRow).style.backgroundColor = "";
					Playfair.swappingRow = -1;
					Playfair._updateGrid();

				}
			});
			controlMover.innerHTML = "s";

			row.appendChild(controlMover);

			var controlPusher = document.createElement("div");
			controlPusher.setAttribute("class", "playfair-grid-mover");
			controlPusher.setAttribute("data-row", i);
			controlPusher.innerHTML = "&gt;";
			controlPusher.addEventListener("click", function (e) {
				var row = parseInt(e.target.getAttribute("data-row"));
				var letter = Playfair.grid[row * 5 + 4];
				for (var k = 4; k > 0; k--) {
					Playfair.grid[row * 5 + k] = Playfair.grid[row * 5 + k - 1];
				}
				Playfair.grid[row * 5] = letter;
				Playfair._updateGrid();

			});
			row.appendChild(controlPusher);

			this.gridElement.appendChild(row);
			
			
		}

		var controlMoverRow = document.createElement("div");
		controlMoverRow.setAttribute("class", "playfair-grid-mover-row");
		for (var j = 0; j < 5; j++) {
			var controlMover = document.createElement("div");
			controlMover.setAttribute("class", "playfair-grid-mover");
			controlMover.innerHTML = "s";
			controlMover.setAttribute("data-col", j);
			controlMover.setAttribute("id", "playfair-movecol-" + j);
			
			controlMover.addEventListener("click", function (e) {
				if (Playfair.swappingColumn == -1) {
					e.target.style.backgroundColor = "orange";
					Playfair.swappingColumn = parseInt(e.target.getAttribute("data-col"));
				} else {
					var col1Index = parseInt(e.target.getAttribute("data-col"));
					for (var k = 0; k < 5; k++) {
						var letter = Playfair.grid[col1Index + k * 5]
						Playfair.grid[col1Index + k * 5] = Playfair.grid[Playfair.swappingColumn + k * 5];
						Playfair.grid[Playfair.swappingColumn + k * 5] = letter;
					}


					document.getElementById("playfair-movecol-" + Playfair.swappingColumn).style.backgroundColor = "";
					Playfair.swappingColumn = -1;
					Playfair._updateGrid();

				}
			});
			controlMoverRow.appendChild(controlMover);
		}

		var controlPusherRow = document.createElement("div");
		controlPusherRow.setAttribute("class", "playfair-grid-mover-row");
		for (var j = 0; j < 5; j++) {
			var controlMover = document.createElement("div");
			controlMover.innerHTML = "v";
			controlMover.setAttribute("class", "playfair-grid-mover");
			controlMover.setAttribute("data-col", j);
			controlMover.addEventListener("click", function (e) {
				var col = parseInt(e.target.getAttribute("data-col"));
				var letter = Playfair.grid[col + 20];
				for (var k = 4; k > 0; k--) {
					Playfair.grid[k * 5 + col] = Playfair.grid[(k - 1) * 5 + col];
				}
				Playfair.grid[col] = letter;
				Playfair._updateGrid();

			});
			controlPusherRow.appendChild(controlMover);
		}
		
		this.gridElement.appendChild(controlMoverRow);
		this.gridElement.appendChild(controlPusherRow);
	},


	

	// This creates a list of the words from the auto spacer in their pattern form for the pattern finder thingy
	_initWordPatterns: function () {
		for (var i = 0; i < topWords.length; i++) {
			var word = text_sanitize(topWords[i]);
			this.wordPatterns.push(this._patternNumberify(word));
		}
	},

	_init: function () {
		this._initGrid();


		this._initFrequencyTable();

		this.manualPlaintextElement.addEventListener("input", this.__textareaPlaintext__);
		this.manualCiphertextElement.addEventListener("input", this.__textareaCiphertext__);
		this.keyGridUpdateElement.addEventListener("click", this.__btnUpdateGrid__);

		for (var i = 0; i < 25; i++) {
			document.getElementById("playfair-grid")
				.getElementsByClassName("playfair-grid-letter-input")[i]
				.addEventListener("input", this.__gridInput__);
			document.getElementById("playfair-grid")
				.getElementsByClassName("playfair-grid-letter-input")[i]
				.addEventListener("input", this.__gridControl__);
		}

		document.getElementById("playfair-pattern-input").addEventListener("input", this.__inputPatternSearch__);

		document.getElementById("playfair-crib-btn-add").addEventListener("click", function (e) {
			console.log("test");
			Playfair._addCrib();
		});

		document.getElementById("playfair-crib-generate").addEventListener("click", function (e) {
			Playfair._generateGrids();
		});

		document.getElementById("control-encipher").addEventListener("click", function (e) {
			Playfair.manualMode = true;
		});

		document.getElementById("control-decipher").addEventListener("click", function (e) {
			Playfair.manualMode = false;
		});
//		<div><input id="playfair-start-autosolver" type="button" value="Start Auto-Solver (will take some time)"> <input id="playfair-autosolver-type" type="checkbox" /> Visual Auto Solver (slower but you can see how the solver works).

		document.getElementById("playfair-start-autosolver").addEventListener("click", function (e) {
			Playfair._autoSolver();
		});

		document.getElementById("playfair-manual-autospacer").addEventListener("click", this.__shiftmanualautospacer__);

		// DEV
		this._manualDecipher();

		//this._generateGrids();
	},

	__textareaCiphertext__: function (e) {
		if (!Playfair.manualMode) {
			Playfair._manualDecipher();
		}
	},

	__textareaPlaintext__: function (e) {
		if (Playfair.manualMode) {
			Playfair._manualEncipher();
		}
	},

	__btnUpdateGrid__: function (e) {
		Playfair.keyPhraseRaw = Playfair.keyPhrase;
		Playfair._updateGridWithKey(Playfair.keyPhraseRaw);
	},

	__gridInput__: function (e) {
		if (e.target.value.length > 0) e.target.value = text_sanitize(e.target.value[e.target.value.length - 1]);
		if (e.target.value == "J" || Playfair.grid.indexOf(e.target.value) !== -1) e.target.value = "";
		Playfair.grid[e.target.getAttribute("data-i")] = e.target.value;
		if (!Playfair.manualMode) Playfair._manualDecipher();
		else Playfair._manualEncipher();
	},
	
	__gridControl__: function (e) {

	},

	__inputPatternSearch__: function (e) {
		if (e.target.value.length > 1) {
			Playfair._patternSearch();
		}
	},

	__shiftmanualautospacer__: function (e) {
		if (!Playfair.manualMode) Playfair._manualAutoSpacer();
	},
}



Playfair._init();