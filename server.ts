import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { User, RoomConfig, Participant, Message, SessionState, ClientMessage, ServerMessage } from "./src/types.js";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || "STUDYCTRL_CYBER_SECRET_KEY_2026";

// Path definitions
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_PATH = path.join(DATA_DIR, "users.json");
const SESSIONS_PATH = path.join(DATA_DIR, "sessions.json");

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_PATH)) {
  fs.writeFileSync(USERS_PATH, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SESSIONS_PATH)) {
  fs.writeFileSync(SESSIONS_PATH, JSON.stringify({}, null, 2));
}

// DB helper functions
function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeUsers(users: User[]) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

function readSessions(): Record<string, SessionState> {
  try {
    const data = fs.readFileSync(SESSIONS_PATH, "utf-8");
    const sessions = JSON.parse(data);
    if (!sessions["NEXT_TOPPERS"]) {
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year duration
      sessions["NEXT_TOPPERS"] = {
        config: {
          code: "NEXT_TOPPERS",
          durationDays: 365,
          createdAt: createdAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
          hostUserId: "system-admin",
          hostName: "NEXT TOPPERS MASTER",
          pomodoroWorkMinutes: 25,
          pomodoroBreakMinutes: 5,
        },
        participants: {},
        messages: [],
        materials: [],
        tasks: []
      };
      fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2));
    }
    return sessions;
  } catch (err) {
    const sessions: Record<string, SessionState> = {};
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 365 * 24 * 60 * 60 * 1000);
    sessions["NEXT_TOPPERS"] = {
      config: {
        code: "NEXT_TOPPERS",
        durationDays: 365,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        hostUserId: "system-admin",
        hostName: "NEXT TOPPERS MASTER",
        pomodoroWorkMinutes: 25,
        pomodoroBreakMinutes: 5,
      },
      participants: {},
      messages: [],
      materials: [],
      tasks: []
    };
    try {
      fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2));
    } catch (_) {}
    return sessions;
  }
}

function writeSessions(sessions: Record<string, SessionState>) {
  fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2));
}

// Express parsing
app.use(express.json({ limit: "50mb" }));

// Auth Middlewares
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
}

// REST Endpoints
// Auth registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password, securityQuestion, securityAnswer } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const trimmedUsername = username.trim().toLowerCase();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      return res.status(400).json({ error: "Username must be between 3 and 20 characters" });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return res.status(400).json({ error: "Username can only contain letters, numbers, and underscores" });
    }

    let trimmedEmail = email ? email.trim().toLowerCase() : "";
    if (!trimmedEmail) {
      trimmedEmail = `${trimmedUsername}@studyctrl.local`;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ error: "Invalid email address format" });
      }
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const users = readUsers();
    const existing = users.find((u) => u.username.toLowerCase() === trimmedUsername);
    if (existing) {
      return res.status(400).json({ error: "Username is already occupied in the grid" });
    }

    const existingEmail = users.find((u) => u.email && u.email.toLowerCase() === trimmedEmail);
    if (existingEmail) {
      return res.status(400).json({ error: "Email address is already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const securityAnswerValue = securityAnswer ? securityAnswer.trim().toLowerCase() : "";
    const securityAnswerHash = await bcrypt.hash(securityAnswerValue, 10);

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      username, // Keep casing for display
      email: trimmedEmail,
      passwordHash,
      securityQuestion: securityQuestion || "",
      securityAnswerHash,
      dailyStats: {},
      sessionHistory: [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: "30d" });

    return res.status(201).json({
      token,
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Registry interface failed" });
  }
});

// Auth login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const users = readUsers();
    const user = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ error: "Invalid handle or credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid handle or credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });

    return res.json({
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Login protocol failure" });
  }
});

