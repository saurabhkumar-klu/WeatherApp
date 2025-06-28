import React from 'react';
import { HourlyWeather, TemperatureUnit } from '../types/weather';
import { formatTime, formatTemperature } from '../utils/weatherUtils';
import { getWeatherIcon } from '../utils/weatherIcons';

interface HourlyForecastProps {
  hourlyData: HourlyWeather[];
  unit: TemperatureUnit;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData, unit }) => {
  const next24Hours = hourlyData.slice(0, 24);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">24-Hour Forecast</h2>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
          {next24Hours.map((hour, index) => {
            const WeatherIcon = getWeatherIcon(hour.condition.text, hour.is_day === 1);
            const time = new Date(hour.time).getHours();
            const isCurrentHour = index === 0;
            
            return (
              <div
                key={hour.time_epoch}
                className={`flex-shrink-0 bg-white/10 rounded-2xl p-4 text-center min-w-[100px] transition-all duration-300 ${
                  isCurrentHour ? 'bg-white/20 ring-2 ring-white/30' : 'hover:bg-white/15'
                }`}
              >
                <p className="text-white/80 text-sm mb-2">
                  {isCurrentHour ? 'Now' : `${time.toString().padStart(2, '0')}:00`}
                </p>
                <WeatherIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white font-medium text-lg">
                  {formatTemperature(hour.temp_c, hour.temp_f, unit)}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {hour.chance_of_rain > 0 && `${hour.chance_of_rain}%`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;