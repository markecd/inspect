import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
    height: "85%",
    backgroundColor: "#6C584C",
  },
  mainDetailContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 100,
    marginBottom: 20,
  },
  imageContainer: {
    width: "42.5%",
    padding: 6,
    backgroundColor: "#A98467",
    borderRadius: 10,
    elevation: 6,
    marginRight: 10
  },
  insectImage: {
    width: 160,
    height: 300,
    borderRadius: 10
  },
  mainInfoContainer: {
    width: 230,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  descriptionContainer: {
    backgroundColor: "#A98467",
    borderRadius: 10,
    padding: 10,
    elevation: 10,
  },
  descriptionText: {
    margin: 0,
    color: "#F0EAD2" 
  },
  insectName: {
    fontSize: 26,
    flexShrink: 1,
    flexWrap: "wrap",
    color: "#F0EAD2" 
  },
  insectScientificName: {
    fontSize: 16,
    marginBottom: 40,
    fontStyle: "italic",
        color: "#F0EAD2" 

  },
  insectFamilyName: {
    fontSize: 12,
        color: "#F0EAD2" 

  },
  insectOrderName: {
    fontSize: 12,
        color: "#F0EAD2" 

  },
  footer: {
    position: "fixed",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "9.5%",
  },
  confirmButton: {
    width: "50%",
    textAlign: "center",
    backgroundColor: "#ADC178",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  denyButton: {
    width: "50%",
    textAlign: "center",
    backgroundColor: "#e85a5e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fillerView: {
    height: "5%",
    backgroundColor: "#6C584C",
  },
  line: {
    height: "0.5%",
    backgroundColor: "#A98467",
  },
  confirmIcon: {
    width: 60,
    height: 60,
  },
  taxonomyTree: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  taxonomyTextContainer: {
    gap: 20,
    flex: 1,
    textWrap: "wrap",
    width: "30%",
  },
  arrowIcon: {
    width: 130,
    height: 130,
  }
});
