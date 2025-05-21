import { loadTensorflowModel } from "react-native-fast-tflite";
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';


export async function loadCVModel() {
    const asset = Asset.fromModule(require('../../../assets/tflite_model/model1.tflite'));
    await asset.downloadAsync();

    const modelPath = asset.localUri ?? asset.uri;
    const model = await loadTensorflowModel({url: modelPath});
    return model;
}