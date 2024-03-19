import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera, controls;
let renderer;
let sphereButton, sphereButton2;
let sphere;
let scene;

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


init();
animate();

function init() {
    scene = new THREE.Scene();

    const light = new THREE.PointLight(0xFFFFFF, 2);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.8, 0, 1); 

    const sphereGeometry = new THREE.SphereGeometry(300, 64, 64);
    sphereGeometry.scale(-1, 1, 1); 

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('./textures/');
    const texture = textureLoader.load('salinas.jpg', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; 
    });

    const material = new THREE.MeshBasicMaterial({ map: texture });

    sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    // --------------------Boton esfera entrada salinas------------------------------------

    const textureLoader1 = new THREE.TextureLoader();
    textureLoader1.setPath('./textures/');
    const texture1 = textureLoader1.load('entrada salinas.jpg', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; 
    });
    const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
    const sphereButtonGeometry = new THREE.SphereGeometry(4, 128, 128);
    //const sphereButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x006400, transparent: true, opacity: 0.7 });
    sphereButton = new THREE.Mesh(sphereButtonGeometry, material1);
    sphereButton.position.set(-110, 15, -20); 
    scene.add(sphereButton);

    //--------------------------------------------------------------------------------
    // --------------------Boton esfera muelle------------------------------------

    const textureLoader2 = new THREE.TextureLoader();
    textureLoader2.setPath('./textures/');
    const texture2 = textureLoader2.load('muelle.jpg', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; 
    });
    const material2 = new THREE.MeshBasicMaterial({ map: texture2 });
    const sphereButtonGeometry2 = new THREE.SphereGeometry(4, 128, 128);
    //const sphereButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x006400, transparent: true, opacity: 0.7 });
    sphereButton2 = new THREE.Mesh(sphereButtonGeometry2, material2);
    sphereButton2.position.set(-20, 2, -40); 
    scene.add(sphereButton2);

    //--------------------------------------------------------------------------------

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
    renderer.domElement.addEventListener('click', onClickButton);
    renderer.domElement.addEventListener('wheel', onDocumentMouseWheel);


}

function onClickButton(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(sphereButton);
    const intersects2 = raycaster.intersectObject(sphereButton2);

    if (intersects.length > 0) {
        window.location.href = 'entradasal.html';
    }
    if (intersects2.length > 0) {
        window.location.href = 'muelle.html';
    }
}

function onDocumentMouseWheel(event) {
    event.preventDefault();
    if (event.deltaY < 0) {
        camera.zoom = Math.min(MAX_ZOOM, camera.zoom + 0.1);
    } else {
        camera.zoom = Math.max(MIN_ZOOM, camera.zoom - 0.1);
    }
    camera.updateProjectionMatrix();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(() => {
        render(scene); 
    });
}

function render(scene) {
    renderer.render(scene, camera);
}