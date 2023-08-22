import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "@/components/Container";
import Item, {
  MY_STORY_ITEM_HEIGHT,
  MY_STORY_ITEM_WIDTH,
} from "@/components/Home/MyStoriesCarousel/Item";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { ScreenHeight, ScreenWidth } from "@/constants/Layout";
import { Box, useTheme } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { TabHomeScreenProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useInfiniteQuery } from "react-query";
import { FetchTimeline } from "@/api/routes/feed";
import { FlashList } from "@shopify/flash-list";
import Story from "@/components/Story/Story";

type Props = {};

let randomStories = [
  "https://picsum.photos/seed/1/200/300",
  "https://picsum.photos/seed/2/200/300",
  "https://picsum.photos/seed/3/200/300",
  "new_story",
];

const HomeScreen = ({ navigation }: TabHomeScreenProps<"Home">) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  const colors = useTheme().colors;
  const r = React.useRef<ICarouselInstance>(null);

  const {
    data: feeds,
    isLoading: isLoadingFeeds,
    isError: isErrorFeeds,
    fetchNextPage: fetchNextPageFeeds,
    isFetchingNextPage: isFetchingNextPageFeeds,
  } = useInfiniteQuery(
    ["feed", tokenApi],
    ({ pageParam = 1 }) => FetchTimeline(tokenApi, 10, pageParam),
    {
      enabled: isLoggedIn,
      getNextPageParam: (lastPage) => {
        return undefined;
      },
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );

  const onPressCreateStory = () => {
    navigation.navigate("CreateStory");
  };
  const onPressDeleteStory = () => {};

  return (
    <Container safeAreaTop={false} safeAreaBottom={false}>
      <FlashList
        ListHeaderComponent={
          <View style={styles.containerMyStories}>
            <Box
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  ...styles.textSectionTitle,
                  color: colors["secondary"][900],
                }}
              >
                Your Stories
              </Text>
              <Box
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 100,
                }}
              >
                <LinearGradient
                  colors={[colors["secondary"][900], "#c4d80f"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 100,
                  }}
                />
              </Box>
            </Box>
            <Carousel
              key={`my-stories-carousel`}
              ref={r}
              loop={false}
              style={{
                width: ScreenWidth,
                height: MY_STORY_ITEM_HEIGHT,
              }}
              width={MY_STORY_ITEM_WIDTH + 10}
              height={MY_STORY_ITEM_HEIGHT}
              data={randomStories}
              renderItem={({ item }) => {
                return (
                  <Item
                    uri={item}
                    onPressAdd={
                      item === "new_story" ? onPressCreateStory : undefined
                    }
                    onPressDelete={
                      item !== "new_story" ? onPressDeleteStory : undefined
                    }
                    isMultiple={Math.random() > 0.5}
                  />
                );
              }}
            />
          </View>
        }
        data={
          feeds && feeds.pages
            ? feeds.pages.map((page) => (page.train ? page.train : [])).flat()
            : []
        }
        estimatedItemSize={ScreenHeight * 0.8}
        renderItem={({ item }) => {
          return <Story item={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {}}
        onEndReachedThreshold={0.5}
        refreshing={false}
        onRefresh={() => {}}
        ListFooterComponent={
          <View
            style={{
              width: ScreenWidth,
              height: 100,
              backgroundColor: "red",
            }}
          />
        }
      />
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  containerMyStories: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    // height: 150,
  },

  textSectionTitle: {
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 33,
  },
});
