import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera, scene, renderer, controls, video, texture, mesh;

init();

function init() {
    const container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.25, 10);
    camera.position.set(0, 0, 0.1);  // Ajuste inicial de la cámara

    scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(5, 60, 40);
    geometry.scale(-1, 1, 1);  // Invertir la geometría en el eje x para que todas las caras apunten hacia adentro

    video = document.getElementById('video');
    texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    const vrButton = VRButton.createButton(renderer);
    vrButton.style.display = 'none';  // Ocultar el botón VR por defecto
    const vrMenuButton = document.getElementById('vr-btn');
    vrMenuButton.addEventListener('click', () => {
        vrButton.click();
    });
    container.appendChild(renderer.domElement);
    //container.appendChild(vrButton);
    controls = new OrbitControls(camera, renderer.domElement);
    window.addEventListener('resize', onWindowResize);
    
    video.play();

    controls.enableZoom = true;
    controls.zoomSpeed = 0.3;
    controls.enablePan = false;
    controls.rotateSpeed = -0.3;

    controls.target.set(0, 0, 0);  // Ajuste del objetivo inicial de los controles
    controls.update();

    // Escuchar el evento 'end' de la sesión XR para restablecer la posición de la cámara
    renderer.xr.addEventListener('sessionend', () => {
        camera.position.set(0, 0, 0.1);  // Restablecer la posición inicial de la cámara
    });

    const muteBtn = document.getElementById('mute-btn');
    video.muted = true;
    muteBtn.querySelector('img').src = muteBtn.querySelector('img').getAttribute('data-alt-src');
    video.play();
    renderer.setAnimationLoop(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}



function animate() {
    controls.update();  // Actualizar OrbitControls
    renderer.render(scene, camera);
}
