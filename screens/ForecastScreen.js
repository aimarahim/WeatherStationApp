import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  Wind,
  Umbrella,
  Thermometer,
  ChevronDown,
  ChevronUp,
  Droplets,
  ShieldCheck,
} from 'lucide-react-native';

import { theme } from '../theme';
import { defaultStation } from '../data/mockWeather';
import Card from '../components/Card';

const getConditionIcon = (iconName, size = 22, color = theme.colors.navyMid) => {
  switch (iconName) {
    case 'Sun':
      return <Sun size={size} color={theme.colors.accentOrange} />;
    case 'CloudSun':
      return <CloudSun size={size} color={theme.colors.accentOrange} />;
    case 'Cloud':
      return <Cloud size={size} color={theme.colors.navyMid} />;
    case 'CloudRain':
      return <CloudRain size={size} color="#3B82F6" />;
    case 'CloudLightning':
      return <CloudLightning size={size} color="#8B5CF6" />;
    case 'Wind':
      return <Wind size={size} color="#06B6D4" />;
    default:
      return <Sun size={size} color={theme.colors.accentOrange} />;
  }
};

export default function ForecastScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);
  const [expandedDayIndex, setExpandedDayIndex] = useState(null);

  const { hourly, forecast7Days } = defaultStation;
  const activeHour = hourly[selectedHourIndex];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleExpandDay = (index) => {
    setExpandedDayIndex(expandedDayIndex === index ? null : index);
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
          <Text style={styles.appTitle}>WEATHER FORECAST</Text>
          <Text style={styles.headerSubtitle}>NUTECH Next 24h & 7-Day Outlook</Text>
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
        {/* Hourly Horizontal Scroll Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hourly Projections</Text>
          <Text style={styles.sectionSub}>Tap any hour to inspect projection details</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyContainer}
        >
          {hourly.map((item, index) => {
            const isSelected = selectedHourIndex === index;
            return (
              <Animated.View
                key={index}
                entering={FadeInRight.delay(index * 50).duration(300)}
                style={styles.hourlyItem}
              >
                <TouchableOpacity
                  onPress={() => setSelectedHourIndex(index)}
                  activeOpacity={0.8}
                >
                  <Card style={[styles.hourlyCard, isSelected && styles.hourlyCardSelected]}>
                    <Text style={[styles.hourlyTime, isSelected && styles.hourlyTimeSelected]}>
                      {item.time}
                    </Text>
                    <View style={styles.iconContainer}>{getConditionIcon(item.icon, 24)}</View>
                    <Text style={[styles.hourlyTemp, isSelected && styles.hourlyTempSelected]}>
                      {item.temp}°
                    </Text>
                    <View style={styles.rainProbContainer}>
                      <Umbrella size={11} color={isSelected ? '#FFFFFF' : '#3B82F6'} />
                      <Text style={[styles.rainProbText, isSelected && { color: '#FFFFFF' }]}>
                        {item.rainProb}%
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Selected Hour Details Highlight Card */}
        {activeHour && (
          <Card animated style={styles.activeHourDetailCard}>
            <View style={styles.activeHourHeader}>
              <View style={styles.activeHourLeft}>
                <Text style={styles.activeHourTitle}>Target: {activeHour.time} Projection</Text>
                <Text style={styles.activeHourCond}>{activeHour.condition}</Text>
              </View>
              <Text style={styles.activeHourTemp}>{activeHour.temp}°C</Text>
            </View>

            <View style={styles.activeHourGrid}>
              <View style={styles.activeHourGridItem}>
                <Droplets size={16} color="#3B82F6" />
                <Text style={styles.activeHourGridLabel}>Humidity</Text>
                <Text style={styles.activeHourGridVal}>{activeHour.humidity}%</Text>
              </View>
              <View style={styles.activeHourGridItem}>
                <Umbrella size={16} color="#8B5CF6" />
                <Text style={styles.activeHourGridLabel}>Precipitation</Text>
                <Text style={styles.activeHourGridVal}>{activeHour.rainProb}%</Text>
              </View>
              <View style={styles.activeHourGridItem}>
                <Wind size={16} color="#06B6D4" />
                <Text style={styles.activeHourGridLabel}>Wind Estimate</Text>
                <Text style={styles.activeHourGridVal}>16 km/h</Text>
              </View>
            </View>
          </Card>
        )}

        {/* 7-Day Forecast Section */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>7-Day Meteorological Outlook</Text>
          <Text style={styles.sectionSub}>Tap cards to expand detailed forecast parameters</Text>
        </View>

        {forecast7Days.map((dayItem, idx) => {
          const isExpanded = expandedDayIndex === idx;
          return (
            <Card
              key={idx}
              animated
              delay={idx * 60 + 100}
              style={styles.dayCard}
              onPress={() => toggleExpandDay(idx)}
            >
              <View style={styles.dayRow}>
                <View style={styles.dayLeft}>
                  <Text style={styles.dayName}>{dayItem.day}</Text>
                  <Text style={styles.dayCondition}>{dayItem.condition}</Text>
                </View>

                <View style={styles.dayCenter}>
                  {getConditionIcon(dayItem.icon, 22)}
                  <View style={styles.rainBadge}>
                    <Umbrella size={10} color="#3B82F6" />
                    <Text style={styles.rainBadgeText}>{dayItem.rainProb}%</Text>
                  </View>
                </View>

                <View style={styles.dayRight}>
                  <Text style={styles.maxTemp}>{dayItem.maxTemp}°</Text>
                  <Text style={styles.minTemp}>/ {dayItem.minTemp}°C</Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color={theme.colors.navyMid} style={{ marginLeft: 6 }} />
                  ) : (
                    <ChevronDown size={18} color={theme.colors.textMuted} style={{ marginLeft: 6 }} />
                  )}
                </View>
              </View>

              {/* Temperature Visual Bar */}
              <View style={styles.tempBarTrack}>
                <View
                  style={[
                    styles.tempBarFill,
                    {
                      width: `${Math.min(100, Math.max(20, (dayItem.maxTemp - 15) * 4))}%`,
                      backgroundColor: dayItem.maxTemp >= 33 ? theme.colors.accentOrange : theme.colors.navyMid,
                    },
                  ]}
                />
              </View>

              {/* Expanded Breakdown Accordion Details */}
              {isExpanded && (
                <Animated.View entering={FadeInDown.duration(250)} style={styles.expandedBreakdown}>
                  <View style={styles.expDivider} />
                  <View style={styles.expGrid}>
                    <View style={styles.expItem}>
                      <ShieldCheck size={14} color={theme.colors.successGreen} />
                      <Text style={styles.expLabel}>Est. AQI</Text>
                      <Text style={styles.expVal}>{dayItem.aqi} AQI</Text>
                    </View>
                    <View style={styles.expItem}>
                      <Wind size={14} color="#06B6D4" />
                      <Text style={styles.expLabel}>Wind Vector</Text>
                      <Text style={styles.expVal}>14 km/h ENE</Text>
                    </View>
                    <View style={styles.expItem}>
                      <Droplets size={14} color="#3B82F6" />
                      <Text style={styles.expLabel}>Avg Humidity</Text>
                      <Text style={styles.expVal}>62%</Text>
                    </View>
                  </View>
                </Animated.View>
              )}
            </Card>
          );
        })}
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
  sectionHeader: {
    marginBottom: 12,
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
  hourlyContainer: {
    paddingRight: 10,
  },
  hourlyItem: {
    marginRight: 10,
  },
  hourlyCard: {
    alignItems: 'center',
    width: 75,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  hourlyCardSelected: {
    backgroundColor: theme.colors.navyDark,
    borderColor: theme.colors.accentOrange,
  },
  hourlyTime: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  hourlyTimeSelected: {
    color: theme.colors.accentOrange,
    fontWeight: '800',
  },
  iconContainer: {
    marginVertical: 4,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.navyDark,
    marginVertical: 4,
  },
  hourlyTempSelected: {
    color: '#FFFFFF',
  },
  rainProbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rainProbText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
    marginLeft: 2,
  },
  activeHourDetailCard: {
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accentOrange,
    padding: 14,
  },
  activeHourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeHourLeft: {
    flex: 1,
  },
  activeHourTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  activeHourCond: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  activeHourTemp: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.navyDark,
  },
  activeHourGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
  },
  activeHourGridItem: {
    alignItems: 'center',
  },
  activeHourGridLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  activeHourGridVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: theme.colors.navyDark,
    marginTop: 2,
  },
  dayCard: {
    marginVertical: 5,
    padding: 14,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayLeft: {
    flex: 2,
  },
  dayName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  dayCondition: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  dayCenter: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  rainBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
    marginLeft: 2,
  },
  dayRight: {
    flex: 1.8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  maxTemp: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  minTemp: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  tempBarTrack: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  tempBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  expandedBreakdown: {
    marginTop: 10,
  },
  expDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 10,
  },
  expGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  expItem: {
    alignItems: 'center',
  },
  expLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  expVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: theme.colors.navyDark,
    marginTop: 2,
  },
});
