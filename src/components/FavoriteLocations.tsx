import React, { useState, useEffect } from 'react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/weatherUtils';
import { getWeatherIcon, WeatherIcons } from '../utils/weatherIcons';

interface FavoriteLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  temp: number;
  condition: string;
  addedAt: string;
}

interface FavoriteLocationsProps {
  currentData: WeatherData;
  unit: TemperatureUnit;
  onLocationSelect: (locationName: string) => void;
}

const FavoriteLocations: React.FC<FavoriteLocationsProps> = ({ 
  currentData, 
  unit, 
  onLocationSelect 
}) => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [isCurrentFavorite, setIsCurrentFavorite] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    checkIfCurrentIsFavorite();
  }, [currentData, favorites]);

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('weatherFavorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = (newFavorites: FavoriteLocation[]) => {
    try {
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const checkIfCurrentIsFavorite = () => {
    const isFavorite = favorites.some(fav => 
      fav.name.toLowerCase() === currentData.location.name.toLowerCase()
    );
    setIsCurrentFavorite(isFavorite);
  };

  const addToFavorites = () => {
    const newFavorite: FavoriteLocation = {
      id: Date.now().toString(),
      name: currentData.location.name,
      region: currentData.location.region,
      country: currentData.location.country,
      temp: currentData.current.temp_c,
      condition: currentData.current.condition.text,
      addedAt: new Date().toISOString(),
    };

    const newFavorites = [...favorites, newFavorite];
    saveFavorites(newFavorites);
  };

  const removeFromFavorites = (id: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== id);
    saveFavorites(newFavorites);
  };

  const toggleCurrentFavorite = () => {
    if (isCurrentFavorite) {
      const favoriteToRemove = favorites.find(fav => 
        fav.name.toLowerCase() === currentData.location.name.toLowerCase()
      );
      if (favoriteToRemove) {
        removeFromFavorites(favoriteToRemove.id);
      }
    } else {
      addToFavorites();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Favorite Locations</h2>
        <button
          onClick={toggleCurrentFavorite}
          className={`p-2 rounded-xl transition-all duration-300 ${
            isCurrentFavorite 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          title={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isCurrentFavorite ? (
            <WeatherIcons.MapPin className="w-5 h-5 fill-current" />
          ) : (
            <WeatherIcons.MapPin className="w-5 h-5" />
          )}
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <WeatherIcons.MapPin className="w-12 h-12 text-white/50 mx-auto mb-3" />
          <p className="text-white/70 mb-2">No favorite locations yet</p>
          <p className="text-white/50 text-sm">
            Add locations to quickly check their weather
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((favorite) => {
            const WeatherIcon = getWeatherIcon(favorite.condition);
            
            return (
              <div
                key={favorite.id}
                className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                onClick={() => onLocationSelect(favorite.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <WeatherIcon className="w-6 h-6 text-white/80" />
                    <div>
                      <h3 className="text-white font-medium">{favorite.name}</h3>
                      <p className="text-white/60 text-sm">
                        {favorite.region}, {favorite.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-white text-lg font-semibold">
                        {formatTemperature(favorite.temp, favorite.temp * 9/5 + 32, unit)}
                      </p>
                      <p className="text-white/60 text-sm">{favorite.condition}</p>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(favorite.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300"
                      title="Remove from favorites"
                    >
                      <WeatherIcons.MapPin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-white/50 text-xs">
          Click on a location to view its weather
        </p>
      </div>
    </div>
  );
};

export default FavoriteLocations;