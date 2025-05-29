import { ScrollView } from 'react-native';
import Notifications from '../../components/Notifications/Notifications';
import {styles} from '../../assets/styles/Friends/friends-list.style'

export default function NotificationsScreen() {
    return (
        <ScrollView contentContainerStyle={styles.profileContentContainer}>
            <Notifications />
            </ScrollView>
    )
}