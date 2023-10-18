import * as THREE from 'three';

export default function createSpotlight(props) {
  const spotlight = new THREE.SpotLight(
    props.color,
    props.intensity,
    props.distance,
    props.angle,
    props.penumbra,
    props.decay
  );
  spotlight.position.set(props.position.x, props.position.y, props.position.z);
  spotlight.target.position.set(props.target.x, props.target.y, props.target.z);
  spotlight.castShadow = true;

  // Optional tweaks
  // spotlight.shadow.mapSize.width = 1024;
  // spotlight.shadow.mapSize.height = 1024;
  // spotlight.shadow.bias = 0.0001;

  return spotlight;
}
