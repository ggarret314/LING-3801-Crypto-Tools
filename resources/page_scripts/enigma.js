import { Alphabet, text_sanitize, WordFinder, TextFitness } from '../main.js';
import { Cipher } from '../cipher.js';
import { CipherDirection } from '../classes/cipherdirection.js';

const EnigmaCipher = {

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
		keyAuto: document.getElementById("key-auto"),
	},


	_init: function () {

	},
};

EnigmaCipher._init();

var cryptoCupRaw = text_sanitize("WGGTW HRIRV JBBTW ENMYM RZZDZ EZFPH TJOFB UKXST SGRYL GJHMN GKWHY IMVTV PNOZM GYXCC IGOEX RCZAZ OOYWE KUCOB IUTGT YENZC YFWYD TGRUA NMTCU GACTF EKVMD RHJSE XAWYN IPUMJ BAYHY IECND TKCZQ GSZGK FXGZP ERZMK RUUSE WHAPS LCQQL RIJBK PRKPO LNWFI GTNUY XTBOG EHWZQ GKQMR TEONH WJSDM NSJSK MGUHL LNBAB OKXIJ TBQTR UUWEP NRQVR ZXHZU ELSOB RGHVF JRCFU SWUSM FZNCE WBBEX RPPGB VJTHY MGYTK AXSMJ RZYSI MWSLI ITGFE RYMCL PWBZW MGSFI GZMSU VTYPX NKCZN BXXSM IKOWU ECGAV FLNFJ XFOYB PGCBT RMTHY IKSLQ DVVQN NIYHY EMWER VGFXW BQXKR XXFDH EOGFW BYNAZ PTFER SVXMU RYUOI OYCCP YVOEB RGQCT EMWZQ TJOFQ FTJOI PRQWL CJSUV OGIGG CMOWH SDMZW JZMSN EMSCP APTMZ ZJTSJ SYTPU MQFQX EOAOT CUIED GCWZQ ZAXHI ICSNW IVCZB JULFF YGRDI ITGFQ GOXOU MYTTF UNHBT NIJHF RHBNK ANOZB YEXQY PXDER WJWOP VTHFV ELSDW HGQTI AIJGK LTHHH WKZXI GZWOT XNBHD NVSPI GZJBK MHBDH CQBPT LOFAJ YLDTF IQIEW SZMST SPGEK EAYZW JZTCD YVVYR IJOHM UGIOJ XKCVH OHUQV VAXWG VHDZV EVVMB JKRSV XTHEK EEZAK XZTKV VMVPF LQQWB BCJFR WPWEK ANZDQ QOHIC SNGEK IPUEE NYGIZ PMKTW HVVQR HYYWW MVOEL OPCRX EUAWU MGULP EGHUV TVQOT IYCCV TWRQV GYGIK SYQZX RUSUB VYFBV CXGZU ECBPV BUSSZ RMVPL RTWSP GSNBU WPCFO DOSQB GNJFV XAOEP ECBEB UGYSM IGWQD NACZM FGBIJ XASCH TJSKE BAQRE EMICD LNMMA FARSK LTHHH WGFQV BZRSV XBBRW HGFQQ GYGFZ PEWLQ TVVQK YUHYZ QXOYL TKGMT FUVIZ XXPCL GJHMV QCTIC HBZWX MKBMB RGSMG ELGPU SDMNM SUWSK LXMLS PTCMK UKIQC SLSPQ OWUTB BUASI LXOCX SYSEP NRQAV IMHSH RGOZL GNJB");

var key = 'r1HDr2QFr3GH|';

"BPBHD";

var options = [[1,2,3,4,5],Alphabet.split(""),Alphabet.split("")];
var message = text_sanitize("AAAAA");
var AAAAA = Cipher.other.enigma._encipher(key, message);
console.log(message, AAAAA);
console.log(AAAAA, Cipher.other.enigma._encipher(key, AAAAA));

console.log("Decoded: ", Cipher.other.enigma._getFullKey("key"));
console.log("Encoded: ", Cipher.other.enigma._encodeKey(Cipher.other.enigma._decodeKey(Cipher.other.enigma._getFullKey("key"))));

var timeBefore = performance.now();
var decrypted = Cipher.other.enigma._encipher(key, cryptoCupRaw);
var fitness = TextFitness._calcFitness(decrypted);
var timeAfter = performance.now();
console.log(timeAfter - timeBefore);
console.log(decrypted);
// r1ABr4EXr2FZ|ABGIEJ key.match(/(r[d][A-Z][A-Z])*\|([A-Z][A-Z])*/i);