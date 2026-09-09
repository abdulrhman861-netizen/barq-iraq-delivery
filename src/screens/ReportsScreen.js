import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import ReportGenerator from '../components/ReportGenerator';
import { buildPerformanceReport } from '../services/reportService';
import { exportReport } from '../utils/reportExport';
import { REPORT_FORMATS } from '../constants/statistics';

const ReportsScreen = () => {
  const [lastReport, setLastReport] = useState(null);

  const generateReport = () => {
    const report = buildPerformanceReport({
      title: 'تقرير الأداء',
      data: { completionRate: 92, customerSatisfaction: 4.6, roi: 18.2 },
      type: REPORT_FORMATS.PDF,
    });

    const exported = exportReport({ report, format: REPORT_FORMATS.PDF });
    setLastReport(report);
    Alert.alert('تم', `نوع الملف: ${exported.format}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>تقارير الأداء</Text>
      <ReportGenerator onGenerate={generateReport} />
      {lastReport && (
        <Text style={{ textAlign: 'right' }}>آخر تقرير: {lastReport.title}</Text>
      )}
    </View>
  );
};

export default ReportsScreen;
