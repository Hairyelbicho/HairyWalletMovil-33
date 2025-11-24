import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { ChartType } from '@/pages/TokensPage';

interface ChartDataPoint {
  timestamp: number;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

interface TokenChartProps {
  data: ChartDataPoint[];
  type?: ChartType;
}

const formatXAxis = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const d = payload[0].payload;
    const time = new Date(d.time).toLocaleTimeString();

    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="text-gray-500 text-xs">{time}</p>
        {d.open !== undefined && <p className="font-bold">O: ${d.open.toLocaleString()}</p>}
        {d.close !== undefined && <p className="font-bold">C: ${d.close.toLocaleString()}</p>}
        {d.high !== undefined && <p className="font-bold">H: ${d.high.toLocaleString()}</p>}
        {d.low !== undefined && <p className="font-bold">L: ${d.low.toLocaleString()}</p>}
        {d.value !== undefined && !d.open && <p className="font-bold">${d.value.toLocaleString()}</p>}
      </div>
    );
  }
  return null;
};

const CandleShape: React.FC<any> = (props) => {
  const { x, y, width, height, payload } = props;
  if (x == null || y == null || width == null || height == null) return null;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={payload.colorValue}
    />
  );
};

const TokenChart: React.FC<TokenChartProps> = ({ data, type = 'line' }) => {
  const chartData = data.map(point => ({
    time: point.timestamp,
    value: point.price,
    open: point.open ?? point.price,
    close: point.close ?? point.price,
    high: point.high ?? point.price * 1.01,
    low: point.low ?? point.price * 0.99,
    colorValue: (point.open ?? point.price) < (point.close ?? point.price)
      ? "#10b981"
      : "#ef4444"
  }));

  const isPriceUp = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const lineColor = isPriceUp ? "#10b981" : "#ef4444";

  const chartConfig = {
    price: {
      color: lineColor,
      label: "Precio"
    },
    positive: {
      color: "#10b981",
      label: "Subida"
    },
    negative: {
      color: "#ef4444",
      label: "Bajada"
    }
  };

  const renderChart = () => {
    if (type === 'candle') {
      return (
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="time" tickFormatter={formatXAxis} tick={{ fontSize: 10 }} stroke="#9ca3af" />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v.toLocaleString()}`} width={50} stroke="#9ca3af" />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="#000000"
            isAnimationActive={false}
            shape={<CandleShape />}
          />
        </BarChart>
      );
    }

    return (
      <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="time" tickFormatter={formatXAxis} tick={{ fontSize: 10 }} stroke="#9ca3af" />
        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v.toLocaleString()}`} width={50} stroke="#9ca3af" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: lineColor, strokeWidth: 2 }}
        />
      </LineChart>
    );
  };

  return (
    <ChartContainer className="h-[200px]" config={chartConfig}>
      {renderChart()}
    </ChartContainer>
  );
};

export default TokenChart;



