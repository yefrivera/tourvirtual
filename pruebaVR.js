import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/XRControllerModelFactory.js';

let camera, controls, scene, renderer;
let sphereButton, sphereButton2, sphereButton3, buttonInfo;
let controller1, controller2, controllerGrip1, controllerGrip2;

init();
animate();

function init() {
    // Crear escena
    scene = new THREE.Scene();
    
    // Configurar cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    
    // Configurar renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Ajuste para mejor resolución en pantallas de alta densidad de píxeles
    renderer.xr.enabled = true;
    document.getElementById('container').appendChild(renderer.domElement); // Añadir el renderizador al contenedor
    document.body.appendChild(VRButton.createButton(renderer));
    
    // Añadir controles de órbita
    controls = new OrbitControls(camera, renderer.domElement);
    
    // Añadir luz
    const light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.set(0.8, 0, 1);
    scene.add(light);
    
    // Añadir esfera con textura
    const sphereGeometry = new THREE.SphereGeometry(300, 64, 64);
    sphereGeometry.scale(-1, 1, 1); 

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('./textures');
    const texture = textureLoader.load('/centrocaldas.jpg', function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        console.log('Texture loaded');
    }, undefined, function (error) {
        console.error('An error happened', error);
    });
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    // Configurar controladores VR
    const controllerModelFactory = new XRControllerModelFactory();
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    scene.add(controller1);

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    window.addEventListener('resize', onWindowResize, false);
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

function onSelectStart(event) {
    const controller = event.target;
    const intersections = getIntersections(controller);
    if (intersections.length > 0) {
        const intersection = intersections[0];
        const object = intersection.object;
        object.scale.set(1.3, 1.3, 1.3);
        object.userData.isSelected = true;
    }
}

function onSelectEnd(event) {
    const controller = event.target;
    const intersections = getIntersections(controller);
    if (intersections.length > 0) {
        const intersection = intersections[0];
        const object = intersection.object;
        object.scale.set(1, 1, 1);
        object.userData.isSelected = false;
        // Add your object interaction logic here
        if (object.userData.id === 1) {
            window.location.href = 'entrada.html';
        } else if (object.userData.id === 2) {
            window.location.href = 'popayan.html';
        } else if (object.userData.id === 3) {
            window.location.href = 'lago.html';
        }
    }
}

function getIntersections(controller) {
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    return raycaster.intersectObjects([sphereButton, sphereButton2, sphereButton3, buttonInfo]);
}
