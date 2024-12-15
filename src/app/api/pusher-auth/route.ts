import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const presenceData = {
    user_id: session.user.id,
    user_data: { user_id: session.user.id },
  };

  const pusherAuth = pusherServer.authorizeChannel(
    socketId,
    channelName,
    presenceData,
  );

  return new Response(JSON.stringify(pusherAuth));
}
