import * as React from "react";
import { StyleSheet } from "react-native";

import "react-native-gesture-handler";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import RootNavigation from "@/navigation";

import { NativeBaseProvider } from "native-base";
import { theme } from "@/utils/theme";

import { QueryClient, QueryClientProvider } from "react-query";

import Toast from "react-native-toast-message";

import { store } from "@/business/redux/app/store";
import { Provider } from "react-redux";
import useCachedResources from "@/hooks/useCachedResources";
import { Host } from "react-native-portalize";
// Hold Menu
import { HoldMenuProvider } from "react-native-hold-menu";

const queryClient = new QueryClient();

export default function App() {
  const { isLoadingComplete, data } = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider style={styles.container}>
          <GestureHandlerRootView style={styles.container}>
            <NativeBaseProvider theme={theme}>
              <NavigationContainer>
                <BottomSheetModalProvider>
                  <Host>
                    <RootNavigation data={data} />
                    <Toast />
                  </Host>
                </BottomSheetModalProvider>
              </NavigationContainer>
            </NativeBaseProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
