import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "node_modules/@react-three/fiber/dist/events-b389eeca.esm.js",
  "node_modules/@react-three/fiber/dist/events-f19bcc32.cjs.dev.js",
  "node_modules/@react-three/fiber/dist/events-583399dd.cjs.prod.js",
];

const helper = `
function createThreeTimerClock(THREE) {
  const timer = new THREE.Timer();
  let running = true;
  let elapsedTime = 0;
  return {
    autoStart: true,
    running,
    oldTime: 0,
    start() {
      running = true;
      this.running = true;
      timer.reset();
    },
    stop() {
      running = false;
      this.running = false;
    },
    getElapsedTime() {
      return elapsedTime;
    },
    getDelta() {
      if (!running) return 0;
      timer.update();
      this.oldTime = elapsedTime;
      elapsedTime += timer.getDelta();
      return timer.getDelta();
    },
    get elapsedTime() {
      return elapsedTime;
    },
    set elapsedTime(value) {
      elapsedTime = value;
    },
  };
}
`;

for (const file of files) {
  const path = join(root, file);
  if (!existsSync(path)) continue;

  let source = readFileSync(path, "utf8");

  if (!source.includes("function createThreeTimerClock")) {
    source = source.replace("const createStore = (invalidate, advance) => {", `${helper}\nconst createStore = (invalidate, advance) => {`);
  }

  source = source
    .replaceAll("clock: new THREE.Clock(),", "clock: createThreeTimerClock(THREE),")
    .replaceAll("clock: new THREE__namespace.Clock(),", "clock: createThreeTimerClock(THREE__namespace),");

  writeFileSync(path, source);
}
