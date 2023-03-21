import { EnglishFrequencies } from '../main.js';

export class FrequencyTable {
	constructor(container, options) {
		// options: array of 1,2,3, or 4, or all, or some for uni bi tri and quadri grams
		this.frequencyTableElement = container;
		this.options = options;
		this.frequencyTable = {
			letterRegularElements: [],
			letterCipherElements: [],
			bigramRegularElements: [],
			bigramCipherElements: [],
			trigramRegularElements: [],
			trigramCipherElements: [],
			quadrigramRegularElements: [],
			quadrigramCipherElements: [],
		};

		this._initFrequencyTable();
	}

	_initFrequencyTable () {
		// Find total number of rows required.
		var totalRows = 0;
		for (var freq in EnglishFrequencies) {
			if (EnglishFrequencies[freq].length > totalRows) totalRows = EnglishFrequencies[freq].length;
		}

		// Create the rows
		var rows = [];
		for (var i = 0; i < totalRows; i++) {
			rows.push(document.createElement("tr"));
		}

		// Determine number of each thing
		var EngFreqTitles = ["freqLetters", "freqBigrams", "freqTrigrams", "freqQuadrigrams"];
		var EleTitles = [["letterRegularElements","letterCipherElements"], ["bigramRegularElements","bigramCipherElements"], 
						 ["trigramRegularElements","trigramCipherElements"], ["quadrigramRegularElements","quadrigramCipherElements"]];
		var usingFreqTitles = [];
		var usingEleTitles = [];
		for (var i = 0; i < this.options.length; i++) {
			usingFreqTitles.push(EngFreqTitles[this.options[i] - 1]);
			usingEleTitles.push(EleTitles[this.options[i] - 1]);
		}
		for (var i = 0; i < usingFreqTitles.length; i++) {
			var theFreq = EnglishFrequencies[usingFreqTitles[i]];
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
				this.frequencyTable[usingEleTitles[i][0]].push([p1, p2]);
				this.frequencyTable[usingEleTitles[i][1]].push([c1, c2]);

				// add the columns to the jth row
				rows[j].append(p1);
				rows[j].append(p2);
				rows[j].append(c1);
				rows[j].append(c2);
			}
		}

		// add rows to table
		for (var i = 0; i < rows.length; i++) {
			this.frequencyTableElement.children[1].appendChild(rows[i]);
		}

	}



	_updateFrequencyTable(ct) {

		// Calculate the number of each letter, bigram, etc.
		var letterTotal = 0, bigramTotal = 0, trigramTotal = 0, quadrigramTotal = 0;
		var letters = {}, bigrams = {}, trigrams = {}, quadrigrams = {};
		var sortedletters = [], sortedbigrams = [], sortedtrigrams = [], sortedquadrigrams = [];
		for (var i = 0; i < ct.length; i++) {
			// letter
			if (!(ct[i] in letters)) letters[ct[i]] = 1;
			else letters[ct[i]]++;
			letterTotal++;
			// bigram
			if (i + 1 < ct.length) {
				if (!(ct.substring(i, i + 2) in bigrams)) bigrams[ct.substring(i, i + 2)] = 1;
				else bigrams[ct.substring(i, i + 2)]++;
				bigramTotal++;
			}

			// trigram
			if (i + 1 < ct.length) {
				if (!(ct.substring(i, i + 3) in trigrams)) trigrams[ct.substring(i, i + 3)] = 1;
				else trigrams[ct.substring(i, i + 3)]++;
				trigramTotal++;
			}

			// quadrigram
			if (i + 1 < ct.length) {
				if (!(ct.substring(i, i + 4) in quadrigrams)) quadrigrams[ct.substring(i, i + 4)] = 1;
				else quadrigrams[ct.substring(i, i + 4)]++;
				quadrigramTotal++;
			}
		}

		// sort them

		for (var letter in letters) {
			sortedletters.push([letter, letters[letter]]);
		}

		for (var bigram in bigrams) {
			sortedbigrams.push([bigram, bigrams[bigram]]);
		}

		for (var trigram in trigrams) {
			sortedtrigrams.push([trigram, trigrams[trigram]]);
		}

		for (var quadrigram in quadrigrams) {
			sortedquadrigrams.push([quadrigram, quadrigrams[quadrigram]]);
		}
		
		sortedletters.sort((a, b) => b[1] - a[1]);
		sortedbigrams.sort((a, b) => b[1] - a[1]);
		sortedtrigrams.sort((a, b) => b[1] - a[1]);
		sortedquadrigrams.sort((a, b) => b[1] - a[1]);

		// calculate relative frequencies.
		if (sortedletters.length > 0 && sortedbigrams.length > 0 && sortedtrigrams.length > 0 && sortedquadrigrams.length > 0) {
			var topLetterCount = sortedletters[0][1], topBigramCount = sortedbigrams[0][1], topTrigramCount = sortedtrigrams[0][1], topQuadrigramCount = sortedquadrigrams[0][1];
			sortedletters.forEach(x => x[1] = (100 * x[1] / topLetterCount).toFixed(1) + "%");
			sortedbigrams.forEach(x => x[1] = (100 * x[1] / topBigramCount).toFixed(1) + "%");
			sortedtrigrams.forEach(x => x[1] = (100 * x[1] / topTrigramCount).toFixed(1) + "%");
			sortedquadrigrams.forEach(x => x[1] = (100 * x[1] / topQuadrigramCount).toFixed(1) + "%");
	
	
			// print them out on the table
			
			for (var i = 0; i < this.frequencyTable.letterCipherElements.length && i < sortedletters.length; i++) {
				var currElements = this.frequencyTable.letterCipherElements[i];
				currElements[0].innerHTML = sortedletters[i][0];
				currElements[1].innerHTML = sortedletters[i][1];
				
			}
	
			for (var i = 0; i < this.frequencyTable.bigramCipherElements.length && i < sortedbigrams.length; i++) {
				var currElements = this.frequencyTable.bigramCipherElements[i];
				currElements[0].innerHTML = sortedbigrams[i][0];
				currElements[1].innerHTML = sortedbigrams[i][1];
				
			}
	
			for (var i = 0; i < this.frequencyTable.trigramCipherElements.length && i < sortedtrigrams.length; i++) {
				var currElements = this.frequencyTable.trigramCipherElements[i];
				currElements[0].innerHTML = sortedtrigrams[i][0];
				currElements[1].innerHTML = sortedtrigrams[i][1];
				
			}
	
			for (var i = 0; i < this.frequencyTable.quadrigramCipherElements.length && i < sortedquadrigrams.length; i++) {
				var currElements = this.frequencyTable.quadrigramCipherElements[i];
				currElements[0].innerHTML = sortedquadrigrams[i][0];
				currElements[1].innerHTML = sortedquadrigrams[i][1];
				
			}	
		}
		

	}
}