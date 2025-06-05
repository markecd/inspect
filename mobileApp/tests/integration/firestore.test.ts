import { initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

describe("Integration test: Firestore CRUD", () => {
    const firebaseConfig = {
        apiKey: "api-key",
        projectId: "test-project"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    beforeAll(() => {
        connectFirestoreEmulator(db, "127.0.0.1", 8085);
    });

    it("dodajanje dokumenta", async () => {
        const ref = doc(db, "testCollection", "testDoc");
        await setDoc(ref,  {name: "test", code: 1});
        const snapshot = await getDoc(ref);

        expect(snapshot.exists()).toBe(true);
        expect(snapshot.data()).toEqual({name: "test", code: 1});
    });

    it("posodabljanje dokumenta", async () => {
        const ref = doc(db, "testCollection", "testDoc");
        await updateDoc(ref, {code: 2});
        const snapshot = await getDoc(ref);

        expect(snapshot.data()?.code).toBe(2);
    });

    it("brisanje dokumenta", async () => {
        const ref = doc(db, "testCollection", "testDoc");
        await deleteDoc(ref);
        const snapshot = await getDoc(ref);

        expect(snapshot.exists()).toBe(false);
    })

})