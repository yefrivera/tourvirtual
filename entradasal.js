import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera, controls;
let renderer;
let scene;
let sphere;

init();
animate();

function init() {
    scene = new THREE.Scene();

    const light = new THREE.PointLight(0xFFFFFF, 2);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); 

    const sphereGeometry = new THREE.SphereGeometry(300, 64, 64);
    sphereGeometry.scale(-1, 1, 1); 

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('./textures/');
    const texture = textureLoader.load('entrada salinas.jpg', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; // Aplicar el espacio de color sRGB a la textura
    });

    const material = new THREE.MeshBasicMaterial({ map: texture });

    sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableZoom = true; 
    controls.zoomSpeed = 0.3; 
    controls.enablePan = false;
    controls.rotateSpeed = -0.3;

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(() => {
        render();
    });
}

function render() {

    renderer.render(scene, camera);
}