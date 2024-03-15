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

    const light = new THREE.AmbientLight(0xFFFFFF, 3);
    scene.add(light);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 0.01;

    scene.add(camera);

    const sphereGeometry = new THREE.SphereGeometry(10, 60, 40);
    sphereGeometry.scale(1, 1, -1);

    const material = new THREE.MeshBasicMaterial();

    sphere = new THREE.Mesh(sphereGeometry, material);

    scene.add(sphere);

    const loader = new THREE.TextureLoader();
    loader.load('./textures/salinas.jpg', function (texture) {
        texture.encoding = THREE.sRGBEncoding;
        material.map = texture;
        render(); // Renderizar una vez que la textura se haya cargado
    });

    const container = document.getElementById('container');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    container.appendChild(renderer.domElement);
    container.appendChild(VRButton.createButton(renderer));

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.rotateSpeed = -0.25;

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const aspect = (window.innerWidth / window.innerHeight);

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    renderer.setAnimationLoop(render);
}
