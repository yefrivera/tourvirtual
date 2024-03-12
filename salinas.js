import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js'; 
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera, controls;
let cameraL, cameraR;
let renderer;
let scene;

init();
animate();

function init() {
    const container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Enable VR
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));

    scene = new THREE.Scene();

    // Cameras for left and right eyes
    cameraL = new THREE.PerspectiveCamera(70, window.innerWidth / 2 / window.innerHeight, 1, 10000);
    cameraR = new THREE.PerspectiveCamera(70, window.innerWidth / 2 / window.innerHeight, 1, 10000);

    // Position cameras for stereo view
    cameraL.position.set(-0.5, 0, 0);
    cameraR.position.set(0.5, 0, 0);

    const texture = getTextureFromImage('./textures/salinas.jpg');

    const material = new THREE.MeshBasicMaterial({ map: texture });

    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    sphereGeometry.scale(-1, 1, 1); // Invert the sphere to correctly display the texture

    // Create sphere for left eye
    const sphereL = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphereL);

    // Create sphere for right eye
    const sphereR = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphereR);

    // Set layers for stereo rendering
    sphereL.layers.enable(1);
    sphereR.layers.enable(2);

    // Orbit controls for non-VR mode
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 0.01;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    window.addEventListener('resize', onWindowResize);
}

function getTextureFromImage(imageUrl) {
    const texture = new THREE.TextureLoader().load(imageUrl);
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false; // Depending on your texture orientation, you might need to adjust this

    return texture;
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    cameraL.aspect = aspect / 2;
    cameraL.updateProjectionMatrix();

    cameraR.aspect = aspect / 2;
    cameraR.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Render for non-VR mode
    renderer.render(scene, camera);

    // Render for VR mode
    if (renderer.xr.isPresenting) {
        renderer.clear();
        renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
        renderer.render(scene, cameraL);
        renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
        renderer.render(scene, cameraR);
    }
}

