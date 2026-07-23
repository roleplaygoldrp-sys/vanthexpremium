import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaignName, cpm, ctr, cpc, cpa, roas, offerNotes, userId } = body;

    const systemPrompt = `
      Você é a Vanthex IA, uma inteligência artificial especialista em tráfego pago (Meta Ads) e otimização de ofertas para empresas do digital.
      Sua missão é responder com um JSON estrito contendo:
      1. "status": "Saudável" | "Atenção" | "Crítico"
      2. "bottleneck": Descrição do principal gargalo identificado
      3. "actionPlan": Array com exatamente 3 ações práticas e imediatas.
      4. "copyAdvice": Recomendação específica para criativo ou página de vendas.
    `;

    const userPrompt = `
      Analise esta campanha:
      - Nome: ${campaignName}
      - CPM: R$ ${cpm}
      - CTR: ${ctr}%
      - CPC: R$ ${cpc}
      - CPA: R$ ${cpa}
      - ROAS: ${roas}x
      - Detalhes da Oferta/Página: ${offerNotes}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const aiResult = JSON.parse(response.choices[0].message.content || '{}');

    // Salvar no Supabase se o userId for enviado
    if (userId) {
      await supabase.from('analyses').insert({
        user_id: userId,
        campaign_name: campaignName,
        cpm, ctr, cpc, cpa, roas,
        offer_notes: offerNotes,
        ai_diagnosis: aiResult
      });
    }

    return NextResponse.json({ success: true, data: aiResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao processar análise da Vanthex' }, { status: 500 });
  }
}