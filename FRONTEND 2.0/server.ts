import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET || "moneyforge-secret"));

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || `${process.env.APP_URL}/auth/callback`
);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/userinfo.email",
];

// OAuth Routes
app.get("/api/auth/google/url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.json({ url });
});

app.get(["/auth/callback", "/auth/google/callback"], async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    // In a real app, store this in a database. For now, we'll use a cookie.
    res.cookie("gmail_tokens", JSON.stringify(tokens), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.send(`
      <html>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb;">
          <div style="text-align: center; padding: 2rem; background: white; border-radius: 1rem; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <h2 style="color: #111827; margin-bottom: 0.5rem;">Authentication Successful</h2>
            <p style="color: #6b7280;">This window will close automatically.</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GMAIL_AUTH_SUCCESS' }, '*');
                setTimeout(() => window.close(), 1000);
              } else {
                window.location.href = '/';
              }
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/auth/google/status", (req, res) => {
  const tokens = req.cookies.gmail_tokens;
  res.json({ connected: !!tokens });
});

app.post("/api/auth/google/logout", (req, res) => {
  res.clearCookie("gmail_tokens");
  res.json({ success: true });
});

// Ad Platforms OAuth Routes
interface AdPlatformConfig {
  scopes: string[];
  cookie: string;
  authUrl?: string;
  tokenUrl?: string;
}

const AD_PLATFORMS: Record<string, AdPlatformConfig> = {
  google_ads: {
    scopes: ["https://www.googleapis.com/auth/adwords"],
    cookie: "google_ads_tokens"
  },
  meta_ads: {
    authUrl: "https://www.facebook.com/v12.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v12.0/oauth/access_token",
    scopes: ["ads_management", "ads_read"],
    cookie: "meta_ads_tokens"
  },
  tiktok_ads: {
    authUrl: "https://business-api.tiktok.com/portal/auth",
    tokenUrl: "https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/",
    scopes: ["ads.manage", "ads.read"],
    cookie: "tiktok_ads_tokens"
  },
  canva: {
    authUrl: "https://www.canva.com/api/oauth/authorize",
    tokenUrl: "https://www.canva.com/api/oauth/token",
    scopes: ["design:content:read", "design:content:write"],
    cookie: "canva_tokens"
  }
};

app.get("/api/auth/ads/status", (req, res) => {
  const status: Record<string, boolean> = {};
  Object.entries(AD_PLATFORMS).forEach(([id, config]) => {
    status[id] = !!req.cookies[config.cookie];
  });
  res.json(status);
});

app.get("/api/auth/ads/:platform/url", (req, res) => {
  const { platform } = req.params;
  const config = AD_PLATFORMS[platform as keyof typeof AD_PLATFORMS];
  
  if (!config) return res.status(400).json({ error: "Invalid platform" });

  if (platform === "google_ads") {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: config.scopes,
      prompt: "consent",
      state: "google_ads"
    });
    return res.json({ url });
  }

  // Generic OAuth for Meta/TikTok
  const clientId = process.env[`${platform.toUpperCase()}_CLIENT_ID`];
  const redirectUri = `${process.env.APP_URL}/api/auth/ads/${platform}/callback`;
  
  let url = "";
  if (platform === "meta_ads") {
    url = `${config.authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${config.scopes?.join(",")}&response_type=code`;
  } else if (platform === "tiktok_ads") {
    url = `${config.authUrl}?app_id=${clientId}&redirect_uri=${redirectUri}&state=${platform}`;
  } else if (platform === "canva") {
    url = `${config.authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${config.scopes?.join(" ")}&response_type=code&state=${platform}`;
  }

  res.json({ url });
});

app.get("/api/auth/ads/:platform/callback", async (req, res) => {
  const { platform } = req.params;
  const { code } = req.query;
  const config = AD_PLATFORMS[platform as keyof typeof AD_PLATFORMS];

  if (!config || !code) return res.status(400).send("Invalid request");

  try {
    let tokens: any = {};
    if (platform === "google_ads") {
      const { tokens: googleTokens } = await oauth2Client.getToken(code as string);
      tokens = googleTokens;
    } else {
      // Mocking token exchange for Meta/TikTok/Canva as we don't have real credentials
      // In a real app, you'd fetch tokens from config.tokenUrl
      tokens = { access_token: "mock_token_" + Math.random().toString(36).substr(2) };
    }

    res.cookie(config.cookie, JSON.stringify(tokens), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.send(`
      <html>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb;">
          <div style="text-align: center; padding: 2rem; background: white; border-radius: 1rem; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <h2 style="color: #111827; margin-bottom: 0.5rem;">${platform.replace('_', ' ')} Connected</h2>
            <p style="color: #6b7280;">This window will close automatically.</p>
            <script>
              if (window.opener) {
                const type = '${platform}' === 'canva' ? 'CANVA_AUTH_SUCCESS' : 'AD_AUTH_SUCCESS';
                window.opener.postMessage({ type, platform: '${platform}' }, '*');
                setTimeout(() => window.close(), 1000);
              } else {
                window.location.href = '/';
              }
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(`Error connecting to ${platform}:`, error);
    res.status(500).send("Authentication failed");
  }
});

app.post("/api/auth/ads/:platform/logout", (req, res) => {
  const { platform } = req.params;
  const config = AD_PLATFORMS[platform as keyof typeof AD_PLATFORMS];
  if (config) {
    res.clearCookie(config.cookie);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid platform" });
  }
});

// Gmail API Routes
app.post("/api/gmail/draft", async (req, res) => {
  const tokensStr = req.cookies.gmail_tokens;
  if (!tokensStr) return res.status(401).json({ error: "Not connected to Gmail" });

  const { recipient, subject, body } = req.body;
  
  try {
    const tokens = JSON.parse(tokensStr);
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: client });

    // Proper MIME message formatting
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${recipient}`,
      `Subject: ${utf8Subject}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      body,
    ];
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          raw: encodedMessage,
        },
      },
    });

    res.json({ success: true, draftId: response.data.id, message: "Draft created successfully" });
  } catch (error) {
    console.error("Error creating draft:", error);
    res.status(500).json({ error: "Failed to create draft" });
  }
});

app.post("/api/gmail/sequence", async (req, res) => {
  const tokensStr = req.cookies.gmail_tokens;
  if (!tokensStr) return res.status(401).json({ error: "Not connected to Gmail" });

  const { recipient, steps } = req.body;
  
  try {
    const tokens = JSON.parse(tokensStr);
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: client });

    const results = [];
    for (const step of steps) {
      const utf8Subject = `=?utf-8?B?${Buffer.from(step.subject).toString('base64')}?=`;
      const messageParts = [
        `To: ${recipient}`,
        `Subject: ${utf8Subject} (Day ${step.day})`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        step.body,
      ];
      const message = messageParts.join('\n');

      const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const response = await gmail.users.drafts.create({
        userId: "me",
        requestBody: {
          message: {
            raw: encodedMessage,
          },
        },
      });
      results.push(response.data.id);
    }

    res.json({ success: true, draftIds: results, message: `${steps.length} drafts created successfully` });
  } catch (error) {
    console.error("Error creating sequence:", error);
    res.status(500).json({ error: "Failed to create sequence" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
