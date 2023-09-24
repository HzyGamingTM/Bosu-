export class BsHandler {
	gl;
	elements;
	texture;

	constructor(gl) {
	}
}

export class BsPoint {	
    x; y; u; v;
	r; g; b; a;

	constructor(x, y, u, v, r, g, b, a) {
        this.x = x;
        this.y = y;
		this.u = u;
		this.v = v;
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
}

export class BsTriangle {
	// size 3 array of BsPoint
	points;

	constructor(points) {
		this.points = points;
	}
 
	isInside() {

	}

	isOnBorder() {

	}

	// TODO: add math for checking if point lies inside triangle
	// TODO: add math for checking if point lies on border
}

export class BsElement {
	// array of triangles
	triangles;

	constructor(triangles) {
		this.triangles = triangles;
	}

	// TODO: onclicks.
}