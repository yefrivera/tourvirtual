import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera, controls;
let renderer;
let sphereButton;
let sphereButtonGlow;
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
    camera.position.set(0.08, 0, 0.1); 

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

    //----------------------Boton esfera ----------------------

    const sphereButtonGeometry = new THREE.SphereGeometry(3, 128, 128);
    const sphereButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x006400, transparent: true, opacity: 0.7 });
    sphereButton = new THREE.Mesh(sphereButtonGeometry, sphereButtonMaterial);
    sphereButton.position.set(-50, 8, -10); 
    scene.add(sphereButton);

    //-------------------------------------------------------------------

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
    //clickableArea.addEventListener('click', onClickButton);


}

function onClickButton(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(sphereButton);

    if (intersects.length > 0) {
        // Agrega la clase para la transición de salida
        renderer.domElement.classList.add('fade-out');

        // Espera un breve momento para que se complete la transición
        setTimeout(() => {
            // Redirige a la nueva página
            window.location.href = 'entradasal.html';
        }, 200); // Ajusta el tiempo de espera (300ms en este ejemplo)
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
    renderer.render(scene, camera);
}