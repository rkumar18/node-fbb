const express = require("express");
const route = require("./routes");
const app = express();
const connect = require("./connection/connect");
const config = require("config");
connect();
app.use(express.json());
app.use("/api", route);
// var geohash = require('ngeohash');
// console.log(geohash.encode(37.8324, 112.5584));
// // prints ww8p1r4t8
// var latlon = geohash.decode('ww8p1r4t8');
// console.log(latlon.latitude);
// console.log(latlon.longitude);





// const getGeohashRange = (
//   latitude,
//   longitude,
//   distance, // miles
// ) => {
//   const lat = 0.0144927536231884; // degrees latitude per mile
//   const lon = 0.0181818181818182; // degrees longitude per mile

//   const lowerLat = latitude - lat * distance;
//   const lowerLon = longitude - lon * distance;

//   const upperLat = latitude + lat * distance;
//   const upperLon = longitude + lon * distance;

//   const lower = geohash.encode(lowerLat, lowerLon);
//   const upper = geohash.encode(upperLat, upperLon);

//   return {
//     lower,
//     upper
//   };
// };
// console.log(getGeohashRange(30.7046,76.7179, 3)); 





const h3 = require("h3-js");
const h3Index = h3.geoToH3(21.4811, 73.6330, 7);
const h3Index1 = h3.geoToH3(30.9578, 76.7914, 7);
console.log(h3Index);
console.log(h3Index1);
console.log(h3.h3Distance(h3Index,h3Index1));
const kRing = h3.kRing(h3Index1, 10);
// console.log("ring", kRing);

const parent = h3.h3ToParent(h3Index1, 3) ;
const parent1 = h3.h3ToParent(h3Index, 3) ;
console.log('parent', parent);
console.log('parent1', parent1);
console.log(h3.h3ToGeo(h3Index));
app.listen(config.get("port") || process.env.PORT, () =>
  console.log(`fb-node listening on port ${config.get("port")}`)
);