// Password recovery reset
app.post("/api/auth/reset", async (req, res) => {
  try {
    const { username, securityAnswer, newPassword } = req.body;

    if (!username || !securityAnswer || !newPassword) {
      return res.status(400).json({ error: "Incomplete verification block" });
    }

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.username.toLowerCase() === username.trim().toLowerCase());

    if (userIndex === -1) {
      return res.status(404).json({ error: "Username not registered in system" });
    }

    const user = users[userIndex];
    const match = await bcrypt.compare(securityAnswer.trim().toLowerCase(), user.securityAnswerHash);
    if (!match) {
      return res.status(400).json({ error: "Security validation hash does not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    users[userIndex].passwordHash = newHash;

    writeUsers(users);

    return res.json({ message: "Password override successful. Re-routing to login." });
  } catch (err : any) {
    console.error(err);
    return res.status(500).json({ error: "Password override protocol error" });
  }
});

// Fetch security question for a user prior to reset
app.get("/api/auth/question/:username", (req, res) => {
  try {
    const users = readUsers();
    const user = users.find((u) => u.username.toLowerCase() === req.params.username.trim().toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "Username not registered" });
    }
    return res.json({ securityQuestion: user.securityQuestion });
  } catch (err) {
    return res.status(500).json({ error: "Failed to read database" });
  }
});

// Fetch logged-in user profile
app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User identity wiped" });
  }
  return res.json({ id: user.id, username: user.username, email: user.email });
});

// Request password reset code via username flow
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.username.toLowerCase() === username.trim().toLowerCase());

    if (userIndex === -1) {
      return res.status(404).json({ error: "No account registered with this username" });
    }

    const user = users[userIndex];
    // Generate secure 6-digit numeric verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store verification code with 15 minutes expiration
    user.resetCode = verificationCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000;

    writeUsers(users);

    // Simulate sending recovery notice
    console.log(`=========================================`);
    console.log(`[RECOVERY SIMULATOR] Dispatching Reset Notice`);
    console.log(`Username: ${user.username}`);
    console.log(`Verification Code: ${verificationCode}`);
    console.log(`=========================================`);

    // Return success. We include a debugCode for seamless local preview verification
    return res.json({
      message: "Verification code sent successfully.",
      debugCode: verificationCode, // Returned for sandbox preview simulation
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Failed to dispatch verification code" });
  }
});

// Securely override password using verification code
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { username, code, newPassword } = req.body;

    if (!username || !code || !newPassword) {
      return res.status(400).json({ error: "Username, verification code, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.username.toLowerCase() === username.trim().toLowerCase());

    if (userIndex === -1) {
      return res.status(404).json({ error: "No account registered with this username" });
    }

    const user = users[userIndex];

    // Verify verification code validity
    if (!user.resetCode || user.resetCode !== code.trim()) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Verify code expiration
    if (!user.resetCodeExpires || user.resetCodeExpires < Date.now()) {
      return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
    }

    // Hash new password securely
    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;

    // Clear reset credentials
    delete user.resetCode;
    delete user.resetCodeExpires;

    writeUsers(users);

    return res.json({ message: "Password reset successful. Redirecting to login." });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Secure password reset process failed" });
  }
});

// Fetch authenticated user's session history list
app.get("/api/users/sessions", authenticateToken, (req: any, res) => {
  try {
    const users = readUsers();
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User identity not found" });
    }
    return res.json({ sessionHistory: user.sessionHistory || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to read session logs" });
  }
});

// Toggle session history entry archiving
app.post("/api/users/sessions/:id/archive", authenticateToken, (req: any, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User identity not found" });
    }

    const user = users[userIndex];
    if (!user.sessionHistory) {
      user.sessionHistory = [];
    }

    const entryIndex = user.sessionHistory.findIndex((h) => h.id === id);
    if (entryIndex === -1) {
      return res.status(404).json({ error: "Session history entry not found" });
    }

    user.sessionHistory[entryIndex].isArchived = isArchived !== undefined ? isArchived : !user.sessionHistory[entryIndex].isArchived;

    writeUsers(users);

    return res.json({ 
      message: user.sessionHistory[entryIndex].isArchived ? "Session archived successfully" : "Session unarchived successfully",
      entry: user.sessionHistory[entryIndex] 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to archive session logs" });
  }
});

// Delete session history entry
app.delete("/api/users/sessions/:id", authenticateToken, (req: any, res) => {
  try {
    const { id } = req.params;

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User identity not found" });
    }

    const user = users[userIndex];
    if (!user.sessionHistory) {
      user.sessionHistory = [];
    }

    const initialLength = user.sessionHistory.length;
    user.sessionHistory = user.sessionHistory.filter((h) => h.id !== id);

    if (user.sessionHistory.length === initialLength) {
      return res.status(404).json({ error: "Session history entry not found" });
    }

    writeUsers(users);

    return res.json({ message: "Session history entry deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete session history entry" });
  }
});

