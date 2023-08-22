import { StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import { ScreenWidth } from "@/constants/Layout";
import { UserLocation } from "@/models/resources/UserLocation";

type Props = {
  hideTopTabBar: () => void;
  showTopTabBar: () => void;

  lastLocation?: UserLocation | null;
};

const NeighborStories = (props: Props) => {
  return <View style={styles.container}></View>;
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
  },
});
