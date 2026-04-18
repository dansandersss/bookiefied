import { NextRequest, NextResponse } from 'next/server';
import { searchBookSegments } from '@/lib/actions/book.actions';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Vapi Tool Call received:', JSON.stringify(body, null, 2));

        const message = body.message;
        if (!message || message.type !== 'tool-calls') {
            return NextResponse.json({ error: 'Invalid Vapi message type' }, { status: 400 });
        }

        const toolCall = message.toolCalls?.find((tc: any) => tc.function.name === 'search_book' || tc.function.name === 'search-book' || tc.function.name === 'searchbook');

        if (!toolCall) {
            return NextResponse.json({ error: 'Tool call search_book not found' }, { status: 400 });
        }

        const { bookId, query } = toolCall.function.arguments;

        if (!bookId || !query) {
            return NextResponse.json({ error: 'Missing bookId or query parameter' }, { status: 400 });
        }

        const result = await searchBookSegments(bookId, query, 3);

        if (!result.success || !result.data || result.data.length === 0) {
            return NextResponse.json({
                results: [
                    {
                        toolCallId: toolCall.id,
                        result: "no information found about this topic"
                    }
                ]
            });
        }

        const combinedContent = result.data
            .map((segment: any) => segment.content)
            .join('\n\n');

        return NextResponse.json({
            results: [
                {
                    toolCallId: toolCall.id,
                    result: combinedContent
                }
            ]
        });

    } catch (error) {
        console.error('Error in search-book API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
