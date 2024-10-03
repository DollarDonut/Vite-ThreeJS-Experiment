import './style.css';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const geometry1 = new THREE.CapsuleGeometry(3.5, 5, 17, 95);
const geometry2 = new THREE.IcosahedronGeometry(4, 10, 23, 95);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347, wireframe: true });
const material1 = new THREE.MeshStandardMaterial({ color: 0xF8DE22, wireframe: false });
const material2 = new THREE.MeshStandardMaterial({ color: 0xD67BFF, wireframe: true });

const torus = new THREE.Mesh(geometry, material);
const CapsuleGeometry = new THREE.Mesh(geometry1, material1);
const IcosahedronGeometry = new THREE.Mesh(geometry2, material2);
const IcosahedronGeometry2 = new THREE.Mesh(geometry2, material2);

scene.add(torus, CapsuleGeometry, IcosahedronGeometry, IcosahedronGeometry2);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridhelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridhelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 100; // Set the maximum distance the camera can zoom out
controls.minDistance = 10; // Set the minimum distance the camera can zoom in

// Declare the stars array
const stars = []; // Step 1: Create an array to hold the stars

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);
    stars.push(star); // Step 2: Add the star to the stars array
}

function animateStars() {
    stars.forEach(star => {
        // Twinkling effect by changing opacity
        star.material.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + star.position.x + star.position.y + star.position.z);
        star.material.transparent = true; // Ensure transparency is enabled
        
        // Move the star slightly in the y-direction
        star.position.y += 0.01 * (Math.sin(Date.now() * 0.001 + star.position.x) + 1); // Adjust the value for speed
        // Optional: Wrap the stars back down if they go too high
        if (star.position.y > 50) {
            star.position.y = -50;
        }
    });
}

Array(200).fill().forEach(addStar); // Create 200 stars

function animate() {
    requestAnimationFrame(animate);

    animateStars();

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    CapsuleGeometry.rotation.x += 0.03;
    CapsuleGeometry.rotation.z += 0.05;

    IcosahedronGeometry.rotation.x += 0.002;
    IcosahedronGeometry.rotation.y += 0.006;

    controls.update();

    renderer.render(scene, camera);
}

const fbxLoader = new FBXLoader();
fbxLoader.load(
    'ToyBlock.fbx',
    (object) => {
        scene.add(object);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
);

animate();

console.log("Het Werkt");
