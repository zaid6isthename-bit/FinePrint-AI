"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const providers = [
  {
    id: "google",
    label: "Continue with Google",
    enabled: Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
  },
  {
    id: "apple",
    label: "Continue with Apple",
    enabled: Boolean(process.env.NEXT_PUBLIC_APPLE_ID),
  },
];

export function SocialSignInButtons() {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const availableProviders = providers.filter((provider) => provider.enabled);
  if (availableProviders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {availableProviders.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          onClick={() => {
            setActiveProvider(provider.id);
            void signIn(provider.id, { callbackUrl: "/upload" });
          }}
          className="w-full h-12 rounded-sm border-white/10 bg-white/5 text-foreground hover:bg-white/10 font-mono text-[10px] uppercase tracking-[0.18em]"
          disabled={activeProvider === provider.id}
        >
          {activeProvider === provider.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {provider.label}
        </Button>
      ))}
    </div>
  );
}
