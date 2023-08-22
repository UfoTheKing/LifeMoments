import {
  StyleSheet,
  View,
  Image,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { ScreenHeight, ScreenWidth } from "@/constants/Layout";
import StoryHeader from "./StoryHeader";
import StoryReactions from "./StoryReactions";
import { STORY_HEADER_HEIGHT } from "./Layout";
import MoreText from "./MoreText";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBackdrop from "../BottomSheetModal/CustomBackdrop";
import BottomSheetModalHeader from "../BottomSheetModal/BottomSheetModalHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, IconButton, Input } from "native-base";
import { PlaceHolderColor } from "@/screens/Auth/AuthInsertUsername";
import { FontAwesome } from "@expo/vector-icons";
import StoryReactionsCarousel from "./StoryReactionsCarousel";
import { Feed } from "@/models/project/Feed";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import PaginationItem from "./PaginationItem";
import StoryPortalView from "./StoryPortalView";
import { useInfiniteQuery, useMutation } from "react-query";
import { CreateStoryReaction } from "@/models/dto/Stories";
import { SendStoryReaction } from "@/api/routes/stories";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";

type Props = {
  item: Feed;
};

const comments = [
  {
    is_covered: false,
    media_id: "3170100864483512053",
    has_liked_comment: false,
    comment_like_count: 63,
    pk: "18009596164876744",
    user_id: "378771524",
    user: {
      pk: "378771524",
      pk_id: "378771524",
      username: "andreaxchaparro",
      full_name: "ACH",
      is_private: false,
      fbid_v2: "17841400585725918",
      is_verified: true,
      profile_pic_id: "3170527595464233352_378771524",
      profile_pic_url:
        "https://scontent-mxp2-1.cdninstagram.com/v/t51.2885-19/367707579_816330436708738_6032414479970249552_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-mxp2-1.cdninstagram.com&_nc_cat=110&_nc_ohc=lyxfp_8OV0oAX862KzJ&edm=ALQROFkBAAAA&ccb=7-5&cb_e2o_trans=t&oh=00_AfDhEFmo0pqbuUOE79JaMCXGVBnUGNkTQLqGeVyGUtcJng&oe=64E0D991&_nc_sid=fc8dfb",
    },
    type: 0,
    text: "so wow",
    did_report_as_spam: false,
    created_at: 1692126171,
    created_at_utc: 1692126171,
    content_type: "comment",
    status: "Active",
    bit_flags: 0,
    share_enabled: false,
    is_ranked_comment: false,
    private_reply_status: 0,
  },
];

const Story = (props: Props) => {
  const { item } = props;

  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  const r = React.useRef<ICarouselInstance>(null);

  const insets = useSafeAreaInsets();

  const reactStoryMutation = useMutation(
    (data: CreateStoryReaction) => SendStoryReaction(tokenApi, data),
    {
      onSuccess: (data) => {
        if (item.hasReacted) {
          // Se aveva già reagito, allora non faccio nulla
        } else {
          item.hasReacted = true;
          item.reactionsCount += 1;
        }
      },
    }
  );

  const [comment, setComment] = React.useState("");

  const progressValue = useSharedValue<number>(0);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const [storyImageCordinates, setStoryImageCordinates] = React.useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [selectedStoryImage, setSelectedStoryImage] = React.useState<
    string | undefined
  >(undefined);
  const [imageHeight, setImageHeight] = React.useState<number | undefined>(
    undefined
  );

  const showTextAllComments = React.useMemo(() => {
    if (item.commentsCount === 0) return false;

    if (item.commentsCount - item.comments.length === 0) return false;

    return true;
  }, [item.comments, item.commentsCount]);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalReactionsRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["90%"], []);

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

  const handlePresentModalReactionsPress = useCallback(() => {
    bottomSheetModalReactionsRef.current?.present();
  }, []);
  const handleDismissModalReactionsPress = useCallback(() => {
    bottomSheetModalReactionsRef.current?.dismiss();
  }, []);
  const renderBackdropReactions = React.useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={handleDismissModalReactionsPress}
      />
    ),
    []
  );

  const onLongPress = (e: GestureResponderEvent) => {
    const { pageY, locationY } = e.nativeEvent;
    let y = pageY - locationY;

    setStoryImageCordinates({
      x: 0,
      y: y,
    });
    setSelectedStoryImage(
      item.carouselMedia ? item.carouselMedia[0].image : item.image
    );
  };

  const onPressEmoji = (emoji: string) => {
    setSelectedStoryImage(undefined);

    let data: CreateStoryReaction = {
      storyId: item.id,
      reaction: emoji,
    };

    reactStoryMutation.mutate(data);
  };

  return (
    <View style={styles.box}>
      <View style={styles.boxPostHeader}>
        <StoryHeader
          user={item.user}
          location={
            item.location.name.length > 30
              ? item.location.shortName
              : item.location.name
          }
          posted={item.posted}
        />
      </View>

      <TouchableOpacity onLongPress={onLongPress} style={styles.boxImage}>
        {item.carouselMediaCount &&
        item.carouselMediaCount > 1 &&
        item.carouselMedia ? (
          <>
            <Carousel
              key={`${item.carouselMedia[0].key}-carousel`}
              ref={r}
              loop={false}
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
              width={ScreenWidth}
              height={ScreenHeight * 0.45}
              data={item.carouselMedia}
              onProgressChange={(_, absoluteProgress) => {
                {
                  progressValue.value = absoluteProgress;
                  setSelectedIndex(Math.round(absoluteProgress));
                }
              }}
              renderItem={({ item }) => {
                return (
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      ...StyleSheet.absoluteFillObject,
                    }}
                    onLayout={(e) =>
                      setImageHeight(e.nativeEvent.layout.height)
                    }
                  />
                );
              }}
            />
          </>
        ) : item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{
              width: ScreenWidth,
              height: ScreenHeight * 0.45,
            }}
            onLayout={(e) => setImageHeight(e.nativeEvent.layout.height)}
          />
        ) : null}
      </TouchableOpacity>
      <View style={styles.paginationContainer}>
        {item.carouselMedia?.map((_, index) => {
          return (
            <PaginationItem
              animValue={progressValue}
              index={index}
              key={index}
              length={item.carouselMediaCount || 0}
              selectedIndex={selectedIndex}
            />
          );
        })}
      </View>
      <View style={styles.boxInteractions}>
        <StoryReactions
          reactionsCount={item.reactionsCount}
          emojiLineReactions={
            item.emojiLineReactions
              ? item.emojiLineReactions.map((reaction) => reaction.emoji)
              : undefined
          }
          onPressReactions={handlePresentModalReactionsPress}
        />
        {item.caption && item.caption.text && item.caption.text.length > 0 ? (
          <MoreText caption={item.caption} />
        ) : null}
        {showTextAllComments && (
          <View style={{ marginTop: 8 }}>
            <TouchableWithoutFeedback onPress={handlePresentModalPress}>
              <Text style={styles.textCountComments}>
                Show all and {item.commentsCount} comments
              </Text>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>

      {selectedStoryImage && imageHeight && (
        <StoryPortalView
          onDismiss={() => setSelectedStoryImage(undefined)}
          image={selectedStoryImage}
          cordinates={storyImageCordinates}
          layoutHeight={imageHeight}
          onPressEmoji={onPressEmoji}
        />
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        // footerComponent={renderFooter}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "height" : "height"}
          keyboardVerticalOffset={150 - insets.bottom}
          style={{ flex: 1 }}
          onTouchStart={() => Keyboard.dismiss()}
        >
          <BottomSheetModalHeader
            title="Comments"
            subitle={item.commentsCount + " comments"}
            showDivider={true}
            showCancel={true}
            onPressCancel={handleDismissModalPress}
          />
          <FlatList
            data={comments}
            renderItem={({ item }) => {
              return <Text style={{ color: "black" }}>{item.text}</Text>;
            }}
            keyExtractor={(item) => item.pk}
          />
          <View
            style={{
              height: 150,
              borderTopWidth: 0.5,
              borderTopColor: "#d3d3d3",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              // marginBottom: 100,
            }}
          >
            <View
              style={{
                flex: 2,
                height: 150,
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "red",
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
                // backgroundColor: "blue",
              }}
            >
              <Input
                variant="filled"
                placeholder="Add a comment..."
                placeholderTextColor={PlaceHolderColor}
                style={{
                  width: "100%",
                  height: 50,
                  backgroundColor: "transparent",
                  color: "#000",
                  fontSize: 16,
                }}
                rounded={15}
                value={comment}
                onChangeText={(text) => setComment(text)}
              />
            </View>
            <View
              style={{
                flex: 1,
                height: 150,
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "green",
              }}
            >
              <IconButton
                variant="solid"
                rounded={100}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                size="sm"
                isDisabled={comment.length === 0}
                onPress={() => {
                  console.log("comment", comment);
                }}
              >
                <FontAwesome name="send" size={16} color="black" />
              </IconButton>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={bottomSheetModalReactionsRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdropReactions}
      >
        <StoryReactionsCarousel item={item} />
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
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    width: ScreenWidth,
    justifyContent: "center",
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
