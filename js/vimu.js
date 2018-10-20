var isEditing = false;
var showKeyboard = true;
var showLetters = true;

$( document ).ready(function() {
    $('#customization-container').hide();
    $('#file-directory').hide();

    // settings popover
    $('#settings').popover({
        html: true,
        content: function() {
            return $('#settings-popover').html();
        }
    }).on('shown.bs.popover', function() {});
});

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
        $('#customization-container').hide();
        $('#file-directory').hide();
        $('#keyboard-audio-visual').removeClass('col-10'); // make keyboard back to full width
        $('.keyboard-key-edit').removeClass('keyboard-key-edit').addClass('keyboard-key');
        $('.keyboard-row-edit').removeClass('keyboard-row-edit').addClass('keyboard-row');

        // return back to original settings
        if (!showKeyboard) {
            $('#keyboard').hide();
            $('#display-keyboard').attr("checked", false);
        } else {
            $('#keyboard').show();
            $('#display-keyboard').attr("checked", true);
        }
        if (!showLetters) {
            $('.keyboard-key').contents().hide();
            $('#display-labels').attr("checked", false);
        } else {
            $('.keyboard-key').contents().show();
            $('#display-labels').attr("checked", true);
        }
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
        $('#customization-container').show();
        $('#file-directory').show();
        $('#keyboard-audio-visual').addClass('col-10'); // make keyboard smaller
        $('.keyboard-key').removeClass('keyboard-key').addClass('keyboard-key-edit');
        $('.keyboard-row').removeClass('keyboard-row').addClass('keyboard-row-edit');

        // must show keyboard and letters in editing mode
        if (!showKeyboard) {
            $('#keyboard').show();
        }
        if (!showLetters) {
            $('.keyboard-key-edit').contents().show();
        }
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

// drag and drop
function allowDrop(ev) {
    if (isEditing) {
        ev.preventDefault();
    }
}

function drag(ev) {
    if (isEditing) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
}

function drop(ev) {
    if (isEditing) {
        ev.preventDefault();
        var draggedId = ev.dataTransfer.getData("text");
        var draggedData = document.getElementById(draggedId).textContent;

        // ev.target    -> is div when dragging to empty slot
        //             -> is p when dragging to occupied slot

        var targetId;
        if (ev.target.getElementsByTagName('p').length !== 0) {
            targetId = ev.target.getElementsByTagName('p')[0].id;
        } else {
            targetId = ev.target.id;
        }
        var targetData = document.getElementById(targetId).textContent;

        document.getElementById(draggedId).textContent = targetData;
        document.getElementById(targetId).textContent = draggedData;
    }
}
