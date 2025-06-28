import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle,
  Eye,
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  MapPin,
  Search,
  Loader
} from 'lucide-react';

export const getWeatherIcon = (condition: string, isDay: boolean = true) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return isDay ? Sun : Sun;
  } else if (conditionLower.includes('rain') || conditionLower.includes('shower') || conditionLower.includes('drizzle')) {
    return CloudRain;
  } else if (conditionLower.includes('drizzle')) {
    return CloudDrizzle;
  } else if (conditionLower.includes('snow')) {
    return CloudSnow;
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return CloudLightning;
  } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast') || conditionLower.includes('partly') || conditionLower.includes('broken')) {
    return Cloud;
  } else if (conditionLower.includes('mist') || conditionLower.includes('fog') || conditionLower.includes('haze')) {
    return Cloud;
  } else {
    return isDay ? Sun : Sun;
  }
};

export const WeatherIcons = {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Eye,
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  MapPin,
  Search,
  Loader,
};