import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { ScreenWidth } from "@/constants/Layout";
import { Image, Text } from "react-native";
import { BlurView } from "expo-blur";

type Props = {
  hideTopTabBar: () => void;
  showTopTabBar: () => void;
};

const NeighborStories = (props: Props) => {
  const [elements] = useState(new Array(100).fill(0));

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Se l'utente scrolla verso il basso dopo 125px nascondi la top tab bar
    if (e.nativeEvent.contentOffset.y > 125) {
      props.hideTopTabBar();
    } else {
      props.showTopTabBar();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={elements}
        renderItem={() => null}
        keyExtractor={(_, index) => index.toString()}
        onScroll={handleScroll}
      />
    </View>
  );
};

export default NeighborStories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  box: {
    width: ScreenWidth,
    height: 100,
    backgroundColor: "blue",
    marginBottom: 10,
  }
});
