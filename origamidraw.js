// svg drawing tool for origami diagrams

var container;
var current_dot_x = false;
var current_dot_y = false;
var currently_drawing = false;
var current_tool = {type:'line',subtype:'edge'};
var lines = [];
var dots = [];
var arrows = 0;
var areas = 0;
var gridstyle = document.createElement("style");
gridstyle.innerHTML = ".dot:hover { stroke:grey; }";

function initialise(target, size, grid_type, grid_density, bg) {
  lines = [];
  dots = [];
  arrows = 0;
  areas = 0;

  target.innerHTML =
  "<div style='display:flex'>\
    <div style='width:"+size+";height:"+size+"'>\
     <svg id=diagram style='position:fixed;' height=" + size + " width=" + size + ">\
      <defs id='diagram_markers'>\
       <marker id='valley_head' markerWidth=20 markerHeight=20 refX=20 refY=10 orient='auto' markerUnits='userSpaceOnUse'>\
        <path d='M20 10 l-15 -5 M20 10 l-15 5' style='stroke:black;stroke-width:2px;fill:none;'></path>\
       </marker>\
       <marker id='mountain_head' markerWidth=20 markerHeight=20 refX=20 refY=10 orient='auto' markerUnits='userSpaceOnUse'>\
        <path d='M20 10 l-15 0  l0 -8 Z' style='stroke:black;stroke-width:2px;fill:white;'></path>\
       </marker>\
       <marker id='unfold_tail' markerWidth=15 markerHeight=18 refX=0 refY=10 orient='auto' markerUnits='userSpaceOnUse'>\
        <path d='M0 10 l15 8  l0 -16 Z' style='stroke:black;stroke-width:2px;fill:white;'></path>\
       </marker>\
      </defs>\
      <g id='diagram_fills'> <rect width=" + size + " height=" + size + " fill=" + bg +"></rect> </g>\
      <g id='diagram_lines'></g>\
      <g id='diagram_arrows'></g>\
      <g id='diagram_grid'></g>\
     </svg>\
    </div>\
    <div id='controls' style='padding-left:10'>\
     <p>Line Tools</p>\
     <span title='Valley'><svg id='toolicon_line_valley' height='30' width='30' onclick=select_tool('line','valley')><rect height=30 width=30 fill=white></rect><line x1=30 y1=0 x2=0 y2=30 style='stroke:blue;stroke-width:3;stroke-dasharray:10 5'></line></svg></span>\
     <span title='Mountain'><svg id='toolicon_line_mountain' height='30' width='30' onclick=select_tool('line','mountain')><rect height=30 width=30 fill=white></rect><line x1=30 y1=0 x2=0 y2=30 style='stroke:red;stroke-width:3;stroke-dasharray:10 5 5 5 5 5'></line></svg></span>\
     <span title='Crease'><svg id='toolicon_line_crease' height='30' width='30' onclick=select_tool('line','crease')><rect height=30 width=30 fill=white></rect><line x1=30 y1=0 x2=0 y2=30 style='stroke:black;stroke-width:1'></line></svg></span>\
     <span title='X-Ray'><svg id='toolicon_line_xray' height='30' width='30' onclick=select_tool('line','xray')><rect height=30 width=30 fill=white></rect><line x1=30 y1=0 x2=0 y2=30 style='stroke:black;stroke-width:2;stroke-dasharray:2 3'></line></svg></span>\
     <span title='Edge'><svg id='toolicon_line_edge' height='30' width='30' onclick=select_tool('line','edge')><rect height=30 width=30 fill=white></rect><line x1=30 y1=0 x2=0 y2=30 style='stroke:black;stroke-width:3'></line></svg></span>\
     &nbsp;&nbsp;&nbsp;<span title='Erase Lines'><svg id='toolicon_line_erase' height='30' width='30' onclick=select_tool('line','erase')><rect height=30 width=30 fill=white></rect><line x1=30 y1=0 x2=0 y2=30 style='stroke:black;stroke-width:3'></line><line x1=15 y1=7 x2=15 y2=23 style='stroke:black;stroke-width:3'></line><line x1=7 y1=15 x2=23 y2=15 style='stroke:black;stroke-width:3'></line></svg>\
     <p>Arrow Tools</p>\
     <span title='Valley'><svg id='toolicon_arrow_valley' height=30 width=30 onclick=select_tool('arrow','valley')><rect height=30 width=30 fill=white></rect><path d='M0 30 Q10 10 30 0' style='stroke:black;stroke-width:2;fill:none'></path><line x1=30 y1=0 x2=20 y2=2 style='stroke:black;stroke-width:2'></line><line x1=30 y1=0 x2=24 y2=8 style='stroke:black;stroke-width:2'></line></svg></span>\
     <span title='Valley Unfolding'><svg id='toolicon_arrow_valleycrease' height=30 width=30 onclick=select_tool('arrow','valleycrease')><rect height=30 width=30 fill=white></rect><path d='M0 30 Q10 10 30 0' style='stroke:black;stroke-width:2;fill:none'></path><line x1=30 y1=0 x2=20 y2=2 style='stroke:black;stroke-width:2'></line><line x1=30 y1=0 x2=24 y2=8 style='stroke:black;stroke-width:2'></line><path d='M0 30 L0 22 L8 28 Z' style='stroke:black;stroke-width:2;fill:white'></path></svg></span>\
     <spa n title='Mountain'><svg id='toolicon_arrow_mountain' height=30 width=30 onclick=select_tool('arrow','mountain')><rect height=30 width=30 fill=white></rect><path d='M0 30 Q10 10 30 0 L18 1 L20 5' style='stroke:black;stroke-width:2;fill:none'></svg></span>\
     <span title='Mountain Unfolding'><svg id='toolicon_arrow_mountaincrease' height=30 width=30 onclick=select_tool('arrow','mountaincrease')><rect height=30 width=30 fill=white></rect><path d='M0 30 Q10 10 30 0 L18 1 L20 5' style='stroke:black;stroke-width:2;fill:none'></path><path d='M0 30 L0 22 L8 28 Z' style='stroke:black;stroke-width:2;fill:white'></path></svg></span>\
     <span title='Push'><svg id='toolicon_arrow_push' height=30 width=30 onclick=select_tool('arrow','push')><rect height=30 width=30 fill=white></rect><path d='M0 22 L13 9 L11 7 L30 0 L23 19 L21 17 L8 30 L0 22' style='stroke:black;stroke-width:2;fill:none'></path></svg></span>\
     <span title='Repeat'><svg id='toolicon_arrow_repeat' height=30 width=30 onclick=select_tool('arrow','repeat')><rect height=30 width=30 fill=white></rect><path d='M0 30 L30 0 L16 5 M25 14 L30 0 M8 12 L18 22' style='stroke:black;stroke-width:2;fill:none'></svg></span>\
     <span title='Turn Over'><svg id='toolicon_arrow_turnover' height=30 width=30 onclick=select_tool('arrow','turnover')><rect height=30 width=30 fill=white></rect><path d='M0 30 Q7 7 30 0 L18 2 M30 0 L22 8' style='stroke:black;stroke-width:3;fill:none'></path><circle cx=15 cy=15 r=6 style='stroke:black;stroke-width:3;fill:none'></circle></svg></span>\
     &nbsp;&nbsp;&nbsp;<span title='Flip Arrow'><svg id='toolicon_arrowmod_flip' height=30 width=30 onclick=select_tool('arrowmod','flip')><rect height=30 width=30 fill=white></rect><path d='M0 30 Q23 23 30 0 L29 11 M30 0 L22 8' style='stroke:grey;stroke-width:2;fill:none'></path><path d='M0 30 Q7 7 30 0 L19 1 M30 0 L22 7' style='stroke:black;stroke-width:2;fill:none'></path></svg></span>\
     <span title='Erase Arrow'><svg id='toolicon_arrowmod_erase' height=30 width=30 onclick=select_tool('arrowmod','erase')><rect height=30 width=30 fill=white></rect><path d='M0 30 Q7 7 30 0 L19 1 M30 0 L22 7 M4 11 L18 11 M11 4 L11 18' style='stroke:black;stroke-width:2;fill:none'></path></svg></span>\
     <p>Area Tools</p>\
     <span title='Area Fill Front'><svg id='toolicon_area_fillfront' height=30 width=30 onclick=select_tool('area','fillfront')><rect height=30 width=30 fill=white></rect><polygon points='8,8 8,23 20,15 18,9 8,8' style='fill:green'></polygon></svg></span>\
     <span title='Choose Colour Front'><input id=colour_pick_front type=color value=#ffffff></input></span>\
     &nbsp;&nbsp;&nbsp;<span title='Area Erase'><svg id='toolicon_areamod_erase' height=30 width=30 onclick=select_tool('areamod','erase')><rect height=30 width=30 fill=white></rect><polygon points='8,8 8,23 20,15 18,9 8,8' style='fill:green'></polygon><path d='M8 8 L 18 18 M 8 18 L 18 8' style='stroke:black;stroke-width:2;fill:none'></path></svg></span>\
     <br>\
     <span title='Area Fill Back'><svg id='toolicon_area_fillback' height=30 width=30 onclick=select_tool('area','fillback')><rect height=30 width=30 fill=white></rect><polygon points='8,8 8,23 20,15 18,9 8,8' style='fill:green'></polygon></svg></span>\
     <span title='Choose Colour Back'><input id=colour_pick_back type=color value=#d0d0ff></input></span>\
     <p>Point Tools</p>\
     <span title='Free Point'><svg id='toolicon_point_freedot' height='30' width='30' onclick=select_tool('point','freedot')><rect height=30 width=30 fill=white></rect><circle cx=15 cy=15 r=6 fill=darkgrey></circle></svg></span>\
     <span title='Erase Point'><svg id='toolicon_point_erase' height='30' width='30' onclick=select_tool('point','erase')><rect height=30 width=30 fill=white></rect><circle cx=15 cy=15 r=6 fill=darkgrey></circle><path d='M8 8 L22 22 M8 22 L22 8' style='stroke:black;stroke-width:2'></path></svg></span>\
     <span title='Toggle Grid'><svg id='toolicon_point_toggle' height='30' width='30' onclick=toggle_grid()><rect height=30 width=30 style='fill:white'></rect><path d='M15 21 A6 6 0 0 1 15 9 Z' style='fill:darkgrey'></path></svg></span>\
     <br><br>\
     <span title='Download'><button onclick='download_svg()'>Download</button></span>\
    </div>\
   </div>";
  container = {any:document.getElementById('diagram'),
               markers:document.getElementById('diagram_markers'),
               fills:document.getElementById('diagram_fills'),
               lines:document.getElementById('diagram_lines'),
               arrows:document.getElementById('diagram_arrows'),
               grid:document.getElementById('diagram_grid')};

  document.head.appendChild(gridstyle);

  if (grid_type == "square") {
    for (var x = 0; x < grid_density; x++) {
      for (var y = 0; y < grid_density; y++) {
        var d = make_dot((x+0.5)*(size/grid_density),(y+0.5)*(size/grid_density),true);
        container.grid.appendChild(d);
        dots.push(d);
      }
    }
  } else if (grid_type == "isometric") {
    for (var x = 0; x < grid_density; x++) {
      for (var y = 0; y < grid_density*2; y++) {
        var d = make_dot(((x+0.5-(0.5*(y%2)))*(0.5/Math.tan(15*Math.PI/180)))*(size/grid_density), (y+0.5)*(size/(grid_density*2)),true);
        container.grid.appendChild(d);
        dots.push(d);
      }
    }
  }

  container.any.onmousemove = (event)=>{
    var old_element = document.getElementById('preview_drawing');
    if (old_element != null) {
      old_element.remove();
    }
    if (current_tool.type == 'point' && current_tool.subtype == 'freedot') {
      var preview = make_dot(event.clientX-10,event.clientY-10,false);
      preview.id = 'preview_drawing';
      container.grid.appendChild(preview);
    } else if (currently_drawing) {
      switch (current_tool.type) {
        case 'line':
          draw_line(currently_drawing.fromx, currently_drawing.fromy, event.clientX-10, event.clientY-10, current_tool.subtype).id='preview_drawing';
          break;
        case 'arrow':
          draw_arrow(currently_drawing.fromx, currently_drawing.fromy, event.clientX-10, event.clientY-10, current_tool.subtype).id='preview_drawing';
          break;
        case 'area':
          draw_area(currently_drawing.coords.concat([[event.clientX-10,event.clientY-10]]), document.getElementById((current_tool.subtype == 'fillfront')?'colour_pick_front':'colour_pick_back').value).id='preview_drawing';
          break;
     }
  }};
  container.any.onclick = (event)=>{
    if (current_tool.type == 'point' && current_tool.subtype == 'freedot') {
      var newdot = make_dot(event.clientX-10,event.clientY-10,false);
      container.grid.appendChild(newdot);
      dots.push(newdot);
    }
  };

  select_tool('line','edge');
}

