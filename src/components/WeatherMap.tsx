import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { WeatherIcons } from '../utils/weatherIcons';

interface WeatherMapProps {
  data: WeatherData;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ data }) => {
  const [mapType, setMapType] = useState<'precipitation' | 'temperature' | 'wind'>('precipitation');
  
  const mapUrl = `https://tile.openweathermap.org/map/${mapType}_new/5/${data.location.lat}/${data.location.lon}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Weather Map</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setMapType('precipitation')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
              mapType === 'precipitation' 
                ? 'bg-white/30 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Rain
          </button>
          <button
            onClick={() => setMapType('temperature')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
              mapType === 'temperature' 
                ? 'bg-white/30 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Temp
          </button>
          <button
            onClick={() => setMapType('wind')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
              mapType === 'wind' 
                ? 'bg-white/30 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Wind
          </button>
        </div>
      </div>
      
      <div className="relative rounded-2xl overflow-hidden bg-white/5">
        <img
          src={mapUrl}
          alt={`${mapType} map`}
          className="w-full h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
            <WeatherIcons.MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-white/70 text-sm">
          {mapType === 'precipitation' && 'Precipitation levels in your area'}
          {mapType === 'temperature' && 'Temperature distribution around your location'}
          {mapType === 'wind' && 'Wind patterns and speed in your region'}
        </p>
      </div>
    </div>
  );
};

export default WeatherMap;