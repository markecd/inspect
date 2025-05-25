import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  redCardContainer: {
    backgroundColor: "#A98467",
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 15,
    marginBottom: 10,
    elevation: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  redCardImage: {
    width: 100,
    height: 100,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#6C584C",
    padding: 10,
    justifyContent: "center",
  },
  redCardOuterContainer: {
    marginBottom: 20,
  },
  redCardText: {
    alignSelf: "center",
    color: "#F0EAD2",
    fontWeight: "bold",
    fontSize: 14,
  },
  redContentContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 10,
    backgroundColor: "#6C584C",
  },
  druzinaSectionContainer: {
    marginBottom: 15,
  },
  druzinaSectionText: {
    color: "#F0EAD2",
    fontWeight: "bold",
    fontSize: 24,
    paddingBottom: 10,
  },
  insectSectionContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  insectSectionImageContainer: {
    width: 150,
    height: 150,
    backgroundColor: "#A98467",
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10
  },
  insectSectionImage: {},
  insectSectionInfoContainer: {
    width: 230,
    height: 150,
    backgroundColor: "#A98467",
    borderRadius: 10,
    display: "flex",
    padding: 5,
    elevation: 10
  },
  insectName: {
    color: "#F0EAD2",
    fontWeight: "semibold",
    fontSize: 16,
    paddingBottom: 10,
  },
  observationCas: {},
  observationLocation: {},
  insectNahajalisce: {
    color: "#F0EAD2",
    fontWeight: "condensedBold",
    fontSize: 12,
    paddingBottom: 10,
  },
});
