import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';
import { Light } from 'three';

let camera, controls;
//let cameraL, cameraR;
let renderer;
let scene;
let sphere;

init();
animate();

function init() {

    scene = new THREE.Scene();

    const light = new THREE.AmbientLight(0xFFFFFF,3);
    
    scene.add(light);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 0.01;

    scene.add(camera);

    const sphereGeometry = new THREE.SphereGeometry(10, 60, 40);
    sphereGeometry.scale(1, 1, -1); 

    const texture = getTextureFromImage('./textures/salinas.jpg');

    const material = new THREE.MeshBasicMaterial({ map: texture });

    const sphere = new THREE.Mesh(sphereGeometry, material);

    const manager = new THREE.LoadingManager();

    const loader = new THREE.TextureLoader();

    loader.load(texture);

    scene.add(sphere);

    const container = document.getElementById('container');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    container.appendChild(renderer.domElement);
    //container.appendChild(renderer.domElement);
    
    document.body.appendChild(VRButton.createButton(renderer));
    
    //cameraL = new THREE.PerspectiveCamera(50, (window.innerWidth / window.innerHeight) / 2, 1, 10000);
    //cameraR = new THREE.PerspectiveCamera(50, (window.innerWidth / window.innerHeight) / 2, 1, 10000);

    //cameraL.position.set(-0.5, 0, 0);
    //cameraR.position.set(0.5, 0, 0);

    //sphereL.layers.enable(1);
    //scene.add(sphereL);
    
    /*const materialR = new THREE.MeshBasicMaterial({ map: texture });
    const sphereR = new THREE.Mesh(sphere2, materialR);
    sphereR.layers.enable(2);
    scene.add(sphereR);*/
   
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.rotateSpeed = -0.25;

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize);
}

function getTextureFromImage(imageUrl) {
    const texture = new THREE.TextureLoader().load(imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    sphere.material.map = texture;

    return texture;
}


function onWindowResize() {
    const aspect = (window.innerWidth / window.innerHeight);

    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    //cameraL.aspect = aspect / 2;
    //cameraL.updateProjectionMatrix();

    //cameraR.aspect = aspect / 2;
    //cameraR.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {

    // If we are not presenting move the camera a little so the effect is visible

    if ( renderer.xr.isPresenting === false ) {

        const time = clock.getElapsedTime();

        sphere.rotation.y += 0.001;
        sphere.position.x = Math.sin( time ) * 0.2;
        sphere.position.z = Math.cos( time ) * 0.2;

    }

    renderer.render( scene, camera );

}

function animate() {
    //requestAnimationFrame(animate);

    
    //controls.update();

    //renderer.render(scene, camera);

    renderer.setAnimationLoop(render);

    
    /*if (renderer.xr.isPresenting) {
        
        //cameraL.position.copy(camera.position).add(controls.eyeOffsetL);
        //cameraR.position.copy(camera.position).add(controls.eyeOffsetR);

        
        renderer.clear();
        renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
        //renderer.render(scene, cameraL);

        renderer.clearDepth(); 
        renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
        renderer.render(scene, cameraR);
        //

    }*/
    
}
function onDocumentMouseMove(event) {
    controls.mouseX = -(event.clientX - window.innerWidth / 2);
    controls.mouseY = -(event.clientY - window.innerHeight / 2);
}