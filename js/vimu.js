var isEditing = false;
var showKeyboard = true;
var showLetters = true;
var theme = "blue";
var selectedKey;
var wavesurfer;
var firstTimeEditing = true;
var zoomLevel = 0;
var currKey;
var hideNav;

$(document).ready(function () {
    $('#tab-container').hide();
    $('#file-directory').hide();
    $('.ldBar-container').css("visibility", "hidden");
    $('#audio-contents').contents().hide();
    $('#visuals-contents').contents().hide();
    $('.trash-container').hide();

    // settings popover
    $('#display-keyboard').attr("checked", true);
    $('#display-labels').attr("checked", true);
    $('#settings').popover({
        html: true,
        content: function () {
            return $('#settings-popover').html();
        }
    }).on('shown.bs.popover', function () {
    });

    // set audio
    $.getScript('js/wavesurfer.min.js', function () {
        wavesurfer = WaveSurfer.create({
            container: '#waveform',
            height: '65',
        });
    });

    // set tabbing
    setTabbing();

    // set color picker
    setColorPicker();

    // disable zoom out button
    $('#zoomOut-btn').prop('disabled', true);
    $('#zoomOut-btn').css('color', 'lightgrey');

    // allow clicking on performance mode
    $('.keyboard-key').click(function () {
        playMusicPerformance(this);
    });
    $('.keyboard-key').mousedown(function () {
        if (!isEditing) {
            addShadow(this);
        }
    });
    $('.keyboard-key').mouseup(function () {
        if (!isEditing) {
            removeShadow(this);
        }
    });

    // hide nav bar after 2 seconds
    $(".navbar").hide();

    $("html").mousemove(function( event ) {
        $(".navbar").show();

        clearNavBarTimeout();
        hideNavBar();
    });
});

function hideNavBar() {
    hideNav = setTimeout(function(){
        $(".navbar").hide();
    }, 2000);
}
function clearNavBarTimeout() {
    if(typeof hideNav != 'undefined'){
        clearTimeout(hideNav);
    }
}

function playMusicPerformance(element) {
    if (!isEditing) {
        var key = $(element).find("h6").text();
        var track = $(element).find("p").text();
        playMusic(track, key);
    }
}

function setTabbing() {
    var $tabButtonItem = $('#tab-button li'),
        $tabSelect = $('#tab-select'),
        $tabContents = $('.tab-contents'),
        activeClass = 'is-active';

    $tabButtonItem.first().addClass(activeClass);
    $tabContents.not(':first').hide();

    $tabButtonItem.find('a').on('click', function(e) {
        var target = $(this).attr('href');

        console.log(target);

        $tabButtonItem.removeClass(activeClass);
        $(this).parent().addClass(activeClass);
        $tabSelect.val(target);
        $tabContents.hide();
        $(target).show();
        e.preventDefault();

        if (target === "#tab01") { // audio tab
            if (selectedKey) {
                var audio = $(selectedKey).find('p').text();

                // set audio
                if (audio) {
                    $.getScript('js/wavesurfer.min.js', function () {
                        // load audio
                        wavesurfer.load('./sounds/' + audio);
                    });
                }
            }
        }
    });
}

function toggleEditing() {
    if (isEditing) {
        // navigation bar
        isEditing = false;
        $('#lock').removeClass('active-btn');
        $('#lock > i').removeClass('fa-unlock').addClass('fa-lock');
        $('#settings').prop('disabled', false);
        $('#settings').css('color', '');

        // layout
        $('#myCanvas').show();
        $('#tab-container').hide();
        $('#file-directory').hide();
        $('#keyboard-audio-visual').removeClass('col-10'); // make keyboard back to full width
        $('.keyboard-key-edit').removeClass('keyboard-key-edit').addClass('keyboard-key');
        $('.keyboard-row-edit').removeClass('keyboard-row-edit').addClass('keyboard-row');
        $('.ldBar-container').css("visibility", "hidden");

        // return back to original settings
        if (!showKeyboard) {
            $('#keyboard').hide();
            $('#display-keyboard').prop("checked", false);
        } else {
            $('#keyboard').show();
            $('#display-keyboard').prop("checked", true);
        }
        if (!showLetters) {
            $('.keyboard-key').contents().hide();
            $('#display-labels').prop("checked", false);
        } else {
            $('.keyboard-key').contents().show();
            $('#display-labels').prop("checked", true);
        }

        // remove outline for selected key
        $(selectedKey).css('border', '');

        // hide display for trash
        $('.trash-container').hide();

    } else {
        // navigation bar
        isEditing = true;
        $('#lock').addClass('active-btn');
        $('#lock > i').removeClass('fa-lock').addClass('fa-unlock');
        $('#settings').prop('disabled', true);
        $('#settings').popover('hide');
        $('#settings').css('color', 'lightgrey');

        // layout
        $('#myCanvas').hide();
        $('#tab-container').show();
        $('#file-directory').show();
        $('#keyboard-audio-visual').addClass('col-10'); // make keyboard smaller
        $('.keyboard-key').removeClass('keyboard-key').addClass('keyboard-key-edit');
        $('.keyboard-row').removeClass('keyboard-row').addClass('keyboard-row-edit');
        $('.ldBar-container').css("visibility", "collapse");
        $('.ldBar').css("visibility", "hidden");

        // must show keyboard and letters in editing mode
        if (!showKeyboard) {
            $('#keyboard').show();
        }
        if (!showLetters) {
            $('.keyboard-key-edit').contents().show();
        }

        // set settings for selecting key
        $(selectedKey).css('border', '3px solid red');

        // only register listener once
        if (firstTimeEditing) {
            firstTimeEditing = false;
            $('.keyboard-key-edit').click(function () {
                selectKey(this);
            });
        }

        // show display for trash
        $('.trash-container').show();

        // stop all sound
        stopAllMusic();
    }
}

