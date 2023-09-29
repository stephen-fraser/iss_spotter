//
// Pair Programmed with Stephen Fraser - W2D4 - @cknowles90 - github/cknowles90
//

const { nextISSTimesForMyLocation } = require("./iss_promised");

const printPassTimes = function(passTimes) { 
  for (const pass of passTimes) {            
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;         
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
}; 

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })

  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });