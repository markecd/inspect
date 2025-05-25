import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  list: {
    padding: 12,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#c08b5c',
    width: '45%',
    aspectRatio: 1,
    borderRadius: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  cardBlurred: {
    opacity: 0.6,
  },
  icon: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  iconBlurred: {
    tintColor: '#999', 
  },
  title: {
    color: '#F0EAD2',
    fontWeight: 'bold',
    fontSize: 14,
    top:30,
    textAlign: 'center',
    letterSpacing: 0.5
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#BC9143',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 6,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 10,
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#F0EAD2',
    letterSpacing: 0.5
  },
});
