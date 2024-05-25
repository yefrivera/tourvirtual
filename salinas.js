import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';

let camera, controls;
let renderer;
let sphereButton, sphereButton2,sphereButton3;
let buttonInfo;
let sphere;
let scene;
let clock;


const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


init();
animate();

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    const light = new THREE.PointLight(0xFFFFFF, 2);
    light.position.set(0, 0, 10);
    scene.add(light);

    //---------Creacion esfera entorno inicial----------------

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.8, 0, 1); 

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

    // --------------------Boton esfera entrada salinas------------------------------------

    const textureLoader1 = new THREE.TextureLoader();
    textureLoader1.setPath('./textures/');
    const texture1 = textureLoader1.load('entrada salinas.jpg', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; 
    });
    const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
    const sphereButtonGeometry = new THREE.SphereGeometry(4, 128, 128);
    sphereButton = new THREE.Mesh(sphereButtonGeometry, material1);
    //------------------------------------
    sphereButton.userData.id = 1;
    //-------------------------------
    sphereButton.position.set(-40, 15, -40); 
    scene.add(sphereButton);

    //--------------------------------------------------------------------------------
    // --------------------Boton esfera muelle------------------------------------

    const textureLoader2 = new THREE.TextureLoader();
    textureLoader2.setPath('./textures/');
    const texture2 = textureLoader2.load('muelle.jpg', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; 
    });
    const material2 = new THREE.MeshBasicMaterial({ map: texture2 });
    const sphereButtonGeometry2 = new THREE.SphereGeometry(4, 128, 128);
    sphereButton2 = new THREE.Mesh(sphereButtonGeometry2, material2);
    //------------------------------------------------
    sphereButton2.userData.id = 2;
    //------------------------------------
    sphereButton2.position.set(1, 20, -50); 
    scene.add(sphereButton2);

    //--------------------------------------------------------------------------------

    // --------------------Boton esfera lago------------------------------------

    const textureLoader3 = new THREE.TextureLoader();
    textureLoader3.setPath('./textures/');
    const texture3 = textureLoader3.load('lago.jpg', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; 
    });
    const material3 = new THREE.MeshBasicMaterial({ map: texture3 });
    const sphereButtonGeometry3 = new THREE.SphereGeometry(4, 128, 128);
    sphereButton3 = new THREE.Mesh(sphereButtonGeometry3, material3);
    //------------------------------------
    sphereButton3.userData.id = 3;
    //---------------------------------
    sphereButton3.position.set(1, 2, -50); 
    scene.add(sphereButton3);

    //-----------Creación de boton de + info--------------------------------------

    const textureLoader4 = new THREE.TextureLoader();
    textureLoader4.setPath('./textures/');
    const texture4 = textureLoader4.load('info4.png', function (texture) {
        texture.colorSpace= THREE.SRGBColorSpace; 
    });
    const material4 = new THREE.MeshBasicMaterial({map: texture4 });
    const buttonInfoGeometry = new THREE.CircleGeometry(2.5,128);
    buttonInfo = new THREE.Mesh(buttonInfoGeometry,material4);
    buttonInfo.position.set(-40,-9,-50);
    scene.add(buttonInfo);
    
    //----------------------------------------------------------------------

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
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove);

}


//-----Darle a las esferas la funcionalidad de botón---------------

