/* ════════════════════════════════════════════════
   Horizon Tab v3.0 — Premium drawer + SVG logos
   ════════════════════════════════════════════════ */

const LAT=22.34860703380474,LON=87.31654048689403; // Midnapore, West Bengal

const SE={
  google:"https://www.google.com/search?q=",
  duckduckgo:"https://duckduckgo.com/?q=",
  brave:"https://search.brave.com/search?q=",
  bing:"https://www.bing.com/search?q=",
  startpage:"https://www.startpage.com/do/dsearch?query=",
  kagi:"https://kagi.com/search?q=",
  qwant:"https://www.qwant.com/?q=",
  searxng:"https://searx.be/search?q="
};
const WEB_L={google:"Google",duckduckgo:"DuckDuckGo",brave:"Brave",bing:"Bing",startpage:"Startpage",kagi:"Kagi",qwant:"Qwant",searxng:"SearXNG"};

/* AI chat providers.
   `url`    — base URL, query appended URL-encoded
   `origin` — for the optional prompt bridge's host permission
   `mode`   — what actually happens when you land there:
     "search"  the provider runs the query itself (true auto-search)
     "prefill" the text lands in the composer; you press Enter
     "bridge"  the provider ignores URL params entirely — only the
               opt-in prompt bridge can fill it (else you retype)
   Verified July 2026. Gemini has never supported URL prefill: the old
   entry here pointed at aistudio.google.com (Google's DEVELOPER
   console) purely because prefill works there — wrong destination for
   anyone wanting the normal Gemini chat. */
const AI={
  perplexity:{url:"https://www.perplexity.ai/search?q=",origin:"https://www.perplexity.ai/*",mode:"search"},
  chatgpt:{url:"https://chatgpt.com/?q=",origin:"https://chatgpt.com/*",mode:"prefill"},
  claude:{url:"https://claude.ai/new?q=",origin:"https://claude.ai/*",mode:"prefill"},
  grok:{url:"https://grok.com/?q=",origin:"https://grok.com/*",mode:"prefill"},
  gemini:{url:"https://gemini.google.com/app?q=",origin:"https://gemini.google.com/*",mode:"bridge"},
  deepseek:{url:"https://chat.deepseek.com/?q=",origin:"https://chat.deepseek.com/*",mode:"bridge"}
};
const AI_MODE_NOTE={search:"runs your query automatically",prefill:"fills the box — press Enter to send",bridge:"ignores prefilled links; enable Prompt bridge below to auto-fill"};
const AI_L={perplexity:"Perplexity",grok:"Grok",gemini:"Gemini",chatgpt:"ChatGPT",claude:"Claude",deepseek:"DeepSeek"};
/* Drawer badge per provider, derived from real capability.
   The old AI_AUTO set listed gemini as "auto" — the one provider that
   can't even accept a prefilled prompt. */
function aiBadge(k){
  const c=customAIById(k),m=c?c.mode:(AI[k]||{}).mode;
  if(m==="search")return "→ auto";
  if(m==="prefill")return "✎ prefill";
  return state.aiBridge?"⇥ bridge":"↗ opens chat";
}
const AI_ORDER=["perplexity","grok","gemini","chatgpt","claude","deepseek"];

/* ── SVG Logo Icons ──
   Brand-accurate single-color (or minimal-multi-color) glyphs sized
   to a 24×24 grid. Each is one path or a small set of primitive
   shapes — no large duplicated geometry, no clipping hacks. */
const LOGOS={
  // ── Web search engines ──────────────────────────────────────────
  // Google "G" — the four-color ring + bar from the current brand mark.
  google:`<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1.1 2.5-2.3 3.3v2.7h3.7c2.2-2 3.4-5 3.4-8z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.7-2.7c-1 .7-2.3 1.1-3.5 1.1-2.7 0-5-1.8-5.9-4.3H2.3v2.7C4.1 20.5 7.8 23 12 23z"/><path fill="#FBBC05" d="M6.1 14.5c-.2-.6-.4-1.3-.4-2s.1-1.4.4-2V7.7H2.3C1.5 9.1 1 10.5 1 12s.5 2.9 1.3 4.3l3.8-2.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.8 1 4.1 3.5 2.3 7.7l3.8 2.8c.9-2.5 3.2-4.3 5.9-4.3z"/></svg>`,

  // DuckDuckGo — orange disc with the white "duck head" silhouette.
  duckduckgo:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#DE5833"/><path fill="#FFF" d="M7 10.5c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v.6c.4-.3.9-.5 1.4-.5h.5c.3 0 .5.2.5.5s-.2.5-.5.5h-.5c-.8 0-1.4.6-1.4 1.4v1.3c0 .9-.5 1.7-1.3 2-.3.1-.6.2-.9.2-.8 0-1.5-.4-1.9-1-.4-.6-.5-1.4-.3-2.1.2-.7.7-1.2 1.4-1.5.1 0 .2-.1.3-.1v-1.3zm9 0c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v1.3c.1 0 .2.1.3.1.7.3 1.2.8 1.4 1.5.2.7.1 1.5-.3 2.1-.4.6-1.1 1-1.9 1-.3 0-.6-.1-.9-.2-.8-.3-1.3-1.1-1.3-2v-1.3c0-.8-.6-1.4-1.4-1.4h-.5c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h.5c.5 0 1 .2 1.4.5v-.6z"/><path fill="#FFF" d="M9.5 14.5c-.3.3-.6.5-1 .6-.4.1-.8 0-1.1-.3-.3-.3-.4-.7-.3-1.1.1-.4.4-.7.8-.8.4-.1.9 0 1.2.3.3.3.5.7.4 1.3z"/></svg>`,

  // Brave — lion-head shield in orange.
  brave:`<svg viewBox="0 0 24 24"><path fill="#FB542B" d="M12 1.5L3 5.4v6.5c0 5.6 4 9.7 9 10.6 5-.9 9-5 9-10.6V5.4L12 1.5z"/><path fill="#FFF" d="M12 4.5L6.7 7.1l.9 4.4L12 14l4.4-2.5.9-4.4L12 4.5z"/><path fill="#FB542B" d="M9.2 13l2.8 1.6 2.8-1.6L12 16.2 9.2 13z"/></svg>`,

  // Bing — teal "b" letterform.
  bing:`<svg viewBox="0 0 24 24"><path fill="#008373" d="M3 3l9 2.2v15.6L3 18.5V3z"/><path fill="#0066CC" d="M12 5.2l9-2.2v15.6l-9 2.4V5.2z"/><path fill="#FFF" d="M14.5 9.8c1.6-.5 3.2.3 3.6 1.8.4 1.5-.5 3-2.1 3.5l-2.4.7-1.5-1.4 2.4-.6zm-3 4.7l1.5 1.4-1.2.4-1.8-.4 1.5-1.4z" opacity=".95"/></svg>`,

  // Startpage — three concentric rings (target).
  startpage:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#7B68EE"/><circle cx="12" cy="12" r="7" fill="none" stroke="#FFF" stroke-width="1.5"/><circle cx="12" cy="12" r="4.2" fill="#FFF"/><circle cx="12" cy="12" r="2" fill="#7B68EE"/></svg>`,

  // Kagi — yellow shield with stylized "K" centered.
  kagi:`<svg viewBox="0 0 24 24"><path fill="#FFB300" d="M12 1.5L3 5.4v6.4c0 5.4 4.1 9.4 9 10.2 4.9-.8 9-4.8 9-10.2V5.4L12 1.5z"/><path fill="#FFF" d="M8.5 7h2v4.2L14.5 7h2.5l-4.5 5 4.8 5h-2.6L10.5 12.4V17h-2V7z"/></svg>`,

  // Qwant — cyan ring + magenta heart.
  qwant:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#4CC2FF"/><path fill="#FF596A" d="M12 16.5s-4.5-2.7-4.5-6.2c0-1.8 1.4-3.3 3.2-3.3 1 0 1.9.5 2.3 1.3.4-.8 1.3-1.3 2.3-1.3 1.8 0 3.2 1.5 3.2 3.3 0 3.5-4.5 6.2-4.5 6.2z"/></svg>`,

  // SearXNG — blue card with magnifying glass + "S".
  searxng:`<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2.5" fill="#3056D3"/><path fill="#FFF" d="M7 8.5h7v1.6H7zm0 3h7v1.6H7zm0 3h4.5v1.6H7z"/><circle cx="17" cy="15" r="2.6" fill="none" stroke="#F3C623" stroke-width="1.6"/><path stroke="#F3C623" stroke-width="1.6" stroke-linecap="round" d="M19 17l2 2"/></svg>`,

  // ── AI providers ────────────────────────────────────────────────
  // Perplexity — dark card with the brand teal "perplexity" mark.
  perplexity:`<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="3.5" fill="#1F1F1F"/><path fill="none" stroke="#20808D" stroke-width="2" stroke-linecap="round" d="M5 8l3.5 4-3.5 4M19 8l-3.5 4 3.5 4M9.5 17l5-10"/></svg>`,

  // Grok — black circle, the xAI forward-slash mark (the recognizable
  // 2023–2025 "slash in a square" glyph, not the letter-G approximation
  // that read as an "N" at small sizes).
  grok:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#000"/><path stroke="#FFF" stroke-width="3.2" stroke-linecap="round" d="M16 7.5L8 16.5"/></svg>`,

  // Gemini — the four-point star, two-color gradient.
  gemini:`<svg viewBox="0 0 24 24"><defs><linearGradient id="gG" x1="0" x2="1"><stop offset="0" stop-color="#4796E3"/><stop offset="1" stop-color="#9177C7"/></linearGradient></defs><path fill="url(#gG)" d="M12 2l1.8 8.2L22 12l-8.2 1.8L12 22l-1.8-8.2L2 12l8.2-1.8L12 2z"/></svg>`,

  // ChatGPT — green circle, the spiral "flower" shape.
  chatgpt:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#10A37F"/><path fill="#FFF" d="M15.4 8.6c.5-1.3.1-2.7-1-3.4-1.1-.8-2.6-.7-3.6.2-1-.9-2.5-1-3.6-.2-1.1.7-1.5 2.1-1 3.4-1.3.5-2 1.7-1.8 3 .2 1.3 1.2 2.3 2.5 2.5.2 1.3 1.2 2.3 2.5 2.5.5 0 1-.1 1.5-.3.5.2 1 .3 1.5.3 1.3-.2 2.3-1.2 2.5-2.5 1.3-.2 2.3-1.2 2.5-2.5.2-1.3-.5-2.5-1.8-3zm-3.4 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`,

  // Claude — orange circle, the Claude "C" mark (asterisk-style).
  claude:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#D97757"/><path fill="#FFF" d="M16.4 8.5c-.6-.9-1.6-1.5-2.7-1.5H11c-.4 0-.8.1-1.1.3-.3-.5-.9-.8-1.5-.8-1 0-1.8.8-1.8 1.8 0 .4.1.7.3 1-.6.6-1 1.5-1 2.4 0 1.9 1.5 3.4 3.4 3.4.6 0 1.2-.2 1.7-.5.5.3 1.1.5 1.7.5 1.9 0 3.4-1.5 3.4-3.4 0-1.4-.8-2.5-2-3 .4-.1.6-.4.6-.7 0-.3-.1-.5-.3-.5zm-5.9 5.5c-.7 0-1.3-.6-1.3-1.3 0-.4.2-.7.4-.9.2.1.5.2.8.2.1.3.2.5.4.7-.1.7-.3 1.3-.3 1.3zm3.2-2c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z"/></svg>`,

  // DeepSeek — blue circle, the "whale" simplified to a stylized D.
  deepseek:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#4D6BFE"/><path fill="#FFF" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-1 4h2v6h-2V8zm0 7h2v2h-2v-2z"/></svg>`
};

const AI_FREE_PARAMS={
  google:"&udm=14",duckduckgo:"&ia=web",brave:"&source=web",
  bing:"&adlt=strict&qft=interval%3d%22%22",kagi:"&ai_mode=off",
};


/* ══════════════════════════════════════════════════
   FILTERS — two orthogonal axes, freely combinable
   ══════════════════════════════════════════════════
   Until v1.12 a single `searchType` value held the mode AND the filter,
   so you could pick exactly ONE of {Reddit, News, PDF, Video, Images}
   and nothing could combine. "Images from Reddit" or "news PDFs" were
   simply unexpressible.

   Now:
     VERTICAL  — which result surface (All / News / Images / Video).
                 Mutually exclusive by nature; every engine has all four
                 (see MEDIA_URL — all 8 engines, no gaps).
     REFINERS  — multi-select narrowings that ride ON TOP of any
                 vertical. Text refiners are search operators appended
                 to the query, so they work on every engine; the Recent
                 refiner is a per-engine URL parameter.

   Any vertical × any refiner set × any engine is a valid combination. */

