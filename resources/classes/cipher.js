

export class Cipher {
	constructor(name, encrypt, decrypt, getFullKey, getKeyPhrase, SA) {
		this.name = name;
		this.encrypt = encrypt;
		this.decrypt = decrypt;
		this.getFullKey = getFullKey;
		this.getKeyPhrase = getKeyPhrase;
		this.SA = SA;
	}
}