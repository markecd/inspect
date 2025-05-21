import { View, Text } from "react-native";
import { loadCVModel } from "../../modules/cv/services/loadModel";
import { Camera, CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { styles } from "../../modules/observation/styles/scan.styles";

export default function ScanPage() {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status == "granted");
    })();
  }, []);

  if (!cameraPermission) {
    return <Text>Dovolite aplikaciji INSPECT uporabo kamere.</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera}>
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>To je scan screen!</Text>
        </View>
      </CameraView>
    </View>
  );
}
