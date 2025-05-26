import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#6C584C', 
      padding: 16,
      marginTop: 20,
      justifyContent: 'space-between',
      paddingBottom: 2
    },
    icon1: {
      width: 60,
      height: 60,
      resizeMode: 'contain',
    },
    icon2: {
        width:64,
        height: 64,
        resizeMode:'contain',
        marginTop: 9
    },
    progressContainer: {
      flex: 1,
      height: 20,
      backgroundColor: '#e2e2b5',
      borderRadius: 10,
      marginHorizontal: 16,
      overflow: 'hidden',
      width: 10,
      elevation: 10
    },
    progressFill: {
      backgroundColor: '#b3cc84',
      height: '100%',
      borderRadius: 10,
    },
  });
  