function toggle_grid() {
  if (gridstyle.innerHTML == ".dot:hover { stroke:grey; }") {
    gridstyle.innerHTML = ".dot { visibility:hidden; }";
  } else {
    gridstyle.innerHTML = ".dot:hover { stroke:grey; }";
  }
}

function select_tool(type, subtype) {
  document.getElementById('toolicon_'+current_tool.type+'_'+current_tool.subtype).style='';
  document.getElementById('toolicon_'+type+'_'+subtype).style='border-style:solid';
  currently_drawing = false;

  current_tool = {type,subtype};
}

function download_svg() {
  // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  var img = document.createElement("svg");
  // note we're not taking the grid
  img.appendChild(container.markers.cloneNode(true));
  img.appendChild(container.fills.cloneNode(true));
  img.appendChild(container.lines.cloneNode(true));
  img.appendChild(container.arrows.cloneNode(true));
  img.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  var data = img.outerHTML;
  var blob = new Blob([data],{type:"image/svg+xml;charset=utf-8"});
  var url = URL.createObjectURL(blob);
  var download = document.createElement("a");
  download.href = url;
  download.download = 'origami_diagram';
  document.body.appendChild(download);
  download.click();
  download.remove();
}

function clicked_dot(dot) {
  if (current_tool.type != 'point') {
    if (currently_drawing) {
      var old_element = document.getElementById('preview_drawing'); // clean up the preview line without waiting for the user to move the mouse again
      if (old_element != null && current_tool.type != 'area') {
        old_element.remove();
      }
      if (current_tool.type == 'line') {
        if (current_tool.subtype != 'erase') {
          lines.forEach((line)=>{
            var i = intersect(line.getAttribute("x1"),line.getAttribute("y1"),line.getAttribute("x2"),line.getAttribute("y2"),
                              currently_drawing.fromx,currently_drawing.fromy,current_dot_x,current_dot_y);
            if (i) {
              var d = make_dot(i.x,i.y,false);
              container.grid.appendChild(d);
              dots.push(d);
            }});
        }
        var new_line = draw_line(currently_drawing.fromx, currently_drawing.fromy, current_dot_x, current_dot_y, current_tool.subtype);
        dont_overlap(new_line);
        if (current_tool.subtype == 'erase') {
          new_line.remove();
        } else {
          lines.push(new_line);
        }
        currently_drawing = false;
      } else if (current_tool.type == 'arrow') {
        draw_arrow(currently_drawing.fromx, currently_drawing.fromy, current_dot_x, current_dot_y, current_tool.subtype);
        currently_drawing = false;
      } else if (current_tool.type == 'area') {
        //console.log(currently_drawing.coords,current_dot_x,current_dot_y,currently_drawing.coords.includes([current_dot_x,current_dot_y]));
        // can't use coords.includes because in js [1,2] != [1,2]
        if (currently_drawing.coords.reduce((result,point)=>{if (result) { return result; } else { return (point[0]==current_dot_x&&point[1]==current_dot_y);}}, false)) {
          draw_area(currently_drawing.coords.concat([[current_dot_x,current_dot_y]]),document.getElementById((current_tool.subtype == 'fillfront')?'colour_pick_front':'colour_pick_back').value);
          currently_drawing = false;
          old_element.remove();
        } else {
          currently_drawing.coords.push([current_dot_x,current_dot_y]);
        }
      }
    } else {
      if (current_tool.type == 'area') {
        currently_drawing = {'coords':[[current_dot_x,current_dot_y]]};
      } else {
        currently_drawing = {'fromx':current_dot_x,'fromy':current_dot_y};
      }
    }
  } else {
    if (current_tool.subtype == 'erase') {
      if (dot.class != 'default_grid') {
        dot.remove();
      }
    }
  }
}

