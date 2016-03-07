/**
 * Created by fewieden on 06.03.16.
 *
 * After DOM is loaded
 */
document.addEventListener("DOMContentLoaded", function() {
    /**
     * Sound System
     */
    var sfxHub, audioElems, sounds, isPlaying = false;
    sfxHub = document.getElementById('sfxHub').children;
    audioElems = document.getElementById('audioWrapper').children;

    /**
     * Bidirectional server connection
     */
    var socket = io.connect('http://localhost:3000');
    socket.on('init-sounds', function(data){
        sounds = data;
    });
    socket.on('play-sound', function(sound){
        /**
         * no sound is playing and sound exists, start flashing animation,
         * plays sound and after sound ended stop animation and reactivate sounds
         */
        if(!isPlaying && sounds.hasOwnProperty(sound)){
            isPlaying = true;
            sfxHub[sounds[sound].index].classList.add('playing');
            audioElems[sounds[sound].index].play();
            setTimeout(function(){
                isPlaying = false;
                sfxHub[sounds[sound].index].classList.remove('playing');
            }, audioElems[sounds[sound].index].duration * 1000);
        }
    });
});