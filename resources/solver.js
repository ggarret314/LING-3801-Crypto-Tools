import { text_sanitize, WordFinder, TextFitness, EnglishFrequencies } from './main.js';
import Ciphers from './cipher.js';
onmessage = (e) => {
	console.log("Received: ", e.data.task, e.data.args);
	if (e.data.task) {
		switch (e.data.task) {
			case "solve":
				console.log("OKAY");
				console.log(AutoSolver._solve(
					e.data.args.startKey, 
					e.data.args.ct, 
					e.data.args.ciphers, 
					e.data.args.Temp, 
					e.data.args.Step, 
					e.data.args.Count, 
					e.data.args.stopWhenNear
				));
		}
	}
	
}

// Auto: holds the code for Auto-Solving ciphers, as well as
//       the core algorithms for each cipher.
export const AutoSolver = {

	// operations for monoalphabetic ciphers (including shift)
	mono: {

		keyChanger: [
			// 0: swap two letters
			(grid) => {
				var letter1 = Math.floor(Math.random() * 25);
				var letter2 = Math.floor(Math.random() * 25);
		
				var letter = grid[letter1];
				grid[letter1] = grid[letter2];
				grid[letter2] = letter;
			},
			// 1: shift the key some direction
			(grid) => {
				if (Math.random() > 0.5) grid.push(grid.shift());
				else grid.unshift(grid.pop());
			}
		],

		_changeKey: function (key) {
			var grid = key.split("");
			var r = Math.floor(Math.random() * 40);
			switch (r) {
				case 0: this.keyChanger[1](grid); break;
				default: this.keyChanger[0](grid); break;
			}

			return grid.join("");
		},

		
		
	},

	// Operations for vigenere ciphers
	vigenere: {

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
			}
		],

		_changeKey: function (key) {
			var grid = key.split("");
			var r = Math.floor(Math.random() * 40);
			switch (r) {
				case 0: this.keyChanger[1](grid); break;
				case 1: this.keyChanger[2](grid); break;
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

		_test: function () {
			return this;
		},

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

		
	},

	// Operations for transposition ciphers (columnar/rail)
	trans: {

	},

	// _identify: Determines what kind of cipher(s) a particular cipher text is enciphered with.
	// 			  returns an array of the ciphers.
	_identify: function(ct, numberOfCiphers, knownCiphers=[]) {
		// For the time being, we will only be identifying single ciphers.

	},

	// _solve: Deciphers a cipher text given a set of ciphers.
	_solve: function(startKey = "", ct, ciphers, Temp = 20, Step = 0.2, Count = 50000, stopWhenNear = true) {
		
		// For the time being, we will only be dealing with single cipher auto-solving.
		var numCiphers = ciphers.length;
		var cipher = ciphers[0];

		var cipherOps = this[cipher];
		
		// Format key for type of cipher:
		var key = cipherOps._getFullKey(startKey);

		// Intialize variables
		var pt = cipherOps._decipher(key, ct),
			maxFitness = TextFitness._calcFitness(pt),
			bestFitness = maxFitness,
			maxKey = key,
			bestKey = maxKey,
			temp = Temp,
			count = 0,
			guessFitness = TextFitness._calcGuessFitness(ct.length),
			attempts = 0,
			stillSearching = true;
		
		// The main loop
		while (stillSearching && temp >= 0) {
			var newKey 		= cipherOps._changeKey(maxKey);
				pt 			= cipherOps._decipher(newKey, ct);
			var newFitness 	= TextFitness._calcFitness(pt),
				dF 			= newFitness - maxFitness;

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
				attempts 	= 0;
				//postMessage({
				//	task: "solve_newBestKey",
				//	data: [bestKey, bestFitness]
				//});
				console.log("New best Key: ", bestKey, bestFitness);
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
				if (attempts > 1000) stillSearching = false;

			}
		}

		return {
			key: cipherOps._getKeyPhrase(bestKey),
			pt: WordFinder._wordFind(cipherOps._decipher(bestKey, ct)).toLowerCase(),
		}
		
	},


}