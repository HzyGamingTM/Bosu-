precision mediump float;
varying vec2 uv;
varying vec4 shade_out;

uniform sampler2D uSampler;

void main() {
    gl_FragColor = texture2D(uSampler, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor *= shade_out;
}