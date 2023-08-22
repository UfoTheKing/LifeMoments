import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { FetchPhotos } from "@/api/client";
import Story from "@/components/Story/Story";

type Props = {
  isTabBarVisible: boolean;
  hideTopTabBar: () => void;
  showTopTabBar: () => void;
};

const YourCirclesRoute = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [isScrollEnabled, setIsScrollEnabled] = useState<boolean>(true);

  const getData = async () => {
    setIsLoading(true);
    let d = await FetchPhotos();
    setData(d);
    setIsLoading(false);
  };

  React.useEffect(() => {
    getData();
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Se l'utente scrolla verso il basso dopo 125px nascondi la top tab bar
    if (e.nativeEvent.contentOffset.y > 125) {
      props.hideTopTabBar();
    } else {
      props.showTopTabBar();
    }
  };

  return (
    <View
      style={{
        ...styles.container,
      }}
    >
      <FlatList
        data={data}
        renderItem={({ item, index }) => <Story item={item} index={index} />}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isScrollEnabled}
        refreshing={isLoading}
        onRefresh={getData}
      />
    </View>
  );
};

export default YourCirclesRoute;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
