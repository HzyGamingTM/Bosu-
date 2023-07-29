// Vertex Shader
const vsSource = `
precision mediump float;
attribute vec4 vpos;
varying vec2 uv;
attribute float alpha;
varying float alphaout;
uniform sampler2D uSampler;

void main() {
    gl_Position = vec4(vpos.xy, 0.0, 1.0);
    uv = vpos.zw;
    alphaout = alpha;
}
`;

// Fragment Shader
const fsSource = `
precision mediump float;
varying vec2 uv;
varying float alphaout;
uniform sampler2D uSampler;

void main() {
    gl_FragColor = texture2D(uSampler, vec2(uv.x, 1.0 - uv.y)) * alphaout;
}
`;

const canvas = document.querySelector("#glcanvas");
const gl = canvas.getContext("webgl");

let shaderProgram = null;
let funnytexture = null;
let circleTexture = null;
let vertexBuffer = null;
let alphaBuffer = null;
let vs_vpos_pos = null;
let vs_alpha_pos = null;


let hitObjects = [];

let textures = {
    approachcircle: null,
    hitcircle: null,
    hitcircleoverlay: null,
    ryan: null,
};

function main() {
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

    textures.ryan = loadTexture(gl, "Textures/IMG_0025.JPG");
    textures.hitcircle = loadTexture(gl, "Textures/hitcircle.png");
    textures.hitcircleoverlay = loadTexture(gl, "Textures/hitcircleoverlay.png");
    textures.approachcircle = loadTexture(gl, "Textures/approachcircle.png");
    shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    vs_vpos_pos = gl.getAttribLocation(shaderProgram, "vpos");
    vs_alpha_pos = gl.getAttribLocation(shaderProgram, "alpha");

    vertexBuffer = gl.createBuffer();
    alphaBuffer = gl.createBuffer();
}

let globalfloat = 0.0;
function render() {
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    let verts = [
        -0.75 + Math.sin(globalfloat)* 0.5, -0.75, 0.0, 0.0,
         0.75 + Math.sin(globalfloat)* 0.5, -0.75, 1.0, 0.0,
        -0.75 + Math.sin(globalfloat)* 0.5,  0.75, 0.0, 1.0,
        -0.75 + Math.sin(globalfloat)* 0.5,  0.75, 0.0, 1.0,
         0.75 + Math.sin(globalfloat)* 0.5,  0.75, 1.0, 1.0,
         0.75 + Math.sin(globalfloat)* 0.5, -0.75, 1.0, 0.0,
    ];
    let alpha = [
        0.5, 0.5, 0.5, 1.0, 1.0, 1.0,
    ];

    // globalfloat += 0.005;

    // Creates Vertex Buffer Object (PBO)
    // vetrte
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vs_vpos_pos, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vs_vpos_pos);

    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alpha), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vs_alpha_pos, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vs_alpha_pos);

    // textur
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.hitcircle);

    // shit
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);  

    // If creating the shader program failed, alert

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

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

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
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
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

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}


window.addEventListener(
    "keydown",
    (event) => {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }
  
      switch (event.key) {
        case "Z":

            break;
        case "X":
          
            break;

        case "C":

            break;
        default: return;
      }
  
      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    },
    true,
  );



main();