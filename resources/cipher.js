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
		},
	},
	poly: {
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
		},
	},
	digraph: {
		playfair: {
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
}