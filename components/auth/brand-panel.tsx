"use client";

import React from "react";
import { PoweredByAutohub } from "@/components/auth/powered-by-autohub";

export function BrandPanel() {
  return (
    <aside
      aria-label="Brand Overview"
      className="relative w-full h-full min-h-[640px] flex flex-col justify-between overflow-hidden text-white p-8 sm:p-12 lg:p-16 select-none"
      style={{
        backgroundColor: "#FE0000",
      }}
    >
      {/* 3D-Like Angular Faceted Polygon Shards matching reference image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base background gradient */}
          <rect width="1000" height="1000" fill="url(#base-grad)" />

          {/* Top bright angled facet */}
          <path
            d="M 1000 0 L 1000 320 L 350 0 Z"
            fill="url(#top-facet)"
            opacity="0.9"
          />

          {/* Central-right sweeping angular shard */}
          <path
            d="M 1000 280 L 1000 780 L 480 340 Z"
            fill="url(#mid-facet)"
            opacity="0.85"
          />

          {/* Bottom right dark angled facet */}
          <path
            d="M 1000 680 L 1000 1000 L 280 1000 Z"
            fill="#9b1115ff"
            opacity="0.95"
          />

          {/* Sharp diagonal light blade accent */}
          <polygon
            points="0,0 220,0 1000,600 1000,520"
            fill="white"
            opacity="0.04"
          />

          {/* Translucent Giant Watermark 'A' in bottom-right corner */}
          <g transform="translate(680, 640) scale(4.2)" opacity="0.12">
            <path
              d="M 50 5 L 88 95 L 68 95 L 50 48 L 32 95 L 12 95 Z M 50 63 L 59 86 L 41 86 Z"
              fill="#2b0001ff"
            />
          </g>

          <defs>
            <linearGradient id="base-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D9141B" />
              <stop offset="45%" stopColor="#C40E14" />
              <stop offset="100%" stopColor="#8A080C" />
            </linearGradient>

            <linearGradient id="top-facet" x1="100%" y1="0%" x2="35%" y2="35%">
              <stop offset="0%" stopColor="#F52229" />
              <stop offset="100%" stopColor="#C40E14" />
            </linearGradient>

            <linearGradient id="mid-facet" x1="100%" y1="30%" x2="50%" y2="50%">
              <stop offset="0%" stopColor="#99090D" />
              <stop offset="100%" stopColor="#B30D12" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Platform Identity with Approved AutoHub 'A' Logo Badge */}
      <div className="relative z-10 flex items-center gap-3 select-none">
        <div className="w-10 h-10 rounded-xl border-2 border-white bg-[#FE0000] shadow-md flex items-center justify-center font-black text-xl text-white tracking-tighter leading-none shrink-0 transition-transform duration-200 hover:scale-105">
          A
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-[13px] font-black italic tracking-tight text-white uppercase font-sans">
              PROCUR<span className="not-italic font-bold text-white/90">LY</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/70 bg-white/10 px-1.5 py-0.5 rounded border border-white/15 leading-none">
              Platform
            </span>
          </div>
          <span className="text-[10px] text-white/70 font-medium tracking-wide">
            B2B Automotive Trade Network
          </span>
        </div>
      </div>

      {/* Brand Content Container - Vertically Centered & Left-Aligned */}
      <div className="relative z-10 max-w-lg my-auto py-8">
        {/* Brand Wordmark: Refined PROCURly - Aerodynamic italic with precision speed accent */}
        <div className="mb-4 select-none">
          <div className="inline-block">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black italic tracking-tight text-white leading-none font-sans uppercase">
              PROCUR<span className="not-italic font-extrabold text-white/95">LY</span>
            </h1>
            {/* Precision aerodynamic speed accent blade beneath PRO */}
            <div className="flex items-center gap-1.5 mt-3.5">
              <div className="w-14 sm:w-16 h-1 rounded-full bg-gradient-to-r from-white via-white/90 to-white/30" />
              <div className="w-2.5 h-1 rounded-full bg-white/40" />
              <div className="w-1 h-1 rounded-full bg-white/20" />
            </div>
          </div>
        </div>

        {/* Tagline: Exactly matching reference */}
        <div className="mt-7">
          <p className="text-2xl sm:text-3xl text-white/95 font-normal leading-tight tracking-tight">
            International procurement
            with confidence
          </p>
        </div>
      </div>

      {/* Bottom of Page: Subtle, Professional "Powered by AutoHub" Signature Treatment */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
        <PoweredByAutohub variant="dark" />
      </div>
    </aside>
  );
}
