function rgbToHex(r, g, b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


function extract(ligne){
  // rect 1, circle 2, line 3, poly 4
  
  var line = ligne.split('"');
  var type = (line[0].split(" "))[0];

  if (type == "rect"){
  var x = Number(line[1]);
  var y = Number(line[3]);
  var width = Number(line[5]);
  var height = Number(line [7]);
  var color = line[9];
  var thickness = Number(Number(line[11]).toFixed(2));
      if (thickness == 1 && (document.getElementById("vdecomp").checked == false)){
        thickness="";
      }
      else {
        thickness=","+thickness;
      }

  color = color.substring(
    color.lastIndexOf("(") + 1, 
    color.lastIndexOf(")")
);
  color = color.split(",");
  color = rgbToHex(Number(color[0]),Number(color[1]),Number(color[2]));

        if (height == 0) {
           height += 1;
          }
        if (width == 0) {
          width += 1;
        }

  return {type:1,x:x,y:y,width:width,height:height,color:color,thickness:thickness};
  }

  else if (type == "circle"){
  var x = Number(line[1]);
  var y = Number(line[3]);
  var r = Number(line[5]);
  var color = line[7];
  var thickness = Number(Number(line[9]).toFixed(2));
  if (thickness == 1 && (document.getElementById("vdecomp").checked == false)){
        thickness="";
      }
      else {
        thickness=","+thickness;
      }
  


  color = color.substring(
    color.lastIndexOf("(") + 1, 
    color.lastIndexOf(")")
);
  color = color.split(",");
  color = rgbToHex(Number(color[0]),Number(color[1]),Number(color[2]));

    return {type:2,x:x,y:y,r:r,color:color,thickness:thickness} ;
  }

  else if (type == "line"){
  var x1 = Number(line[1]);
  var y1 = Number(line[3]);
  var x2 = Number(line[5]);
  var y2 = Number(line [7]);
  var color = line[9];
  var thickness = Number(Number(line[11]).toFixed(2));
  if (thickness == 1 && (document.getElementById("vdecomp").checked == false)){
        thickness="";
      }
      else {
        thickness=","+thickness;
      }


  color = color.substring(
    color.lastIndexOf("(") + 1, 
    color.lastIndexOf(")")
);
  color = color.split(",");
  color = rgbToHex(Number(color[0]),Number(color[1]),Number(color[2]));

  return {type:3,x1:x1,y1:y1,x2:x2,y2:y2,color:color,thickness:thickness};
    
  }
  else if (type == "polygon" ){
    var points = line[1].split(" ");
    
    var S1 = {x:Number(points[0]),y:Number(points[1])};
    var S2 = {x:Number(points[2]),y:Number(points[3])};
    var S3 = {x:Number(points[4]),y:Number(points[5])};
    var S4 = {x:Number(points[6]),y:Number(points[7])};

     
      var permutcheck = false;var Sn = {x:0,y:0};
      
       while (permutcheck == false) {
          if ((S1.y < S4.y) && (S1.x < S2.x) && (S2.y < S3.y) && (S4.x < S3.x)){
        permutcheck = true;       
          }
         else {
        Sn = S1; S1 = S2; S2 = S3; S3 = S4; S4 = Sn;
        }
       }

    var S1S2 = Math.round(Math.sqrt(Math.pow(Math.abs(S2.x-S1.x),2)+Math.pow(Math.abs(S2.y-S1.y),2)));
    var S1S4 = Math.round(Math.sqrt(Math.pow(Math.abs(S4.x-S1.x),2)+Math.pow(Math.abs(S4.y-S1.y),2)));
    
      if ( S1S2 > S1S4 ){ // horizontal
      var d = S1S4;

      var x1 = Math.round((S4.x+S1.x)/2)+Math.round(d/2); var x2 = Math.round((S3.x+S2.x)/2)-Math.round(d/2);
      var y1 = Math.round((S4.y+S1.y)/2); var y2 = Math.round((S3.y+S2.y)/2);  
        if (x1 == x2) { x1++;}
         

    }
      else { // vertical
        var d = S1S2;
        var x1 = Math.round((S1.x+S2.x)/2); var x2 = Math.round((S4.x+S3.x)/2);
        var y1 = Math.round((S1.y+S2.y)/2)+Math.round(d/2); var y2 = Math.round((S4.y+S3.y)/2)-Math.round(d/2);
    
            if (x1 == x2) { x1++;}
      

      }
    var color = line[3];


    color = color.substring(
    color.lastIndexOf("(") + 1, 
    color.lastIndexOf(")")
);
    color = color.split(",");
    color = rgbToHex(Number(color[0]),Number(color[1]),Number(color[2]));
    
    return {type:4,x1:x1,y1:y1,x2:x2,y2:y2,d:d,color:color};
    
  }
  else {
    return;
  }
}







function convert(param){

  var VDEcomptability;
  if (document.getElementById("vdecomp").checked == true) {
   VDEcomptability = true;
 }
  else {
    VDEcomptability = false;
  }

  if (param.type == 1) { // RECTANGLE
      
      if (param.width < param.height) { // || vertical
        if (param.width*2 < 260){
      var x = (param.x*2)+param.width;
      var y = (param.y*2)+param.height;
      
      var p1 = [x,Math.round((y-param.height)+param.width/2)];
      var p2 = [x,Math.round((y+param.height)-param.width/2)];

          if (p1[0] == p1[1]) {
        p1[0] = p1[0]+1;
          }
          if (p2[0] == p2[1]) {
        p2[0] = p2[0]+1;
          }

      if (VDEcomptability == true) {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.width*2}${param.thickness},0\"/>`;
      }
      else {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.width*2}${param.thickness}\"/>`;
      }
        }
        else {
       
      var x = (param.x*2)+param.width;
      var y = (param.y*2)+param.height;
      var p1 = [Math.round(x-param.width/2),Math.round(y-(param.height)+param.width/2)];
      var p2 = [Math.round(x-param.width/2),Math.round(y+(param.height)-param.width/2)];
      var p3 = [Math.round(x+param.width/2),Math.round(y-(param.height)+param.width/2)];
      var p4 = [Math.round(x+param.width/2),Math.round(y+(param.height)-param.width/2)];
      
      if (VDEcomptability == true) {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.height}${param.thickness},0\"/><JD P1=\"${p3[0]},${p3[1]}\"P2=\"${p4[0]},${p4[1]}\"c=\"${param.color},${param.height}${param.thickness},0\"/><JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p3[0]},${p3[1]}\"c=\"${param.color},${param.height}${param.thickness},0\"/><JD P1=\"${p2[0]},${p2[1]}\"P2=\"${p4[0]},${p4[1]}\"c=\"${param.color},${param.height}${param.thickness},0\"/>`;

      }
      else {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.height}${param.thickness}\"/><JD P1=\"${p3[0]},${p3[1]}\"P2=\"${p4[0]},${p4[1]}\"c=\"${param.color},${param.height}${param.thickness}\"/><JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p3[0]},${p3[1]}\"c=\"${param.color},${param.height}${param.thickness}\"/><JD P1=\"${p2[0]},${p2[1]}\"P2=\"${p4[0]},${p4[1]}\"c=\"${param.color},${param.height}${param.thickness}\"/>`;
      }

        }

      }
      else { // __ horizontal
        if (param.height*2 < 260){
      var x = (param.x*2)+param.width;
      var y = (param.y*2)+param.height;
      var p1 = [Math.round((x-param.width)+param.height/2),y];
      var p2 = [Math.round((x+param.width)-param.height/2),y];


          if (p1[0] == p1[1]) {
        p1[0] = p1[0]+1;
          }
          if (p2[0] == p2[1]) {
        p2[0] = p2[0]+1;
          }
          
      if (VDEcomptability == true) {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.height*2}${param.thickness},0\"/>`;     
      }
      else {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.height*2}${param.thickness}\"/>`;
      }
        }
        else { 
      var x = (param.x*2)+param.width;
      var y = (param.y*2)+param.height;
      var p1 = [Math.round((x-param.width)+param.height/2),Math.round(y-param.height/2)];
      var p2 = [Math.round((x+param.width)-param.height/2),Math.round(y-param.height/2)];
      var p3 = [Math.round((x-param.width)+param.height/2),Math.round(y+param.height/2)];
      var p4 = [Math.round((x+param.width)-param.height/2),Math.round(y+param.height/2)];

      if (VDEcomptability == true) {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.height}${param.thickness},0\"/><JD P1=\"${p3[0]},${p3[1]}\"P2=\"${p4[0]},${p4[1]}\"c=\"${param.color},${param.height}${param.thickness},0\"/><JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p3[0]},${p3[1]}\"c=\"${param.color},${param.height}${param.thickness},0\"/><JD P1=\"${p2[0]},${p2[1]}\"P2=\"${p4[0]},${p4[1]}\"c=\"${param.color},${param.height}${param.thickness},0\"/>`;
    }
      else {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.height}${param.thickness}\"/><JD P1=\"${p3[0]},${p3[1]}\"P2=\"${p4[0]},${p4[1]}\"c=\"${param.color},${param.height}${param.thickness}\"/><JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p3[0]},${p3[1]}\"c=\"${param.color},${param.height}${param.thickness}\"/><JD P1=\"${p2[0]},${p2[1]}\"P2=\"${p4[0]},${p4[1]}\"c=\"${param.color},${param.height}${param.thickness}\"/>`;

      }
        
        }
      }



  }
  else if (param.type == 2) { // CERCLE
          if (param.r*4 < 260) {
            var p1 = [param.x*2,param.y*2];
            var p2 = [param.x*2,param.y*2];
                          
               if ((p1[0] == p2[0]) && (p1[1]) == p2[1]) {
                 p2[1] = p1[1]+1;
               }



      if (VDEcomptability == true) {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.r*4+1}${param.thickness},0\"/>`;

      }
      else {
   return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.r*4+1}${param.thickness}\"/>`;

      }

          }
          else {

            var axeg = (param.x*2)-Math.round((param.r*0.75));
            var axed = (param.x*2)+Math.round((param.r*0.75));
            var axeh = (param.y*2)+Math.round((param.r*0.75));
            var axeb = (param.y*2)-Math.round((param.r*0.75));
            
    if (VDEcomptability == true) {
    return `<JD P1=\"${axeg},${axeh}\"P2=\"${axed},${axeh}\"c=\"${param.color},${param.r*2}${param.thickness},0\"/><JD P1=\"${axeg},${axeb}\"P2=\"${axed},${axeb}\"c=\"${param.color},${param.r*2}${param.thickness},0\"/><JD P1=\"${axeg},${param.y*2}\"P2=\"${axed},${param.y*2}\"c=\"${param.color},${param.r*2}${param.thickness},0\"/><JD P1=\"${axeg},${axeh}\"P2=\"${axeg},${axeb}\"c=\"${param.color},${param.r*2}${param.thickness},0\"/><JD P1=\"${axed},${axeh}\"P2=\"${axed},${axeb}\"c=\"${param.color},${param.r*2}${param.thickness},0\"/>`;
    }
    else {
    return `<JD P1=\"${axeg},${axeh}\"P2=\"${axed},${axeh}\"c=\"${param.color},${param.r*2}${param.thickness}\"/><JD P1=\"${axeg},${axeb}\"P2=\"${axed},${axeb}\"c=\"${param.color},${param.r*2}${param.thickness}\"/><JD P1=\"${axeg},${param.y*2}\"P2=\"${axed},${param.y*2}\"c=\"${param.color},${param.r*2}${param.thickness}\"/><JD P1=\"${axeg},${axeh}\"P2=\"${axeg},${axeb}\"c=\"${param.color},${param.r*2}${param.thickness}\"/><JD P1=\"${axed},${axeh}\"P2=\"${axed},${axeb}\"c=\"${param.color},${param.r*2}${param.thickness}\"/>`;
    }
          }




  }
  else if (param.type == 3) { // LIGNE
          var p1 = [param.x1*2,param.y1*2];
          var p2 = [param.x2*2,param.y2*2];
    if (VDEcomptability == true) {
    return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},4,${param.thickness},0\"/>`;
    }
    else {
    return `<JD P1=\"${p1[0]},${p1[1]}\"P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},4,${param.thickness}\"/>`;
    }


  }
  else if (param.type == 4){ // POLYGON
    
          var p1 = [param.x1*2,param.y1*2];
          var p2 = [param.x2*2,param.y2*2];


          if (param.d*2 <= 260){
return `<JD P1=\"${p1[0]},${p1[1]}\" P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},${param.d*2}\"/>`;
          }
          else {
return `<JD P1=\"${p1[0]},${p1[1]}\" P2=\"${p2[0]},${p2[1]}\"c=\"${param.color},260\"/>`;            
          }
  }
  else {
    return "";
  }
}






function prog(){

 var chaine = document.getElementById("SVG").value;    
 chaine = chaine.substring(
    chaine.lastIndexOf("[") + 1, 
    chaine.lastIndexOf("]")
);
var ligne = 1;
var XML = '<C><P Ca="" /><Z><S /><D /><O /><L>';
chaine = chaine.split("<");
var nbrelignes = chaine.length;

if (document.getElementById("vdecomp").checked == true) {
  var VLstep = 1;
  while (ligne < nbrelignes) {
    
    if (ligne == VLstep) {
      XML += `<VL n="${VLstep} "l="-1"/>`;
      VLstep += 400;
    }

    XML += convert(extract(chaine[ligne]));

    ligne = ligne +2;
  }
}
else {
  while (ligne < nbrelignes) {
       XML += convert(extract(chaine[ligne]));
    ligne = ligne +2;
  }
}

 XML += "</L></Z></C>";

document.getElementById("XML").value = XML;
}







document.getElementById('upload').addEventListener('change', readFileAsString)
function readFileAsString() {
    var files = this.files;
   

    var reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById("SVG").value = (event.target.result);
        prog();
    };
    reader.readAsText(files[0]);
    
}