const VERTICAL_L={all:"All",article:"News",images:"Images",video:"Video"};

/* Text refiners — standard operators, honored by every engine here. */
const REFINERS={
  reddit:{label:"Reddit",op:" site:reddit.com"},
  academic:{label:"Academic",op:" (site:.edu OR site:arxiv.org OR site:jstor.org)"},
  pdf:{label:"PDF",op:" filetype:pdf"},
  exact:{label:"Exact",op:null},   // wraps the query in quotes instead
  recent:{label:"Recent",op:null}  // per-engine URL param, see TIME_PARAM
};
const REFINER_ORDER=["reddit","academic","pdf","exact","recent"];

/* Recent = past month, per engine. Kagi exposes no documented URL
   parameter for time range, so the chip reports itself unavailable
   there rather than silently doing nothing. */
const TIME_PARAM={
  google:"&tbs=qdr:m",
  duckduckgo:"&df=m",
  brave:"&tf=pm",
  bing:"&filters=ex1%3A%22ez3%22",
  startpage:"&with_date=m",
  qwant:"&freshness=month",
  searxng:"&time_range=month",
  kagi:null
};
const MEDIA_URL={
  google:{article:"https://www.google.com/search?q=%s&tbm=nws",video:"https://www.google.com/search?q=%s&tbm=vid",images:"https://www.google.com/search?q=%s&tbm=isch"},
  duckduckgo:{article:"https://duckduckgo.com/?q=%s&iar=news&ia=news",video:"https://duckduckgo.com/?q=%s&iax=videos&ia=videos",images:"https://duckduckgo.com/?q=%s&iax=images&ia=images"},
  brave:{article:"https://search.brave.com/news?q=%s",video:"https://search.brave.com/videos?q=%s",images:"https://search.brave.com/images?q=%s"},
  bing:{article:"https://www.bing.com/news/search?q=%s",video:"https://www.bing.com/videos/search?q=%s",images:"https://www.bing.com/images/search?q=%s"},
  startpage:{article:"https://www.startpage.com/sp/search?query=%s&cat=news",video:"https://www.startpage.com/sp/search?query=%s&cat=video",images:"https://www.startpage.com/sp/search?query=%s&cat=images"},
  kagi:{article:"https://kagi.com/news?q=%s",video:"https://kagi.com/videos?q=%s",images:"https://kagi.com/images?q=%s"},
  qwant:{article:"https://www.qwant.com/?q=%s&t=news",video:"https://www.qwant.com/?q=%s&t=videos",images:"https://www.qwant.com/?q=%s&t=images"},
  searxng:{article:"https://searx.be/search?q=%s&categories=news",video:"https://searx.be/search?q=%s&categories=videos",images:"https://searx.be/search?q=%s&categories=images"}
};

/* ══════════════════════════════════════════════════
   SHOP — direct product search at major retailers
   ══════════════════════════════════════════════════
   %s = URL-encoded query. Patterns verified July 2026; Target's
   ?searchTerm= and Home Depot's path-based /s/<query> were both
   confirmed against live URL samples rather than assumed.
   `mark` + `color` drive a generated lettermark tile — deliberately
   NOT imitation brand logos, which would be both inaccurate and a
   trademark problem for a published extension. */
const SHOP={
  amazon:{label:"Amazon",url:"https://www.amazon.com/s?k=%s",mark:"a",color:"#FF9900"},
  ebay:{label:"eBay",url:"https://www.ebay.com/sch/i.html?_nkw=%s",mark:"e",color:"#E53238"},
  walmart:{label:"Walmart",url:"https://www.walmart.com/search?q=%s",mark:"W",color:"#0071DC"},
  target:{label:"Target",url:"https://www.target.com/s?searchTerm=%s",mark:"T",color:"#CC0000"},
  bestbuy:{label:"Best Buy",url:"https://www.bestbuy.com/site/searchpage.jsp?st=%s",mark:"B",color:"#0046BE"},
  costco:{label:"Costco",url:"https://www.costco.com/CatalogSearch?keyword=%s",mark:"C",color:"#E32224"},
  homedepot:{label:"Home Depot",url:"https://www.homedepot.com/s/%s",mark:"H",color:"#F96302"},
  lowes:{label:"Lowe's",url:"https://www.lowes.com/search?searchTerm=%s",mark:"L",color:"#004990"},
  etsy:{label:"Etsy",url:"https://www.etsy.com/search?q=%s",mark:"E",color:"#F1641E"},
  newegg:{label:"Newegg",url:"https://www.newegg.com/p/pl?d=%s",mark:"N",color:"#0070CD"},
  bhphoto:{label:"B&H",url:"https://www.bhphotovideo.com/c/search?q=%s",mark:"B",color:"#0A2240"},
  ikea:{label:"IKEA",url:"https://www.ikea.com/us/en/search/?q=%s",mark:"I",color:"#0058A3"},
  wayfair:{label:"Wayfair",url:"https://www.wayfair.com/keyword.php?keyword=%s",mark:"W",color:"#7F187F"},
  aliexpress:{label:"AliExpress",url:"https://www.aliexpress.com/wholesale?SearchText=%s",mark:"A",color:"#E62E04"}
};
const SHOP_ORDER=["amazon","ebay","walmart","target","bestbuy","costco","homedepot","lowes","etsy","newegg","bhphoto","ikea","wayfair","aliexpress"];

/* Generated lettermark tile — consistent, honest, and zero bytes of
   traced brand geometry. */
function markLogo(mark,color){
  return `<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5.5" fill="${color}"/><text x="12" y="16.6" text-anchor="middle" font-size="12.5" font-weight="700" fill="#fff" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">${esc(mark)}</text></svg>`;
}
function shopLogo(key){
  const s=SHOP[key];if(!s)return LOGOS.google;
  return markLogo(s.mark,s.color);
}

/* ══════════════════════════════════════════════════
   BANGS — "!yt kittens" jumps straight to YouTube
   ══════════════════════════════════════════════════
   A leading !token retargets a single search without changing any of
   your saved settings. Engine/AI/shop bangs reuse the tables above;
   site bangs carry their own %s template. */
const BANGS={
  g:"engine:google",ddg:"engine:duckduckgo",br:"engine:brave",bing:"engine:bing",
  kagi:"engine:kagi",sp:"engine:startpage",qw:"engine:qwant",sx:"engine:searxng",
  p:"ai:perplexity",gpt:"ai:chatgpt",claude:"ai:claude",grok:"ai:grok",
  gem:"ai:gemini",ds:"ai:deepseek",
  a:"shop:amazon",amazon:"shop:amazon",ebay:"shop:ebay",wm:"shop:walmart",
  tgt:"shop:target",bb:"shop:bestbuy",costco:"shop:costco",hd:"shop:homedepot",
  lowes:"shop:lowes",etsy:"shop:etsy",newegg:"shop:newegg",ikea:"shop:ikea",
  ali:"shop:aliexpress",wf:"shop:wayfair",bh:"shop:bhphoto",
  img:"vertical:images",news:"vertical:article",vid:"vertical:video",
  yt:"url:https://www.youtube.com/results?search_query=%s",
  w:"url:https://en.wikipedia.org/w/index.php?search=%s",
  gh:"url:https://github.com/search?q=%s",
  so:"url:https://stackoverflow.com/search?q=%s",
  mdn:"url:https://developer.mozilla.org/en-US/search?q=%s",
  npm:"url:https://www.npmjs.com/search?q=%s",
  r:"url:https://www.reddit.com/search/?q=%s",
  maps:"url:https://www.google.com/maps/search/%s",
  imdb:"url:https://www.imdb.com/find/?q=%s",
  x:"url:https://x.com/search?q=%s"
};

const DL=[
  {id:"l1",label:"ChatGPT",url:"https://chatgpt.com",emoji:"",image:"https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64"},
  {id:"l2",label:"GitHub",url:"https://github.com",emoji:"",image:"https://www.google.com/s2/favicons?domain=github.com&sz=64"},
  {id:"l3",label:"Calendar",url:"https://calendar.google.com",emoji:"",image:"https://www.google.com/s2/favicons?domain=google.com&sz=64"},
  {id:"l4",label:"Mail",url:"https://mail.google.com",emoji:"",image:"https://www.google.com/s2/favicons?domain=google.com&sz=64"},
  {id:"l5",label:"WBPSC",url:"https://www.pscwbapplication.in",emoji:"",image:"https://www.google.com/s2/favicons?domain=wbpsc.gov.in&sz=64"},
  {id:"l6",label:"Claude",url:"https://claude.ai",emoji:"",image:"https://www.google.com/s2/favicons?domain=claude.ai&sz=64"}
];

const DEFAULT_BG_TOTORO="data:image/jpeg;base64,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";

const DS={
  theme:"slate",searchEngine:"google",aiProvider:"perplexity",
  links:DL,showLinks:true,glassOpacity:0.04,searchType:"all",
  mode:"web",vertical:"all",refiners:[],shopSite:"amazon",resetFilters:false,
  customBg:"#0d0d0d",customAccent:"#7a8a9a",customLight:false,aiFreeOn:false,
  aiSignal:false,aiSensitivity:"med",aiHideAbove:0,
  aiPageDetector:false,weatherLat:null,weatherLon:null,
  bgBlur:22,bgDim:58,bgDark:true,bgText:"auto",aiBridge:false,aiBridgeSubmit:false,
  hiddenWeb:[],hiddenAI:[],hiddenShop:[],customWeb:[],customAI:[],customShop:[],
  textColor:null,bgCleared:false
};
let state={...DS},linkId=100;

/* ── Cached element lookups ──
   Ids in the static tab.html shell are never re-created, so their
   lookups are cached after first hit. Ids born inside renderSettings /
   showMethodology are re-created every render and pass straight
   through to an uncached lookup. */
const STATIC_IDS=new Set(["bgLayer","ambient","time","date","weather","weatherIcon","weatherTemp","weatherDesc","weatherHiLo","searchSection","searchForm","searchInput","searchArrow","modeTag","searchBody","searchDrawer","drawerTabbar","drawerGrid","drawerFooter","filterBar","aiModeHint","links","settingsToggle","settingsBackdrop","settingsPanel","settingsTitle","settingsBody","settingsClose","bgUpload"]);
const _elCache={};
function $(id){
  if(!STATIC_IDS.has(id))return document.getElementById(id);
  return _elCache[id]||(_elCache[id]=document.getElementById(id));
}

/* ── Security helpers ── */
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
/* Only http(s) URLs come back from here — javascript:/data: links a user
   (or imported settings) might put in a quick link are neutralized. */
function safeHref(u){
  const raw=String(u||"").trim();
  try{const p=new URL(raw);if(p.protocol==="http:"||p.protocol==="https:")return p.href}catch{}
  try{const p=new URL("https://"+raw.replace(/^\/+/,""));if(p.hostname.includes("."))return p.href}catch{}
  return "#";
}
/* Custom search templates take a %s query placeholder. Only http(s)
   URLs that actually contain %s are accepted — anything else (including
   javascript:/data: schemes) is rejected so a synced or typed template
   can never inject a non-web scheme into window.location. */
