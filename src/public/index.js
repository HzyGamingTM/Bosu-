const vsSource = `
attribute vec4 vpos;
varying vec4 vpos_2;
void main() {
    if (vpos.x > 0.0) {
        gl_Position = vpos;
    } else {
        gl_Position = vpos * -1.0;
    }
    vpos_2 = vpos;
}
`;

const fsSource = `
precision mediump float;
varying vec4 vpos_2;
void main() {
    gl_FragColor = vec4(vpos_2.xyz, 1.0);
}
`;

main();

function main() {
    const canvas = document.querySelector("#glcanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) {
        console.error("No WebGL");
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    let shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    let verts = [
        -0.25, -0.25,
        0.5, 0.5,
        0.5, 0,
    ]
    
    gl.lineWidth(30);

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)
    
    let vpos_pos = gl.getAttribLocation(shaderProgram, "vpos")
    gl.vertexAttribPointer(vpos_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vpos_pos);

    gl.useProgram(shaderProgram);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

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