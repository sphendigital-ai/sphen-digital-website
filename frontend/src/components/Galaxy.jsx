import { useEffect, useRef, useState } from "react";

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0., 1.); }
`;

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;

float hash21(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3. - 2. * f);
    float a = hash21(i), b = hash21(i + vec2(1., 0.));
    float c = hash21(i + vec2(0., 1.)), d = hash21(i + vec2(1., 1.));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
    float v = 0., a = .5;
    for(int i = 0; i < 3; i++){
        v += a * noise(p);
        p = p * 2.03 + vec2(1.7, 9.2);
        a *= .5;
    }
    return v;
}
float stars(vec2 uv, float scale, float t){
    vec2 p = uv * scale;
    vec2 id = floor(p);
    vec2 gv = fract(p) - .5;
    float h = hash21(id);
    vec2 offs = vec2(hash21(id + 7.1), hash21(id + 3.7)) - .5;
    float d = length(gv - offs * .8);
    float tw = .55 + .45 * sin(t * (1. + h * 3.) + h * 40.);
    float s = smoothstep(.07 + h * .05, 0., d);
    return s * step(.8, h) * tw;
}
void main(){
    vec2 uv = (gl_FragCoord.xy - .5 * u_res) / u_res.y;
    vec2 m = (u_mouse - .5 * u_res) / u_res.y;
    vec2 dm = uv - m;
    float md = length(dm) + 1e-4;
    uv -= (dm / md) * 0.028 * exp(-md * 3.5);

    float t = u_time * 0.018;
    float ang = u_time * 0.004;
    mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
    vec2 ruv = rot * uv;

    vec3 col = vec3(0.0196, 0.0196, 0.0392);
    float n1 = fbm(ruv * 1.6 + vec2(t, -t * .6));
    float n2 = fbm(ruv * 2.3 + vec2(-t * .8, t * .5) + 4.7);
    float n3 = fbm(ruv * 1.15 + vec2(t * .4, t * .9) + 9.3);
    col += vec3(0.427, 0.231, 1.0) * n1 * n1 * 0.5;
    col += vec3(0.239, 0.486, 1.0) * n2 * n2 * 0.32;
    col += vec3(1.0, 0.541, 0.239) * pow(n3, 3.0) * 0.45;

    col += vec3(1.0) * stars(ruv + t * .02, 18., u_time) * .8;
    col += vec3(.88, .88, 1.) * stars(ruv - t * .015, 34., u_time) * .55;
    col += vec3(1., .95, .88) * stars(ruv + vec2(t * .01, 0.), 58., u_time) * .4;

    float sn = exp(-length(uv - vec2(.62, .34)) * 3.2) * (0.5 + 0.5 * sin(u_time * .28));
    col += vec3(.55, .4, 1.) * sn * .1;
    float sn2 = exp(-length(uv + vec2(.7, .3)) * 4.0) * (0.5 + 0.5 * sin(u_time * .2 + 2.));
    col += vec3(1., .6, .35) * sn2 * .07;

    col *= 1.0 - dot(uv, uv) * .5;
    gl_FragColor = vec4(max(col, 0.) * .9, 1.);
}
`;

export const Galaxy = () => {
    const canvasRef = useRef(null);
    const [glFailed, setGlFailed] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
        if (!gl) {
            setGlFailed(true);
            return;
        }

        const compile = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(s));
                return null;
            }
            return s;
        };
        const vs = compile(gl.VERTEX_SHADER, VERT);
        const fs = compile(gl.FRAGMENT_SHADER, FRAG);
        if (!vs || !fs) {
            setGlFailed(true);
            return;
        }
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(prog, "u_time");
        const uRes = gl.getUniformLocation(prog, "u_res");
        const uMouse = gl.getUniformLocation(prog, "u_mouse");

        let mx = -9999, my = -9999, tx = -9999, ty = -9999;
        const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
        window.addEventListener("mousemove", onMove, { passive: true });

        const SCALE = 0.6;
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * SCALE;
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener("resize", resize);

        let raf;
        let frame = 0;
        const start = performance.now();
        const render = () => {
            raf = requestAnimationFrame(render);
            frame++;
            if (document.hidden || frame % 2 !== 0) return;
            mx += (tx - mx) * 0.06;
            my += (ty - my) * 0.06;
            const dprX = canvas.width / window.innerWidth;
            const dprY = canvas.height / window.innerHeight;
            gl.uniform1f(uTime, (performance.now() - start) / 1000);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform2f(uMouse, mx * dprX, canvas.height - my * dprY);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        raf = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div data-testid="galaxy-background" className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            {glFailed &&
                Array.from({ length: 80 }, (_, i) => (
                    <span
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${(i * 37.7) % 100}%`,
                            top: `${(i * 53.3) % 100}%`,
                            width: 1 + (i % 3) * 0.7,
                            height: 1 + (i % 3) * 0.7,
                            animation: `twinkle ${2.5 + (i % 5)}s ease-in-out ${(i % 9) * 0.7}s infinite`,
                        }}
                    />
                ))}
            {[0, 1, 2].map((i) => (
                <span
                    key={`meteor-${i}`}
                    className="absolute h-[2px] w-28 rounded-full bg-gradient-to-l from-white via-sphen-purple to-transparent animate-meteor"
                    style={{ top: `${8 + i * 22}%`, right: `-${6 + i * 4}%`, animationDelay: `${3 + i * 5.5}s`, opacity: 0 }}
                />
            ))}
        </div>
    );
};
