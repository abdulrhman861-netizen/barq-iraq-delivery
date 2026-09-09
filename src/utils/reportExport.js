import { REPORT_FORMATS } from '../constants/statistics';

export const exportReport = ({ report, format = REPORT_FORMATS.JSON }) => ({
  format,
  content: JSON.stringify(report || {}, null, 2),
  exportedAt: new Date().toISOString(),
});
