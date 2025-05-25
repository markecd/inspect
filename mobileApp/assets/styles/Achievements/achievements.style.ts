import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#A98467",
    width: 150,
    height: 150,
    aspectRatio: 1,
    borderRadius: 16,
    margin: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    elevation: 10,
  },
  cardBlurred: {
    opacity: 1,
  },
  icon: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
  iconBlurred: {
    tintColor: "#999",
  },
  title: {
    color: "#F0EAD2",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  badge: {
    position: "absolute",
    top: -10,
    right: 10,
    backgroundColor: "#BC9143",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 6,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 10,
  },
  badgeText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#F0EAD2",
    letterSpacing: 0.5,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#6C584C",
    padding: 10,
    justifyContent: "center",
  },
  achievementCardOuterContainer: {
    marginBottom: 20,
  },
});
