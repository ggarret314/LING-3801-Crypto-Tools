// Everything here was written by Garret Gallion


// Function whose primary purpose is for getting the word list txt files so I don't have to have them here.
function _get(url, callback, formdata=null) {
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(formdata);
}




// Sanitizer
function text_sanitize(s) { return s.toUpperCase().replace(/[^A-Z]/g, "") }

// Alphabet: The alphabet A-Z as a string.
const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// top1000: Array of the top 1,000 words in English.
var top1000;
// topWords: Array of the top some numebr of words in English.
var topWords;
var quadgramFitness = [];
var quadgrams = [];
var quadGRAMS = {};


_get(__ROOTDIR__ + 'resources/top100000words.txt', (data) => {
	topWords = data.replace(/\r/g, "").split("\n");
	WordFinder._init();
});


_get(__ROOTDIR__ + 'resources/english_quadgrams.txt', data => {
	// english_quadgrams.txt is from http://practicalcryptography.com/cryptanalysis/text-characterisation/quadgrams
	var x = data.replace(/\r/g, "").split("\n");
	for (var i = 0; i < x.length; i++) {
		var p = x[i].split(" ");
		quadgrams.push(p[0]);
		quadgramFitness.push(parseInt(p[1]));
		
	}


	// find total number of quadrigrams.
	var sum = quadgramFitness.reduce((a, b) => a + b, 0);
	

	// Calculate fitness of each quadrigram
	for (var i = 0; i < quadgramFitness.length; i++) {
		quadgramFitness[i] = Math.log(quadgramFitness[i]/sum);
	}



	TextFitness._init(sum);
});


// PageSwitcher: switches between pages for the different parts of the site. 

// WordFinder: this helps automatically determine where spaces should be in a string (plain text).
//             based off of https://stackoverflow.com/questions/8870261
var WordFinder = {
	words: null,
	wordCosts: {},
	maxWordLength: 0,
	
	_wordFind: function (str) {
		var costs = [0];
		for (var i = 1; i < str.length + 1; i++) {
			var bestMatch = this._bestMatch(str, costs, i);
			costs.push(bestMatch[0]);
		}

		var out = [];
		
		var k = str.length;
		var pp = 0;
		while (k > 0) {
			var bestMatch = this._bestMatch(str, costs, k);
			if (bestMatch[0] == costs[k]) {
				out.push(str.substring(k-bestMatch[1], k));
			}
			k -= bestMatch[1];
		}
		//return costs;

		return out.reverse().join(" ");
	},

	_bestMatch: function (str, costs, startIndex) {
		var cost = Number.MAX_VALUE;
		var len = 0;
		
		// Candidate array
		var candidates = [];
		/*for (var i = startIndex; i >= Math.max(0, startIndex - this.maxWordLength); i--) {
			candidates.push(costs[i]);
		}
		*/

		candidates = costs.slice(Math.max(0, startIndex - this.maxWordLength), startIndex).reverse();

		//console.log("Start:" + Math.max(0, startIndex - this.maxWordLength) + ", End: " + startIndex);


		for (var i = 0; i < candidates.length; i++) {
			var j = candidates[i];
			// substring for this iteration
			var ss = str.substring(startIndex - i - 1, startIndex);
			var newCost = j + (ss in this.wordCosts ? this.wordCosts[ss] : Number.MAX_VALUE);
			if (cost > newCost) {
				cost = newCost;
				len = i + 1;
			}

			
			
		}

		return [cost, len];
		
		/*
		var bestMatches = [];
		var bestMatchCost = Number.MAX_VALUE;
		var bestMatchWord = "";
		for (var i = 0; i < this.maxWordLength && startIndex + i <= str.length; i++) {
			if (str.substring(startIndex, startIndex + i) in this.wordCosts) {
				var s = str.substring(startIndex, startIndex + i);
				bestMatches.push([this.wordCosts[s], s]);
				if (this.wordCosts[s] < bestMatchCost) {
					bestMatchCost = this.wordCosts[s];
					bestMatchWord = s;
				}
			}
		}
		return [bestMatchCost, bestMatchWord];
		*/
	},

	singleWordFind: function (str) {

	},

	_init: function () {
		this.words = topWords;
		
		for (var i = 0; i < this.words.length; i++) {
			this.wordCosts[this.words[i]] = Math.log((i + 1) * Math.log(this.words.length));
			if (this.words[i].length > this.maxWordLength) this.maxWordLength = this.words[i].length;
		}
	}
}

