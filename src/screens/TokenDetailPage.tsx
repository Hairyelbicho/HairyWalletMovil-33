[?? Suspicious Content] 
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import TokenChart from '@/components/tokens/TokenChart';
import { fetchTokenDetail, fetchTokenChart } from '@/services/tokenService';
import { ChartType } from './TokensPage';
import ChartTypeSelector from '@/components/tokens/ChartTypeSelector';

const TokenDetailPage: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialChartType = location.state?.chartType || 'line';
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  
  // Fetch token details
  const { data: tokenDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['tokenDetails', tokenId],
    queryFn: () => fetchTokenDetail(tokenId as string),
    enabled: !!tokenId,
    staleTime: 30000,
    retry: 1,
    meta: {
      onError: () => {
        toast.error("Error al obtener detalles del token");
      }
    }
  });

  // Fetch chart data
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['tokenChart', tokenId],
    queryFn: () => fetchTokenChart(tokenId as string),
    enabled: !!tokenId,
    staleTime: 30000,
    retry: 1,
    meta: {
      onError: () => {
        toast.error("Error al obtener datos del gráfico");
      }
    }
  });

  // Error handling
  useEffect(() => {
    if (!tokenDetails && !detailsLoading) {
      console.error("Error fetching token details");
    }
    if (!chartData && !chartLoading) {
      console.error("Error fetching chart data");
    }
  }, [tokenDetails, detailsLoading, chartData, chartLoading]);

  if (!tokenId) {
    return <div>Token ID no válido</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-3xl px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={() => navigate('/tokens')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold gradient-text">Detalles del Token</h1>
          </div>
          
          <div className="w-20"></div>
        </div>
        
        {detailsLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : tokenDetails ? (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center">
                <img 
                  src={tokenDetails.image?.large || tokenDetails.image} 
                  alt={tokenDetails.name} 
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{tokenDetails.name}</h2>
                  <p className="text-gray-500 uppercase">{tokenDetails.symbol}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold">${tokenDetails.market_data?.current_price?.usd.toLocaleString()}</p>
                  <p className={`text-sm ${tokenDetails.market_data?.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {tokenDetails.market_data?.price_change_percentage_24h >= 0 ? '+' : ''}
                    {tokenDetails.market_data?.price_change_percentage_24h?.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500">Market Cap Rank</h3>
                  <p className="font-medium">#{tokenDetails.market_data?.market_cap_rank || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Market Cap</h3>
                  <p className="font-medium">${tokenDetails.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Volumen 24h</h3>
                  <p className="font-medium">${tokenDetails.market_data?.total_volume?.usd?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Supply en Circulación</h3>
                  <p className="font-medium">{tokenDetails.market_data?.circulating_supply?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                No se pudieron cargar los detalles del token
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Chart Type Selector */}
        <div className="mb-4">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Gráfico de Precio (24h)</h3>
            {chartLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : chartData ? (
              <TokenChart data={chartData} type={chartType} />
            ) : (
              <div className="text-center py-8">
                No hay datos disponibles para el gráfico
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center">
          <a 
            href={`https://www.coingecko.com/coins/${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            Ver más información en CoinGecko
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailPage;


