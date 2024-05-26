const hamMenu = document.querySelector(".ham-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
hamMenu.classList.toggle("active");
offScreenMenu.classList.toggle("active");
});

//--------------------------------------

//-------------------------funciones del menú-----------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    var expandBtn = document.getElementById('expand-btn');
    var expandBtnImg = expandBtn.querySelector('img');
            
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

    

    //---------------------------------------------

    expandBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default behavior of the link
        var element = document.documentElement;

        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    });

    function enterFullscreen() {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    function handleFullscreenChange() {
        var isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

        if (isFullscreen) {
            expandBtnImg.src = expandBtnImg.getAttribute('data-alt-src');
        } else {
            expandBtnImg.src = expandBtnImg.getAttribute('data-original-src');
        }
    }

    


    document.querySelector('.share-x').addEventListener('click', function(event) {
        event.preventDefault(); 

    window.open('https://x.com/share?url=' + encodeURIComponent(window.location.href), 'Compartir en Twitter', 'width=600,height=400');
    });

    document.querySelector('.share-facebook').addEventListener('click', function(event) {
        event.preventDefault(); 

        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), 'Compartir en Facebook', 'width=600,height=400');
    });

});