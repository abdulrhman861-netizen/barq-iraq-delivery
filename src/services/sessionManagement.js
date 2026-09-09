import { issueToken, revokeToken } from './tokenService';

const sessionsByUser = new Map();

export const createSession = ({ userId, deviceId }) => {
  const token = issueToken({ userId });
  const session = {
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    deviceId,
    token,
    createdAt: new Date().toISOString(),
  };

  const sessions = sessionsByUser.get(userId) || [];
  sessionsByUser.set(userId, [session, ...sessions]);
  return session;
};

export const getSessions = (userId) => sessionsByUser.get(userId) || [];

export const logoutSession = ({ userId, sessionId }) => {
  const sessions = getSessions(userId);
  const target = sessions.find((session) => session.id === sessionId);
  if (target?.token) revokeToken(target.token);
  sessionsByUser.set(userId, sessions.filter((session) => session.id !== sessionId));
  return true;
};

export const logoutAllSessions = (userId) => {
  const sessions = getSessions(userId);
  sessions.forEach((session) => revokeToken(session.token));
  sessionsByUser.set(userId, []);
  return true;
};
