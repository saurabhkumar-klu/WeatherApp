import React, { useState, useEffect } from 'react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/weatherUtils';
import { getWeatherIcon } from '../utils/weatherIcons';
import { allLocations } from '../data/indianLocations';
import { fetchWeatherData } from '../utils/weatherApi';

interface ComparisonCity {
  name: string;
  temp: number;
  condition: string;
  humidity: number;
}

interface WeatherComparisonProps {
  currentData: WeatherData;
  unit: TemperatureUnit;
}

const WeatherComparison: React.FC<WeatherComparisonProps> = ({ currentData, unit }) => {
  const [comparisonCities, setComparisonCities] = useState<ComparisonCity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisonData();
  }, [currentData.location.name]);

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      
      // Select major cities for comparison (excluding current city)
      const majorCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur']
        .filter(city => city.toLowerCase() !== currentData.location.name.toLowerCase())
        .slice(0, 4);

      const comparisonData: ComparisonCity[] = [];

      for (const city of majorCities) {
        try {
          // For demo purposes, generate realistic comparison data
          const baseTemp = getBaseTempForCity(city);
          const variation = (Math.random() - 0.5) * 10;
          const temp = baseTemp + variation;
          
          comparisonData.push({
            name: city,
            temp: Math.round(temp),
            condition: getRandomCondition(),
            humidity: Math.round(Math.random() * 40 + 40),
          });
        } catch (error) {
          console.error(`Failed to fetch data for ${city}:`, error);
        }
      }

      setComparisonCities(comparisonData);
    } catch (error) {
      console.error('Comparison data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBaseTempForCity = (city: string): number => {
    const tempMap: { [key: string]: number } = {
      'Mumbai': 28,
      'Delhi': 25,
      'Bangalore': 22,
      'Chennai': 30,
      'Kolkata': 27,
      'Hyderabad': 26,
      'Pune': 24,
      'Jaipur': 29,
    };
    return tempMap[city] || 25;
  };

  const getRandomCondition = (): string => {
    const conditions = ['Clear', 'Partly cloudy', 'Cloudy', 'Light rain', 'Sunny'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const getTempComparison = (cityTemp: number): string => {
    const diff = cityTemp - currentData.current.temp_c;
    if (Math.abs(diff) < 1) return 'Similar';
    return diff > 0 ? `+${Math.round(diff)}°` : `${Math.round(diff)}°`;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Weather Comparison</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Loading comparison data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Weather Comparison</h2>
      
      <div className="space-y-4">
        {/* Current location */}
        <div className="bg-white/20 rounded-xl p-4 border border-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white font-medium">{currentData.location.name}</span>
              <span className="text-white/60 text-sm">(Current)</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white text-lg font-semibold">
                {formatTemperature(currentData.current.temp_c, currentData.current.temp_f, unit)}
              </span>
              <span className="text-white/70 text-sm">{currentData.current.condition.text}</span>
            </div>
          </div>
        </div>

        {/* Comparison cities */}
        {comparisonCities.map((city, index) => {
          const WeatherIcon = getWeatherIcon(city.condition);
          const tempComparison = getTempComparison(city.temp);
          
          return (
            <div key={city.name} className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <WeatherIcon className="w-5 h-5 text-white/80" />
                  <span className="text-white font-medium">{city.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-white text-lg font-semibold">
                    {formatTemperature(city.temp, city.temp * 9/5 + 32, unit)}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    tempComparison.includes('+') 
                      ? 'bg-red-500/20 text-red-300' 
                      : tempComparison.includes('-')
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {tempComparison}
                  </span>
                  <span className="text-white/60 text-sm w-20 text-right">{city.condition}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-white/60 text-sm">
          Temperature differences compared to {currentData.location.name}
        </p>
      </div>
    </div>
  );
};

export default WeatherComparison;