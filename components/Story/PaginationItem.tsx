import { useTheme } from "native-base";
import React from "react";
import { View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const PaginationItem: React.FC<{
  index: number;
  length: number;
  animValue: Animated.SharedValue<number>;
  selectedIndex: number;
}> = (props) => {
  const colors = useTheme().colors;

  const { animValue, index, length, selectedIndex } = props;
  const width = 36;

  let focused = selectedIndex === index;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: focused ? colors.secondary[900] : colors.gray[300],
        marginRight: 5,
        width,
        height: 6,
        borderRadius: 2,
        overflow: "hidden",
        transform: [
          {
            rotateZ: "0deg",
          },
        ],
      }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 2,

            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

export default PaginationItem;