function clicked_arrow(arrow_id) {
  var arrow = document.getElementById(arrow_id);
  if (current_tool.type == 'arrowmod') {
    if (current_tool.subtype == 'erase') {
      arrow.remove();
    } else if (current_tool.subtype == 'flip') {
      if (arrow.getAttribute("transform") == null || arrow.getAttribute("transform") == "") {
        var x1 = parseFloat(arrow.getAttribute("x1")), y1 = parseFloat(arrow.getAttribute("y1")), x2 = parseFloat(arrow.getAttribute("x2")), y2 = parseFloat(arrow.getAttribute("y2"));
        // rotate by the inverse of the angle the line makes with the x axis(?)
        arrow.setAttribute("transform", "translate("+(((x1+x2)/2))+","+(((y1+y2)/2))+") scale(-1,1) rotate("+(((y1==y2)?180:0)+((Math.sign(x1-x2)*Math.sign(y1-y2))*(360/Math.PI)*Math.asin(Math.abs(x1-x2)/Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)))))+") translate("+(-((x1+x2)/2))+","+(-((y1+y2)/2))+")");
      } else {
        arrow.setAttribute("transform", "");
      }
    }
  }
}

function clicked_area(area_id) {
  if (current_tool.type == 'areamod' && current_tool.subtype == 'erase') {
    document.getElementById(area_id).remove();
  }
}

