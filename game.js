
var canvas = document.getElementById('game');
	// get canvas context
var ctx = canvas.getContext('2d');
// load image

var cw=canvas.width;
var ch=canvas.height;

function reOffset(){
  var BB=canvas.getBoundingClientRect();
  offsetX=BB.left;
  offsetY=BB.top;        

	cw=canvas.width;
	ch=canvas.height;
}
var offsetX,offsetY;
reOffset();
window["onscroll"]=function(e){ reOffset(); }
window["onresize"]=function(e){ reOffset(); }

var pressed=-1;
var score=0;

var images=[];

var gw=4;
var gh=4;

var phase;
var anim_frames=5;
var anim_length=30;

var anim_phase;//goes to 10 say
var anim;
var spawn;

var state;
var gameover;

var last=1;
var laster=-1;
function spawnRand(col){
	clearAnim();

	if (col===0){
		// if (Math.random()<0.5){
		// 	col=1;
		// } else {
		// 	col=2;
		// }
		// if (col===last &&col===laster){
		// 	col=3-col;
		// }
		// laster=last;
		// last=col;
		col=1+(1-last);
		last=col-1;
	}
	var freecells = emptyCells();
	var randI = Math.floor(Math.random() * freecells.length);
	var ra=freecells.splice(randI,1)[0];
	state[ra[0]][ra[1]]=col;
	spawn[ra[0]][ra[1]]=1;

	if (freecells.length===0){

		if (gameover===false){
			playSound(38733900);
		}


		gameover=true;
		return;
	} 
}


function clearCell(x,y){
	var farbe=state[x][y];
	if (farbe===0){
		return false;
	}
	spawn[x][y]=-farbe;
	state[x][y]=0;
	return true;
}

async function resetGame(){

	playSound(90509500);
	gameover=false;
	anim=[//comesfrom
	[[0,0],[0,0],[0,0],[0,0],[0,0]],
	[[0,0],[0,0],[0,0],[0,0],[0,0]],
	[[0,0],[0,0],[0,0],[0,0],[0,0]],
	[[0,0],[0,0],[0,0],[0,0],[0,0]],
	[[0,0],[0,0],[0,0],[0,0],[0,0]]];
	state=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
	spawn=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
	anim_phase=0;
	phase=0;
	score=0;

	spawnRand(1);
	for( anim_phase=0;anim_phase<2;anim_phase++){
		redraw();
		await sleep(30);
	}
	clearAnim();
	redraw();

	spawnRand(2);
	for( anim_phase=0;anim_phase<2;anim_phase++){
		redraw();
		await sleep(30);
	}
	clearAnim();
	redraw();
	
	return Promise.resolve(1);
}

function unpress(){
	pressed=-1;
	if (phase===-1){
		phase=0;
	}
	redraw();
}

function animtick(){

	anim_phase++;
	if (anim_phase>anim_frames){
		anim_phase=anim_frames;
	}


	if (anim_phase<anim_frames)	{
		setTimeout(animtick,anim_length);		
	} else {
		phase=0;
	}

	redraw();
}

var piece_frames={
	1:["weiss","weiss_1","weiss_1","weiss_1"],
	2:["schwarz","schwarz_1","schwarz_1","weiss_1"],
	};

function redraw(){

	
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.drawImage(images["geraet2"], 0, 0);	

	var s=score.toString();
	while (s.length<3){
		s="0"+s;
	}

	for(var i=0;i<3;i++){
		ctx.drawImage(images[s[i]],54+4*i,10);
	}

	ctx.fillStyle = "#00FF00";
	for (var i=0;i<phase;i++){
		ctx.fillRect( 55+4*i, 52, 1, 1 );
	}
	if (phase===-1){
		ctx.fillStyle = "#FF0000";
		ctx.fillRect( 55+4*i, 52, 1, 1 );		
	}
	if (gameover){
		ctx.fillStyle = "#FF0000";
		for (var i=0;i<4;i++){
			ctx.fillRect( 55+4*i, 52, 1, 1 );
		}
	}


	for(var i=0;i<gw;i++){
		for (var j=0;j<gh;j++){
			var dx=Math.floor(anim[i][j][0]*8*(1-anim_phase/anim_frames));
			var dy=Math.floor(anim[i][j][1]*8*(1-anim_phase/anim_frames));

			var pieceframe=0;
			var farbe=state[i][j];
			if (spawn[i][j]===1){
				pieceframe=2-anim_phase;
			}

			if (spawn[i][j]===-1){
				pieceframe=1;
				farbe=1;
			}
			if (spawn[i][j]===-2){
				pieceframe=1;
				farbe=2;
			}

			if (farbe===1){
				ctx.drawImage(images[piece_frames[farbe][pieceframe]],19+8*i+dx,19+8*j+dy);
			} else if (farbe===2){
				ctx.drawImage(images[piece_frames[farbe][pieceframe]],19+8*i+dx,19+8*j+dy);

			}
		}
	}

	if (pressed>=0){
		var dat = image_x_y[pressed];
		ctx.drawImage(images[dat[0]],dat[1],dat[2]);
		setTimeout(unpress,200);
	}
}

