import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  notification: {
    borderRadius: 10,
        margin: 20,
        marginBottom: 0,
        padding: 16,
        marginTop: 35,
        elevation: 10,
    backgroundColor: "#A98467",
   
  },
  empty: {
    padding: 20,
    textAlign: 'center',
    color: 'gray',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    color: "#F0EAD2"
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  customDecline: {
    backgroundColor: "#e85a5e",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  customAccept: {
    backgroundColor: "#ADC178",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  customButtonText: {
    color: "#F0EAD2",
    fontWeight: "bold",
  }
});

export default styles;
