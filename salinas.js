import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera;
let renderer;
let scene;

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    document.body.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.layers.enable(1);

    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    sphereGeometry.scale(-1, 1, 1); // Invertir la geometría para que el usuario esté dentro de la esfera

    const textures = getTexturesFromAtlasFile('textures/salinas.jpg', 12);

    const materials = [];

    for (let i = 0; i < 6; i++) {
        materials.push(new THREE.MeshBasicMaterial({ map: textures[i] }));
    }

    const skySphere = new THREE.Mesh(sphereGeometry, materials);
    skySphere.layers.set(1);
    scene.add(skySphere);

    window.addEventListener('resize', onWindowResize);
}

function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
    const textures = [];

    for (let i = 0; i < tilesNum; i++) {
        textures[i] = new THREE.Texture();
    }

    const loader = new THREE.ImageLoader();
    loader.load(atlasImgUrl, function (imageObj) {
        let canvas, context;
        const tileWidth = imageObj.height;

        for (let i = 0; i < textures.length; i++) {
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');
            canvas.height = tileWidth;
            canvas.width = tileWidth;
            context.drawImage(imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
            textures[i].colorSpace = THREE.SRGBColorSpace;
            textures[i].image = canvas;
            textures[i].needsUpdate = true;
        }
    });

    return textures;
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
