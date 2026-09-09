import { REPORT_FORMATS } from '../constants/statistics';

export const buildPerformanceReport = ({ title, data, type = REPORT_FORMATS.JSON }) => ({
  id: `report_${Date.now()}`,
  title,
  type,
  createdAt: new Date().toISOString(),
  data,
});