// TextFitness: this is used by the auto solver and notably can calculate the fitness level of
//              a particular text, i.e. a rating of how much it looks like English.
var TextFitness = {
	quadgrams: quadgrams,
	fitness: null,
	sum: null,
	floor: null,
	maximumFitness: -5.770749985466554,

	_calcFitness: function (str) {
		//str = text_sanitize(str);
		var x = 0;
		for (var i = 0; i < str.length - 4; i++) {
			var a = Alphabet.indexOf(str[i]) * 17576 + Alphabet.indexOf(str[i + 1]) * 676 + Alphabet.indexOf(str[i + 2]) * 26 + Alphabet.indexOf(str[i + 3]);
			x += quadGRAMS[a];
		}

		return x;
	},

	_init: function (sum) {
		this.sum = sum;
		this.floor = -1 * Math.log(0.01 / this.sum);
		this.quadgrams = quadgrams;
		this.fitness = quadgramFitness;
	}
}


// EnglishFrequencies: a bunch of data about letter frequency and stuff like that
//                     currently data pulled from: https://www3.nd.edu/~busiforc/handouts/cryptography/Letter%20Frequencies.html#Results_from_Project_Gutenberg
var EnglishFrequencies = {
	freqLetters: [
		['E', 100.00],['T', 72.24],['A', 63.62],['O', 60.36],['I', 55.03],['N', 54.90],['S', 50.42],
		['H', 49.59], ['R', 47.39],['D', 34.34],['L', 32.26],['U', 22.60],['C', 20.48],['M', 20.36],
		['F', 18.69], ['W', 17.69],['G', 15.77],['Y', 15.12],['P', 14.28],['B', 12.21],['V', 7.81],
		['K', 5.88],  ['X', 1.43], ['J', 1.15], ['Q', 0.93], ['Z', 0.63]
	],
	freqBigrams: [
		['TH', 100.00],['HE', 94.82],['IN', 58.82],['ER', 56.10],['AN', 55.13],['RE', 45.06],['ND', 40.49],
		['ON', 36.53], ['EN', 35.63],['AT', 34.40],['OU', 33.11],['ED', 32.86],['HA', 32.83],['TO', 30.13],
		['OR', 29.65], ['IT', 29.23],['IS', 28.59],['HI', 28.13],['ES', 28.13],['NG', 27.13]
	],
	freqTrigrams: [
		['THE', 100.00],['AND', 45.43],['ING', 32.70],['HER', 23.44],['HAT', 18.55],['HIS', 17.01],
		['THA', 16.92], ['ERE', 15.98],['FOR', 15.83],['ENT', 15.13],['ION', 14.44],['TER', 13.14],
		['WAS', 13.13], ['YOU', 12.46],['ITH', 12.29],['VER', 12.28],['ALL', 12.05],['WIT', 11.32],
		['THI', 11.25], ['TIO', 10.78]
	],
	freqQuadrigrams: [
		['THAT', 100.00],['THER', 79.41],['WITH', 75.39],['TION', 72.50],['HERE', 49.20],['OULD', 48.59],
		['IGHT', 40.65], ['HAVE', 38.17],['HICH', 37.35],['WHIC', 37.28],['THIS', 36.30],['THIN', 35.52],
		['THEY', 34.47], ['ATIO', 34.47],['EVER', 34.25],['FROM', 33.97],['OUGH', 33.29],['WERE', 30.36],
		['HING', 30.21], ['MENT', 29.34]
	]
}


