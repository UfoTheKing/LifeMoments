import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import YourCirclesRoute from "@/components/Home/Your Circles/YourCirclesRoute";
import NeighborStories from "@/components/Home/Neighbor Stories/NeighborStories";
import { TabView } from "react-native-tab-view";
import TopTabBar from "@/components/Home/TopTabBar";

type Props = {};

enum TabViewKeys {
  YourCircle = "first",
  NeighborStories = "second",
}

const HomeScreen = (props: Props) => {
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [tabBarVisible, setTabBarVisible] = React.useState(true);
  const [swipeEnabled, setSwipeEnabled] = React.useState(true);
  const [routes] = React.useState([
    { key: TabViewKeys.YourCircle, title: "Your Circles" },
    { key: TabViewKeys.NeighborStories, title: "Neighbor Stories" },
  ]);

  const renderScene = ({
    route,
  }: {
    route: { key: string; title: string };
  }) => {
    switch (route.key) {
      case TabViewKeys.YourCircle:
        return (
          <YourCirclesRoute
            isTabBarVisible={tabBarVisible}
            hideTopTabBar={() => {
              setTabBarVisible(false);
              setSwipeEnabled(false);
            }}
            showTopTabBar={() => {
              setTabBarVisible(true);
              setSwipeEnabled(true);
            }}
          />
        );
      case TabViewKeys.NeighborStories:
        return (
          <NeighborStories
            hideTopTabBar={() => {
              setTabBarVisible(false);
              setSwipeEnabled(false);
            }}
            showTopTabBar={() => {
              setTabBarVisible(true);
              setSwipeEnabled(true);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        // paddingTop: insets.top,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        flex: 1,
        backgroundColor: "#f7f7f7",
      }}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={swipeEnabled}
        renderTabBar={(props) => (
          <TopTabBar {...props} tabBarVisible={tabBarVisible} />
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
