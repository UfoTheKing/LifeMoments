import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { STORY_AVATAR_SIZE, STORY_HEADER_HEIGHT } from "./Layout";
import { ScreenWidth } from "@/constants/Layout";
import { FeedUser } from "@/models/project/Feed";
import { useTheme } from "native-base";

interface StoryHeaderProps {
  user: FeedUser;
  location: string;
  posted: string;
}

const StoryHeader = (props: StoryHeaderProps) => {
  const { user, location, posted } = props;

  const colors = useTheme().colors;

  return (
    <View
      style={[
        {
          height: STORY_HEADER_HEIGHT,
          backgroundColor: "#f7f7f7",
          width: ScreenWidth,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
    >
      <View style={styles.boxUserInfos}>
        <View style={styles.boxUserAvatar}>
          {user && user.profilePictureUrl ? (
            <Image
              source={{ uri: user.profilePictureUrl }}
              style={{ ...StyleSheet.absoluteFillObject, borderRadius: 100 }}
            />
          ) : (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                borderRadius: 100,
                backgroundColor: "#d2d2d2",
              }}
            />
          )}
        </View>
        <View style={styles.boxUserName}>
          {user.isVerified ? (
            <TouchableOpacity>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                  {user.username}
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.primary[900]}
                  style={{ marginLeft: 4 }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              {user.username}
            </Text>
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
    </View>
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
