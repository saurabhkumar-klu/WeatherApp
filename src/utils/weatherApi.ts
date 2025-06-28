import { WeatherData } from '../types/weather';
import { allLocations } from '../data/indianLocations';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (query: string): Promise<WeatherData> => {
  try {
    console.log(`Searching weather for: "${query}"`);
    
    // Check if API key is available
    if (!API_KEY || API_KEY === 'demo_key_replace_with_real_api_key') {
      console.log('Using demo data - API key not configured');
      return getMockWeatherData(query);
    }
    
    // First, try to find the location in our database for better coordinates
    const location = findLocationInDatabase(query);
    
    let weatherResponse;
    if (location && location.lat && location.lon) {
      // Use coordinates if available
      weatherResponse = await fetch(
        `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
      );
    } else {
      // Use city name search
      weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`
      );
    }

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 401) {
        console.log('Invalid API key, falling back to demo data');
        return getMockWeatherData(query);
      } else if (weatherResponse.status === 404) {
        throw new Error(`Location "${query}" not found. Please try a different city name or pincode.`);
      } else {
        console.log('API error, falling back to demo data');
        return getMockWeatherData(query);
      }
    }

    const currentWeather = await weatherResponse.json();
    
    // Fetch forecast data
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${currentWeather.coord.lat}&lon=${currentWeather.coord.lon}&appid=${API_KEY}&units=metric`
    );

    if (!forecastResponse.ok) {
      console.log('Forecast API error, using current weather only');
      return convertToWeatherDataWithoutForecast(currentWeather, location);
    }

    const forecastData = await forecastResponse.json();
    return convertToWeatherData(currentWeather, forecastData, location);
  } catch (error) {
    console.error('Weather API error:', error);
    console.log('Falling back to demo data');
    return getMockWeatherData(query);
  }
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
    
    // Check if API key is available
    if (!API_KEY || API_KEY === 'demo_key_replace_with_real_api_key') {
      console.log('Using demo data - API key not configured');
      return getMockWeatherDataForCoords(lat, lon, `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
    }
    
    // Fetch current weather
    const weatherResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 401) {
        console.log('Invalid API key, falling back to demo data');
        return getMockWeatherDataForCoords(lat, lon, `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
      } else {
        console.log('API error, falling back to demo data');
        return getMockWeatherDataForCoords(lat, lon, `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
      }
    }

    const currentWeather = await weatherResponse.json();
    
    // Fetch forecast data
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!forecastResponse.ok) {
      console.log('Forecast API error, using current weather only');
      const location = findLocationByCoords(lat, lon);
      return convertToWeatherDataWithoutForecast(currentWeather, location);
    }

    const forecastData = await forecastResponse.json();
    const location = findLocationByCoords(lat, lon);
    return convertToWeatherData(currentWeather, forecastData, location);
  } catch (error) {
    console.error('Weather API error:', error);
    console.log('Falling back to demo data');
    return getMockWeatherDataForCoords(lat, lon, `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
  }
};

const findLocationInDatabase = (query: string) => {
  const isPincode = /^\d{6}$/.test(query);
  
  if (isPincode) {
    return allLocations.find(loc => loc.pincode === query);
  } else {
    // Try exact match first
    let location = allLocations.find(loc => 
      loc.name.toLowerCase() === query.toLowerCase()
    );

    // If no exact match, try partial match
    if (!location) {
      location = allLocations.find(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // If still no match, try region match
    if (!location) {
      location = allLocations.find(loc => 
        loc.region.toLowerCase().includes(query.toLowerCase())
      );
    }

    return location;
  }
};

const findLocationByCoords = (lat: number, lon: number) => {
  // Find the closest location in our database (simple distance calculation)
  let closestLocation = null;
  let minDistance = Infinity;

  for (const location of allLocations) {
    if (location.lat && location.lon) {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + Math.pow(lon - location.lon, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = location;
      }
    }
  }

  return closestLocation;
};

const convertToWeatherData = (currentWeather: any, forecastData: any, dbLocation?: any): WeatherData => {
  // Group forecast data by days
  const forecastDays = groupForecastByDays(forecastData.list);

  return {
    location: {
      name: currentWeather.name,
      country: currentWeather.sys.country,
      region: currentWeather.sys.country === 'IN' ? getIndianState(currentWeather.coord.lat, currentWeather.coord.lon) : currentWeather.sys.country,
      lat: currentWeather.coord.lat,
      lon: currentWeather.coord.lon,
      tz_id: getTimezone(currentWeather.coord.lat, currentWeather.coord.lon),
      localtime: new Date().toISOString().slice(0, -5),
      pincode: dbLocation?.pincode,
    },
    current: {
      temp_c: Math.round(currentWeather.main.temp),
      temp_f: Math.round(currentWeather.main.temp * 9/5 + 32),
      condition: {
        text: capitalizeWords(currentWeather.weather[0].description),
        icon: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
        code: currentWeather.weather[0].id,
      },
      wind_mph: Math.round((currentWeather.wind?.speed || 0) * 2.237),
      wind_kph: Math.round((currentWeather.wind?.speed || 0) * 3.6),
      wind_dir: getWindDirection(currentWeather.wind?.deg || 0),
      pressure_mb: currentWeather.main.pressure,
      pressure_in: Math.round(currentWeather.main.pressure * 0.02953 * 100) / 100,
      precip_mm: currentWeather.rain?.['1h'] || 0,
      precip_in: Math.round((currentWeather.rain?.['1h'] || 0) * 0.0394 * 100) / 100,
      humidity: currentWeather.main.humidity,
      cloud: currentWeather.clouds.all,
      feelslike_c: Math.round(currentWeather.main.feels_like),
      feelslike_f: Math.round(currentWeather.main.feels_like * 9/5 + 32),
      vis_km: Math.round((currentWeather.visibility || 10000) / 1000),
      vis_miles: Math.round((currentWeather.visibility || 10000) / 1609),
      uv: calculateUVIndex(currentWeather.coord.lat, currentWeather.coord.lon),
      gust_mph: Math.round((currentWeather.wind?.gust || 0) * 2.237),
      gust_kph: Math.round((currentWeather.wind?.gust || 0) * 3.6),
    },
    forecast: {
      forecastday: forecastDays,
    },
  };
};

const convertToWeatherDataWithoutForecast = (currentWeather: any, dbLocation?: any): WeatherData => {
  // Generate mock forecast data when API forecast is not available
  const mockForecastDays = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60,
    day: {
      maxtemp_c: Math.round(currentWeather.main.temp + Math.random() * 6 - 3),
      maxtemp_f: Math.round((currentWeather.main.temp + Math.random() * 6 - 3) * 9/5 + 32),
      mintemp_c: Math.round(currentWeather.main.temp - Math.random() * 8),
      mintemp_f: Math.round((currentWeather.main.temp - Math.random() * 8) * 9/5 + 32),
      avgtemp_c: Math.round(currentWeather.main.temp),
      avgtemp_f: Math.round(currentWeather.main.temp * 9/5 + 32),
      maxwind_mph: Math.round((currentWeather.wind?.speed || 0) * 2.237 + Math.random() * 10),
      maxwind_kph: Math.round((currentWeather.wind?.speed || 0) * 3.6 + Math.random() * 16),
      totalprecip_mm: Math.random() * 5,
      totalprecip_in: Math.random() * 0.2,
      totalsnow_cm: 0,
      avgvis_km: Math.round((currentWeather.visibility || 10000) / 1000),
      avgvis_miles: Math.round((currentWeather.visibility || 10000) / 1609),
      avghumidity: currentWeather.main.humidity + Math.round(Math.random() * 20 - 10),
      daily_will_it_rain: Math.random() > 0.7 ? 1 : 0,
      daily_chance_of_rain: Math.round(Math.random() * 100),
      daily_will_it_snow: 0,
      daily_chance_of_snow: 0,
      condition: {
        text: capitalizeWords(currentWeather.weather[0].description),
        icon: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
        code: currentWeather.weather[0].id,
      },
      uv: calculateUVIndex(currentWeather.coord.lat, currentWeather.coord.lon),
    },
    hour: Array.from({ length: 24 }, (_, h) => ({
      time_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60 + h * 60 * 60,
      time: new Date(Date.now() + i * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000).toISOString(),
      temp_c: Math.round(currentWeather.main.temp + Math.sin(h / 24 * Math.PI * 2) * 5),
      temp_f: Math.round((currentWeather.main.temp + Math.sin(h / 24 * Math.PI * 2) * 5) * 9/5 + 32),
      is_day: h >= 6 && h <= 18 ? 1 : 0,
      condition: {
        text: capitalizeWords(currentWeather.weather[0].description),
        icon: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
        code: currentWeather.weather[0].id,
      },
      wind_mph: Math.round((currentWeather.wind?.speed || 0) * 2.237),
      wind_kph: Math.round((currentWeather.wind?.speed || 0) * 3.6),
      wind_dir: getWindDirection(currentWeather.wind?.deg || 0),
      pressure_mb: currentWeather.main.pressure,
      pressure_in: Math.round(currentWeather.main.pressure * 0.02953 * 100) / 100,
      precip_mm: currentWeather.rain?.['1h'] || 0,
      precip_in: Math.round((currentWeather.rain?.['1h'] || 0) * 0.0394 * 100) / 100,
      humidity: currentWeather.main.humidity,
      cloud: currentWeather.clouds.all,
      feelslike_c: Math.round(currentWeather.main.feels_like),
      feelslike_f: Math.round(currentWeather.main.feels_like * 9/5 + 32),
      windchill_c: Math.round(currentWeather.main.feels_like - 2),
      windchill_f: Math.round((currentWeather.main.feels_like - 2) * 9/5 + 32),
      heatindex_c: Math.round(currentWeather.main.feels_like + 2),
      heatindex_f: Math.round((currentWeather.main.feels_like + 2) * 9/5 + 32),
      dewpoint_c: Math.round(currentWeather.main.temp - ((100 - currentWeather.main.humidity) / 5)),
      dewpoint_f: Math.round((currentWeather.main.temp - ((100 - currentWeather.main.humidity) / 5)) * 9/5 + 32),
      will_it_rain: currentWeather.rain ? 1 : 0,
      chance_of_rain: currentWeather.rain ? Math.min(100, Math.round((currentWeather.rain['1h'] || 0) * 20)) : 0,
      will_it_snow: currentWeather.snow ? 1 : 0,
      chance_of_snow: currentWeather.snow ? Math.min(100, Math.round((currentWeather.snow['1h'] || 0) * 20)) : 0,
      vis_km: Math.round((currentWeather.visibility || 10000) / 1000),
      vis_miles: Math.round((currentWeather.visibility || 10000) / 1609),
      gust_mph: Math.round((currentWeather.wind?.gust || 0) * 2.237),
      gust_kph: Math.round((currentWeather.wind?.gust || 0) * 3.6),
      uv: h >= 6 && h <= 18 ? calculateUVIndex(currentWeather.coord.lat, currentWeather.coord.lon) : 0,
    })),
  }));

  return {
    location: {
      name: currentWeather.name,
      country: currentWeather.sys.country,
      region: currentWeather.sys.country === 'IN' ? getIndianState(currentWeather.coord.lat, currentWeather.coord.lon) : currentWeather.sys.country,
      lat: currentWeather.coord.lat,
      lon: currentWeather.coord.lon,
      tz_id: getTimezone(currentWeather.coord.lat, currentWeather.coord.lon),
      localtime: new Date().toISOString().slice(0, -5),
      pincode: dbLocation?.pincode,
    },
    current: {
      temp_c: Math.round(currentWeather.main.temp),
      temp_f: Math.round(currentWeather.main.temp * 9/5 + 32),
      condition: {
        text: capitalizeWords(currentWeather.weather[0].description),
        icon: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
        code: currentWeather.weather[0].id,
      },
      wind_mph: Math.round((currentWeather.wind?.speed || 0) * 2.237),
      wind_kph: Math.round((currentWeather.wind?.speed || 0) * 3.6),
      wind_dir: getWindDirection(currentWeather.wind?.deg || 0),
      pressure_mb: currentWeather.main.pressure,
      pressure_in: Math.round(currentWeather.main.pressure * 0.02953 * 100) / 100,
      precip_mm: currentWeather.rain?.['1h'] || 0,
      precip_in: Math.round((currentWeather.rain?.['1h'] || 0) * 0.0394 * 100) / 100,
      humidity: currentWeather.main.humidity,
      cloud: currentWeather.clouds.all,
      feelslike_c: Math.round(currentWeather.main.feels_like),
      feelslike_f: Math.round(currentWeather.main.feels_like * 9/5 + 32),
      vis_km: Math.round((currentWeather.visibility || 10000) / 1000),
      vis_miles: Math.round((currentWeather.visibility || 10000) / 1609),
      uv: calculateUVIndex(currentWeather.coord.lat, currentWeather.coord.lon),
      gust_mph: Math.round((currentWeather.wind?.gust || 0) * 2.237),
      gust_kph: Math.round((currentWeather.wind?.gust || 0) * 3.6),
    },
    forecast: {
      forecastday: mockForecastDays,
    },
  };
};

const groupForecastByDays = (forecastList: any[]): any[] => {
  const days: { [key: string]: any[] } = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!days[date]) {
      days[date] = [];
    }
    days[date].push(item);
  });

  return Object.entries(days).slice(0, 7).map(([date, hourlyData]) => {
    const dayData = hourlyData[0]; // Use first entry for day summary
    const temps = hourlyData.map(h => h.main.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    return {
      date,
      date_epoch: new Date(date).getTime() / 1000,
      day: {
        maxtemp_c: Math.round(maxTemp),
        maxtemp_f: Math.round(maxTemp * 9/5 + 32),
        mintemp_c: Math.round(minTemp),
        mintemp_f: Math.round(minTemp * 9/5 + 32),
        avgtemp_c: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
        avgtemp_f: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 9/5 + 32),
        maxwind_mph: Math.round(Math.max(...hourlyData.map(h => (h.wind?.speed || 0) * 2.237))),
        maxwind_kph: Math.round(Math.max(...hourlyData.map(h => (h.wind?.speed || 0) * 3.6))),
        totalprecip_mm: hourlyData.reduce((sum, h) => sum + (h.rain?.['3h'] || 0), 0),
        totalprecip_in: Math.round(hourlyData.reduce((sum, h) => sum + (h.rain?.['3h'] || 0), 0) * 0.0394 * 100) / 100,
        totalsnow_cm: hourlyData.reduce((sum, h) => sum + (h.snow?.['3h'] || 0), 0) / 10,
        avgvis_km: Math.round(hourlyData.reduce((sum, h) => sum + (h.visibility || 10000), 0) / hourlyData.length / 1000),
        avgvis_miles: Math.round(hourlyData.reduce((sum, h) => sum + (h.visibility || 10000), 0) / hourlyData.length / 1609),
        avghumidity: Math.round(hourlyData.reduce((sum, h) => sum + h.main.humidity, 0) / hourlyData.length),
        daily_will_it_rain: hourlyData.some(h => h.rain) ? 1 : 0,
        daily_chance_of_rain: Math.round(hourlyData.filter(h => h.rain).length / hourlyData.length * 100),
        daily_will_it_snow: hourlyData.some(h => h.snow) ? 1 : 0,
        daily_chance_of_snow: Math.round(hourlyData.filter(h => h.snow).length / hourlyData.length * 100),
        condition: {
          text: capitalizeWords(dayData.weather[0].description),
          icon: `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`,
          code: dayData.weather[0].id,
        },
        uv: calculateUVIndex(0, 0), // Placeholder UV index
      },
      hour: hourlyData.slice(0, 24).map(hourData => ({
        time_epoch: hourData.dt,
        time: new Date(hourData.dt * 1000).toISOString(),
        temp_c: Math.round(hourData.main.temp),
        temp_f: Math.round(hourData.main.temp * 9/5 + 32),
        is_day: isDay(hourData.dt),
        condition: {
          text: capitalizeWords(hourData.weather[0].description),
          icon: `https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`,
          code: hourData.weather[0].id,
        },
        wind_mph: Math.round((hourData.wind?.speed || 0) * 2.237),
        wind_kph: Math.round((hourData.wind?.speed || 0) * 3.6),
        wind_dir: getWindDirection(hourData.wind?.deg || 0),
        pressure_mb: hourData.main.pressure,
        pressure_in: Math.round(hourData.main.pressure * 0.02953 * 100) / 100,
        precip_mm: hourData.rain?.['3h'] || 0,
        precip_in: Math.round((hourData.rain?.['3h'] || 0) * 0.0394 * 100) / 100,
        humidity: hourData.main.humidity,
        cloud: hourData.clouds.all,
        feelslike_c: Math.round(hourData.main.feels_like),
        feelslike_f: Math.round(hourData.main.feels_like * 9/5 + 32),
        windchill_c: Math.round(hourData.main.feels_like - 2),
        windchill_f: Math.round((hourData.main.feels_like - 2) * 9/5 + 32),
        heatindex_c: Math.round(hourData.main.feels_like + 2),
        heatindex_f: Math.round((hourData.main.feels_like + 2) * 9/5 + 32),
        dewpoint_c: Math.round(hourData.main.temp - ((100 - hourData.main.humidity) / 5)),
        dewpoint_f: Math.round((hourData.main.temp - ((100 - hourData.main.humidity) / 5)) * 9/5 + 32),
        will_it_rain: hourData.rain ? 1 : 0,
        chance_of_rain: hourData.rain ? Math.min(100, Math.round(hourData.rain['3h'] * 20)) : 0,
        will_it_snow: hourData.snow ? 1 : 0,
        chance_of_snow: hourData.snow ? Math.min(100, Math.round(hourData.snow['3h'] * 20)) : 0,
        vis_km: Math.round((hourData.visibility || 10000) / 1000),
        vis_miles: Math.round((hourData.visibility || 10000) / 1609),
        gust_mph: Math.round((hourData.wind?.gust || 0) * 2.237),
        gust_kph: Math.round((hourData.wind?.gust || 0) * 3.6),
        uv: isDay(hourData.dt) ? calculateUVIndex(0, 0) : 0,
      })),
    };
  });
};

// Mock data functions for fallback
const getMockWeatherData = (query: string): WeatherData => {
  // Enhanced search logic with pincode support
  let selectedLocation = null;

  // Check if query is a pincode (6 digits)
  const isPincode = /^\d{6}$/.test(query);
  
  if (isPincode) {
    // Search by pincode
    selectedLocation = allLocations.find(loc => loc.pincode === query);
  } else {
    // Search by name - try multiple matching strategies
    
    // First, try exact name match
    selectedLocation = allLocations.find(loc => 
      loc.name.toLowerCase() === query.toLowerCase()
    );

    // If no exact match, try partial name match
    if (!selectedLocation) {
      selectedLocation = allLocations.find(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // If still no match, try region or country match
    if (!selectedLocation) {
      selectedLocation = allLocations.find(loc => 
        loc.region.toLowerCase().includes(query.toLowerCase()) ||
        loc.country.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  // If no match found, use a random Indian location for better demo experience
  if (!selectedLocation) {
    console.log(`No exact match found for "${query}", using random Indian location`);
    const indianLocations = allLocations.filter(loc => loc.country === 'India');
    selectedLocation = indianLocations[Math.floor(Math.random() * indianLocations.length)];
  } else {
    console.log(`Found match for "${query}":`, selectedLocation.name);
  }

  // Generate realistic temperature based on location type and region
  let baseTemp = 25; // Default temperature
  
  // Adjust temperature based on region
  const region = selectedLocation.region.toLowerCase();
  if (region.includes('himachal') || region.includes('uttarakhand') || region.includes('kashmir') || region.includes('ladakh') || region.includes('sikkim')) {
    baseTemp = 15; // Hill stations are cooler
  } else if (region.includes('rajasthan') || region.includes('gujarat')) {
    baseTemp = 35; // Desert regions are hotter
  } else if (region.includes('kerala') || region.includes('goa') || region.includes('tamil nadu')) {
    baseTemp = 30; // Coastal regions
  } else if (region.includes('punjab') || region.includes('haryana') || region.includes('delhi')) {
    baseTemp = 32; // North Indian plains
  } else if (region.includes('west bengal') || region.includes('odisha') || region.includes('bihar')) {
    baseTemp = 31; // Eastern India
  } else if (region.includes('maharashtra') || region.includes('madhya pradesh')) {
    baseTemp = 28; // Central India
  }

  // Add some randomness
  baseTemp += (Math.random() * 6 - 3);
  
  return createWeatherData(selectedLocation, baseTemp);
};

const getMockWeatherDataForCoords = (lat: number, lon: number, locationName: string): WeatherData => {
  // Parse location name to extract city and country
  const [city, country] = locationName.split(', ');
  
  // Generate temperature based on latitude (closer to equator = warmer)
  const latitudeFactor = Math.abs(lat) / 90; // 0 to 1, where 0 is equator
  const baseTemp = 30 - (latitudeFactor * 25) + (Math.random() * 10 - 5); // 5°C to 35°C range
  
  // Generate weather condition based on location and season
  const conditions = ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const location = {
    name: city || 'Your Location',
    country: country || 'Unknown',
    region: city || 'Current Location',
    temp: baseTemp,
    condition: condition,
    lat: lat,
    lon: lon,
    type: 'city' as const,
    fullName: locationName
  };
  
  return createWeatherData(location, baseTemp);
};

const createWeatherData = (location: any, baseTemp: number): WeatherData => {
  // Generate realistic weather conditions based on location type
  const conditions = ['Sunny', 'Partly cloudy', 'Cloudy', 'Clear'];
  if (location.region?.toLowerCase().includes('kerala') || location.region?.toLowerCase().includes('goa')) {
    conditions.push('Light rain', 'Humid');
  }
  if (location.region?.toLowerCase().includes('rajasthan') || location.region?.toLowerCase().includes('gujarat')) {
    conditions.push('Hot', 'Very hot', 'Dry');
  }
  if (location.region?.toLowerCase().includes('himachal') || location.region?.toLowerCase().includes('uttarakhand')) {
    conditions.push('Cool', 'Pleasant', 'Misty');
  }

  const condition = location.condition || conditions[Math.floor(Math.random() * conditions.length)];

  return {
    location: {
      name: location.name,
      country: location.country,
      region: location.region,
      lat: location.lat || (20 + Math.random() * 15), // Random lat for India
      lon: location.lon || (70 + Math.random() * 20), // Random lon for India
      tz_id: 'Asia/Kolkata',
      localtime: new Date().toISOString().slice(0, -5),
      pincode: location.pincode,
    },
    current: {
      temp_c: Math.round(baseTemp),
      temp_f: Math.round(baseTemp * 9/5 + 32),
      condition: {
        text: condition,
        icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
        code: 1003,
      },
      wind_mph: Math.round(Math.random() * 20),
      wind_kph: Math.round(Math.random() * 32),
      wind_dir: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      pressure_mb: 1013 + Math.round(Math.random() * 20 - 10),
      pressure_in: 29.92 + Math.random() * 0.6 - 0.3,
      precip_mm: Math.random() * 2,
      precip_in: Math.random() * 0.08,
      humidity: Math.round(Math.random() * 40 + 40),
      cloud: Math.round(Math.random() * 100),
      feelslike_c: Math.round(baseTemp + Math.random() * 4 - 2),
      feelslike_f: Math.round((baseTemp + Math.random() * 4 - 2) * 9/5 + 32),
      vis_km: Math.round(Math.random() * 10 + 5),
      vis_miles: Math.round((Math.random() * 10 + 5) * 0.621),
      uv: Math.round(Math.random() * 10),
      gust_mph: Math.round(Math.random() * 30),
      gust_kph: Math.round(Math.random() * 48),
    },
    forecast: {
      forecastday: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        date_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60,
        day: {
          maxtemp_c: Math.round(baseTemp + Math.random() * 8),
          maxtemp_f: Math.round((baseTemp + Math.random() * 8) * 9/5 + 32),
          mintemp_c: Math.round(baseTemp - Math.random() * 8),
          mintemp_f: Math.round((baseTemp - Math.random() * 8) * 9/5 + 32),
          avgtemp_c: Math.round(baseTemp),
          avgtemp_f: Math.round(baseTemp * 9/5 + 32),
          maxwind_mph: Math.round(Math.random() * 25),
          maxwind_kph: Math.round(Math.random() * 40),
          totalprecip_mm: Math.random() * 5,
          totalprecip_in: Math.random() * 0.2,
          totalsnow_cm: 0,
          avgvis_km: Math.round(Math.random() * 5 + 10),
          avgvis_miles: Math.round((Math.random() * 5 + 10) * 0.621),
          avghumidity: Math.round(Math.random() * 30 + 50),
          daily_will_it_rain: Math.random() > 0.7 ? 1 : 0,
          daily_chance_of_rain: Math.round(Math.random() * 100),
          daily_will_it_snow: 0,
          daily_chance_of_snow: 0,
          condition: {
            text: condition,
            icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
            code: 1003,
          },
          uv: Math.round(Math.random() * 10),
        },
        hour: Array.from({ length: 24 }, (_, h) => ({
          time_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60 + h * 60 * 60,
          time: new Date(Date.now() + i * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000).toISOString(),
          temp_c: Math.round(baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5),
          temp_f: Math.round((baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5) * 9/5 + 32),
          is_day: h >= 6 && h <= 18 ? 1 : 0,
          condition: {
            text: condition,
            icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
            code: 1003,
          },
          wind_mph: Math.round(Math.random() * 20),
          wind_kph: Math.round(Math.random() * 32),
          wind_dir: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
          pressure_mb: 1013 + Math.round(Math.random() * 20 - 10),
          pressure_in: 29.92 + Math.random() * 0.6 - 0.3,
          precip_mm: Math.random() * 2,
          precip_in: Math.random() * 0.08,
          humidity: Math.round(Math.random() * 40 + 40),
          cloud: Math.round(Math.random() * 100),
          feelslike_c: Math.round(baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5 + Math.random() * 2 - 1),
          feelslike_f: Math.round((baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5 + Math.random() * 2 - 1) * 9/5 + 32),
          windchill_c: Math.round(baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5 - 2),
          windchill_f: Math.round((baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5 - 2) * 9/5 + 32),
          heatindex_c: Math.round(baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5 + 2),
          heatindex_f: Math.round((baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5 + 2) * 9/5 + 32),
          dewpoint_c: Math.round(baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5 - 5),
          dewpoint_f: Math.round((baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5 - 5) * 9/5 + 32),
          will_it_rain: Math.random() > 0.8 ? 1 : 0,
          chance_of_rain: Math.round(Math.random() * 100),
          will_it_snow: 0,
          chance_of_snow: 0,
          vis_km: Math.round(Math.random() * 10 + 5),
          vis_miles: Math.round((Math.random() * 10 + 5) * 0.621),
          gust_mph: Math.round(Math.random() * 30),
          gust_kph: Math.round(Math.random() * 48),
          uv: h >= 6 && h <= 18 ? Math.round(Math.random() * 10) : 0,
        })),
      })),
    },
  };
};

const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const isDay = (timestamp: number): number => {
  const hour = new Date(timestamp * 1000).getHours();
  return hour >= 6 && hour <= 18 ? 1 : 0;
};

const calculateUVIndex = (lat: number, lon: number): number => {
  // Simplified UV calculation based on time and season
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  
  if (hour < 6 || hour > 18) return 0;
  
  // Peak UV around noon, higher in summer months
  const timeMultiplier = 1 - Math.abs(12 - hour) / 6;
  const seasonMultiplier = month >= 4 && month <= 9 ? 1.2 : 0.8;
  
  return Math.round(Math.max(0, Math.min(11, timeMultiplier * seasonMultiplier * 8)));
};

const getIndianState = (lat: number, lon: number): string => {
  // Simplified state detection based on coordinates
  if (lat >= 24 && lat <= 27 && lon >= 84 && lon <= 88) return 'Bihar';
  if (lat >= 18 && lat <= 20 && lon >= 72 && lon <= 75) return 'Maharashtra';
  if (lat >= 12 && lat <= 14 && lon >= 77 && lon <= 78) return 'Karnataka';
  if (lat >= 10 && lat <= 12 && lon >= 76 && lon <= 78) return 'Tamil Nadu';
  if (lat >= 8 && lat <= 10 && lon >= 76 && lon <= 77) return 'Kerala';
  if (lat >= 26 && lat <= 30 && lon >= 74 && lon <= 78) return 'Rajasthan';
  if (lat >= 21 && lat <= 24 && lon >= 68 && lon <= 74) return 'Gujarat';
  if (lat >= 28 && lat <= 29 && lon >= 76 && lon <= 78) return 'Delhi';
  if (lat >= 22 && lat <= 25 && lon >= 88 && lon <= 89) return 'West Bengal';
  return 'India';
};

const getTimezone = (lat: number, lon: number): string => {
  // India uses a single timezone
  if (lon >= 68 && lon <= 97 && lat >= 6 && lat <= 37) {
    return 'Asia/Kolkata';
  }
  return 'UTC';
};