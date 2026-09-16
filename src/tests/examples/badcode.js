// test

// saw spiral

global s = 1;

global rootNote = 261.63/s;

global bumps = 12;         // Number of teeth per spiral rotation

// Microtonal & Geometric Parameters
global rootNote = 261.63; // C4 fundamental
global a = 6;             // Numerator (e.g., 7 for septimal interval)
global b = 5;             // Denominator (e.g., 5)

// 1. Precompute microtonal hypotenuse scaling
global hyp_ratio = Math.sqrt(a * a + b * b);

global a2 = 3;             // Numerator (e.g., 7 for septimal interval)
global b2 = 2;             // Denominator (e.g., 5)

// 1. Precompute microtonal hypotenuse scaling
global hyp_ratio2 = Math.sqrt(a * a + b * b);
  
const baseAngle = 2 * pi / bumps;
  
// Microtonal Angle: derives the tooth angle directly from the harmonic ratio
const theta = Math.atan2(a, b); 


// 2. Cycle print speeds through the microtonal triangle components
global notes = new seq(
  `${rootNote}hz`,                    // Base
  `${rootNote * (hyp_ratio / b2)}hz`, // Hypotenuse
  `${rootNote}hz`,                    // Base
  `${rootNote * (a / b)}hz`,         // Height
  `${rootNote * (hyp_ratio2 / a2)}hz`,                    // Base
  `${rootNote * (hyp_ratio2 / b2)}hz`, // Hypotenuse
);

global maxZ = 5;
global ctr = 0;

global smallB = '1/2b';
global bigB = '1b';

// draw sawtooth spiral gear thing
//---------------------------------
global drawSpiral = async ()=>{
  if (lp.z > maxZ) {
    # bail
    info("FINISHED");
  }

  # elev t:`${bumps*5.5}b`

  const smallL = lp.t2mm(smallB);
  const bigL = lp.t2mm(bigB);



  // Modulation for organic variation on the long teeth
  const bigL2 = bigL;
    //bigL * (0.5 + 0.5 * Math.cos(0.0125 * ctr / bumps) + 0.5 * Math.sin(0.025 * ctr / bumps));

  // Shifts speed (pitch) once per tooth
  # speed notes.next() 
  lp.turn(theta, true);
  await lp.draw(smallL);
  updateGUI();


  lp.turn(-theta, true);
  await lp.draw(smallL);
  updateGUI();

  lp.turn(theta + Math.PI, true);
  await lp.draw(bigL2);
  updateGUI();

  lp.turn(-theta - Math.PI, true);
  await lp.draw(smallL);
  updateGUI();

  lp.turn(theta, true);
  await lp.draw(bigL2);
  updateGUI();

  lp.turn(-theta, true);
  updateGUI();

  await lp.draw(smallL);
  lp.turn(baseAngle, true);
  updateGUI();

  await lp.draw(smallL);
  updateGUI();

  ctr++;
};

