var myCircles = [];
var myRoundRectangles = [];
var myTriangles = [];

function onKeyDown(event) {
    var key = event.key.toUpperCase();
    var shape = '';
    var color;

    shape = keyData[key].shape;
    color = keyData[key].color;

    // console.log(keyData[key].color);
    switch (shape) {
        case "circle":
            displayCircle(color);
            break;
        case "roundedRectangle":
            displayRect(color);
            break;
        case "triangle":
            displayTriangle(color);
            break;
    }
}

function displayCircle(color) {
    var maxPoint = new Point(view.size.width, view.size.height);
    var randomPt = Point.random();
    var point = maxPoint * randomPt;
    var newCircle = new Path.Circle(point, 200);
    newCircle.fillColor = color;
    myCircles.push(newCircle);
}

function displayRect(color) {
    var maxPoint = new Point(view.size.width, view.size.height);
    var randomPt1 = Point.random();
    var randomPt2 = Point.random();
    var rectangle = new Rectangle(maxPoint * randomPt1, maxPoint * randomPt2);
    var cornerSize = new Size(20, 20);
    var newRoundRec = new Path.RoundRectangle(rectangle, cornerSize);
    newRoundRec.fillColor = color;
    myRoundRectangles.push(newRoundRec);
}

function displayTriangle(color) {
    // Create a triangle shaped path
    var maxPoint = new Point(view.size.width, view.size.height);
    var randomPt = Point.random();
    var newTriangle = new Path.RegularPolygon(maxPoint * randomPt, 3, 70);
    newTriangle.fillColor = color;
    newTriangle.selected = false;
    myTriangles.push(newTriangle);

}

var triangleDestination = Point.random() * view.size;

function onFrame(event) {

    if (myCircles.length > 0) {
        for (var i = 0; i < myCircles.length; i++) {
            // myCircles[i].fillColor.hue += 1;
            myCircles[i].scale(.9);
        }
    }

    if (myRoundRectangles.length > 0) {
        for (var j = 0; j < myRoundRectangles.length; j++) {
            var random = Point.random();
            var destination = Point.random() * view.size;
            // myRoundRectangles[j].fillColor.hue += 1;
            if (random > 0.5) {
                myRoundRectangles[j].rotate(3);
            }
            else {
                myRoundRectangles[j].rotate(-3);
            }
            myRoundRectangles[j].scale(0.95);
        }
    }

    if (myTriangles.length > 0) {
        for (var k = 0; k < myTriangles.length; k++) {
            var random = Point.random();
            // myTriangles[k].fillColor.hue += 1;
            //if(random>0.5){
            var vector = triangleDestination - myTriangles[k].position;
            myTriangles[k].position += vector / 30;
            if (vector.length < 6) {
                myTriangles[k].scale(0.95);
            }
            //}
            /*else {
                var vector = destination - myTriangles[k].position;
                myTriangles[k].position -= vector / 30;
                if(vector.length <6) {
                myTriangles[k].scale(0.95);
                }
            }*/
        }
    }
}
