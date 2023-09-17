import { BsHandler, BsElement } from "../element.js";
import { BsMath } from "./utils.js";

export class BsRenderer {
	activeHandler;
	gl;
	shader;
	vbo;
	cbo;

	hitcircles;

	constructor(shader, gl) {
		this.gl = gl;
		this.shader = shader;
		this.activeHandler = null;

		this.vbo = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, 4 * 4 * 30000, this.gl.DYNAMIC_DRAW);
		
		// Attribute Pointer Locations
		this.gl.vertexAttribPointer(
			this.shader.locations.attrib["vpos"], 4, 
			this.gl.FLOAT, false, 0, 0
		);
		this.gl.enableVertexAttribArray(this.shader.locatons.a["vpos"]);

		cbo = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, 4 * 4 * 30000, this.gl.DYNAMIC_DRAW);
		this.gl.vertexAttribPointer(
			this.shader.locations.a["shade"], 4, 
			this.gl.FLOAT, false, 0, 0
		);
		this.gl.enableVertexAttribArray(this.shader.locatons.a["shade"]);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 0);
	}

	render() {
		let elementShaderMap = this.activeHandler.elementShaderMap;
		
		for (kvp in elementShaderMap) {
			// Set shader texture
			let texture = kvp[0].texture;
			let elements = kvp[1];
			
			let verts = [];
			for (i = 0; i < elements.length; i++) {
					
			}

			this.gl.activeTexture(this.gl.TEXTURE0);
			this.gl.bindTexture(gl.TEXTURE_2D, texture);

			this.gl.uniform1i(this.shader.locations.u["uSampler"], 0);
			
			this.gl.useProgram(this.shader.program);
			this.gl.drawArrays(gl.TRIANGLES, 0, 6);
			
			// Unbinds Texture & Shader
			this.gl.bindTexture(gl.TEXTURE_2D, 0);
			this.gl.useProgram(0);
		}

		this.gl.deleteBuffer(vbo);
	}
}

export class BsTexture {
	width; height; texture; gl;
	// Options none for now
	constructor(gl, url/*, options*/) {
		this.gl = gl;
		const texture = gl.createTexture();
		this.texture = texture;
		gl.bindTexture(gl.TEXTURE_2D, texture);
	
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		this.width = width;
		const height = 1;
		this.height = height;
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
			this.width = image.width;
			this.height = image.height;
	
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
		this.gl.deleteTexture(this.texture);
		this.texture -1;
	}
}