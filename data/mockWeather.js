export const nutechStation = {
  id: 'nutech',
  name: 'NUTECH Main Station',
  location: 'Islamabad, Sector I-12',
  elevation: '540m ASL',
  isOnline: true,
  lastUpdated: 'Just now (11:55 AM)',
  current: {
    temp: 29.4,
    feelsLike: 31.8,
    condition: 'Partly Cloudy',
    icon: 'CloudSun',
    humidity: 64, // %
    pressure: 1012, // hPa
    windSpeed: 14.5, // km/h
    windDirection: 'ENE (68°)',
    solarRadiation: 842, // W/m²
    soilMoisture: 42.5, // %
    co2: 418, // ppm
    visibility: 9.8, // km
    sunrise: '05:18 AM',
    sunset: '07:12 PM',
    moonPhase: 'Waxing Gibbous (74%)',
    aqi: 68, // Moderate
    aqiStatus: 'Moderate',
    dewPoint: 21.2, // °C
    uvIndex: 7, // High
    rainRate: 0.0, // mm/h
  },
  alerts: [
    {
      id: 'alt-1',
      type: 'warning',
      title: 'High UV Index Warning',
      message: 'UV Index expected to peak at 9 near midday (12:30 PM - 2:30 PM). Protect exposed skin.',
      timestamp: '10:30 AM',
    },
  ],
  hourly: [
    { time: '12 PM', temp: 31.2, condition: 'Sunny', humidity: 58, rainProb: 10, icon: 'Sun' },
    { time: '01 PM', temp: 32.5, condition: 'Sunny', humidity: 54, rainProb: 15, icon: 'Sun' },
    { time: '02 PM', temp: 33.0, condition: 'Partly Cloudy', humidity: 52, rainProb: 20, icon: 'CloudSun' },
    { time: '03 PM', temp: 32.8, condition: 'Partly Cloudy', humidity: 55, rainProb: 25, icon: 'CloudSun' },
    { time: '04 PM', temp: 31.5, condition: 'Clouds', humidity: 60, rainProb: 30, icon: 'Cloud' },
    { time: '05 PM', temp: 30.1, condition: 'Clouds', humidity: 65, rainProb: 35, icon: 'Cloud' },
    { time: '06 PM', temp: 28.9, condition: 'Scattered Showers', humidity: 72, rainProb: 60, icon: 'CloudRain' },
    { time: '07 PM', temp: 27.2, condition: 'Light Rain', humidity: 78, rainProb: 75, icon: 'CloudRain' },
  ],
  forecast7Days: [
    { day: 'Today', maxTemp: 33, minTemp: 24, condition: 'Partly Cloudy', icon: 'CloudSun', rainProb: 25, aqi: 68 },
    { day: 'Mon', maxTemp: 34, minTemp: 25, condition: 'Sunny', icon: 'Sun', rainProb: 10, aqi: 72 },
    { day: 'Tue', maxTemp: 32, minTemp: 23, condition: 'Thunderstorm', icon: 'CloudLightning', rainProb: 80, aqi: 45 },
    { day: 'Wed', maxTemp: 30, minTemp: 22, condition: 'Moderate Rain', icon: 'CloudRain', rainProb: 70, aqi: 38 },
    { day: 'Thu', maxTemp: 31, minTemp: 23, condition: 'Cloudy', icon: 'Cloud', rainProb: 30, aqi: 52 },
    { day: 'Fri', maxTemp: 33, minTemp: 24, condition: 'Sunny', icon: 'Sun', rainProb: 15, aqi: 65 },
    { day: 'Sat', maxTemp: 35, minTemp: 26, condition: 'Clear Sky', icon: 'Sun', rainProb: 5, aqi: 82 },
  ],
};

export const STATIONS = [nutechStation];
export const defaultStation = nutechStation;