function setSettings() {
    if (showKeyboard) {
        $('#display-keyboard').attr("checked", true);
    } else {
        $('#display-keyboard').attr("checked", false);
    }
    if (showLetters) {
        $('#display-labels').attr("checked", true);
    } else {
        $('#display-labels').attr("checked", false);
    }
}

function toggleLabels(element) {
    if (element.checked) {
        $('.keyboard-key').contents().show();
        showLetters = true;
    } else {
        $('.keyboard-key').contents().hide();
        showLetters = false;
    }
}

function toggleKeyboard(element) {
    if (element.checked) {
        $('#keyboard').show();
        showKeyboard = true;
    } else {
        $('#keyboard').hide();
        showKeyboard = false;
    }
}

// set theme
function setTheme(colour) {
    var row1 = $('.row1');
    var row2 = $('.row2');
    var row3 = $('.row3');
    var row4 = $('.row4');
    var row5 = $('.row5');

    switch (colour) {
        case "blue":
            row1.css('background-color', '#62C9D3');
            row2.css('background-color', '#82CDDE');
            row3.css('background-color', '#A2D8E7');
            row4.css('background-color', '#C5E4F1');
            row5.css('background-color', '#E6F4FD');
            theme = "blue";
            break;
        case "green":
            row1.css('background-color', '#9AC87D');
            row2.css('background-color', '#AFD299');
            row3.css('background-color', '#C1DEB3');
            row4.css('background-color', '#D6EACC');
            row5.css('background-color', '#F1F7E4');
            theme = "green";
            break;
        case "red":
            row1.css('background-color', '#DB8F8E');
            row2.css('background-color', '#E0A9AA');
            row3.css('background-color', '#EBBAB9');
            row4.css('background-color', '#F7D5D6');
            row5.css('background-color', '#FDEEEE');
            theme = "red";
            break;
        case "orange":
            row1.css('background-color', '#DE7C62');
            row2.css('background-color', '#E69276');
            row3.css('background-color', '#F5AF92');
            row4.css('background-color', '#F2BAAA');
            row5.css('background-color', '#FCD4CA');
            theme = "orange";
            break;
    }
}

// add shadow lighting on keypress
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event) {
    if (!isEditing) {
        var key = event.key.toUpperCase();
        if (key.length > 1) { // not alphanumeric
            return;
        }

        var code = key.charCodeAt(0);
        if ((code > 47 && code < 58) || // numeric (0-9)
            (code > 64 && code < 91) || // upper alpha (A-Z)
            (code === 32)) { // space

            if (key === ' ') {
                key = 'SPACE';
            }
            var element = $('#' + key);
            var elementParent = $(element).parent().parent()[0];
            // console.log(event.key);
            // console.log(elementParent);

            addShadow(elementParent);

        }
    }
}

function addShadow(elementParent) {
    $(elementParent).css('transition', 'opacity .2s');
    $(elementParent).css('opacity', '1');

    switch (theme) {
        case "blue":
            $(elementParent).css('box-shadow', '0 0 15px 10px #89D8E7');
            break;
        case "green":
            $(elementParent).css('box-shadow', '0 0 15px 10px #98DB76');
            break;
        case "red":
            $(elementParent).css('box-shadow', '0 0 15px 10px #EBBAB9');
            break;
        case "orange":
            $(elementParent).css('box-shadow', '0 0 15px 10px #F48255');
            break;
    }
}

