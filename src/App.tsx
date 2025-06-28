import React, { useState, useEffect } from 'react';
import { WeatherData, TemperatureUnit } from './types/weather';
import { fetchWeatherData, fetchWeatherByCoords } from './utils/weatherApi';
import { getCurrentUserLocation } from './utils/weatherUtils';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import WeatherMap from './components/WeatherMap';
import AirQuality from './components/AirQuality';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherComparison from './components/WeatherComparison';
import WeatherInsights from './components/WeatherInsights';
import FavoriteLocations from './components/FavoriteLocations';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [locationStatus, setLocationStatus] = useState<string>('Detecting your location...');
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'map' | 'alerts'>('overview');

  useEffect(() => {
    // Load default location weather on app start
    loadDefaultWeather();
  }, []);

  const loadDefaultWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      setLocationStatus('Detecting your location...');
      
      // Try to get user's location first
      try {
        console.log('Attempting to get user location...');
        const coords = await getCurrentUserLocation();
        console.log('Location detected:', coords);
        setLocationStatus(`Loading weather for your location (${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)})...`);
        
        const data = await fetchWeatherByCoords(coords.lat, coords.lon);
        setWeatherData(data);
        setLocationStatus('');
      } catch (locationError) {
        console.log('Location access failed:', locationError);
        setLocationStatus('Location access denied. Loading default location...');
        
        // Fallback to default city if location access is denied
        const data = await fetchWeatherData('Mumbai');
        setWeatherData(data);
        setLocationStatus('');
      }
    } catch (err) {
      console.error('Weather loading error:', err);
      setError('Failed to load weather data. Please check your internet connection and try again.');
      setLocationStatus('');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      setLocationStatus(`Searching for "${query}"...`);
      
      const data = await fetchWeatherData(query);
      setWeatherData(data);
      setLocationStatus('');
    } catch (err) {
      console.error('Search error:', err);
      setError('Could not find weather data for this location. Please try another search or check your internet connection.');
      setLocationStatus('');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      setLocationStatus('Getting your current location...');
      
      const coords = await getCurrentUserLocation();
      console.log('Manual location request - coordinates:', coords);
      setLocationStatus(`Loading weather for your location...`);
      
      const data = await fetchWeatherByCoords(coords.lat, coords.lon);
      setWeatherData(data);
      setLocationStatus('');
    } catch (err) {
      console.error('Manual location request failed:', err);
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services and try again, or search for a city manually.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable. Please search for a city manually.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please search for a city manually.');
            break;
          default:
            setError('Failed to get your location. Please search for a city manually.');
        }
      } else {
        setError('Failed to get your location. Please search for a city manually.');
      }
      setLocationStatus('');
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const getBackgroundGradient = () => {
    if (!weatherData) return 'from-blue-600 to-purple-700';
    
    const condition = weatherData.current.condition.text.toLowerCase();
    const isDay = new Date().getHours() >= 6 && new Date().getHours() <= 18;
    
    if (condition.includes('sunny') || condition.includes('clear')) {
      return isDay ? 'from-yellow-400 via-orange-500 to-pink-500' : 'from-indigo-900 via-purple-900 to-pink-900';
    } else if (condition.includes('rain') || condition.includes('storm') || condition.includes('drizzle')) {
      return 'from-gray-700 via-gray-800 to-gray-900';
    } else if (condition.includes('snow')) {
      return 'from-blue-300 via-blue-500 to-blue-700';
    } else if (condition.includes('cloud') || condition.includes('overcast')) {
      return 'from-gray-500 via-gray-600 to-gray-700';
    } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
      return 'from-gray-400 via-gray-500 to-gray-600';
    } else {
      return 'from-blue-600 to-purple-700';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'map', label: 'Map & Air Quality' },
    { id: 'alerts', label: 'Alerts & Insights' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Weather<span className="text-white/80">Flow</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              Real-time weather forecasting with beautiful design and comprehensive data
            </p>
            {locationStatus && (
              <p className="text-white/70 text-sm mt-2 animate-pulse">
                {locationStatus}
              </p>
            )}
          </div>

          <SearchBar
            onSearch={handleSearch}
            onLocationRequest={handleLocationRequest}
            isLoading={loading}
          />

          {loading && <LoadingSpinner />}
          
          {error && (
            <ErrorMessage
              message={error}
              onRetry={loadDefaultWeather}
            />
          )}
          
          {!loading && !error && weatherData && (
            <div className="max-w-7xl mx-auto">
              <CurrentWeather
                data={weatherData}
                unit={unit}
                onUnitToggle={toggleUnit}
              />

              {/* Navigation Tabs */}
              <div className="flex justify-center mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
                  <div className="flex space-x-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <HourlyForecast
                    hourlyData={weatherData.forecast.forecastday[0].hour}
                    unit={unit}
                  />
                  
                  <WeeklyForecast
                    forecastData={weatherData.forecast.forecastday}
                    unit={unit}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <WeatherComparison currentData={weatherData} unit={unit} />
                    <FavoriteLocations 
                      currentData={weatherData} 
                      unit={unit}
                      onLocationSelect={handleSearch}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-8">
                  <HourlyForecast
                    hourlyData={weatherData.forecast.forecastday[0].hour}
                    unit={unit}
                  />
                  
                  <WeeklyForecast
                    forecastData={weatherData.forecast.forecastday}
                    unit={unit}
                  />
                </div>
              )}

              {activeTab === 'map' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <WeatherMap data={weatherData} />
                    <AirQuality data={weatherData} />
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-8">
                  <WeatherAlerts data={weatherData} />
                  <WeatherInsights data={weatherData} unit={unit} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;