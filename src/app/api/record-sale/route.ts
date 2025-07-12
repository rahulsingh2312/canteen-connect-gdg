import { NextRequest, NextResponse } from 'next/server';
import { recordSale } from '@/lib/sales-prediction';
import type { Order } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, deliveryType, customerName, benchNumber } = body;

    // Create a mock order for testing
    const mockOrder: Order = {
      id: `test-${Date.now()}`,
      items: items || [
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
          quantity: 2 
        }
      ],
      total: total || 240,
      status: 'Received',
      deliveryType: deliveryType || 'pickup',
      benchNumber: benchNumber || '',
      customerName: customerName || 'Test Customer',
      paymentId: 'test-payment',
      createdAt: new Date() as any, // Type assertion for testing
    };

    await recordSale(mockOrder);

    return NextResponse.json({ 
      success: true, 
      message: 'Sale recorded successfully',
      orderId: mockOrder.id 
    });
  } catch (error) {
    console.error('Error recording sale:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record sale' },
      { status: 500 }
    );
  }
} 