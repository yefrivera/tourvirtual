import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';

let camera, controls;
let renderer;
let scene;

let isRightMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;

init();
animate();

function init() {
    const container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 0.01;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.rotateSpeed = -0.25;

    const texture = getTextureFromImage('textures/entrada salinas.jpg');

    const material = new THREE.MeshBasicMaterial({ map: texture });

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32); 
    sphereGeometry.scale(1, -1, 1); 
    const sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    window.addEventListener('resize', onWindowResize);

    document.addEventListener('mousedown', function(event) {
        if (event.button === 2) { 
            isRightMouseDown = true;
            prevMouseX = event.clientX;
            prevMouseY = event.clientY;
        }
    });

 
    document.addEventListener('mousemove', function(event) {
        if (isRightMouseDown) {
            const deltaX = event.clientX - prevMouseX;
            const deltaY = event.clientY - prevMouseY;

            const newFov = camera.fov + deltaY * 0.05; 

            
            const minFov = 20; 
            const maxFov = 120; 
            camera.fov = THREE.MathUtils.clamp(newFov, minFov, maxFov);

            camera.updateProjectionMatrix();

            prevMouseX = event.clientX;
            prevMouseY = event.clientY;
        }
    });


   
    document.addEventListener('mouseup', function(event) {
        if (event.button === 2) {
            isRightMouseDown = false;
        }
    });
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

function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    renderer.render(scene, camera);
}
