import { Alphabet, text_sanitize, WordFinder, EnglishFrequencies } from '../main.js';
import { Cipher } from '../cipher.js';
import { CipherDirection } from '../cipherdirection.js';
import { FrequencyTable } from '../frequencytable.js';
import { DecipheringContainer } from '../decipheringcontainer.js';

// PlayfairCipher: holds the code for playfair cipher
const PlayfairCipher = {

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
		gridElement: document.getElementById("playfair-grid"),
		btnSetKey: document.getElementById("key-set-btn"),
		keyRaw: document.getElementById("key-raw"),
	},

	cipherDirection: null,
	frequencyTable: null,
	decipheringContainer: null,

	grid: [
		'', '', '', '', '',
		'', '', '', '', '',
		'', '', '', '', '',
		'', '', '', '', '',
		'', '', '', '', ''
	],

	cribs: [

	],

	swappingRow: -1,
	swappingColumn: -1,

	_decipher: function () {
		var key = this.grid,
			ct  = text_sanitize(this.ele.textareaCiphertext.value),
			pt  = Cipher.digraph.playfair._decipher(key, ct);

		this.frequencyTable._updateFrequencyTable(ct);
		this.decipheringContainer._update(ct, pt.toLowerCase(), 2);
		this.ele.textareaPlaintext.value = (this.ele.checkboxAutoSpaces.checked ? WordFinder._wordFind(pt) : pt).toLowerCase();
	},

	_encipher: function () {
		var key = this.grid,
			pt  = text_sanitize(this.ele.textareaPlaintext.value),
			ct  = Cipher.digraph.playfair._encipher(key, pt);
	
		this.frequencyTable._updateFrequencyTable(ct);
		this.decipheringContainer._update(ct, pt.toLowerCase());
		this.ele.textareaCiphertext.value = ct;
	},

	_updateGrid: function () {
		for (var i = 0; i < 25; i++) {
			document.getElementsByClassName("playfair-grid-letter-input")[i].value = this.grid[i];
		}
		if (!this.decipheringContainer.isEncipher) this._decipher();
		else this._encipher();
	},

	_initGrid: function () {
		var self = this;
		this.ele.gridElement.innerHTML = "";
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
				input.addEventListener("input", function (e) {
					if (e.target.value.length > 0) e.target.value = text_sanitize(e.target.value[e.target.value.length - 1]);
					if (e.target.value == "J" || self.grid.indexOf(e.target.value) !== -1) e.target.value = "";
					self.grid[e.target.getAttribute("data-i")] = e.target.value;
					if (!self.manualMode) self._decipher();
					else self._encipher();
				});
				this.ele.keyLetters.push(input);
				letter.appendChild(input);
				row.appendChild(letter);
			}
			
			var controlMover = document.createElement("div");
			controlMover.setAttribute("class", "playfair-grid-mover");
			controlMover.setAttribute("data-row", i);
			controlMover.setAttribute("id", "playfair-moverow-" + i);
			controlMover.addEventListener("click", function (e) {
				if (self.swappingRow == -1) {
					e.target.style.backgroundColor = "orange";
					self.swappingRow = parseInt(e.target.getAttribute("data-row"));
				} else {
					var row1Index = parseInt(e.target.getAttribute("data-row"));
					var row1 = self.grid.slice(row1Index * 5, row1Index * 5 + 5);
					var row2 = self.grid.slice(self.swappingRow * 5, self.swappingRow * 5 + 5);

					for (var k = 0; k < 5; k++) {
						self.grid[self.swappingRow * 5 + k] = row1[k];
						self.grid[row1Index * 5 + k] = row2[k];
					}

					document.getElementById("playfair-moverow-" + self.swappingRow).style.backgroundColor = "";
					self.swappingRow = -1;
					self._updateGrid();

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
				var letter = self.grid[row * 5 + 4];
				for (var k = 4; k > 0; k--) {
					self.grid[row * 5 + k] = self.grid[row * 5 + k - 1];
				}
				self.grid[row * 5] = letter;
				self._updateGrid();

			});
			row.appendChild(controlPusher);

			this.ele.gridElement.appendChild(row);
			
			
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
				if (self.swappingColumn == -1) {
					e.target.style.backgroundColor = "orange";
					self.swappingColumn = parseInt(e.target.getAttribute("data-col"));
				} else {
					var col1Index = parseInt(e.target.getAttribute("data-col"));
					for (var k = 0; k < 5; k++) {
						var letter = self.grid[col1Index + k * 5]
						self.grid[col1Index + k * 5] = self.grid[self.swappingColumn + k * 5];
						self.grid[self.swappingColumn + k * 5] = letter;
					}


					document.getElementById("playfair-movecol-" + self.swappingColumn).style.backgroundColor = "";
					self.swappingColumn = -1;
					self._updateGrid();

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
				var letter = self.grid[col + 20];
				for (var k = 4; k > 0; k--) {
					self.grid[k * 5 + col] = self.grid[(k - 1) * 5 + col];
				}
				self.grid[col] = letter;
				self._updateGrid();

			});
			controlPusherRow.appendChild(controlMover);
		}
		
		this.ele.gridElement.appendChild(controlMoverRow);
		this.ele.gridElement.appendChild(controlPusherRow);
	},

	_init: function () {
		var self = this;

		this.cipherDirection = new CipherDirection(
			document.getElementById("control-encipher"),
			document.getElementById("control-decipher"),
			() => console.log("enciphering"),
			() => console.log("deciphering")
		);

		this.frequencyTable = new FrequencyTable(this.ele.frequencyTable, [2]);

		this.decipheringContainer = new DecipheringContainer(document.getElementById("deciphering-container"));

		this._initGrid();

		this.ele.textareaCiphertext.addEventListener("input", function (e) {
			if (!self.cipherDirection.isEncipher) self._decipher();
		});

		this.ele.textareaPlaintext.addEventListener("input", function (e) {
			if (self.cipherDirection.isEncipher) self._encipher();
		});

		this.ele.checkboxAutoSpaces.addEventListener("change", function (e) {
			if (!self.cipherDirection.isEncipher) self._decipher();
		});

		this.ele.btnSetKey.addEventListener("click", function (e) {
			self.grid = Cipher.mono._getFullKey(self.ele.keyPhrase.value).replace('J', '').split('');
			self.ele.keyRaw.value = text_sanitize(self.ele.keyPhrase.value)
				.replace('J', '')
				.split('')
				.filter((a, b, c) => c.indexOf(a) == b)
				.join('');

			for (var i = 0; i < Alphabet.length - 1; i++) {
				
				self.ele.keyLetters[i].value = self.grid[i];
			}

			if (self.cipherDirection.isEncipher) self._encipher();
			else self._decipher();

		});

		this.ele.viewAnalysis.addEventListener("change", function (e) {
			self.ele.analysisContainer.style.display = self.ele.viewAnalysis.checked ? "" : "none";
		});
	},
}

PlayfairCipher._init();


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



//Playfair._init();