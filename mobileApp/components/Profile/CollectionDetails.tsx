import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { useCollections } from "@/hooks/useCollections";
import styles from '../../assets/styles/Profile/profile-details.style';

export default function CollectionDetails() {
    const { collections, loading } = useCollections();

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Nalagam kolekcije...</Text>
            </View>
        );
    }

    return (
        <View style={styles.containerDosezki}>
            <Text style={styles.heading}>Kolekcije</Text>

            <FlatList
                data={collections}
                keyExtractor={(item) => item.red_id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={getCollectionIcon(item.naziv_reda)}
                            style={styles.achievementIcon}
                        />
                        <View style={styles.starsWrapper}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Image
                                    key={i}
                                    source={
                                        i < item.stars
                                            ? require("../../assets/icons/star_icon.png")
                                            : require("../../assets/icons/star_empty_icon.png")
                                    }
                                    style={styles.starIcon}
                                />
                            ))}
                        </View>

                    </View>
                )}
            />
        </View>
    );
}

function getCollectionIcon(naziv: string) {
    switch (naziv) {
        case "Hrošči":
            return require("../../assets/icons/Hrošči_icon.png");
        case "Metulji":
            return require("../../assets/icons/Metulji_icon.png");
        case "Kobilice":
            return require("../../assets/icons/Kobilice_icon.png");
        case "Bogomolke":
            return require("../../assets/icons/Bogomolke_icon.png");
        case "Dvokrilci":
            return require("../../assets/icons/Dvokrilci_icon.png");
        case "Kačji pastirji":
            return require("../../assets/icons/Kačji pastirji_icon.png");
        case "Kožekrilci":
            return require("../../assets/icons/Kožekrilci_icon.png");
        case "Polkrilci":
            return require("../../assets/icons/Polkrilci_icon.png");

    }
}