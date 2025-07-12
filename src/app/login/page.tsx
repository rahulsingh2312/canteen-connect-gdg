import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ChefHat } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Welcome to CanteenConnect</CardTitle>
            <CardDescription>Please select your role to continue</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <Link href="/" passHref>
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 transition-all duration-300 hover:bg-primary/10 hover:border-primary">
                <User className="h-8 w-8 text-primary" />
                <span className="font-semibold">I'm a Student</span>
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 transition-all duration-300 hover:bg-primary/10 hover:border-primary">
                <ChefHat className="h-8 w-8 text-primary" />
                <span className="font-semibold">I'm Staff</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
