import { Text, View, Image } from "react-native";
import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
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
        await tf.ready();
        setStatus("TensorFlow ready, loading model...");

        const modelJson = require("../assets/tfjs_model/model.json");
        const modelWeights = [
          require("../assets/tfjs_model/group1-shard1of3.bin"),
          require("../assets/tfjs_model/group1-shard2of3.bin"),
          require("../assets/tfjs_model/group1-shard3of3.bin"),
        ];

        const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
        setStatus("Model loaded, running prediction...");
        setIsReady(true); 

        const asset = Asset.fromModule(require("../assets/images/zlata_minica.jpeg"));
        await asset.downloadAsync();
        const fileUri = asset.localUri || asset.uri;
        setImageUri(fileUri);

        const imgB64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
        const raw = new Uint8Array(imgBuffer);
        const imageTensor = decodeJpeg(raw);
        const resized = tf.image.resizeBilinear(imageTensor, [299, 299]);
        const normalized = resized.toFloat().div(127.5).sub(1).expandDims();
        const prediction = model.predict(normalized) as tf.Tensor;
        const data = prediction.dataSync();
        const topClass = data.indexOf(Math.max(...data));
        const rodId = parseInt((labels as Record<string, string>)[topClass.toString()]);
        setPredictedLabel(rodId.toString());

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

      } catch (error) {
        console.error("Error:", error);
        setStatus("Failed to classify or query DB.");
      }
    }

    loadModelAndClassify();
  }, []);

  return (
    
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 18 }}>{status}</Text>

      {isReady && insect && (
        <View style={{ marginTop: 20 }}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 200, height: 200, marginBottom: 20, borderRadius: 10 }}
              resizeMode="contain"
            />
          )}
          <Text style={{ fontSize: 22 }}>{insect.naziv_rodu}</Text>
          <Text style={{ fontStyle: "italic" }}>{insect.latinski_naziv_rodu}</Text>
          <Text style={{ marginTop: 8 }}>Red: {insect.red}</Text>
          <Text>Družina: {insect.druzina}</Text>
          <Text style={{ marginTop: 10 }}>{insect.opis_rodu}</Text>
        </View>
      )}
    </View>
  );
}