// Create study session
app.post("/api/sessions", authenticateToken, (req: any, res) => {
  try {
    const { code, durationDays, pomodoroWorkMinutes, pomodoroBreakMinutes } = req.body;

    if (!code || !durationDays) {
      return res.status(400).json({ error: "Invalid session configuration" });
    }

    const upperCode = code.trim().toUpperCase();
    if (upperCode.length !== 5 || !/^[A-Z]+$/.test(upperCode)) {
      return res.status(400).json({ error: "Room code must be exactly 5 alphabetic uppercase characters" });
    }

    const sessions = readSessions();
    if (sessions[upperCode]) {
      return res.status(400).json({ error: `Archive code ${upperCode} already has a running process` });
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const config: RoomConfig = {
      code: upperCode,
      durationDays: Number(durationDays),
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      hostUserId: req.user.id,
      hostName: req.user.username,
      pomodoroWorkMinutes: Number(pomodoroWorkMinutes) || 25,
      pomodoroBreakMinutes: Number(pomodoroBreakMinutes) || 5,
    };

    sessions[upperCode] = {
      config,
      participants: {},
      messages: [],
      materials: [],
      tasks: [],
    };

    writeSessions(sessions);

    return res.status(201).json(config);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to launch session room" });
  }
});

// Verify room code
app.get("/api/sessions/:code", authenticateToken, (req, res) => {
  const code = req.params.code.toUpperCase();
  const sessions = readSessions();
  if (!sessions[code]) {
    return res.status(404).json({ error: `Room ${code} is inactive or non-existent` });
  }

  // Check expiry
  const now = new Date();
  const expiresAt = new Date(sessions[code].config.expiresAt);
  if (now > expiresAt) {
    delete sessions[code];
    writeSessions(sessions);
    return res.status(410).json({ error: `Room ${code} process expired automatically` });
  }

  return res.json(sessions[code].config);
});

// Gemini AI Doubt Solver Endpoint
app.post("/api/gemini/doubt", authenticateToken, async (req: any, res) => {
  try {
    const { prompt, file } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Empty query. Please specify your doubt." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Gemini API key is missing on this server instance. Please register GEMINI_API_KEY as a secret." 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash"
    ];

    let response;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        console.log(`[Doubt Solver] Attempting to invoke Gemini model: ${model}`);
        if (file && file.data) {
          // Handle base64 cleanliness by stripping metadata prefix
          let rawBase64 = file.data;
          if (rawBase64.includes(";base64,")) {
            rawBase64 = rawBase64.split(";base64,").pop() || "";
          }

          const filePart = {
            inlineData: {
              mimeType: file.mimeType || "image/png",
              data: rawBase64,
            },
          };

          const textPart = {
            text: `You are an academic assistant. Solve the student's doubt with absolute precision and simple, clear explanations. Provide systematic step-by-step guidance, formulas, or logic where applicable. Question: ${prompt}`,
          };

          response = await ai.models.generateContent({
            model: model,
            contents: {
              parts: [filePart, textPart],
            },
          });
        } else {
          response = await ai.models.generateContent({
            model: model,
            contents: `You are an academic assistant. Solve the student's doubt with absolute precision and simple, clear explanations. Provide systematic step-by-step guidance, formulas, or logic where applicable. Question: ${prompt}`,
          });
        }

        if (response) {
          console.log(`[Doubt Solver] Successfully generated content using model: ${model}`);
          lastError = null;
          break;
        }
      } catch (err: any) {
        console.warn(`[Doubt Solver] Model ${model} failed:`, err.message || err);
        lastError = err;
      }
    }

    if (lastError || !response) {
      throw new Error(lastError ? (lastError.message || JSON.stringify(lastError)) : "Could not generate content from any available Gemini models.");
    }

    const responseText = response.text || "No response generated by the AI assistant.";
    return res.json({ text: responseText });

  } catch (err: any) {
    console.error("Gemini Doubt Solver Error:", err);
    return res.status(500).json({ 
      error: `Doubt Solver engine failure: ${err?.message || err}` 
    });
  }
});

