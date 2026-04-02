import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Brain, ShieldCheck, Activity, Target, Database, Globe, 
  Terminal, Cpu, Search, Layers, Settings, RefreshCw, Star, 
  Users, CheckCircle2, LayoutDashboard, FileText, Wand2,
  ChevronRight, ArrowUpRight, Send, AlertTriangle, Leaf,
  Phone, Mail, MessageSquare, Award, Lightbulb, Ghost, Sparkles,
  Factory, ShieldAlert, BarChart3, Fingerprint, Cloud, Volume2, 
  Play, Calendar, Rocket
} from 'lucide-react';

/**
 * B.CJ Sovereign Master Hub v46.0 (Gemini Enhanced)
 * 🏛️ ศูนย์บัญชาการมหาอำนาจการจัดการ (Management Engineering & AI)
 * เพิ่มระบบ AI Headline Gen, TTS Briefing และ Campaign Planning
 */

const apiKey = ""; // Gemini API Key provided by environment
const sbUrl = 'https://leocdlxhmsgsnbrqdgwb.supabase.co';
const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlb2NkbHhobXNnc25icnFkZ3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDcyMjIsImV4cCI6MjA5MDI4MzIyMn0.jTwaQL_Ea6eKbw28VsIvzY3Y1hthIPDI-JUR4Rg3O80';

