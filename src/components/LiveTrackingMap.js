// مكون خريطة التتبع الحي
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { TrackingContext } from '../../contexts/TrackingContext';
import { COLORS, SIZES } from '../../constants/index';

const { width, height } = Dimensions.get('window');

const LiveTrackingMap = ({
  merchantLat,
  merchantLng,
  captainLat,
  captainLng,
  customerLat,
  customerLng,
  orderId,
}) => {
  const { calculateETA, calculateRoute } = useContext(TrackingContext);
  const [region, setRegion] = useState(null);
  const [route, setRoute] = useState(null);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (captainLat && captainLng) {
      // تعيين منطقة الخريطة حول موقع الكابتن
      setRegion({
        latitude: captainLat,
        longitude: captainLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // حساب المسار والمسافة والوقت المتوقع
      if (customerLat && customerLng) {
        const routeData = calculateRoute(
          captainLat,
          captainLng,
          customerLat,
          customerLng
        );
        setRoute(routeData);
        setDistance(routeData.distance);
        setEta(routeData.duration);
      }
    }
  }, [captainLat, captainLng, customerLat, customerLng, calculateRoute]);

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جاري تحميل الخريطة...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {/* موقع التاجر */}
        {merchantLat && merchantLng && (
          <Marker
            coordinate={{
              latitude: merchantLat,
              longitude: merchantLng,
            }}
            title="متجر"
            description="موقع المتجر"
            pinColor={COLORS.secondary}
          />
        )}

        {/* موقع الكابتن */}
        {captainLat && captainLng && (
          <Marker
            coordinate={{
              latitude: captainLat,
              longitude: captainLng,
            }}
            title="السائق"
            description="موقع السائق الحالي"
            pinColor={COLORS.primary}
          />
        )}

        {/* موقع الزبون */}
        {customerLat && customerLng && (
          <Marker
            coordinate={{
              latitude: customerLat,
              longitude: customerLng,
            }}
            title="الزبون"
            description="موقع الزبون النهائي"
            pinColor={COLORS.success}
          />
        )}

        {/* رسم الخط بين الكابتن والزبون */}
        {captainLat && captainLng && customerLat && customerLng && (
          <Polyline
            coordinates={[
              {
                latitude: captainLat,
                longitude: captainLng,
              },
              {
                latitude: customerLat,
                longitude: customerLng,
              },
            ]}
            strokeColor={COLORS.primary}
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* معلومات التتبع */}
      {distance && eta && (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>المسافة:</Text>
            <Text style={styles.infoValue}>{distance} كم</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الوقت المتوقع:</Text>
            <Text style={styles.infoValue}>{eta} دقيقة</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  map: {
    flex: 1,
    width: width,
    height: height * 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
  },
  loadingText: {
    marginTop: SIZES.md,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderTopLeftRadius: SIZES.md,
    borderTopRightRadius: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default LiveTrackingMap;
