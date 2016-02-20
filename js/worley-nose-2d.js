function WorleyNoise2D(numPoints, seed, width, height, targetPoint, style){
this._numPoints = numPoints || 1,
this._keyPoints = [],
this._seed = parseInt(seed) || 3241,
this._width = width || 1,
this._height = height || 1;
this._targetPoint = targetPoint || 2;
this._style = window[style] || euclidean;

this._getKeyPoints();

this._normalValues = [];

}


WorleyNoise2D.prototype._getKeyPoints = function(){
	for(var i = 0; i < this._numPoints; i++){
		this._keyPoints.push({x: WorleyNoise2D.Random(this._seed/((i+1)/2)),y: WorleyNoise2D.Random(((this._seed+1)+(i+1)/2)/2)});	
	}
	this._ApplyKeyPointsToMap();
	return;
};

WorleyNoise2D.Random = function(seed){
	var s = Math.sin(seed) * 10000;
	return s - Math.floor(s);	
};

WorleyNoise2D.prototype._ApplyKeyPointsToMap = function(){
	console.log("width: "+this._width+" - height: "+ this._height);
	 for(var i = 0; i < this._keyPoints.length; i++){
		 
		 this._keyPoints[i].x = (this._width*-0.5)+(this._width * this._keyPoints[i].x);
		 this._keyPoints[i].y = (this._height*-0.5)+(this._height * this._keyPoints[i].y);
		 //this._keyPoints[i].x = (this._width * this._keyPoints[i].x)-(this._width/2);
		 //this._keyPoints[i].y = (this._height * this._keyPoints[i].y)-(this._height/2);
	}
	return;
};

WorleyNoise2D.prototype._calculateDistance = function(ix, iy){
	var dist;

	for(var i = 0; i < this._keyPoints.length; i++){
		dist = this._style(ix - this._keyPoints[i].x, iy - this._keyPoints[i].y);
		this._normalValues.push(dist);
	}
	this._normalValues.sort(function(a, b){return a-b});	
};

WorleyNoise2D.prototype._getPointValue = function(ix, iy){
		this._calculateDistance(ix, iy);
		
		var scale = 1 / (this._normalValues[this._normalValues.length-1] - this._normalValues[0]);
			var value = ((this._normalValues[this._targetPoint] - this._normalValues[0]) * scale)/0.1;
			
		value = (value * 2) - 1;
		
	
			this._normalValues = [];
		return value;
}

function euclidean(dx, dy){
	return dx * dx + dy * dy;	
}

function manhattan(dx, dy) {
    return Math.abs(dx) + Math.abs(dy);
}

function manhattan2(dx, dy){
	return Math.abs(dx) - Math.abs(dy);	
}

function euclidean2(dx, dy){
	return dx * dx - dy * dy;	
}

function chebyshevish(dx,dy){
	return Math.max(Math.abs(dx - (dy/2)),Math.abs(dy - (dx/2)));
}

function chebyshevish2(dx,dy){
	return Math.min(Math.abs(dx + (dy/2)),Math.abs(dy + (dx/2)));
}

function chebyshevish3(dx,dy){
	return Math.min(Math.abs(dx - (dy/2)),Math.abs(dy - (dx/2)));
}

function chebyshevish4(dx,dy){
	return Math.max(Math.abs(dx + (dy/2)),Math.abs(dy + (dx/2)));
}

function valentine(dx, dy){
	return Math.min((dx/dy),(dy/dx))/Math.max((dx/dy),(dy/dx));
}

function valentine2(dx, dy){
	return Math.abs(Math.min((dx/-dy),(dy/-dx))/Math.max((dx/-dy),(dy/-dx)));
}

function valentine3(dx, dy){
 	var r = (dx+dy) * Math.cos(Math.min(dx,dy)/Math.max(dx,dy));
	var r2 = (dx+ dy) * Math.sin(Math.min(dx,dy)/Math.max(dx,dy));
	
	return Math.abs((dx - r) + (dy - r2));
}

function valentine4(dx, dy){
 	var r = (dx+dy) * Math.cos(Math.min(dx,dy)/Math.max(dx,dy));
	var r2 = (dx+ dy) * Math.sin(Math.min(dx,dy)/Math.max(dx,dy));
	
	return Math.abs(Math.min((dx - r) / (dy - r2),(dx + r) / (dy + r2) ));
}







