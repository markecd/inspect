import * as Location from 'expo-location';

export async function getLocation(){
    const location = await Location.getCurrentPositionAsync();
    return location;
}

export async function requestLocationPermission(){
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status;
}