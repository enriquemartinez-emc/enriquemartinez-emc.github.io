export const planetVertexShader = /* glsl */ `
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vPosition = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const planetFragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;

  float hash(vec3 point) {
    point = fract(point * 0.3183099 + vec3(0.1, 0.2, 0.3));
    point *= 17.0;
    return fract(point.x * point.y * point.z * (point.x + point.y + point.z));
  }

  float noise(vec3 point) {
    vec3 cell = floor(point);
    vec3 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(
        mix(hash(cell), hash(cell + vec3(1.0, 0.0, 0.0)), local.x),
        mix(hash(cell + vec3(0.0, 1.0, 0.0)), hash(cell + vec3(1.0, 1.0, 0.0)), local.x),
        local.y
      ),
      mix(
        mix(hash(cell + vec3(0.0, 0.0, 1.0)), hash(cell + vec3(1.0, 0.0, 1.0)), local.x),
        mix(hash(cell + vec3(0.0, 1.0, 1.0)), hash(cell + vec3(1.0, 1.0, 1.0)), local.x),
        local.y
      ),
      local.z
    );
  }

  float fbm(vec3 point) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 4; octave++) {
      value += amplitude * noise(point);
      point = point * 2.03 + vec3(7.1, 2.4, 4.8);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 point = vPosition * 2.6;
    float drift = uTime * 0.008;
    float continents = fbm(point + vec3(drift, 0.0, -drift));
    float detail = fbm(point * 4.2 + vec3(3.7, 1.3, 5.9));
    float elevation = continents * 0.8 + detail * 0.2;

    float seaLevel = 0.47;
    vec3 deepSea = vec3(0.02, 0.10, 0.17);
    vec3 shallows = vec3(0.05, 0.38, 0.42);
    vec3 sand = vec3(0.80, 0.52, 0.30);
    vec3 rust = vec3(0.50, 0.20, 0.17);
    vec3 peaks = vec3(0.72, 0.62, 0.82);

    vec3 sea = mix(deepSea, shallows, smoothstep(seaLevel - 0.14, seaLevel, elevation));
    vec3 land = mix(sand, rust, smoothstep(seaLevel, seaLevel + 0.22, elevation));
    land = mix(land, peaks, smoothstep(seaLevel + 0.2, seaLevel + 0.32, elevation));
    vec3 color = mix(sea, land, step(seaLevel, elevation));

    float shore = smoothstep(0.035, 0.0, abs(elevation - seaLevel));
    color += vec3(0.25, 0.9, 0.85) * shore * 0.35;

    float cap = smoothstep(0.8, 0.93, abs(vPosition.y) + (detail - 0.5) * 0.14);
    color = mix(color, vec3(0.86, 0.92, 0.96), cap);

    float light = 0.42 + 0.58 * max(dot(vNormal, normalize(vec3(-0.55, 0.65, 0.75))), 0.0);
    gl_FragColor = vec4(color * light, 1.0);
  }
`;

export const cloudFragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vPosition;

  float hash(vec3 point) {
    return fract(sin(dot(point, vec3(17.13, 41.71, 93.17))) * 43758.5453);
  }

  float noise(vec3 point) {
    vec3 cell = floor(point);
    vec3 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    float a = hash(cell);
    float b = hash(cell + vec3(1.0, 0.0, 0.0));
    float c = hash(cell + vec3(0.0, 1.0, 0.0));
    float d = hash(cell + vec3(1.0, 1.0, 0.0));
    float e = hash(cell + vec3(0.0, 0.0, 1.0));
    float f = hash(cell + vec3(1.0, 0.0, 1.0));
    float g = hash(cell + vec3(0.0, 1.0, 1.0));
    float h = hash(cell + vec3(1.0, 1.0, 1.0));
    return mix(mix(mix(a, b, local.x), mix(c, d, local.x), local.y), mix(mix(e, f, local.x), mix(g, h, local.x), local.y), local.z);
  }

  void main() {
    vec3 point = vPosition * 6.0 + vec3(uTime * 0.035, -uTime * 0.012, 0.0);
    float clouds = noise(point) * 0.62 + noise(point * 2.1) * 0.38;
    float density = smoothstep(0.54, 0.72, clouds);
    gl_FragColor = vec4(vec3(0.92, 0.96, 1.0), density * 0.22);
  }
`;

export const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDirection = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const atmosphereFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDirection)), 0.0), 3.2);
    gl_FragColor = vec4(0.32, 0.72, 1.0, rim * 0.72);
  }
`;

export const starVertexShader = /* glsl */ `
  uniform float uTravel;
  uniform float uScale;
  varying float vFade;

  void main() {
    vec3 point = position;
    point.z = mod(point.z + uTravel + 120.0, 140.0) - 120.0;
    vec4 viewPosition = modelViewMatrix * vec4(point, 1.0);
    gl_PointSize = 0.07 * uScale / -viewPosition.z;
    vFade = 1.0 - smoothstep(24.0, 96.0, -viewPosition.z);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

export const starFragmentShader = /* glsl */ `
  varying float vFade;

  void main() {
    gl_FragColor = vec4(0.737, 0.933, 0.965, 0.82 * vFade);
  }
`;
