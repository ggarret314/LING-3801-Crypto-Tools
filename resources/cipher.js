import { Alphabet, text_sanitize } from "./main.js";

export const Cipher = {
	mono: {
		
		// Create a key for the shift cipher given an A to some letter mapping
		_getShiftKey: function (letter) {
			// A -> letter
			return Alphabet.substring(Alphabet.indexOf(letter)) + Alphabet.substring(0, Alphabet.indexOf(letter));
		},

		// Given a key phrase, strip repeated letters and extrapolate the rest of the alphabet.
		_getFullKey: function (key) {
			var shortedKey = text_sanitize(key).split("").filter((a, b, c) => c.indexOf(a) == b).join("");
			return shortedKey + Alphabet.replace(new RegExp("[" + shortedKey + "]", "g"), "");;
		},

		_getKeyPhrase: function (key) {
			var phrase = "";
			while (phrase + Alphabet.replace(new RegExp("[" + phrase + "]", "g"), "") !== key) {
				phrase += key[phrase.length];
			}

			return phrase;
		},
		
		shift: {
			// Encipher a plaintext with a substitution key.
			_encipher: function (key, pt) {
				var ct = "";
				for (var i = 0; i < pt.length; i++) {
					ct += key[Alphabet.indexOf(pt[i])];
				}

				return ct;
			},

			// Decipher a ciphertext with a substitution key.
			// If a particular letter is not found in the key, it is substituted with a period.
			// An array with the periods and original cipher letters will be returned.
			_decipher: function(key, ct) {
				var pt = "";
				var ptCt = "";
				for (var i = 0; i < ct.length; i++) {
					var a = key.indexOf(ct[i]);
					pt += a == -1 ? '.' : Alphabet[a];
					ptCt += a == -1 ? ct[i] : Alphabet[a];
				}

				return [pt, ptCt];
			},

				// Create a key for the shift cipher given an A to some letter mapping
			_getShiftKey: function (letter) {
				// A -> letter
				return Alphabet.substring(Alphabet.indexOf(letter)) + Alphabet.substring(0, Alphabet.indexOf(letter));
			},

			// Given a key phrase, strip repeated letters and extrapolate the rest of the alphabet.
			_getFullKey: function (key) {
				var shortedKey = text_sanitize(key).split("").filter((a, b, c) => c.indexOf(a) == b).join("");
				return shortedKey + Alphabet.replace(new RegExp("[" + shortedKey + "]", "g"), "");;
			},

			_getKeyPhrase: function (key) {
				return key[0];
			},
		},
		
		substitution: {
			// Encipher a plaintext with a substitution key.
			_encipher: function (key, pt) {
				var ct = "";
				for (var i = 0; i < pt.length; i++) {
					var a = Alphabet.indexOf(pt[i])
					ct += key[a] ? key[a] : ".";
				}

				return ct;
			},

			// Decipher a ciphertext with a substitution key.
			// If a particular letter is not found in the key, it is substituted with a period.
			// An array with the periods and original cipher letters will be returned.
			_decipher: function(key, ct) {
				var pt = "";
				var ptCt = "";
				for (var i = 0; i < ct.length; i++) {
					var a = key.indexOf(ct[i]);
					pt += a == -1 ? '.' : Alphabet[a];
					ptCt += a == -1 ? ct[i] : Alphabet[a];
				}

				return [pt, ptCt];
			},

			// Given a key phrase, strip repeated letters and extrapolate the rest of the alphabet.
			_getFullKey: function (key) {
				var shortedKey = text_sanitize(key).split("").filter((a, b, c) => c.indexOf(a) == b).join("");
				return shortedKey + Alphabet.replace(new RegExp("[" + shortedKey + "]", "g"), "");;
			},

			_getKeyPhrase: function (key) {
				var phrase = "";
				while (phrase + Alphabet.replace(new RegExp("[" + phrase + "]", "g"), "") !== key) {
					phrase += key[phrase.length];
				}

				return phrase;
			},
		},
	},
	poly: {
		autovigenere: {
			// Encipher using auto key / clave method
			_encipher: function (key, pt) {
				var ct = "";
				
				for (var i = 0; i < key.length && i < pt.length; i++) {
					var a = Alphabet.indexOf(key[i % key.length]);
					ct += Alphabet[(Alphabet.indexOf(pt[i]) + a) % 26];
				}

				for (var i = key.length; i < pt.length; i++) {
					var a = Alphabet.indexOf(pt[i - key.length]);
					ct += Alphabet[(Alphabet.indexOf(pt[i]) + a) % 26];
				}

				return ct;
			},

			_decipher: function (key, ct) {
				var pt = "";

				for (var i = 0; i < key.length && i < ct.length; i++) {
					var a = Alphabet.indexOf(key[i % key.length]);
					pt += Alphabet[(Alphabet.indexOf(ct[i]) - a + 26) % 26];
				}

				for (var i = key.length; i < ct.length; i++) {
					var a = Alphabet.indexOf(pt[i - key.length]);
					pt += Alphabet[(Alphabet.indexOf(ct[i]) - a + 26) % 26];
				}

				return pt;
			},
			
			// Just sanitize
			_getFullKey: function (key) {
				return text_sanitize(key);
			},

			_getKeyPhrase: function (key) {
				return key;
			},
		},

		progvigenere: {
			_encipher: function (key, pt) {
				var ct = "";
		
				for (var i = 0; i < pt.length; i++) {
					var a = Alphabet.indexOf(key[i % key.length]),
						b = Alphabet[(Alphabet.indexOf(pt[i]) + a) % 26]
					ct += Alphabet[(Alphabet.indexOf(pt[i]) + b) % 26];
				}
		
				return ct;
			},

			_decipher: function(key, ct) {
				var pt = "";
				for (var i = 0; i < ct.length; i++) {
					var a = Alphabet.indexOf(key[i % key.length]);
					pt += Alphabet[(Alphabet.indexOf(ct[i]) - a + 26) % 26];
				}
		
				return pt;
			},

			// Just sanitize
			_getFullKey: function (key) {
				return text_sanitize(key);
			},

			_getKeyPhrase: function (key) {
				return key;
			},
		},

		vigenere: {
			// Encipher a plaintext with a vigenere key.
			_encipher: function (key, pt) {
				var ct = "";
		
				for (var i = 0; i < pt.length; i++) {
					var a = Alphabet.indexOf(key[i % key.length]);
					ct += Alphabet[(Alphabet.indexOf(pt[i]) + a) % 26];
				}
		
				return ct;
			},

			// Decipher a ciphertext with a vigenere key.
			_decipher: function(key, ct) {
				var pt = "";
				for (var i = 0; i < ct.length; i++) {
					var a = Alphabet.indexOf(key[i % key.length]);
					pt += Alphabet[(Alphabet.indexOf(ct[i]) - a + 26) % 26];
				}
		
				return pt;
			},

				// Just sanitize
			_getFullKey: function (key) {
				return text_sanitize(key);
			},

			_getKeyPhrase: function (key) {
				return key;
			},
		},
	},
	digraph: {
		playfair: {
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

			// Encipher a plaintext with a playfair key.
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
			
			// Decipher a ciphertext with a playfair key.
			_decipher: function (key, ct) {
				var pt = "";
		
				for (var i = 0; i < ct.length; i += 2) {
					var a = [ct[i], ct[i + 1]];
					var b = [key.indexOf(a[0]), key.indexOf(a[1])];
					if (b.indexOf(-1) !== -1) b = [key.indexOf('Z'), key.indexOf('X')];
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
		},
	},
	trans: {
		columnar: {

			// Just sanitize
			_getFullKey: function (key) {
				return text_sanitize(key);
			},

			_getKeyPhrase: function (key) {
				return key;
			},

			_keyNumberify: function (key) {
				var keySorted = key.split('').sort();
				var keyNum = key.split('');
				for (var i = 0; i < key.length; i++) {
					keyNum[keyNum.indexOf(keySorted[i])] = i;
				}

				return keyNum;
			},

			_keyStringify: function (keyNum) {
				var key = [];
				var letter = 0;
				for (var i = 0; i < keyNum.length; i++) {
					// TODO: Fix this to work with keys > 26 letters.
					var k = (keyNum.length - i - (keyNum.length - i) % Alphabet.length) / Alphabet.length;
					//console.log(k);
					for (var j = 0; j <= k; j++) {
						key[keyNum.indexOf(i + j)] = Alphabet[letter];
						
						//console.log("yes");
					}
					letter++;
					i += k;
				}

				return key.join('');
			},

			_encipher: function(key, pt) {
				var ct = "";
				
				// numberify key:

				var keyNum = this._keyNumberify(key);

				while (pt.length % key.length !== 0) {
					pt += "X";
				}

				for (var i = 0; i < key.length; i++) {
					for (var j = 0; j < pt.length / key.length; j++) {
						ct += pt[keyNum.indexOf(i) + j * key.length];
					}
				}

				//console.log(ct);
				return ct;

			},

			_decipher: function (key, ct) {
				if (ct.length % key.length !== 0) return;
				var pt = "";
				
				// numberify key:
				var keySorted = key.split('').sort();
				var keyNum = key.split('');
				for (var i = 0; i < key.length; i++) {
					keyNum[keyNum.indexOf(keySorted[i])] = i;
				}

				for(var j = 0; j < ct.length / key.length; j++) {
					for (var i = 0; i < key.length; i++) {
						pt += ct[keyNum[i] * (ct.length / key.length) + j];
					}
				}

				//console.log(pt);
				return pt;

			}
		}
	},
	other: {
		enigma: {
			
			settings: {
				plugboard: {
					// plugboard settings controlled whether certain letters
					// encode with a different letter, and vice versa.
					// A setting AB would encipher A like it would normally
					// do for B, and B like it would for A.
				},
				rotor: {
					1: {
						turnover: 'Q',
						//                ABCDEFGHIJKLMNOPQRSTUVWXYZ
						//                YRUHQSLDPXNGOKMIEBFZCWVJAT
						defaultAlphabet: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
					},
					2: {
						turnover: 'E',
						//                ABCDEFGHIJKLMNOPQRSTUVWXYZ
						//                YRUHQSLDPXNGOKMIEBFZCWVJAT
						defaultAlphabet: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
					},
					3: {
						turnover: 'V',
						//                ABCDEFGHIJKLMNOPQRSTUVWXYZ
						//                YRUHQSLDPXNGOKMIEBFZCWVJAT
						defaultAlphabet: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
					},
					4: {
						turnover: 'J',
						//                ABCDEFGHIJKLMNOPQRSTUVWXYZ
						//                YRUHQSLDPXNGOKMIEBFZCWVJAT
						defaultAlphabet: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
					},
					5: {
						turnover: 'Z',
						//                ABCDEFGHIJKLMNOPQRSTUVWXYZ
						//                YRUHQSLDPXNGOKMIEBFZCWVJAT
						defaultAlphabet: 'VZBRGITYUPSDNHLXAWMJQOFECK',
					},
				},
				reflectors: {
					B: "YRUHQSLDPXNGOKMIEBFZCWVJAT",
				}

			},

			_decodeKey: function (key) {
				var settings = {
					rotors: [],
					plugboard: {},
					reflector: this.settings.reflectors.B,
				};

				var noissue = true,
					rotors = true,
					index = 0;
				while (noissue && index < key.length) {
					if (key[index] == '|') {
						index++;
						rotors = false;
					}

					if (rotors) {
						var rotorOG = this.settings.rotor[parseInt(key[index + 1])];
						//console.log(key, rotorOG);
						var rotor = {
							og: parseInt(key[index + 1]),
							alphabet: rotorOG.defaultAlphabet.split('').map(c => Alphabet.indexOf(c)),
							ring: Alphabet.indexOf(key[index + 2]),
							pos: Alphabet.indexOf(key[index + 3]),
							turnOver: Alphabet.indexOf(rotorOG.turnover),
						};

						settings.rotors.push(rotor);
						index += 4;
					} else {
						if (index + 1 < key.length) {
							settings.plugboard[key[index]] = key[index + 1];
							settings.plugboard[key[index + 1]] = key[index];
							index += 2;
						}
					}
				};

				return settings;
			},

			_encodeKey: function (settings) {
				var key = "";
				for (var i = 0; i < settings.rotors.length; i++) {
					key += "r" + settings.rotors[i].og + Alphabet[settings.rotors[i].ring] + Alphabet[settings.rotors[i].pos];
				}
				key += "|";
				var plugs = [];
				for (var letter in settings.plugboard) {
					if (plugs.indexOf(settings.plugboard[letter]) == -1) key += letter + settings.plugboard[letter];
				}

				return key;
			},

			_encipher: function (key, pt) {
				// key format:
				// r1AAr2AAr3AA|bQtSmN
				// (r[rotor 1][ring setting][rotor offset])*|[plugboard]
				
				// decode key 
				var settings = this._decodeKey(key);

				//console.log(settings);

				var ct = "";

				for (var i = 0; i < pt.length; i++) {
					var letter = Alphabet.indexOf(pt[i]);
					// rotate rotors
					this._rotorRotate(settings.rotors);

					// swap letter with plugboard (if any)
					if (Alphabet[letter] in settings.plugboard) letter = Alphabet.indexOf(settings.plugboard[Alphabet[letter]]);
					

					// pass through rotors
					for (var j = 0; j < settings.rotors.length; j++) {
						
						
						letter = (letter + settings.rotors[j].pos) % 26;

						letter = (26 + letter - settings.rotors[j].ring) % 26;

						letter = settings.rotors[j].alphabet[letter];

						letter = (letter + settings.rotors[j].ring) % 26;
						letter = (26 + letter - settings.rotors[j].pos) % 26;

						/*
						letter = (letter + settings.rotors[j].pos) % 26;
						
						letter = (26 + letter - settings.rotors[j].ring) % 26;
						
						letter = Alphabet.indexOf(settings.rotors[j].alphabet[letter]);
						
						letter = (letter + settings.rotors[j].ring) % 26;

						letter = (26 + letter - settings.rotors[j].pos) % 26;
						*/
					}


					// reflector
					letter = Alphabet.indexOf(settings.reflector[letter]);
					
					// pass through rotors backwards?
					for (var j = settings.rotors.length - 1; j >= 0; j--) {
						letter = (letter + settings.rotors[j].pos) % 26;
						
						letter = (26 + letter - settings.rotors[j].ring) % 26;
						
						letter = settings.rotors[j].alphabet.indexOf(letter);
						
						letter = (letter + settings.rotors[j].ring) % 26;

						letter = (26 + letter - settings.rotors[j].pos) % 26;

						/*
						letter = (letter + settings.rotors[j].pos) % 26;
						
						letter = (26 + letter - settings.rotors[j].ring) % 26;
						
						letter = settings.rotors[j].alphabet.indexOf(Alphabet[letter]);
						
						letter = (letter + settings.rotors[j].ring) % 26;

						letter = (26 + letter - settings.rotors[j].pos) % 26;
						*/
					}

					// swap letter with plugboard (if any) again
					if (Alphabet[letter] in settings.plugboard) letter = Alphabet.indexOf(settings.plugboard[Alphabet[letter]]);

					ct += Alphabet[letter];
				}
				
				return ct;
			},

			_decipher: function (key, pt) {
				return this._encipher(key, pt);
			},


			_rotorRotate: function (rotors) {
				if (rotors.length == 0) return;

				var i = 0,
					flipping = true;
					
				do {
					rotors[i].pos = (rotors[i].pos + 1) % 26;
					if (rotors[i].turnOver !== rotors[i].pos) {
						flipping = false;
					}
					i++;
				} while (flipping && i < rotors.length);
				
			},

			_getFullKey: function (key) { 
				try {
					this._decodeKey(key);
				} catch (e) { return "r1AAr2AAr3AA|" }

				return key;
			},

			_getKeyPhrase: function (key) { return key },
		},

		adfgx: {
			
			_getFullKey: function (key) {
				if (key.indexOf('|') == -1) return 'ABCDEFGHIKLMNOPQRSTUVWXYZ|ABCDEFGH';
				else {
					var shortedKey = text_sanitize(key.substring(0, key.indexOf('|'))).split("").filter((a, b, c) => c.indexOf(a) == b).join("");
					shortedKey = shortedKey + Alphabet.replace(new RegExp("[" + shortedKey + "]", "g"), "");
					shortedKey = shortedKey.replace('J', '');
	
					
					return shortedKey + "|" + key.substring(key.indexOf('|') + 1);
				}
				
			},

			_getKeyPhrase: function (key) {
				if (key.indexOf('|') == -1) return 'ABCDEFGHIKLMNOPQRSTUVWXYZ|ABCDEFGH';
				else return key;
			},

			_decodeKey: function (key) {
				var settings = {}
				settings.key1 = key.substring(0, key.indexOf('|'));
				settings.key2 = key.substring(key.indexOf('|') + 1);

				return settings;
			},

			_encodeKey: function (settings) {
				var key = settings.key1 + '|' + settings.key2;

				return key;
			},

			_encipher: function (key, pt) {
				// parse key
				var settings = this._decodeKey(key);
				var keySorted = settings.key2.split('').sort();
				var keyNum = settings.key2.split('');
				for (var i = 0; i < settings.key2.length; i++) {
					keyNum[keyNum.indexOf(keySorted[i])] = i;
				}
				const letters = "ADFGX";
				var ct = "";

				
				// do the polybus square thing
				for (var i = 0; i < pt.length; i++) {
					ct += letters[~~(settings.key1.indexOf(pt[i]) / 5)] + letters[settings.key1.indexOf(pt[i]) % 5];
				}


				// determine number of letters in last row that cipher is short (no padding)
				var shortLetters = ct.length % settings.key2.length;
				if (shortLetters == 0) shortLetters = settings.key2.length + 1;

				
				var ct2 = "";
				console.log(ct);

				var x = ct.length % settings.key2.length;
				// special columnar without needing padding XF DD DD FA FG XG
				for (var i = 0; i < settings.key2.length; i++) {
					for (var j = 0; j < (settings.key2.length + ct.length - (x == 0 ? settings.key2.length : x)) / settings.key2.length - (keyNum.indexOf(i) + 1 > shortLetters ? 1 : 0); j++) {
						ct2 += ct[keyNum.indexOf(i) + j * settings.key2.length];
					}
				}
				


				return ct2;
			},
			
			_decipher: function (key, ct) {
				var settings = this._decodeKey(key);
				const letters = "ADFGX";
				var keySorted = settings.key2.split('').sort();
				var keyNum = settings.key2.split('');
				for (var i = 0; i < settings.key2.length; i++) {
					keyNum[keyNum.indexOf(keySorted[i])] = i;
				}
				var pt = "";

				// determine number of letters in last row that cipher is short (no padding)
				var shortLetters = ct.length % settings.key2.length;
				if (shortLetters == 0) shortLetters = settings.key2.length + 1;

				//console.log(shortLetters);

				// columnar
				
				var x = Math.ceil(ct.length / settings.key2.length);
				
				var c = 0;
				var arr = [];

				for (var i = 0; i < x; i++) {
					arr.push([]);
				}

				//console.log(arr);
				// I know there's a better way to do this
				for (var i = 0; i < settings.key2.length; i++) {
					for (var j = 0; (shortLetters !== settings.key2.length + 1 && i > shortLetters - 1) ? j < x - 1 : j < x; j++) {
						arr[j][keyNum[i]] = ct[c];
						c++;
					}
				}
				
				var pt = arr.map(e => e.join('')).join('');


				var pt2 = "";

				// polybius square
				for (var i = 0; i < pt.length - 1; i += 2) {
					pt2 += settings.key1[letters.indexOf(pt[i]) * 5 + letters.indexOf(pt[i + 1])];
				}

				return pt2;
			}
		},

		grandpre: {
			// Just sanitize
			_getFullKey: function (key) {
				key = text_sanitize(key);
				if (key.length > 100) key = key.split('').splice(100, key.length - 100).join('');
				while (key.length !== 100) {
					key += Alphabet[key.length % Alphabet.length];
				}
				return key;

			},

			_getKeyPhrase: function (key) {
				return key;
			},

			_decipher: function (key, ct) {
				var pt = '';
				for (var i = 0; i < ct.length; i += 2) {
					var d1 = parseInt(ct[i]);
					var d2 = parseInt(ct[i + 1])
					pt += key[(d1 == 0 ? 9 : d1 - 1) * 10 + (d2 == 0 ? 9 : d2 - 1)];
				}

				return pt;
			},

			_encipher: function (key, pt) {
				var ct = '';
				for (var i = 0; i < pt.length; i++) {
					var x = Math.floor(Math.random() * key.length);
					var y = key.indexOf(pt[i], x);
					var z = key.indexOf(pt[i]);
					if (y != -1) {
						ct += ~~((y + 10) / 10) % 10;
						ct += (y + 1) % 10;
					} else if (z != -1) {
						ct += ~~((z + 10) / 10) % 10;
						ct += (z + 1) % 10;
					} else {
						return;
					}
				}	

				return ct;
			},
		}
	},
}
