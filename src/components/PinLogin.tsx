import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useStore';
import { mockStaff } from '@/data/mockData';
import { Delete, LogIn, Ticket, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';

const PinLogin = () => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleNumberClick = useCallback((num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  }, [pin.length]);

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setPin('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (pin.length !== 4) {
      toast.error('Please enter a 4-digit PIN');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const staff = mockStaff.find((s) => s.pin === pin);
    
    if (staff) {
      login({ pin: staff.pin, name: staff.name, role: staff.role as 'cashier' | 'manager' });
      toast.success(`Welcome, ${staff.name}!`);
    } else {
      toast.error('Invalid PIN. Please try again.');
      setPin('');
    }
    
    setIsLoading(false);
  }, [pin, login]);

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-kermesse-pink/20 p-4">
      <Card className="w-full max-w-sm shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto flex items-center justify-center gap-2">
            <PartyPopper className="h-10 w-10 text-primary" />
            <Ticket className="h-10 w-10 text-kermesse-teal" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Kermesse POS
          </CardTitle>
          <p className="text-muted-foreground">Enter your staff PIN to continue</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* PIN Display */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  pin[i]
                    ? 'bg-primary text-primary-foreground border-primary scale-105'
                    : 'bg-muted border-border'
                }`}
              >
                {pin[i] ? '•' : ''}
              </div>
            ))}
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3">
            {numbers.map((num, index) => (
              <div key={index}>
                {num !== '' ? (
                  <Button
                    variant="outline"
                    className="w-full h-16 text-2xl font-bold hover:bg-primary hover:text-primary-foreground transition-all touch-target active:scale-95"
                    onClick={() => handleNumberClick(num)}
                    disabled={isLoading}
                  >
                    {num}
                  </Button>
                ) : index === 9 ? (
                  <Button
                    variant="ghost"
                    className="w-full h-16 text-muted-foreground hover:text-foreground"
                    onClick={handleClear}
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full h-16"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <Delete className="h-6 w-6" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Login Button */}
          <Button
            className="w-full h-14 text-lg font-semibold touch-target"
            onClick={handleSubmit}
            disabled={pin.length !== 4 || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </>
            )}
          </Button>

          {/* Demo PINs */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo PINs: 1234, 5678, or 0000</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinLogin;
