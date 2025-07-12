'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChefHat, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Loader2,
  BarChart3,
  Target
} from 'lucide-react';
import { 
  getHistoricalSalesData, 
  getCurrentInventory, 
  predictSales, 
  generateCookingSuggestions,
  getSalesStatistics,
  type SalesPrediction,
  type CookingSuggestion
} from '@/lib/sales-prediction';

export function SalesPredictionTool() {
  const [predictions, setPredictions] = useState<SalesPrediction[]>([]);
  const [suggestions, setSuggestions] = useState<CookingSuggestion[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPredictions = async () => {
    try {
      setIsLoading(true);
      
      // Get data
      const [historicalData, inventory] = await Promise.all([
        getHistoricalSalesData(),
        getCurrentInventory()
      ]);

      // Generate predictions
      const salesPredictions = predictSales(historicalData);
      const cookingSuggestions = generateCookingSuggestions(salesPredictions, inventory);
      const salesStats = await getSalesStatistics();

      setPredictions(salesPredictions);
      setSuggestions(cookingSuggestions);
      setStatistics(salesStats);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadPredictions();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600';
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sales Prediction
          </CardTitle>
          <CardDescription>Analyzing sales patterns and generating predictions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              AI Sales Prediction
            </CardTitle>
            <CardDescription>
              Predict tomorrow's sales and get cooking suggestions based on historical data
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Target className="h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={async () => {
                try {
                  const response = await fetch('/api/record-sale', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      items: [
                        { 
                          id: '1', 
                          name: 'Chole Bhature', 
                          description: 'Delicious chole bhature', 
                          price: 120, 
                          image: '/images/chole-bhature.jpg', 
                          category: 'Main Course', 
                          isOnSale: false, 
                          dataAiHint: 'chole bhature', 
                          isPaused: false,
                          quantity: Math.floor(Math.random() * 5) + 1 
                        }
                      ],
                      total: 240,
                      deliveryType: 'pickup',
                      customerName: 'Test Customer'
                    })
                  });
                  if (response.ok) {
                    await refreshData();
                  }
                } catch (error) {
                  console.error('Error recording test sale:', error);
                }
              }}
            >
              Test Sale
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Sales Statistics */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{statistics.todayTotal}</div>
              <div className="text-sm text-blue-600">Today's Sales</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{statistics.yesterdayTotal}</div>
              <div className="text-sm text-green-600">Yesterday's Sales</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{statistics.weeklyAverage}</div>
              <div className="text-sm text-purple-600">Weekly Average</div>
            </div>
            <div className={`p-4 rounded-lg ${statistics.growth >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-2xl font-bold ${statistics.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {statistics.growth >= 0 ? '+' : ''}{statistics.growth.toFixed(1)}%
              </div>
              <div className={`text-sm ${statistics.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Growth
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="predictions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="predictions">Sales Predictions</TabsTrigger>
            <TabsTrigger value="suggestions">Cooking Suggestions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predictions" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Predicted sales for tomorrow based on historical patterns
            </div>
            
            {predictions.length > 0 ? (
              <div className="space-y-3">
                {predictions.map((prediction) => (
                  <div key={prediction.productName} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{prediction.productName}</h4>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(prediction.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(prediction.trend)}`}>
                          {prediction.trend}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold">
                        {prediction.predictedQuantity} units
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Confidence: {(prediction.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    
                    <Progress value={prediction.confidence * 100} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sales data available for predictions</p>
                <p className="text-sm">Start taking orders to generate predictions</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="suggestions" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              AI-powered cooking suggestions based on predictions and inventory
            </div>
            
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold">{suggestion.productName}</h4>
                      </div>
                      <Badge className={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-2xl font-bold text-blue-600">
                        {suggestion.suggestedQuantity} units
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Suggested quantity to prepare
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{suggestion.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No cooking suggestions available</p>
                <p className="text-sm">Add inventory data to get personalized suggestions</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last Updated</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleString()} • Data updates automatically when orders are placed
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
