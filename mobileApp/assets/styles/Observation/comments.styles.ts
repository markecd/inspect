import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#A98467',
        borderRadius: 10,
        marginTop: 30,
        padding: 16,
        position: 'relative',
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#F0EAD2",
        letterSpacing: 0.3
    },
    noComments: {
      color: "#ccc",
      fontStyle: "italic",
      marginBottom: 12,
    },
    commentCard: {
      backgroundColor: "#6C584C",
      padding: 10,
      borderRadius: 6,
      marginBottom: 10,
    },
    content: {
      fontSize: 14,
      color: "#F0EAD2",
    },
    meta: {
      fontSize: 12,
      color: "#888",
      marginTop: 4,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    input: {
      flex: 1,
      backgroundColor: "#fff",
      borderRadius: 6,
      padding: 8,
      fontSize: 14,
      marginRight: 8,
    },
    sendButton: {
      backgroundColor: "#6C584C",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    sendVoiceButton: {
        backgroundColor: "#6C584C",
        paddingVertical: 2,
        paddingHorizontal: 12,
        borderRadius: 6,
      },
    sendButtonText: {
      color: "#F0EAD2",
      fontWeight: "bold",
    },
    recordIcon: {
        width: 40,
        height: 40,
    },
    recordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        padding: 10,
        backgroundColor: '#6C584C',
        borderRadius: 6,
        gap: 35
      },
    deleteText: {
        position: 'absolute',
        bottom: 5,
        right: 1,
        width: 35,
        height: 35
      }
            
  });