// Daily activity chart stats endpoint
app.get("/api/stats/daily_chart", authenticateToken, (req: any, res) => {
  try {
    const users = readUsers();
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Identity wiped" });
    }

    // Prepare last 7 days chart data
    const chartData = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const val = user.dailyStats[dateStr] || 0;
      // Readable localized day label (e.g. "Mon")
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      chartData.push({
        date: dateStr,
        label: dayLabel,
        minutes: Math.ceil(val / 60), // minutes focused
        seconds: val,
      });
    }

    // Prepare all-time history data
    const allDaysHistory = [];
    if (user.dailyStats) {
      const sortedDates = Object.keys(user.dailyStats).sort((a, b) => b.localeCompare(a)); // Descending order
      for (const dateStr of sortedDates) {
        const val = user.dailyStats[dateStr] || 0;
        if (val > 0) {
          try {
            const d = new Date(dateStr + "T12:00:00"); // Avoid timezone shift
            const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
            allDaysHistory.push({
              date: dateStr,
              label: dayLabel,
              minutes: Math.ceil(val / 60),
              seconds: val,
            });
          } catch (e) {
            allDaysHistory.push({
              date: dateStr,
              label: dateStr,
              minutes: Math.ceil(val / 60),
              seconds: val,
            });
          }
        }
      }
    }

    return res.json({ 
      dailyHistory: chartData,
      allDaysHistory: allDaysHistory 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to query stats" });
  }
});

// WebSocket Server Handlers
interface WSConnection {
  socket: WebSocket;
  userId: string;
  username: string;
  roomCode: string;
}

// In-Memory store for active WebSocket connections
const connections: Record<string, WSConnection[]> = {};

// Helper to broadcast to a room
function broadcastToRoom(roomCode: string, msg: ServerMessage) {
  const roomConns = connections[roomCode] || [];
  const payload = JSON.stringify(msg);
  roomConns.forEach((conn) => {
    if (conn.socket.readyState === WebSocket.OPEN) {
      conn.socket.send(payload);
    }
  });
}

// Helper to initialize/update a session in user's history with 0 focus seconds when joining
function updateSessionHistoryOnJoin(userId: string, roomCode: string) {
  try {
    const users = readUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (!user.sessionHistory) {
      user.sessionHistory = [];
    }

    const sessions = readSessions();
    const session = sessions[roomCode];
    if (!session) return;

    let historyEntry = user.sessionHistory.find((h) => h.roomCode === roomCode);
    if (!historyEntry) {
      historyEntry = {
        id: Math.random().toString(36).substring(2, 11),
        roomCode: roomCode,
        durationDays: session.config.durationDays,
        pomodoroWorkMinutes: session.config.pomodoroWorkMinutes || 25,
        pomodoroBreakMinutes: session.config.pomodoroBreakMinutes || 5,
        personalFocusSeconds: 0,
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        isArchived: false,
      };
      user.sessionHistory.push(historyEntry);
      writeUsers(users);
    }
  } catch (err) {
    console.error("Failed to update session history on join:", err);
  }
}

