import { Text, View } from "react-native";
import { useEffect, useState } from "react";

// TensorFlow
import * as tf from "@tensorflow/tfjs";
import {bundleResourceIO } from "@tensorflow/tfjs-react-native";

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState("Loading TensorFlow...");

  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready(); 

        setStatus("TensorFlow ready, loading model...");

        const modelJson = require("../tfjs_model/model.json");
        const modelWeights = [
          require("../tfjs_model/group1-shard1of3.bin"),
          require("../tfjs_model/group1-shard2of3.bin"),
          require("../tfjs_model/group1-shard3of3.bin"),
        ];

        const model = await tf.loadGraphModel(
          bundleResourceIO(modelJson, modelWeights)
        );

        setStatus("Model loaded successfully!");
        setIsReady(true);
      } catch (error) {
        console.error("Error loading model:", error);
        setStatus("Failed to load model");
      }
    }

    loadModel();
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
      {isReady && <Text> Inspect je najboljši app z AI!</Text>}
    </View>
  );
}
