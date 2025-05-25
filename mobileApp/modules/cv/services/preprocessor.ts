import ImageResizer from "react-native-image-resizer";
import * as FileSystem from "expo-file-system";
import jpeg from "jpeg-js";
import { Buffer } from "buffer";

export async function preprocessImage(imageUri: string) {

  const resizedImage = await ImageResizer.createResizedImage(
    imageUri,
    299,
    299,
    "JPEG",
    100
  );

  const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const buffer = Buffer.from(base64, "base64");
  const rawImageData = jpeg.decode(buffer, { useTArray: true });

  const floatArray = new Float32Array((rawImageData.data.length / 4) * 3);
  for (let i = 0, j = 0; i < rawImageData.data.length; i += 4) {
    floatArray[j++] = rawImageData.data[i] / 127.5 - 1; // R
    floatArray[j++] = rawImageData.data[i + 1] / 127.5 - 1; // G
    floatArray[j++] = rawImageData.data[i + 2] / 127.5 - 1; // B
  }

  const inputTensor = new Float32Array(1 * 299 * 299 * 3);
  inputTensor.set(floatArray);
    console.log("Dynamic input sample:", inputTensor.slice(0, 20));
  return [inputTensor];
}
