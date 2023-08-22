import { StyleSheet, View, useWindowDimensions } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import YourCirclesRoute from "@/components/Home/Your Circles/YourCirclesRoute";
import NeighborStories from "@/components/Home/Neighbor Stories/NeighborStories";
import { TabView } from "react-native-tab-view";
import TopTabBar from "@/components/Home/TopTabBar";
import * as Location from "expo-location";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";

type Props = {};

enum TabViewKeys {
  YourCircle = "first",
  NeighborStories = "second",
}

const HomeScreen = (props: Props) => {
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();

  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);

  const [index, setIndex] = React.useState(0);
  const [tabBarVisible, setTabBarVisible] = React.useState(true);
  const [swipeEnabled, setSwipeEnabled] = React.useState(true);
  const [routes] = React.useState([
    { key: TabViewKeys.YourCircle, title: "Your Circles" },
    { key: TabViewKeys.NeighborStories, title: "Neighbor Stories" },
  ]);

  // const { data, refetch } = useQuery(
  //   ["lastLocation", tokenApi],
  //   () => FetchLastUserLocation(tokenApi),
  //   {
  //     enabled: false,
  //   }
  // );

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // React.useEffect(() => {
  //   if (data) {
  //     if (data.location === null) {
  //       console.log("No location");
  //     } else if (data.location) {
  //       console.log("Location: ", data.location);
  //     }
  //   }
  // }, [data]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (isLoggedIn) {
  //       refetch();
  //     }
  //   }, [])
  // );

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
            // lastLocation={data?.location}
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
      {/* <YourCirclesRoute
        isTabBarVisible={tabBarVisible}
        hideTopTabBar={() => {
          setTabBarVisible(false);
          setSwipeEnabled(false);
        }}
        showTopTabBar={() => {
          setTabBarVisible(true);
          setSwipeEnabled(true);
        }}
      /> */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  blurContainer: {
    flex: 1,
  },
});