// Main logic to complete and save a focusing transaction when stopping or disconnecting
function stopAndSaveFocusTime(userId: string, roomCode: string) {
  const sessions = readSessions();
  const session = sessions[roomCode];
  if (!session) return;

  const part = session.participants[userId];
  if (!part || !part.isActive || !part.focusStartedAt) return;

  const start = new Date(part.focusStartedAt).getTime();
  const end = Date.now();
  const diffSec = Math.max(0, Math.floor((end - start) / 1000));

  // Update participant total
  part.totalSeconds += diffSec;
  part.isActive = false;
  part.focusStartedAt = null;

  // Persist to user's daily stats
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    const today = new Date().toISOString().split("T")[0];
    if (!user.dailyStats) user.dailyStats = {};
    user.dailyStats[today] = (user.dailyStats[today] || 0) + diffSec;

    // Update Session History inside the same write cycle
    if (!user.sessionHistory) {
      user.sessionHistory = [];
    }
    let historyEntry = user.sessionHistory.find((h) => h.roomCode === roomCode);
    if (!historyEntry) {
      historyEntry = {
        id: Math.random().toString(36).substring(2, 11),
        roomCode: roomCode,
        durationDays: session.config.durationDays,
        pomodoroWorkMinutes: session.config.pomodoroWorkMinutes || 25,
        pomodoroBreakMinutes: session.config.pomodoroBreakMinutes || 5,
        personalFocusSeconds: 0,
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        isArchived: false,
      };
      user.sessionHistory.push(historyEntry);
    }
    historyEntry.personalFocusSeconds += diffSec;
    historyEntry.lastActiveAt = new Date().toISOString();

    writeUsers(users);

    part.dailySeconds = user.dailyStats[today];
  }

  sessions[roomCode] = session;
  writeSessions(sessions);
}

// Periodic ticker: we don't send active tickers, clients compute locally. 
// However, we can write state periodic checks.

// Attach upgrades to Node Server
server.on("upgrade", (request, socket, head) => {
  try {
    const urlObj = new URL(request.url || "", `http://${request.headers.host}`);
    const token = urlObj.searchParams.get("token");

    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request, decoded);
      });
    });
  } catch (err) {
    socket.destroy();
  }
});

