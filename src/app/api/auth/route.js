import { NextResponse } from 'next/server';

async function handler({ action }) {
  if (action === "logout") {
    return { success: true, message: "Logged out successfully" };
  } else if (action === "check") {
    return { success: true, message: "Authentication check endpoint" };
  }
  return { success: false, message: "Invalid action" };
}
export async function POST(request) {
  const result = await handler(await request.json());
  return NextResponse.json(result);
}