import React from 'react';
import { WeatherIcons } from '../utils/weatherIcons';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-red-500/20 backdrop-blur-lg rounded-3xl p-8 text-center border border-red-500/30">
        <WeatherIcons.CloudLightning className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-white/80 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all duration-300"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;