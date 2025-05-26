import { View, Image, Text, TouchableOpacity } from "react-native";
import { styles } from "../../assets/styles/Collection/collection.styles";
import { router } from "expo-router";
type RedCardProps = {
  red: string;
  image: any;
};

const RedCard = (props: RedCardProps) => {
  return (
    <View style={styles.redCardOuterContainer}>
      <TouchableOpacity onPress={() => router.push({pathname: '/collection/red', params: {red: props.red}})}>
        <View style={styles.redCardContainer}>
          <Image source={props.image} style={styles.redCardImage} />
        </View>
      </TouchableOpacity>
      <Text style={styles.redCardText}>{props.red}</Text>
    </View>
  );
};

export default RedCard;
