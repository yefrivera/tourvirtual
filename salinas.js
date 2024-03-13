import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera, controls;
let cameraL, cameraR;
let renderer;
let scene;

init();
animate();

function init() {

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    const container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    document.body.appendChild(renderer.domElement);
    
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.setReferenceSpaceType('local');

    scene = new THREE.Scene();

    cameraL = new THREE.PerspectiveCamera(50, (window.innerWidth / window.innerHeight) / 2, 1, 10000);
    cameraR = new THREE.PerspectiveCamera(50, (window.innerWidth / window.innerHeight) / 2, 1, 10000);

    cameraL.position.set(-0.5, 0, 0);
    cameraR.position.set(0.5, 0, 0);

    const texture = getTextureFromImage('./textures/salinas.jpg');

    const material = new THREE.MeshBasicMaterial({ map: texture });

    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    sphereGeometry.scale(1, 1, -1); 
//-----------------------------------------------------------------------------------------------------------------------
    
    const sphereL = new THREE.Mesh(sphereGeometry, material);
    sphereL.layers.enable(1);
    scene.add(sphereL);
    //window.addEventListener('resize', onWindowResize);

    
    const materialR = new THREE.MeshBasicMaterial({ map: texture });
    const sphereR = new THREE.Mesh(sphereGeometry, materialR);
    sphereR.layers.enable(2);
    scene.add(sphereR);
    //window.addEventListener('resize', onWindowResize);
    
    
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 0.01;
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.rotateSpeed = -0.25;


    window.addEventListener('resize', onWindowResize);
}

function getTextureFromImage(imageUrl) {
    const texture = new THREE.TextureLoader().load(imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    //texture.flipY = false; // Depending on your texture orientation, you might need to adjust this

    return texture;
}


function onWindowResize() {
    const aspect = (window.innerWidth / window.innerHeight);

    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    cameraL.aspect = aspect / 2;
    cameraL.updateProjectionMatrix();

    cameraR.aspect = aspect / 2;
    cameraR.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    

    // Render for non-VR mode
    renderer.render(scene, camera);

    // Render for VR mode
    if (renderer.xr.isPresenting) {
        // Update VR cameras
        cameraL.position.copy(camera.position).add(controls.eyeOffsetL);
        cameraR.position.copy(camera.position).add(controls.eyeOffsetR);

        // Clear and render left eye
        renderer.clear();
        renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
        renderer.render(scene, cameraL);

        // Clear and render right eye
        renderer.clearDepth(); // Clear depth buffer to prevent depth overlap
        renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
        renderer.render(scene, cameraR);
        //

    }
    
}
function onDocumentMouseMove(event) {
    controls.mouseX = -(event.clientX - window.innerWidth / 2);
    controls.mouseY = -(event.clientY - window.innerHeight / 2);
}