import React from 'react';
import { EVENTS } from '../data/eventsData';

export const WinnersSection = () => {
  // Vibrant theme colors for each event card matching the user's reference design
  const cardThemes = [
    {
      // Hackathon / Digital Treasure Hunt - Orange
      bg: 'bg-[#FF5500]',
      badgeBg: 'bg-black text-[#FFB020]',
      rowBg: 'bg-white/20 hover:bg-white/25 border-white/20',
      titleColor: 'text-white',
      collegeColor: 'text-white/80',
      prizeColor: 'text-white',
      accentGlow: 'shadow-[0_10px_30px_rgba(255,85,0,0.3)]',
    },
    {
      // Prompt to Product / Tech Quiz - Vibrant Blue
      bg: 'bg-[#1E50FF]',
      badgeBg: 'bg-black text-[#FFB020]',
      rowBg: 'bg-white/20 hover:bg-white/25 border-white/20',
      titleColor: 'text-white',
      collegeColor: 'text-white/80',
      prizeColor: 'text-white',
      accentGlow: 'shadow-[0_10px_30px_rgba(30,80,255,0.3)]',
    },
    {
      // Robo Race / Ideathon - Emerald Green
      bg: 'bg-[#00B060]',
      badgeBg: 'bg-black text-[#FFB020]',
      rowBg: 'bg-white/20 hover:bg-white/25 border-white/20',
      titleColor: 'text-white',
      collegeColor: 'text-white/80',
      prizeColor: 'text-white',
      accentGlow: 'shadow-[0_10px_30px_rgba(0,176,96,0.3)]',
    },
    {
      // Free Fire - Crimson / Red
      bg: 'bg-[#E11D48]',
      badgeBg: 'bg-black text-[#FFB020]',
      rowBg: 'bg-white/20 hover:bg-white/25 border-white/20',
      titleColor: 'text-white',
      collegeColor: 'text-white/80',
      prizeColor: 'text-white',
      accentGlow: 'shadow-[0_10px_30px_rgba(225,29,72,0.3)]',
    },
    {
      // Minute to Win It - Purple / Violet
      bg: 'bg-[#8B5CF6]',
      badgeBg: 'bg-black text-[#FFB020]',
      rowBg: 'bg-white/20 hover:bg-white/25 border-white/20',
      titleColor: 'text-white',
      collegeColor: 'text-white/80',
      prizeColor: 'text-white',
      accentGlow: 'shadow-[0_10px_30px_rgba(139,92,246,0.3)]',
    },
    {
      // Video Editing - Amber / Gold
      bg: 'bg-[#D97706]',
      badgeBg: 'bg-black text-[#FFB020]',
      rowBg: 'bg-white/20 hover:bg-white/25 border-white/20',
      titleColor: 'text-white',
      collegeColor: 'text-white/80',
      prizeColor: 'text-white',
      accentGlow: 'shadow-[0_10px_30px_rgba(217,119,6,0.3)]',
    },
    {
      // Logo Mania - Cyan / Teal
      bg: 'bg-[#0D9488]',
      badgeBg: 'bg-black text-[#FFB020]',
      rowBg: 'bg-white/20 hover:bg-white/25 border-white/20',
      titleColor: 'text-white',
      collegeColor: 'text-white/80',
      prizeColor: 'text-white',
      accentGlow: 'shadow-[0_10px_30px_rgba(13,148,136,0.3)]',
    },
  ];

  return (
    <section id="winners" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
            <span>🏆 // Champions Hall of Fame</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-tech font-bold text-white mb-4">
            Event <span className="text-gradient-cyan">Winners</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Celebrating the top achievers and standout performers of TECHNOTSAV 2026 across all 7 flagship arenas.
          </p>
        </div>

        {/* Winners Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {EVENTS.map((event, index) => {
            const theme = cardThemes[index % cardThemes.length];
            const winners = event.winners || [
              {
                position: '1ST',
                teamName: 'Winner To Be Announced',
                college: 'College / Institute Name',
                prize: '₹—',
              },
              {
                position: '2ND',
                teamName: 'Runner-up To Be Announced',
                college: 'College / Institute Name',
                prize: '₹—',
              },
            ];

            return (
              <div
                key={event.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${theme.bg} ${theme.accentGlow} text-white shadow-xl relative overflow-hidden`}
              >
                <div>
                  {/* Category / Sub-header in uppercase monospace */}
                  <div className="text-[11px] font-mono uppercase tracking-wider font-bold opacity-80 mb-2">
                    {event.category}
                  </div>

                  {/* Event Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
                    {event.name}
                  </h3>

                  {/* 2 Winners per event */}
                  <div className="space-y-3.5">
                    {winners.map((winner, wIdx) => (
                      <div
                        key={wIdx}
                        className={`rounded-2xl p-4 flex items-center justify-between gap-3 border backdrop-blur-md transition-all duration-200 ${theme.rowBg}`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* 1ST / 2ND Badge */}
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider shrink-0 shadow-sm ${theme.badgeBg}`}
                          >
                            {winner.position}
                          </span>

                          {/* Winner / Team Name & College */}
                          <div className="min-w-0">
                            <div className="font-bold text-sm sm:text-base tracking-tight truncate leading-tight">
                              {winner.teamName}
                            </div>
                            <div className="text-xs opacity-85 truncate mt-0.5 font-medium">
                              {winner.college}
                            </div>
                          </div>
                        </div>

                        {/* Prize Amount */}
                        <div className="text-sm sm:text-base font-extrabold tracking-tight shrink-0 font-mono">
                          {winner.prize}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Code Footer */}
                <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-mono opacity-80">
                  <span>Code: {event.code}</span>
                  <span className="font-semibold uppercase tracking-wider">Top 2 Laureates</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
