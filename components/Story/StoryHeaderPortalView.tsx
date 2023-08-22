import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Portal } from "react-native-portalize";
import { BlurView } from "expo-blur";
import {
  STORY_AVATAR_SIZE,
  STORY_HEADER_HEIGHT,
  STORY_USER_PREVIEW_VIEW_HEIGHT,
} from "./Layout";
import { ScreenHeight, ScreenWidth } from "@/constants/Layout";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

type Props = {
  cordinates: {
    x: number;
    y: number;
  };

  userId?: number | undefined;
  avatar?: string | undefined;
  username?: string | undefined;
  onDismiss?: () => void;
};

const StoryHeaderPortalView = (props: Props) => {
  const [TouchableOpacityTarget, setTouchableOpacityTarget] = React.useState<
    string | undefined
  >(undefined);

  const animatedStyle = useAnimatedStyle(() => {
    if (!props.userId) return {};
    let y = props.cordinates.y;
    let shouldAnimate = false;
    const isLessDistanceFromTop = y < 100;
    const isLessDistanceFromBottom =
      ScreenHeight - y < STORY_USER_PREVIEW_VIEW_HEIGHT + 50;

    if (isLessDistanceFromBottom) {
      y = y - STORY_USER_PREVIEW_VIEW_HEIGHT;
      shouldAnimate = true;
    }

    if (isLessDistanceFromTop) {
      y = y + STORY_HEADER_HEIGHT;
      shouldAnimate = true;
    }

    return {
      transform: [
        {
          translateY: shouldAnimate ? withTiming(y, { duration: 200 }) : y,
        },
      ],
    };
  }, [props.cordinates.y, props.userId]);

  if (!props.userId) return null;

  return (
    <Portal>
      <BlurView
        intensity={50}
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={(e) => {
            const { target } = e.nativeEvent;
            if (target === TouchableOpacityTarget) props.onDismiss?.();
          }}
          style={{
            flex: 1,
          }}
          activeOpacity={1}
          // @ts-ignore
          onLayout={(e) => setTouchableOpacityTarget(e.nativeEvent.target)}
        >
          <PanGestureHandler>
            <Animated.View
              style={[styles.viewStyle, animatedStyle]}
              onTouchStart={() => console.log("Go to user profile")}
            >
              <View style={styles.boxUserInfos}>
                <View
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    height: 48,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View style={styles.boxUserAvatar}>
                      <Image
                        source={{ uri: props.avatar }}
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          borderRadius: 100,
                        }}
                      />
                    </View>
                    <View style={styles.boxUserName}>
                      <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                        {props.username}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </TouchableOpacity>
      </BlurView>
    </Portal>
  );
};

export default StoryHeaderPortalView;

const styles = StyleSheet.create({
  viewStyle: {
    position: "absolute",
    backgroundColor: "red",
  },
  boxUserInfos: {
    paddingHorizontal: 12,
    //backgroundColor: "white",
    width: ScreenWidth,
    height: STORY_USER_PREVIEW_VIEW_HEIGHT,
    maxWidth: 375,
  },
  boxUserAvatar: {
    width: STORY_AVATAR_SIZE,
    height: STORY_AVATAR_SIZE,
    borderRadius: 100,
  },
  boxUserName: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 12,
  },
});
