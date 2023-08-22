import { StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Portal } from "react-native-portalize";
import { BlurView } from "expo-blur";
import { ScreenHeight, ScreenWidth } from "@/constants/Layout";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  cordinates: {
    x: number;
    y: number;
  };
  layoutHeight: number;
  image: string | undefined;
  onDismiss?: () => void;
  onPressEmoji?: (emoji: string) => void;
};

const StoryPortalView = (props: Props) => {
  const scale = useSharedValue(0);

  const [defaultEmojis] = React.useState<string[]>([
    "❤️",
    "😍",
    "😂",
    "😢",
    "😡",
    "👍",
  ]);
  const [emojis, setEmojis] = React.useState<string[]>([]);

  React.useEffect(() => {
    scale.value = withSpring(1);
  }, [props.image]);

  const getUserEmojis = async (): Promise<string[]> => {
    try {
      const value = await AsyncStorage.getItem("@emojis");
      if (value !== null) {
        let emojis: string[] = JSON.parse(value);
        return emojis;
      }

      return defaultEmojis;
    } catch (e) {
      // error reading value
      return defaultEmojis;
    }
  };

  React.useEffect(() => {
    const boostrap = async () => {
      let emojis = await getUserEmojis();
      setEmojis(emojis);
    };

    boostrap();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    let y = props.cordinates.y;
    let shouldAnimate = false;
    const isLessDistanceFromTop = y < 100;
    const isLessDistanceFromBottom =
      ScreenHeight - y < props.layoutHeight + 100;

    if (isLessDistanceFromBottom) {
      y = (ScreenHeight - props.layoutHeight) / 2; // Lo metto al centro
      shouldAnimate = true;
    }

    if (isLessDistanceFromTop) {
      y = (ScreenHeight - props.layoutHeight) / 2; // Lo metto al centro
      shouldAnimate = true;
    }

    return {
      transform: [
        {
          translateY: shouldAnimate
            ? withTiming(y, {
                duration: 1000,
              })
            : y,
        },
      ],
    };
  }, [props.cordinates.y, props.layoutHeight, props.image]);

  const textStyle = useAnimatedStyle(() => {
    return {
      fontSize: 35,
      transform: [
        {
          scale: scale.value,
        },
        {
          translateY: interpolate(scale.value, [0, 1], [50, 0]),
        },
      ],
    };
  }, [props.cordinates.y, props.layoutHeight, props.image]);

  const reactionStyle = useAnimatedStyle(() => {
    let y = props.cordinates.y;
    let standardY = props.cordinates.y - 100;
    let shouldAnimate = false;
    const isLessDistanceFromTop = y < 100;
    const isLessDistanceFromBottom =
      ScreenHeight - y < props.layoutHeight + 100;

    if (isLessDistanceFromBottom) {
      y = (ScreenHeight - props.layoutHeight) / 2 - 100; // Lo metto al centro
      shouldAnimate = true;
    }

    if (isLessDistanceFromTop) {
      y = (ScreenHeight - props.layoutHeight) / 2 - 100; // Lo metto al centro
      shouldAnimate = true;
    }

    return {
      transform: [
        {
          translateY: shouldAnimate
            ? withTiming(y, {
                duration: 1000,
              })
            : standardY,
        },
      ],
    };
  }, [props.cordinates.y, props.layoutHeight, props.image]);

  return (
    <Portal>
      <BlurView
        intensity={50}
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={props.onDismiss}
          style={{
            flex: 1,
          }}
          activeOpacity={1}
        >
          <Animated.View style={[styles.reaction, reactionStyle]}>
            {emojis.map((emoji, index) => {
              return (
                <Animated.Text
                  key={index}
                  style={textStyle}
                  onPress={() => props.onPressEmoji?.(emoji)}
                >
                  {emoji}
                </Animated.Text>
              );
            })}
          </Animated.View>
          <Animated.View style={[styles.imageContainer, animatedStyle]}>
            <Image
              source={{
                uri: props.image,
              }}
              style={{
                width: ScreenWidth,
                height: props.layoutHeight,
              }}
            />
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
    </Portal>
  );
};

export default StoryPortalView;

const styles = StyleSheet.create({
  imageContainer: {
    position: "absolute",
  },
  reaction: {
    position: "absolute",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 50,
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },
});
