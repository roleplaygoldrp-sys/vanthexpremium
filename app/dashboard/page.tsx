'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [form, setForm] = useState({
    campaignName: '',
    cpm: '',
    ctr: '',
    cpc: '',
    cpa: '',
    roas: '',
    offerNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (data.success) {
      setResult(data.data);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Vanthex IA
          </h1>
          <p className="text-slate-400">Diagnóstico Inteligente de Meta Ads e Escala de Ofertas</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">Métricas da Campanha</h2>
            
            <input 
              type="text" 
              placeholder="Nome da Campanha/Produto" 
              className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700" 
              onChange={e => setForm({...form, campaignName: e.target.value})}
              required 
            />

            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.01" placeholder="CPM (R$)" className="bg-slate-800 p-3 rounded-lg border border-slate-700" onChange={e => setForm({...form, cpm: e.target.value})} />
              <input type="number" step="0.01" placeholder="CTR (%)" className="bg-slate-800 p-3 rounded-lg border border-slate-700" onChange={e => setForm({...form, ctr: e.target.value})} />
              <input type="number" step="0.01" placeholder="CPC (R$)" className="bg-slate-800 p-3 rounded-lg border border-slate-700" onChange={e => setForm({...form, cpc: e.target.value})} />
              <input type="number" step="0.01" placeholder="CPA (R$)" className="bg-slate-800 p-3 rounded-lg border border-slate-700" onChange={e => setForm({...form, cpa: e.target.value})} />
            </div>

            <input type="number" step="0.01" placeholder="ROAS Atual" className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700" onChange={e => setForm({...form, roas: e.target.value})} />
            <textarea placeholder="Observações da Oferta / VSL / Página" className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700" rows={3} onChange={e => setForm({...form, offerNotes: e.target.value})} />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Analisando Métricas...' : 'Gerar Diagnóstico Vanthex'}
            </button>
          </form>

          {/* Resultado */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-semibold">Análise & Plano de Ação</h2>
            {!result && <p className="text-slate-500 text-sm">Insira as métricas ao lado para receber a análise estratégica.</p>}
            
            {result && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Status da Campanha:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    result.status === 'Saudável' ? 'bg-green-500/20 text-green-400' : 
                    result.status === 'Atenção' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {result.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-300">Gargalo Principal:</h3>
                  <p className="text-sm text-slate-400 mt-1">{result.bottleneck}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-300">Plano de Ação Recomendado:</h3>
                  <ul className="list-disc list-inside text-sm text-slate-400 mt-1 space-y-1">
                    {result.actionPlan?.map((action: string, i: number) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-300">Dica de Copy & Criativos:</h3>
                  <p className="text-sm text-slate-400 mt-1">{result.copyAdvice}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}