import React from 'react';
import { AppState, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { focusManager, onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { QueryProvider, refreshLocalData } from '@8848digital/catalyst';
import { RootNavigator } from './src/navigation/RootNavigator';

AppState.addEventListener('change', status => {
  focusManager.setFocused(status === 'active');
});

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => setOnline(!!state.isConnected));
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <QueryProvider>
        {/* Re-read local SQLite data on every navigation transition. Native-stack
            keeps screens mounted (no remount-on-focus like web's router), so a
            returned-to screen would otherwise show a stale snapshot. */}
        <NavigationContainer onStateChange={() => refreshLocalData()}>
          <RootNavigator />
        </NavigationContainer>
      </QueryProvider>
    </SafeAreaProvider>
  );
}

export default App;
