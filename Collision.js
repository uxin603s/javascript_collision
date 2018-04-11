function Collision(){}
Collision.prototype.get_axis_list=function(a_shape,b_shape){
	var axis=[];
	var not_circle_count=0;
	if(a_shape.corner.length){	
		not_circle_count++
	}
	if(b_shape.corner.length){
		not_circle_count++;
	}
	if(not_circle_count==0){//兩個圓形
		axis.push(a_shape.pos.sub(b_shape.pos));
	}else if(not_circle_count==1){//一個圓形
		if(!a_shape.corner.length){//如果a_shape是圓形就互換
			var tmp=b_shape;
			b_shape=a_shape;
			a_shape=tmp;
		}
		//a多邊形 b圓形
		//計算距離a多邊形的角與b中心點距離
		var array=[];
		for(var i=0;i<a_shape.corner.length;i++){	
			var corner=a_shape.pos.add(a_shape.corner[i]);
			var corner_bpos_vec=b_shape.pos.sub(corner);
			var len_square=vec.len_square()
			array.push({vec:vec,len_square:len_square});
		}
		array.sort(function(a,b){
			return a.len_square-b.len_square;
		});
		//取最近距離
		array[0].vec.get_name();
		axis.push(array[0].vec);
		for(var i=0;i<a_shape.normalVec.length;i++){	
			axis.push(a_shape.normalVec[i]);
		}
	}else{//兩個都不是圓形
		for(var i=0;i<a_shape.normalVec.length;i++){		
			axis.push(a_shape.normalVec[i]);
		}
		for(var i=0;i<b_shape.normalVec.length;i++){
			axis.push(b_shape.normalVec[i]);
		}
	}
	axis.sort(function(a,b){
		return a.a-b.a;
	});
	var result=[];
	while(axis.length){
		var curr=axis.pop();
		if(result.length){
			var reuslt_last_a=result[result.length-1].a;
			var curr_a=curr.a;
			var cut=curr_a-reuslt_last_a;
			if(cut>1){
				result.push(curr)
			}
		}else{
			result.push(curr)
		}
	}
	
	return result;
}

Collision.prototype.check_separat=function(a_shape,b_shape){
	var axis_list=this.get_axis_list(a_shape,b_shape);
	for(var i=0;i<axis_list.length;i++){
		var axis=axis_list[i];
		var a=a_shape.get_min_max_dot(axis,a_shape.pos);
		var b=b_shape.get_min_max_dot(axis,b_shape.pos);	
		if(a.min > b.max || b.min > a.max){
			return true;
		}
	}	
	return false;
}