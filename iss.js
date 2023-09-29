//collaborated/pair programmed with @cknowles90

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require("request");

const fetchMyIP = (callback) => {
  const ipURL = `https://api.ipify.org/?format=json`;

  request(ipURL, (error, response, body) => {

    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);
    
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      //(alternative)callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all's well and we got the data
    //(alternative) const ip = JSON.parse(body).ip;
    const data = JSON.parse(body);
    const myIpAddress = data.ip;

    callback(null, myIpAddress);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  const coordsURL = `http://ipwho.is/${ip}`;

  request(coordsURL, (error, response, body) => {

   
    if (error) return callback(error, null);
    
    const data = JSON.parse(body);
    
    if (!data.success) {
      const msg = `Success status was ${data.success} Server message is: ${data.message} when fetching for IP ${data.ip}`;
      callback(Error(msg), null);
      return;
    }
  
    
    // LHL alternative: const { latitude, longitude } = parsedBody;
    const latitude = data.latitude;
    const longitude = data.longitude;
    const myCoords = {
      latitude,
      longitude
    };
    // LHL alternative: callback(null, {latitude, longitude});
    callback(null, myCoords);
  });
};



const fetchISSFlyOverTimes = (coordinates, callback) => {
  const issURL = `https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;

  request(issURL, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const data = JSON.parse(body);

    const passTimes = data.response;
  
    callback(null, passTimes);
  });
};

// module.exports = {
//   fetchmyIP,
//   fetchMyIP,
//   fetchISSFlyOverTimes
// };



/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coordinates) => {
        if (error) {
          return callback(error, null);
        }
      fetchISSFlyOverTimes(coordinates,(error, passTimes) => {
          if (error) {
            return callback(error, null);
          }
        callback(null, passTimes);
      });
    });
  })
}


module.exports = nextISSTimesForMyLocation;