function showLoadingBar(key, duration) {
    var keyStringLoop = "#ldBar" + key + 'loop';
    var loadingBarLoop = $(keyStringLoop);
    loadingBarLoop.hide();

    $.getScript('js/loading-bar.js', function () {
        // console.log('create loading');
        var keyString = "#ldBar" + key;
        var loadingBar = $(keyString);
        $(loadingBar).show();
        if (loadingBar !== null) {
            var currentId = keyData[key].id;
            // console.log("CurrentId = " + currentId);
            var ldBarObj = new ldBar(keyString);
            $(loadingBar).css("visibility", "visible");
            $(loadingBar).animate({
                letterSpacing: 0 // dummy
            }, {
                duration: duration * 1000,
                progress: function (promise, progress, ms) {
                    if(keyData[key].id !== currentId) {
                        // console.log("NewId = " + keyData[key].id);
                        $(loadingBar).stop();
                        // console.log('stop loading');
                        // console.log(progress);
                        $(loadingBar).css("visibility", "hidden");
                    } else {
                        ldBarObj.set(progress * 100);
                        $(loadingBar).css("visibility", "visible");
                    }
                },
                complete: function () {
                    $(loadingBar).css("visibility", "hidden");
                },
                done: function () {
                    $(loadingBar).css("visibility", "hidden");
                }
            });
        }
    });
}

function showLoadingBarLoop(key, duration) {
    var keyStringLine = "#ldBar" + key;
    var loadingBarLine = $(keyStringLine);
    loadingBarLine.hide();

    $.getScript('js/loading-bar.js', function () {

        var keyString = "#ldBar" + key + 'loop';
        var loadingBar = $(keyString);
        $(loadingBar).css('height', '30px');
        $(loadingBar).css('width', '30px');
        $(loadingBar).show();

        if (loadingBar !== null) {
            var ldBarObj = new ldBar(keyString);
            $(loadingBar).css("visibility", "visible");
            $(loadingBar).animate({
                letterSpacing: 0 // dummy
            }, {
                duration: duration * 1000,
                progress: function (promise, progress, ms) {
                    if(keyData[key].id === '') {
                        $(loadingBar).stop();
                        $(loadingBar).css("visibility", "hidden");
                    } else {
                        ldBarObj.set(progress * 100);
                    }
                },
                complete: function () {
                    // $(loadingBar).css("visibility", "hidden");
                }
            });
        }
    });
}

// function playMusic(track, key) {
//     $.getScript('js/howler.js', function () {
//         var sound = new Howl({
//             src: ['sounds/' + track],
//             onload: function () {
//                 var duration = sound.duration();
//                 // console.log(duration);
//                 showLoadingBar(key, duration);
//             },
//         });
//
//         var id = sound.play();
//         console.log(id);
//         var id2 = sound.play();
//         console.log(id2);
//         // sound.loop(true, id);
//     });
// }

function handleKeyUp(event) {
    if (!isEditing) {
        var key = event.key.toUpperCase();

        if (key.length > 1) { // not alphanumeric
            return;
        }
        var code = key.charCodeAt(0);
        if ((code > 47 && code < 58) || // numeric (0-9)
            (code > 64 && code < 91) || // upper alpha (A-Z)
            (code === 32)) { // space

            if (key === ' ') {
                key = 'SPACE';
            }
            var element = $('#' + key);
            var elementParent = $(element).parent().parent()[0];

            removeShadow(elementParent);

            if ($(element).text()) {
                playMusic($(element).text(), key);
            }
        }
    }
}

function removeShadow(elementParent) {
    $(elementParent).css('transition', 'opacity .2s');
    $(elementParent).css('opacity', '');
    $(elementParent).css('box-shadow', '');
}

// drag and drop
function allowDrop(ev) {
    if (isEditing) {
        ev.preventDefault();
    }
}

function drag(ev) {
    if (isEditing) {
        console.log(ev.target);

        var draggedElement = ev.target;

        if ($(draggedElement).hasClass('soundname')) {
            ev.dataTransfer.setData("text", 'library-' + $(draggedElement).text()); // hardcoded, cant think of a better way yet
        } else if (ev.target.id === "trash") {
            ev.preventDefault();
        } else {
            ev.dataTransfer.setData("text", ev.target.id);
        }
    }
}

