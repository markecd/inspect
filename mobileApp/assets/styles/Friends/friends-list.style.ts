import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    
    container: {
        backgroundColor: "#A98467",
        borderRadius: 10,
        margin: 20,
        marginBottom: 0,
        padding: 16,
        paddingTop: 35,
        elevation: 10,
    },
  
    
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#F0EAD2',
    },
  
   
    friendItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#6C584C',
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
  
  
    friendName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#F0EAD2',
    },
  
    friendMeta: {
      fontSize: 14,
      color: '#BC9143',
      marginTop: 2,
    },
  
   
    removeIcon: {
      height:35,
      width:35
    },
  
    empty: {
      marginTop: 10,
      marginLeft: 5,
      fontStyle: 'italic',
      color: '#F0EAD2',
    },
  
    
    addFriendBox: {
      flexDirection: 'row',
      marginTop: 15,
      alignItems: 'center',
      gap: 10,
      backgroundColor: '#'
    },

    customButton: {
        backgroundColor: "#6C584C",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    
    customButtonText: {
        color: "#F0EAD2",
      fontWeight: "bold",
    },
   
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      backgroundColor: '#fff',
    },
  
   
    error: {
      color: 'red',
      marginTop: 10,
      textAlign: 'center',
      fontSize: 14,
    },
    nameWithMedal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      
      medalIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
      },
      profileContentContainer: {
        flex: 1,
        backgroundColor: "#6C584C",
      },
      friendInfo: {
        flex: 1,
      },
      
  });
  