function draw_line(x1,y1,x2,y2,type) {
  switch (type) {
    case 'valley':
      var new_element = make_line(x1,y1,x2,y2,"stroke:blue;stroke-width:3;stroke-dasharray:10 5");
      break;
    case 'mountain':
      var new_element = make_line(x1,y1,x2,y2,"stroke:red;stroke-width:3;stroke-dasharray:10 5 5 5 5 5");
      break;
    case 'crease':
      var new_element = make_line(x1,y1,x2,y2,"stroke:black;stroke-width:1");
      break;
    case 'xray':
      var new_element = make_line(x1,y1,x2,y2,"stroke:black;stroke-width:2;stroke-dasharray:2 3");
      break;
    case 'edge':
      var new_element = make_line(x1,y1,x2,y2,"stroke:black;stroke-width:3");
      break;
    case 'erase':
      var new_element = make_line(x1,y1,x2,y2,"stroke:gainsboro;stroke-width:3");
      break
  }
  new_element.class = type;
  container.lines.appendChild(new_element);
  return new_element;
}

function draw_arrow(x1,y1,x2,y2,type) {
  switch (type) {
    case 'valley':
      var head='valley', body='normal', tail='none';
      break;
    case 'mountain':
      var head='mountain', body='normal', tail='none';
      break;
    case 'valleycrease':
      var head='valley', body='normal', tail='unfold';
      break;
    case 'mountaincrease':
      var head='mountain', body='normal', tail='unfold';
      break;
    case 'repeat':
      var head='valley', body='repeat', tail='none';
      break;
    case 'push':
      var head='none', body='push', tail='none';
      break;
    case 'turnover':
      var head='valley', body='turnover', tail='none';
      break;
  }
  var arrow = make_arrow(x1,y1,x2,y2,head,body,tail);
  container.arrows.appendChild(arrow);
  return arrow;
}

