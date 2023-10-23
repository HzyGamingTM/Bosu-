import { BsHandler, BsElement } from "../element.js";
import { BsMath } from "./utils.js";

export class BsRenderer {
	activeHandler;
	gl;
	shader;
	vbo;
	cbo;
	
	deltaTime;
	lastUpdate;

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
		let now = Date.now();
    	this.deltaTime = now - this.lastUpdate;
    	this.lastUpdate = now;

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
	constructor(gl, width, height) {
		this.gl = gl;
		this.texture = gl.createTexture();
		this.width = width;
		this.height = height;

		if (width == 0 || height == 0) return;

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texStorage2D(
			gl.TEXTURE_2D, 1, gl.RGBA8,
			width, height
		);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}

	async loadFromUrl(url) {
		let gl = this.gl;
		
		return new Promise((resolve, reject) => {
			let image = new Image();
			image.onload = () => {
				this.width = image.width;
				this.height = image.height;

				gl.bindTexture(gl.TEXTURE_2D, this.texture);
				gl.texImage2D(
					gl.TEXTURE_2D, 0, 
					gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
					image
				);
				gl.bindTexture(gl.TEXTURE_2D, null);
				resolve(this);
			}
			image.src = url;
		});
	}
		
	async loadUrl(url, x, y) {
		let gl = this.gl;

		return new Promise((resolve, reject) => {
			if (this.width == 0 || this.height == 0) {
				reject(new Error(
					"BsTexture::loadUrl: " +
					"Texture not initialised (width or height not specified)"
				));
			}

			let image = new Image();
			image.onload = () => {
				gl.bindTexture(gl.TEXTURE_2D, this.texture);
				gl.texSubImage2D(
					gl.TEXTURE_2D, 0, x, y,
					gl.RGBA, gl.UNSIGNED_BYTE,
					image 
				);
				gl.bindTexture(gl.TEXTURE_2D, null);
				resolve(this);
			}
			image.src = url;
		});
	}

	loadFromHTMLImage(image) {
		let gl = this.gl;

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(
			gl.TEXTURE_2D, 0,
			gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			image 
		);
		gl.bindTexture(gl.TEXTURE_2D, null);
		return this;
	}
	
	loadHTMLImage(image, x, y) {
		let gl = this.gl;

		if (this.width == 0 || this.height == 0) {
			return new Error(
				"BsTexture::loadUrl: " +
				"Texture not initialised (width or height not specified)"
			);
		}

		if (x == undefined) x = 0;
		if (y == undefined) y = 0;

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texSubImage2D(
			gl.TEXTURE_2D, 0, x, y,
			gl.RGBA, gl.UNSIGNED_BYTE,
			image 
		);
		gl.bindTexture(gl.TEXTURE_2D, null);
		return this;
	}
	/*
	constructor(gl, url, useronload) {
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
				// prob now
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

			// No, it's not a power of 2. Turn off mips and set
			// wrapping to clamp to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			useronload(this.texture, image);
		};
		image.src = url;
	}
	*/

	static defaultEmptyTexture(gl) {

	}

	delete() {
		this.gl.deleteTexture(this.texture);
		this.texture = -1;
	}
}

export class TextureAtlas {
	gl;
	subtextures;
	texture;
	width;
	height;
	status;

	// constants for the addSource function
	static URL = 0;
	static HTMLIMAGE = 1;
	

	// constants for status
	static INCOMPLETE = 0;
	static COMPILING = 1;
	static READY = 2;
	
	constructor(gl) {
		this.gl = gl;
		this.subtextures = new Map();
		this.texture = null;
		this.width = 0;
		this.height = 0;
		this.status = thi;
	}

	// x, y, width and height are in integer pixels
	addTexture(textureName, x, y, width, height) {
		let texture;
		
		let textureObject = {
			width: width,
			height: height,
			x: x,
			y: y,
			source: null,
			sourceType: -1,
		};

		if (x + width > this.width) this.width = x + width;
		if (y + height > this.height) this.height = y + height;

		this.subtextures.set(textureName, textureObject);
	}

	addSource(textureName, source, sourceType) {
		let textureObject = this.subtextures.get(textureName);
		textureObject.source = source;
		textureObject.sourceType = sourceType;
		this.subtextures.set(textureName, textureObject);
	}

	async compile() {
		if (this.width == 0 || this.height == 0) {
			return new Promise(
				(_, rej) => {
					rej("Width or height is 0; did you load any images?")
				}
			);
		}
		
		for (const [name, obj] of this) {

		}
		
		let sourceType = this.subtextures.sourceType;
		switch (sourceType) {
			case TextureAtlas.URL:
				
				break;
			case TextureAtlas.HTMLIMAGE:
				
				break;	
			default:
				console.err("Blud no type! 😡😡"); // lmao
				break;
		}

		this.status = this.READY;
	}

	delete() {
		this.texture.delete();
	}
}