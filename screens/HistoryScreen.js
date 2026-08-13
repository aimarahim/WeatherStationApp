import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Download, Search, X, CheckCircle2, ChevronRight, Share2, FileSpreadsheet } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

import { theme } from '../theme';
import { mockHistoryLogs } from '../data/mockHistory';
import Card from '../components/Card';

export default function HistoryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogRow, setSelectedLogRow] = useState(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportingProgress, setExportingProgress] = useState(false);

  const filteredLogs = mockHistoryLogs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.time.toLowerCase().includes(query) ||
      log.temp.toLowerCase().includes(query) ||
      log.hum.toLowerCase().includes(query) ||
      log.pres.toLowerCase().includes(query) ||
      log.soil.toLowerCase().includes(query) ||
      log.aqi.toLowerCase().includes(query)
    );
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const startExportCSV = () => {
    setExportModalVisible(true);
    setExportingProgress(true);
    setTimeout(() => {
      setExportingProgress(false);
    }, 1500);
  };

  const triggerShareAction = async () => {
    setExportModalVisible(false);
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      // System share modal
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navyDark} />

      {/* Header */}
      <LinearGradient
        colors={[theme.colors.navyDark, theme.colors.navyMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <Text style={styles.appTitle}>TELEMETRY ARCHIVE</Text>
          <Text style={styles.headerSubtitle}>NUTECH Historical Logs</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.navyMid]}
            tintColor={theme.colors.navyMid}
          />
        }
      >
        {/* Interactive Export & Search Toolbar */}
        <View style={styles.toolbarRow}>
          <TouchableOpacity style={styles.exportBtn} onPress={startExportCSV} activeOpacity={0.8}>
            <Download size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.exportBtnText}>Export CSV</Text>
          </TouchableOpacity>

          {/* Real-time Search Filter Bar */}
          <View style={styles.searchBar}>
            <Search size={16} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search logs..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Station Log Metadata Summary Card */}
        <Card animated style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.sumVal}>{filteredLogs.length}</Text>
              <Text style={styles.sumLabel}>Logs Match</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.sumVal}>15 min</Text>
              <Text style={styles.sumLabel}>Log Interval</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.sumVal, { color: theme.colors.successGreen }]}>100%</Text>
              <Text style={styles.sumLabel}>Data Integrity</Text>
            </View>
          </View>
        </Card>

        {/* Data Log Table Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sensor Telemetry Stream</Text>
          <Text style={styles.sectionSub}>Tap any row for deep sensor diagnostics</Text>
        </View>

        {/* Table Header Row */}
        <View style={styles.tableHeader}>
          <Text style={[styles.thText, { flex: 1.2 }]}>TIME</Text>
          <Text style={[styles.thText, { flex: 1 }]}>TEMP</Text>
          <Text style={[styles.thText, { flex: 1 }]}>HUMID</Text>
          <Text style={[styles.thText, { flex: 1 }]}>PRESS</Text>
          <Text style={[styles.thText, { flex: 1 }]}>SOIL</Text>
          <Text style={[styles.thText, { flex: 0.8 }]}>AQI</Text>
        </View>

        {/* Table Data Rows */}
        {filteredLogs.map((log, index) => (
          <Animated.View key={log.id} entering={FadeInDown.delay(index * 30).duration(300)}>
            <Card
              style={styles.rowCard}
              onPress={() => setSelectedLogRow(log)}
            >
              <View style={styles.tableRow}>
                <View style={{ flex: 1.2 }}>
                  <Text style={styles.timeText}>{log.time}</Text>
                  <Text style={styles.todaySub}>Today</Text>
                </View>
                <Text style={[styles.tdText, { flex: 1, fontWeight: '700' }]}>{log.temp}</Text>
                <Text style={[styles.tdText, { flex: 1 }]}>{log.hum}</Text>
                <Text style={[styles.tdText, { flex: 1, fontSize: 11 }]}>{log.pres}</Text>
                <Text style={[styles.tdText, { flex: 1 }]}>{log.soil}</Text>
                <View style={{ flex: 0.8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[styles.tdText, { fontWeight: '700', color: theme.colors.navyMid }]}>{log.aqi}</Text>
                  <ChevronRight size={14} color={theme.colors.textMuted} />
                </View>
              </View>
            </Card>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Interactive Log Row Detail Modal */}
      {selectedLogRow && (
        <Modal
          visible={!!selectedLogRow}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedLogRow(null)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View entering={FadeInUp.duration(300)} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Log Entry: {selectedLogRow.time}</Text>
                  <Text style={styles.modalSub}>NUTECH Telemetry Packet #{selectedLogRow.id}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedLogRow(null)}>
                  <X size={20} color={theme.colors.navyDark} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalGrid}>
                <View style={styles.modalGridItem}>
                  <Text style={styles.modalGridLabel}>Air Temp</Text>
                  <Text style={styles.modalGridVal}>{selectedLogRow.temp}</Text>
                </View>
                <View style={styles.modalGridItem}>
                  <Text style={styles.modalGridLabel}>Humidity</Text>
                  <Text style={styles.modalGridVal}>{selectedLogRow.hum}</Text>
                </View>
                <View style={styles.modalGridItem}>
                  <Text style={styles.modalGridLabel}>Baro Pressure</Text>
                  <Text style={styles.modalGridVal}>{selectedLogRow.pres}</Text>
                </View>
                <View style={styles.modalGridItem}>
                  <Text style={styles.modalGridLabel}>Soil Moisture</Text>
                  <Text style={styles.modalGridVal}>{selectedLogRow.soil}</Text>
                </View>
              </View>

              <View style={styles.modalExtraBox}>
                <View style={styles.modalExtraRow}>
                  <Text style={styles.extraLabel}>Air Quality Rating</Text>
                  <Text style={styles.extraVal}>{selectedLogRow.aqi} AQI (Moderate)</Text>
                </View>
                <View style={styles.modalExtraRow}>
                  <Text style={styles.extraLabel}>Wind Vector</Text>
                  <Text style={styles.extraVal}>14.5 km/h ENE</Text>
                </View>
                <View style={styles.modalExtraRow}>
                  <Text style={styles.extraLabel}>CO₂ Level</Text>
                  <Text style={styles.extraVal}>418 ppm</Text>
                </View>
                <View style={styles.modalExtraRow}>
                  <Text style={styles.extraLabel}>UV Index</Text>
                  <Text style={styles.extraVal}>UV 7 (High)</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalCloseAction}
                onPress={() => setSelectedLogRow(null)}
              >
                <Text style={styles.modalCloseActionText}>Done</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* Interactive CSV Export Modal */}
      <Modal
        visible={exportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInUp.duration(300)} style={styles.exportModalContent}>
            <FileSpreadsheet size={40} color={theme.colors.navyMid} style={{ marginBottom: 12 }} />
            <Text style={styles.exportModalTitle}>NUTECH Telemetry Log CSV</Text>

            {exportingProgress ? (
              <View style={{ alignItems: 'center', marginVertical: 18 }}>
                <ActivityIndicator size="large" color={theme.colors.navyMid} />
                <Text style={styles.exportProgressText}>Formatting sensor telemetry data...</Text>
              </View>
            ) : (
              <View style={{ width: '100%', marginVertical: 14 }}>
                <View style={styles.exportSuccessBadge}>
                  <CheckCircle2 size={16} color={theme.colors.successGreen} style={{ marginRight: 6 }} />
                  <Text style={styles.exportSuccessText}>CSV Log Bundle Ready (10 Records)</Text>
                </View>
                <Text style={styles.exportSub}>
                  File path: NUTECH_Sensor_Logs_2026_07_27.csv
                </Text>
              </View>
            )}

            <View style={styles.exportBtnRow}>
              <TouchableOpacity
                style={styles.exportCancelBtn}
                onPress={() => setExportModalVisible(false)}
              >
                <Text style={styles.exportCancelText}>Close</Text>
              </TouchableOpacity>

              {!exportingProgress && (
                <TouchableOpacity
                  style={styles.exportShareBtn}
                  onPress={triggerShareAction}
                >
                  <Share2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.exportShareText}>Share CSV</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 36,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  appTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.accentOrange,
    letterSpacing: 1.2,
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.navyMid,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: theme.radius.medium,
    elevation: 2,
    marginRight: 10,
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.navyDark,
    paddingVertical: 0,
  },
  summaryCard: {
    padding: 14,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  sumVal: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.navyDark,
  },
  sumLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  vDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  sectionSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 4,
  },
  thText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: theme.colors.navyDark,
    letterSpacing: 0.5,
  },
  rowCard: {
    padding: 12,
    marginVertical: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  todaySub: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  tdText: {
    fontSize: 12,
    color: theme.colors.navyDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 77, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  modalSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalGridItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  modalGridLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  modalGridVal: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.navyDark,
    marginTop: 2,
  },
  modalExtraBox: {
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalExtraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  extraLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  extraVal: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  modalCloseAction: {
    backgroundColor: theme.colors.navyDark,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  exportModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 'auto',
    padding: 24,
    alignItems: 'center',
  },
  exportModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  exportProgressText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 10,
  },
  exportSuccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: 10,
  },
  exportSuccessText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: theme.colors.successGreen,
  },
  exportSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  exportBtnRow: {
    flexDirection: 'row',
    marginTop: 14,
    width: '100%',
  },
  exportCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginRight: 6,
  },
  exportCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.navyDark,
  },
  exportShareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: theme.colors.navyMid,
    borderRadius: 10,
    marginLeft: 6,
  },
  exportShareText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
