import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const messagesFilePath = path.join(process.cwd(), 'src', 'data', 'messages.json');

async function getMessages() {
  try {
    const data = await fs.promises.readFile(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // Return empty array if file doesn't exist
    }
    throw error;
  }
}

async function saveMessages(messages) {
  await fs.promises.writeFile(messagesFilePath, JSON.stringify(messages, null, 2));
}

export async function GET() {
  const messages = await getMessages();
  return NextResponse.json(messages);
}

export async function POST(request) {
  const newMessage = await request.json();
  const messages = await getMessages();

  const messageWithTimestamp = {
    ...newMessage,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
  };

  messages.push(messageWithTimestamp);
  await saveMessages(messages);

  return NextResponse.json({ success: true, message: messageWithTimestamp });
} 