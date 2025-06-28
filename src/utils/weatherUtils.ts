import { TemperatureUnit } from '../types/weather';

export const formatTemperature = (tempC: number, tempF: number, unit: TemperatureUnit): string => {
  const temp = unit === 'celsius' ? tempC : tempF;
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getWindDirection = (direction: string): string => {
  const directions: { [key: string]: string } = {
    N: 'North',
    NE: 'Northeast',
    E: 'East',
    SE: 'Southeast',
    S: 'South',
    SW: 'Southwest',
    W: 'West',
    NW: 'Northwest',
  };
  return directions[direction] || direction;
};

export const getUVLevel = (uv: number): { level: string; color: string } => {
  if (uv <= 2) return { level: 'Low', color: 'text-green-600' };
  if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
  if (uv <= 7) return { level: 'High', color: 'text-orange-600' };
  if (uv <= 10) return { level: 'Very High', color: 'text-red-600' };
  return { level: 'Extreme', color: 'text-purple-600' };
};

export const getWeatherRecommendation = (condition: string, temp: number, uv: number): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain')) {
    return "Don't forget your umbrella! It's going to rain.";
  } else if (conditionLower.includes('snow')) {
    return "Bundle up! Snow is expected today.";
  } else if (temp > 30) {
    return "It's quite hot today. Stay hydrated and seek shade.";
  } else if (temp < 0) {
    return "Freezing temperatures! Dress warmly and be careful of ice.";
  } else if (uv > 7) {
    return "High UV levels detected. Apply sunscreen before going out.";
  } else if (conditionLower.includes('sunny') && temp > 20) {
    return "Perfect weather for outdoor activities!";
  } else {
    return "Have a great day!";
  }
};

export const getCurrentUserLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    console.log('Requesting geolocation permission...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        console.log('Geolocation success:', coords);
        console.log('Accuracy:', position.coords.accuracy, 'meters');
        resolve(coords);
      },
      (error) => {
        console.error('Geolocation error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Provide more detailed error information
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log('User denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.log('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            console.log('The request to get user location timed out.');
            break;
          default:
            console.log('An unknown error occurred.');
            break;
        }
        
        reject(error);
      },
      {
        enableHighAccuracy: false, // Changed from true to false to prevent timeouts
        timeout: 10000, // Reduced timeout to 10 seconds
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
};