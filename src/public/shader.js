// this is a shader program wrapper
export class BsShader {
    vsSource;
    fsSource;
	program;
	locations;
	gl;

	constructor(vsSource, fsSource, gl) {
		this.vsSource = vsSource;
		this.fsSource = fsSource;
		this.locations = {
			attrib: {},
			unifom: {},
		};
		this.program = 0;
		this.gl = gl;
	}

	registerUniform(name) {
		this.locations.unifom[name] = this.gl.getUniformLocation(this.program, name);
	}

	registerAttrib(name) {
		this.locations.attrib[name] = this.gl.getAttribLocation(this.program, name);
	}

	compileAll() {
		const vs = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.gl.shaderSource(vs, this.vsSource);
		this.gl.compileShader(vs);
		if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS)) {
			alert(
				`An error occurred compiling the vertex shader: ${this.gl.getShaderInfoLog(vs)}`,
			);
			console.error(this.gl.getShaderInfoLog(vs));

			this.gl.deleteShader(vs);
			return 1;
		}

		const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.gl.shaderSource(fs, this.fsSource);
		this.gl.compileShader(fs);
		if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS)) {
			alert(
				`An error occurred compiling the fragment shader: ${this.gl.getShaderInfoLog(fs)}`,
			);
			console.error(this.gl.getShaderInfoLog(fs));
			
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
		return new Promise((resolve, reject) => {
			fetch(url).then((response) => {
				response.body.getReader().read().then((raw) => {
					this.vsSource = new TextDecoder().decode(raw.value);
					resolve(0);
				}, (err) => {
					console.error(err);
					reject(err);
				});
			}, (err) => {
				console.error(err);
				reject(err);
			});
		});
	}

    async loadFsFromUrl(url) {
		return new Promise((resolve, reject) => {
			fetch(url).then((response) => {
				response.body.getReader().read().then((raw) => {
					this.fsSource = new TextDecoder().decode(raw.value);
					resolve(0);
				}, (err) => {
					console.error(err);
					reject(err);
				});
			}, (err) => {
				console.error(err);
				reject(err);
			});
		});
    }

	async loadVsFromString(stig) {
		this.vsSource = stig;
	}	

    async loadFsFromString(stig) {
        this.fsSource = stig;
    }

	destroy() {
		this.gl.useProgram(null);
		if (this.program)
			this.gl.deleteProgram(program);
	}
}