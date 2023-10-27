const gravity = -0.005;
const DEBUG = false;
const ambientLight = 1;
const playerStartLoc = { x: 12, y: 0.8, z: 6 };
const BASE_URL = process.env.NODE_ENV === 'production' ? '/MuseumScape' : '';

export { gravity, DEBUG, ambientLight, playerStartLoc, BASE_URL };
