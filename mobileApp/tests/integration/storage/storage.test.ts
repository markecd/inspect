import { initializeApp } from "firebase/app";
import { connectStorageEmulator, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';


describe("Integration test: Firebase Storage Image save", () => {
    const firebaseConfig = {
        apiKey: "api-key",
        projectId: "test-project",
        storageBucket: "test-bucket.app.com"
    };

    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    beforeAll(() => {
        connectStorageEmulator(storage, "127.0.0.1", 9199);
    });

    it("vstavljanje slike", async () => {
        const fileRef = ref(storage, "test-folder/test-file.jpg");
        const result = await uploadBytes(fileRef, new Blob(["Slika"]));

        expect(result).toBeDefined();
        expect(result.ref.fullPath).toBe("test-folder/test-file.jpg");

        const imageURL = await getDownloadURL(fileRef);
        expect(typeof imageURL).toBe("string");
        expect(imageURL).toContain("http://");
    });
})