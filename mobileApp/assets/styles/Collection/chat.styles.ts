import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C584C",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
  },
  userMessage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#6C584C",
    margin: 10,
  },
  assistantMessage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#6C584C",
    padding: 10,
  },
  userText: {
    backgroundColor: "#F0EAD2",
    borderRadius: 10,
    elevation: 5,
    padding: 5,
    fontWeight: "bold",
  },
  assistantText: {
    color: "#F0EAD2",
    fontWeight: "bold",
    padding: 5,
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "row",
    position: "fixed",
    bottom: 10,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F0EAD2",
    width: "80%",
    height: 60,
    borderRadius: 10,
  },
  sendButton: {
    borderRadius: 40,
    backgroundColor: "#A98467",
    padding: 10,
    position: "absolute",
    right: 50,
  },
  sendButtonText: {
    width: 20,
    height: 20,
  },
});
