import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera, scene, renderer, controls;

init();
animate();

function init() {
    const container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
 
    scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(5, 60, 40);
    geometry.scale(-1, 1, 1);  // Invert the geometry on the x-axis so that all of the faces point inward

    const video = document.getElementById('video');
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    const vrButton = VRButton.createButton(renderer);
    vrButton.style.display = 'none';
    const vrMenuButton = document.getElementById('vr-btn');
    vrMenuButton.addEventListener('click', () => {
        vrButton.click();
    });

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.zoomSpeed = 0.3;
    controls.enablePan = false;
    controls.rotateSpeed = -0.3;
    camera.position.set(1.8, 1.2, 0.5);  // Set camera initial position

    window.addEventListener('resize', onWindowResize);

    // Sound activation prompt
    const muteBtn = document.getElementById('mute-btn');
    $(document).ready(function(){
        var answer = confirm("¿Desea activar el sonido?");
        if (answer) {
            video.muted = false;
        } else {
            video.muted = true;
            muteBtn.querySelector('img').src = muteBtn.querySelector('img').getAttribute('data-alt-src');
        }
        video.play();
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();  // Update OrbitControls
    renderer.render(scene, camera);
}
