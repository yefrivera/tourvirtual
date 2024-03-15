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

    // Creamos una luz
    const light = new THREE.PointLight(0xFFFFFF, 2);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // Ajustamos la posición de la cámara para ver la esfera

    const sphereGeometry = new THREE.SphereGeometry(500, 64, 64);
    sphereGeometry.scale(-1, 1, 1); // Invertimos la esfera para que la textura se vea correctamente desde adentro

    const texture = new THREE.TextureLoader().load('./textures/salinas.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });

    sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Habilitamos la renderización en XR

    document.body.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

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

/*function TextureLoader(){
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}*/

function render() {
    // Si no estamos en modo VR, rotamos la esfera automáticamente
    /*if (!renderer.xr.isPresenting) {
        sphere.rotation.y += 0.005;
    }*/
    
    renderer.render(scene, camera);
}

