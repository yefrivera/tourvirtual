import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';


let camera, scene, renderer;
let controls;

let isUserInteracting = false,
    lon = 0, lat = 0,
    phi = 0, theta = 0,
    onPointerDownPointerX = 0,
    onPointerDownPointerY = 0,
    onPointerDownLon = 0,
    onPointerDownLat = 0;

const distance = .5;

init();
animate();

function init() {

    const container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .25, 10 );

    scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry( 5, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale( - 1, 1, 1 );

    const video = document.getElementById( 'video' );
    video.play();

    const texture = new THREE.VideoTexture( video );
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial( { map: texture } );

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    //----------------------------------------------

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    const vrButton = VRButton.createButton(renderer);
    vrButton.style.display = 'none';
    const vrMenuButton = document.getElementById('vr-btn');
    vrMenuButton.addEventListener('click', () => {
        vrButton.click();
    });
    container.appendChild( renderer.domElement );
    controls = new OrbitControls(camera, renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    //---------------------------------------------------

    document.addEventListener( 'pointerdown', onPointerDown );
    document.addEventListener( 'pointermove', onPointerMove );
    document.addEventListener( 'pointerup', onPointerUp );

    //

    //window.addEventListener( 'resize', onWindowResize );

}
const muteBtn = document.getElementById('mute-btn');
//------------activar sonido-----
$(document).ready(function(){
    var answer = confirm("¿Desea activar el sonido?");
    var video = document.getElementById('video');
    
    if (answer) {
        // Si el usuario desea activar el sonido, desmutea el video
        video.muted = false;
        
    } else {
        // Si el usuario no desea activar el sonido, mantiene el video silenciado
        video.muted = true;
        muteBtn.querySelector('img').src = muteBtn.querySelector('img').getAttribute('data-alt-src');
    }
    video.play();
});


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPointerDown( event ) {

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

}

function onPointerMove( event ) {

    if ( isUserInteracting === true ) {

        lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
        lat = ( onPointerDownPointerY - event.clientY ) * 0.1 + onPointerDownLat;

    }

}

function onPointerUp() {

    isUserInteracting = false;

}

function animate() {

    requestAnimationFrame( animate );
    update();

}

function update() {

    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.MathUtils.degToRad( 90 - lat );
    theta = THREE.MathUtils.degToRad( lon );

    camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = distance * Math.cos( phi );
    camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( 0, 0, 0 );

    renderer.render( scene, camera );

}