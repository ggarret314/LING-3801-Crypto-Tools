export class CipherDirection {
	constructor(eleEncipher, eleDecipher, _callbackEncipher, _callbackDecipher) {
		this.ele =  {
			encipher: eleEncipher,
			decipher: eleDecipher,
		}

		this.isEncipher = false;
		
		var self = this;


		this.ele.encipher.addEventListener("click", function (e) {
			if (!self.isEncipher) {
				self.isEncipher = true;
				self.ele.encipher.style.backgroundColor = "#eee";
				self.ele.decipher.style.backgroundColor = "";
				_callbackEncipher();
			}
		});
		
		this.ele.decipher.addEventListener("click", function (e) {
			if (self.isEncipher) {
				self.isEncipher = false;
				self.ele.encipher.style.backgroundColor = "";
				self.ele.decipher.style.backgroundColor = "#eee";
				_callbackDecipher();
			}
		});
	}
}