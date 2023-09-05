import { Math } from "./utils.js";
import { XxShaderxX } from "./shader.js";

// Vertex Shader
const vsSource = `
precision mediump float;
attribute vec4 vpos;
varying vec2 uv;
attribute vec4 shade;
varying vec4 shade_out;
uniform sampler2D uSampler;

void main() {
    gl_Position = vec4(vpos.xy, 0.0, 1.0);
    uv = vpos.zw;
    shade_out = shade;
}
`;

// Fragment Shader
const fsSource = `
precision mediump float;
varying vec2 uv;
varying vec4 shade_out;
uniform sampler2D uSampler;

void main() {
    gl_FragColor = texture2D(uSampler, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor *= shade_out;
}
`;

const canvas = document.querySelector("#glcanvas");
const gl = canvas.getContext("webgl");

let shader;

let funnytexture = null;
let circleTexture = null;
let vertexBuffer = null;
let shadeBuffer = null;
let vs_vpos_pos = null;
let vs_shade_pos = null;

let resolution = [];
let hitObjects = [];

let textures = {
    approachcircle: null,
    hitcircle: null,
    hitcircleoverlay: null,
    ryan: null,
}

let circles = [{
    x: 5,
    y: 5,
    r: 23,
}, {
    x: 5,   
    y: 5,
    r: 13
}]

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

    shader = XxShaderxX(0, 0, gl);
    await shader.loadVsFromUrl("/Shaders/vertex_shader.glsl");
    await shader.loadFsFromUrl("/Shaders/frag_shader.glsl");
    shader.compileAll();   

    requestAnimationFrame(render);
}

function render() {
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);


    requestAnimationFrame(render);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
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

        // WebGL1 has different requirements for power of 2 images
        // vs. non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (Math.isPowerOf2(image.width) && Math.isPowerOf2(image.height)) {
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

    return texture;
}

main();