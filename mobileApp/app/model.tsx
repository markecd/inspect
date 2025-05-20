import { Text, View, Image } from "react-native";
import { useEffect, useState } from "react";
import { loadTensorflowModel } from "react-native-fast-tflite";
import ImageResizer from "react-native-image-resizer";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import jpeg from "jpeg-js";
import { Buffer } from "buffer"; // Make sure this is polyfilled
import labels from "../assets/labels.json";
import { openDatabase } from "./database";

type Insect = {
  id: number;
  red: string;
  druzina: string;
  naziv_rodu: string;
  latinski_naziv_rodu: string;
  opis_rodu: string;
};

export default function Model() {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState("Loading TensorFlow...");
  const [predictedLabel, setPredictedLabel] = useState<string | null>(null);
  const [insect, setInsect] = useState<Insect | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    async function loadModelAndClassify() {
      try {
        setStatus("Loading model...");

        const modelAsset = Asset.fromModule(
          require("../assets/tflite_model/model1.tflite")
        );
        await modelAsset.downloadAsync();
        const modelPath = modelAsset.localUri ?? modelAsset.uri;
        console.log("Loading model from:", modelPath);
        const model = await loadTensorflowModel({ url: modelPath });
        console.log("Model loaded successfully!");

        // Load and resize image
        const asset = Asset.fromModule(require("../assets/images/smerda.jpeg")); 
        await asset.downloadAsync();
        const fileUri = asset.localUri || asset.uri;
        setImageUri(fileUri);

        const resizedImage = await ImageResizer.createResizedImage(
          fileUri,
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
          floatArray[j++] = rawImageData.data[i] / 127.5 - 1;     // R
          floatArray[j++] = rawImageData.data[i + 1] / 127.5 - 1; // G
          floatArray[j++] = rawImageData.data[i + 2] / 127.5 - 1; // B
        }

        const inputTensor = new Float32Array(1 * 299 * 299 * 3);
        inputTensor.set(floatArray); // fill batched input

        const output = await model.run([inputTensor]);
        console.log("Model output:", output);
console.log("Output shape:", output[0]?.length)
        const scores = Array.from(output[0] as Float32Array);
        const top5 = scores
  .map((score, index) => ({ score, index }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);

console.log("Top 5 classes:", top5);
        const topClass = scores.indexOf(Math.max(...scores));
        const rodId = parseInt(
          (labels as Record<string, string>)[topClass.toString()]
        );
        setPredictedLabel(rodId.toString());

        // Fetch insect info from DB
        const db = await openDatabase();
        const result = db.getFirstSync<Insect>(
          `
          SELECT 
            ROD.id,
            RED.naziv_reda AS red,
            DRUZINA.naziv_druzine AS druzina,
            ROD.naziv_rodu,
            ROD.latinski_naziv_rodu,
            ROD.opis_rodu
          FROM ROD
          JOIN DRUZINA ON ROD.TK_DRUZINA = DRUZINA.id
          JOIN RED ON DRUZINA.TK_RED = RED.id
          WHERE ROD.id = ?
          `,
          [rodId]
        );

        if (result) {
          setInsect(result);
          setStatus("Prediction:");
        } else {
          setStatus("Insect not found in DB.");
        }

        setIsReady(true);
      } catch (error) {
        console.error("Error:", error);
        setStatus("Failed to classify or query DB.");
      }
    }

    loadModelAndClassify();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18 }}>{status}</Text>

      {isReady && insect && (
        <View style={{ marginTop: 20 }}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 200,
                height: 200,
                marginBottom: 20,
                borderRadius: 10,
              }}
              resizeMode="contain"
            />
          )}
          <Text style={{ fontSize: 22 }}>{insect.naziv_rodu}</Text>
          <Text style={{ fontStyle: "italic" }}>
            {insect.latinski_naziv_rodu}
          </Text>
          <Text style={{ marginTop: 8 }}>Red: {insect.red}</Text>
          <Text>Družina: {insect.druzina}</Text>
          <Text style={{ marginTop: 10 }}>{insect.opis_rodu}</Text>
        </View>
      )}
    </View>
  );
}