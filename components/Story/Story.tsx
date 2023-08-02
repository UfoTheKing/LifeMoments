import { StyleSheet, View, Image, Text } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { ScreenHeight, ScreenWidth } from "@/constants/Layout";
import StoryHeader from "./StoryHeader";
import StoryReactions from "./StoryReactions";
import { EmojiItemProp } from "react-native-reactions/lib/components/ReactionView/types";
import { STORY_HEADER_HEIGHT } from "./Layout";
import MoreText from "./MoreText";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import CustomBackdrop from "../BottomSheetModal/CustomBackdrop";
import BottomSheetModalHeader from "../BottomSheetModal/BottomSheetModalHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  item: any;
  index: number;
  setSelectedEmoji?: (e: EmojiItemProp | undefined) => void;
};

const Story = (props: Props) => {
  const { item, index, setSelectedEmoji } = props;

  const insets = useSafeAreaInsets();

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["70%", "90%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const renderBackdrop = React.useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={handleDismissModalPress}
      />
    ),
    []
  );
  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <View
          style={{
            height: 150,
            borderTopWidth: 0.5,
            borderTopColor: "#d3d3d3",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flex: 2,
              height: 150,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "red",
            }}
          >
            <Image
              source={{
                uri: "https://www.w3schools.com/howto/img_avatar.png",
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
          </View>
          <View
            style={{
              flex: 6,
              height: 150,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "blue",
            }}
          ></View>
          <View
            style={{
              flex: 1,
              height: 150,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "green",
            }}
          ></View>
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  return (
    <View style={styles.box}>
      <View style={styles.boxPostHeader}>
        <StoryHeader
          avatar={item.avatar}
          username={item.username}
          isVerified={item.userIsVerified}
          location={item.location}
          posted={item.posted}
        />
      </View>

      <View style={styles.boxImage}>
        <Image
          source={{ uri: item.url }}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
      </View>
      <View style={styles.boxInteractions}>
        <StoryReactions
          index={index}
          reaction={item.reaction}
          setSelectedEmoji={setSelectedEmoji}
        />
        <MoreText text={item.caption.text} />
        <View style={{ marginTop: 8 }}>
          <TouchableWithoutFeedback onPress={handlePresentModalPress}>
            <Text style={styles.textCountComments}>
              Show all and {item.commentsCount} comments
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <BottomSheetModalHeader
            title="Comments"
            subitle={item.commentsCount + " comments"}
            showDivider={true}
            showCancel={true}
            onPressCancel={handleDismissModalPress}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default Story;

const styles = StyleSheet.create({
  box: {
    width: ScreenWidth,
    // minHeight: ScreenHeight * 0.7,
    paddingBottom: 20,
    marginBottom: 12,
    // height: ScreenHeight * 0.9,
  },

  boxPostHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: STORY_HEADER_HEIGHT,
  },

  boxImage: {
    width: ScreenWidth,
    height: ScreenHeight * 0.45,
  },

  boxInteractions: {
    width: ScreenWidth,
    marginTop: 4,
    paddingHorizontal: 16,
  },

  textMore: {
    color: "#737373",
    fontSize: 14,
  },

  textCountComments: {
    color: "#737373",
    fontSize: 14,
  },
});
