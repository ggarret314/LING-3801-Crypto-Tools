export const Cipher = {
	mono: {
		shift: {
			// Encipher a plaintext with a substitution key.
			_encipher: function (key, pt) {
				var ct = "";
				for (var i = 0; i < pt.length; i++) {
					ct += this.fullKey[Alphabet.indexOf(pt[i])];
				}

				return ct;
			},

			// Decipher a ciphertext with a substitution key.
			// If a particular letter is not found in the key, it is substituted with a period.
			_decipher: function(key, ct) {
				var pt = "";
				for (var i = 0; i < ct.length; i++) {
					var a = key.indexOf(ct[i]);
					pt += a == -1 ? '.' : Alphabet[a];
				}

				return pt;
			},
		},
		substitution: {
			// Encipher a plaintext with a substitution key.
			_encipher: function (key, pt) {
				var ct = "";
				for (var i = 0; i < pt.length; i++) {
					ct += this.fullKey[Alphabet.indexOf(pt[i])];
				}

				return ct;
			},

			// Decipher a ciphertext with a substitution key.
			// If a particular letter is not found in the key, it is substituted with a period.
			_decipher: function(key, ct) {
				var pt = "";
				for (var i = 0; i < ct.length; i++) {
					var a = key.indexOf(ct[i]);
					pt += a == -1 ? '.' : Alphabet[a];
				}

				return pt;
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