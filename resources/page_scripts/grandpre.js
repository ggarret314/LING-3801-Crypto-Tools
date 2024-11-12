import { Alphabet, text_sanitize, WordFinder, EnglishFrequencies } from '../main.js';
import { Cipher } from '../cipher.js';
import { CipherDirection } from '../classes/cipherdirection.js';
import { FrequencyTable } from '../classes/frequencytable.js';
import { DecipheringContainer } from '../classes/decipheringcontainer.js';


const GrandpreCipher = {


	_init: function () { 

	}
}


var intercept = text_sanitize("UVZJU GAAAS IPYIQ GMUKU QOYAE DFIAO MEOVV TUGIR TKCJK YFQED CKRCA LMFXC HETCZ LAVKO ICUJG RXMOT FVGTI IPJAP JHBVL QMBYZ DAPZT BJMNF ABTHK FBNTE TASTI EIMYG SMGFA JEJEY AUFYP RLDSJ EMMTI CFTYJ HGPGO WCQQQ WOPWO WFRKQ LHHOZ KCBQP XPADQ OMIRJ TKIYE DXVIC GQUMC JOFJL NCGOF PXFFL OLAGB KOGHN HSYUE NURLH INOQH YYSKN OEDAW XVRKB CFOHG DOANZ DRBCH KHGPX ZQQVO UGVZG WMRGF ZZECL EDDAH ZNNYL UYZPC VDRQQ YNRLK UWPSJ EYSWX PHTVB IHLOK BOKPK PJZNL GPFSC OCKFO EXDUH YUPUB YJIZN ZHCHE BBVDG TAXAD BXZVI CRGLJ BIYJD TRFWW UDMXM WOZWG SSAHN UYLRR JPGBB NFYAA CNYUJ YWYUU ATQNT TMTHL PCNSI XGKIL PDSRO GGLJV BHLGV ZEDKI GEXEC FZNHH JDHSJ IEEFG GRZRI BRDDY RHCYJ NNGCL QDZIV EHUQL CSDNN OHUHW TJZOF UPAJQ PQNKC BRUWU PUNOB FPVQI SUIJW YUZEA RJUWN UCOEC YUHBO NMDHT YOTZB OTJUD FMZTV OAFRM DGOFN");

var bestKey = "",
	bestFitness = -999999999999999999999;



var letters = ['A', 'A', 'A', 'A', 'A', 'A', 'A'];
var letterCount = letters.length;
var count = 0;

var valids = [];
/*
function fart() {
	console.log("starting...");

	while (count < Math.pow(26, letterCount)) {
		var pt = Cipher.poly.autovigenere._decipher(letters.join(''), intercept);

		if (pt.indexOf('J') == -1) {
			console.log('[Working]', letters.join(''));
			valids.push(letters.join(''));
		}
		//var fitness = TextFitness._calcFitness(pt);
		//if (fitness > bestFitness) {
		//	
		//	bestFitness = fitness;
		//	bestKey = letters.join('');
		//	console.log("best fitness: ", bestKey, bestFitness);
		//}
		
		count++;
		letters[0] = Alphabet[(Alphabet.indexOf(letters[0]) + 1) % 26];
		var i = 0;
		while (letters[i] == 'A' && i < letterCount) {
			i++;
			letters[i] = Alphabet[(Alphabet.indexOf(letters[i]) + 1) % 26];
			if (i == letterCount - 1) console.log(letters.join(''));
			else if (i == letterCount - 2) console.log(letters.join(''));
			else if (i == letterCount - 3) console.log(letters.join(''));
		}
	}
	console.log(JSON.stringify(valids));
}

fart();

var testing = [];

function fart2() {
	for (var i = 0; i < valids.length; i++) {
		var pt = Cipher.poly.autovigenere._decipher(valids[i], intercept);
		var notRepeating = true;
		for (var j = 0; j < pt.length && notRepeating; j += 2) {
			if (pt[j] == pt[j + 1]) notRepeating = false;
		}
	
		if (notRepeating) {
			testing.push(valids[i]);
			console.log("[Not repeating]", valids[i]);
		}
	}
	
}

//fart2();

console.log(JSON.stringify(testing));

*/