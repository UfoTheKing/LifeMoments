import * as React from "react";
import { View, Pressable, Text } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import { ScreenWidth } from "@/constants/Layout";
import { Feed } from "@/models/project/Feed";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { GetStoryReactions } from "@/api/routes/stories";
import { Divider, Spinner } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { STORY_HEADER_HEIGHT } from "./Layout";
import UserHeader from "../UserHeader";

const PAGE_WIDTH = 100;
const PAGE_HEIGHT = 40;

type StoryReactionsCarouselProps = {
  item: Feed;
};

function StoryReactionsCarousel(props: StoryReactionsCarouselProps) {
  const { item } = props;

  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  const r = React.useRef<ICarouselInstance>(null);

  const [selectedEmojiKey, setSelectedEmojiKey] = React.useState<
    string | undefined
  >(undefined);

  const [header, setHeader] = React.useState<
    | {
        [key: string]: {
          emoji: string;
          count: number;
        };
      }
    | undefined
  >(undefined);

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [
      "story",
      item.id,
      "reactions",
      selectedEmojiKey ? selectedEmojiKey : "all",
      tokenApi,
    ],
    ({ pageParam = 1 }) =>
      GetStoryReactions(tokenApi, item.id, selectedEmojiKey, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.hasMore) {
          return lastPage.pagination.page + 1;
        }
        return undefined;
      },
    }
  );

  React.useEffect(() => {
    if (data && data.pages.length > 0 && data.pages[0].header) {
      setHeader(data.pages[0].header);
    }
  }, [data]);

  React.useEffect(() => {
    refetch();
  }, [selectedEmojiKey]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner size="sm" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 25,
      }}
    >
      <Carousel
        key={`story-${item.id}-reactions-header`}
        ref={r}
        loop={false}
        style={{
          width: ScreenWidth,
          height: PAGE_HEIGHT,
        }}
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        data={header ? Object.keys(header) : []}
        onSnapToItem={(index) => {
          if (index === 0) {
            setSelectedEmojiKey(undefined);
          } else {
            setSelectedEmojiKey(Object.keys(header ?? {})[index]);
          }
        }}
        renderItem={({ item, animationValue }) => {
          let headerItem = header ? header[item] : undefined;
          if (!headerItem) return <></>;

          return (
            <Item
              animationValue={animationValue}
              label={headerItem.emoji}
              count={headerItem.count}
              onPress={() =>
                r.current?.scrollTo({
                  count: animationValue.value,
                  animated: true,
                })
              }
            />
          );
        }}
      />

      <Divider my={2} />

      <View style={{ flex: 1 }}>
        {isRefetching ? (
          <Spinner size="sm" />
        ) : (
          <FlashList
            data={
              data && data.pages && data.pages.length > 0
                ? data.pages
                    .map((page) => (page.reactions ? page.reactions : []))
                    .flat()
                : []
            }
            renderItem={({ item }) => {
              return (
                <UserHeader
                  key={`story-${props.item.id}-reaction-${item.user.id}`}
                  username={item.user.username}
                  profilePictureUrl={item.user.profilePictureUrl}
                  isVerified={item.user.isVerified}
                  rightComponent={
                    <View
                      style={{
                        height: STORY_HEADER_HEIGHT,
                        width: 70,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 30, color: "#26292E" }}>
                        {item.reaction.emoji}
                      </Text>
                    </View>
                  }
                  paddingHorizontal={15}
                />
              );
            }}
            keyExtractor={(_, index) => index.toString()}
            estimatedItemSize={STORY_HEADER_HEIGHT}
            onEndReached={() => {
              if (hasNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? <Spinner size="sm" /> : undefined
            }
            ItemSeparatorComponent={() => <Divider my={2} />}
          />
        )}
      </View>
    </View>
  );
}

export default StoryReactionsCarousel;

interface Props {
  animationValue: Animated.SharedValue<number>;
  label: string;
  count: number;
  onPress?: () => void;
}

const Item: React.FC<Props> = (props) => {
  const { animationValue, label, count, onPress } = props;

  const translateY = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  }, [animationValue]);

  const labelStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [1, 1.25, 1],
      Extrapolate.CLAMP
    );

    const color = interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      ["#b6bbc0", "#0071fa", "#b6bbc0"]
    );

    return {
      transform: [{ scale }, { translateY: translateY.value }],
      color,
    };
  }, [animationValue, translateY]);

  const onPressIn = React.useCallback(() => {
    translateY.value = withTiming(-8, { duration: 250 });
  }, [translateY]);

  const onPressOut = React.useCallback(() => {
    translateY.value = withTiming(0, { duration: 250 });
  }, [translateY]);

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
            height: PAGE_HEIGHT,
          },
          containerStyle,
        ]}
      >
        <Animated.Text style={[{ fontSize: 14, color: "#26292E" }, labelStyle]}>
          {label} {count}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};
