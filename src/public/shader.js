// this is a shader program wrapper
export class XxShaderxX {
    vsSource;
    fsSource;
	gl;

	constructor(vsSource, fsSource, gl) {
		this.vsSource = vsSource;
		this.fsSource = fsSource;
		this.program = 0;
		this.gl = gl;
	}

	compileAll() {
		const vs = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.gl.shaderSource(vs, this.vsSource);
		this.gl.compileShader(vs);
		if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS)) {
			alert(
				`An error occurred compiling the visual shader: ${this.gl.getShaderInfoLog(vs)}`,
			);
			this.gl.deleteShader(vs);
			return 1;
		}

		const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.gl.shaderSource(fs, this.vsSource);
		this.gl.compileShader(fs);
		if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS)) {
			alert(
				`An error occurred compiling the visual shader: ${this.gl.getShaderInfoLog(fs)}`,
			);
			this.gl.deleteShader(fs);
			return 1;
		}

		this.program = this.gl.createProgram();
		this.gl.attachShader(this.program, vs);
		this.gl.attachShader(this.program, fs);
		this.gl.linkProgram(this.program);
		return 0;
	}

	async loadVsFromUrl(url) {
		this.vsSource = new TextDecoder()
		.decode(
			await 
				((await fetch(url))
				.body.getReader().read())
		);
	}

    async loadFsFromUrl(url) {
		this.fsSource = new TextDecoder()
		.decode(
			await 
				((await fetch(url))
				.body.getReader().read())
		);
    }

	async loadVsFromString(stig) {
		this.vsSource = stig;
	}

    async loadFsFromString(stig) {
        this.fsSource = stig;
    }
}