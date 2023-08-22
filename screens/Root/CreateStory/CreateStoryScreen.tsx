import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Camera, CameraType, FlashMode } from "expo-camera";
import Container from "@/components/Container";
import { useTheme } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeight, ScreenWidth } from "@/constants/Layout";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { RootStackScreenProps } from "@/types";

type Props = {};

const CreateStoryScreen = ({
  navigation,
}: RootStackScreenProps<"CreateStory">) => {
  const cameraRef = React.useRef<Camera>(null);

  const colors = useTheme().colors;
  const insets = useSafeAreaInsets();

  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [firstImage, setFirstImage] = useState<string | null>(null);

  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

  const [imageToUse, setImageToUse] = useState<string | null>(null);

  React.useEffect(() => {
    requestPermission();
    requestMediaLibraryPermission();
  }, []);

  React.useEffect(() => {
    const getFirstImage = async () => {
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: MediaLibrary.MediaType.photo,
      });

      if (assets.length > 0) {
        setFirstImage(assets[0].uri);
      }
    };

    if (mediaLibraryPermission && mediaLibraryPermission.granted) {
      getFirstImage();
    }
  }, [mediaLibraryPermission]);

  if (!permission) {
    // Camera permissions are still loading
    return null;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet

    return (
      <Container textCenter>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          We need your permission to show the camera
        </Text>
      </Container>
    );
  }

  const toggleCameraType = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  const toggleFlashMode = () => {
    setFlashMode(flashMode === FlashMode.off ? FlashMode.torch : FlashMode.off);
  };

  const takePictureAsync = async () => {
    if (cameraRef && cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1,
        // base64: true,
      });

      setImageToUse(uri);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageToUse(result.assets[0].uri);
    }
  };

  if (imageToUse) {
    return (
      <Container textCenter>
        <Image
          source={{
            uri: imageToUse,
          }}
          style={{
            width: 100,
            height: 100,
          }}
        />
      </Container>
    );
  }

  return (
    <Container
      safeAreaBottom={true}
      safeAreaLeft={false}
      safeAreaRight={false}
      safeAreaTop={false}
    >
      <View
        style={{
          height: insets.top,
          width: ScreenWidth,
          backgroundColor: "#f7f7f7",
          // borderBottomLeftRadius: 10,
          // borderBottomRightRadius: 10,
          position: "relative",
          zIndex: 1,
          // top: 10,
        }}
      />
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={type}
          flashMode={flashMode}
          zoom={zoom}
          onCameraReady={() => setIsCameraReady(true)}
        >
          <View style={styles.cameraHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFlashMode}>
              {flashMode === FlashMode.off ? (
                <MaterialIcons name="flash-off" size={24} color="white" />
              ) : (
                <MaterialIcons name="flash-on" size={24} color="white" />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      <View
        style={{
          height: 100,
          width: ScreenWidth,
          backgroundColor: "#f7f7f7",
          // borderTopLeftRadius: 10,
          // borderTopRightRadius: 10,
          position: "relative",
          zIndex: 1,
          // bottom: 10,
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity onPress={pickImage}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: "gray",
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {firstImage ? (
              <Image
                source={{
                  uri: firstImage,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                }}
              />
            ) : (
              <MaterialIcons name="album" size={24} color="white" />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={!isCameraReady} onPress={takePictureAsync}>
          <View
            style={{
              width: 75,
              height: 75,
              backgroundColor: "white",
              borderRadius: 100,
              borderWidth: 5,
              borderColor: "#d2d2d2",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraType}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: "gray",
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {type === CameraType.back ? (
              <MaterialIcons name="flip-to-front" size={24} color="white" />
            ) : (
              <MaterialIcons name="flip-to-back" size={24} color="white" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default CreateStoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "red",
  },
  camera: {
    flex: 1,
    borderRadius: 10,
  },
  cameraHeader: {
    height: 75,
    width: ScreenWidth,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
});
