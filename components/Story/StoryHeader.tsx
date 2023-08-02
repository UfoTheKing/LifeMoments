import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { STORY_AVATAR_SIZE, STORY_HEADER_HEIGHT } from "./Layout";

interface StoryHeaderProps {
  avatar: string;
  username: string;
  isVerified?: boolean;
  location: string;
  posted: string;
}

const StoryHeader = (props: StoryHeaderProps) => {
  const { avatar, username, isVerified = false, location, posted } = props;

  return (
    <>
      <View style={styles.boxUserInfos}>
        <View style={styles.boxUserAvatar}>
          <Image
            source={{ uri: avatar }}
            style={{ ...StyleSheet.absoluteFillObject, borderRadius: 100 }}
          />
        </View>
        <View style={styles.boxUserName}>
          {isVerified ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {username}
              </Text>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#2e86c1"
                style={{ marginLeft: 4 }}
              />
            </View>
          ) : (
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>{username}</Text>
          )}

          <Text style={{ fontSize: 12, color: "#737373" }}>
            {location} • {posted}
          </Text>
        </View>
      </View>
      <View style={styles.boxUserActions}>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default StoryHeader;

const styles = StyleSheet.create({
  boxUserInfos: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
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
  boxUserActions: {
    width: 40,
    height: 40,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
