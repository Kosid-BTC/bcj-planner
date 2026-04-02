import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Brain, ShieldCheck, Activity, Target, Database, Globe, 
  Terminal, Cpu, Search, Layers, Settings, RefreshCw, Star, 
  Users, CheckCircle2, LayoutDashboard, FileText, Wand2,
  ChevronRight, ArrowUpRight, Send, AlertTriangle, Leaf,
  Phone, Mail, MessageSquare, Award, Lightbulb, Ghost, Sparkles,
  Factory, ShieldAlert, BarChart3, Fingerprint, Cloud
} from 'lucide-react';

/**
 * B.CJ Sovereign Master Hub v45.0
 * 🏛️ ศูนย์บัญชาการมหาอำนาจการจัดการ (Management Engineering & AI)
 * รองรับระบบ Strike Mutation, AI Strategic Analysis และ Domain Control
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

  // --- [INITIALIZATION] ---
  useEffect(() => {
    const initSystem = async () => {
      // Inject Supabase SDK
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

  // --- [UTILITIES] ---
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

  // --- [AI STRATEGY NODE] ---
  const analyzeStrikePsychology = async (headline, cta) => {
    setIsAiLoading(true);
    const systemPrompt = `คุณคือ Sovereign AI Marketing Strategist. จงวิเคราะห์ข้อความโฆษณาในเชิงจิตวิทยาและทฤษฎี Cognitive Bias (Loss Aversion, Social Proof, Pride). ให้คำแนะนำสั้นๆ ว่าจะทำให้ข้อความนี้ "ทรงพลัง" ขึ้นได้อย่างไร`;
    const userPrompt = `พิจารณาข้อความนี้: Headline: "${headline}" | CTA: "${cta}"`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiAnalysis(text || "AI ไม่สามารถประมวลผลได้ในขณะนี้");
    } catch (err) {
      setAiAnalysis("การเชื่อมต่อ AI ขัดข้อง กรุณาตรวจสอบ API Key");
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- [COMMAND EXECUTION] ---
  const executeGlobalStrike = async () => {
    if (!sbClient) return;
    
    addLog("Initiating Global Strike Mutation...");
    
    try {
      // 1. ส่งคำสั่ง Mutation ไปยัง Supabase (Real-time Replication)
      const { error } = await sbClient.from('authority_rules').insert({
        iso_standard: 'STRATEGY_STRIKE_V45',
        mutated_headline_thai: strikeInput.headline,
        mutated_cta_thai: strikeInput.cta,
        is_active: true
      });

      if (error) throw error;

      // 2. วิเคราะห์ผลกระทบด้วย AI
      analyzeStrikePsychology(strikeInput.headline, strikeInput.cta);
      
      showToast("MUTATION DEPLOYED TO ALL DOMAINS");
      addLog("Strike successful: Assets mutated across btc-consultant.com");
    } catch (err) {
      addLog("Strike failed: " + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-hidden">
      
      {/* 1. SIDEBAR - SOVEREIGN CONTROL */}
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
          <NavBtn id="ai-lab" label="AI Strategy Lab" icon={<Brain size={18}/>} active={activeTab} onClick={setActiveTab} color="text-blue-300" />
          
          <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-6 mt-8 mb-2">Infrastructure</div>
          <NavBtn id="domains" label="Domain Sovereignty" icon={<Globe size={18}/>} active={activeTab} onClick={setActiveTab} />
          <NavBtn id="cloud" label="Cloud Sync" icon={<Cloud size={18}/>} active={activeTab} onClick={setActiveTab} />
          <NavBtn id="legacy" label="Legacy Assets" icon={<Database size={18}/>} active={activeTab} onClick={setActiveTab} color="text-amber-400" />
        </nav>

        <div className="p-8 border-t border-white/5 bg-black/20">
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
        
        {/* HEADER HUD */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-xl px-10 py-5 z-40 border-b border-slate-200 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0D1F3C] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100"><Cpu size={20}/></div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Central Intelligence Hub</p>
                <h3 className="text-sm font-black text-slate-900 italic tracking-tight uppercase">BTC Consultant Sovereign OS v45.0</h3>
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
                        <p className="text-slate-500 text-lg font-medium mt-3 italic max-w-2xl">"บงการหัวใจของเว็บไซต์และระบบ SaaS ในเครือ BTC ทั้งหมดผ่านการส่งสัญญาณ Real-time Mutation เพียงครั้งเดียว"</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity"><Target size={120} className="text-pink-600"/></div>
                            
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                      <FileText size={14} className="text-pink-500" /> Mutate Headline (TH)
                                    </label>
                                    <textarea 
                                      value={strikeInput.headline}
                                      onChange={(e) => setStrikeInput({...strikeInput, headline: e.target.value})}
                                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-bold outline-none focus:border-pink-500 transition-all h-32 leading-relaxed shadow-inner" 
                                      placeholder="ใส่พาดหัวสะกดจิตที่นี่..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                      <Zap size={14} className="text-pink-500" /> Mutate CTA Button (TH)
                                    </label>
                                    <input 
                                      value={strikeInput.cta}
                                      onChange={(e) => setStrikeInput({...strikeInput, cta: e.target.value})}
                                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-bold outline-none focus:border-pink-500 shadow-inner" 
                                      placeholder="ข้อความบนปุ่ม..."
                                    />
                                </div>
                            </div>

                            <button 
                              onClick={executeGlobalStrike}
                              disabled={isAiLoading || !sbClient}
                              className={`w-full py-7 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-3xl transition-all flex items-center justify-center gap-4 ${isAiLoading ? 'bg-slate-400' : 'bg-[#0D1F3C] text-white hover:scale-[1.02] active:scale-95'}`}
                            >
                                {isAiLoading ? <RefreshCw className="animate-spin" size={20}/> : <Zap size={20} className="fill-white"/>}
                                {isAiLoading ? 'Analyzing Strike...' : 'Execute Global Strike'}
                            </button>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex gap-4">
                           <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                           <p className="text-[11px] font-bold text-amber-800 italic leading-relaxed">
                             "คำเตือน: การ Execute Strike จะเปลี่ยนหน้าตาเว็บไซต์ www.btc-consultant.com ทันทีสำหรับผู้ใช้งานทุกคนที่กำลังออนไลน์"
                           </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 h-full flex flex-col relative overflow-hidden">
                           <div className="absolute -bottom-20 -right-20 opacity-5 pointer-events-none"><Brain size={350} /></div>
                           
                           <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                              <div className="flex items-center gap-3">
                                 <Brain size={24} className="text-blue-600"/>
                                 <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 italic">AI Strategic Insight Node</h3>
                              </div>
                              {aiAnalysis && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Analysis Complete</span>}
                           </div>

                           <div className="flex-1 relative z-10">
                              {isAiLoading ? (
                                <div className="h-full flex flex-col items-center justify-center gap-6 py-20">
                                   <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                   <div className="text-center space-y-2">
                                      <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 animate-pulse">Decoding Psychology...</p>
                                      <p className="text-[10px] font-bold text-slate-400 italic">"Gemini is analyzing the imprinting potential of your message"</p>
                                   </div>
                                </div>
                              ) : (
                                <div className="prose prose-slate max-w-none">
                                   {aiAnalysis ? (
                                      <div className="text-slate-700 leading-relaxed text-lg italic whitespace-pre-wrap animate-in fade-in duration-1000">
                                         {aiAnalysis}
                                      </div>
                                   ) : (
                                      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                                         <div className="p-8 bg-slate-50 rounded-full"><Sparkles size={60} className="text-slate-200" /></div>
                                         <div>
                                            <p className="text-xl font-black text-slate-300 italic uppercase tracking-tighter">Awaiting Strike Command</p>
                                            <p className="text-sm font-medium text-slate-400 italic max-w-xs mx-auto mt-2">วิเคราะห์ความฉลาดเชิงกลยุทธ์ของคุณได้ทันทีเมื่อเริ่มการ Strike</p>
                                         </div>
                                      </div>
                                   )}
                                </div>
                              )}
                           </div>
                        </div>
                    </div>
                </div>
              </section>
            )}

            {/* VIEW: DOMAINS */}
            {activeTab === 'domains' && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                 <div className="border-b border-slate-200 pb-8">
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic uppercase">Domain Sovereignty</h2>
                    <p className="text-slate-500 text-sm font-medium mt-2 italic italic">"ตรวจสอบและจัดการโครงสร้างพื้นฐานของอาณาจักร BTC Consultant"</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DomainCard name="master.btc-consultant.com" status="CONNECTED" target="vercel-node-01" icon={<ShieldCheck />} />
                    <DomainCard name="api.btc-consultant.com" status="ACTIVE" target="supabase-cluster-04" icon={<Database />} />
                    <DomainCard name="www.btc-consultant.com" status="MUTATED" target="landing-edge-worker" icon={<Globe />} color="text-pink-500" />
                    <DomainCard name="9001.btc-consultant.com" status="PENDING" target="saas-iso-instance" icon={<Layers />} color="text-amber-500" />
                    <DomainCard name="ide.btc-consultant.com" status="INACTIVE" target="neural-ide-engine" icon={<Terminal />} color="text-slate-300" />
                 </div>
              </section>
            )}

            {/* VIEW: AI LAB */}
            {activeTab === 'ai-lab' && (
               <section className="animate-in fade-in duration-700 space-y-10">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">AI Strategy Lab</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="bg-slate-900 text-white p-12 rounded-[4rem] space-y-8 relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><Star size={300} /></div>
                        <h3 className="text-3xl font-black italic leading-none">Persona <br/>Analysis Engine</h3>
                        <p className="text-slate-400 text-sm leading-relaxed italic">"จำลองสถานการณ์ความพึงพอใจของกลุ่มลูกค้าเป้าหมาย (CEO, HR, Factory Manager) ต่อข้อเสนอปัจจุบันของคุณ"</p>
                        <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition">Launch Simulation</button>
                     </div>
                     <div className="bg-blue-600 text-white p-12 rounded-[4rem] space-y-8 relative overflow-hidden">
                        <h3 className="text-3xl font-black italic leading-none">Sovereign <br/>Copywriter</h3>
                        <p className="text-blue-100 text-sm leading-relaxed italic">"สร้างชุดข้อความสะกดจิต (Embedded Commands) สำหรับ ISO 9001, 14001 และ 22301 อัตโนมัติ"</p>
                        <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition">Generate Hooks</button>
                     </div>
                  </div>
               </section>
            )}
        </div>
      </main>

      {/* GLOBAL TOAST */}
      <div id="master-toast" className="hidden fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#0D1F3C] text-white px-12 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-3xl z-[1000] border border-white/10 animate-in slide-in-from-bottom-10"></div>
    </div>
  );
};

// --- [UI COMPONENTS] ---

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
