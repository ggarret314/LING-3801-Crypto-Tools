import { Alphabet, text_sanitize, WordFinder, EnglishFrequencies } from './main.js';
import { Cipher } from './cipher.js';

const Auto = {
	
	ele: {
		numCipherUpdate: document.getElementById("num-cipher-update"),
		numCipherMin: document.getElementById("num-cipher-min"),
		numCipherMax: document.getElementById("num-cipher-max"),
		numCipherExactCheckbox: document.getElementById("num-cipher-exact-checkbox"),
		numCipherExact: document.getElementById("num-cipher-exact"),
		cipherList: document.getElementById("cipher-list"),
		solveBtn: document.getElementById("solve-btn"),
		textareaCiphertext: document.getElementById("textarea-ciphertext"),
		textareaPlaintext:  document.getElementById("textarea-plaintext"),
		checkboxAutoSpaces: document.getElementById("auto-spaces"),
		keyList: document.getElementById("key-list"),
	},

	get numCipherMin() { return parseInt(this.ele.numCipherMin.value) },
	get numCipherMax() { return parseInt(this.ele.numCipherMax.value) },
	
	cipherList: [],
	keys: [],

	ciphers: {
		shift: 'mono',
		substitution: 'mono',
		vigenere: 'poly',
		autovigenere: 'poly',
		playfair: 'digraph',
		columnar: 'trans',
		enigma: 'other',
	},

	availableCiphers: [
		['Unknown', 'unknown'],
		['Shift', 'shift'],
		['Simple Substitution', 'substitution'],
		['Vigenere', 'vigenere'],
		['Vigenere Auto Key', 'autovigenere'],
		['Playfair', 'playfair'],
		['Columnar Trans', 'columnar'],
		['Enigma', 'enigma'],
	],

	_decipher: function () {
		var pt = text_sanitize(this.ele.textareaCiphertext.value);
		
		for (var i = 0; i < this.cipherList.length; i++) {
			
			pt = Cipher[this.ciphers[this.cipherList[i]]][this.cipherList[i]]._decipher(this.keys[i], pt);
			if (typeof pt !== 'string') pt = pt[0];
		}
		this.ele.textareaPlaintext.value = (this.ele.checkboxAutoSpaces.checked ? WordFinder._wordFind(pt) : pt).toLowerCase();
	},

	solver: new Worker('./resources/solver.js', { type: 'module' }),

	_sendSolveMessage: function (startKey, ct, ciphers, temp = 20, step = 0.2, count = 50000, stopWhenNear = true) {
		this.solver.postMessage({
			task: "solve",
			args: {
				startKey: startKey,
				ct: ct,
				ciphers: ciphers,
				Temp: temp,
				Step: step,
				Count: count,
				stopWhenNear: stopWhenNear
			}
		})
	},

	_init: function () {
		var self = this;

		this.solver.onmessage = e => {
			switch (e.data.task) {
				case "solve_newBestKey":
					var data = e.data.data;
					
					for (var i = 0; i < self.cipherList.length; i++) {
						self.keys[i] = data[0][i];
						self.ele.keyList.getElementsByTagName("span")[i].innerHTML = 
							Cipher[this.ciphers[this.cipherList[i]]][this.cipherList[i]]._getKeyPhrase(data[0][i]);
					}
					self._decipher();
					break;
			}
		};

		this.ele.numCipherUpdate.addEventListener('click', function (e) {
			self.ele.cipherList.innerHTML = "";
			self.ele.keyList.innerHTML = "";
			self.cipherList = [];
			self.keys = [];
			for (var i = 1; i <= self.numCipherMax; i++) {
				//self.keys.push('');
				var li = document.createElement("li");
				var select = document.createElement("select");
				var seed = document.createElement("input");
				select.setAttribute("data-i", i - 1);
				self.cipherList.push('unknown');
				self.keys.push('A');
				select.addEventListener('change', function (ev) {
					self.cipherList[parseInt(ev.target.getAttribute('data-i'))] = ev.target.value;
					console.log(self.cipherList);
				});
				for (var j = 0; j < self.availableCiphers.length; j++) {
					var option = document.createElement("option");
					option.value = self.availableCiphers[j][1];
					option.innerHTML = self.availableCiphers[j][0];
					select.appendChild(option);
					
				};

				seed.setAttribute("data-i", i - 1);
				seed.setAttribute("placeholder", "seed");
				seed.value = "A";
				seed.addEventListener("change", function (e) {
					self.keys[parseInt(e.target.getAttribute("data-i"))] = e.target.value;
				});

				li.appendChild(select);
				li.appendChild(seed);
				self.ele.cipherList.appendChild(li);



				self.ele.keyList.innerHTML += "<li>Key: <span>-</span></li>";
			}
		});

		this.ele.numCipherUpdate.click();

		this.ele.solveBtn.addEventListener("click", function (e) {
			self._sendSolveMessage(self.keys, text_sanitize(self.ele.textareaCiphertext.value), self.cipherList);
		});

		this.ele.checkboxAutoSpaces.addEventListener("change", function (e) {
			self._decipher();
		});
	}
}

Auto._init();

//Auto._sendSolveMessage('', '', ['playfair']);

var msg = text_sanitize("Her eyebrows were a shade darker than her hair. They were thick and almost horizontal, emphasizing the depth of her eyes. She was rather handsome than beautiful. Her face was captivating by reason of a certain frankness of expression and a contradictory subtle play of features. Her manner was engaging.");
var key = "r5HDr1QFr2GH|";

console.log(msg);
console.log(text_sanitize("othzhhnunencchqyksomsjznuomstlzbumztqtwfpivisukohhhrdhonfydrensmocdpvymnvlcyepgqzniiltyekhukanjewztytrgumqobrviomaovtdskvozhopguljorouqepcnwnarggmyjbmeqjzdcpgycyqxtiychdemwspxhtdlfrduibaunlaftaurjzzqmohyxfrbaxthvrubivvydomfpdsjhqveunjvvmdcldfiecmfk"));
var enigmaCode = Cipher.other.enigma._encipher(key, msg);

console.log(enigmaCode);
console.log(Cipher.other.enigma._encipher(key, enigmaCode));

//Auto.ele.textareaCiphertext.value = enigmaCode;

// r5AWr1AOr2RR| 

//Auto._sendSolveMessage('A', enigmaCode, ['enigma']);