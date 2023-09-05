precision mediump float;
attribute vec4 vpos;
varying vec2 uv;
attribute vec4 shade;
varying vec4 shade_out;

void main() {
    gl_Position = vec4(vpos.xy, 0.0, 1.0);
    uv = vpos.zw;
    shade_out = shade;
}