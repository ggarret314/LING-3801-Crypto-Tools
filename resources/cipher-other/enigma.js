import { Alphabet, text_sanitize, WordFinder } from '../main.js';
import { Cipher } from '../cipher.js';
import { CipherDirection } from '../cipherdirection.js';

var key = 'r3BXr2BZr4BF|';
var message = text_sanitize("This is a test to see how well this cipher works");
var AAAAA = Cipher.other.enigma._encipher(key, message);
console.log(message, AAAAA);
console.log(AAAAA, Cipher.other.enigma._encipher(key, AAAAA));


// r1ABr4EXr2FZ|ABGIEJ key.match(/(r[d][A-Z][A-Z])*\|([A-Z][A-Z])*/i);