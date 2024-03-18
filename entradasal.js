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
    camera.position.set(-3, 0, 1); 

    const sphereGeometry = new THREE.SphereGeometry(300, 64, 64);
    sphereGeometry.scale(-1, 1, 1); 

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('./textures/');
    const texture = textureLoader.load('entrada salinas.jpg', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; 
    });

    const material = new THREE.MeshBasicMaterial({ map: texture });

    sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    // Creamos el botón esférico
    const sphereButtonGeometry = new THREE.SphereGeometry(2.5, 64, 64);
    const sphereButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.7 });
    sphereButton = new THREE.Mesh(sphereButtonGeometry, sphereButtonMaterial);
    sphereButton.position.set(40, 2, -40); // Ajustamos la posición del botón
    scene.add(sphereButton);

    // Creamos el efecto de borde animado (glow)
    const sphereButtonGlowGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sphereButtonGlowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0x0000ff) }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            varying vec3 vNormal;
            void main() {
                float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 3.0 );
                gl_FragColor = vec4( color, 1.0 ) * intensity;
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    sphereButtonGlow = new THREE.Mesh(sphereButtonGlowGeometry, sphereButtonGlowMaterial);
    sphereButtonGlow.position.copy(sphereButton.position);
    scene.add(sphereButtonGlow);


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
    // Calcula las coordenadas normalizadas del ratón (-1 a 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualiza el raycaster con la posición del ratón
    raycaster.setFromCamera(mouse, camera);

    // Comprueba si el rayo del ratón intersecta el botón esférico
    const intersects = raycaster.intersectObject(sphereButton);

    // Si hay una intersección, redirige a la página entradasal.js
    if (intersects.length > 0) {
        window.location.href = 'salinas.html';
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