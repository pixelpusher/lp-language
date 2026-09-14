// unfolded setup


// top of col tri
global topColTri = {{
  
  // up
  # turn (pi/2 + ang1) true | speed yspeed
  # drawtime dur //10

  // top of second row
  # turn (3*pi/2 - ang1) true | speed hspeed
  # drawtime dur //11
  # turn (pi + ang1) true | speed xspeed
  # drawtime dur //12
}};

// jagged tris in 3rd col
// zig-zag then finish up
global jaggies = {{
  for (let i=0; i<times; i++) {
  
    # turn (pi - ang1) true | speed hspeed | drawtime dur //13 / 15
    
    if (i < times-1) {
      // turn back
      #  turn (pi + ang1) true | speed xspeed | drawtime dur //16
    }
    else 
    {
      // turn up for next col
      #  turn (pi/2 + ang1) true | speed yspeed | drawtime dur //14
    }
  }
}};

global test1 = {{

  ## 
  turnto pi/2 
  
  turn (2*pi -  ang1) true
  speed hspeed
  drawtime dur //1
  turn (pi/2 + ang1) true
  speed yspeed
  drawtime dur //2
  turn (pi/2) true
  speed xspeed  
  drawtime dur //3
  turn (pi + pi/2) true
  speed yspeed
  drawtime dur //4

  // repeat
  turn (3*pi/2 - ang1) true
  speed hspeed
  drawtime dur //5
  turn (pi/2 + ang1) true
  speed yspeed
  drawtime dur //6
  turn (pi/2) true
  speed xspeed  
  drawtime dur //7
  turn (pi + pi/2) true
  speed yspeed  
  drawtime dur //8

  // top same
  turn (3*pi/2 - ang1) true
  speed hspeed
  drawtime dur //9
  ##
}};


global col1 = {{
  ##
  turn (3*pi/2 - ang1) true  
  speed hspeed
  drawtime dur
  turn (pi/2 + ang1) true
  speed yspeed  
  drawtime dur

  turn (pi/2) true
  speed xspeed  
  drawtime dur

  turn (pi + pi/2) true
  speed yspeed  
  drawtime dur

  // repeat
  turn (3*pi/2 - ang1) true
  speed hspeed  
  drawtime dur

  turn (pi/2 + ang1) true
  speed yspeed  
  drawtime dur

  turn (pi/2) true
  speed xspeed  
  drawtime dur
  
  turn (pi + pi/2) true
  speed yspeed  
  drawtime dur

  // top same
  turn (3*pi/2 - ang1) true
  speed hspeed  
  drawtime dur
  ##
}};

