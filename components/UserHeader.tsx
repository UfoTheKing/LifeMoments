import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { STORY_AVATAR_SIZE, STORY_HEADER_HEIGHT } from "./Story/Layout";
import { ScreenWidth } from "@/constants/Layout";
import { useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  username: string;
  profilePictureUrl: string | null;
  isVerified: boolean;

  bgc?: string;
  rightComponent?: React.ReactNode;
  paddingHorizontal?: number;
};

const UserHeader = (props: Props) => {
  const {
    username,
    profilePictureUrl,
    isVerified,
    bgc = "#fff",
    paddingHorizontal = 0,
  } = props;

  const colors = useTheme().colors;

  return (
    <View
      style={[
        {
          height: STORY_HEADER_HEIGHT,
          backgroundColor: bgc,
          width: ScreenWidth,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal,
        },
      ]}
    >
      <View style={styles.boxUserInfos}>
        <View style={styles.boxUserAvatar}>
          {profilePictureUrl ? (
            <Image
              source={{ uri: profilePictureUrl }}
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
          {isVerified ? (
            <TouchableOpacity>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                  {username}
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
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>{username}</Text>
          )}
        </View>
      </View>
      {props.rightComponent}
    </View>
  );
};

export default UserHeader;

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
