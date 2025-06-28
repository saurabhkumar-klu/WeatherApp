import React from 'react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { WeatherIcons } from '../utils/weatherIcons';

interface WeatherInsightsProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

const WeatherInsights: React.FC<WeatherInsightsProps> = ({ data, unit }) => {
  const generateInsights = () => {
    const insights = [];
    const temp = data.current.temp_c;
    const humidity = data.current.humidity;
    const windSpeed = data.current.wind_kph;
    const uv = data.current.uv;
    const condition = data.current.condition.text.toLowerCase();

    // Temperature insights
    if (temp > 30) {
      insights.push({
        icon: WeatherIcons.Thermometer,
        title: 'Hot Weather',
        description: 'Stay hydrated and avoid prolonged sun exposure. Consider indoor activities during peak hours.',
        color: 'text-red-400',
        bg: 'bg-red-500/20',
      });
    } else if (temp < 10) {
      insights.push({
        icon: WeatherIcons.Thermometer,
        title: 'Cold Weather',
        description: 'Dress warmly in layers. Perfect weather for hot beverages and cozy indoor activities.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
      });
    } else if (temp >= 20 && temp <= 25) {
      insights.push({
        icon: WeatherIcons.Sun,
        title: 'Perfect Temperature',
        description: 'Ideal weather for outdoor activities, sports, and sightseeing. Make the most of it!',
        color: 'text-green-400',
        bg: 'bg-green-500/20',
      });
    }

    // Humidity insights
    if (humidity > 80) {
      insights.push({
        icon: WeatherIcons.Droplets,
        title: 'High Humidity',
        description: 'It may feel warmer than the actual temperature. Stay in air-conditioned spaces when possible.',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/20',
      });
    } else if (humidity < 30) {
      insights.push({
        icon: WeatherIcons.Droplets,
        title: 'Low Humidity',
        description: 'Dry air may cause skin and respiratory irritation. Use moisturizer and stay hydrated.',
        color: 'text-orange-400',
        bg: 'bg-orange-500/20',
      });
    }

    // Wind insights
    if (windSpeed > 30) {
      insights.push({
        icon: WeatherIcons.Wind,
        title: 'Windy Conditions',
        description: 'Strong winds detected. Secure loose objects and be cautious when driving.',
        color: 'text-gray-400',
        bg: 'bg-gray-500/20',
      });
    } else if (windSpeed < 5) {
      insights.push({
        icon: WeatherIcons.Wind,
        title: 'Calm Conditions',
        description: 'Very light winds. Great for outdoor dining and activities that require still air.',
        color: 'text-green-400',
        bg: 'bg-green-500/20',
      });
    }

    // UV insights
    if (uv > 7) {
      insights.push({
        icon: WeatherIcons.Sun,
        title: 'High UV Levels',
        description: 'Apply SPF 30+ sunscreen and wear protective clothing. Seek shade during midday.',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20',
      });
    }

    // Weather condition insights
    if (condition.includes('rain')) {
      insights.push({
        icon: WeatherIcons.CloudRain,
        title: 'Rainy Weather',
        description: 'Perfect time for indoor activities. Carry an umbrella if you need to go out.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
      });
    } else if (condition.includes('clear') || condition.includes('sunny')) {
      insights.push({
        icon: WeatherIcons.Sun,
        title: 'Clear Skies',
        description: 'Excellent visibility and great weather for photography and outdoor adventures.',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20',
      });
    }

    // Activity recommendations
    if (temp >= 15 && temp <= 25 && windSpeed < 20 && !condition.includes('rain')) {
      insights.push({
        icon: WeatherIcons.Sun,
        title: 'Perfect for Outdoor Sports',
        description: 'Ideal conditions for running, cycling, hiking, or any outdoor sports activities.',
        color: 'text-green-400',
        bg: 'bg-green-500/20',
      });
    }

    return insights.slice(0, 4); // Limit to 4 insights
  };

  const insights = generateInsights();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Weather Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          
          return (
            <div
              key={index}
              className={`${insight.bg} border border-white/20 rounded-xl p-4 backdrop-blur-sm`}
            >
              <div className="flex items-start space-x-3">
                <IconComponent className={`w-6 h-6 ${insight.color} flex-shrink-0 mt-0.5`} />
                <div>
                  <h3 className={`font-semibold ${insight.color} mb-1`}>{insight.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-8">
          <WeatherIcons.Sun className="w-12 h-12 text-white/50 mx-auto mb-3" />
          <p className="text-white/70">No specific insights for current conditions</p>
          <p className="text-white/50 text-sm">Enjoy the weather!</p>
        </div>
      )}
    </div>
  );
};

export default WeatherInsights;