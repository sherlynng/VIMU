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
        $('#keyboard-audio-visual').removeClass('col-9'); // make keyboard back to full width
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
            $('.keyboard-key > p').hide();
            $('#display-labels').attr("checked", false);
        } else {
            $('.keyboard-key > p').show();
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
        $('#keyboard-audio-visual').addClass('col-9'); // make keyboard smaller
        $('.keyboard-key').removeClass('keyboard-key').addClass('keyboard-key-edit');
        $('.keyboard-row').removeClass('keyboard-row').addClass('keyboard-row-edit');

        // must show keyboard and letters in editing mode
        if (!showKeyboard) {
            $('#keyboard').show();
        }
        if (!showLetters) {
            $('.keyboard-key-edit > p').show();
        }
    }
}

function toggleLabels(element) {
    if (element.checked) {
        $('.keyboard-key > p').show();
        showLetters = true;
    } else {
        $('.keyboard-key > p').hide();
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