function draw_area(coords, colour) {
  var new_area = make_area(coords, colour);
  container.fills.appendChild(new_area);
  return new_area;
}

function make_line(x1,y1,x2,y2,style) {
  var new_element = document.createElementNS("http://www.w3.org/2000/svg", "line");
  new_element.setAttribute("x1", x1);
  new_element.setAttribute("y1", y1);
  new_element.setAttribute("x2", x2);
  new_element.setAttribute("y2", y2);
  if (isNaN(x1) || isNaN(new_element.getAttribute("x1"))) { // there's an intermittent bug, if this triggers it'll tell us more about it
    console.log("line drawing bug occurred: ",x1,y1,x2,y2);
  }
  new_element.style = style;
  return new_element;
}

function make_dot(x,y,grid) {
  var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute("class", "dot");
  dot.setAttribute("r", 4.5);
  same_dot = dots.reduce((result,this_dot)=>{
    if (result != false) {
      return result;
    } else {
      if (Math.abs(x-this_dot.getAttribute("cx"))<4 && Math.abs(y-this_dot.getAttribute("cy"))<4) {
        return {x:this_dot.getAttribute("cx"),y:this_dot.getAttribute("cy")};
      } else {
        return false;
      }
    }
  },false);
  if (same_dot == false) {
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
  } else {
    dot.setAttribute("cx", same_dot.x);
    dot.setAttribute("cy", same_dot.y);
  }
  dot.setAttribute("fill", "darkgrey");
  dot.setAttribute("stroke-width", 5);
  if (grid) {
    dot.class = 'default_grid';
  }
  dot.onmouseover = ((x,y)=>{return ()=>{current_dot_x = x; current_dot_y = y;}})(x,y);
  dot.onmouseout = ()=>{current_dot_x = false; current_dot_y = false;}
  dot.onclick = ((dot)=>{return ()=>{clicked_dot(dot)}})(dot);
  return dot;
}

