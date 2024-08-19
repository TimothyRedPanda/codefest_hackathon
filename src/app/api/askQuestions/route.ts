// src/app/api/askQuestion/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { question } = await req.json();

        const url = "https://api.openai.com/v1/chat/completions";
        const headers = {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHAT_API}`,
            "Content-Type": "application/json",
        };

        const body = {
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are Powering Futures Advisor, a career advisor for 16-18 year olds in Scotland.",
                },
                {
                    role: "user",
                    content: question,
                },
            ],
        };

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching chat completion: HTTP error! status: ${response.status}, body: ${errorText}`);
            return NextResponse.json({ message: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}