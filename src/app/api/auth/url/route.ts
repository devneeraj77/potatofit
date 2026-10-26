import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider") || "strava";
  
  // Use current origin or app url
  const origin =
    process.env.APP_URL ||
    req.headers.get("origin") ||
    req.nextUrl.origin ||
    "https://ais-dev-wb5guis2ij4l6kyz2436of-291116410510.asia-southeast1.run.app";

  const redirectUri = `${origin}/auth/callback`;

  let authUrl = "";

  if (provider === "strava") {
    const clientId = process.env.STRAVA_CLIENT_ID || "148290";
    authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&approval_prompt=auto&scope=read,activity:read_all`;
  } else if (provider === "googlefit") {
    const clientId = process.env.GOOGLE_FIT_CLIENT_ID || "uchitatvam-health-connect";
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(
      "https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.sleep.read"
    )}&access_type=offline&prompt=consent`;
  } else if (provider === "applehealth") {
    const clientId = process.env.APPLE_HEALTH_CLIENT_ID || "com.uchitatvam.health";
    authUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=name%20email&response_mode=form_post`;
  } else {
    authUrl = `${origin}/auth/callback?provider=${provider}&status=success`;
  }

  return NextResponse.json({ url: authUrl, redirectUri, provider });
}
