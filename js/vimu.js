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
        $('#keyboard-container').removeClass('col-9'); // make keyboard back to full width
        $('.keyboard-key-edit').removeClass('keyboard-key-edit').addClass('keyboard-key');
        $('.keyboard-row-edit').removeClass('keyboard-row-edit').addClass('keyboard-row');

        // return back to original settings
        if (!showKeyboard) {
            $('#keyboard-container').hide();
            $('#display-keyboard').attr("checked", false);
        }
        if (!showLetters) {
            $('.keyboard-key > p').hide();
            $('#display-labels').attr("checked", false);
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
        $('#keyboard-container').addClass('col-9'); // make keyboard smaller
        $('.keyboard-key').removeClass('keyboard-key').addClass('keyboard-key-edit');
        $('.keyboard-row').removeClass('keyboard-row').addClass('keyboard-row-edit');

        // must show keyboard and letters in editing mode
        if (!showKeyboard) {
            $('#keyboard-container').show();
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
        $('#keyboard-container').show();
        showKeyboard = true;
    } else {
        $('#keyboard-container').hide();
        showKeyboard = false;
    }
}
