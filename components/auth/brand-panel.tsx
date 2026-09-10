"use client";

import React from "react";

export function BrandPanel() {
  return (
    <aside
      aria-label="Brand Overview"
      className="relative w-full h-full flex flex-col justify-center overflow-hidden text-white p-10 sm:p-14 lg:p-20 select-none"
      style={{
        backgroundColor: "#B30D12",
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
            fill="#73070A"
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
              fill="#520507"
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

      {/* Brand Content Container - Vertically Centered & Left-Aligned */}
      <div className="relative z-10 max-w-lg">
        {/* Top Logo Badge: Rounded red square with white outline and bold 'A' */}
        <div className="flex items-center gap-3.5 mb-10">
          <div className="w-12 h-12 rounded-xl border-2 border-white bg-[#C40E14] shadow-sm flex items-center justify-center font-black text-2xl text-white tracking-tighter leading-none shrink-0">
            A
          </div>
          <span className="text-xs sm:text-[13px] font-bold tracking-[0.1em] text-white uppercase antialiased">
            AUTOHUB PROCUREMENT
          </span>
        </div>

        {/* Brand Wordmark: PROCURly - Ultra-bold aerodynamic italic */}
        <div className="mb-4">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black italic tracking-tight text-white leading-none font-sans uppercase">
            PROCUR<span className="not-italic">LY</span>
          </h1>
          {/* Subtle underline beneath PRO */}
          <div className="w-12 h-1 bg-white/70 mt-3.5 rounded-full" />
        </div>

        {/* Tagline: Exactly matching reference */}
        <div className="mt-7">
          <p className="text-2xl sm:text-3xl text-white/95 font-normal leading-tight tracking-tight">
            International procurement <br />
            with confidence
          </p>
        </div>
      </div>
    </aside>
  );
}
