import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Modal,
  Image,
  Platform,
} from 'react-native';
import { Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Droplets,
  Gauge,
  Wind,
  Sun,
  Sprout,
  Activity,
  Eye,
  ShieldCheck,
  Sunrise,
  Sunset,
  RefreshCw,
  MapPin,
  X,
  CheckCircle2,
} from 'lucide-react-native';

import { theme } from '../theme';
import { defaultStation } from '../data/mockWeather';
import Card from '../components/Card';
import StatTile from '../components/StatTile';
import AlertBanner from '../components/AlertBanner';

const getFormattedTimestamp = () => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  return `Just now (${timeStr})`;
};

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [unitFahrenheit, setUnitFahrenheit] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(getFormattedTimestamp());
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  const NUTECH_COORDS = {
    latitude: 33.6263,
    longitude: 73.0115,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncTime(getFormattedTimestamp());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const station = defaultStation;
  const { current } = station;

  const displayTemp = (celsius) => {
    if (unitFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastSyncTime(getFormattedTimestamp());
    }, 1200);
  };

  const sensorDetailsMap = {
    humidity: {
      title: 'Relative Humidity Sensor',
      code: 'NUT-HUM-402',
      value: `${current.humidity}%`,
      status: 'Optimal',
      range: '30% - 70%',
      sampling: 'Every 10 seconds',
      description: 'Dual capacitive polymer humidity sensor. High precision relative moisture measurement.',
      icon: Droplets,
      color: '#3B82F6',
    },
    pressure: {
      title: 'Barometric Pressure Sensor',
      code: 'NUT-BAR-108',
      value: `${current.pressure} hPa`,
      status: 'Normal',
      range: '980 hPa - 1030 hPa',
      sampling: 'Every 15 seconds',
      description: 'Piezo-resistive absolute barometric pressure transducer with temperature compensation.',
      icon: Gauge,
      color: '#8B5CF6',
    },
    wind: {
      title: 'Ultrasonic Wind Station',
      code: 'NUT-WND-901',
      value: `${current.windSpeed} km/h`,
      status: 'Active',
      range: '0 - 150 km/h',
      sampling: 'Continuous',
      description: '3D Ultrasonic anemometer measuring wind speed, gust peak, and vector azimuth angle.',
      icon: Wind,
      color: '#06B6D4',
    },
    solar: {
      title: 'Solar Pyranometer & UV',
      code: 'NUT-SOL-303',
      value: `${current.solarRadiation} W/m²`,
      status: 'Peak Output',
      range: '0 - 1200 W/m²',
      sampling: 'Every 5 seconds',
      description: 'Silicon photodiode solar irradiance sensor and dedicated UV broadband index radiometer.',
      icon: Sun,
      color: theme.colors.accentOrange,
    },
    soil: {
      title: 'Volumetric Soil Moisture',
      code: 'NUT-SOL-512',
      value: `${current.soilMoisture}%`,
      status: 'Adequate',
      range: '20% - 60%',
      sampling: 'Every 60 seconds',
      description: 'FDR Frequency Domain Reflectometry probe inserted at 10cm ground depth.',
      icon: Sprout,
      color: theme.colors.successGreen,
    },
    co2: {
      title: 'CO₂ Gas Analyzer (NDIR)',
      code: 'NUT-CO2-880',
      value: `${current.co2} ppm`,
      status: 'Good Air',
      range: '350 ppm - 1000 ppm',
      sampling: 'Every 30 seconds',
      description: 'Non-Dispersive Infrared (NDIR) dual-channel carbon dioxide optical gas sensor.',
      icon: Activity,
      color: '#10B981',
    },
    visibility: {
      title: 'Optical Transmissometer',
      code: 'NUT-VIS-204',
      value: `${current.visibility} km`,
      status: 'Clear View',
      range: '0 - 20 km',
      sampling: 'Every 60 seconds',
      description: 'Forward scatter optical visibility meter estimating atmospheric extinction coefficient.',
      icon: Eye,
      color: '#6366F1',
    },
    aqi: {
      title: 'Air Quality Index Monitor',
      code: 'NUT-AQI-606',
      value: `${current.aqi} AQI`,
      status: current.aqiStatus,
      range: '0 - 500 AQI',
      sampling: 'Every 15 minutes',
      description: 'Multi-pollutant integrated index calculating PM2.5, PM10, NO2, and O3 concentration.',
      icon: ShieldCheck,
      color: '#EC4899',
    },
  };

  const activeSensorInfo = selectedSensor ? sensorDetailsMap[selectedSensor] : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navyDark} />

      {/* Header with Expo Linear Gradient */}
      <LinearGradient
        colors={[theme.colors.navyDark, theme.colors.navyMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          {/* Institutional Branding Logos */}
          <View style={[styles.brandingRow, { backgroundColor: 'transparent' }]}>
            {/* NUTECH circular seal */}
            <Image
              source={require('../assets/nutech-logo (2).png')}
              style={{ width: 60, height: 60, resizeMode: 'contain' }}
            />
            {/* Erasmus/Active logo */}
            <Image
              source={require('../assets/erasmus-logo.png')}
              style={styles.erasmusLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appTitle}>NUTECH WEATHER STATION</Text>
              <View style={styles.stationBadgeHeader}>
                <TouchableOpacity onPress={() => setMapVisible(true)} style={styles.locationButton} activeOpacity={0.7}>
                  <Ionicons name="location-sharp" size={18} color="#4A90E2" />
                </TouchableOpacity>
                <Text style={styles.stationName}>{station.name}</Text>
              </View>
            </View>

            <View style={styles.headerRightActions}>
              {/* Temperature Unit Toggle Switcher */}
              <TouchableOpacity
                style={styles.unitTogglePill}
                onPress={() => setUnitFahrenheit(!unitFahrenheit)}
                activeOpacity={0.8}
              >
                <Text style={[styles.unitToggleText, !unitFahrenheit && styles.unitToggleTextActive]}>
                  °C
                </Text>
                <Text style={styles.unitToggleDivider}>|</Text>
                <Text style={[styles.unitToggleText, unitFahrenheit && styles.unitToggleTextActive]}>
                  °F
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh} activeOpacity={0.7}>
                <RefreshCw size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Main Weather Card */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.heroCardContainer}>
            <View style={styles.heroMainRow}>
              <View>
                <Text style={styles.tempText}>{displayTemp(current.temp)}</Text>
                <Text style={styles.conditionText}>{current.condition}</Text>
                <Text style={styles.feelsLikeText}>Feels like {displayTemp(current.feelsLike)}</Text>
              </View>

              <View style={styles.heroRightBadge}>
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>LIVE</Text>
                </View>
                <Text style={styles.updatedText}>{lastSyncTime}</Text>
                <Text style={styles.locationText}>{station.elevation}</Text>
              </View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      {/* Main Scrollable Content with Pull To Refresh */}
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
        {/* Warning Alert Banner */}
        {showAlert && station.alerts && station.alerts.length > 0 && (
          <AlertBanner
            title={station.alerts[0].title}
            message={station.alerts[0].message}
            onDismiss={() => setShowAlert(false)}
          />
        )}

        {/* Primary Station Stats Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Telemetry</Text>
          <Text style={styles.sectionSub}>Swipe left/right to view all live sensor tiles</Text>
        </View>

        {/* Horizontally Scrollable Row of Stat Tiles */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalTilesContainer}
        >
          <StatTile
            icon={Droplets}
            label="Relative Humidity"
            value={current.humidity}
            unit="%"
            subtitle="Optimal Range"
            iconColor="#3B82F6"
            animated
            delay={100}
            style={styles.horizontalTileItem}
            onPress={() => setSelectedSensor('humidity')}
            isSelected={selectedSensor === 'humidity'}
          />

          <StatTile
            icon={Gauge}
            label="Atmospheric Pressure"
            value={current.pressure}
            unit="hPa"
            subtitle="1013 hPa Std"
            iconColor="#8B5CF6"
            animated
            delay={150}
            style={styles.horizontalTileItem}
            onPress={() => setSelectedSensor('pressure')}
            isSelected={selectedSensor === 'pressure'}
          />

          <StatTile
            icon={Wind}
            label="Wind Speed & Dir"
            value={current.windSpeed}
            unit="km/h"
            subtitle={current.windDirection}
            iconColor="#06B6D4"
            animated
            delay={200}
            style={styles.horizontalTileItem}
            onPress={() => setSelectedSensor('wind')}
            isSelected={selectedSensor === 'wind'}
          />

          <StatTile
            icon={Sun}
            label="Solar Radiation"
            value={current.solarRadiation}
            unit="W/m²"
            badgeText={`UV ${current.uvIndex}`}
            badgeColor={current.uvIndex >= 8 ? '#EF4444' : theme.colors.accentOrange}
            iconColor={theme.colors.accentOrange}
            animated
            delay={250}
            style={styles.horizontalTileItem}
            onPress={() => setSelectedSensor('solar')}
            isSelected={selectedSensor === 'solar'}
          />

          <StatTile
            icon={Sprout}
            label="Soil Moisture"
            value={current.soilMoisture}
            unit="%"
            subtitle="Depth: 10cm"
            iconColor={theme.colors.successGreen}
            animated
            delay={300}
            style={styles.horizontalTileItem}
            onPress={() => setSelectedSensor('soil')}
            isSelected={selectedSensor === 'soil'}
          />

          <StatTile
            icon={Activity}
            label="CO2 Concentration"
            value={current.co2}
            unit="ppm"
            subtitle="Target <450"
            iconColor="#10B981"
            animated
            delay={350}
            style={styles.horizontalTileItem}
            onPress={() => setSelectedSensor('co2')}
            isSelected={selectedSensor === 'co2'}
          />

          <StatTile
            icon={Eye}
            label="Visibility Distance"
            value={current.visibility}
            unit="km"
            subtitle="Clear Atmosphere"
            iconColor="#6366F1"
            animated
            delay={400}
            style={styles.horizontalTileItem}
            onPress={() => setSelectedSensor('visibility')}
            isSelected={selectedSensor === 'visibility'}
          />

          <StatTile
            icon={ShieldCheck}
            label="Air Quality Index"
            value={current.aqi}
            unit="AQI"
            badgeText={current.aqiStatus}
            badgeColor={current.aqi <= 50 ? theme.colors.successGreen : theme.colors.warningText}
            iconColor="#EC4899"
            animated
            delay={450}
            style={styles.horizontalTileItem}
            onPress={() => setSelectedSensor('aqi')}
            isSelected={selectedSensor === 'aqi'}
          />
        </ScrollView>

        {/* Sun & Moon Cycle Card */}
        <Card animated delay={500} style={styles.sunMoonCard}>
          <Text style={styles.cardHeaderTitle}>Solar & Lunar Cycle</Text>
          <View style={styles.sunMoonRow}>
            <View style={styles.cycleItem}>
              <Sunrise size={24} color={theme.colors.accentOrange} />
              <Text style={styles.cycleLabel}>Sunrise</Text>
              <Text style={styles.cycleValue}>{current.sunrise}</Text>
            </View>
            <View style={styles.cycleDivider} />
            <View style={styles.cycleItem}>
              <Sunset size={24} color="#F97316" />
              <Text style={styles.cycleLabel}>Sunset</Text>
              <Text style={styles.cycleValue}>{current.sunset}</Text>
            </View>
            <View style={styles.cycleDivider} />
            <View style={styles.cycleItem}>
              <Text style={styles.moonEmoji}>🌔</Text>
              <Text style={styles.cycleLabel}>Moon Phase</Text>
              <Text style={styles.cycleValueText} numberOfLines={1}>
                {current.moonPhase}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Interactive Sensor Detail Modal */}
      {activeSensorInfo && (
        <Modal
          visible={!!selectedSensor}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedSensor(null)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View entering={FadeInUp.duration(300)} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  {activeSensorInfo.icon && (
                    <View style={[styles.modalIconBg, { backgroundColor: activeSensorInfo.color + '20' }]}>
                      <activeSensorInfo.icon size={22} color={activeSensorInfo.color} />
                    </View>
                  )}
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.modalTitle}>{activeSensorInfo.title}</Text>
                    <Text style={styles.modalCode}>ID: {activeSensorInfo.code}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedSensor(null)}>
                  <X size={20} color={theme.colors.navyDark} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalStatBox}>
                  <Text style={styles.modalStatVal}>{activeSensorInfo.value}</Text>
                  <View style={styles.modalStatusBadge}>
                    <CheckCircle2 size={12} color={theme.colors.successGreen} style={{ marginRight: 4 }} />
                    <Text style={styles.modalStatusText}>{activeSensorInfo.status}</Text>
                  </View>
                </View>

                <Text style={styles.modalDesc}>{activeSensorInfo.description}</Text>

                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Normal Operating Range</Text>
                    <Text style={styles.modalInfoVal}>{activeSensorInfo.range}</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Sampling Interval</Text>
                    <Text style={styles.modalInfoVal}>{activeSensorInfo.sampling}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.modalActionBtn, { backgroundColor: activeSensorInfo.color }]}
                onPress={() => setSelectedSensor(null)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalActionBtnText}>Close Sensor Telemetry</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* Interactive Map Modal */}
      <Modal visible={mapVisible} animationType="slide" onRequestClose={() => setMapVisible(false)}>
        <SafeAreaView style={styles.mapModalContainer}>
          <View style={styles.mapHeader}>
            <View>
              <Text style={styles.mapTitle}>Station Location</Text>
              <Text style={styles.mapSubtitle}>NUTECH, Islamabad</Text>
            </View>
            <TouchableOpacity
              style={styles.mapCloseBtn}
              onPress={() => setMapVisible(false)}
            >
              <X size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.mapPlaceholderContainer}>
            <MapPin size={64} color={theme.colors.navyMid} />
            <Text style={styles.mapPlaceholderTitle}>National University of Technology (NUTECH)</Text>
            <Text style={styles.mapPlaceholderSub}>
              Lat: {NUTECH_COORDS.latitude}, Lng: {NUTECH_COORDS.longitude}
            </Text>

            <TouchableOpacity
              style={styles.openMapsBtn}
              onPress={() => {
                const url = Platform.select({
                  ios: `maps:0,0?q=${NUTECH_COORDS.latitude},${NUTECH_COORDS.longitude}`,
                  android: `geo:0,0?q=${NUTECH_COORDS.latitude},${NUTECH_COORDS.longitude}(NUTECH Station)`,
                });
                Linking.openURL(url);
              }}
              activeOpacity={0.85}
            >
              <MapPin size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.openMapsBtnText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  brandingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    height: 64,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  nutechLogo: {
    height: 56,
    width: 56,
  },
  erasmusLogo: {
    height: 60,
    width: 65,
    resizeMode: 'contain',
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 36,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.accentOrange,
    letterSpacing: 1.2,
  },
  stationBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationButton: {
    marginRight: 6,
    padding: 2,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  unitTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  unitToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#93C5FD',
  },
  unitToggleTextActive: {
    color: '#0F1E4D',
    fontWeight: '800',
  },
  unitToggleDivider: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: theme.radius.large,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 48,
  },
  conditionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E7FF',
    marginTop: 2,
  },
  feelsLikeText: {
    fontSize: 13,
    color: '#93C5FD',
    marginTop: 2,
  },
  heroRightBadge: {
    alignItems: 'flex-end',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.successGreen,
    marginBottom: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.successGreen,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  updatedText: {
    fontSize: 12,
    color: '#E0E7FF',
    fontWeight: '500',
  },
  locationText: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  sectionSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  horizontalTilesContainer: {
    paddingRight: 10,
    marginBottom: 10,
  },
  horizontalTileItem: {
    width: 170,
    marginRight: 12,
  },
  sunMoonCard: {
    marginTop: 12,
    padding: 18,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.navyDark,
    marginBottom: 14,
  },
  sunMoonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cycleItem: {
    alignItems: 'center',
    flex: 1,
  },
  cycleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  cycleValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.navyDark,
    marginTop: 2,
  },
  cycleValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.navyDark,
    marginTop: 2,
  },
  moonEmoji: {
    fontSize: 20,
  },
  cycleDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
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
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  modalCode: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  modalBody: {
    marginVertical: 10,
  },
  modalStatBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  modalStatVal: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.navyDark,
  },
  modalStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.successGreen,
  },
  modalDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
  },
  modalInfoItem: {
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  modalInfoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.navyDark,
    marginTop: 2,
  },
  modalActionBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  modalActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: theme.colors.navyDark,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mapSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#93C5FD',
    marginTop: 2,
  },
  mapCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  mapPlaceholderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.navyDark,
    textAlign: 'center',
    marginTop: 16,
  },
  mapPlaceholderSub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
  },
  openMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.navyDark,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  openMapsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mapView: {
    flex: 1,
  },
});