wss.on("connection", (ws: WebSocket, request, userDecoded: any) => {
  let joinedRoomCode = "";
  const userId = userDecoded.id;
  const username = userDecoded.username;

  ws.on("message", (msgString: string) => {
    try {
      const msg: ClientMessage = JSON.parse(msgString);

      if (msg.type === "join") {
        const { roomCode } = msg;
        const code = roomCode.toUpperCase();
        joinedRoomCode = code;

        const sessions = readSessions();
        const session = sessions[code];

        if (!session) {
          ws.send(JSON.stringify({ type: "error", message: "Room not found or expired" }));
          return;
        }

        // Add user connection to pool
        if (!connections[code]) {
          connections[code] = [];
        }

        // Check if there is already an active socket connection for this user in this room
        const existingIndex = connections[code].findIndex((c) => c.userId === userId);
        if (existingIndex !== -1) {
          // Tell previous connection they've been replaced
          const oldConn = connections[code][existingIndex];
          if (oldConn.socket.readyState === WebSocket.OPEN) {
            oldConn.socket.send(JSON.stringify({ type: "replaced" }));
            oldConn.socket.close();
          }
          connections[code].splice(existingIndex, 1);
        }

        connections[code].push({ socket: ws, userId, username, roomCode: code });

        // Build or fetch Participant
        const today = new Date().toISOString().split("T")[0];
        const users = readUsers();
        const user = users.find((u) => u.id === userId);
        const dailySec = user?.dailyStats?.[today] || 0;

        let part: Participant = session.participants[userId];
        if (!part) {
          // If no one is currently designated as active/offline admin, make this user the admin.
          // This allows testing roles easily since there's always an admin.
          const hasAdmin = Object.values(session.participants).some((p) => p.role === "admin");
          part = {
            id: userId,
            username: username,
            isActive: false,
            isOffline: false,
            totalSeconds: 0,
            focusStartedAt: null,
            dailySeconds: dailySec,
            role: hasAdmin ? "user" : "admin",
          };
        } else {
          part.isOffline = false;
          part.dailySeconds = dailySec;
          if (!part.role) {
            part.role = "user";
          }
        }

        session.participants[userId] = part;
        sessions[code] = session;
        writeSessions(sessions);

        updateSessionHistoryOnJoin(userId, code);

        // Send full state to joining user
        const participantList = Object.values(session.participants);
        ws.send(JSON.stringify({
          type: "joined",
          selfId: userId,
          config: session.config,
          participants: participantList,
          messages: session.messages,
          materials: session.materials || [],
          tasks: session.tasks || [],
        }));

        // Broadcast presence update to others
        broadcastToRoom(code, {
          type: "participants_update",
          participants: participantList,
        });
      }

      else if (msg.type === "ping") {
        const { timestamp } = msg;
        ws.send(JSON.stringify({ type: "pong", timestamp }));
      }

      else if (msg.type === "start_focus") {
        if (!joinedRoomCode) return;
        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (!session) return;

        const part = session.participants[userId];
        if (part && !part.isActive) {
          part.isActive = true;
          part.focusStartedAt = new Date().toISOString();
          part.isOffline = false;

          sessions[joinedRoomCode] = session;
          writeSessions(sessions);

          broadcastToRoom(joinedRoomCode, {
            type: "participants_update",
            participants: Object.values(session.participants),
          });
        }
      }

      else if (msg.type === "stop_focus") {
        if (!joinedRoomCode) return;
        stopAndSaveFocusTime(userId, joinedRoomCode);
        
        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (session) {
          broadcastToRoom(joinedRoomCode, {
            type: "participants_update",
            participants: Object.values(session.participants),
          });
        }
      }

      else if (msg.type === "chat_message") {
        if (!joinedRoomCode) return;
        const { text } = msg;
        if (!text || text.trim() === "") return;

        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (!session) return;

        const newMessage: Message = {
          id: Math.random().toString(36).substring(2, 11),
          userId,
          username,
          text,
          timestamp: new Date().toISOString(),
        };

        session.messages.push(newMessage);
        // Keep chat buffer under 150 messages
        if (session.messages.length > 150) {
          session.messages.shift();
        }

        sessions[joinedRoomCode] = session;
        writeSessions(sessions);

        broadcastToRoom(joinedRoomCode, {
          type: "chat_message_received",
          message: newMessage,
        });
      }

      else if (msg.type === "kick") {
        if (!joinedRoomCode) return;
        const { targetId } = msg;

        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (!session) return;

        // Verify sender is admin
        const senderPart = session.participants[userId];
        const isAdmin = senderPart && senderPart.role === "admin";
        if (!isAdmin) {
          ws.send(JSON.stringify({ type: "error", message: "Only an admin can remove participants" }));
          return;
        }

        if (targetId === userId) {
          ws.send(JSON.stringify({ type: "error", message: "Cannot eject yourself from the session" }));
          return;
        }

        // Save target focus time if active
        stopAndSaveFocusTime(targetId, joinedRoomCode);

        // Delete from participant records
        delete session.participants[targetId];
        sessions[joinedRoomCode] = session;
        writeSessions(sessions);

        // Send 'kicked' to the target socket, and terminate connection
        const roomConns = connections[joinedRoomCode] || [];
        const kickIndex = roomConns.findIndex((c) => c.userId === targetId);
        if (kickIndex !== -1) {
          const kt = roomConns[kickIndex];
          if (kt.socket.readyState === WebSocket.OPEN) {
            kt.socket.send(JSON.stringify({ type: "kicked" }));
            kt.socket.close();
          }
          roomConns.splice(kickIndex, 1);
        }

        // Broadcast updated lists
        broadcastToRoom(joinedRoomCode, {
          type: "participants_update",
          participants: Object.values(session.participants),
        });
      }

      else if (msg.type === "add_material") {
        if (!joinedRoomCode) return;
        const { title, url } = msg;
        if (!title || !url) return;

        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (!session) return;

        const senderPart = session.participants[userId];
        const canUpload = senderPart && (senderPart.role === "admin" || senderPart.role === "co-host");
        if (!canUpload) {
          ws.send(JSON.stringify({ type: "error", message: "Only Admin and Co-host roles can upload materials" }));
          return;
        }

        if (!session.materials) {
          session.materials = [];
        }

        const newMaterial = {
          id: Math.random().toString(36).substring(2, 11),
          title: title.trim(),
          url: url.trim(),
          uploadedBy: username,
          uploadedAt: new Date().toISOString()
        };

        session.materials.push(newMaterial);
        sessions[joinedRoomCode] = session;
        writeSessions(sessions);

        broadcastToRoom(joinedRoomCode, {
          type: "materials_update",
          materials: session.materials
        });
      }

      else if (msg.type === "delete_material") {
        if (!joinedRoomCode) return;
        const { materialId } = msg;

        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (!session || !session.materials) return;

        const senderPart = session.participants[userId];
        const canDelete = senderPart && (senderPart.role === "admin" || senderPart.role === "co-host");
        if (!canDelete) {
          ws.send(JSON.stringify({ type: "error", message: "Only Admin and Co-host codes can delete materials" }));
          return;
        }

        session.materials = session.materials.filter((m) => m.id !== materialId);
        sessions[joinedRoomCode] = session;
        writeSessions(sessions);

        broadcastToRoom(joinedRoomCode, {
          type: "materials_update",
          materials: session.materials
        });
      }

      else if (msg.type === "add_task") {
        if (!joinedRoomCode) return;
        const { subject, description, priority } = msg;
        if (!subject || !description) return;

        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (!session) return;

        const senderPart = session.participants[userId];
        const canUpload = senderPart && (senderPart.role === "admin" || senderPart.role === "co-host");
        if (!canUpload) {
          ws.send(JSON.stringify({ type: "error", message: "Only Admin and Co-host roles can upload tasks" }));
          return;
        }

        if (!session.tasks) {
          session.tasks = [];
        }

        const newTask = {
          id: Math.random().toString(36).substring(2, 11),
          subject: subject.trim(),
          description: description.trim(),
          priority: priority || "Medium",
          uploadedBy: username,
          uploadedAt: new Date().toISOString(),
          completedBy: []
        };

        session.tasks.push(newTask);
        sessions[joinedRoomCode] = session;
        writeSessions(sessions);

        broadcastToRoom(joinedRoomCode, {
          type: "tasks_update",
          tasks: session.tasks
        });
      }

      else if (msg.type === "delete_task") {
        if (!joinedRoomCode) return;
        const { taskId } = msg;

        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (!session || !session.tasks) return;

        const senderPart = session.participants[userId];
        const canDelete = senderPart && (senderPart.role === "admin" || senderPart.role === "co-host");
        if (!canDelete) {
          ws.send(JSON.stringify({ type: "error", message: "Only Admin and Co-host roles can delete tasks" }));
          return;
        }

        session.tasks = session.tasks.filter((t) => t.id !== taskId);
        sessions[joinedRoomCode] = session;
        writeSessions(sessions);

        broadcastToRoom(joinedRoomCode, {
          type: "tasks_update",
          tasks: session.tasks
        });
      }

      else if (msg.type === "toggle_task") {
        if (!joinedRoomCode) return;
        const { taskId } = msg;

        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (!session) return;

        if (!session.tasks) {
          session.tasks = [];
        }

        const task = session.tasks.find((t) => t.id === taskId);
        if (!task) return;

        if (!task.completedBy) {
          task.completedBy = [];
        }

        const idx = task.completedBy.indexOf(userId);
        if (idx > -1) {
          task.completedBy.splice(idx, 1);
        } else {
          task.completedBy.push(userId);
        }

        sessions[joinedRoomCode] = session;
        writeSessions(sessions);

        broadcastToRoom(joinedRoomCode, {
          type: "tasks_update",
          tasks: session.tasks
        });
      }

      else if (msg.type === "update_role") {
        if (!joinedRoomCode) return;
        const { targetId, role } = msg;

        const sessions = readSessions();
        const session = sessions[joinedRoomCode];
        if (!session) return;

        const senderPart = session.participants[userId];
        const isAdmin = senderPart && senderPart.role === "admin";
        
        if (!isAdmin) {
          ws.send(JSON.stringify({ type: "error", message: "Only Admin can modify participant roles" }));
          return;
        }

        const targetPart = session.participants[targetId];
        if (targetPart) {
          targetPart.role = role;
          sessions[joinedRoomCode] = session;
          writeSessions(sessions);

          broadcastToRoom(joinedRoomCode, {
            type: "participants_update",
            participants: Object.values(session.participants),
          });
        }
      }

    } catch (e) {
      console.error("WS error processing frame", e);
    }
  });

  ws.on("close", () => {
    if (!joinedRoomCode) return;

    // Clean up from memory connections
    const roomConns = connections[joinedRoomCode] || [];
    const idx = roomConns.findIndex((c) => c.socket === ws);
    if (idx !== -1) {
      roomConns.splice(idx, 1);
    }

    // Check if there is still an active connection for this user
    const hasOtherConnection = roomConns.some((c) => c.userId === userId && c.socket !== ws);

    if (!hasOtherConnection) {
      // Stop and save focus time immediately to prevent leakage of clock cycles
      stopAndSaveFocusTime(userId, joinedRoomCode);

      // Turn participant offline but keep record so progress is kept
      const sessions = readSessions();
      const session = sessions[joinedRoomCode];
      if (session) {
        const part = session.participants[userId];
        if (part) {
          part.isOffline = true;
          part.isActive = false;
          part.focusStartedAt = null;
          sessions[joinedRoomCode] = session;
          writeSessions(sessions);

          broadcastToRoom(joinedRoomCode, {
            type: "participants_update",
            participants: Object.values(session.participants),
          });
        }
      }
    }
  });
});

