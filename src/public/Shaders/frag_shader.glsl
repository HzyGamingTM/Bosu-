precision mediump float;
varying vec2 uv;
varying vec4 shade_out;

uniform sampler2D uSampler;
uniform sampler2D background;
uniform sampler2D approachCircle;

uniform sampler2D text1;
uniform sampler2D text2;
uniform sampler2D text3;
uniform sampler2D text4;
uniform sampler2D text5;
uniform sampler2D text6;
uniform sampler2D text7;
uniform sampler2D text8;
uniform sampler2D text9;
uniform sampler2D text0;


void main() {
    gl_FragColor = texture2D(uSampler, vec2(uv.x, 1.0 - uv.y));
    // gl_FragColor = texture2D(, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor *= shade_out;
}