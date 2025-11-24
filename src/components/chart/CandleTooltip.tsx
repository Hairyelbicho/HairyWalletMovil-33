import React from 'react';

interface CandleTooltipProps {
  active?: boolean;
  payload?: any;
}

const CandleTooltip: React.FC<CandleTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const { open, close, high, low, time } = payload[0].payload;
    const formattedTime = new Date(time).toLocaleTimeString();

    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="text-gray-500 text-xs">{formattedTime}</p>
        <p className="text-green-600 font-semibold">O: ${open.toLocaleString()}</p>
        <p className="text-blue-600 font-semibold">C: ${close.toLocaleString()}</p>
        <p className="text-red-600 font-semibold">H: ${high.toLocaleString()}</p>
        <p className="text-yellow-600 font-semibold">L: ${low.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default CandleTooltip


