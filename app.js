import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

// Add scene and camera

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

// Model loading

let butterfly;
let mixer;
const loader = new GLTFLoader();
loader.load(
  "./ulysses_butterfly.glb",
  function (gltf) {
    butterfly = gltf.scene;
    scene.add(butterfly);
    // butterfly.position.y = -0.3;
    // butterfly.rotation.y = -2;
    // butterfly.rotation.x = 0.4;

    mixer = new THREE.AnimationMixer(butterfly);
    mixer.clipAction(gltf.animations[0]).play();
    console.log(gltf.animations);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error occurred: ", error);
  }
);

// Light

const ambient = new THREE.AmbientLight(0xfffff, 1.3);
const directionalLight = new THREE.DirectionalLight(0xfffff, 3);
directionalLight.position.set(500, 500, 500);

scene.add(ambient);
scene.add(directionalLight);

// Render

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById("container3D").appendChild(renderer.domElement);

// Resize

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(0.015);
  }
}
animate();

let arrPositionModel = [
  {
    id: "banner",
    position: { x: 0, y: -0.7, z: 0 },
    rotation: { x: 0.4, y: -2, z: 0 },
  },
  {
    id: "intro",
    position: { x: 4.5, y: -1, z: -3 },
    rotation: { x: -1.3, y: -5, z: 2 },
  },
  {
    id: "description",
    position: { x: -2.5, y: -1, z: -3 },
    rotation: { x: 0, y: -0.5, z: 0 },
  },
  {
    id: "contact",
    position: { x: 0.8, y: -1, z: 0 },
    rotation: { x: 0.3, y: 0.5, z: 0 },
  },
];
const modelMove = () => {
  const sections = document.querySelectorAll(".section");
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });
  let position_active = arrPositionModel.findIndex(
    (val) => val.id == currentSection
  );
  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    gsap.to(butterfly.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out",
    });
    gsap.to(butterfly.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 3,
      ease: "power1.out",
    });
  }
};
window.addEventListener("scroll", () => {
  if (butterfly) {
    modelMove();
  }
});
