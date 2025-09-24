import { useState } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
export function AgeVerificationModal() {
  const [isChecked, setIsChecked] = useState(false);
  const verify = useSessionStore((state) => state.verify);
  const handleEnter = () => {
    if (isChecked) {
      verify();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Card className="w-full max-w-md border-navy/20 bg-white/50 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-10 h-10 text-magenta" />
            </div>
            <CardTitle className="font-display text-3xl text-navy">
              Welcome to CanvasSpark AI
            </CardTitle>
            <CardDescription className="text-navy/70 pt-2">
              Please confirm your age to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-navy">Content Warning</h3>
                <p className="text-sm text-navy/80">
                  This application allows the creation of content intended for adults and may contain material that is not suitable for all audiences. User discretion is advised.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="age-confirm"
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                className="border-navy/50 data-[state=checked]:bg-magenta data-[state=checked]:border-magenta"
              />
              <Label htmlFor="age-confirm" className="text-sm font-medium leading-none text-navy cursor-pointer">
                I confirm that I am 18 years of age or older and agree to the terms of use.
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleEnter}
              disabled={!isChecked}
              className="w-full bg-magenta text-white font-semibold py-6 hover:bg-magenta/90 transition-all duration-300 ease-in-out hover:shadow-lg disabled:bg-navy/30 disabled:cursor-not-allowed"
            >
              Enter Studio
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}