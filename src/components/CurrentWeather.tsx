import React from 'react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { formatTemperature, getWeatherRecommendation, getUVLevel } from '../utils/weatherUtils';
import { getWeatherIcon, WeatherIcons } from '../utils/weatherIcons';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: TemperatureUnit;
  onUnitToggle: () => void;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit, onUnitToggle }) => {
  const { location, current } = data;
  const WeatherIcon = getWeatherIcon(current.condition.text);
  const uvLevel = getUVLevel(current.uv);
  const recommendation = getWeatherRecommendation(current.condition.text, current.temp_c, current.uv);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{location.name}</h1>
          <div className="flex items-center space-x-2">
            <p className="text-white/80">{location.region}, {location.country}</p>
            {location.pincode && (
              <>
                <span className="text-white/60">•</span>
                <span className="text-white/70 font-mono text-sm bg-white/10 px-2 py-1 rounded">
                  {location.pincode}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onUnitToggle}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all duration-300"
        >
          °{unit === 'celsius' ? 'C' : 'F'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <WeatherIcon className="w-24 h-24 text-white" />
          </div>
          <div>
            <div className="text-6xl font-light text-white mb-2">
              {formatTemperature(current.temp_c, current.temp_f, unit)}
            </div>
            <p className="text-xl text-white/90 mb-2">{current.condition.text}</p>
            <p className="text-white/70">
              Feels like {formatTemperature(current.feelslike_c, current.feelslike_f, unit)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <WeatherIcons.Wind className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm">Wind</span>
            </div>
            <p className="text-white text-lg font-medium">
              {unit === 'celsius' ? current.wind_kph : current.wind_mph} {unit === 'celsius' ? 'km/h' : 'mph'}
            </p>
            <p className="text-white/70 text-sm">{current.wind_dir}</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <WeatherIcons.Droplets className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm">Humidity</span>
            </div>
            <p className="text-white text-lg font-medium">{current.humidity}%</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <WeatherIcons.Gauge className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm">Pressure</span>
            </div>
            <p className="text-white text-lg font-medium">{current.pressure_mb} mb</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <WeatherIcons.Eye className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm">Visibility</span>
            </div>
            <p className="text-white text-lg font-medium">
              {unit === 'celsius' ? current.vis_km : current.vis_miles} {unit === 'celsius' ? 'km' : 'mi'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/10 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-1">UV Index</h3>
            <div className="flex items-center space-x-2">
              <span className="text-white text-lg font-medium">{current.uv}</span>
              <span className={`text-sm font-medium ${uvLevel.color}`}>{uvLevel.level}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/90 text-sm">{recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;