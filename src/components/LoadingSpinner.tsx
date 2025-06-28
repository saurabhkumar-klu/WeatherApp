import React from 'react';
import { WeatherIcons } from '../utils/weatherIcons';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <WeatherIcons.Loader className="w-12 h-12 text-white animate-spin mb-4" />
      <p className="text-white/80 text-lg">Loading weather data...</p>
    </div>
  );
};

export default LoadingSpinner;