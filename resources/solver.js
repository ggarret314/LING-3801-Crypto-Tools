import { Alphabet, text_sanitize, WordFinder, TextFitness, EnglishFrequencies } from './main.js';
import { Cipher } from './cipher.js';

console.log("[Solver] Loaded");


onmessage = e => {
	
	if (e.data.task) {
		switch (e.data.task) {
			case "solve":
				console.log("[Solver] Solving...");
				Solver._solve(
					e.data.args.startKey, 
					e.data.args.ct, 
					e.data.args.ciphers, 
					e.data.args.Temp, 
					e.data.args.Step, 
					e.data.args.Count, 
					e.data.args.stopWhenNear
				);
		}
	}
	
};

// Solver: holds the code for Auto-Solving ciphers, as well as
//         the core algorithms for each cipher.
const Solver = {

	// operations for monoalphabetic ciphers (including shift)
	shift: {
		keyChanger: [
			// 1: shift the key some direction
			(grid) => {
				var x = Math.random() * 26;
				for (var i = 0; i < x; i++) {
					grid.push(grid.shift())
				}
				//if (Math.random() > 0.5) grid.push(grid.shift());
				//else grid.unshift(grid.pop());
			}
		],

		_changeKey: function (key) {
			var grid = key.split("");

			this.keyChanger[0](grid);

			return grid.join("");
		},

		_encipher: Cipher.mono.substitution._encipher,
		
		_decipher: Cipher.mono.substitution._decipher,

		_getFullKey: Cipher.mono._getFullKey,

		_getKeyPhrase: Cipher.mono._getKeyPhrase,
	},

	substitution: {
		keyChanger: [
			// 0: swap two letters
			(grid) => {
				var letter1 = Math.floor(Math.random() * 25);
				var letter2 = Math.floor(Math.random() * 25);
		
				var letter = grid[letter1];
				grid[letter1] = grid[letter2];
				grid[letter2] = letter;
			},
			// 1: swap n letters
			(grid) => {
				var n = Math.floor(2 + Math.random() * 25);
				for (var i = 0; i < n; i++) {
					var letter1 = Math.floor(Math.random() * 25);
					var letter2 = Math.floor(Math.random() * 25);
			
					var letter = grid[letter1];
					grid[letter1] = grid[letter2];
					grid[letter2] = letter;
				}
			},
			// 1: shift the key some direction
			(grid) => {
				if (Math.random() > 0.5) grid.push(grid.shift());
				else grid.unshift(grid.pop());
			}
		],

		_changeKey: function (key) {
			var grid = key.split("");
			var r = Math.floor(Math.random() * 20);
			switch (r) {
				//case 0: this.keyChanger[1](grid); break;
				default: this.keyChanger[1](grid); break;
			}

			return grid.join("");
		},

		_encipher: Cipher.mono.substitution._encipher,
		
		_decipher: Cipher.mono.substitution._decipher,

		_getFullKey: Cipher.mono._getFullKey,

		_getKeyPhrase: Cipher.mono._getKeyPhrase,
		
	},

	// Operations for vigenere ciphers
	vigenere: {

		keyChanger: [
			// 0: change a letter
			(grid) => {
				var letter = Math.floor(Math.random() * grid.length);
				grid[letter] = Alphabet[Math.floor(Math.random() * Alphabet.length)];
				/*
				if (Math.random() > 0.5) grid[letter] = Alphabet[(Alphabet.indexOf(grid[letter]) + 1) % 26];
				else grid[letter] = Alphabet[(Alphabet.indexOf(grid[letter]) + 25) % 26];
				*/
			},
			// 1: swap two letters
			(grid) => {
				var letter1 = Math.floor(Math.random() * grid.length);
				var letter2 = Math.floor(Math.random() * grid.length);
		
				var letter = grid[letter1];
				grid[letter1] = grid[letter2];
				grid[letter2] = letter;
			},
			// 2: shift the key some direction
			(grid) => {
				if (Math.random() > 0.5) grid.push(grid.shift());
				else grid.unshift(grid.pop());
			},
			// 3: Add / remove a letter
			(grid) => {
				if (Math.random() > 0.5 && grid.length > 1) grid.splice(grid.length - 1, 1);
				else if (grid.length < 32) grid.push('A');
			},
			// 4: Update based on IC stats
			(grid, pt) => {
				var a = Math.floor(Math.random() * 3);
				var icstats = Solver.vigenere._icKeyLengths(pt);
				var newLength = icstats[a][0];
				while (grid.length < newLength) grid.push('A');
				while (grid.length > newLength) grid.splice(grid.length - 1, 1);
			},
		],

		_changeKey: function (key, ptLength, pt) {
			var grid = key.split("");
			var r = Math.floor(Math.random() * 40);
			switch (r) {
				case 0: this.keyChanger[1](grid); break;
				case 1: this.keyChanger[2](grid); break;
				case 2: this.keyChanger[3](grid); break;
				case 3: this.keyChanger[4](grid, pt); break;
				default: this.keyChanger[0](grid); break;
			}

			return grid.join("");
		},
	
		// Just sanitize
		_getFullKey: function (key) {
			return text_sanitize(key);
		},

		_getKeyPhrase: function (key) {
			return key;
		},

		// Calculate the best key lengths in order
		// based on avg index of coincidences
		_icKeyLengths: function (s, maxKeyLength=32) {
			var bestKeyLengths = [];
			
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
				bestKeyLengths.push([unigrams.length, avgIC]);
	
			}
	
			bestKeyLengths.sort((a, b) => b[1] - a[1]);
	
			return bestKeyLengths;
		},
		
		_encipher: Cipher.poly.vigenere._encipher,
		
		_decipher: Cipher.poly.vigenere._decipher,

		_solver: function (key, ct) {

		},
	},

	// Operations for vigenere ciphers
	autovigenere: {

		keyChanger: [
			// 0: change a letter by one up or down
			(grid) => {
				var letter = Math.floor(Math.random() * grid.length);
				if (Math.random() > 0.5) grid[letter] = Alphabet[(Alphabet.indexOf(grid[letter]) + 1) % 26];
				else grid[letter] = Alphabet[(Alphabet.indexOf(grid[letter]) + 25) % 26];
			},
			// 1: swap two letters
			(grid) => {
				var letter1 = Math.floor(Math.random() * grid.length);
				var letter2 = Math.floor(Math.random() * grid.length);
		
				var letter = grid[letter1];
				grid[letter1] = grid[letter2];
				grid[letter2] = letter;
			},
			// 2: shift the key some direction
			(grid) => {
				if (Math.random() > 0.5) grid.push(grid.shift());
				else grid.unshift(grid.pop());
			},
			// 3: Add / remove a letter
			(grid) => {
				if (Math.random() > 0.5) grid.splice(grid.length - 1, 1);
				else if (grid.length < 17) grid.push('A');
			}
		],

		_changeKey: function (key) {
			var grid = key.split("");
			var r = Math.floor(Math.random() * 40);
			switch (r) {
				case 0: this.keyChanger[1](grid); break;
				case 1: this.keyChanger[2](grid); break;
				case 2: this.keyChanger[3](grid); break;
				default: this.keyChanger[0](grid); break;
			}

			return grid.join("");
		},
	
		// Just sanitize
		_getFullKey: function (key) {
			return text_sanitize(key);
		},

		_getKeyPhrase: function (key) {
			return key;
		},

		// Calculate the best key lengths in order
		// based on avg index of coincidences
		_icKeyLengths: function (s, maxKeyLength=32) {
			var bestKeyLengths = [];
			
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
				bestKeyLengths.push([unigrams.length, avgIC]);
	
			}
	
			bestKeyLengths.sort((a, b) => b[1] - a[1]);
	
			return bestKeyLengths;
		},
		
		_encipher: Cipher.poly.autovigenere._encipher,
		
		_decipher: Cipher.poly.autovigenere._decipher,

		_solver: function (key, ct) {

		},
	},

	// Operations for playfair ciphers
	playfair: {

		// list of functions that will transform the key
		keyChanger: [
			// 0: Swaps two letters in the key at random
			(grid) => {
				var letter1 = Math.floor(Math.random() * 25);
				var letter2 = Math.floor(Math.random() * 25);
		
				var letter = grid[letter1];
				grid[letter1] = grid[letter2];
				grid[letter2] = letter;
			},

			// 1: Swaps two rows at random
			(grid) => {
				var row1 = Math.floor(Math.random() * 5);
				var row2 = Math.floor(Math.random() * 5);
				var row = [grid[row1 * 5 + 0], grid[row1 * 5 + 1], grid[row1 * 5 + 2], grid[row1 * 5 + 3], grid[row1 * 5 + 4]];
				
				for (var i = 0; i < 5; i++) {
					grid[row1 * 5 + i] = grid[row2 * 5 + i];
					grid[row2 * 5 + i] = row[i];
				}
			},

			// 2: Swaps two columns at random
			(grid) => {
				var col1 = Math.floor(Math.random() * 5);
				var col2 = Math.floor(Math.random() * 5);
				var col = [grid[0 * 5 + col1], grid[1 * 5 + col1], grid[2 * 5 + col1], grid[3 * 5 + col1], grid[4 * 5 + col1]];
				
				for (var i = 0; i < 5; i++) {
					grid[i * 5 + col1] = grid[i * 5 + col2];
					grid[i * 5 + col2] = col[i];
				}
			},
			
			// 3: Flips grid horizontally
			(grid) => {
				var row1 = [grid[0], grid[1], grid[2], grid[3], grid[4]];
				var row2 = [grid[5], grid[6], grid[7], grid[8], grid[9]];
				
				for (var i = 0; i < 5; i++) {
					grid[0 + i] = grid[20 + i];
					grid[20 + i] = row1[i];
		
					grid[5 + i] = grid[15 + i];
					grid[15 + i] = row2[i];
				}
			},

			// 4: Flips grid vertically
			(grid) => {
				var col1 = [grid[0 * 5], grid[1 * 5], grid[2 * 5], grid[3 * 5], grid[4 * 5]];
				var col2 = [grid[0 * 5 + 1], grid[1 * 5 + 1], grid[2 * 5 + 1], grid[3 * 5 + 1], grid[4 * 5 + 1]];
				
				for (var i = 0; i < 5; i++) {
					grid[i * 5] = grid[i * 5 + 4];
					grid[i * 5 + 4] = col1[i];
		
					grid[i * 5 + 1] = grid[i * 5 + 3];
					grid[i * 5 + 3] = col2[i];
				}
			},

			// 5: Flips the key grid diagonally.
			(grid) => grid.reverse(),
		],

		_changeKey: function (key) {
			var grid = key.split("");
			var r = Math.floor(Math.random() * 50);
			switch (r) {
				case 0: this.keyChanger[1](grid); break;
				case 1: this.keyChanger[2](grid); break;
				case 2: this.keyChanger[3](grid); break;
				case 3: this.keyChanger[4](grid); break;
				case 4: this.keyChanger[5](grid); break;
				default: this.keyChanger[0](grid); break;
				
			}

			return grid.join("");
		},

		// Given a key phrase, strip repeated letters and extrapolate the rest of the alphabet (minus J).
		_getFullKey: function (key) {
			var shortedKey = text_sanitize(key).split("").filter((a, b, c) => c.indexOf(a) == b).join("");
				shortedKey = shortedKey.replace(/J/g, "");
			return shortedKey + Alphabet.replace("J", "").replace(new RegExp("[" + shortedKey + "]", "g"), "");
		},

		// Given a key, find the key phrase (sequence of characters not in alphabetical order)
		// Will check equivalent keys and return smallest key
		_getKeyPhrase: function (key) {
			var grid = key.split("");
			var keyPhrase = key;
			for (var i = 0; i < 5; i++) {
				for (var j = 0; j < 5; j++) {
					var row = [grid[0], grid[1], grid[2], grid[3], grid[4]];
					for (var k = 0; k < 5; k++) {
						for (var l = 0; l < 4; l++) {
							grid[k + l * 5] = grid[k + (l + 1) * 5];
						}
						grid[k + 20] = row[k];
					}
					var newKey = grid.join("");
					var phrase = "";
					while (phrase + Alphabet.replace("J", "").replace(new RegExp("[" + phrase + "]", "g"), "") !== newKey) {
						phrase += newKey[phrase.length];
					}
					if (phrase.length < keyPhrase.length) keyPhrase = phrase;
				}
				var col = [grid[0], grid[5], grid[10], grid[15], grid[20]];
				for (var k = 0; k < 5; k++) {
					for (var l = 0; l < 4; l++) {
						grid[k * 5 + l] = grid[k * 5 + l + 1];
					}
					grid[k * 5 + 4] = col[k];
				}
			}
			return keyPhrase;

			//var phrase = "";
			//while (phrase + Alphabet.replace("J", "").replace(new RegExp("[" + phrase + "]", "g"), "") !== key) {
			//	phrase += key[phrase.length];
			//}

			//return phrase;
		},

		_encipher: Cipher.digraph.playfair._encipher,
		
		_decipher: Cipher.digraph.playfair._decipher,

		
	},

	// Operations for columnar trans cipher
	columnar: {
		// Just sanitize
		_getFullKey: function (key) {
			return text_sanitize(key);
		},

		_getKeyPhrase: function (key) {
			return key;
		},

		keyChanger: [
			// 0: swap key numbers
			(grid) => {
				var num1 = Math.floor(Math.random() * grid.length);
				var num2 = Math.floor(Math.random() * grid.length);
				
				var x = grid[num1];
				grid[num1] = grid[num2];
				grid[num2] = x;
				//console.log(grid);
			},
			// 1: change dimension of trans table (length of key)
			(grid, ptLength) => {
				
				if (Math.random() > 0.5 || grid.length == 0) {
					// increase length
					//console.log(ptLength, "increase");
					grid.push(grid.length);
					while (ptLength % grid.length !== 0 && grid.length < 25) grid.push(grid.length);
					if (ptLength % grid.length !== 0) {
						while (ptLength % grid.length !== 0) grid.splice(grid.indexOf(grid.length - 1), 1);
					}
				} else {
					// decrease length
					if (grid.length > 1) grid.splice(grid.indexOf(grid.length - 1), 1);
					while (ptLength % grid.length !== 0) grid.splice(grid.indexOf(grid.length - 1), 1);
				}
				//console.log(grid);
			},
		],

		_changeKey: function (key, ptLength) {
			
			var grid = Cipher.trans.columnar._keyNumberify(key);
			
			var r = Math.floor(Math.random() * 40);
			switch (r) {
				case 0: this.keyChanger[1](grid, ptLength); break;
				default: this.keyChanger[0](grid); break;
			}
			if (grid.length == 0) grid = [0];
			
			//console.log(Cipher.trans.columnar._keyStringify(grid));
			return Cipher.trans.columnar._keyStringify(grid);
		},

		_encipher: Cipher.trans.columnar._encipher,
		
		_decipher: Cipher.trans.columnar._decipher,
	},

	railfence: {

	},

	enigma: {

		keyChanger: [
			// 0: shift rotor offset/ring
			(settings) => {
				if (Math.random() > 0.5) {
					var a = Math.floor(Math.random() * settings.rotors.length),
						b = Math.random() > 0.5 ? "ring" : "pos";

					settings.rotors[a][b] = Math.floor(Math.random() * 26);
				}
			},
			// 1: change a rotor (physical rotor)
			(settings) => {
				var a = Math.floor(Math.random() * settings.rotors.length); // r1NNr1YFr1NF|
				settings.rotors[a].og = Math.floor(1 + Math.random() * 3);
			},
			// 2: swap a rotor (positions)
			(settings) => {
				var a = Math.floor(Math.random() * settings.rotors.length),
					b = Math.floor(Math.random() * settings.rotors.length),
					c = Object.assign(settings.rotors[a]);
					
				settings.rotors[a] = Object.assign(settings.rotors[b]);
				settings.rotors[b] = c;
			},
			// 3: change a rotor
			// 1: shift the key some direction
			(settings) => {
				grid.push(grid.shift())
				//if (Math.random() > 0.5) grid.push(grid.shift());
				//else grid.unshift(grid.pop());
			}
		],

		_changeKey: function (key) {
			
			var settings = Cipher.other.enigma._decodeKey(key);

			var r = Math.floor(Math.random() * 80);
			switch (r) {
				//case 0: newKey = this.keyChanger[1](settings); break;
				//case 1: newKey = this.keyChanger[2](settings); break;
				//case 2: newKey = this.keyChanger[3](settings); break;
				case 0: this.keyChanger[2](settings); break;
				default: this.keyChanger[0](settings); break;
			}

			return Cipher.other.enigma._encodeKey(settings);
		},

		settings: Cipher.other.enigma.settings,

		_rotorRotate: Cipher.other.enigma._rotorRotate,


		_encipher: Cipher.other.enigma._encipher,

		_decipher: Cipher.other.enigma._encipher,
		
		_decodeKey: Cipher.other.enigma._decodeKey,

		_encodeKey: Cipher.other.enigma._encodeKey,

		_getFullKey: Cipher.other.enigma._getFullKey,

		_getKeyPhrase: Cipher.other.enigma._getKeyPhrase,
		
	},

	adfgx: {

		keyChanger: [
			// 0: Swaps two letters in the key at random
			(grid) => {
				var letter1 = Math.floor(Math.random() * 25);
				var letter2 = Math.floor(Math.random() * 25);
		
				var letter = grid[letter1];
				grid[letter1] = grid[letter2];
				grid[letter2] = letter;
			},
			
			// 1: Change columnar order
			(grid) => {
				var num1 = Math.floor(Math.random() * grid.length),
					num2 = Math.floor(Math.random() * grid.length),
					num  = grid[num1];
				
				grid[num1] = grid[num2];
				grid[num2] = num;
			},

			// 2: Change columnar size
			(grid) => {
				if (Math.random() > 0.5) {
					if (grid.length < 16) {
						grid.push(grid.length);
					} else {
						if (grid.length > 1) grid.splice(grid.indexOf(grid.length - 1), 1);
					}
				}
			}
		],

		_decodeKey: Cipher.other.adfgx._decodeKey,

		_encodeKey: Cipher.other.adfgx._encodeKey,

		_changeKey: function (key) {
			var grid = key.substring(0, key.indexOf('|')).split("");
			var grid2 = Cipher.trans.columnar._keyNumberify(key.substring(key.indexOf('|') + 1));
			var r = Math.floor(Math.random() * 40);
			switch (r) {
				//case 0: this.keyChanger[2](grid2); break;
				//case 1: this.keyChanger[2](grid); break;
				//case 2: this.keyChanger[3](grid); break;
				//case 3: this.keyChanger[4](grid); break;
				//case 4: this.keyChanger[5](grid); break;
				default: Math.random() > 0.7 ? this.keyChanger[0](grid) : this.keyChanger[1](grid2); break;
				
			}
			//console.log(grid.join("") + "|" + Cipher.trans.columnar._keyStringify(grid2));
			return grid.join("") + "|" + Cipher.trans.columnar._keyStringify(grid2);
		},

		_encipher: Cipher.other.adfgx._encipher,

		_decipher: Cipher.other.adfgx._decipher,

		_getFullKey: Cipher.other.adfgx._getFullKey,

		_getKeyPhrase: Cipher.other.adfgx._getKeyPhrase,


	},

	grandpre: {

		keyChanger: [
			// 0: Change a letter
			(grid) => {
				var letter = Math.floor(Math.random() * 100);
				
				grid[letter] = Alphabet[Math.floor(Math.random() * Alphabet.length)];
			},

			// 1: Swaps two letters in the key at random
			(grid) => {
				var letter1 = Math.floor(Math.random() * 100);
				var letter2 = Math.floor(Math.random() * 100);
		
				var letter = grid[letter1];
				grid[letter1] = grid[letter2];
				grid[letter2] = letter;
			},
		],

		_changeKey: function (key) {
			var grid = key.split('');
			var r = Math.floor(Math.random() * 10);
			switch (r) {
				case 0: this.keyChanger[1](grid); break;
				default: this.keyChanger[0](grid); break;
				
			}
			//console.log(grid.join("") + "|" + Cipher.trans.columnar._keyStringify(grid2));
			return grid.join("");
		},

		_encipher: Cipher.other.grandpre._encipher,

		_decipher: Cipher.other.grandpre._decipher,

		_getFullKey: Cipher.other.grandpre._getFullKey,

		_getKeyPhrase: Cipher.other.grandpre._getKeyPhrase,
	},

	// _identify: Determines what kind of cipher(s) a particular cipher text is enciphered with.
	// 			  returns an array of the ciphers.
	_identify: function(ct, numberOfCiphers, knownCiphers=[]) {
		// For the time being, we will only be identifying single ciphers.

	},

	// _solve: Deciphers a cipher text given a set of ciphers.
	_solve: function(startKey = [''], ct = '', ciphers, Temp = 20, Step = 0.2, Count = 50000, stopWhenNear = true) {
		// -console.log(startKey);
		var numCiphers = ciphers.length;
		var cipher = ciphers[0];

		var cipherOps = [];
		//console.log(cipherOps);
		// Format key for type of cipher:
		var keys = [];
		var pt = ct;
		for (var i = 0; i < ciphers.length; i++) {
			cipherOps[i] = this[ciphers[i]];
			keys[i] = cipherOps[i]._getFullKey(startKey[i]);
			pt = cipherOps[i]._decipher(keys[i], pt);
			if (typeof pt !== 'string') pt = pt[0];
		}

		//console.log(ct);
		
		var	maxFitness = TextFitness._calcFitness(pt),
			bestFitness = maxFitness,
			maxKeys = [...keys],
			bestKeys = [...maxKeys],
			temp = Temp,
			count = 0,
			guessFitness = TextFitness._calcGuessFitness(ct.length),
			attempts = 0,
			stillSearching = true;
			postMessage({
				task: "solve_newBestKey",
				data: [bestKeys, [bestFitness]]
			})
		// The main loop
		while (stillSearching && temp >= 0) {
			var r = count % ciphers.length;
			var newKeys = [];
				pt = ct;
				//console.log("test");
			for (var i = 0; i < ciphers.length; i++) {
				newKeys[i] = r == i ? cipherOps[i]._changeKey(maxKeys[i], pt.length, pt) : maxKeys[i];
				pt = cipherOps[i]._decipher(newKeys[i], pt);
				
				if (typeof pt !== 'string') pt = pt[0];
			}
			var newFitness 	= TextFitness._calcFitness(pt),
				dF 			= newFitness - maxFitness;

			if (dF >= 0) {
				maxFitness 	= newFitness;
				maxKeys 	= [...newKeys];
			} else if (temp > 0) {
				if (Math.exp(dF/temp) > Math.random()) {
					maxFitness 	= newFitness;
					maxKeys 	= [...newKeys];
				}
			}
			//console.log(newKey);
			if (maxFitness > bestFitness) {	
				bestFitness = maxFitness;
				bestKeys 	= [...maxKeys];
				attempts 	= 0;
				postMessage({
					task: "solve_newBestKey",
					data: [bestKeys, [bestFitness]]
				});
				console.log("New best Key: ", bestKeys, bestFitness);
			}


			count++;
			if (count >= Count) {
				console.log("decreasing temp");
				temp -= Step;
				count = 0;
			}

			// Determine if fitness is close enough to give up the search
			if (bestFitness / guessFitness < 1.10) {
				attempts++;
				//if (attempts > 1000) stillSearching = false;

			}
			
		}
		pt = ct;
		for (var i = 0; i < ciphers.length; i++) {
			pt = cipherOps[i]._decipher(bestKeys[i], pt);
			if (typeof pt !== 'string') pt = pt[0];
		}
		return {
			key: bestKeys,
			pt: pt
		}
		
	},


}