function make_arrow(x1,y1,x2,y2,headtype,bodytype,tailtype) {
  var arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrow.setAttribute("x1",x1); // for the flip tool, because that information can't always be extracted from the finished arrow
  arrow.setAttribute("x2",x2);
  arrow.setAttribute("y1",y1);
  arrow.setAttribute("y2",y2);
  if (bodytype == 'repeat') {
    arrow.setAttribute("d", "M" + (((x1+x2)/2)-((y1-y2)/7)) + " " + (((y1+y2)/2)-((x2-x1)/7)) + " L" + (((x1+x2)/2)+((y1-y2)/7)) + " " + (((y1+y2)/2)+((x2-x1)/7)) + " M"+ x1 + " " + y1 + " L" + x2 + " " + y2);
    arrow.setAttribute("style", "stroke:black;stroke-width:2;fill:none;marker-end:url(#"+headtype+"_head);"+((tailtype=='unfold')?"marker-start:url(#unfold_tail)":""));
  } else if (bodytype == 'push') {
    arrow.setAttribute("d", "M" + (x1-((y1-y2)/5)) + " " + (y1-((x2-x1)/5)) + " L" + (((x1+x2)/2)-((y1-y2)/5)) + " " + (((y1+y2)/2)-((x2-x1)/5)) + " L" + (((x1+x2)/2)-((y1-y2)/3)) + " " + (((y1+y2)/2)-((x2-x1)/3)) + " L" + x2 + " " + y2 + " L" + (((x1+x2)/2)+((y1-y2)/3)) + " " + (((y1+y2)/2)+((x2-x1)/3)) + " L" + (((x1+x2)/2)+((y1-y2)/5)) + " " + (((y1+y2)/2)+((x2-x1)/5)) + " L" + (x1+((y1-y2)/5)) + " " + (y1+((x2-x1)/5)) + " Z");
    arrow.setAttribute("style", "stroke:black;stroke-width:2;fill:white;");
  } else if (bodytype == 'turnover') {
    arrow.setAttribute("d", "M" + (((x1+x2)/2)-((y1-y2)/4)) + " " + (((y1+y2)/2)-((x2-x1)/4)) + " A" + (Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))/4) + " " + (Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))/4) + " 0 1 0 " + (((x1+x2)/2)+((y1-y2)/4)) + " " + (((y1+y2)/2)+((x2-x1)/4)) + " A" + (Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))/4) + " " + (Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))/4) + " 0 1 0 " + (((x1+x2)/2)-((y1-y2)/4)) + " " + (((y1+y2)/2)-((x2-x1)/4)) + " M" + x1 + " " + y1 + " Q" + (((x1+x2)/2)-((y1-y2)/2)) + " " + (((y1+y2)/2)-((x2-x1)/2)) + " " + x2 + " " + y2);
    arrow.setAttribute("style", "stroke:black;stroke-width:3;fill:none;marker-end:url(#"+headtype+"_head);"+((tailtype=='unfold')?"marker-start:url(#unfold_tail)":""));
  } else {
    arrow.setAttribute("d", "M" + x1 + " " + y1 + " Q" + (((x1+x2)/2)-((y1-y2)/4)) + " " + (((y1+y2)/2)-((x2-x1)/4)) + " " + x2 + " " + y2);
    arrow.setAttribute("style", "stroke:black;stroke-width:2;fill:none;marker-end:url(#"+headtype+"_head);"+((tailtype=='unfold')?"marker-start:url(#unfold_tail)":""));
  }
  arrow.setAttribute("class", "arrow");
  arrow.id = 'arrow_' + arrows;
  arrow.onclick=((arrows)=>{return ()=>{clicked_arrow('arrow_'+arrows)}})(arrows);
  arrows++;
  return arrow;
}

