import { StyleSheet, Image, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  uri: string;

  isMultiple?: boolean;

  onPressAdd?: () => void;
  onPressDelete?: () => void;
};

export const MY_STORY_ITEM_WIDTH = 72;
export const MY_STORY_ITEM_HEIGHT = 96;

const Item = (props: Props) => {
  const { isMultiple = false } = props;

  return (
    <View style={styles.container}>
      {props.uri === "new_story" ? (
        <TouchableOpacity
          style={{
            ...styles.container,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={props.onPressAdd}
        >
          <Ionicons name="md-add" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <Image source={{ uri: props.uri }} style={styles.image} />
      )}

      {props.uri !== "new_story" && (
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity onPress={props.onPressDelete}>
            <MaterialIcons name="delete" size={18} color="white" />
          </TouchableOpacity>
        </View>
      )}
      {isMultiple && props.uri !== "new_story" && (
        <View style={styles.multipleContainer}>
          <MaterialIcons name="view-carousel" size={18} color="white" />
        </View>
      )}
    </View>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    width: MY_STORY_ITEM_WIDTH,
    height: MY_STORY_ITEM_HEIGHT,
    borderRadius: 14,
    backgroundColor: "#C4C4C4",
  },
  image: {
    width: MY_STORY_ITEM_WIDTH,
    height: MY_STORY_ITEM_HEIGHT,
    borderRadius: 14,
  },
  deleteButtonContainer: {
    position: "absolute",
    width: 18,
    height: 18,
    bottom: 5,
    right: 5,
  },
  multipleContainer: {
    position: "absolute",
    width: 18,
    height: 18,
    top: 5,
    right: 5,
  },
});
