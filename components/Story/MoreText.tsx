import { FeedCaption } from "@/models/project/Feed";
import React, { useEffect, useState, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  caption: FeedCaption;
};

const MoreText = (props: Props) => {
  const startingHeight = 20;
  const [expander, setExpander] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(startingHeight);
  const animatedHeight = useRef(new Animated.Value(startingHeight)).current;

  // Prima dell'Read More mostro solo la prima riga: cioè prendo la prima stringa finchè non trovo il carattere \n
  const ReadLessText = React.useMemo(() => {
    const firstLine =
      props.caption && props.caption.text
        ? props.caption.text.split("\n")[0]
        : "";
    return firstLine;
  }, [props.caption.text]);

  const numberOfLines = React.useMemo(() => {
    if (!props.caption || !props.caption.text) return 0;
    return props.caption.text.split("\n").length;
  }, [props.caption.text]);

  useEffect(() => {
    // expanded?setText(props.text): setText(props.text.substring(0, 40));
    Animated.spring(animatedHeight, {
      friction: 100,
      toValue: expanded ? fullHeight : startingHeight,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const onTextLayout = (e: any) => {
    let { x, y, width, height } = e.nativeEvent.layout;
    height = Math.floor(height) + 40;
    if (height > startingHeight) {
      setFullHeight(height);
      setExpander(true);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.viewPort, { height: animatedHeight }]}>
        <View
          style={styles.textBox}
          onLayout={(e) => {
            onTextLayout(e);
          }}
        >
          <Text style={styles.text}>{props.caption.text}</Text>
        </View>
      </Animated.View>

      {numberOfLines > 1 && expander && !expanded && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readBtn}>
            {expanded ? "Read Less" : "Read More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    height: 60,
    left: 0,
    bottom: 20,
    right: 0,
  },
  container: {
    flex: 1,
  },
  viewPort: {
    flex: 1,
    overflow: "hidden",
  },
  textBox: {
    flex: 1,
    position: "absolute",
  },
  text: {
    color: "#000",
    alignSelf: "flex-start",
    textAlign: "justify",
    fontSize: 14,
  },
  readBtn: {
    flex: 1,
    alignSelf: "flex-end",
    color: "#737373",
    fontWeight: "500",
  },
});

export default MoreText;
