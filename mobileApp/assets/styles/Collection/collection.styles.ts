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
    padding: 30,
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
    marginBottom: 25,
  },
  insectSectionImageContainer: {
    width: 150,
    height: 150,
    backgroundColor: "#A98467",
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  insectSectionImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  insectSectionInfoContainer: {
    width: 200,
    height: 150,
    backgroundColor: "#A98467",
    borderRadius: 10,
    display: "flex",
    padding: 12,
    elevation: 10,
  },
  insectName: {
    color: "#F0EAD2",
    fontWeight: "700",
    fontSize: 16,
    paddingBottom: 10,
  },
  observationCas: {
    color: "#F0EAD2",
    fontWeight: "condensedBold",
    fontSize: 12,
    paddingBottom: 10,
  },
  observationLocation: {
    color: "#F0EAD2",
    fontWeight: "condensedBold",
    fontSize: 12,
    paddingBottom: 10,
  },
  insectNahajalisce: {
    color: "#F0EAD2",
    fontWeight: "condensedBold",
    fontSize: 12,
    paddingBottom: 10,
  },
  observationDetailSection: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    gap: 5,
  },
  detailImage: {
    width: 20,
    height: 20,
  },
  preglejButton: {
    position: "absolute",
    backgroundColor: "#6C584C",
    width: 100,
    alignSelf: "center",
    bottom: 5,
    padding: 5,
    borderRadius: 12,
  },
  preglejText: {
    color: "#F0EAD2",
    alignSelf: "center",
    fontWeight: "bold",
  },
  ujetBadge: {
    backgroundColor: "#BC9143",
    width: 60,
    padding: 5,
    borderRadius: 10,
    position: "absolute",
    top: -15,
    right: 10,
    elevation: 10,
  },
  ujetText: {
    color: "#F0EAD2",
    alignSelf: "center",
    fontWeight: "bold",
  },
  rodContentContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 30,
    backgroundColor: "#6C584C",
  },
  rodImeZuzelke: {
    color: "#F0EAD2",
    fontWeight: "bold",
    fontSize: 24,
    flexWrap: "wrap",
  },
  rodLatinskoImeZuzelke: {
    color: "#F0EAD2",
    fontWeight: "semibold",
    fontSize: 20,
    fontStyle: "italic",
  },
  rodNazivZuzelkeWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  rodMainInfoOuterContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  rodImageContainer: {
    width: 150,
    height: 150,
    backgroundColor: "#A98467",
    borderRadius: 10,
    elevation: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rodImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  rodMainInfoContainer: {
    width: 200,
    height: 150,
    display: "flex",
    flexDirection: "column",
  },
  dateLocationWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end"
  },
  dateLocationIcon: {
    width: 40,
    height: 40
  },
  dateLocationText: {
    color: "#F0EAD2",
    fontWeight: "semibold",
    fontSize: 12,
    marginBottom: 10,
  },
  askBuggyButton: {
    backgroundColor: "#A98467",
    width: 175,
    alignSelf: "center",
    padding: 7.5,
    borderRadius: 12,
    bottom: -40,
    elevation: 10
  },
  askBuggyText: {
    alignSelf: "flex-start",
    color: "#F0EAD2",
    fontWeight: "bold",
    fontSize: 12,
  },
  buggyIcon: {
    width: 50,
    height: 50,
    position: "absolute",
    top: -5,
    right: 5
  },
  rodTaxonomyContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },
  taxonomyImage: {
    width: 230,
    height: 230,
    elevation: 1,
  },
  taxonomyDataContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    width: "40%"
  },
  taxonomyRedContainer: {
    backgroundColor: "#A98467",
    borderRadius: 10,
    padding: 10,
    elevation: 10
  },
  taxonomyRedText: {
    color: "#F0EAD2",
    fontWeight: "bold",
    fontSize: 12,
  },
  rodDescriptionContainer:{},
  rodDescriptionText: {
    color: "#F0EAD2",
    fontWeight: "600",
    fontSize: 12,
  }
});
