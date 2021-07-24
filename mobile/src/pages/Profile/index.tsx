import React from 'react';

import { useRoute } from '@react-navigation/native';

import { WebView } from 'react-native-webview';

import styles from './styles';

type ProfileRouteParams = {
  github_username: string;
}

export function Profile() { 
  const route = useRoute();

  const params = route.params as ProfileRouteParams;

  return (
    <WebView style={styles.map} source={{ uri: `https://github.com/${params.github_username}` }} />
  );
};