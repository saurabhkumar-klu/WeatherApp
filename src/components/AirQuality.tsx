import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { WeatherIcons } from '../utils/weatherIcons';

interface AirQualityData {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

interface AirQualityProps {
  data: WeatherData;
}

const AirQuality: React.FC<AirQualityProps> = ({ data }) => {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAirQuality();
  }, [data.location.lat, data.location.lon]);

  const fetchAirQuality = async () => {
    try {
      setLoading(true);
      // For demo purposes, generate realistic air quality data
      const mockAirQuality: AirQualityData = {
        aqi: Math.floor(Math.random() * 5) + 1, // 1-5 scale
        co: Math.random() * 1000 + 200,
        no: Math.random() * 50,
        no2: Math.random() * 100 + 20,
        o3: Math.random() * 200 + 50,
        so2: Math.random() * 50 + 5,
        pm2_5: Math.random() * 50 + 10,
        pm10: Math.random() * 100 + 20,
        nh3: Math.random() * 30 + 5,
      };
      
      setTimeout(() => {
        setAirQuality(mockAirQuality);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Air quality fetch error:', error);
      setLoading(false);
    }
  };

  const getAQILevel = (aqi: number) => {
    switch (aqi) {
      case 1: return { level: 'Good', color: 'text-green-400', bg: 'bg-green-500/20' };
      case 2: return { level: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      case 3: return { level: 'Moderate', color: 'text-orange-400', bg: 'bg-orange-500/20' };
      case 4: return { level: 'Poor', color: 'text-red-400', bg: 'bg-red-500/20' };
      case 5: return { level: 'Very Poor', color: 'text-purple-400', bg: 'bg-purple-500/20' };
      default: return { level: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  const getHealthAdvice = (aqi: number) => {
    switch (aqi) {
      case 1: return "Air quality is excellent. Perfect for outdoor activities!";
      case 2: return "Air quality is good. Enjoy your outdoor activities.";
      case 3: return "Air quality is moderate. Sensitive individuals should limit outdoor exposure.";
      case 4: return "Air quality is poor. Consider wearing a mask outdoors.";
      case 5: return "Air quality is very poor. Avoid outdoor activities if possible.";
      default: return "Air quality data unavailable.";
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <div className="flex items-center justify-center h-48">
          <WeatherIcons.Loader className="w-8 h-8 text-white animate-spin" />
          <span className="ml-3 text-white">Loading air quality data...</span>
        </div>
      </div>
    );
  }

  if (!airQuality) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <div className="text-center text-white/70">
          <p>Air quality data unavailable</p>
        </div>
      </div>
    );
  }

  const aqiInfo = getAQILevel(airQuality.aqi);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Air Quality Index</h2>
      
      <div className="mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${aqiInfo.bg} border border-white/20`}>
          <div className={`w-3 h-3 rounded-full ${aqiInfo.color.replace('text-', 'bg-')} mr-2`}></div>
          <span className={`font-medium ${aqiInfo.color}`}>{aqiInfo.level}</span>
          <span className="text-white/70 ml-2">AQI {airQuality.aqi}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-white/70 text-xs mb-1">PM2.5</p>
          <p className="text-white font-medium">{airQuality.pm2_5.toFixed(1)}</p>
          <p className="text-white/50 text-xs">μg/m³</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-white/70 text-xs mb-1">PM10</p>
          <p className="text-white font-medium">{airQuality.pm10.toFixed(1)}</p>
          <p className="text-white/50 text-xs">μg/m³</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-white/70 text-xs mb-1">O₃</p>
          <p className="text-white font-medium">{airQuality.o3.toFixed(1)}</p>
          <p className="text-white/50 text-xs">μg/m³</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-white/70 text-xs mb-1">NO₂</p>
          <p className="text-white font-medium">{airQuality.no2.toFixed(1)}</p>
          <p className="text-white/50 text-xs">μg/m³</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4">
        <h3 className="text-white font-medium mb-2">Health Advice</h3>
        <p className="text-white/80 text-sm">{getHealthAdvice(airQuality.aqi)}</p>
      </div>
    </div>
  );
};

export default AirQuality;