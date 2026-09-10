import React from "react";
import { UserProfileCard } from "@/components/auth/user-profile-card";
import {
  Layers,
  Code2,
  Palette,
  Sparkles,
  ShieldAlert,
  Cpu,
  CloudUpload,
  Check,
  ArrowRight,
  ExternalLink,
  Lock,
} from "lucide-react";

export default function HomePage() {
  const stackItems = [
    { name: "Next.js 14", desc: "App Router & React Server Components", icon: Layers, status: "Ready" },
    { name: "TypeScript", desc: "Strict type safety & path aliasing", icon: Code2, status: "Configured" },
    { name: "Tailwind CSS", desc: "Tailored brand palette & utilities", icon: Palette, status: "Active" },
    { name: "Lucide React", desc: "Crisp, modern SVG icon system", icon: Sparkles, status: "Integrated" },
    { name: "Mock Auth", desc: "Context provider & multi-role personas", icon: Lock, status: "Operational" },
    { name: "Vercel-Ready", desc: "Production build & zero-config deploy", icon: CloudUpload, status: "Ready" },
  ];

  return (
    <main className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo with both brand colors */}
            <div className="w-10 h-10 rounded-xl bg-[#263b9f] flex items-center justify-center shadow-md shadow-[#263b9f]/20">
              <span className="text-white font-black text-xl tracking-wider">P</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">Procurly</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ED2025]/10 text-[#ED2025]">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Next.js • Tailwind • TypeScript</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Setup Complete
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#263b9f]/10 text-[#263b9f] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#263b9f]/20">
            <Cpu className="w-3.5 h-3.5" /> Initial Environment Initialized
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Ready for your <span className="text-[#263b9f]">Next</span> instructions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Core architecture is scaffolded with strict TypeScript, customized color theory tokens,
            Roboto typography, and mock authentication personas.
          </p>
        </div>

        {/* 2-Column Grid: Stack Status & Mock Auth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tech Stack & Colors (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Color Palette Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Brand Color Theory</h2>
                  <p className="text-xs text-slate-500">Configured tokens in Tailwind & CSS variables</p>
                </div>
                <Palette className="w-5 h-5 text-slate-400" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primary Red */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl shadow-inner flex items-center justify-center text-white text-xs font-mono font-bold"
                    style={{ backgroundColor: "#ED2025" }}
                  >
                    #ED2025
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ED2025]">
                      Primary Accent
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800">Crimson Red</h4>
                    <p className="text-xs text-slate-500 font-mono">brand.red (#ED2025)</p>
                  </div>
                </div>

                {/* Primary Navy */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl shadow-inner flex items-center justify-center text-white text-xs font-mono font-bold"
                    style={{ backgroundColor: "#263b9f" }}
                  >
                    #263b9f
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#263b9f]">
                      Core Navy
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800">Deep Indigo Navy</h4>
                    <p className="text-xs text-slate-500 font-mono">brand.navy (#263b9f)</p>
                  </div>
                </div>
              </div>

              {/* Font Family Note */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">Primary Font Family:</span>
                <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                  Roboto (next/font/google)
                </span>
              </div>
            </div>

            {/* Architecture / Stack Badges */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Technology Stack Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stackItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.name}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-[#263b9f]/5 text-[#263b9f] shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                            <Check className="w-3 h-3" />
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Mock Auth Live Test (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1">Mock Authentication Session</h2>
              <p className="text-xs text-slate-500 mb-3">
                Interactive Auth Context with realistic procurement roles
              </p>
              <UserProfileCard />
            </div>

            {/* Vercel Deployment Notice */}
            <div className="p-4 rounded-xl bg-slate-900 text-white shadow-sm flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-white/10 text-white shrink-0">
                <CloudUpload className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-semibold text-white">Vercel-Ready Architecture</h4>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Configured with standard Next.js build scripts and path aliasing. Ready for zero-config
                  deployment directly to Vercel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
