import { DashboardInventory } from "@/components/dashboard-inventory";
import { DashboardMenuManager } from "@/components/dashboard-menu-manager";
import { DashboardOrders } from "@/components/dashboard-orders";
import { SalesPredictionTool } from "@/components/sales-prediction-tool";
import { DatabaseSeeder } from "@/components/database-seeder";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold mb-6">Staff Dashboard</h1>
      <div className="flex flex-col gap-8">
        <DatabaseSeeder />
        <DashboardMenuManager />
        <SalesPredictionTool />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DashboardOrders />
            <DashboardInventory />
        </div>
      </div>
    </div>
  );
}
