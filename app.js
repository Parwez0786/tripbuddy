const express = require("express");
const axios = require("axios");
const path = require("path");
const { connect } = require("http2");
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define the directory where static files are located
app.use(express.static(path.join(__dirname, "public")));

// Define route for fetching trip information

app.get("/trip-info", async (req, res) => {
  try {
    const { source, destination } = req.query;
    //  console.log(source, destination);

    // Fetch weather for source and destination
    const weatherS = await getWeather(source);
    const weatherSource = weatherS;
    const sourcelon = weatherSource.coord.lon;
    //console.log(sourcelon);
    const weatherD = await getWeather(destination);
    const weatherDestination = weatherD;
   // console.log(weatherDestination);
   

    
    const sourcelat = weatherS.coord.lat;
    const destinationlon = weatherD.coord.lon;
    const destinationlat = weatherD.coord.lat;
    //console.log(sourcelon, sourcelat, destinationlat, destinationlon);
    // // Fetch time zone difference
    const timeZonesource = await getTimeZoneDifference(sourcelat, sourcelon);
    const timeZoneDest = await getTimeZoneDifference(
      destinationlat,
      destinationlon
    );
    // // Fetch interesting activities in the destination
    // const activities = await getInterestingActivities(destination);
    timeZoneDiff = await calculateTimeZoneDifference(
      timeZonesource,
      timeZoneDest
    );



    res.json({
      weatherSource,
      weatherDestination,
      timeZoneDiff,
      //   activities
    });

  } catch (error) {
    // console.log("s");
    res.status(500).json({ error: error.message });
  }
});
async function getWeather(city) {
  const link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=589630b36dd939167844e0b8eb0f7848`;
  const response = await axios.get(link);
  //  console.log(response);
  return response.data;
}

async function getTimeZoneDifference(lat, lon) {
  const apiKey = "AIzaSyAQy3gNFf6KhyYeWuxjbW5gLJ7LIsbh9rA";
  const sourceTimezone = await axios.get(
    `http://api.timezonedb.com/v2.1/get-time-zone?key=RENNQQD4KM5A&format=json&by=position&lat=${lat}&lng=${lon}`
  );
  //  console.log(sourceTimezone);
  return sourceTimezone.data;
}

async function calculateTimeZoneDifference(city1, city2) {
  // Assuming that you have the timezone information for both cities in the following format:
  // { gmtOffset: -14400 }


  // Convert gmtOffset to seconds
  const city1OffsetSeconds = city1.gmtOffset;
  const city2OffsetSeconds = city2.gmtOffset;
  console.log(city1OffsetSeconds);
  console.log(city2OffsetSeconds);
  // Calculate time zone difference in seconds
  const timeZoneDifferenceSeconds = city1OffsetSeconds - city2OffsetSeconds;

  // Convert time zone difference from seconds to hours

 

  return timeZoneDifferenceSeconds/3600;
}




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