function onClickButton(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(sphereButton);
    const intersects2 = raycaster.intersectObject(sphereButton2);
    const intersects3 = raycaster.intersectObject(sphereButton3);
    const intersects4 = raycaster.intersectObject(buttonInfo);

    if (intersects.length > 0) {
        window.location.href = 'entradasal.html';
    }
    if (intersects2.length > 0) {
        window.location.href = 'muelle.html';
    }
    if (intersects3.length > 0) {
        window.location.href = 'lago.html';
    }
    if (intersects4.length > 0) {

    //--------Video----------------------------------------------
    
    /*const modal = document.getElementById('myModal');
    modal.style.display = 'block';
    video.play();
    const closeSpan = document.getElementsByClassName('close')[0];
    closeSpan.onclick = () => {
        video.muted = true;
        modal.style.display = 'none';
    };*/

    
    const videoControls = document.createElement('div');
    videoControls.style.position = 'absolute';
    videoControls.style.bottom = '20px';
    videoControls.style.left = '20px';
    videoControls.style.zIndex = '999';

    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.onclick = () => {
        video.play();
        video.muted = false;
    };

    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pause';
    pauseButton.onclick = () => {
        video.pause();
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => {
        video.muted = true;
        document.body.removeChild(videoControls);
        scene.remove(videoMesh);
        video.muted = true;
    };

    videoControls.appendChild(playButton);
    videoControls.appendChild(pauseButton);
    videoControls.appendChild(closeButton);
    document.body.appendChild(videoControls);

    const video = document.createElement('video');
    video.src = './videos/cabaña1.mp4';
    video.crossOrigin = 'anonymous';
    video.loop = false;
    video.muted = false;
    

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const videoGeometry = new THREE.PlaneGeometry(40, 30);
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
    videoMesh.position.set(-25,15,-30);

    const rotationX = Math.PI / 10; 
    const rotationY = Math.PI / 4; 
    const rotationZ = Math.PI / -20; 

    video.addEventListener('ended', () => {
        document.body.removeChild(videoControls);
        scene.remove(videoMesh);
    });

    video.play();
    videoMesh.rotation.set(rotationX, rotationY, rotationZ);
    scene.add(videoMesh);

    //--------muted------------------------
    
    const muteBtn = document.getElementById('mute-btn');

    // Agregar un evento de clic al botón "muted" para controlar el estado de silencio del video y cambiar la imagen
    muteBtn.addEventListener('click', function() {
        if (video.muted) {
            video.muted = false;
            // Cambiar la imagen a "unmuted"
            muteBtn.querySelector('img').src = muteBtn.querySelector('img').getAttribute('data-original-src');
        } else {
            video.muted = true;
            // Cambiar la imagen a "muted"
            muteBtn.querySelector('img').src = muteBtn.querySelector('img').getAttribute('data-alt-src');
        }
    });

    }
}



//-------------ZOOM-------------------------------------------

function onDocumentMouseWheel(event) {
    event.preventDefault();
    if (event.deltaY < 0) {
        camera.zoom = Math.min(MAX_ZOOM, camera.zoom + 0.1);
    } else {
        camera.zoom = Math.max(MIN_ZOOM, camera.zoom - 0.1);
    }
    camera.updateProjectionMatrix();
}

//-------Funcion de que se expandan los botones al pasar el mouse----------------

function lerp(start, end, speed) {
    return start + (end - start) * speed;
}

function onDocumentMouseMove(event) {
    event.preventDefault();

    const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
    };

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([sphereButton, sphereButton2, sphereButton3,buttonInfo]);

    const speed = 0.2;

    if (intersects.length > 0) {
        intersects.forEach(intersect => {

            const button = intersect.object;
            button.scale.x = lerp(button.scale.x, 1.3, speed);
            button.scale.y = lerp(button.scale.y, 1.3, speed);
            button.scale.z = lerp(button.scale.z, 1.3, speed);
            const textOverlay = document.getElementById(`textOverlay${button.userData.id}`);
            if (textOverlay) {
                textOverlay.style.display = 'block';
            }
        });
        
    } else {
        sphereButton.scale.set(1, 1, 1);
        sphereButton2.scale.set(1, 1, 1);
        sphereButton3.scale.set(1, 1, 1);
        buttonInfo.scale.set(1, 1, 1);

        document.querySelectorAll('.text-overlay').forEach(textOverlay => {
            textOverlay.style.display = 'none';
        });
    }
}

//-----------Hacer que el texto sea dependiente de la posición de la esfera boton---------------------------------------------------

function updateTextPosition(object, textElement) {
    const vector = new THREE.Vector3();
    vector.setFromMatrixPosition(object.matrixWorld); 
    vector.project(camera); 

    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    const posX = vector.x * widthHalf + widthHalf;
    const posY = -(vector.y * heightHalf) + heightHalf - 50;

    textElement.style.left = posX + 'px';
    textElement.style.top = posY + 'px'; 
}

function updateTextPositions() {
    updateTextPosition(sphereButton, textOverlay1);
    updateTextPosition(sphereButton2, textOverlay2);
    updateTextPosition(sphereButton3, textOverlay3);
}

//-------------Funciones----------------------------------

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

let animationEnabled = true; 
document.addEventListener('click', () => {
    animationEnabled = !animationEnabled; // Cambiar el estado de la animación al hacer clic
});


// Función de renderizado
function render(scene) {
    renderer.render(scene, camera);
    updateTextPositions();

    // Rotación automática solo si no hay interacción del mouse
    if (renderer.xr.isPresenting === false && animationEnabled) {
        //const time = clock.getElapsedTime();
        camera.rotation.y += 0.0007;
        //camera.position.x += 0.001;
        //camera.position.z += 0.001;
    }
}