// Mounting Vite Developer Mode Server as a middleware fallback
async function mountViteMiddleware() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite loading developer environment...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind server listener
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`📡 STUDYCTRL cyber server online on port ${PORT}`);
  });
}

mountViteMiddleware();

// --- DAILY SCHEDULER & AUTO RESET ENGINE ---
let lastTaskResetDay = ""; // Tracks last day reset occurred (format: YYYY-MM-DD)

function checkAndResetDailyTasks() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  // Reset at exactly 06:45 AM local time
  if (currentHour === 6 && currentMinute === 45 && lastTaskResetDay !== currentDayStr) {
    lastTaskResetDay = currentDayStr;
    console.log(`☀️ [AUTO RESET ENGINE] 06:45 AM reached. Automatically resetting all completed study tasks...`);
    
    try {
      const sessions = readSessions();
      let updated = false;
      for (const code of Object.keys(sessions)) {
        const session = sessions[code];
        if (session && session.tasks && session.tasks.length > 0) {
          session.tasks.forEach((task) => {
            task.completedBy = []; // Reset completed list to empty (unchecked status)
          });
          updated = true;
          
          // Broadcast to any active participants connected in the room
          broadcastToRoom(code, {
            type: "tasks_update",
            tasks: session.tasks,
          });
          
          // Inject a professional system notice inside the chat logs
          const systemMsg = {
            id: `sys-reset-${Date.now()}`,
            userId: "system",
            username: "SYSTEM RESET",
            text: "☀️ 6:45 AM Daily Morning Reset: All co-working checklist tasks have been set to active. Good luck studying today!",
            timestamp: new Date().toISOString(),
          };
          session.messages.push(systemMsg);
          if (session.messages.length > 150) session.messages.shift();
          
          broadcastToRoom(code, {
            type: "chat_message_received",
            message: systemMsg,
          });
        }
      }
      
      if (updated) {
        writeSessions(sessions);
      }
    } catch (err) {
      console.error("Auto reset scheduler failed:", err);
    }
  }
}

// Check every 10 seconds for precise triggering
setInterval(checkAndResetDailyTasks, 10000);

export default server;
