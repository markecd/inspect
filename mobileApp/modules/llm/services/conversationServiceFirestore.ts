import AsyncStorage from "@react-native-async-storage/async-storage";
import { db as firestoreDb } from "@/modules/auth/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Message } from "./getResponseService";


export async function getConversationFromFirestore(rodId: number){
    const firebaseUid = await AsyncStorage.getItem("user_firestore_id");
    if (!firebaseUid){
        throw new Error("firestore id ni najden");
    }
    const insectRef = doc(firestoreDb, "users", firebaseUid, "observations", rodId.toString());
    const insectDoc = await getDoc(insectRef);

    if (!insectDoc.exists()){
      throw new Error("dokument ne obstaja");
    }
    const data = insectDoc.data();

    return data.LLMconversation ?? [];
  }


  export async function saveConversationToFirestore(rodId: number, conversation: Message[]){
    const firebaseUid = await AsyncStorage.getItem("user_firestore_id");
    if (!firebaseUid){
        throw new Error("firestore id ni najden");
    }
    const insectRef = doc(firestoreDb, "users", firebaseUid, "observations", rodId.toString());
    await setDoc(insectRef, {LLMconversation: conversation}, {merge: true});
  }