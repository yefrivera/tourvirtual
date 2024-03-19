import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera, controls;
let renderer;
let scene;
let sphere;
let raycaster; 
let buttonSalinas, buttonEntorno2, buttonEntorno3, buttonEntorno4;
let material; 

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

init();
animate();

function init() {
    scene = new THREE.Scene();

    const light = new THREE.PointLight(0xFFFFFF, 2);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); 

    const sphereGeometry = new THREE.SphereGeometry(1000, 64, 64);
    sphereGeometry.scale(-1, 1, 1); 
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('./textures/');
    const texture = textureLoader.load('salinas.jpg', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; 
    });
    material = new THREE.MeshBasicMaterial({ map: texture }); 

    sphere = new THREE.Mesh(sphereGeometry, material); 
    scene.add(sphere);

    //---------------- boton esférico 1--------------

    const button1 = new THREE.SphereGeometry(3, 32, 32); 
    const button1material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); 
    buttonSalinas = new THREE.Mesh(button1, button1material); 
    buttonSalinas.position.set(40, 2, -40); 
    scene.add(buttonSalinas);

    //--------------------boton esferico 2--------------------------------

    const button2 = new THREE.SphereGeometry(3, 32, 32); 
    const button2material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); 
    buttonEntorno2 = new THREE.Mesh(button2, button2material); 
    buttonEntorno2.position.set(20, 2, -40); 
    scene.add(buttonEntorno2);

    //----------------------boton esferico 3--------------------------------
    const button3 = new THREE.SphereGeometry(3, 32, 32); 
    const button3material = new THREE.MeshBasicMaterial({ color: 0x0000ff }); 
    buttonEntorno3 = new THREE.Mesh(button3, button3material); 
    buttonEntorno3.position.set(10, 2, -40); 
    scene.add(buttonEntorno3);

    //----------------------boton esferico 4--------------------------------
    const button4 = new THREE.SphereGeometry(3, 32, 32); 
    const button4material = new THREE.MeshBasicMaterial({ color: 0x006400 }); 
    buttonEntorno4 = new THREE.Mesh(button4, button4material); 
    buttonEntorno4.position.set(0, 2, -40); 
    scene.add(buttonEntorno4);

    //-------------------------------------

    raycaster = new THREE.Raycaster(); 
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
    renderer.domElement.addEventListener('wheel', onDocumentMouseWheel);
    renderer.domElement.addEventListener('click', onClick); 
}


function button() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('./textures/');
    const texture = textureLoader.load('salinas.jpg', function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace; 
        material.map = texture; 
        material.needsUpdate = true; 
    });
    //removeButtons();
    renderer.clear();
    renderer.render(scene, camera);



}

function button2() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('./textures/');
    const texture = textureLoader.load('entrada salinas.jpg', function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace; 
        material.map = texture; 
        material.needsUpdate = true; 

    });
    removeButtons();
    renderer.clear();
    renderer.render(scene, camera);


}

function button3() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('./textures/');
    const texture = textureLoader.load('invierno.jpg', function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace; 
        material.map = texture; 
        material.needsUpdate = true; 
    });
    removeButtons();
    renderer.clear();
    renderer.render(scene, camera);
}

function button4() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('./textures/');
    const texture = textureLoader.load('muelle.jpg', function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace; 
        material.map = texture; 
        material.needsUpdate = true; 
    });
    removeButtons();
    renderer.clear();
    renderer.render(scene, camera);
}

/*function removeButtons() {
    scene.remove(buttonSalinas);
    scene.remove(buttonEntorno2);
    scene.remove(buttonEntorno3);
    scene.remove(buttonEntorno4);
}*/


function onClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(buttonSalinas);
    const intersects2 = raycaster.intersectObject(buttonEntorno2);
    const intersects3 = raycaster.intersectObject(buttonEntorno3);
    const intersects4 = raycaster.intersectObject(buttonEntorno4);

    if (intersects.length > 0) {
        button();
    }
    if (intersects2.length > 0) {
        button2();
    }
    if (intersects3.length > 0) {
        button3();
    }
    if (intersects4.length > 0) {
        button4();
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
        render();
    });
}

function render() {
    renderer.render(scene, camera);
}