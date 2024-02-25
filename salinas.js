import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';

let camera, renderer, scene;
let sphere;

init();
animate();

function init() {
    const container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);

    const texture = getTextureFromImage('textures/salinas - copia.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    sphereGeometry.scale(-1, 1, 1);
    sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    //

    window.addEventListener('resize', onWindowResize);

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', onDeviceOrientationChange);
    } else {
        console.error('DeviceOrientationEvent is not supported');
    }
}

function getTextureFromImage(imageUrl) {
    const texture = new THREE.TextureLoader().load(imageUrl);
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;

    return texture;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDeviceOrientationChange(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    const alphaRad = (alpha * Math.PI) / 180;
    const betaRad = (beta * Math.PI) / 180;
    const gammaRad = (gamma * Math.PI) / 180;

    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationFromEuler(new THREE.Euler(betaRad, alphaRad, -gammaRad, 'XYZ'));

    sphere.quaternion.setFromRotationMatrix(rotationMatrix);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    renderer.render(scene, camera);
}
