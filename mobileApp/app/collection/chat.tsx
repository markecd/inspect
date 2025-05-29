import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView } from "react-native";
import { useEffect, useState, useRef} from "react";
import { styles } from "../../assets/styles/Collection/chat.styles";
import { useLocalSearchParams } from "expo-router";
import { getConversationFromFirestore, saveConversationToFirestore } from "@/modules/llm/services/conversationServiceFirestore";
import { getModelResponse, Message } from "@/modules/llm/services/getResponseService";
import { ScrollView } from "react-native-gesture-handler";
import Markdown from 'react-native-markdown-display';


export default function ChatPage() {
const { rodId } = useLocalSearchParams();
const [conversation, setConversation] = useState<Message[]>([]);
const [newMessage, setNewMessage] = useState("");
const [loading, setLoading] = useState(false);
const textInputRef = useRef<TextInput>(null);
const scrollViewRef = useRef<ScrollView>(null);



  useEffect(() => {
    (async () => {
    const conversation = await getConversationFromFirestore(Number(rodId));
    setConversation(conversation);
    })();
  }, []);


    function createUserMessage(content: string): Message {
        return { role: "user", content };
    }

    function createAssistantMessage(content: string): Message {
        return { role: "assistant", content };
    }

  const handleAddMessage = async () => {
        if (newMessage.trim() === "") return;
        setLoading(true);
        const conversationWitAddedMessage: Message[] = [...conversation, createUserMessage(newMessage)];
        setNewMessage("");
        textInputRef.current?.blur();
        setConversation(conversationWitAddedMessage);
        const modelReply = await getModelResponse(conversationWitAddedMessage);
        const finalConversation: Message[] = [...conversationWitAddedMessage, createAssistantMessage(modelReply)];
        setConversation(finalConversation);
        saveConversationToFirestore(Number(rodId), finalConversation);
        setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={"height"} keyboardVerticalOffset={110}>
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.messagesContainer} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
            {conversation.map((item, index) => (
                <View key={index} style={item.role == "user" ? styles.userMessage : styles.assistantMessage}>
                    <Markdown style={{heading4: {fontSize: 15, marginTop: 10}, body: item.role === "user" ? styles.userText : styles.assistantText,}}>{item.content}</Markdown>
                </View>
            ))}
        </ScrollView>
        <View style={styles.inputWrapper}>
            <TextInput
                ref={textInputRef}
                style={styles.input}
                placeholder="Vprašaj kaj hroščatega..."
                placeholderTextColor="#999"
                value={newMessage}
                onChangeText={setNewMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleAddMessage}  disabled={newMessage.trim() === "" || loading}>
                <Image source={require("../../assets/icons/arrow_icon.png")} style={styles.sendButtonText}/>
            </TouchableOpacity>
        </View>
    </View>
    </KeyboardAvoidingView>
  );
}

