import React from 'react';

import { useEffect, useState } from 'react';

import { View, Text, Image, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { useNavigation } from '@react-navigation/native';

import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';

import { MaterialIcons } from '@expo/vector-icons';

import api from '../../services/api';

import { connect, disconnect, subscribeToNewDev } from '../../services/socket';

import styles from './styles';

type Location = {
  coordinates: [number, number];
}

export type Dev = {
  _id: string;
  name: string;
  bio: string;
  avatar_url: string;
  github_username: string;
  techs: string[];
  location: Location;
}

export function Main() { 
  const { navigate } = useNavigation();

  const [devs, setDevs] = useState<Dev[]>([]);

  const [techs, setTechs] = useState('');

  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestForegroundPermissionsAsync();

      if (!granted) 
        return Alert.alert('Opss...', 'Nós precisamos dessa permissão.');

      const { coords } = await getCurrentPositionAsync();

      const { latitude, longitude } = coords;

      setPosition({
        latitude,
        longitude,
        latitudeDelta: 0.11,
        longitudeDelta: 0.11,
      });
    };

    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDev((dev: Dev) => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    disconnect();

    const { latitude, longitude } = position;

    connect(
      String(latitude),
      String(longitude),
      techs,
    );
  }

  async function loadDevs() {
    const { latitude, longitude } = position;

    const response = await api.get('search', {
      params: {
        latitude, 
        longitude,
        techs,
      },
    });

    setDevs(response.data.devs);
    setupWebsocket();
  };

  function handleRegionChanged(region: Region) {
    setPosition({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: 0.11,
      longitudeDelta: 0.11,
    });
  };

  // console.log(devs);

  function handleNavigateToProfilePage(github_username: string) {
    navigate('Profile', { github_username });
  };

  if (!position.latitude)
    return null;

  return (
    <KeyboardAvoidingView>
      <MapView 
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={{
          latitude: position.latitude, 
          longitude: position.longitude,
          latitudeDelta: position.latitudeDelta,
          longitudeDelta: position.longitudeDelta,
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
      >
        { devs.map(dev => {
          return (
            <Marker
              key={dev._id}
              coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}
            >
              <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

              <Callout onPress={() => handleNavigateToProfilePage(dev.github_username)}>
                <View style={styles.callout}>
                  <Text style={styles.devName}>{dev.name}</Text>
                  
                  <Text style={styles.devBio}>{dev.bio}</Text>

                  <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                </View>
              </Callout>
            </Marker>
          )
        }) }
      </MapView>

      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
          <MaterialIcons name="my-location" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View> 
    </KeyboardAvoidingView>
  );
};