import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import mapMarker from '../images/map-marker.png';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap() {
  const navigation = useNavigation();

  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  useFocusEffect(() => {
    const loadOrphanages = async () => {
      try {
        const { data } = await api.get<Orphanage[]>('orphanages');
        setOrphanages(data);
      } catch (err) {
        Alert.alert('', err.message);
      }
    };
    loadOrphanages();
  });

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', { id });
  }

  function handleNavigateToSelectMapPosition() {
    navigation.navigate('SelectMapPosition');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -21.6141084,
          longitude: -48.3591068,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >
        {orphanages.map(orphanage => (
          <Marker
            key={orphanage.id}
            icon={mapMarker}
            coordinate={{
              latitude: orphanage.latitude,
              longitude: orphanage.longitude,
            }}
            calloutAnchor={{ x: 2.7, y: 0.8 }}
          >
            <Callout
              tooltip
              onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}
            >
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{orphanage.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{`${orphanages.length} orphanages found`}</Text>
        <RectButton
          style={styles.createOrphanageButton}
          onPress={handleNavigateToSelectMapPosition}
        >
          <Feather name="plus" size={20} color="#fff" />
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
  },
  calloutText: {
    fontFamily: 'Nunito_700Bold',
    color: '#0089a5',
    fontSize: 14,
  },
  footerContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#fff',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    elevation: 3,
  },
  footerText: {
    fontFamily: 'Nunito_700Bold',
    color: '#8fa7b3',
  },
  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c5d6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
});
