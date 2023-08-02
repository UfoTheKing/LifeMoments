import { ScreenWidth } from "@/constants/Layout";
import React, { useState, useEffect } from "react";
import { Animated, Easing, View } from "react-native";
import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from "react-native-tab-view";

export const TABBAR_HEIGHT = 60;

const TopTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<{
      key: string;
      title: string;
    }>;
  } & {
    tabBarVisible: boolean;
  }
) => {
  const [animValue] = useState(new Animated.Value(TABBAR_HEIGHT));
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let toValue = -TABBAR_HEIGHT;
    if (props.tabBarVisible) {
      toValue = 0;
    }
    Animated.timing(animValue, {
      toValue,
      duration: 240,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [props.tabBarVisible]);

  useEffect(() => {
    animValue.addListener(({ value }) => {
      setCurrentValue(value);
    });
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: animValue }] }}>
      <TabBar
        {...props}
        style={{
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          height: TABBAR_HEIGHT + currentValue,
          backgroundColor: "transparent",
        }}
        indicatorStyle={{ backgroundColor: "transparent" }}
        renderLabel={({ route, focused }) => (
          <View
            style={{
              width: ScreenWidth / 2,
              height: TABBAR_HEIGHT,
            }}
          >
            <Animated.Text
              style={{
                color: focused ? "#000" : "#ccc",
                fontWeight: focused ? "bold" : "normal",
                textAlign: "center",
              }}
            >
              {route.title}
            </Animated.Text>
          </View>
        )}
      />
    </Animated.View>
  );
};

export default TopTabBar;
