import { BsMath } from "./utils.js";
import { BsShader } from "./shader.js";
import { BsRenderer, BsTexture } from "./render.js";

const canvas = document.querySelector("#glcanvas");
const gl = canvas.getContext("webgl2");

canvas.style.width = document.body.parentNode.clientWidth + "px";
canvas.style.height = document.body.parentNode.clientHeight + "px";
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

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
	
	gl.viewport(0, 0, canvas.width, canvas.height);

	resolution = [canvas.width, canvas.height];

	shader = new BsShader(0, 0, gl);
	await shader.loadVsFromUrl("/Shaders/vertex_shader.glsl");
	await shader.loadFsFromUrl("/Shaders/frag_shader.glsl");
	shader.compileAll();

	/* // Test 1 - Demonstrate single image capability
	cirle = new BsTexture(gl, 0, 0);
	cirle.loadFromUrl("/Textures/hitcircle.png").then((value) => {
		// renderer = new BsRenderer(gl);
		requestAnimationFrame(render);
	});
	*/

	/* // Test 2 - Demonstrate single image with border capability
	let _cirle_img = new Image();
	_cirle_img.onload = () => {
		cirle = new BsTexture(gl, 
			_cirle_img.width + 50, 
			_cirle_img.height + 50
		);
		cirle.loadHTMLImage(_cirle_img, 25, 25);

		requestAnimationFrame(render);
	}
	_cirle_img.src = "/Textures/IMG_0025.JPG";
	*/

	// Test 3 - Generating a double image texture atlas
	{
		let images = [new Image(), new Image(), new Image(), new Image()];
		let _tmpblock_counter = 0;
		let _tmpblock_exit = () => {
			let width = 0;
			let height = 0;
			let x = 0;
			for (let i = 0; i < images.length; i++) {
				width += images[i].width + 2;
				let nheight = images[i].height + 2;
				if (nheight > height) height = nheight;
			}
			cirle = new BsTexture(gl, width, height);
			for (let i = 0; i < images.length; i++) {
				x++;
				cirle.loadHTMLImage(images[i], x, 1)
				x += images[i].width + 1;
			}
			requestAnimationFrame(render);
		};
		let _tmpblock_imgonload = () => {
			_tmpblock_counter++;
			if (_tmpblock_counter == 2)
				_tmpblock_exit();
		};
		let urls = ["/Textures/IMG_0025.jpg", "/Textures/hitcircle.png", "/Textures/IMG_0025.jpg", "/Textures/IMG_0025.jpg"];
		for (let i = 0; i < images.length; i++) {
			images[i].onload = _tmpblock_imgonload;
			images[i].src = urls[i];
		}
	}
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
	gl.bindTexture(gl.TEXTURE_2D, cirle.texture);

	location = gl.getUniformLocation(shader.program, "uSampler");
	gl.uniform1i(location, 0);
	
	// Draw (?)
    gl.useProgram(shader.program);
	gl.drawArrays(gl.TRIANGLES, 0, 6);

	requestAnimationFrame(render);
}

main();