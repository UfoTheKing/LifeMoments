import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";

type Props = {
  reactionsCount: number;
  emojiLineReactions?: Array<string>;
  onPressReactions?: () => void;
};

const StoryReactions = (props: Props) => {
  const { reactionsCount, emojiLineReactions, onPressReactions } = props;

  const lessText = React.useMemo(() => {
    if (reactionsCount >= 1000) {
      return `${Math.floor(reactionsCount / 1000)}k Reactions`;
    }

    return `${reactionsCount} Reactions`;
  }, [reactionsCount]);

  if (reactionsCount === 0) {
    return null;
  }

  return (
    <View style={styles.boxReactions}>
      {emojiLineReactions && emojiLineReactions.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {emojiLineReactions.map((emoji, index) => (
            <Text
              style={{
                ...styles.textEmoji,
                position: "relative",
                left: index === 0 ? 0 : index * -10,
              }}
            >
              {emoji}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={onPressReactions}>
        <Text style={styles.textReactionsCount}>{lessText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(StoryReactions);

const styles = StyleSheet.create({
  boxReactions: {
    // paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "flex-end",
    height: 40,
    flexDirection: "row",
    flex: 1,
  },
  textEmoji: {
    fontSize: 14,
  },
  textReactionsCount: {
    fontSize: 14,
    color: "#8e8e8e",
    fontWeight: "bold",
  },
  boxReaction: {
    width: 40,
    height: 40,
    borderColor: "#ededed",
    borderStyle: "dashed",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
