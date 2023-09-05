import { XxHandlerxX, XxTexturedElementxX } from "element";

export class Render {
	activeHandler;
	gl;
	shader;

	constructor(gl) {
		this.gl = gl;
		this.activeHandler = null;
	}

	render() {
		this.activeHandler.elementShaderMap;
		// go thru hashmap of elements
		// set shader texture
		// render
	}
}