function make_area(coords, colour) {
  var area = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  area.setAttribute("points", coords.reduce((result,point)=>{return result+(" "+point[0]+","+point[1]);}));
  area.setAttribute("style", "fill:"+colour);
  area.id = "area_" + areas;
  area.onclick = ((areas)=>{return ()=>{clicked_area("area_"+areas)}})(areas);
  areas++;
  return area;
}

function dont_overlap(new_line) {
  var x1 = new_line.getAttribute("x1"), y1 = new_line.getAttribute("y1"), x2 = new_line.getAttribute("x2"), y2 = new_line.getAttribute("y2");
  var to_remove = [];
  lines.forEach((line)=>{
  var x3 = line.getAttribute("x1"), y3 = line.getAttribute("y1"), x4 = line.getAttribute("x2"), y4 = line.getAttribute("y2");
  if (colinear(x1,y1,x2,y2,x3,y3,x4,y4)) {
    console.log(x1,x2);
    if (Math.abs(x1-x2) < 1) { // special case where we can't use x position to order points on the line uniquely. imprecise in case someone constructs two points that should be directly above each other but floating points get in the way - you can't draw a line with both x and y < 1 because of the minimum point displacement
      var d1 = y1, d2 = y2, d3 = y3, d4 = y4;
    } else {
      var d1 = x1, d2 = x2, d3 = x3, d4 = x4;
    }
    var order = [d1,d2,d3,d4].sort((a,b)=>{return a-b;});
    if ((order[0]==d1 && order[1]==d2) || (order[0]==d2 && order[1]==d1) || (order[0]==d3 && order[1]==d4) || (order[0]==d4 && order[1]==d3) || order[1] == order[2]) {
      // no overlap
    } else {
      to_remove.push(line); // if we remove now it fucks up lines while traversing it
      if ((order[0] == d3 || order[0] == d4) && order[0] != order[1]) {
        if (x1 == x2) { // also do this bit different
          lines.push(draw_line(y_to_x(x1,y1,x2,y2,order[0]),order[0],y_to_x(x1,y1,x2,y2,order[1]),order[1],line.class));
        } else {
          lines.push(draw_line(order[0],x_to_y(x1,y1,x2,y2,order[0]),order[1],x_to_y(x1,y1,x2,y2,order[1]),line.class));
        }
      }
      if ((order[3] == d3 || order[3] == d4) && order[2] != order[3]) {
        if (x1 == x2) {
          lines.push(draw_line(y_to_x(x1,y1,x2,y2,order[3]),order[3],y_to_x(x1,y1,x2,y2,order[2]),order[2],line.class));
        } else {
          lines.push(draw_line(order[3],x_to_y(x1,y1,x2,y2,order[3]),order[2],x_to_y(x1,y1,x2,y2,order[2]),line.class));
        }
      }
    }
  }});
  to_remove.forEach((line)=>{
      lines.splice(lines.indexOf(line),1); // cut from lines
      line.remove();
  });
}

