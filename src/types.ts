/**
 * Shared Type Definitions for STUDYCTRL
 */

export interface DailyStats {
  [date: string]: number; // date string (YYYY-MM-DD) maps to total focus seconds
}

export interface UserSessionHistory {
  id: string;
  roomCode: string;
  durationDays: number;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  personalFocusSeconds: number;
  joinedAt: string;
  lastActiveAt: string;
  isArchived: boolean;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  passwordHash: string;
  securityQuestion: string;
  securityAnswerHash: string;
  dailyStats: DailyStats;
  sessionHistory?: UserSessionHistory[];
  resetCode?: string;
  resetCodeExpires?: number;
  createdAt: string;
}

export interface RoomConfig {
  code: string;
  durationDays: number;
  createdAt: string;
  expiresAt: string;
  hostUserId: string;
  hostName: string;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
}

export interface Participant {
  id: string; // userId
  username: string;
  isActive: boolean; // currently focusing
  isOffline: boolean; // WS disconnected but session slot saved
  totalSeconds: number; // focus seconds in current room session so far (saved on stop or periodic sync)
  focusStartedAt: string | null; // ISO string when current focus started, null if idle
  dailySeconds: number; // accumulated focus seconds for today across all rooms
  role: "admin" | "co-host" | "user"; // User role for administrative actions (e.g. PDF uploading)
}

export interface StudyMaterial {
  id: string;
  title: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  text: string; // can be regular text or base64 image data (starts with data:image/)
  timestamp: string; // ISO string
}

export interface SessionState {
  config: RoomConfig;
  participants: Record<string, Participant>;
  messages: Message[];
  materials: StudyMaterial[];
}

// WebSocket client-to-server messages
export type ClientMessage =
  | { type: "join"; token: string; roomCode: string }
  | { type: "start_focus" }
  | { type: "stop_focus" }
  | { type: "chat_message"; text: string }
  | { type: "kick"; targetId: string }
  | { type: "add_material"; title: string; url: string }
  | { type: "delete_material"; materialId: string }
  | { type: "update_role"; targetId: string; role: "admin" | "co-host" | "user" }
  | { type: "ping"; timestamp: number };

// WebSocket server-to-client messages
export type ServerMessage =
  | { type: "joined"; selfId: string; config: RoomConfig; participants: Participant[]; messages: Message[]; materials?: StudyMaterial[] }
  | { type: "participants_update"; participants: Participant[] }
  | { type: "chat_message_received"; message: Message }
  | { type: "kicked" }
  | { type: "replaced" }
  | { type: "materials_update"; materials: StudyMaterial[] }
  | { type: "error"; message: string }
  | { type: "pong"; timestamp: number };
