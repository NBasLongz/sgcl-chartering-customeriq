import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'SGCL Chartering Lead Qualification System',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: {
      dataMasking: true,
      contextualEngine: true,
      geminiFlashSupported: Boolean(process.env.GEMINI_API_KEY)
    }
  });
}
