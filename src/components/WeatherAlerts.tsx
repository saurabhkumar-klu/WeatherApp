import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { WeatherIcons } from '../utils/weatherIcons';

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  type: 'temperature' | 'precipitation' | 'wind' | 'uv' | 'air_quality';
  startTime: string;
  endTime: string;
}

interface WeatherAlertsProps {
  data: WeatherData;
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ data }) => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  useEffect(() => {
    generateAlerts();
  }, [data]);

  const generateAlerts = () => {
    const newAlerts: WeatherAlert[] = [];
    
    // Temperature alerts
    if (data.current.temp_c > 35) {
      newAlerts.push({
        id: 'heat-warning',
        title: 'Heat Wave Warning',
        description: `Extreme heat expected with temperatures reaching ${data.current.temp_c}°C. Stay hydrated and avoid prolonged sun exposure.`,
        severity: 'high',
        type: 'temperature',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    } else if (data.current.temp_c < 0) {
      newAlerts.push({
        id: 'freeze-warning',
        title: 'Freezing Temperature Alert',
        description: `Freezing temperatures of ${data.current.temp_c}°C expected. Protect pipes and plants from frost damage.`,
        severity: 'medium',
        type: 'temperature',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      });
    }

    // UV alerts
    if (data.current.uv > 7) {
      newAlerts.push({
        id: 'uv-warning',
        title: 'High UV Index Alert',
        description: `Very high UV levels detected (${data.current.uv}). Apply sunscreen and limit outdoor exposure during peak hours.`,
        severity: 'medium',
        type: 'uv',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Wind alerts
    if (data.current.wind_kph > 50) {
      newAlerts.push({
        id: 'wind-warning',
        title: 'Strong Wind Advisory',
        description: `High winds of ${data.current.wind_kph} km/h expected. Secure loose objects and avoid driving high-profile vehicles.`,
        severity: 'medium',
        type: 'wind',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Precipitation alerts
    const rainChance = data.forecast.forecastday[0]?.day.daily_chance_of_rain || 0;
    if (rainChance > 80) {
      newAlerts.push({
        id: 'rain-warning',
        title: 'Heavy Rain Expected',
        description: `${rainChance}% chance of heavy rainfall. Carry an umbrella and be cautious of flooding in low-lying areas.`,
        severity: 'medium',
        type: 'precipitation',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      });
    }

    setAlerts(newAlerts);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-blue-400 bg-blue-500/20 text-blue-300';
      case 'medium': return 'border-yellow-400 bg-yellow-500/20 text-yellow-300';
      case 'high': return 'border-orange-400 bg-orange-500/20 text-orange-300';
      case 'extreme': return 'border-red-400 bg-red-500/20 text-red-300';
      default: return 'border-gray-400 bg-gray-500/20 text-gray-300';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'temperature': return WeatherIcons.Thermometer;
      case 'precipitation': return WeatherIcons.CloudRain;
      case 'wind': return WeatherIcons.Wind;
      case 'uv': return WeatherIcons.Sun;
      default: return WeatherIcons.CloudLightning;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Weather Alerts</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <WeatherIcons.Sun className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-white/80">No active weather alerts</p>
            <p className="text-white/60 text-sm">Current conditions are safe</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Weather Alerts</h2>
      
      <div className="space-y-4">
        {alerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.type);
          const severityClass = getSeverityColor(alert.severity);
          
          return (
            <div
              key={alert.id}
              className={`border rounded-xl p-4 ${severityClass} backdrop-blur-sm`}
            >
              <div className="flex items-start space-x-3">
                <AlertIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{alert.title}</h3>
                  <p className="text-sm opacity-90 mb-2">{alert.description}</p>
                  <div className="flex items-center text-xs opacity-75">
                    <span className="capitalize">{alert.severity} severity</span>
                    <span className="mx-2">•</span>
                    <span>Valid until {new Date(alert.endTime).toLocaleTimeString()}</span>
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

export default WeatherAlerts;