var image_names=[
	"geraet2",
	"b_up_sm",
	"b_down_sm",
	"b_left_sm",
	"b_right_sm",
	"reset",
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"schwarz",
	"weiss",
	"weiss_1",
	"weiss_0",
	"schwarz_1",
	"schwarz_0",
	];

var image_x_y=[
["b_up_sm",19,8,31,8],
["b_down_sm",19,53,31,8],
["b_left_sm",8,19,8,31],
["b_right_sm",53,19,8,31],
["reset",60,55,6,6]
];

for (var i=0;i<image_names.length;i++){
	var image = new Image();
	image.onload = function () {
	    // draw the image into the canvas
	    redraw();
	}
	image.src = image_names[i]+".png";
	images[image_names[i]]=image;
}

function trypush(dx,dy){
	var anymoved=false;	
	for (var i=0;i<gw;i++){
		for (var j=0;j<gh;j++){
			if (state[i][j]===0){
				continue;
			}

			var ti=i+dx;
			var tj=j+dy;
			if (ti<0||ti>=gw||tj<0||tj>=gh){
				continue;
			}
			if (state[ti][tj]===0){
				state[ti][tj]=state[i][j];
				state[i][j]=0;

				anim[ti][tj][0]=anim[i][j][0]-dx;
				anim[ti][tj][1]=anim[i][j][1]-dy;
				anim[i][j][0]=0;
				anim[i][j][1]=0;


				anymoved=true;
			}
		}
	}
	return anymoved;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearAnim(){
	for (var i=0;i<gw;i++){
		for (var j=0;j<gh;j++){
			anim[i][j][0]=0;
			anim[i][j][1]=0;
			spawn[i][j]=0;
		}
	}
}

function full(){
	for (var i=0;i<gw;i++){
		for (var j=0;j<gh;j++){
			if (state[i][j]===0){
				return true;
			}
		}
	}
	return false;
}

var moving=false;
async function doMove(dx,dy){

	var anymoved=false;

	clearAnim();

	var trymove=true;
	while(trymove){
		trymove=false;
		if (trypush(dx,dy)){
			trymove=true;
			anymoved=true;
		}
	}

	if (anymoved===false) {
		anim_phase=-1;
		redraw();
		await sleep(30);
		anim_phase=1;
		phase=1;
		redraw();
		return Promise.resolve(1);
	}
	playSound(11309707);

	phase=1;
	for( anim_phase=1;anim_phase<anim_frames;anim_phase++){
		redraw();
		await sleep(30);
	}


	phase=2;
	clearAnim();
	if (tryClear()){
		playSound(53413900);//blip
		await sleep(30);
		for( anim_phase=0;anim_phase<2;anim_phase++){
			redraw();
			await sleep(30);
		}
		clearAnim();
		redraw();
		await sleep(30);
	}

	phase=3;
	spawnRand(0);
	for( anim_phase=0;anim_phase<2;anim_phase++){
		redraw();
		await sleep(30);
	}
	clearAnim();
	redraw();


	phase=4;
	clearAnim();
	if (tryClear()){
		playSound(53413900);//blip
		await sleep(30);
		for( anim_phase=0;anim_phase<2;anim_phase++){
			redraw();
			await sleep(30);
		}
		clearAnim();
		redraw();
	}

	phase=0;
	redraw();

	return Promise.resolve(1);
}

async function doPress(i){
	if (moving===true){
		return;
	}
	moving=true;

	pressed=i;
	if (i===0){
		await doMove(0,-1);
	} else if (i===1){
		await doMove(0,1);
	} else if (i===2){
		await doMove(-1,0);
	} else if (i===3){	
		await doMove(1,0);
	} else if (i===4){
		await resetGame();
	}

	moving=false;
}

function  getMousePos(evt) {
	var rect = canvas.getBoundingClientRect(), // abs. size of element
	scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
	scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

	var clientX=evt.clientX;
	var clientY=evt.clientY;

	if (scaleX<scaleY){
		scaleX=scaleY;
		clientX-=rect.width/2-(cw/scaleX)/2;
	} else {
		scaleY=scaleX;
		clientY-=rect.height/2-(ch/scaleY)/2;
	}
	var x = (clientX - rect.left) * scaleX;   // scale mouse coordinates after they have
	var y =(clientY - rect.top) * scaleY     // been adjusted to be relative to element

	return [x,y];
}

function handleTap(e){


	var [mouseX,mouseY] =getMousePos(e);



	// var xoff=0;
	// var yoff=0;

	// var canvas_width_pixeled=Math.floor(canvas.width*canvas.width/rect.width);
	// var canvas_height_pixeled=Math.floor(canvas.width*canvas.height/rect.height);

	// xoff = Math.floor(canvas_width_pixeled/2-cw/2);
	// yoff = Math.floor(canvas_height_pixeled/2-ch/2);

	// mouseX+=xoff;
	// mouseY+=yoff;

  	console.log(e);
	console.log(mouseX+","+mouseY);
	var data = ctx.getImageData(mouseX, mouseY, 1, 1).data;
	var rgb = [ data[0], data[1], data[2] ];

	for (var i=0;i<image_x_y.length;i++){
		var dat = image_x_y[i];
		var x_min=dat[1];
		var y_min=dat[2];
		var x_max=dat[1]+dat[3];
		var y_max=dat[2]+dat[4];

		if (mouseX>=x_min&&mouseX<=x_max&&mouseY>=y_min&&mouseY<=y_max){
			console.log(`(${mouseX},${mouseY})~[${x_min},${y_min},${x_max},${y_max}]`);
			doPress(i);
		}
	}

}

function emptyCells(){
	var result=[];
	for(var i=0;i<gw;i++){
		for (var j=0;j<gh;j++){
			if (state[i][j]===0){
				result.push([i,j]);
			}
		}
	}
	return result;
}

function neighbors (x,y){
  var result=[];
  if (x>0){
    result.push([x-1,y]);
  }
  if (x<gw-1){
    result.push([x+1,y]);
  }
  if (y>0){
    result.push([x,y-1]);
  }
  if (y<gh-1){
    result.push([x,y+1]);
  }
  return result;
}

function versuchFloodFill(x,y,todelete){


	if (state[x][y]===0){
	  return false;
	}

  var farbe = state[x][y];
  console.log("farbe "+farbe);

  var base_idx=x+gw*y;
  if (todelete.indexOf(base_idx)>=0){
    return false;
  }

  console.log("not already present");

  var visited=[base_idx];

  var modified=true;
  while(modified){
    modified=false;

    for (var i=0;i<gw;i++){
      for (var j=0;j<gh;j++){
        var idx = i+gw*j;
        if (visited.indexOf(idx)>=0){
          continue;
        }

        //check if you've visited neighbours
        var hasneighbour=false;
        var nbs = neighbors(i,j);
        for (var k=0;k<nbs.length;k++){
          var nb = nbs[k];
          var nbi=nb[0]+gw*nb[1];
          if (visited.indexOf(nbi)>=0){
            hasneighbour=true;
          }
        }
        if (hasneighbour===false){
          continue;
        }

        var zelle_farbe=state[i][j];
        if (zelle_farbe==0){
          //escaped -- return! :)
          return false;
        }
        if (zelle_farbe!==farbe){
          continue;
        }

        visited.push(idx);
        modified=true;
      }
    }
  }

  if (visited.length===16){
    visited=[];
  }
  for (var i=0;i<visited.length;i++){
    todelete.push(visited[i]);
  }
  return visited.length>0;
}

function tryClear(){
	if (emptyCells().length===0){
		if (gameover===false){
			playSound(38733900);
		}
		gameover=true;
		return false;
	}
	console.log("tryclear");
  var todelete=[];
  for (var i=0;i<gw;i++){
    for (var j=0;j<gh;j++){
      var zelle=state[i][j];
      if (zelle==0){
        continue;
      }
      if (versuchFloodFill(i,j,todelete)){
      	score++;
      }
    }
  }
  for (var i=0;i<todelete.length;i++){
    var idx=todelete[i];
    var x = idx%gw;
    var y = Math.floor(idx/gw)
    clearCell(x,y);
  }
  return todelete.length>0;
}

function handleKey(e){
	if (e.key==="ArrowUp"){
		doPress(0);
		e.preventDefault();
		return false;
	}
	if (e.key==="ArrowDown"){
		doPress(1);
		e.preventDefault();
		return false;
	}
	if (e.key==="ArrowLeft"){
		doPress(2);
		e.preventDefault();
		return false;
	}
	if (e.key==="ArrowRight"){
		doPress(3);
		e.preventDefault();
		return false;
	}
	if (e.key.toLowerCase()==="r"||e.key.toLowerCase()==="n"){
		doPress(4);
		e.preventDefault();
		return false;
	}
}

canvas.addEventListener("pointerdown",handleTap);
document.addEventListener("keydown",handleKey);

resetGame();