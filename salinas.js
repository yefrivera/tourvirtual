import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera;
let renderer;
let scene;

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    document.body.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.layers.enable(1);

    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    sphereGeometry.scale(1, -1, 1); // Invertir la geometría para que el usuario esté dentro de la esfera

    const texture = getTextureFromImage('./textures/salinas - copia.jpg');

    const material = new THREE.MeshBasicMaterial({ map: texture });


    const skySphere = new THREE.Mesh(sphereGeometry, material);
    skySphere.layers.set(1);
    scene.add(skySphere);

    window.addEventListener('resize', onWindowResize);
}

function getTextureFromImage(imageUrl) {
    const texture = new THREE.Texture();

    const loader = new THREE.ImageLoader();
    loader.load(imageUrl, function (imageObj) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = imageObj.height;
        canvas.width = imageObj.width;
        context.drawImage(imageObj, 0, 0);
        texture.image = canvas;
        texture.needsUpdate = true;
    });

    return texture;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    renderer.render(scene, camera);
}
