import { FIREBASE_PATHS } from '../constants/firebase';
import { readData, writeData } from './firebase';

const path = `${FIREBASE_PATHS.AUDIT_LOGS || 'audit_logs'}`;

export const createAuditLog = async ({ userId, eventType, metadata = {} }) => {
  const id = `${Date.now()}`;
  const payload = {
    id,
    userId,
    eventType,
    metadata,
    createdAt: new Date().toISOString(),
  };

  await writeData(`${path}/${id}`, payload);
  return payload;
};

export const getAuditLogs = async ({ userId, limit = 50 } = {}) => {
  const data = (await readData(path)) || {};

  return Object.keys(data)
    .map((id) => ({ id, ...data[id] }))
    .filter((log) => (userId ? log.userId === userId : true))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};
