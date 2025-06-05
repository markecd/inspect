import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { Observation } from "../../pages/ObservationMap";

function parseObservation(doc: any): Observation {
  const data = doc.data();
  const [latStr, lngStr] = data.lokacija.split(",");
  return {
    id: doc.id,
    cas: data.cas,
    naziv: data.naziv,
    TK_rod: Number(data.TK_rod),
    position: {
      lat: parseFloat(latStr),
      lng: parseFloat(lngStr),
    },
  };
}

export async function getUserObservations(userId: string): Promise<Observation[]> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  const username = userData?.username;
  const userObservationsRef = collection(db, "users", userId, "observations");
  const observationsSnap = await getDocs(userObservationsRef);
  const observations = observationsSnap.docs.map((doc) => {
    const base = parseObservation(doc);
    return {
      ...base,
      username,
    };
  });
  return observations;
}

export async function getUserFriendsObservations(userId: string): Promise<Observation[]> {
  const userFriendsRef = collection(db, "users", userId, "friends");
  const userFriends = await getDocs(userFriendsRef);

  const userIds = [userId, ...userFriends.docs.map((doc) => doc.id)];

  let observations: Observation[] = [];

  for (var userFriendsId of userIds) {
    const userRef = doc(db, "users", userFriendsId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const username = userData?.username;
    const userObservationsRef = collection(db, "users", userFriendsId, "observations");
    const observationsSnap = await getDocs(userObservationsRef);
    observationsSnap.docs.map((doc) => {
        const base = parseObservation(doc);
        observations.push({
            ...base,
            username
        })
    });
  }

  return observations;
}

export async function getAllObservations(): Promise<Observation[]>{
  const usersRef = collection(db, "users");
  const users = await getDocs(usersRef);
  const userIds = users.docs.map(item => item.id);
      
  let observations: Observation[] = [];

  for (var userId of userIds){
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const username = userData?.username;
    const userObservationsRef = collection(db, "users", userId, "observations");
    const observationsSnap = await getDocs(userObservationsRef);
    observationsSnap.docs.map((doc) => {
        const base = parseObservation(doc);
        observations.push({
            ...base,
            username
        })
    });
  }
    return observations;

}