function safeTemplate(u){
  const raw=String(u||"").trim();
  if(!/^https?:\/\//i.test(raw)||!raw.includes("%s"))return null;
  return raw;
}

/* ── Storage ── */
const SYS="hz",BG_KEY="***";
const KNOWN_KEYS=["theme","searchEngine","aiProvider","links","showLinks","glassOpacity","searchType",
  "customBg","customAccent","customLight","aiFreeOn","aiSignal","aiSensitivity","aiHideAbove",
  "aiPageDetector","weatherLat","weatherLon","bgBlur","bgDim","bgDark","bgText","aiBridge","aiBridgeSubmit",
  "mode","vertical","refiners","shopSite","resetFilters",
  "hiddenWeb","hiddenAI","hiddenShop","customWeb","customAI","customShop","textColor","bgCleared"];
let extraState={};      // keys under "hz" owned by other parts of the extension — preserved verbatim on save
let lastSavedJSON="";   // diff guard: identical snapshots never hit storage (sync quota: 120 writes/min)
let lastSavedBG=null;   // the bg data-URL (up to ~500 KB) is only written when it actually changes
let saveTimer=null;

async function loadState(){
  try{
    const s=await chrome.storage.sync.get([SYS]);
    if(s[SYS]){
      state={...DS,...s[SYS],links:s[SYS].links||DL};
      for(const k of Object.keys(s[SYS]))if(!KNOWN_KEYS.includes(k))extraState[k]=s[SYS][k];
    }
  }catch{try{const s=localStorage.getItem(SYS);if(s)state={...DS,...JSON.parse(s),links:JSON.parse(s).links||DL}}catch{}}
  try{
    const b=await chrome.storage.local.get([BG_KEY]);
    if(b[BG_KEY])state.bg=b[BG_KEY];
  }catch{try{const b=localStorage.getItem(BG_KEY);if(b)state.bg=b}catch{}}
  // First run (no saved background yet, and the user hasn't explicitly
  // cleared it): fall back to the built-in Totoro backdrop, dark + blurred.
  if(!state.bg&&!state.bgCleared)state.bg=DEFAULT_BG_TOTORO;
  migrateSearchState();
  sanitizeCustom();
  if(state.resetFilters){state.vertical="all";state.refiners=[];state.aiFreeOn=false}
  ensureActive();
  lastSavedBG=state.bg||null;
  lastSavedJSON=JSON.stringify(snapshotState());
}
function snapshotState(){
  const o={...extraState};
  for(const k of KNOWN_KEYS)o[k]=state[k];
  return o;
}
/* Debounced + diffed: rapid slider drags / typing coalesce into one
   write 250 ms after the last change, and no-op saves don't write at
   all. v1 wrote to chrome.storage.sync on every keystroke and every
   slider pixel — hitting the 120 writes/min quota was easy. */
function saveState(){
  clearTimeout(saveTimer);
  saveTimer=setTimeout(saveStateNow,250);
}
function saveStateNow(){
  clearTimeout(saveTimer);saveTimer=null;
  const o=snapshotState(),j=JSON.stringify(o);
  if(j!==lastSavedJSON){
    lastSavedJSON=j;
    try{const p=chrome.storage.sync.set({[SYS]:o});if(p&&p.catch)p.catch(()=>{})}
    catch{try{localStorage.setItem(SYS,j)}catch{}}
  }
  const bg=state.bg||null;
  if(bg!==lastSavedBG){
    lastSavedBG=bg;
    if(bg){try{const p=chrome.storage.local.set({[BG_KEY]:bg});if(p&&p.catch)p.catch(()=>{})}catch{try{localStorage.setItem(BG_KEY,bg)}catch{}}}
    else{try{chrome.storage.local.remove(BG_KEY)}catch{}}
  }
}
// A pending debounced save must not be lost when the tab navigates
// (e.g. changing a filter and pressing Enter within 250 ms).
window.addEventListener("pagehide",()=>{if(saveTimer)saveStateNow()});

/* Fold the old single-value `searchType` into the mode+vertical model.
   Runs once per profile; afterwards `mode` exists and it is a no-op.
   searchType is still written to storage so that downgrading to an
   older build doesn't land the user on a broken setting. */
function migrateSearchState(){
  if(!Array.isArray(state.refiners))state.refiners=[];
  // Shop/AI/web validity (including custom sources) is enforced later by
  // ensureActive(), which runs AFTER sanitizeCustom() so it can see both
  // built-ins and user-added entries. A plain SHOP[] check here would
  // wipe a custom-store selection on every load.
  if(state.mode==="web"||state.mode==="ai"||state.mode==="shop"){
    if(!VERTICAL_L[state.vertical])state.vertical="all";
    return;
  }
  // Even older profiles carried `searchMode` instead of `searchType`.
  // That fixup used to live in boot() — i.e. AFTER this function — and
  // was dead anyway, since the DS spread always supplies a searchType.
  // Handle it here, first, where it can actually win.
  if(state.searchMode){
    state.mode=state.searchMode==="ai"?"ai":"web";
    state.vertical="all";delete state.searchMode;
    return;
  }
  const t=state.searchType;
  if(t==="ai"){state.mode="ai";state.vertical="all"}
  else if(t==="reddit"){state.mode="web";state.vertical="all";state.refiners=["reddit"]}
  else if(t==="pdf"){state.mode="web";state.vertical="all";state.refiners=["pdf"]}
  else if(VERTICAL_L[t]){state.mode="web";state.vertical=t}
  else{state.mode="web";state.vertical="all"}
}

/* ── Clock ── */
function updateClock(){
  const n=new Date();
  $("time").textContent=`${n.getHours()%12||12}:${String(n.getMinutes()).padStart(2,"0")}:${String(n.getSeconds()).padStart(2,"0")} ${n.getHours()>=12?"PM":"AM"}`;
  $("date").textContent=n.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  if(state.theme==="modern"&&!state.bg)swModern(); // keep auto day/night correct on long-lived tabs
}
/* Now showing seconds, so tick once per second (aligned to the second
   boundary). visibilitychange re-syncs a tab restored from the background. */
let clockTimer=null;
function scheduleClock(){
  clearTimeout(clockTimer);
  updateClock();
  const n=new Date();
  clockTimer=setTimeout(scheduleClock,Math.max(50,1000-n.getMilliseconds()));
}

/* ── Weather ── */
const WEATHER_KEY="hzWeather2",WEATHER_TTL=10*60*1000;
function weatherCoords(){
  const lat=parseFloat(state.weatherLat),lon=parseFloat(state.weatherLon);
  return Number.isFinite(lat)&&Number.isFinite(lon)?[lat,lon]:[LAT,LON];
}
function renderWeather(d){
  $("weatherIcon").innerHTML=d.icon;
  $("weatherTemp").textContent=d.temp;
  $("weatherDesc").textContent=d.desc;
  $("weatherHiLo").textContent=d.hilo;
}
/* Cached in chrome.storage.local: opening ten tabs in a row costs one
   API round-trip, not ten. Stale data renders instantly, then refreshes
   in the background. 8 s abort so a slow API never hangs the badge.
   Open-Meteo is used instead of api.weather.gov because NWS only covers
   US coordinates — Open-Meteo is free, keyless, and global, so it works
   correctly for the hardcoded Midnapore lat/lon above. */
async function fetchWeather(){
  const[lat,lon]=weatherCoords();
  let cached=null;
  try{const c=await chrome.storage.local.get([WEATHER_KEY]);cached=c[WEATHER_KEY]}catch{}
  if(cached&&cached.lat===lat&&cached.lon===lon&&cached.d){
    renderWeather(cached.d);
    if(Date.now()-cached.t<WEATHER_TTL)return;
  }
  try{
    const ac=new AbortController();const to=setTimeout(()=>ac.abort(),8000);
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`;
    const j=await(await fetch(url,{signal:ac.signal})).json();
    clearTimeout(to);
    const t=Math.round(j.current.temperature_2m),code=j.current.weather_code,isDay=j.current.is_day===1;
    const hi=Math.round(j.daily.temperature_2m_max[0]),lo=Math.round(j.daily.temperature_2m_min[0]);
    const desc=wmoDesc(code);
    const data={icon:wi(code,isDay),temp:`${t}°`,desc,hilo:`H ${hi}° L ${lo}°`};
    renderWeather(data);
    try{const pr=chrome.storage.local.set({[WEATHER_KEY]:{t:Date.now(),lat,lon,d:data}});if(pr&&pr.catch)pr.catch(()=>{})}catch{}
  }catch{if(!cached)$("weatherDesc").textContent="unavailable"}
}
/* WMO weather_code → short description (Open-Meteo uses the WMO
   4677 code table: https://open-meteo.com/en/docs). */
function wmoDesc(c){
  const M={
    0:"Clear",1:"Mostly clear",2:"Partly cloudy",3:"Overcast",
    45:"Fog",48:"Fog",
    51:"Light drizzle",53:"Drizzle",55:"Dense drizzle",
    56:"Freezing drizzle",57:"Freezing drizzle",
    61:"Light rain",63:"Rain",65:"Heavy rain",
    66:"Freezing rain",67:"Freezing rain",
    71:"Light snow",73:"Snow",75:"Heavy snow",77:"Snow grains",
    80:"Light showers",81:"Showers",82:"Violent showers",
    85:"Snow showers",86:"Snow showers",
    95:"Thunderstorm",96:"Thunderstorm",99:"Severe thunderstorm"
  };
  return M[c]||"Unknown";
}
/* Stroke-style SVG condition icons (feather-like, currentColor) —
   consistent with the rest of the UI; no emoji. Driven by WMO code. */
function wi(code,d){
  const svg=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const sun=svg(`<circle cx="12" cy="12" r="5"/><path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>`);
  const moon=svg(`<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`);
  const cloud=svg(`<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>`);
  const rain=svg(`<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><path d="M8 13v8M12 15v8M16 13v8"/>`);
  const storm=svg(`<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><path d="M13 11l-4 6h4l-1 6"/>`);
  const snow=svg(`<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><path d="M8 15v7M12 13v9M16 15v7"/>`);
  const fog=svg(`<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><path d="M5 16.5h14M8 19.5h10"/>`);
  if(code===0)return d?sun:moon;
  if(code===1||code===2)return d?sun:moon;
  if(code===3)return cloud;
  if(code===45||code===48)return fog;
  if(code>=51&&code<=67)return rain;
  if(code>=71&&code<=77)return snow;
  if(code>=80&&code<=82)return rain;
  if(code===85||code===86)return snow;
  if(code>=95)return storm;
  return d?sun:moon;
}

/* ── Theme ── */
function applyTheme(theme){
  state.theme=theme;const root=document.documentElement;root.classList.remove("has-bg");
  if(theme==="modern"&&!state.bg){swModern();saveState();return}
  if(theme==="custom"){applyCustomTheme();return}
  root.setAttribute("data-theme",theme);saveState();
}
function swModern(){
  const want=new Date().getHours()>=6&&new Date().getHours()<20?"modern-day":"modern";
  const root=document.documentElement;
  if(root.getAttribute("data-theme")!==want)root.setAttribute("data-theme",want);
}
function hexToRgb(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function luminance(r,g,b){return(0.299*r+0.587*g+0.114*b)/255}
function applyCustomTheme(){
  const root=document.documentElement;root.setAttribute("data-theme","custom");
  const bg=state.customBg||"#0d0d0d",ac=state.customAccent||"#7a8a9a";
  const[br,bgG,bgB]=hexToRgb(bg);const[ar,ag,ab]=hexToRgb(ac);const l=luminance(br,bgG,bgB),isLight=l>.5;
  root.dataset.customMode=isLight?"light":"dark";
  root.style.setProperty("--user-bg",bg);root.style.setProperty("--user-bg2",isLight?darken(bg,8):lighten(bg,8));
  root.style.setProperty("--user-accent",ac);root.style.setProperty("--user-accent-glow",`rgba(${ar},${ag},${ab},${isLight?0.12:0.22})`);
  const tc=isLight?"#1e1e1e":"#E8EBED";root.style.setProperty("--user-text",tc);root.style.setProperty("--user-text-dim",isLight?"#606060":"#8a929a");
  root.style.setProperty("--user-text-muted",isLight?"#909090":"#5a626a");root.style.setProperty("--user-hero-text",isLight?"#111111":"#F0F2F4");
  root.style.setProperty("--user-hero-sub",isLight?"#404040":"#C0C6CC");saveState();
}
function lighten(h,p){const[r,g,b]=hexToRgb(h);const m=c=>Math.round(c+(255-c)*p/100);return`#${m(r).toString(16).padStart(2,"0")}${m(g).toString(16).padStart(2,"0")}${m(b).toString(16).padStart(2,"0")}`}
function darken(h,p){const[r,g,b]=hexToRgb(h);const m=c=>Math.round(c*(1-p/100));return`#${m(r).toString(16).padStart(2,"0")}${m(g).toString(16).padStart(2,"0")}${m(b).toString(16).padStart(2,"0")}`}
/* Global text-color override. When set, the chosen color (plus auto-derived
   dim/muted tints) is applied inline on the root — beating every theme's own
   text vars. When null, the inline props are cleared and the theme default
   wins again. */
function applyTextColor(){
  const root=document.documentElement,props=["--text","--text-dim","--text-muted","--hero-text","--hero-sub"];
  const c=state.textColor;
  if(!c||!/^#[0-9a-fA-F]{6}$/.test(c)){props.forEach(k=>root.style.removeProperty(k));return}
  const[r,g,b]=hexToRgb(c);
  root.style.setProperty("--text",c);
  root.style.setProperty("--text-dim",`rgba(${r},${g},${b},0.7)`);
  root.style.setProperty("--text-muted",`rgba(${r},${g},${b},0.45)`);
  root.style.setProperty("--hero-text",c);
  root.style.setProperty("--hero-sub",`rgba(${r},${g},${b},0.7)`);
}

/* ── Glass / BG ── */
/* The glass slider drives every frosted surface at once, so a drag used
   to trigger a style recalc per input event (well above 60/s). Coalesce
   the write into one animation frame. */
let glassFrame=0,glassPending=null;
function applyGlassOpacity(val){
  glassPending=parseFloat(val);state.glassOpacity=glassPending;
  if(!glassFrame)glassFrame=requestAnimationFrame(()=>{
    glassFrame=0;
    document.documentElement.style.setProperty("--surface-opacity",String(glassPending));
  });
  saveState();
}
/* Sample the image on a 32x32 grid instead of a single pixel.
   The old code drew the whole image into a 1x1 canvas and read that
   one pixel: browsers don't guarantee a true average when downscaling
   that hard, so a mostly-dark wallpaper could report a BRIGHT sample,
   flip to "light image" and get a 60%-WHITE veil dropped on it — the
   washed-out look on dark backgrounds. Center-weighted because that's
   where the clock and search box sit. */
function analyze(img){
  const N=32,c=document.createElement("canvas");c.width=c.height=N;
  const ctx=c.getContext("2d",{willReadFrequently:true});
  ctx.drawImage(img,0,0,N,N);
  let d;try{d=ctx.getImageData(0,0,N,N).data}catch{return{mean:.5,center:.5}}
  let sum=0,cSum=0,cN=0;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const i=(y*N+x)*4,l=luminance(d[i],d[i+1],d[i+2]);
    sum+=l;
    if(x>=N*0.15&&x<N*0.85&&y>=N*0.2&&y<N*0.8){cSum+=l;cN++}
  }
  return{mean:sum/(N*N),center:cN?cSum/cN:sum/(N*N)};
}

/* How much dimming does legibility ACTUALLY require?
   Compositing a black veil of alpha a over luminance L gives L(1-a);
   a white veil gives L+a(1-L). Solve for the alpha that just reaches
   the contrast target and use that — so a wallpaper that's already
   dark enough gets NO overlay at all, instead of the old flat 35–60%
   that washed every image out. */
function autoDim(lum,dark){
  const a=dark?(lum<=.30?0:1-.30/Math.max(lum,.001)):(lum>=.78?0:(.78-lum)/(1-lum));
  return Math.round(Math.max(0,Math.min(.62,a))*100);
}
function bgVars(){
  const el=$("bgLayer"),dark=state.bgDark!==false;
  const dim=(state.bgDim==null?50:state.bgDim)/100;
  el.style.setProperty("--overlay-c",dark?`rgba(0,0,0,${dim.toFixed(2)})`:`rgba(255,255,255,${dim.toFixed(2)})`);
  const blur=state.bgBlur==null?0:state.bgBlur;
  el.style.setProperty("--bg-blur",`${blur}px`);
  el.classList.toggle("has-blur",blur>0);
}
function applyBg(data,recompute){
  if(!data){clearBg();return}
  const img=new Image();
  img.onload=()=>{
    const{mean,center}=analyze(img);
    // "white" = force light text, "black" = force dark text, "auto" reads
    // the image. `dark` drives BOTH the text theme (darkbg/lightbg) and
    // the dim veil direction, so they never contradict each other.
    const dark=state.bgText==="white"?true:state.bgText==="black"?false:(center<=.55);
    state.bgDark=dark;
    // Auto-pick the dim only for a NEW image; a user-set value sticks.
    if(recompute||state.bgDim==null)state.bgDim=autoDim(center,dark);
    const el=$("bgLayer");el.style.setProperty("--user-bg",`url(${data})`);el.classList.add("has-image");
    bgVars();
    $("ambient").style.display="none";document.documentElement.setAttribute("data-theme",dark?"darkbg":"lightbg");document.documentElement.classList.add("has-bg");
    state.bg=data;saveState();
  };img.onerror=clearBg;img.src=data;
}
function clearBg(){
  const el=$("bgLayer");el.classList.remove("has-image","has-blur");el.style.removeProperty("--user-bg");el.style.removeProperty("--overlay-c");el.style.removeProperty("--bg-blur");
  state.bgDim=null;state.bgDark=undefined;state.bgCleared=true;state.bg=null;
  $("ambient").style.display="";document.documentElement.classList.remove("has-bg");
  const t=state.theme||"slate";if(t==="custom")applyCustomTheme();else if(t==="modern")swModern();else document.documentElement.setAttribute("data-theme",t);
  delete state.bg;saveState();
}

/* Bang cheat-sheet, GENERATED from the BANGS table so the reference can
   never drift out of sync with what actually works. Grouped by target
   kind; site bangs take their label from the URL's hostname. */
/* Display names where naive capitalization or the bare hostname would
   read wrong ("Duckduckgo", "google.com" for Maps). */
const BANG_LABEL={duckduckgo:"DuckDuckGo",searxng:"SearXNG",startpage:"Startpage",
  bing:"Bing",kagi:"Kagi",qwant:"Qwant",brave:"Brave",google:"Google",
  maps:"Google Maps",x:"X / Twitter",w:"Wikipedia",gh:"GitHub",so:"Stack Overflow",
  mdn:"MDN",npm:"npm",yt:"YouTube",r:"Reddit",imdb:"IMDb"};
function bangLabelFor(spec,tok){
  if(BANG_LABEL[tok])return BANG_LABEL[tok];
  const i=spec.indexOf(":"),kind=spec.slice(0,i),val=spec.slice(i+1);
  if(kind==="engine")return BANG_LABEL[val]||val.charAt(0).toUpperCase()+val.slice(1);
  if(kind==="ai")return AI_L[val]||val;
  if(kind==="shop")return (SHOP[val]||{}).label||val;
  if(kind==="vertical")return VERTICAL_L[val]||val;
  try{return new URL(val.replace("%s","x")).hostname.replace(/^www\./,"")}catch{return val}
}
function bangReference(){
  const groups={engine:["Search engines",[]],ai:["AI chats",[]],shop:["Stores",[]],vertical:["Filters",[]],url:["Sites",[]]};
  const seen=new Set();
  for(const [tok,spec] of Object.entries(BANGS)){
    const kind=spec.slice(0,spec.indexOf(":"));
    if(!groups[kind])continue;
    if(seen.has(spec))continue;           // first token wins for duplicates (!a / !amazon)
    seen.add(spec);
    groups[kind][1].push(`<span class="bang-item"><code>!${esc(tok)}</code>${esc(bangLabelFor(spec,tok))}</span>`);
  }
  return Object.values(groups).filter(([,items])=>items.length)
    .map(([title,items])=>`<div class="bang-group"><span class="bang-title">${title}</span>${items.join("")}</div>`).join("");
}

/* ── Links ── */
function renderLinks(){
  const linksEl=$("links");linksEl.style.display=state.showLinks?"":"none";
  linksEl.innerHTML=state.links.map(l=>{
    const href=safeHref(l.url);
    const icon=l.image?`<img src="${esc(l.image)}" alt="" loading="lazy">`:esc(l.emoji||"🌐");
    return `<a href="${esc(href)}" class="link-item" title="${esc(l.url)}"><span class="link-icon">${icon}</span><span class="link-label">${esc(l.label)}</span></a>`;
  }).join("");
}

/* ══════════════════════════════════════════════════
   SEARCH — Expandable drawer
   ══════════════════════════════════════════════════ */

function isAI(){return state.mode==="ai"}
function isShop(){return state.mode==="shop"}
/* Keep the legacy key in sync so an older build (or a half-synced
   profile) still lands somewhere sensible. */
function syncLegacyType(){
  state.searchType=isAI()?"ai":(state.vertical||"all");
}
function hasRefiner(k){return (state.refiners||[]).includes(k)}
function toggleRefiner(k){
  const r=new Set(state.refiners||[]);
  r.has(k)?r.delete(k):r.add(k);
  state.refiners=REFINER_ORDER.filter(x=>r.has(x));
}
function currentLabel(){
  if(isAI())return aiLabel(state.aiProvider);
  if(isShop())return shopLabel(state.shopSite);
  return webLabel(state.searchEngine);
}

/* ── SVG icon for a key ── */
function svgIcon(key){
  if(LOGOS[key])return LOGOS[key];
  if(SHOP[key])return shopLogo(key);
  const cs=customShopById(key);if(cs)return markLogo(cs.mark,cs.color);
  const ca=customAIById(key);if(ca)return markLogo((ca.label||"?").charAt(0).toUpperCase(),"#3a3f45");
  const cw=customWebById(key);if(cw)return markLogo((cw.label||"?").charAt(0).toUpperCase(),"#3a3f45");
  return LOGOS.google;
}

/* ══════════════════════════════════════════════════
   SOURCES — visibility + custom additions
   ══════════════════════════════════════════════════
   Each category (web / ai / shop) = the built-ins above plus any
   user-added custom entries. Hidden built-ins are listed by key in
   state.hiddenWeb/AI/Shop; custom entries are objects in
   state.customWeb/AI/Shop carrying a %s query template. Everything
   downstream reads through the *entries() accessors so the drawer,
   settings and submit path can never disagree about what exists. */
function webLabel(k){const c=customWebById(k);return c?c.label:(WEB_L[k]||k)}
function aiLabel(k){const c=customAIById(k);return c?c.label:(AI_L[k]||"AI")}
function shopLabel(k){const c=customShopById(k);return c?c.label:(SHOP[k]?SHOP[k].label:"Store")}
function customWebById(id){return (state.customWeb||[]).find(x=>x.id===id)}
function customAIById(id){return (state.customAI||[]).find(x=>x.id===id)}
function customShopById(id){return (state.customShop||[]).find(x=>x.id===id)}
function webEntries(){
  const h=new Set(state.hiddenWeb||[]);
  const b=Object.keys(SE).filter(k=>!h.has(k)).map(k=>({key:k,label:webLabel(k),builtin:true}));
  return b.concat((state.customWeb||[]).map(x=>({key:x.id,label:x.label,builtin:false})));
}
function aiEntries(){
  const h=new Set(state.hiddenAI||[]);
  const b=AI_ORDER.filter(k=>!h.has(k)).map(k=>({key:k,label:AI_L[k],mode:AI[k].mode,builtin:true}));
  return b.concat((state.customAI||[]).map(x=>({key:x.id,label:x.label,mode:x.mode||"prefill",builtin:false})));
}
function shopEntries(){
  const h=new Set(state.hiddenShop||[]);
  const b=SHOP_ORDER.filter(k=>!h.has(k)).map(k=>({key:k,label:SHOP[k].label,builtin:true}));
  return b.concat((state.customShop||[]).map(x=>({key:x.id,label:x.label,builtin:false})));
}
/* The settings panel renders the FULL list (hidden included) so a source
   the user turned off stays visible with its toggle "off" and can be
   re-enabled — the drawer is the only place that filters via *entries(). */
function webAll(){return Object.keys(SE).map(k=>({key:k,label:webLabel(k),builtin:true})).concat((state.customWeb||[]).map(x=>({key:x.id,label:x.label,builtin:false})))}
function aiAll(){return AI_ORDER.map(k=>({key:k,label:AI_L[k],mode:AI[k].mode,builtin:true})).concat((state.customAI||[]).map(x=>({key:x.id,label:x.label,mode:x.mode||"prefill",builtin:false})))}
function shopAll(){return SHOP_ORDER.map(k=>({key:k,label:SHOP[k].label,builtin:true})).concat((state.customShop||[]).map(x=>({key:x.id,label:x.label,builtin:false})))}
/* If the user hides (or removes) the currently-active default, fall back
   to the first still-visible entry so the mode tag / submit never point
   at a source that no longer renders. */
function ensureActive(){
  const wk=webEntries().map(e=>e.key);
  if(!wk.includes(state.searchEngine))state.searchEngine=wk[0]||"google";
  const ak=aiEntries().map(e=>e.key);
  if(!ak.includes(state.aiProvider))state.aiProvider=ak[0]||"perplexity";
  const sk=shopEntries().map(e=>e.key);
  if(!sk.includes(state.shopSite))state.shopSite=sk[0]||"amazon";
}
/* Reject anything that couldn't have been produced by the UI — dropped
   keys, non-template URLs, junk fields — so a synced profile can't put
   the extension in an inconsistent state. */
function sanitizeCustom(){
  state.hiddenWeb=(state.hiddenWeb||[]).filter(k=>SE[k]);
  state.hiddenAI=(state.hiddenAI||[]).filter(k=>AI[k]);
  state.hiddenShop=(state.hiddenShop||[]).filter(k=>SHOP[k]);
  state.customWeb=(state.customWeb||[]).filter(x=>x&&safeTemplate(x.url))
    .map(x=>({id:String(x.id||""),label:String(x.label||"Custom"),url:safeTemplate(x.url)}));
  state.customAI=(state.customAI||[]).filter(x=>x&&safeTemplate(x.url))
    .map(x=>({id:String(x.id||""),label:String(x.label||"Custom"),url:safeTemplate(x.url),mode:x.mode==="search"?"search":"prefill"}));
  state.customShop=(state.customShop||[]).filter(x=>x&&safeTemplate(x.url))
    .map(x=>({id:String(x.id||""),label:String(x.label||"Store"),url:safeTemplate(x.url),mark:String(x.mark||"?").charAt(0).toUpperCase(),color:/^#[0-9a-fA-F]{3,8}$/.test(x.color||"")?x.color:"#555"}));
}

/* ── Tag + drawer open/close ── */
function updateModeTag(){
  const tag=$("modeTag");
  const key = isAI() ? state.aiProvider : isShop() ? state.shopSite : state.searchEngine;
  const icon = svgIcon(key);
  const label = currentLabel();
  // Wrap label in a span so the compact (icon-only) state can fade
  // the label out independently of the icon.
  tag.innerHTML = icon + ' <span class="mode-label">' + esc(label) + '</span>';
}
function tagOnInput(){
  const i=$("searchInput");
  // Compact the chip to icon-only while typing so the input gets more
  // room without losing the brand indicator entirely.
  $("modeTag").classList.toggle("compact",i.value.length>0);
}

function isDrawerOpen(){return $("searchSection").classList.contains("open")}
function openDrawer(){
  $("searchSection").classList.add("open");
  // Drawer expands absolutely below the search row.
  // Links stay fixed — no layout push needed.
}
function closeDrawer(){
  const sec=$("searchSection");
  sec.classList.remove("open");
  sec.style.marginBottom=""; // restore resting margin (1rem from CSS)
}
function toggleDrawer(){isDrawerOpen()?closeDrawer():openDrawer()}

/* ── Tab bar ── */
function renderTabs(){
  const m=state.mode||"web";
  const tab=(k,l)=>`<button class="drawer-tab${m===k?" active":""}" data-mode="${k}">${l}</button>`;
  $("drawerTabbar").innerHTML=tab("web","Web Search")+tab("ai","AI Chat")+tab("shop","Shop");
}

/* ── Render drawer grid ──
     In AI mode the grid uses the .ai-grid modifier so the 6 providers
     render as 4-on-top, 2-on-bottom (centered under cols 2-3).
     The 8 web search engines keep the auto-fill column layout. */
function renderDrawer(){
  renderTabs();
  const grid=$("drawerGrid");
  const ai=isAI(),shop=isShop();
  let items;
  if(ai)items=aiEntries().map(e=>[e.key,e.label,"ai",aiBadge(e.key)]);
  else if(shop)items=shopEntries().map(e=>[e.key,e.label,"shop","shop"]);
  else items=webEntries().map(e=>[e.key,e.label,"web","web"]);
  grid.classList.toggle("ai-grid",ai);
  grid.classList.toggle("shop-grid",shop);
  grid.innerHTML=items.map(([key,label,kind,tag])=>{
    const act=(kind==="web"&&!ai&&!shop&&state.searchEngine===key)||
              (kind==="ai"&&ai&&state.aiProvider===key)||
              (kind==="shop"&&shop&&state.shopSite===key);
    return `<button class="drawer-btn${act?" active":""}" data-kind="${kind}" data-key="${key}"><span class="db-svg">${svgIcon(key)}</span><span class="db-name">${esc(label)}</span><span class="db-tag">${tag}</span></button>`;
  }).join("");
}

/* ── Filter bar + AI hint (inside drawer) ── */
function renderFilterBar(){
  const bar=$("filterBar");
  const hint=$("aiModeHint");
  if(isAI()){
    bar.classList.remove("visible");
    const c=customAIById(state.aiProvider),mode=c?c.mode:(AI[state.aiProvider]||{}).mode;
    hint.textContent=(mode==="bridge"&&state.aiBridge)
      ? (state.aiBridgeSubmit?"Prompt bridge fills and sends it for you":"Prompt bridge fills the chat box — press Enter to send")
      : AI_MODE_NOTE[mode];
    hint.classList.add("active");
    return;
  }
  if(isShop()){
    bar.classList.remove("visible");
    hint.textContent=`Searches ${shopLabel(state.shopSite)} directly — filters don't apply here`;
    hint.classList.add("active");
    return;
  }
  hint.classList.remove("active");
  const engine=state.searchEngine,isCustom=!SE[engine];
  const actV=isCustom?"all":(state.vertical||"all");
  // Verticals (pick one) then refiners (pick any) — the divider makes
  // the two axes legible at a glance. Media verticals don't exist on a
  // custom engine (no per-engine media URL), so they read as unsupported.
  const verts=Object.keys(VERTICAL_L).map(k=>{
    const off=isCustom&&k!=="all";
    const title=off?` title="Custom engine — media search isn't available"`:"";
    return `<button class="filter-chip${actV===k?" active":""}${off?" unsupported":""}" data-vertical="${k}"${title}${off?" disabled":""}>${VERTICAL_L[k]}</button>`;
  }).join("");
  const refs=REFINER_ORDER.map(k=>{
    const off=(k==="recent"&&!TIME_PARAM[engine]);
    const title=off?` title="${esc(webLabel(engine))} has no time-range parameter"`:"";
    return `<button class="filter-chip refiner${hasRefiner(k)?" active":""}${off?" unsupported":""}" data-refiner="${k}"${title}${off?" disabled":""}>${REFINERS[k].label}</button>`;
  }).join("");
  const aiFreeOff=!AI_FREE_PARAMS[engine];
  const aiFreeTitle=aiFreeOff?' title="This engine doesn\'t inject AI answers — nothing to turn off"':"";
  bar.innerHTML=verts+'<span class="filter-div" aria-hidden="true"></span>'+refs+
    `<button class="filter-chip aifree${state.aiFreeOn?" active":""}${aiFreeOff?" unsupported":""}" id="aiFreeChip"${aiFreeTitle}${aiFreeOff?" disabled":""}>AI-Free</button>`;
  bar.classList.add("visible");
}

function updatePlaceholder(){
  const i=$("searchInput");
  if(isAI()){i.placeholder=`Ask ${aiLabel(state.aiProvider)} anything...`;return}
  if(isShop()){i.placeholder=`Search ${shopLabel(state.shopSite)}...`;return}
  const isCustom=!SE[state.searchEngine];
  const bits=[];
  if(state.aiFreeOn&&AI_FREE_PARAMS[state.searchEngine])bits.push("AI-free");
  if(!isCustom&&(state.vertical||"all")!=="all")bits.push(VERTICAL_L[state.vertical]);
  for(const k of (state.refiners||[])){
    if(k==="recent"&&!TIME_PARAM[state.searchEngine])continue;
    bits.push(REFINERS[k].label);
  }
  i.placeholder=bits.length?`Search · ${bits.join(" · ")}...`:"Search...";
}

function refreshUI(){
  syncLegacyType();
  updateModeTag();renderDrawer();renderFilterBar();updatePlaceholder();saveState();
}

/* ── Submit ── */
/* URL detection: full URLs, bare domains ("github.com/user"),
   localhost[:port] and IPv4 addresses navigate directly; everything
   else searches. Bare domains only navigate when the last label is a
   real, common TLD — so "node.js" or "vue.js" search (as intended)
   while "svelte.dev" navigates.
   v1 required the string to ALREADY start with http, so typing
   "example.com" searched instead of navigating, and the localhost
   branch was unreachable (it also demanded a dot). */
const NAV_TLDS=new Set(("com net org edu gov mil int io ai co dev app me us uk ca de fr jp cn in au br ru ch nl se no dk fi es it pl eu info biz tv gg sh xyz tech site online store blog news wiki to ly fm am so gl cc ws nz ie at be pt cz gr kr mx za ar cl tw hk sg my ph th vn id tr sa ae il pk").split(" "));
function navURL(q){
  if(/\s/.test(q))return null;
  if(/^https?:\/\//i.test(q)){try{return new URL(q).href}catch{return null}}
  if(/^localhost(:\d{1,5})?([\/?#]|$)/i.test(q))return "http://"+q;
  if(/^\d{1,3}(\.\d{1,3}){3}(:\d{1,5})?([\/?#]\S*)?$/.test(q))return "http://"+q;
  const m=q.match(/^[\w-]+(\.[\w-]+)*\.([a-z]{2,24})(:\d{1,5})?([\/?#]\S*)?$/i);
  if(m&&NAV_TLDS.has(m[2].toLowerCase())){
    try{return new URL("https://"+q).href}catch{return null}
  }
  return null;
}
/* Build the web-search URL for a query + vertical + refiner set.
   Refiners are folded into the QUERY TEXT before encoding, so they
   survive on any vertical and any engine — that is what makes
   "Images + Reddit" or "News + PDF" work at all. The Recent refiner
   is the one exception: it is a per-engine URL parameter. */
function webSearchURL(q,{engine,vertical,refiners,aiFree}){
  let text=q;
  if(refiners.includes("exact")&&!/^".*"$/.test(text.trim()))text=`"${text.trim()}"`;
  for(const k of refiners){
    const op=REFINERS[k]&&REFINERS[k].op;
    if(op)text+=op;
  }
  const enc=encodeURIComponent(text);
  // Custom engines carry a %s template; text refiners (site:, filetype:,
  // quotes) still fold into the query, but per-engine URL params (media
  // vertical, Recent, AI-Free) don't exist for them.
  const custom=customWebById(engine);
  if(custom)return custom.url.replace("%s",enc);
  const media=MEDIA_URL[engine]&&MEDIA_URL[engine][vertical];
  let url=media?media.replace("%s",enc):(SE[engine]||SE.google)+enc;
  if(aiFree&&!media)url+=AI_FREE_PARAMS[engine]||"";
  if(refiners.includes("recent")){
    const t=TIME_PARAM[engine];
    if(t)url+=t;
  }
  return url;
}
function aiURL(q,provider){
  const c=customAIById(provider);
  if(c)return c.url.replace("%s",encodeURIComponent(q));
  const p=AI[provider]||AI.perplexity;
  // The bridge content script (opt-in) looks for hz_q and fills the
  // composer on providers that ignore native prefill params.
  const extra=(p.mode==="bridge"&&state.aiBridge)?"&hz_q="+encodeURIComponent(q):"";
  return p.url+encodeURIComponent(q)+extra;
}
function shopURL(q,site){
  const c=customShopById(site);
  if(c)return c.url.replace("%s",encodeURIComponent(q));
  const s=SHOP[site]||SHOP.amazon;
  return s.url.replace("%s",encodeURIComponent(q));
}

/* Bangs: a leading !token retargets this ONE search without touching
   any saved setting. "!a usb c cable" → Amazon; "!img otters" → the
   current engine's image vertical. Unknown tokens fall through and are
   searched literally, so a query that merely starts with "!" is safe. */
function resolveBang(raw){
  const m=raw.match(/^!([a-z0-9]+)\s+([\s\S]+)$/i);
  if(!m)return null;
  const spec=BANGS[m[1].toLowerCase()];
  if(!spec)return null;
  const q=m[2].trim();
  if(!q)return null;
  const i=spec.indexOf(":"),kind=spec.slice(0,i),val=spec.slice(i+1);
  if(kind==="engine")return webSearchURL(q,{engine:val,vertical:state.vertical,refiners:state.refiners||[],aiFree:state.aiFreeOn});
  if(kind==="ai")return aiURL(q,val);
  if(kind==="shop")return shopURL(q,val);
  if(kind==="vertical")return webSearchURL(q,{engine:state.searchEngine,vertical:val,refiners:state.refiners||[],aiFree:state.aiFreeOn});
  if(kind==="url")return val.replace("%s",encodeURIComponent(q));
  return null;
}

function submitSearch(q){
  if(!q)return;
  const bang=resolveBang(q);
  if(bang){window.location.href=bang;return}
  if(isAI()){window.location.href=aiURL(q,state.aiProvider);return}
  if(isShop()){window.location.href=shopURL(q,state.shopSite);return}
  const nav=navURL(q);
  if(nav){window.location.href=nav;return}
  window.location.href=webSearchURL(q,{
    engine:state.searchEngine,vertical:state.vertical||"all",
    refiners:state.refiners||[],aiFree:state.aiFreeOn
  });
}

/* ══════════════════════════════════════════════════
   SETTINGS
   ══════════════════════════════════════════════════ */
function openSettings(){$("settingsPanel").classList.add("open");$("settingsBackdrop").classList.add("open");renderSettings()}
function closeSettings(){$("settingsPanel").classList.remove("open");$("settingsBackdrop").classList.remove("open")}

/* ── Methodology modal — shown when the user taps the "methodology"
     link in the AI Signal section of settings. We open a lightweight
     modal on top of the settings panel with full disclosure. */
function showMethodology(){
  let modal=$("aiMethodologyModal");
  if(!modal){
    modal=document.createElement("div");
    modal.id="aiMethodologyModal";
    modal.className="ai-methodology";
    modal.innerHTML=`
      <div class="ai-methodology-card">
        <div class="ai-methodology-head">
          <h3>How AI Signal works</h3>
          <button type="button" id="aiMethodologyClose" aria-label="Close">✕</button>
        </div>
        <div class="ai-methodology-body">
          <p><strong>What it is.</strong> A client-side "smell test" for AI-flavored writing. Every score is an <em>estimate</em>, not a verdict.</p>
          <p><strong>What it looks at.</strong> Each search result's title and snippet (the text Google / DuckDuckGo / Brave already shows you), plus the URL shape. We never fetch the article body — your browsing history stays yours.</p>
          <p><strong>Three signals, combined.</strong></p>
          <ul>
            <li><strong>Text patterns</strong> (65% weight) — a curated lexicon of ~80 AI-isms ("delve into", "navigate the complexities", "in today's digital landscape", etc.), each capped so repetition can't max the score, plus sentence-length uniformity, "Firstly…Secondly…Finally" scaffolding, transition-word and em-dash density. Evidence is normalized per ~45 words, so long text doesn't inflate the score.</li>
            <li><strong>Author / byline</strong> (15% weight) — looks for named humans ("By Jane Smith") in the snippet; penalizes self-disclosure ("AI-generated").</li>
            <li><strong>Domain signals</strong> (20% weight) — URL shape (TLD, hyphen slug), plus a curated list of human-edited publications (NYT, Atlantic, Wired, etc.) matched on the parsed hostname, which pulls the score downward.</li>
          </ul>
          <p><strong>Calibration.</strong> Three sensitivities that bend the score curve — Low compresses mid-range scores so only extreme evidence gets flagged, Medium is the default, High stretches scores upward. The default is conservative on purpose: false positives — accusing a real journalist of being AI — are worse than false negatives.</p>
          <p><strong>Hide-above mode.</strong> When you set a hide threshold, results meeting/exceeding that score collapse to a single hover-to-expand line. We don't delete them from the DOM (that would break SERP pagination). Hover any collapsed result to expand it for that moment.</p>
          <p><strong>Per-result dismissal.</strong> Every badge has a "✕" that hides it for that domain. Your dismissed domains persist in chrome.storage.sync and never show the badge again.</p>
          <p><strong>What it will NOT do.</strong> It will not catch lightly-edited AI text. It will not catch a human who happens to write in a corporate / listicle style. It will not give you a definitive "this is AI" answer. Anyone who tells you they can do that from a browser extension is lying.</p>
          <p class="ai-methodology-foot">Score is computed locally. No page is fetched, no data is sent off-device. The whole module adds ~15KB to the extension.</p>
        </div>
      </div>`;
    document.body.appendChild(modal);
    $("aiMethodologyClose").addEventListener("click",()=>{
      modal.classList.remove("open");
    });
    modal.addEventListener("click",(e)=>{
      if(e.target===modal)modal.classList.remove("open");
    });
  }
  modal.classList.add("open");
}

/* ── Sources management UI (settings) ── */
function srcHidden(kind){
  return kind==="web"?state.hiddenWeb:kind==="ai"?state.hiddenAI:state.hiddenShop;
}
function srcRow(kind,e,activeKey){
  const visible=e.builtin?!srcHidden(kind).includes(e.key):true;
  return `<div class="src-row${activeKey===e.key?" active":""}" data-kind="${kind}" data-key="${esc(e.key)}" data-builtin="${e.builtin?1:0}">
    <button type="button" class="src-vis${visible?" on":""}" data-role="vis" title="${visible?"Hide":"Show"}" aria-label="${visible?"Hide":"Show"}"></button>
    <span class="src-icon">${svgIcon(e.key)}</span>
    <span class="src-name">${esc(e.label)}</span>
    ${activeKey===e.key?'<span class="src-def">default</span>':''}
    ${e.builtin?'':'<button type="button" class="src-del" data-role="del" title="Remove" aria-label="Remove">✕</button>'}
  </div>`;
}
function srcList(kind,entries,activeKey){
  return entries.map(e=>srcRow(kind,e,activeKey)).join("");
}
function addFormHTML(kind){
  const ai=kind==="ai",shop=kind==="shop";
  const namePh=shop?"Store name":ai?"AI name":"Engine name";
  return `<div class="src-form">
    <input class="src-input src-label" placeholder="${namePh}" maxlength="40" spellcheck="false">
    <input class="src-input src-url" placeholder="https://…search?q=%s" spellcheck="false" autocomplete="off">
    ${ai?'<select class="src-input src-mode"><option value="prefill">Fills the box — press Enter</option><option value="search">Runs the search itself</option></select>':''}
    ${shop?'<div class="src-form-row"><input class="src-input src-mark" placeholder="Letter" maxlength="1" style="max-width:64px"><input type="color" class="src-input src-color" value="#7a8a9a" style="max-width:64px;padding:2px"></div>':''}
    <div class="src-form-row" style="justify-content:flex-end">
      <button type="button" class="btn-sm src-cancel">Cancel</button>
      <button type="button" class="btn-sm src-save">Add</button>
    </div>
    <p class="settings-hint" style="margin-top:0">Use <code>%s</code> where the query goes — e.g. <code>https://temu.com/search_result.html?search_key=%s</code>.</p>
  </div>`;
}
function openAddForm(kind){
  const btn=document.querySelector(`#settingsBody [data-addsrc="${kind}"]`);
  if(!btn||(btn.nextElementSibling&&btn.nextElementSibling.classList.contains("src-form")))return;
  btn.insertAdjacentHTML("afterend",addFormHTML(kind));
  const form=btn.nextElementSibling;
  form.querySelector(".src-label").focus();
  form.querySelector(".src-cancel").addEventListener("click",()=>form.remove());
  form.querySelector(".src-save").addEventListener("click",()=>{
    const label=form.querySelector(".src-label").value.trim();
    const t=safeTemplate(form.querySelector(".src-url").value.trim());
    if(!label){form.querySelector(".src-label").style.borderColor="#ff5a5a";return}
    if(!t){form.querySelector(".src-url").style.borderColor="#ff5a5a";return}
    if(kind==="web")state.customWeb.push({id:"cw"+(linkId++),label,url:t});
    else if(kind==="ai"){const mode=form.querySelector(".src-mode").value;state.customAI.push({id:"ca"+(linkId++),label,url:t,mode});}
    else{const mark=(form.querySelector(".src-mark").value.trim()||label).charAt(0).toUpperCase();const color=form.querySelector(".src-color").value||"#7a8a9a";state.customShop.push({id:"cs"+(linkId++),label,url:t,mark,color});}
    saveState();renderSettings();refreshUI();
  });
}

function renderSettings(){
  const gi=Math.round((state.glassOpacity||.04)*100);
  $("settingsTitle").textContent="Anupam's Horizon Settings";
  $("settingsBody").innerHTML=`
    <div class="settings-group">
      <label class="settings-label">Theme</label>
      <div class="theme-grid">
        <button class="theme-btn${state.theme==="slate"?" active":""}" data-theme="slate"><span class="theme-swatch" style="background:#0d0d0d;border:1px solid #444"></span>Slate</button>
        <button class="theme-btn${state.theme==="ivory"?" active":""}" data-theme="ivory"><span class="theme-swatch" style="background:#f3f1ed;border:1px solid #ccc"></span>Ivory</button>
        <button class="theme-btn${state.theme==="navy"?" active":""}" data-theme="navy"><span class="theme-swatch" style="background:#001E44"></span>Navy</button>
        <button class="theme-btn${state.theme==="modern"?" active":""}" data-theme="modern"><span class="theme-swatch" style="background:linear-gradient(135deg,#0d0d0d 50%,#f8f6f0 50%);border:1px solid #666"></span>Modern</button>
        <button class="theme-btn${state.theme==="custom"?" active":""}" data-theme="custom" style="grid-column:1/-1"><span class="theme-swatch" style="background:${state.customBg||"#333"};border:1px solid ${state.customAccent||"#666"}"></span>Custom</button>
      </div>
      ${state.theme==="custom"?`<div class="color-pickers"><div class="color-pick-group"><label>Background</label><input type="color" class="color-input" id="customBgInput" value="${state.customBg||"#0d0d0d"}"></div><div class="color-pick-group"><label>Accent</label><input type="color" class="color-input" id="customAccentInput" value="${state.customAccent||"#7a8a9a"}"></div></div>`:""}
    </div>
    <div class="settings-group">
      <label class="settings-label">Text Color</label>
      <p class="settings-hint">Override the text color on every theme. Pick a color, or reset to the theme's own.</p>
      <div style="display:flex;gap:.5rem;align-items:center">
        <input type="color" class="color-input" id="textColorInput" value="${state.textColor||"#e8ebed"}" style="width:60px;height:38px;flex-shrink:0">
        <button class="btn-sm" id="resetTextColorBtn">Use theme default</button>
      </div>
    </div>
    <div class="settings-group">
      <label class="settings-label">Background</label>
      <p class="settings-hint">Upload your own image. Persists across tabs.</p>
      <div style="display:flex;gap:.4rem">
        <button class="upload-btn" id="uploadBgBtn">Upload Image</button>
        ${state.bg?'<button class="upload-btn" id="clearBgBtn">× Clear</button>':''}
      </div>
      ${state.bg?`
      <div class="bg-tune">
        <div class="tune-row">
          <label for="bgBlurSlider">Blur<span class="tune-val" id="bgBlurVal">${state.bgBlur?state.bgBlur+"px":"Off"}</span></label>
          <input type="range" class="glass-slider" id="bgBlurSlider" min="0" max="24" step="1" value="${state.bgBlur||0}">
        </div>
        <div class="tune-row">
          <label for="bgDimSlider">Dim<span class="tune-val" id="bgDimVal">${state.bgDim==null?"Auto":(state.bgDim?state.bgDim+"%":"Off")}</span></label>
          <input type="range" class="glass-slider" id="bgDimSlider" min="0" max="80" step="1" value="${state.bgDim==null?50:state.bgDim}">
        </div>
        <div class="tune-row">
          <label>Text color</label>
          <div class="theme-grid" style="grid-template-columns:repeat(3,1fr);gap:.3rem;margin-top:.3rem">
            <button class="engine-btn${state.bgText==="auto"?" active":""}" data-bgtext="auto">Auto</button>
            <button class="engine-btn${state.bgText==="white"?" active":""}" data-bgtext="white">White</button>
            <button class="engine-btn${state.bgText==="black"?" active":""}" data-bgtext="black">Black</button>
          </div>
        </div>
        <p class="settings-hint" style="margin-top:.15rem">Auto reads your image and picks the most readable text. White and Black force it.</p>
        <p class="settings-hint">Blur is off by default so your image stays sharp. Dim is auto-set per image — only as much as the text needs — and stays where you put it.</p>
      </div>`:""}
    </div>
    <div class="settings-group">
      <label class="settings-label">Search Behavior</label>
      <div class="theme-grid" style="grid-template-columns:1fr">
        <button class="engine-btn${state.resetFilters?" active":""}" id="resetFiltersToggle">
          ${state.resetFilters?"✓ Filters reset on every new tab":"○ Filters stay as you left them"}
        </button>
      </div>
      <p class="settings-hint" style="margin-top:.25rem">Resets the vertical (News/Images/Video), the refiner chips and AI-Free each time a new tab opens. Your engine, AI provider and store selection are kept — those are preferences, not filters.</p>
      <p class="settings-hint" style="margin-top:.4rem"><strong>Bangs</strong> — start a query with one of these to redirect that single search without changing any setting:</p>
      <div class="bang-ref">${bangReference()}</div>
    </div>
    <div class="settings-group">
      <label class="settings-label">Glass Intensity</label>
      <div class="glass-slider-row"><span>◻</span><input type="range" class="glass-slider" id="glassSlider" min="0" max="15" value="${gi}"><span>◼</span></div>
    </div>
    <div class="settings-group">
      <label class="settings-label">Weather Location</label>
      <p class="settings-hint">US coordinates (National Weather Service). Leave blank for the default.</p>
      <div style="display:flex;gap:.4rem">
        <input type="text" class="coord-input" id="weatherLatInput" inputmode="decimal" placeholder="Latitude" value="${state.weatherLat??""}">
        <input type="text" class="coord-input" id="weatherLonInput" inputmode="decimal" placeholder="Longitude" value="${state.weatherLon??""}">
      </div>
    </div>
    <div class="settings-group">
      <label class="settings-label">Search Sources</label>
      <p class="settings-hint">Toggle what appears in the search drawer. Tap a name to set it as the default; add your own with a <code>%s</code> search template.</p>
      <div class="src-block">
        <div class="src-head">Web Search</div>
        <div class="src-list">${srcList("web",webAll(),state.searchEngine)}</div>
        <button class="btn-sm" data-addsrc="web">+ Add custom engine</button>
      </div>
      <div class="src-block">
        <div class="src-head">AI Chat</div>
        <div class="src-list">${srcList("ai",aiAll(),state.aiProvider)}</div>
        <button class="btn-sm" data-addsrc="ai">+ Add custom AI</button>
      </div>
      <div class="src-block">
        <div class="src-head">Stores</div>
        <div class="src-list">${srcList("shop",shopAll(),state.shopSite)}</div>
        <button class="btn-sm" data-addsrc="shop">+ Add custom store</button>
      </div>
    </div>
    <div class="settings-group">
      <label class="settings-label">AI Signal<span style="font-weight:400;text-transform:none;letter-spacing:0;opacity:.65"> · beta</span></label>
      <p class="settings-hint">Heuristic score on Google / DuckDuckGo / Brave search results. Shows an "AI: NN%" badge per result, optionally hides high-AI ones. Pure client-side, no API.</p>
      <div class="theme-grid" style="grid-template-columns:1fr">
        <button class="engine-btn${state.aiSignal?" active":""}" id="aiSignalToggle" data-on="${state.aiSignal}">
          ${state.aiSignal?"✓ Enabled — showing AI % on search results":"○ Off — click to enable"}
        </button>
      </div>
      <div class="theme-grid" style="grid-template-columns:1fr;margin-top:.35rem">
        <button class="engine-btn${state.aiPageDetector?" active":""}" id="aiPageDetToggle">
          ${state.aiPageDetector?"✓ Page detector on — floating score on article pages":"○ Page detector off — click to score pages you visit"}
        </button>
      </div>
      <p class="settings-hint" style="margin-top:.25rem">Optional and off by default. Asks for permission to run on all sites; the text analysis itself stays on-device.</p>
      <div style="margin-top:.75rem">
        <label class="settings-label" style="font-size:.7rem;opacity:.75">Prompt bridge<span style="font-weight:400;text-transform:none;letter-spacing:0;opacity:.65"> · optional</span></label>
        <div class="theme-grid" style="grid-template-columns:1fr;margin-top:.25rem">
          <button class="engine-btn${state.aiBridge?" active":""}" id="aiBridgeToggle">
            ${state.aiBridge?"✓ On — fills the chat box on Gemini &amp; DeepSeek":"○ Off — those chats open empty"}
          </button>
        </div>
        ${state.aiBridge?`<div class="theme-grid" style="grid-template-columns:1fr;margin-top:.35rem">
          <button class="engine-btn${state.aiBridgeSubmit?" active":""}" id="aiBridgeSubmitToggle">
            ${state.aiBridgeSubmit?"✓ Auto-send — sends without waiting":"○ Fill only — you press Enter"}
          </button>
        </div>`:""}
        <p class="settings-hint" style="margin-top:.25rem">Gemini and DeepSeek ignore prefilled links, so a search there opens an empty chat. With the bridge on, Horizon types your query into the box for you. Asks permission per AI site; reads only the query it just sent.</p>
      </div>
      <div style="margin-top:.75rem">
        <label class="settings-label" style="font-size:.7rem;opacity:.75">Safe Browsing key<span style="font-weight:400;text-transform:none;letter-spacing:0;opacity:.65"> · optional</span></label>
        <input type="text" class="coord-input" id="sbKeyInput" placeholder="Enter here" spellcheck="false" autocomplete="off" style="margin-top:.25rem">
        <p class="settings-hint" style="margin-top:.25rem">If set, the page detector also checks sites against Google Safe Browsing and warns on flagged ones — this sends the hostname to Google. Leave blank to skip entirely. <a href="https://developers.google.com/safe-browsing/v4/get-started" target="_blank" rel="noopener" style="color:var(--accent)">Get a key</a></p>
      </div>
      ${state.aiSignal?`
        <div style="margin-top:.4rem">
          <label class="settings-label" style="font-size:.7rem;opacity:.75">Sensitivity</label>
          <div class="theme-grid" style="grid-template-columns:1fr 1fr 1fr;gap:.3rem">
            <button class="engine-btn${state.aiSensitivity==="low"?" active":""}" data-aisens="low">Low<br><span style="font-size:.6rem;opacity:.65">only flag obvious</span></button>
            <button class="engine-btn${state.aiSensitivity==="med"?" active":""}" data-aisens="med">Medium<br><span style="font-size:.6rem;opacity:.65">default</span></button>
            <button class="engine-btn${state.aiSensitivity==="high"?" active":""}" data-aisens="high">High<br><span style="font-size:.6rem;opacity:.65">sensitive</span></button>
          </div>
        </div>
        <div style="margin-top:.4rem">
          <label class="settings-label" style="font-size:.7rem;opacity:.75">Auto-hide results: <span id="aiHideVal">${state.aiHideAbove?`≥ ${state.aiHideAbove}%`:"Off"}</span></label>
          <div class="glass-slider-row"><span>off</span><input type="range" class="glass-slider" id="aiHideSlider" min="0" max="95" step="5" value="${state.aiHideAbove}"><span>95%</span></div>
          <p class="settings-hint" style="margin-top:.25rem">Results scoring at or above the threshold collapse — hover one to reveal it. Slide left to turn off.</p>
        </div>
        <p class="settings-hint" style="margin-top:.4rem">
          <strong>Heuristic, not a verdict.</strong> False positives are possible — formal human writing can get flagged. Every result can be dismissed (\u2715) per-domain. Read the
          <a href="#" id="aiHowLink" style="color:var(--accent)">methodology</a> for details.
        </p>
      `:""}
    </div>
    <div class="settings-group">
      <label class="settings-label">Quick Links</label>
      <div class="custom-links" id="customLinksRendered">
        ${state.links.map((l,i)=>`<div class="link-editor" data-idx="${i}"><input class="le-emoji" value="${esc(l.emoji||"🌐")}" maxlength="2" placeholder="🌐"><input class="le-label" value="${esc(l.label)}" placeholder="Label"><input class="le-url" value="${esc(l.url)}" placeholder="https://..."><input class="le-img" value="${esc(l.image||"")}" placeholder="Img URL"><button class="link-remove" title="Remove">✕</button></div>`).join("")}
      </div>
      <button class="btn-sm" id="addLinkBtn">+ Add Link</button>
      <button class="btn-sm" id="toggleLinksBtn">${state.showLinks?"✓ Visible":"⊟ Hidden"}</button>
    </div>`;

  const ci=$("customBgInput"),ca=$("customAccentInput");
  if(ci&&ca){ci.addEventListener("input",()=>{state.customBg=ci.value;applyCustomTheme()});ca.addEventListener("input",()=>{state.customAccent=ca.value;applyCustomTheme()})}
  const tci=$("textColorInput");
  if(tci)tci.addEventListener("input",()=>{state.textColor=tci.value;applyTextColor();saveState()});
  $("resetTextColorBtn")?.addEventListener("click",()=>{state.textColor=null;applyTextColor();saveState();renderSettings()});
  $("glassSlider")?.addEventListener("input",e=>applyGlassOpacity(e.target.value/100));
  document.querySelectorAll("#settingsBody .theme-btn").forEach(btn=>{btn.addEventListener("click",()=>{if(state.bg)clearBg();applyTheme(btn.dataset.theme);renderSettings()})});
  // Sources management — toggle visibility, remove custom, set default.
  document.querySelectorAll("#settingsBody .src-row").forEach(row=>{
    row.addEventListener("click",e=>{
      const roleEl=e.target.closest("[data-role]");
      const kind=row.dataset.kind,key=row.dataset.key;
      if(roleEl){
        if(roleEl.dataset.role==="vis"){
          const l=srcHidden(kind),i=l.indexOf(key);
          i>=0?l.splice(i,1):l.push(key);
          ensureActive();saveState();renderSettings();refreshUI();
        }else if(roleEl.dataset.role==="del"){
          if(kind==="web")state.customWeb=(state.customWeb||[]).filter(x=>x.id!==key);
          else if(kind==="ai")state.customAI=(state.customAI||[]).filter(x=>x.id!==key);
          else state.customShop=(state.customShop||[]).filter(x=>x.id!==key);
          ensureActive();saveState();renderSettings();refreshUI();
        }
        return;
      }
      if(kind==="web")state.searchEngine=key;
      else if(kind==="ai")state.aiProvider=key;
      else state.shopSite=key;
      saveState();renderSettings();refreshUI();
    });
  });
  document.querySelectorAll("#settingsBody [data-addsrc]").forEach(b=>{
    b.addEventListener("click",()=>openAddForm(b.dataset.addsrc));
  });
  document.querySelectorAll("#customLinksRendered .link-editor").forEach(ed=>{const idx=parseInt(ed.dataset.idx);const save=()=>{
    const newUrl=ed.querySelector(".le-url").value.trim()||"https://example.com";
    const newImg=ed.querySelector(".le-img").value.trim();
    let image=newImg;
    if(!image){
      // v1 called new URL(newUrl) unguarded — a half-typed URL threw and
      // killed the whole input handler. Now it just skips the favicon.
      try{image=`https://www.google.com/s2/favicons?domain=${new URL(safeHref(newUrl)).hostname}&sz=64`}catch{image=""}
    }
    state.links[idx]={...state.links[idx],emoji:ed.querySelector(".le-emoji").value||"🌐",label:ed.querySelector(".le-label").value||"Link",url:newUrl,image};
    saveState();renderLinks()
  };ed.querySelector(".le-emoji")?.addEventListener("input",save);ed.querySelector(".le-label")?.addEventListener("input",save);ed.querySelector(".le-url")?.addEventListener("input",save);ed.querySelector(".le-img")?.addEventListener("input",save);ed.querySelector(".link-remove")?.addEventListener("click",()=>{state.links.splice(idx,1);saveState();renderLinks();renderSettings()})});
  $("toggleLinksBtn")?.addEventListener("click",()=>{state.showLinks=!state.showLinks;saveState();renderLinks();renderSettings()});
  $("addLinkBtn")?.addEventListener("click",()=>{const newUrl = "https://example.com"; const newDomain = (new URL(newUrl)).hostname; state.links.push({id:`lc${linkId++}`,label:"New Link",url:newUrl,emoji:"",image:`https://www.google.com/s2/favicons?domain=${newDomain}&sz=64`});saveState();renderLinks();renderSettings();$("settingsPanel").scrollTop=$("settingsPanel").scrollHeight});
  $("uploadBgBtn")?.addEventListener("click",()=>$("bgUpload").click());
  $("resetFiltersToggle")?.addEventListener("click",()=>{
    state.resetFilters=!state.resetFilters;
    saveState();saveStateNow();renderSettings();
  });
  $("clearBgBtn")?.addEventListener("click",()=>{clearBg();renderSettings()});
  let tuneFrame=0;
  const tune=()=>{tuneFrame=0;bgVars()};
  const scheduleTune=()=>{if(!tuneFrame)tuneFrame=requestAnimationFrame(tune)};
  const bb=$("bgBlurSlider");
  if(bb)bb.addEventListener("input",()=>{
    state.bgBlur=parseInt(bb.value,10)||0;
    $("bgBlurVal").textContent=state.bgBlur?state.bgBlur+"px":"Off";
    scheduleTune();saveState();
  });
  const bd=$("bgDimSlider");
  if(bd)bd.addEventListener("input",()=>{
    state.bgDim=parseInt(bd.value,10)||0;
    $("bgDimVal").textContent=state.bgDim?state.bgDim+"%":"Off";
    scheduleTune();saveState();
  });
  // Text-color override for custom backgrounds: Auto reads the image,
  // White/Black force light/dark text (and the matching dim veil).
  document.querySelectorAll("#settingsBody [data-bgtext]").forEach(b=>b.addEventListener("click",()=>{
    state.bgText=b.dataset.bgtext;
    if(state.bg)applyBg(state.bg,true);
    saveState();renderSettings();
  }));

  // AI Signal settings wiring
  $("aiSignalToggle")?.addEventListener("click",()=>{state.aiSignal=!state.aiSignal;saveState();renderSettings()});
  $("aiPageDetToggle")?.addEventListener("click",async()=>{
    if(!state.aiPageDetector){
      // Turning ON: ask for the optional <all_urls> permission first.
      // background.js registers the detector script only when both the
      // setting and the permission are in place.
      let granted=false;
      try{granted=await chrome.permissions.request({origins:["<all_urls>"]})}catch{}
      if(!granted){renderSettings();return}
    }
    state.aiPageDetector=!state.aiPageDetector;
    saveState();renderSettings();
  });
  $("aiBridgeToggle")?.addEventListener("click",async()=>{
    if(!state.aiBridge){
      let granted=false;
      try{granted=await chrome.permissions.request({origins:["https://gemini.google.com/*","https://chat.deepseek.com/*"]})}catch{}
      if(!granted){renderSettings();return}
    }
    state.aiBridge=!state.aiBridge;
    if(!state.aiBridge)state.aiBridgeSubmit=false;
    saveState();saveStateNow();renderSettings();renderDrawer();renderFilterBar();
  });
  $("aiBridgeSubmitToggle")?.addEventListener("click",()=>{
    state.aiBridgeSubmit=!state.aiBridgeSubmit;
    saveState();saveStateNow();renderSettings();renderFilterBar();
  });
  const sbInput=$("sbKeyInput");
  if(sbInput){
    try{chrome.storage.sync.get(["hz_sb_key"],r=>{if(r&&typeof r.hz_sb_key==="string")sbInput.value=r.hz_sb_key})}catch{}
    sbInput.addEventListener("change",()=>{
      const v=sbInput.value.trim();
      try{
        if(v){const p=chrome.storage.sync.set({hz_sb_key:v});if(p&&p.catch)p.catch(()=>{})}
        else{const p=chrome.storage.sync.remove("hz_sb_key");if(p&&p.catch)p.catch(()=>{})}
      }catch{}
    });
  }
  const wla=$("weatherLatInput"),wlo=$("weatherLonInput");
  if(wla&&wlo){
    const upd=()=>{
      const la=parseFloat(wla.value),lo=parseFloat(wlo.value);
      state.weatherLat=Number.isFinite(la)&&Math.abs(la)<=90?la:null;
      state.weatherLon=Number.isFinite(lo)&&Math.abs(lo)<=180?lo:null;
      saveState();fetchWeather();
    };
    wla.addEventListener("change",upd);wlo.addEventListener("change",upd);
  }
  document.querySelectorAll("[data-aisens]").forEach(b=>b.addEventListener("click",()=>{state.aiSensitivity=b.dataset.aisens;saveState();renderSettings()}));
  $("aiHideSlider")?.addEventListener("input",e=>{
    state.aiHideAbove=parseInt(e.target.value,10)||0;
    $("aiHideVal").textContent=state.aiHideAbove?`≥ ${state.aiHideAbove}%`:"Off";
    saveState();
  });
  $("aiHowLink")?.addEventListener("click",e=>{
    e.preventDefault();
    showMethodology();
  });
}

/* ── Upload ── */
$("bgUpload").addEventListener("change",e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      let q=.85,w=img.width,h=img.height;const MD=1920;
      if(w>MD||h>MD){const R=Math.min(MD/w,MD/h);w=Math.round(w*R);h=Math.round(h*R)}
      const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);
      const comp=qu=>{const d=c.toDataURL("image/jpeg",qu);return d.length*.75>500*1024&&qu>.1?comp(qu-.05):d};
      state.bgDim=null;applyBg(comp(q),true);renderSettings();
    };img.src=r.result;
  };r.readAsDataURL(f);e.target.value="";
});

document.addEventListener("keydown",e=>{
  const el=e.target;
  const typing=el&&(el.tagName==="INPUT"||el.tagName==="TEXTAREA"||el.isContentEditable);
  const settingsOpen=$("settingsPanel").classList.contains("open");

  // Cmd/Ctrl+K always focuses search; bare "/" only when not typing.
  // (v1 hijacked "/" and "?" even inside the search box — you couldn't
  // type a URL path or end a question with "?" without opening settings.)
  if(((e.key==="/"&&!typing)||(e.key==="k"&&(e.metaKey||e.ctrlKey)))&&!settingsOpen){
    e.preventDefault();
    $("searchInput").focus({preventScroll:true});
    return;
  }
  if(e.key==="?"&&!typing&&!isDrawerOpen()&&!settingsOpen){
    e.preventDefault();
    openSettings();
    return;
  }
  if(e.key==="Escape"&&$("settingsPanel").classList.contains("open"))closeSettings();
  if(e.key==="Escape"&&isDrawerOpen())closeDrawer();

  // Arrow navigation in the drawer grid
  if(isDrawerOpen()&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){
    // While the caret is in the search input, Left/Right/Up must keep
    // moving the caret (v1 preventDefault'd them to switch drawer tabs,
    // so the text cursor couldn't move at all). Only ArrowDown hands
    // focus to the drawer.
    if(document.activeElement===$("searchInput")&&e.key!=="ArrowDown")return;
    e.preventDefault();
    const btns=[...document.querySelectorAll(".drawer-btn")];
    const tabs=[...document.querySelectorAll(".drawer-tab")];
    const active=document.activeElement;
    const activeIdx=btns.indexOf(active);
    const tabIdx=tabs.indexOf(active);

    if(active&&activeIdx>=0){
      // Currently on a grid button
      const perRow=Math.max(1,Math.floor((document.querySelector(":root").offsetWidth-80)/145));
      const col=activeIdx%perRow;
      const isFirstCol=col===0;
      const isLastCol=col===perRow-1||activeIdx===btns.length-1;
      // ArrowLeft from first column → switch to previous tab
      if(e.key==="ArrowLeft"&&isFirstCol){
        const tabs2=[...document.querySelectorAll(".drawer-tab")];
        const activeTab=document.querySelector(".drawer-tab.active");
        const tIdx=tabs2.indexOf(activeTab);
        if(tIdx>0){
          tabs2[tIdx-1].click();
          requestAnimationFrame(()=>{
            const nt=[...document.querySelectorAll(".drawer-tab")];
            if(nt[tIdx-1])nt[tIdx-1].focus();
          });
          return;
        }
      }
      // ArrowRight from last column → switch to next tab
      if(e.key==="ArrowRight"&&isLastCol){
        const tabs2=[...document.querySelectorAll(".drawer-tab")];
        const activeTab=document.querySelector(".drawer-tab.active");
        const tIdx=tabs2.indexOf(activeTab);
        if(tIdx<tabs2.length-1){
          tabs2[tIdx+1].click();
          requestAnimationFrame(()=>{
            const nt=[...document.querySelectorAll(".drawer-tab")];
            if(nt[tIdx+1])nt[tIdx+1].focus();
          });
          return;
        }
      }
      // Normal grid navigation
      if(e.key==="ArrowRight"&&activeIdx<btns.length-1){
        btns[activeIdx+1].focus();
      }else if(e.key==="ArrowLeft"&&activeIdx>0){
        btns[activeIdx-1].focus();
      }else if(e.key==="ArrowDown"&&activeIdx+perRow<btns.length){
        btns[activeIdx+perRow].focus();
      }else if(e.key==="ArrowUp"){
        if(activeIdx-perRow>=0){
          btns[activeIdx-perRow].focus();
        }else{
          // Jump to active tab
          const activeTab2=document.querySelector(".drawer-tab.active");
          if(activeTab2)activeTab2.focus();
        }
      }
    }else if(active&&tabIdx>=0){
      // Currently on a tab
      if(e.key==="ArrowRight"&&tabIdx<tabs.length-1){
        tabs[tabIdx+1].click();
        // After click the drawer re-renders, so re-query the new tab by index
        requestAnimationFrame(()=>{
          const newTabs=[...document.querySelectorAll(".drawer-tab")];
          if(newTabs[tabIdx+1])newTabs[tabIdx+1].focus();
        });
      }else if(e.key==="ArrowLeft"&&tabIdx>0){
        tabs[tabIdx-1].click();
        requestAnimationFrame(()=>{
          const newTabs=[...document.querySelectorAll(".drawer-tab")];
          if(newTabs[tabIdx-1])newTabs[tabIdx-1].focus();
        });
      }else if(e.key==="ArrowUp"||e.key==="ArrowDown"){
        // Jump to first engine of current tab
        const tab=active.dataset.mode;
        const firstBtn=btns.find(b=>b.dataset.kind===tab);
        if(firstBtn)firstBtn.focus();
        else if(btns.length>0)btns[0].focus();
      }
    }else if(active===$("searchInput")){
      // From the input, ArrowDown enters the drawer (Left/Right/Up
      // stay with the text caret and returned early above).
      if(e.key==="ArrowDown"){
        const activeTab=document.querySelector(".drawer-tab.active");
        if(activeTab)activeTab.focus();
      }
    }
  }
});

/* ══════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════ */
(async function boot(){
  await loadState();
  if(state.glassOpacity)document.documentElement.style.setProperty("--surface-opacity",String(state.glassOpacity));
  if(!state.aiProvider)state.aiProvider="perplexity";

  if(state.bg)applyBg(state.bg,false);
  else applyTheme(state.theme||"slate");
  applyTextColor();

  scheduleClock();
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)scheduleClock()});
  fetchWeather();setInterval(fetchWeather,1800000);
  renderLinks();

  /* ── Search: click row toggles drawer, focus opens it ── */
  const sec=$("searchSection");
  const input=$("searchInput");

  // Clicking the search row (anywhere outside input) toggles drawer
  document.querySelector(".search-row").addEventListener("click",e=>{
    if(e.target===input||input.contains(e.target)){openDrawer();return}
    toggleDrawer();
    if(isDrawerOpen())input.focus();
  });

  // Mode tag and arrow both toggle drawer directly
  $("modeTag").addEventListener("click",e=>{
    e.stopPropagation();
    toggleDrawer();
    if(isDrawerOpen())input.focus();
  });
  $("searchArrow").addEventListener("click",e=>{
    e.stopPropagation();
    toggleDrawer();
    if(isDrawerOpen())input.focus();
  });
  // Focus the input BEFORE attaching the focus→open listener, so a
  // fresh tab starts focused with the drawer closed. (v1 used the HTML
  // autofocus attribute, which only worked because it happened to fire
  // before the async boot attached this listener.)
  input.focus({preventScroll:true});
  input.addEventListener("focus",openDrawer);
  input.addEventListener("input",tagOnInput);

  // Event delegation for drawer controls — the render functions emit
  // markup only now, so re-renders never churn listeners, and picking
  // an engine in the current mode is a cheap class swap instead of an
  // innerHTML rebuild mid-animation.
  $("drawerTabbar").addEventListener("click",e=>{
    const tab=e.target.closest(".drawer-tab");if(!tab)return;
    e.stopPropagation();
    const mode=tab.dataset.mode;
    if(mode&&mode!==state.mode){state.mode=mode;refreshUI()}
  });
  $("drawerGrid").addEventListener("click",e=>{
    const btn=e.target.closest(".drawer-btn");if(!btn)return;
    e.stopPropagation();
    const kind=btn.dataset.kind,key=btn.dataset.key;
    const modeFor={web:"web",ai:"ai",shop:"shop"}[kind];
    if(modeFor!==state.mode){ // stale grid from another mode — full refresh
      state.mode=modeFor;
      if(kind==="web")state.searchEngine=key;
      else if(kind==="ai")state.aiProvider=key;
      else state.shopSite=key;
      refreshUI();return;
    }
    if(kind==="web")state.searchEngine=key;
    else if(kind==="ai")state.aiProvider=key;
    else state.shopSite=key;
    $("drawerGrid").querySelector(".drawer-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    syncLegacyType();updateModeTag();updatePlaceholder();
    // Web: chip availability (Recent / AI-Free) is engine-dependent.
    // AI + Shop: the hint line names the provider/retailer.
    renderFilterBar();
    saveState();
  });
  $("filterBar").addEventListener("click",e=>{
    const chip=e.target.closest(".filter-chip");if(!chip)return;
    e.stopPropagation();
    if(chip.disabled)return;
    if(chip.id==="aiFreeChip")state.aiFreeOn=!state.aiFreeOn;
    else if(chip.dataset.vertical)state.vertical=chip.dataset.vertical;   // one of
    else if(chip.dataset.refiner)toggleRefiner(chip.dataset.refiner);      // any of
    else return;
    syncLegacyType();renderFilterBar();updatePlaceholder();saveState();
  });

  // Close drawer on outside click.
  // Use pointerdown (not click) so this fires BEFORE the focus
  // event, preventing the click target from receiving focus and
  // re-triggering openDrawer via the input focus listener.
  document.addEventListener("pointerdown",e=>{
    if(isDrawerOpen()&&!sec.contains(e.target)){
      closeDrawer();
    }
  });

  // Form submit
  $("searchForm").addEventListener("submit",e=>{e.preventDefault();submitSearch(input.value.trim())});

  renderDrawer();refreshUI();

  // Settings
  $("settingsToggle").addEventListener("click",openSettings);
  $("settingsClose").addEventListener("click",closeSettings);
  $("settingsBackdrop").addEventListener("click",closeSettings);
})();
