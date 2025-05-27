import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#A98467',
    borderRadius: 10,
    margin: 20,
    marginBottom: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 35
  },
  containerDosezki: {
    backgroundColor: '#A98467',
    borderRadius: 10,
    margin: 20,
    padding: 16,
    position: 'relative',
  },
  username: {
    backgroundColor: '#6C584C',
    color: '#F0EAD2',
    fontSize: 16,
    letterSpacing: 0.3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  infoBox: {
    backgroundColor: '#6C584C',
    borderRadius: 10,
    padding: 16,
    display:'flex',
    marginLeft: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  value: {
    color: '#BC9143',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    color: '#F0EAD2',
    fontSize: 14,
    letterSpacing: 0.3,
    fontWeight: 'bold'
  },
  levelTag: {
    position: 'absolute',
    top: -12,
    right: 8,
    backgroundColor: '#BC9143',
    color: '#F0EAD2',
    letterSpacing: 0.3,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    elevation: 3,
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  logoutText: {
    color: "#F0EAD2",
    fontWeight: 'bold',
    letterSpacing: 0.4,
    fontSize: 16
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 50
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#F0EAD2",
    letterSpacing: 0.3
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#6C584C",
    padding: 12,
    marginRight: 15,
    borderRadius: 8,
    width: 140,
    height: 120,
    alignItems: 'center'
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#F0EAD2",
    fontSize: 11,
    marginBottom: -15
  },
  achievementIcon: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  profileContentContainer: {
    flex: 1,
    backgroundColor: "#6C584C"
  },
  starsWrapper: {
    flexDirection: "row",
    gap: 2,
  },
  starIcon: {
    width: 23,
    height: 23
  },
});
