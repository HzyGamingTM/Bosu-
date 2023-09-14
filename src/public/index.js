import { BsMath } from "./utils.js";
import { BsShader, BsRenderer } from "./shader.js";
import { BsTexture } from "./render.js";

const canvas = document.querySelector("#glcanvas");
const gl = canvas.getContext("webgl");

let shader;
let cirle;
let resolution = [];

let handler;
let renderer;
let ryan;

async function main() {
	// Initialize the GL context
	// Only continue if WebGL is available and working
	if (gl === null) {
		console.error("No WebGL!");
		alert(
			"Unable to initialize WebGL. Your browser or machine may not support it.",
		);
		return;
	}

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

	resolution = [canvas.width, canvas.height];

	shader = new BsShader(0, 0, gl);
	await shader.loadVsFromUrl("/Shaders/vertex_shader.glsl");
	await shader.loadFsFromUrl("/Shaders/frag_shader.glsl");
	shader.compileAll();

	cirle = new BsTexture(gl, "/Textures/IMG_0025.JPG");
	renderer = new BsRenderer(gl);

	requestAnimationFrame(render);
}

function render() {
	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	let verts = [
	//     POS		   UV
		-1.0, -1.0,	0.0, 0.0,
		-1.0, 1.0,	0.0, 1.0,
		1.0, -1.0,	1.0, 0.0,

		1.0, -1.0,	1.0, 0.0,
		1.0, 1.0,	1.0, 1.0,
		-1.0, 1.0,	0.0, 1.0,
	];

	let colours = [
		1.0, 1.0, 1.0, 0.1,
		0.1, 1.0, 1.0, 1.0,
		1.0, 0.1, 1.0, 1.0,
		1.0, 0.1, 1.0, 1.0,
		1.0, 1.0, 0.1, 0.0,
		0.1, 1.0, 1.0, 1.0,
	]
	
	// Position buffer
	let vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(
		gl.ARRAY_BUFFER, new Float32Array(verts),
		gl.STATIC_DRAW, 0
	);

	let location = gl.getAttribLocation(shader.program, "vpos");
	gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(location);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// Colour buffer
	let cbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cbo);
	gl.bufferData(
		gl.ARRAY_BUFFER, new Float32Array(colours),
		gl.STATIC_DRAW, 0
	);

	location = gl.getAttribLocation(shader.program, "shade");
	gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(location);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// Uniforms
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, cirle.t);

	location = gl.getUniformLocation(shader.program, "uSampler");
	gl.uniform1i(location, 0);
	
	// Draw (?)
    gl.useProgram(shader.program);
	gl.drawArrays(gl.TRIANGLES, 0, 6);

	requestAnimationFrame(render);
}

main();