function drop(ev) {
    if (isEditing) {
        ev.preventDefault();
        var draggedId = ev.dataTransfer.getData("text");
        if (draggedId === "trash") {
            return; // trash cannot be dragged
        }

        var fromLibrary = false;
        var draggedData;

        if (draggedId.indexOf('library-') === 0) { // hardcoded
            draggedData = draggedId.slice(8);
            fromLibrary = true;
        } else {
            draggedData = document.getElementById(draggedId).textContent;
        }

        // ev.target    -> is div when dragging to empty slot
        //             -> is p when dragging to occupied slot

        var targetId;
        if (ev.target.getElementsByTagName('p').length !== 0) {
            targetId = ev.target.getElementsByTagName('p')[0].id;
        } else {
            targetId = ev.target.id;
        }
        console.log(targetId);

        if (fromLibrary) {
            if (targetId === "trash") { // cannot remove sound track from library
                var targetElement = document.getElementById(targetId);
                $(targetElement).css('background-color', '');
                $(targetElement).css('transition', 'background-color 0.3s ease');
            } else {
                document.getElementById(targetId).textContent = draggedData;
                var targetElement = document.getElementById(targetId);
                var elementParent = $(targetElement).parent().parent()[0];
                selectKey(elementParent);
            }
        } else {
            if (targetId === "trash") {
                document.getElementById(draggedId).textContent = "";

                var targetElement = document.getElementById(targetId);
                $(targetElement).css('background-color', '');
                $(targetElement).css('transition', 'background-color 0.3s ease');

                var draggedElement = document.getElementById(draggedId);
                var elementParent = $(draggedElement).parent().parent()[0];
                selectKey(elementParent);
            } else {
                var targetData = document.getElementById(targetId).textContent;

                document.getElementById(draggedId).textContent = targetData;
                document.getElementById(targetId).textContent = draggedData;

                var targetElement = document.getElementById(targetId);
                var elementParent = $(targetElement).parent().parent()[0];
                selectKey(elementParent);
            }
        }
    }
}

function dragEnter(ev) {
    var targetId;

    if (ev.target.getElementsByTagName('p').length !== 0) {
        targetId = ev.target.getElementsByTagName('p')[0].id;
    } else {
        targetId = ev.target.id;
    }

    var targetElement = document.getElementById(targetId);
    $(targetElement).css('background-color', 'lightpink');
    $(targetElement).css('transition', 'background-color 0.3s ease');
}

function dragLeave(ev) {
    var targetId;

    if (ev.target.getElementsByTagName('p').length !== 0) {
        targetId = ev.target.getElementsByTagName('p')[0].id;
    } else {
        targetId = ev.target.id;
    }

    var targetElement = document.getElementById(targetId);
    $(targetElement).css('background-color', '');
    $(targetElement).css('transition', 'background-color 0.3s ease');
}

function selectKey(element) {
    if (!isEditing) {
        return;
    }

    if (typeof selectedKey === "undefined") {
        $('#audio-contents').contents().show();
        $('#audio-placeholder').hide();
        $('#visuals-contents').contents().show();
        $('#visual-placeholder').hide();
    }

    // remove prev selected first
    $(selectedKey).css('border', '');

    // set for new selected
    selectedKey = element;
    var key = $(element).find("h6").text();
    console.log(element);
    console.log(key);

    // set css on keyboard
    $(element).css('border', '3px solid red');

    // set key value
    if (key === "SPACE") {
        $('#selected-key').text('\u2423');
    } else {
        $('#selected-key').text(key);
    }

    // set in sound editor
    setAudio(element, key);
    setVisuals(element, key);
    setVolumeValue(element, key);

   //set and edit in visual editor
   currKey = key;
   setShapes(element, key);
}

function setVolumeValue(element, key) {
    $('#volume').val(keyData[key].volume * 100);
}

function setWavesurferVolume(volume, key) {
    wavesurfer.setVolume(keyData[key].volume);
}

function setAudio(element, key) {
    var audio = $(element).find('p').text();

    // set audio
    if (audio) {
        $.getScript('js/wavesurfer.min.js', function () {
            // load audio
            wavesurfer.load('./sounds/' + audio);
        });

        // set audio text
        $('#audio-track').text(audio);

        // set looping
        var isLooping = keyData[key].loop;
        var checked = $('#loop').is(':checked');
        // console.log("looping = " + isLooping);
        // console.log("checked = " + checked);
        if (isLooping) {
            if (!checked) {
                // console.log("enable check");
                $('#loop').prop("checked", true);
                // console.log("checked = " + $('#loop').is(':checked'));
            }
        } else {
            if (checked) {
                // console.log("disable check");
                $('#loop').prop("checked", false);
                // console.log("checked = " + $('#loop').is(':checked'));
            }
        }

        // show container
        $('#audio-contents').contents().show();
        $('#wave').show();
        $('#no-audio').hide();
        $('.audio-settings').attr('disabled', false);
        $('.audio-settings').css('color', '');
        $('#volume').removeClass('volume-slider-disabled');
    } else { // no audio selected
        $('#wave').hide();
        $('#no-audio').show();
        $('.audio-settings').attr('disabled', true);
        $('.audio-settings').css('color', '#A0A0A0');
        $('#volume').addClass('volume-slider-disabled');
    }
}

