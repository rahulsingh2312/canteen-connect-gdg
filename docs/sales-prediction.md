# AI Sales Prediction System

## Overview

The AI Sales Prediction System automatically analyzes historical sales data and provides intelligent predictions for tomorrow's sales, along with cooking suggestions based on current inventory levels.

## Features

### 🎯 **Automatic Sales Recording**
- Every order placed through the cart automatically records sales data
- Real-time updates to prediction models
- No manual data entry required

### 📊 **Smart Predictions**
- Analyzes 30 days of historical sales data
- Calculates trends (increasing, decreasing, stable)
- Provides confidence scores for each prediction
- Considers seasonal patterns and growth trends

### 👨‍🍳 **Cooking Suggestions**
- AI-powered recommendations for food preparation
- Priority-based suggestions (high, medium, low)
- Considers current inventory levels
- Provides reasoning for each suggestion

### 📈 **Sales Statistics**
- Today's total sales
- Yesterday's comparison
- Weekly averages
- Growth percentage tracking

## How It Works

### 1. **Data Collection**
```typescript
// Automatically triggered when orders are placed
await recordSale(order);
```

### 2. **Prediction Algorithm**
- **Trend Analysis**: Compares recent vs. older sales patterns
- **Confidence Calculation**: Based on data consistency
- **Seasonal Adjustments**: Accounts for day-of-week patterns

### 3. **Cooking Suggestions**
- **Inventory Check**: Compares predicted demand vs. current stock
- **Priority Assignment**: Based on stock gaps and thresholds
- **Buffer Calculation**: Adds safety margins for preparation

## Database Schema

### Sales Collection
```typescript
{
  date: string;           // YYYY-MM-DD format
  productName: string;    // Menu item name
  quantity: number;       // Units sold
  orderId: string;        // Reference to order
  timestamp: Date;        // When recorded
}
```

### Inventory Collection
```typescript
{
  name: string;           // Product name
  stock: number;          // Current stock level
  lowStockThreshold: number; // Alert threshold
}
```

## Usage

### Dashboard Integration
The sales prediction tool is automatically available in the staff dashboard at `/dashboard`.

### Manual Testing
Use the "Test Sale" button to simulate order placement and see predictions update in real-time.

### API Endpoints

#### Record Sale (for testing)
```bash
POST /api/record-sale
Content-Type: application/json

{
  "items": [
    {
      "name": "Chole Bhature",
      "quantity": 2
    }
  ],
  "total": 240,
  "deliveryType": "pickup",
  "customerName": "Test Customer"
}
```

## Configuration

### Environment Variables
No additional environment variables required. Uses existing Firebase configuration.

### Prediction Parameters
- **Historical Data Window**: 30 days
- **Trend Threshold**: 10% change
- **Confidence Range**: 10% - 95%
- **Buffer Multipliers**: 1.1x for predictions, 1.2x for suggestions

## Setup Instructions

### 1. **Initial Data Seeding**
Click "Reset Menu Data" in the dashboard to seed:
- Sample sales data (8 days of historical data)
- Inventory data with stock levels
- Menu items with nutrition information

### 2. **Real-time Updates**
- Place orders through the main menu
- Sales data automatically records
- Predictions update immediately

### 3. **Monitoring**
- Check dashboard for daily predictions
- Monitor cooking suggestions
- Track sales statistics

## Algorithm Details

### Sales Prediction Formula
```typescript
// Base prediction
averageDaily = totalQuantity / numberOfDays

// Apply trend
if (trend === 'increasing') {
  predictedQuantity = averageDaily * 1.2
} else if (trend === 'decreasing') {
  predictedQuantity = averageDaily * 0.8
}

// Round to nearest whole number
predictedQuantity = Math.round(predictedQuantity)
```

### Trend Calculation
```typescript
// Compare last 3 days vs previous 3 days
recentAvg = average(last3Days)
olderAvg = average(previous3Days)
change = (recentAvg - olderAvg) / olderAvg

if (change > 0.1) return 'increasing'
if (change < -0.1) return 'decreasing'
return 'stable'
```

### Confidence Score
```typescript
// Based on coefficient of variation
mean = average(quantities)
stdDev = standardDeviation(quantities)
coefficientOfVariation = stdDev / mean
confidence = Math.max(0.1, Math.min(0.95, 1 - coefficientOfVariation))
```

## Troubleshooting

### No Predictions Showing
1. Check if sales data exists in Firestore
2. Verify inventory data is present
3. Ensure Firebase permissions are correct

### Predictions Not Updating
1. Check browser console for errors
2. Verify network connectivity
3. Refresh the dashboard manually

### Low Confidence Scores
- More historical data needed
- High variability in sales patterns
- Consider seasonal factors

## Future Enhancements

### Planned Features
- **Weather Integration**: Adjust predictions based on weather
- **Event Calendar**: Account for special events
- **Machine Learning**: More sophisticated prediction models
- **Email Alerts**: Low stock and high demand notifications
- **Mobile Notifications**: Real-time updates for staff

### Advanced Analytics
- **Customer Segmentation**: Different predictions for different customer types
- **Time-based Patterns**: Hourly and weekly patterns
- **Cross-selling Analysis**: Product combination predictions
- **Waste Reduction**: Optimize preparation quantities

## Support

For issues or questions about the sales prediction system:
1. Check the browser console for error messages
2. Verify Firebase configuration
3. Ensure all required collections exist
4. Contact development team for advanced troubleshooting 