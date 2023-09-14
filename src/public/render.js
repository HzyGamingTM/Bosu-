import { BsHandler, BsTexturedElement } from "../element.js";
import { BsMath } from "./utils.js";

export class BsRenderer {
	activeHandler;
	gl;
	shader;

	constructor(gl) {
		this.gl = gl;
		this.activeHandler = null;
	}

	render() {
		this.activeHandler.elementShaderMap;
		
		for (element in elementShaderMap) {
			// TODO: render
			// TODO: set shader texture
		}		
	}
}

export class BsTexture {
	w; h; t; gl;
	// Options none for now
	constructor(gl, url/*, options*/) {
		this.gl = gl;
		const texture = gl.createTexture();
		this.t = texture;
		gl.bindTexture(gl.TEXTURE_2D, texture);
	
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		this.w = width;
		const height = 1;
		this.h = height;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		// placeholder while image loads
		const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
		
		gl.texImage2D(
			gl.TEXTURE_2D,
			level,
			internalFormat,
			width,
			height,
			border,
			srcFormat,
			srcType,
			pixel,
		);
	
		const image = new Image();
		image.onload = () => {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(
				gl.TEXTURE_2D,
				level,
				internalFormat,
				srcFormat,
				srcType,
				image,
			);
			this.w = image.width;
			this.h = image.height;
	
			// WebGL1 has different requirements for power of 2 images
			// vs. non power of 2 images so check if the image is a
			// power of 2 in both dimensions.
			if (BsMath.isPowerOf2(image.width) && Math.isPowerOf2(image.height)) {
				// Yes, it's a power of 2. Generate mips.
				gl.generateMipmap(gl.TEXTURE_2D);	
			} else {
				// No, it's not a power of 2. Turn off mips and set
				// wrapping to clamp to edge
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}
		};
		image.src = url;
	}

	delete() {
		this.gl.deleteTexture(this.t);
		this.t = -1;
	}
}