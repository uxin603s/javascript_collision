function Vector(point){	
	this.x=point.x;
	this.y=point.y;
}
Vector.prototype.radian_to_angle=function(radian){
	return radian*180/Math.PI;
}
Vector.prototype.angle_to_radian=function(angle){
	return angle*Math.PI/180;
}
Vector.prototype.get_name=function(){
	var type=0;
	var a=0;
	if(this.x==0){		
		type=1;//在x軸上面
	}else if(this.y==0){
		type=2//在y軸上面
	}else{
		a=this.y/this.x*100;	
		a=Math.round(a)/100;
	}

	this.a=a;
	this.type=type;
	this.name=a+"+"+type;
	return this.name;
}
Vector.prototype.rotate=function(angle){
	var radian=this.angle_to_radian(angle);
	var cos=Math.cos(radian);
	var sin=Math.sin(radian);
	var x=this.x*cos-this.y*sin;
	var y=this.y*cos+this.x*sin;
	return new Vector({x:x,y:y});
}

Vector.prototype.add=function(vec){
	return new Vector({
		x:this.x+vec.x,	
		y:this.y+vec.y,	
	});
}
Vector.prototype.sub=function(vec){
	return new Vector({
		x:this.x-vec.x,	
		y:this.y-vec.y,	
	});
}
Vector.prototype.dot=function(vec){
	return this.x*vec.x+this.y*vec.y;
}
Vector.prototype.mul=function(scalar){
	return new Vector({
		x:this.x*scalar,
		y:this.y*scalar,
	})
}
Vector.prototype.div=function(scalar){
	if(scalar==0){
		throw "向量不能除0";
	}
	return new Vector({
		x:this.x/scalar,
		y:this.y/scalar,
	})
}
Vector.prototype.floor=function(){
	this.x=this.x >> 0
	this.y=this.y >> 0;
	return this;
}
Vector.prototype.ceil=function(){
	this.floor().add({x:1,y:1})
	return this;
}
Vector.prototype.round=function(){
	this.x=Math.round(this.x);
	this.y=Math.round(this.y);
	return this;
}
Vector.prototype.len=function(){
	if(isNaN(this.tmp_len)){
		this.tmp_len=Math.sqrt(this.x*this.x+this.y*this.y);
	}
	return this.tmp_len;	
}
Vector.prototype.get_one_len=function(){
	return this.div(this.len());
}
Vector.prototype.len_square=function(){
	if(!isNaN(this.tmp_len)){
		this.tmp_len_square=this.tmp_len*this.tmp_len;
	}else if(isNaN(this.tmp_len_square)){
		this.tmp_len_square=this.x*this.x+this.y*this.y
	}
	return this.tmp_len_square;	
}
Vector.prototype.projectVector=function(dot){	
	return this.mul(dot/this.len_square());
}
Vector.prototype.OrthogonalVector=function(){
	return new Vector({
		x:-this.y,
		y:this.x,
	});
}
Vector.prototype.get_a_b_type=function(end){
	var type=0;
	var a=0;
	var b=0;
	if((end.x-this.x)==0){
		type=1
	}else if((end.y-this.y)==0){
		type=2		
	}else{
		a=(end.y-this.y)/(end.x-this.x);
		b=(this.y*end.x-this.x*end.y)/(end.x-this.x);
	}	
	return {a:a,b:b,type:type,start:this,end:end};
}		
Vector.prototype.get_line_inter_point=function(a_line,b_line,a_ignore,b_ignore){
	if(a_line.type!=0 || b_line.type!=0){
		var func={use_count:0};
		if(a_line.type==1){
			var x=a_line.start.x;
			func.type=1;
			func.use=b_line;	
			func.use_count++;
		}else if(b_line.type==1){
			var x=b_line.start.x;
			func.type=1;
			func.use=a_line;
			func.use_count++;				
		}else{
			if(b_line.a==a_line.a)return false;
			var x=(a_line.b-b_line.b)/(b_line.a-a_line.a);
		}
		if(a_line.type==2){
			var y=a_line.start.y;
			func.type=2;
			func.use=b_line;
			func.use_count++;
		}else if(b_line.type==2){
			var y=b_line.start.y;
			func.type=2;
			func.use=a_line;
			func.use_count++;
		}else{
			if(b_line.a==a_line.a)return false;
			var y=(b_line.b*a_line.a-b_line.a*a_line.b)/(a_line.a-b_line.a);
		}
		if(func.use_count==1){
			if(func.type==1){
				var y=func.use.a*x+func.use.b;
			}else if(func.type==2){
				if(func.use.a==0)return false;
				var x=(y-func.use.b)/func.use.a;
			}
		}
	}else{
		if(b_line.a==a_line.a)return false;
		var x=(a_line.b-b_line.b)/(b_line.a-a_line.a);
		var y=(b_line.b*a_line.a-b_line.a*a_line.b)/(a_line.a-b_line.a);
	}
	var result_vec=new Vector({x:x,y:y});
	// console.log(a_line)
	var status=true;
	if(a_ignore){
		var line_vec=a_line.end.sub(a_line.start);
		var result_dot=line_vec.dot(result_vec);
		var start_dot=line_vec.dot(a_line.start);
		var end_dot=line_vec.dot(a_line.end);
		var a_state=start_dot<result_dot && end_dot > result_dot;
		status =status && a_state;
	}	

	if(b_ignore){
		var line_vec=b_line.end.sub(b_line.start);
		var result_dot=line_vec.dot(result_vec);
		var start_dot=line_vec.dot(b_line.start);
		var end_dot=line_vec.dot(b_line.end);
		var b_status=start_dot<result_dot && end_dot > result_dot;
		status =status && b_status;
	}
	if(!status){
		return false;
	}
	return result_vec;
}
Vector.prototype.angle=function(vec){
	if(vec){
		var a_len=this.len();
		var b_len=vec.len();
		var a_b_len_dot=a_len*b_len;
		return this.radian_to_angle(Math.acos(this.dot(vec)/a_b_len_dot));
	}else{
		return this.radian_to_angle(Math.atan2(this.y,this.x));
	}
}