function playAudio() {
    wavesurfer.play();
}

function pauseAudio() {
    wavesurfer.pause();
}

function stopAudio() {
    wavesurfer.stop();
}

function zoomIn() {
    if(zoomLevel < 100) {
        zoomLevel += 10;
        wavesurfer.zoom(zoomLevel);
        $('#zoomOut-btn').prop('disabled', false);
        $('#zoomOut-btn').css('color', '');
    }
    
    if(zoomLevel >= 100) {
        $('#zoomIn-btn').prop('disabled', true);
        $('#zoomIn-btn').css('color', 'lightgrey');
    }
}

function zoomOut() {
    if(zoomLevel > 0) {
        zoomLevel -= 10;
        wavesurfer.zoom(zoomLevel);
        $('#zoomIn-btn').prop('disabled', false);
        $('#zoomIn-btn').css('color', '');
    }

    if(zoomLevel <= 0) {
        $('#zoomOut-btn').prop('disabled', true);
        $('#zoomOut-btn').css('color', 'lightgrey');
    }
}

function toggleLoop(element) {
    console.log("pressed loop");
    var key = $(selectedKey).find("h6").text();

    if (element.checked) {
        console.log("looping");
        keyData[key].loop = true;
        $('#loop').prop("checked", true);
    } else {
        console.log("not loop");
        keyData[key].loop = false;
        $('#loop').prop("checked", false);
    }
}

function setVisuals(element, key) {
    var color = keyData[key].color;
    $('#hue-demo').minicolors('value', color);
}

function setShapes(element, key){
    var newShape = keyData[key].shape;
    if(newShape == "roundedRectangle"){
        $("#shape-select option[value=roundedRectangle]").prop("selected", "selected")
    }
    else if(newShape == "triangle"){
        $("#shape-select option[value=triangle]").prop("selected", "selected")
    }
    else if (newShape == "circle"){
        $("#shape-select option[value=circle]").prop("selected", "selected")
    }
 }


function toggleOpenFolder(element, event) {
    if ($(event.target).hasClass("foldername") || $(event.target).hasClass("folder")
        || $(event.target).hasClass("fa-folder") || $(event.target).hasClass("fa-folder-open")) {
        if ($(element).hasClass("folder-open")) {
            $(element).addClass("folder-closed").removeClass("folder-open");
            $(element).find("i.fa-folder-open").addClass('fa-folder').removeClass('fa-folder-open');
            var files = $(element).find("ul.files li");
            if (files.length > 0) {
                $(files).each(function () {
                    $(this).hide();
                });
            }
        } else {
            $(element).removeClass("folder-closed").addClass("folder-open");
            $(element).find("i.fa-folder").removeClass('fa-folder').addClass('fa-folder-open');
            var files = $(element).find("ul.files li");
            if (files.length > 0) {
                $(files).each(function () {
                    $(this).show();
                });
            }
        }
    }
}

function togglePlaySoundInDir(element, event) {
    $(element).find("i.fa").toggleClass('fa-play');
    $(element).find("i.fa").toggleClass('fa-stop');
    var selected = document.getElementsByClassName("selected");
    $(selected).each(function () {
        $(selected).find("i.fa").toggleClass('fa-play');
        $(selected).find("i.fa").toggleClass('fa-stop');
        $(selected).removeClass('selected');
    });
    $(element).addClass('selected');
}

function setColorPicker() {
    $('#hue-demo').minicolors({
        control: $(this).attr('data-control') || 'hue',
        inline: $(this).attr('data-inline') === 'true',
        letterCase: 'lowercase',
        opacity: false,
        position: 'top left',
        change: function (hex, opacity) {
            if (!hex) return;
            if (opacity) hex += ', ' + opacity;
            try {
                // console.log(hex);
                var key = $(selectedKey).find("h6").text();
                keyData[key].color = hex;
            } catch (e) {
            }
        },
    });
}

function editShape(selectedShape){
    var shapeType = document.getElementById(selectedShape).value;
    console.log(shapeType);
    console.log(currKey);
    keyData[currKey].shape = shapeType;
 }
 
