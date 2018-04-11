function Shape(object){	
	object || (object={})
	//設定角或半徑
	this.setCorner=function(corner){
		this.corner=[];
		this.normalVec=[];
		if(typeof corner=="object"){
			for(var i=0;i<corner.length;i++){
				this.corner.push(new Vector(corner[i]));
			}	
			this.clockwise(this.corner);	
			for(var i=0;i<this.corner.length;i++){
				var next_i=i+1;
				if(!this.corner[next_i]){
					next_i=0;
				}	
				var normalVec=this.corner[next_i].sub(corner[i]).OrthogonalVector();
				normalVec.get_name();
				this.normalVec.push(normalVec);	
			}
		}else{
			this.radius=corner;	
		}
		return this;
	}
	if(object.corner){
		this.setCorner(object.corner);
	}
	
	this.color=(object.color) || "rgba(0,0,0,0.1)";
	if(object.pos){
		this.pos=new Vector(object.pos);
	}else{
		this.pos=new Vector({x:0,y:0});
	}
	this.radius=(object.radius) || 0;
}

Shape.prototype.tmp=[new Shape,new Shape,new Shape,new Shape];

Shape.prototype.get_min_max_dot=function(axis,base){
	var pos=this.pos;
	var corner=this.corner;
	if(corner.length){
		var scalar=[];
		for(var i=0;i<corner.length;i++){
			var dot=corner[i].dot(axis);
			scalar.push(dot);
		}
		var result=scalar.getMinMax();
	}else{	
		var len=axis.len();
		var result={
			min:-len*this.radius,
			max:len*this.radius
		}	
	}	
	if(base){
		result.center=axis.dot(base);
		result.min+=result.center;
		result.max+=result.center;
	}else{
		result.center=0;	
	}
	return result;
}

Shape.prototype.get_min_max_project=function(axis,result){
	result.center=axis.projectVector(result.center);
	result.min=axis.projectVector(result.min);
	result.max=axis.projectVector(result.max);	
	return result;
}

Shape.prototype.get_project_all=function(axis,base){
	var min_max=this.get_min_max_dot(axis,base);
	return this.get_min_max_project(axis,min_max);
}

Shape.prototype.rotate=function(angle){
	for(var i=0;i<this.corner.length;i++){
		this.corner[i]=this.corner[i].rotate(angle)
	}
}
Shape.prototype.trace=function(start,end){
	var w_vec=start.sub(end)
	var h_vec=w_vec.OrthogonalVector();	
	var min_max=this.get_min_max_dot(h_vec);
	var result=this.get_min_max_project(h_vec,min_max);
	
	// var result=this.get_project_all(h_vec);
	
	var p1=result.min;
	var p2=result.max;
	var corner=[];
	corner.push(p1);
	corner.push(p2);
	corner.push(p2.sub(w_vec));
	corner.push(p1.sub(w_vec));
	var trace_shape=new Shape({
		pos:start,
		color:"rgba(0,0,255,0.1)",
	}).setCorner(corner);
	
	return {shape:trace_shape,w_vec:w_vec,h_vec:h_vec};
}
Shape.prototype.get_project_merge=function(b_shape,axis,fix_scalar){
	var a=this.get_project_all(axis);
	var b=b_shape.get_project_all(axis);
	var one=axis.get_one_len(fix_scalar);
	var left=b.min.sub(a.max).add(b_shape.pos);
	var right=b.max.sub(a.min).add(b_shape.pos);
	left=left.sub(one);
	right=right.add(one);
	return {left:left,right:right};
}
Shape.prototype.circle_to_corner=function(num,radius){
	var radius=radius*2/Math.sqrt(3)
	var p1=new Vector({x:0,y:0});
	var p2=new Vector({x:radius,y:0});
	var vec=p2.sub(p1);
	var angle=360/num;
	var point=[p2];

	for(var i=1;i<num;i++){
		point.push(vec.rotate(angle*i));
	}
	Shape.prototype.clockwise(point);
	return point;
}
Shape.prototype.clockwise=function(corner){
	if(corner.length<3){
		return false;
	}
	var a=corner[0];
	var b=corner[1];
	var c=corner[2];
	var ab=a.sub(b);
	var ac=a.sub(c);
	var z=ab.x*ac.y-ab.y*ac.x;
	if(z<0){
		corner.reverse();
	}
	return true;
}