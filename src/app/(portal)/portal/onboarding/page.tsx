"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Calendar,
  FileText,
  Target,
  Users,
  Sparkles,
  Zap,
  ChevronRight,
  LogIn,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Willkommen bei iistelle",
    description: "Dein persönliches Mitarbeiter-Portal. Hier kannst du deine Arbeitszeiten erfassen, Urlaub beantragen und vieles mehr.",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Zeiterfassung",
    description: "Mit nur einem Klick ein- und ausstempeln. Deine Arbeitszeit wird automatisch erfasst.",
    icon: Clock,
  },
  {
    id: 3,
    title: "Urlaub planen",
    description: "Beantrage Urlaub ganz einfach online. Deine Resturlaubstage siehst du immer auf einen Blick.",
    icon: Calendar,
  },
  {
    id: 4,
    title: "Dokumente & Ziele",
    description: "Greife auf deine Verträge zu und verfolge deine persönlichen Ziele.",
    icon: Target,
  },
];

export default function PortalOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/portal-login");
        return;
      }

      // Check if onboarding is already completed
      const { data: profile } = await supabase
        .from("employee_profiles")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        router.push("/portal");
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [supabase, router]);

  async function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("employee_profiles")
          .upsert({ user_id: user.id, onboarding_completed: true }, { onConflict: "user_id" });
      }
      setCompleted(true);
    }
  }

  function handleSkip() {
    router.push("/portal");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-petrol-200 border-t-coral-500" />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-petrol-900">Alles fertig! 🎉</h1>
          <p className="mt-3 text-petrol-500">
            Willkommen im Team! Du kannst jetzt loslegen.
          </p>
          <Link
            href="/portal"
            className="btn-primary mt-8 inline-flex justify-center"
          >
            Zum Portal
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Welcome */}
      <div className="hidden w-1/2 flex-col justify-between bg-petrol-900 p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="iistelle" width={36} height={36} className="rounded-lg" />
            <span className="text-xl font-bold tracking-tight">iistelle</span>
          </div>
        </div>

        <div>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-4 transition-all ${
                  i < currentStep ? "opacity-100" : i === currentStep ? "opacity-100" : "opacity-40"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    i <= currentStep ? "bg-coral-500 text-white" : "bg-white/10 text-white/60"
                  }`}
                >
                  {i < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{i + 1}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-white/60">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} iistelle · Alle Daten DSGVO-konform
        </p>
      </div>

      {/* Right Side - Content */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Progress */}
          <div className="mb-8 flex items-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i <= currentStep ? "bg-coral-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-10">
            <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-${step.icon === Sparkles ? "coral" : step.icon === Clock ? "sky" : step.icon === Calendar ? "violet" : "emerald"}-100`}>
              <step.icon className={`h-12 w-12 text-${step.icon === Sparkles ? "coral" : step.icon === Clock ? "sky" : step.icon === Calendar ? "violet" : "emerald"}-600`} />
            </div>
            <h1 className="text-2xl font-bold text-petrol-900">{step.title}</h1>
            <p className="mt-3 text-petrol-500">{step.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleNext}
              className="btn-primary justify-center"
            >
              {isLastStep ? "Loslegen" : "Weiter"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={handleSkip}
              className="text-center text-sm text-petrol-400 hover:text-petrol-600"
            >
              Überspringen –
            </button>
          </div>

          {/* Mobile Progress */}
          <div className="mt-8 flex justify-center gap-2 lg:hidden">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full ${
                  i <= currentStep ? "bg-coral-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}