function intersect(x1,y1,x2,y2,x3,y3,x4,y4) {
  var abc = which_side(x1,y1,x2,y2,x3,y3);
  var abd = which_side(x1,y1,x2,y2,x4,y4);
  var cda = which_side(x3,y3,x4,y4,x1,y1);
  var cdb = which_side(x3,y3,x4,y4,x2,y2);
  // if the endpoints of both lines lie on opposite sides of the other line, there's an intersection
  if (abc != abd && cda != cdb && abc != 0 && abd != 0 && cda != 0 && cdb != 0) {
    // put lines in ax+by=c form
    var a1 = y1-y2;
    var b1 = x2-x1;
    var c1 = -((x1*y2)-(x2*y1));
    var a2 = y3-y4;
    var b2 = x4-x3;
    var c2 = -((x3*y4)-(x4*y3));
    // https://stackoverflow.com/questions/4543506/algorithm-for-intersection-of-2-lines
    if (a1*b2 == a2*b1) {
      return false; // lines overlap, with infinitely many intersections
    } else {
      return {x:(b2*c1 - b1*c2)/(a1*b2 - a2*b1), y:(a1*c2 - a2*c1)/(a1*b2 - a2*b1)};
    }
  } else {
    return false;
  }
}

function which_side(x1,y1,x2,y2,x3,y3) {
  // https://stackoverflow.com/questions/1560492/how-to-tell-whether-a-point-is-to-the-right-or-left-side-of-a-line
  var d = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
  if (Math.abs(d) < 1) { // avoid rounding errors, if it's that close it's probably supposed to be on the line
    return 0;
  } else {
    return Math.sign(d);
  }
}

function colinear(x1,y1,x2,y2,x3,y3,x4,y4) {
  var abc = which_side(x1,y1,x2,y2,x3,y3);
  var abd = which_side(x1,y1,x2,y2,x4,y4);
  var cda = which_side(x3,y3,x4,y4,x1,y1);
  var cdb = which_side(x3,y3,x4,y4,x2,y2);
  return abc == 0 && abd == 0 && cda == 0 && cdb == 0;
}

function x_to_y(x1,y1,x2,y2,x_in) {
  var a = y1-y2, b = x2-x1, c = -((x1*y2)-(x2*y1));
  return (c - (a*x_in))/b;
}
function y_to_x(x1,y1,x2,y2,y_in) {
  var a = y1-y2, b = x2-x1, c = -((x1*y2)-(x2*y1));
  return (c - (b*y_in))/a;
}
