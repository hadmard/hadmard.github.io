const fs = require('fs');

let reactMap = fs.readFileSync('src/components/LearningMap.tsx', 'utf-8');

// Replace standard themes
reactMap = reactMap.replace(
  "if (isCompleted) return 'border-[#E2C044] bg-[#2C2B26] shadow-[0_0_15px_rgba(226,192,68,0.4)] ring-[#E2C044]/50';",
  "if (isCompleted) return 'backdrop-blur-xl border-white/20 bg-white/10 shadow-[0_8px_32px_rgba(255,255,255,0.15)] ring-white/50 text-white rounded-2xl';"
);

reactMap = reactMap.replace(
  "if (isInProgress) return 'border-[#55CCD4] bg-[#1E2E31] shadow-[0_0_15px_rgba(85,204,212,0.4)] ring-[#55CCD4]/50';",
  "if (isInProgress) return 'backdrop-blur-xl border-white/30 bg-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.25)] ring-white/70 text-white rounded-2xl';"
);

reactMap = reactMap.replace(
  "if (isAvailable) return 'border-[#8A8A8A] bg-[#2A2A2A] hover:border-[#A0A0A0] shadow-[0_4px_10px_rgba(0,0,0,0.5)]';",
  "if (isAvailable) return 'backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-white/80 rounded-2xl transition-all duration-300';"
);

reactMap = reactMap.replace(
  "return 'border-[#3A3A3A] bg-[#1A1A1A] opacity-70 grayscale';",
  "return 'backdrop-blur-sm border border-white/5 bg-black/40 opacity-50 grayscale text-white/50 rounded-2xl';"
);

reactMap = reactMap.replace(
  "if (isCompleted) return 'text-[#E2C044] drop-shadow-[0_0_8px_rgba(226,192,68,0.8)]';",
  "if (isCompleted) return 'text-white';"
);

reactMap = reactMap.replace(
  "if (isInProgress) return 'text-[#55CCD4] drop-shadow-[0_0_8px_rgba(85,204,212,0.8)]';",
  "if (isInProgress) return 'text-white/90 animate-pulse';"
);

reactMap = reactMap.replace(
  "if (isAvailable) return 'text-[#CCCCCC]';",
  "if (isAvailable) return 'text-white/60';"
);

reactMap = reactMap.replace(
  "return 'text-[#555555]';",
  "return 'text-white/30';"
);

reactMap = reactMap.replace(
  /className="relative flex items-center justify-center p-1 cursor-pointer group"/g,
  'className="relative flex items-center justify-center p-2 cursor-pointer group transition-transform duration-500 hover:scale-105"'
);

reactMap = reactMap.replace(
  /className="relative w-12 h-12 flex items-center justify-center box-border border-4 transition-all duration-300 pointer-events-auto/g,
  'className="relative w-16 h-16 flex items-center justify-center box-border transition-all duration-500 pointer-events-auto'
);

reactMap = reactMap.replace(
  /className="text-xs text-\[#CCCCCC\] mb-2 font-mono leading-relaxed"/g,
  'className="text-sm text-white/60 mb-3 font-light leading-relaxed"'
);

reactMap = reactMap.replace(
  /className="text-\[10px\] px-1\.5 py-0\.5 rounded bg-\[#222222\] text-\[#888888\] border border-\[#333333\]"/g,
  'className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 backdrop-blur-md"'
);

reactMap = reactMap.replace(
  /className="mc-tooltip absolute \$\{tooltipPosition === 'top' \? 'bottom-full mb-3' : 'top-full mt-3'\} left-1\/2 -translate-x-1\/2 min-w-\[280px\] bg-\[#1A1A1A\] border-2 border-\[#3A3A3A\] p-3 pointer-events-none shadow-2xl z-50"/g,
  'className={`absolute ${tooltipPosition === "top" ? "bottom-full mb-5" : "top-full mt-5"} left-1/2 -translate-x-1/2 w-64 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 pointer-events-none shadow-2xl shadow-black/50 z-50 transition-all duration-300`}'
);

reactMap = reactMap.replace(
  /proOptions=\{\{ hideAttribution: true \}\}/g,
  'proOptions={{ hideAttribution: true }}\n        className="!bg-transparent"'
);

reactMap = reactMap.replace(
  /<Background gap=\{48\} size=\{2\} color="transparent" \/>/g,
  '<Background gap={32} size={1} color="rgba(255,255,255,0.05)" />'
);

reactMap = reactMap.replace(
  /const edgeType = 'step';/g,
  "const edgeType = 'smoothstep';"
);

reactMap = reactMap.replace(/stroke: '#E2C044'/g, "stroke: 'rgba(255,255,255,0.8)'");
reactMap = reactMap.replace(/stroke: '#55CCD4'/g, "stroke: 'rgba(255,255,255,0.5)'");
reactMap = reactMap.replace(/stroke: '#4A4A4A'/g, "stroke: 'rgba(255,255,255,0.15)'");

fs.writeFileSync('src/components/LearningMap.tsx', reactMap);