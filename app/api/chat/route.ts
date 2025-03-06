import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Log the incoming request for debugging
    console.log('Incoming request body:', JSON.stringify(body, null, 2));

    // Check if required environment variables are present
    if (!process.env.NILAI_API_URL || !process.env.NILAI_API_KEY) {
      console.error(
        'Missing environment variables: NILAI_API_URL or NILAI_API_KEY'
      );
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Forward the request to the external API
    const response = await fetch(
      `${process.env.NILAI_API_URL}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NILAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: body.model || 'meta-llama/Llama-3.1-8B-Instruct',
          messages: body.messages,
          temperature: body.temperature || 0.2,
          top_p: body.top_p || 0.95,
          max_tokens: body.max_tokens || 2048,
          stream: body.stream || false,
          nilrag: body.nilrag || {},
        }),
      }
    );

    // Add more detailed error logging
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Status:', response.status);
      console.error('API Error Headers:', Object.fromEntries(response.headers));
      console.error('API Error Body:', errorText);
      return NextResponse.json(
        {
          error: `External API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Log the response for debugging
    console.log('External API response:', JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        //@ts-ignore
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