const App = () => {
  const [activeTab, setActiveTab] = useState('strike');
  const [sbClient, setSbClient] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [strikeInput, setStrikeInput] = useState({
    headline: 'เปลี่ยนธุรกิจเกษตรสู่มหาอำนาจการจัดการ',
    cta: 'เริ่มสร้างอธิปไตย ISO'
  });
  const [systemStatus, setSystemStatus] = useState('INITIALIZING');
  const [logs, setLogs] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [campaignPlan, setCampaignPlan] = useState(null);

  // --- [INITIALIZATION] ---
  useEffect(() => {
    const initSystem = async () => {
      if (!window.supabase) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.async = true;
        script.onload = () => connectSupabase();
        document.head.appendChild(script);
      } else {
        connectSupabase();
      }
    };

    const connectSupabase = () => {
      try {
        const client = window.supabase.createClient(sbUrl, sbKey);
        setSbClient(client);
        setSystemStatus('OPERATIONAL');
        addLog("Nerve connection established with btc-consultant.com");
      } catch (err) {
        setSystemStatus('ERROR');
        addLog("Connection failed: " + err.message);
      }
    };

    initSystem();
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const showToast = (msg) => {
    const toast = document.getElementById('master-toast');
    if (toast) {
      toast.innerText = `✨ ${msg}`;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 3500);
    }
  };

  // --- [UTILITY: EXPONENTIAL BACKOFF FETCH] ---
  const fetchWithRetry = async (url, options, retries = 5) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        if (res.ok) return res;
        if (res.status !== 429 && res.status < 500) break;
      } catch (e) {}
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
    throw new Error("API call failed after retries");
  };

  // --- [AI: MAGIC HEADLINE GENERATOR] ---
  const generateMagicHeadline = async () => {
    setIsAiLoading(true);
    const prompt = "จงสร้าง 1 พาดหัวที่ทรงพลังและ 1 ข้อความปุ่ม CTA สำหรับบริการปรึกษา ISO 9001/14001/22301 โดยเน้นกลุ่มเป้าหมายนักธุรกิจมหาอำนาจในไทย ตอบกลับในรูปแบบ JSON: { \"headline\": \"...\", \"cta\": \"...\" }";
    
    try {
      const res = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await res.json();
      const result = JSON.parse(data.candidates[0].content.parts[0].text);
      setStrikeInput(result);
      showToast("Magic Headline Generated!");
    } catch (err) {
      addLog("Headline Gen failed: " + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- [AI: STRATEGY AUDIO BRIEF (TTS)] ---
  const generateAudioBrief = async () => {
    if (!aiAnalysis) return;
    setIsAiLoading(true);
    try {
      const res = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Say in a professional, authoritative tone: นี่คือสรุปกลยุทธ์ของคุณครับท่าน CEO. ${aiAnalysis}` }] }],
          generationConfig: { 
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } }
          }
        })
      });
      const data = await res.json();
      const pcmData = data.candidates[0].content.parts[0].inlineData.data;
      
      // Convert PCM16 to WAV for playback
      const wavBlob = pcmToWav(pcmData, 24000); // 24kHz default
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
      showToast("Audio Briefing Ready!");
    } catch (err) {
      addLog("TTS failed: " + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const pcmToWav = (base64Pcm, sampleRate) => {
    const pcmBuffer = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0)).buffer;
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const pcmLength = pcmBuffer.byteLength;

    view.setUint32(0, 0x46464952, true); // "RIFF"
    view.setUint32(4, 36 + pcmLength, true);
    view.setUint32(8, 0x45564157, true); // "WAVE"
    view.setUint32(12, 0x20746d66, true); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x61746164, true); // "data"
    view.setUint32(40, pcmLength, true);

    return new Blob([wavHeader, pcmBuffer], { type: 'audio/wav' });
  };

  // --- [AI: CAMPAIGN ROADMAP PLANNER] ---
  const generateCampaignPlan = async () => {
    setIsAiLoading(true);
    const prompt = `จากพาดหัว: "${strikeInput.headline}" จงสร้างแผนแคมเปญการจัดการแบบมหาอำนาจในรูปแบบ JSON: 
    { "roadmap": [ { "phase": "...", "tasks": ["..."] } ], "social_hooks": ["..."] }`;
    
    try {
      const res = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await res.json();
      const result = JSON.parse(data.candidates[0].content.parts[0].text);
      setCampaignPlan(result);
      setActiveTab('campaign');
      showToast("Campaign Plan Ready!");
    } catch (err) {
      addLog("Campaign Planning failed: " + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- [AI STRATEGY ANALYSIS] ---
  const analyzeStrikePsychology = async (headline, cta) => {
    setIsAiLoading(true);
    const systemPrompt = `คุณคือ Sovereign AI Marketing Strategist. จงวิเคราะห์ข้อความโฆษณาในเชิงจิตวิทยาและทฤษฎี Cognitive Bias. ให้คำแนะนำสั้นๆ ว่าจะทำให้ข้อความนี้ "ทรงพลัง" ขึ้นได้อย่างไร`;
    const userPrompt = `พิจารณาข้อความนี้: Headline: "${headline}" | CTA: "${cta}"`;

    try {
      const res = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      const data = await res.json();
      setAiAnalysis(data.candidates[0].content.parts[0].text);
    } catch (err) {
      setAiAnalysis("การวิเคราะห์ขัดข้อง");
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- [COMMAND EXECUTION] ---
  const executeGlobalStrike = async () => {
    if (!sbClient) return;
    addLog("Initiating Global Strike Mutation...");
    try {
      const { error } = await sbClient.from('authority_rules').insert({
        iso_standard: 'STRATEGY_STRIKE_V46',
        mutated_headline_thai: strikeInput.headline,
        mutated_cta_thai: strikeInput.cta,
        is_active: true
      });
      if (error) throw error;
      analyzeStrikePsychology(strikeInput.headline, strikeInput.cta);
      showToast("MUTATION DEPLOYED TO ALL DOMAINS");
      addLog("Strike successful: Assets mutated across btc-consultant.com");
    } catch (err) {
      addLog("Strike failed: " + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <aside className="w-[280px] bg-[#0D1F3C] flex flex-col shrink-0 z-50 shadow-2xl">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg rotate-3"><Zap size={20} className="text-white fill-white"/></div>
            <h1 className="text-white font-black text-2xl tracking-tighter italic leading-none">B.CJ <span className="font-light opacity-50">Master</span></h1>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Sovereign Domain</p>
            <p className="text-[11px] font-bold text-white uppercase tracking-tight">btc-consultant.com</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto no-scrollbar">
          <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-6 mb-2">Operations</div>
          <NavBtn id="strike" label="Strike Engine" icon={<Target size={18}/>} active={activeTab} onClick={setActiveTab} color="text-pink-400" />
          <NavBtn id="campaign" label="Campaign Roadmap" icon={<Calendar size={18}/>} active={activeTab} onClick={setActiveTab} color="text-emerald-400" />
          <NavBtn id="ai-lab" label="AI Strategy Lab" icon={<Brain size={18}/>} active={activeTab} onClick={setActiveTab} color="text-blue-300" />
          <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-6 mt-8 mb-2">Infrastructure</div>
          <NavBtn id="domains" label="Domain Sovereignty" icon={<Globe size={18}/>} active={activeTab} onClick={setActiveTab} />
          <NavBtn id="cloud" label="Cloud Sync" icon={<Cloud size={18}/>} active={activeTab} onClick={setActiveTab} />
        </nav>
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
          <div className="flex items-center gap-3 mb-4">
             <div className={`w-2 h-2 rounded-full ${systemStatus === 'OPERATIONAL' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
             <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{systemStatus}</span>
          </div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <p key={i} className="text-[8px] font-mono text-slate-500 truncate">{log}</p>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 bg-white/80 backdrop-blur-xl px-10 py-5 z-40 border-b border-slate-200 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0D1F3C] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100"><Cpu size={20}/></div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Central Intelligence Hub</p>
                <h3 className="text-sm font-black text-slate-900 italic tracking-tight uppercase">BTC Consultant Sovereign OS v46.0</h3>
              </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="bg-slate-100 px-4 py-2 rounded-full flex items-center gap-2">
                <Users size={14} className="text-blue-600" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live: 142 Prospects</span>
             </div>
             <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition active:scale-95"><Terminal size={20}/></div>
           </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto space-y-12">
            
            {/* VIEW: STRIKE ENGINE */}
            {activeTab === 'strike' && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                <div className="flex justify-between items-end border-b border-slate-200 pb-8">
                    <div>
                        <h2 className="text-5xl font-black tracking-tighter text-slate-900 italic uppercase leading-none">Strike Mutation Engine</h2>
                    </div>
                    <button 
                      onClick={generateMagicHeadline}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition"
                    >
                      <Sparkles size={16}/> ✨ Magic Headline Gen
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 space-y-8 relative overflow-hidden group">
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Mutate Headline</label>
                                    <textarea 
                                      value={strikeInput.headline}
                                      onChange={(e) => setStrikeInput({...strikeInput, headline: e.target.value})}
                                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-bold outline-none focus:border-pink-500 h-32" 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Mutate CTA</label>
                                    <input 
                                      value={strikeInput.cta}
                                      onChange={(e) => setStrikeInput({...strikeInput, cta: e.target.value})}
                                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-bold outline-none focus:border-pink-500" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <button onClick={executeGlobalStrike} className="bg-[#0D1F3C] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition">
                                <Zap size={16}/> Strike
                              </button>
                              <button onClick={generateCampaignPlan} className="bg-emerald-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-700 transition">
                                <Rocket size={16}/> ✨ Plan Roadmap
                              </button>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 h-full flex flex-col relative overflow-hidden">
                           <div className="flex items-center justify-between mb-8">
                              <div className="flex items-center gap-3">
                                 <Brain size={24} className="text-blue-600"/>
                                 <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 italic">Strategic Insight</h3>
                              </div>
                              {aiAnalysis && (
                                <button onClick={generateAudioBrief} className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition">
                                   <Volume2 size={14}/> ✨ Play Audio Brief
                                </button>
                              )}
                           </div>
                           <div className="flex-1 italic text-slate-700 text-lg whitespace-pre-wrap">
                              {audioUrl && (
                                <div className="mb-6 p-4 bg-emerald-50 rounded-2xl flex items-center gap-4">
                                   <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Play size={20} fill="white"/></div>
                                   <audio src={audioUrl} controls className="flex-1" />
                                </div>
                              )}
                              {isAiLoading ? <p className="animate-pulse">Analyzing...</p> : (aiAnalysis || "Awaiting Strike Command...")}
                           </div>
                        </div>
                    </div>
                </div>
              </section>
            )}

            {/* VIEW: CAMPAIGN ROADMAP */}
            {activeTab === 'campaign' && (
               <section className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-10">
                  <h2 className="text-5xl font-black tracking-tighter text-slate-900 italic uppercase">Campaign Roadmap</h2>
                  {campaignPlan ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                       <div className="lg:col-span-2 space-y-8">
                          {campaignPlan.roadmap.map((phase, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                               <h4 className="text-2xl font-black text-blue-600 mb-6 italic">{phase.phase}</h4>
                               <ul className="space-y-4">
                                  {phase.tasks.map((task, i) => (
                                    <li key={i} className="flex items-center gap-4 text-slate-600 font-medium italic">
                                       <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                       {task}
                                    </li>
                                  ))}
                               </ul>
                            </div>
                          ))}
                       </div>
                       <div className="bg-[#0D1F3C] text-white p-12 rounded-[4rem] h-fit sticky top-32">
                          <h4 className="text-xl font-black italic mb-8 border-b border-white/10 pb-4">✨ Social Hooks</h4>
                          <div className="space-y-6">
                             {campaignPlan.social_hooks.map((hook, idx) => (
                               <p key={idx} className="italic text-slate-400 leading-relaxed text-sm">"{hook}"</p>
                             ))}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 h-96 rounded-[4rem] flex flex-col items-center justify-center text-slate-400">
                       <Rocket size={60} className="mb-4 opacity-20" />
                       <p className="font-black text-xs uppercase tracking-widest">No Campaign Planned Yet</p>
                    </div>
                  )}
               </section>
            )}

            {/* VIEW: DOMAINS */}
            {activeTab === 'domains' && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                 <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic uppercase">Domain Sovereignty</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DomainCard name="master.btc-consultant.com" status="CONNECTED" target="vercel-node-01" icon={<ShieldCheck />} />
                    <DomainCard name="api.btc-consultant.com" status="ACTIVE" target="supabase-cluster-04" icon={<Database />} />
                    <DomainCard name="www.btc-consultant.com" status="MUTATED" target="landing-edge-worker" icon={<Globe />} color="text-pink-500" />
                 </div>
              </section>
            )}
        </div>
      </main>
      <div id="master-toast" className="hidden fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#0D1F3C] text-white px-12 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-3xl z-[1000] border border-white/10 animate-in slide-in-from-bottom-10"></div>
    </div>
  );
};

const NavBtn = ({ id, label, icon, active, onClick, color = "text-white" }) => (
  <button onClick={() => onClick(id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${active === id ? 'bg-blue-600 text-white shadow-2xl translate-x-1' : 'text-white/50 hover:bg-white/5'}`}>
    <div className={`${active === id ? "text-white scale-110" : color} transition-transform`}>{icon}</div>
    <span className={`text-[13px] font-black tracking-tight ${active === id ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);

const DomainCard = ({ name, status, target, icon, color = "text-emerald-500" }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-300 group-hover:text-blue-600 transition-colors">{icon}</div>
    <div className="flex justify-between items-center mb-6">
       <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-50 ${color}`}>{status}</div>
       <Settings size={14} className="text-slate-200 cursor-pointer hover:text-slate-400" />
    </div>
    <h4 className="text-xl font-black italic text-slate-800 mb-2 truncate">{name}</h4>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Node: {target}</p>
    <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
       Check Health <ArrowUpRight size={12} />
    </div>
  </div>
);

export default App;
