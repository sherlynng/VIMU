var isEditing = false;

$( document ).ready(function() {
    $('#editingScreen').hide();
});

function toggleEditing() {
    if (isEditing) {
        $('#editingScreen').hide();
        $('#myCanvas').show();
        isEditing = false;
        $('#lock').removeClass('active-btn');
        $('#lock > i').removeClass('fa-unlock').addClass('fa-lock');
    } else {
        $('#editingScreen').show();
        $('#myCanvas').hide();
        isEditing = true;
        $('#lock').addClass('active-btn');
        $('#lock > i').removeClass('fa-lock').addClass('fa-unlock');
    }
}
