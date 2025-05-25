import { View, Text, TouchableOpacity, Image, ActivityIndicator} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { styles } from "../../assets/styles/Observation/scan.styles";
import { preprocessImage } from "@/modules/cv/services/preprocessor";
import { router } from 'expo-router';
import { useCVModel } from "@/modules/cv/provider/CVModelProvider";

export default function ScanPage() {
  const { model } = useCVModel();
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status == "granted");
    })();
  }, []);

  if (!cameraPermission) {
    return <Text>Dovolite aplikaciji INSPECT uporabo kamere.</Text>;
  }

  const handleScan = async () => {
    if (!model){
      console.warn("Model še ni naložen");
      return
    }
    setIsLoading(true);
    if (cameraRef.current){
      try{
        const photo = await cameraRef.current.takePictureAsync();
        const modelInput = await preprocessImage(photo.uri);
        const output = await model.run(modelInput);
        const scores = Array.from(output[0] as Float32Array);
        const topClass = scores.indexOf(Math.max(...scores));
        router.push({pathname: '/observation/details', params: {prediction: topClass, photoUri: photo.uri}});
      } catch (error){
        console.error("Napaka pri zajemu slike: ", error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />
      <TouchableOpacity style={styles.returnButton} onPress={() => router.replace('/model')}>
        <Image source={require("../../assets/icons/return_icon.png")} style={styles.returnIcon} />
      </TouchableOpacity>
      <View style={styles.cornerTopLeft} />
      <View style={styles.cornerTopRight} />
      <View style={styles.cornerBottomLeft} />
      <View style={styles.cornerBottomRight} />
      <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
        <Image source={require("../../assets/icons/scan_icon.png")} style={styles.scanIcon} />
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size="large" color="#ffffff" style={styles.loadingAnimation}/>}
    </View>
  );
}
