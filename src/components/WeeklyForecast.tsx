import React from 'react';
import { ForecastDay, TemperatureUnit } from '../types/weather';
import { formatDate, formatTemperature } from '../utils/weatherUtils';
import { getWeatherIcon, WeatherIcons } from '../utils/weatherIcons';

interface WeeklyForecastProps {
  forecastData: ForecastDay[];
  unit: TemperatureUnit;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecastData, unit }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">7-Day Forecast</h2>
      
      <div className="space-y-4">
        {forecastData.map((day, index) => {
          const WeatherIcon = getWeatherIcon(day.day.condition.text);
          const isToday = index === 0;
          
          return (
            <div
              key={day.date}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                isToday ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-16">
                  <p className="text-white font-medium">
                    {isToday ? 'Today' : formatDate(day.date)}
                  </p>
                </div>
                <WeatherIcon className="w-8 h-8 text-white flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white">{day.day.condition.text}</p>
                  {day.day.daily_chance_of_rain > 0 && (
                    <div className="flex items-center space-x-1 mt-1">
                      <WeatherIcons.CloudRain className="w-3 h-3 text-blue-300" />
                      <span className="text-white/70 text-xs">{day.day.daily_chance_of_rain}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-lg font-medium">
                      {formatTemperature(day.day.maxtemp_c, day.day.maxtemp_f, unit)}
                    </span>
                    <span className="text-white/60">
                      {formatTemperature(day.day.mintemp_c, day.day.mintemp_f, unit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyForecast;