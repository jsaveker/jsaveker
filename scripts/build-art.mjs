import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Original vector artwork. No external fonts, scripts, or image dependencies.
const out = fileURLToPath(new URL('../assets/', import.meta.url));
mkdirSync(out, { recursive: true });
const themes = {
  dark: { bg:'#0d1117', ink:'#edf4fb', muted:'#a5b5c5', grid:'#253848', cyan:'#57dfdf', amber:'#ffbc68', glow:'#183c47', line:'#355565' },
  light: { bg:'#f6f8fa', ink:'#182c3b', muted:'#4e6577', grid:'#d5e1e7', cyan:'#087d88', amber:'#aa5900', glow:'#d6edef', line:'#a3bbc7' },
};
const mono = "'SFMono-Regular',Consolas,'Liberation Mono',monospace";
const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function network(c, mobile) {
  const nodes = [[275,146],[356,83],[440,142],[361,219],[495,244],[470,55],[530,140],[264,264],[390,310],[187,229]];
  const edges = [[0,1],[0,2],[0,3],[1,2],[1,5],[2,3],[2,4],[2,5],[2,6],[3,4],[3,7],[3,8],[4,6],[4,8],[5,6],[7,8],[7,9],[9,0]];
  const wave = [];
  for (let i=0;i<=190;i+=2) {
    const envelope = Math.exp(-Math.pow((i-115)/64,2));
    const y=178 + Math.sin(i/9)*38*envelope + Math.sin(i/4.2)*7*envelope;
    wave.push(`${i===0?'M':'L'}${i},${y.toFixed(2)}`);
  }
  return `<g transform="${mobile?'translate(125,340) scale(.87)':'translate(680,8)'}">
    <circle cx="365" cy="175" r="178" fill="url(#aura)"/>
    <g stroke="${c.grid}" fill="none" stroke-width="1">
      <circle cx="365" cy="175" r="145"/><circle cx="365" cy="175" r="100"/>
      <path d="M365 15V338M205 175H545" stroke-dasharray="3 9"/>
    </g>
    <path d="${wave.join(' ')} L219,178 L245,146 L275,146" fill="none" stroke="${c.cyan}" stroke-width="2.6"/>
    ${edges.map(([a,b])=>`<path d="M${nodes[a]}L${nodes[b]}" stroke="${c.line}" stroke-width="1.5"/>`).join('')}
    <path d="M190 178L219 178L245 146L275 146L356 83L440 142L495 244" fill="none" stroke="${c.cyan}" stroke-width="2.5"/>
    <path d="M275 146L361 219L390 310" fill="none" stroke="${c.amber}" stroke-width="2"/>
    ${nodes.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i===2?17:11}" fill="${i===2?c.cyan:c.bg}" fill-opacity="${i===2?'.12':'1'}" stroke="${i===3||i===8?c.amber:c.cyan}" stroke-opacity=".4"/><circle cx="${x}" cy="${y}" r="${i===2?5:3.5}" fill="${i===3||i===8?c.amber:c.cyan}"/>`).join('')}
    <g fill="${c.muted}" font-family="${mono}" font-size="12" letter-spacing="1.2">
      <text x="22" y="234">SIGNAL</text><text x="375" y="39">CONTEXT</text><text x="407" y="335">UNDERSTANDING</text>
    </g>
    <g stroke="${c.amber}" stroke-width="1.5"><path d="M188 52h14m-7-7v14M528 300h14m-7-7v14"/></g>
  </g>`;
}

for (const [theme,c] of Object.entries(themes)) {
  for (const mobile of [false,true]) {
    const w=mobile?720:1280, h=mobile?708:420;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
<title id="title">Jim Saveker / N3SAV — Security. Signals. Systems.</title>
<desc id="desc">Building tools to understand what's happening. An RF waveform becomes a connected network, linking signals to context and understanding.</desc>
<defs>
  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill="${c.grid}"/></pattern>
  <radialGradient id="aura"><stop stop-color="${c.glow}" stop-opacity=".95"/><stop offset="1" stop-color="${c.bg}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${w}" height="${h}" rx="14" fill="${c.bg}"/>
<rect width="${w}" height="${h}" rx="14" fill="url(#grid)"/>
<path d="M${mobile?36:42} 34h32" stroke="${c.cyan}" stroke-width="3"/>
<path d="M${mobile?68:74} 34h12" stroke="${c.amber}" stroke-width="3"/>
<g font-family="${mono}" fill="${c.muted}" font-size="${mobile?17:14}" letter-spacing="2">
  <text x="${mobile?98:104}" y="40">N3SAV / AUSTIN, TX</text>
</g>
<g font-family="${sans}">
  <text x="${mobile?36:42}" y="${mobile?112:102}" fill="${c.ink}" font-size="${mobile?37:32}" font-weight="600" letter-spacing="-.8">Jim Saveker</text>
  <text x="${mobile?33:39}" y="${mobile?181:169}" fill="${c.ink}" font-size="59" font-weight="700" letter-spacing="-2.5">Security. Signals.</text>
  <text x="${mobile?33:39}" y="${mobile?248:235}" fill="${c.cyan}" font-size="59" font-weight="700" letter-spacing="-2.5">Systems.</text>
  <text x="${mobile?36:42}" y="${mobile?300:284}" fill="${c.muted}" font-size="22">Building tools to understand what’s happening.</text>
</g>
${network(c,mobile)}
<path d="M${mobile?36:42} ${h-52}H${w-42}" stroke="${c.grid}"/>
<g font-family="${mono}" font-size="${mobile?15:14}" letter-spacing="1.2" fill="${c.muted}">
  <text x="${mobile?36:42}" y="${h-25}">SECURITY ENGINEERING</text>
  <circle cx="${mobile?289:295}" cy="${h-30}" r="2" fill="${c.amber}"/>
  <text x="${mobile?309:315}" y="${h-25}">RADIO</text>
  <circle cx="${mobile?391:392}" cy="${h-30}" r="2" fill="${c.amber}"/>
  <text x="${mobile?411:412}" y="${h-25}">OPEN SOURCE</text>
  ${mobile?'':`<text x="1238" y="${h-25}" text-anchor="end">FAMOUS AMONGST DOZENS.</text>`}
</g>
</svg>\n`;
    writeFileSync(`${out}signal-station-${theme}${mobile?'-mobile':''}.svg`,svg);
  }
}
console.log('Built four theme-aware signal station banners.');
