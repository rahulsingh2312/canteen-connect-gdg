"use client";

import { inventory } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Warehouse } from 'lucide-react';

export function DashboardInventory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Warehouse/>
            Items on Hand
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Stock Level</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map(item => {
              const isLowStock = item.stock <= item.lowStockThreshold;
              const stockPercentage = Math.min((item.stock / (item.lowStockThreshold * 2)) * 100, 100);

              return (
                <TableRow key={item.id} className={isLowStock ? 'bg-destructive/10' : ''}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-4 justify-center">
                        <span className="w-12 text-right">{item.stock}</span>
                        <Progress value={stockPercentage} className="w-24 h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {isLowStock ? (
                      <Badge variant="destructive">Low Stock</Badge>
                    ) : (
                      <Badge variant="secondary">In Stock</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
