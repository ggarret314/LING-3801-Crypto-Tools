export class DecipheringContainer {
	constructor(container) {
		this.container = container;
	}

	_update(ct, pt, grouping=1) {
		this.container.innerHTML = "";
		
		for (var i = 0; i < ct.length; i += grouping) {
			var a = document.createElement("div"),
				b = document.createElement("div"),
				c = document.createElement("div");
			
			a.setAttribute("class", "deciphering-block");
			b.setAttribute("class", "cipher-row");
			c.setAttribute("class", "plain-row");

			a.innerHTML = ct.substring(i, i + grouping);
			b.innerHTML = pt.substring(i, i + grouping);

			a.appendChild(b);
			a.appendChild(c);

			this.container.appendChild(a);
		}
	}
}