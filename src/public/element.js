export class XxHandlerxX {
	elementShaderMap;

	constructor(elementShaderMap) {
		this.elementShaderMap = elementShaderMap;
	}
}

export class XxTexturedElementxX {
    x; y; w; h; u; v;
	prioity;

	constructor(x, y, width, height, u, v, prioity) {
        this.x = x;
        this.y = y;
		this.w = width;
		this.h = height;
		this.u = u;
		this.v = v;
		this.prioity = prioity;
	}
	
	onClick() {

	}
}