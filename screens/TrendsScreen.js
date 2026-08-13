import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LineChart } from 'react-native-gifted-charts';
import {
  Thermometer,
  Droplets,
  Gauge,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react-native';

import { theme } from '../theme';
import { mockTrendsData } from '../data/mockTrends';
import Card from '../components/Card';

const screenWidth = Dimensions.get('window').width;

export default function TrendsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('temp'); // 'temp' | 'humidity' | 'pressure' | 'co2'
  const [selectedPeriod, setSelectedPeriod] = useState('24h'); // '24h' | '7d' | '30d'

  const activeMetricData = mockTrendsData[selectedMetric];
  const chartData = activeMetricData.ranges[selectedPeriod];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
          <Text style={styles.appTitle}>SENSOR ANALYTICS</Text>
          <Text style={styles.headerSubtitle}>NUTECH Historical Trends</Text>
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
        {/* Period Selector Tabs */}
        <View style={styles.tabContainer}>
          {['24h', '7d', '30d'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodTab,
                selectedPeriod === period && styles.periodTabActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodTabText,
                  selectedPeriod === period && styles.periodTabTextActive,
                ]}
              >
                {period.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4 Metric Selector Chips (Order: Temperature, Humidity, Pressure, CO2) */}
        <View style={styles.metricGrid}>
          <TouchableOpacity
            style={[
              styles.metricChip,
              selectedMetric === 'temp' && { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
            ]}
            onPress={() => setSelectedMetric('temp')}
            activeOpacity={0.7}
          >
            <Thermometer size={16} color={selectedMetric === 'temp' ? '#EF4444' : theme.colors.textSecondary} />
            <Text style={[styles.metricChipText, selectedMetric === 'temp' && { color: '#EF4444', fontWeight: '700' }]}>
              Temp (°C)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricChip,
              selectedMetric === 'humidity' && { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
            ]}
            onPress={() => setSelectedMetric('humidity')}
            activeOpacity={0.7}
          >
            <Droplets size={16} color={selectedMetric === 'humidity' ? '#3B82F6' : theme.colors.textSecondary} />
            <Text style={[styles.metricChipText, selectedMetric === 'humidity' && { color: '#3B82F6', fontWeight: '700' }]}>
              Humidity (%)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricChip,
              selectedMetric === 'pressure' && { backgroundColor: '#F3E8FF', borderColor: '#8B5CF6' },
            ]}
            onPress={() => setSelectedMetric('pressure')}
            activeOpacity={0.7}
          >
            <Gauge size={16} color={selectedMetric === 'pressure' ? '#8B5CF6' : theme.colors.textSecondary} />
            <Text style={[styles.metricChipText, selectedMetric === 'pressure' && { color: '#8B5CF6', fontWeight: '700' }]}>
              Pressure (hPa)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricChip,
              selectedMetric === 'co2' && { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
            ]}
            onPress={() => setSelectedMetric('co2')}
            activeOpacity={0.7}
          >
            <Activity size={16} color={selectedMetric === 'co2' ? '#10B981' : theme.colors.textSecondary} />
            <Text style={[styles.metricChipText, selectedMetric === 'co2' && { color: '#10B981', fontWeight: '700' }]}>
              CO₂ (ppm)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Interactive Chart Card */}
        <Card animated style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>{activeMetricData.title}</Text>
              <Text style={styles.chartSubtitle}>
                NUTECH Station • Tap data points to inspect values
              </Text>
            </View>

            <View
              style={[
                styles.trendBadge,
                { backgroundColor: activeMetricData.isPositive ? '#DCFCE7' : '#FEE2E2' },
              ]}
            >
              {activeMetricData.isPositive ? (
                <ArrowUpRight size={14} color={theme.colors.successGreen} />
              ) : (
                <ArrowDownRight size={14} color="#EF4444" />
              )}
              <Text
                style={[
                  styles.trendBadgeText,
                  { color: activeMetricData.isPositive ? theme.colors.successGreen : '#EF4444' },
                ]}
              >
                {activeMetricData.change}
              </Text>
            </View>
          </View>

          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              color={activeMetricData.color}
              thickness={2.5}
              dataPointsColor={activeMetricData.color}
              dataPointsRadius={selectedPeriod === '24h' ? 3 : 5}
              curved
              startFillColor={activeMetricData.color}
              endFillColor={activeMetricData.color + '15'}
              startOpacity={0.4}
              endOpacity={0.05}
              areaChart
              width={screenWidth - 32}
              height={180}
              initialSpacing={8}
              endSpacing={8}
              spacing={
                selectedPeriod === '7d' ? 38 :
                selectedPeriod === '30d' ? 65 :
                Math.floor((screenWidth - 32 - 60) / 24)
              }
              noOfSections={4}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              rulesColor={theme.colors.border}
              rulesType="solid"
              pointerConfig={{
                pointerStripHeight: 160,
                pointerStripColor: theme.colors.navyMid + '60',
                pointerStripWidth: 2,
                pointerColor: activeMetricData.color,
                radius: 6,
                pointerLabelComponent: (items) => {
                  return (
                    <View style={styles.pointerTooltip}>
                      <Text style={styles.pointerTooltipValue}>
                        {items[0].value} {activeMetricData.unit}
                      </Text>
                      <Text style={styles.pointerTooltipLabel}>{items[0].label}</Text>
                    </View>
                  );
                },
              }}
            />
          </View>
        </Card>

        {/* Analytical Highlights Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Period Highlights</Text>
          <Text style={styles.sectionSub}>Calculated min, max, average values</Text>
        </View>

        <View style={styles.summaryRow}>
          <Card animated delay={200} style={styles.summaryTile}>
            <View style={styles.sumIconBg}>
              <ArrowUpRight size={18} color="#EF4444" />
            </View>
            <Text style={styles.sumLabel}>Maximum Peak</Text>
            <Text style={styles.sumVal}>{activeMetricData.peak}</Text>
            <Text style={styles.sumSub}>{activeMetricData.peakTime}</Text>
          </Card>

          <Card animated delay={250} style={styles.summaryTile}>
            <View style={styles.sumIconBg}>
              <ArrowDownRight size={18} color="#3B82F6" />
            </View>
            <Text style={styles.sumLabel}>Minimum Low</Text>
            <Text style={styles.sumVal}>{activeMetricData.low}</Text>
            <Text style={styles.sumSub}>{activeMetricData.lowTime}</Text>
          </Card>
        </View>

        <Card animated delay={300} style={styles.avgCard}>
          <View style={styles.avgRow}>
            <View style={styles.avgLeft}>
              <Activity size={22} color={activeMetricData.color} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.avgTitle}>Mean Range Average</Text>
                <Text style={styles.avgSubtitle}>Calculated from high-precision logs</Text>
              </View>
            </View>
            <Text style={[styles.avgVal, { color: activeMetricData.color }]}>{activeMetricData.avg}</Text>
          </View>
        </Card>
      </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: theme.radius.medium,
    padding: 3,
    marginBottom: 14,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.radius.small,
  },
  periodTabActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  periodTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  periodTabTextActive: {
    fontWeight: '800',
    color: theme.colors.navyDark,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  metricChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  chartCard: {
    padding: 16,
    marginVertical: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  chartSubtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
  chartWrapper: {
    marginVertical: 6,
    marginHorizontal: -16,
  },
  axisText: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  pointerTooltip: {
    height: 44,
    width: 90,
    backgroundColor: theme.colors.navyDark,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  pointerTooltipValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  pointerTooltipLabel: {
    color: theme.colors.accentOrange,
    fontSize: 10,
    fontWeight: '600',
  },
  sectionHeader: {
    marginTop: 18,
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
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  summaryTile: {
    flex: 1,
    marginHorizontal: 4,
    padding: 14,
  },
  sumIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sumLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  sumVal: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.navyDark,
    marginVertical: 2,
  },
  sumSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  avgCard: {
    marginTop: 8,
    padding: 14,
  },
  avgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avgLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avgTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  avgSubtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  avgVal: {
    fontSize: 22,
    fontWeight: '800',
  },
});
