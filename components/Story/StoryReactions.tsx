import { StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { ReactionItems } from "@/api/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Reaction } from "react-native-reactions";
import { EmojiItemProp } from "react-native-reactions/lib/components/ReactionView/types";

type Props = {
  index?: number;
  reaction?: EmojiItemProp;
  setSelectedEmoji?: (e: EmojiItemProp | undefined) => void;
};

const StoryReactions = (props: Props) => {
  const { reaction, index, setSelectedEmoji } = props;

  return (
    <View style={styles.boxReactions}>
      <View
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Reaction
          items={ReactionItems}
          onTap={setSelectedEmoji}
          itemIndex={index}
        >
          {reaction ? (
            <Text style={styles.textEmoji}>{reaction.emoji}</Text>
          ) : (
            <View style={styles.boxReaction}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} />
            </View>
          )}
        </Reaction>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 40,
        }}
      >
        <Text style={styles.textReactionsCount}>1.2k Reactions</Text>
      </View>
    </View>
  );
};

export default memo(StoryReactions);

const styles = StyleSheet.create({
  boxReactions: {
    // paddingHorizontal: 16,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textEmoji: {
    fontSize: 24,
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
