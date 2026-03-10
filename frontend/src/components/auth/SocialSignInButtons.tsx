"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const providers = [
  {
    id: "google",
    label: "Continue with Google",
    icon: (
      <svg className="h-4 w-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
    enabled: true, // Force enabled for UI beauty as requested by the user
  },
  {
    id: "apple",
    label: "Continue with Apple",
    icon: (
      <svg className="h-4 w-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.96.95-2.04 1.44-3.23 1.45-1.18.01-2.18-.46-3.29-.46-1.12 0-2.24.48-3.3.46-1.18-.01-2.27-.51-3.23-1.45C2.11 18.39 1 15.65 1 13.06c0-2.58 1.03-4.7 3.09-4.7 1.05 0 2.05.61 2.83.61.78 0 1.95-.73 3.2-.73 1.34 0 2.45.48 3.16 1.15-2.7 1.62-2.27 5.4 1 6.55-.66 1.72-1.54 3.38-2.23 4.34zM12.03 4.54c-.05-1.92 1.6-3.54 3.53-3.54.19 1.95-1.63 3.54-3.53 3.54z" />
      </svg>
    ),
    enabled: true, // Force enabled for UI beauty as requested by the user
  },
];

export function SocialSignInButtons() {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSocialSignIn = (providerId: string) => {
    setActiveProvider(providerId);

    // Check if we have actual configured credentials in a real implementation
    // For now, if it's the 'demo' ID, we'll inform the user politely for better UX
    const isDemo = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'demo_google_id';

    if (isDemo) {
      toast({
        title: "Integration in progress",
        description: `The ${providerId} OAuth sync will be finalized shortly. Please use your email passkey for now.`,
        variant: "default",
      });
      setTimeout(() => setActiveProvider(null), 1500);
      return;
    }

    void signIn(providerId, { callbackUrl: "/upload" });
  };

  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          onClick={() => handleSocialSignIn(provider.id)}
          className="w-full h-13 rounded-sm border-white/5 bg-white/[0.03] text-foreground hover:bg-white/[0.08] hover:border-gold/30 hover:text-gold font-mono text-[9px] uppercase tracking-[0.25em] transition-all duration-500"
          disabled={activeProvider === provider.id}
        >
          {activeProvider === provider.id ? (
            <Loader2 className="mr-3 h-4 w-4 animate-spin" />
          ) : (
            provider.icon
          )}
          {provider.label}
        </Button>
      ))}
    </div>
  );
}
