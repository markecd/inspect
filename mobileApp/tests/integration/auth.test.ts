import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openDatabase } from "@/services/database";
import { act } from "@testing-library/react-native";

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
}));

const mockGetFirstSync = jest.fn();
jest.mock("@/services/database", () => ({
  openDatabase: async () => ({
    getFirstSync: mockGetFirstSync,
    runSync: jest.fn(),
  }),
}));

describe("Integration test: Login flow", () => {
  it("prijavi uporabnika, shrani AsyncStorage in SQLite", async () => {
    const userMock = { uid: "user123", emailVerified: true };
    const userCreds = { user: userMock };
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(userCreds);

    mockGetFirstSync.mockReturnValue({
      id: 42,
      xp: 100,
      level: 2,
    });


    const handleLogin = async () => {

        const fakeAuth = {} as Auth;
      const userPoverilnice = await signInWithEmailAndPassword(
        fakeAuth, 
        "test@example.com",
        "geslo123"
      );
      const user = userPoverilnice.user;
      if (!user.emailVerified) throw new Error("email ni potrjen");

      const db = await openDatabase();
      const result = db.getFirstSync<{id: number, xp: number, level: number}>(
        `SELECT id, xp, level FROM UPORABNIK WHERE firebase_uid = ?`,
        [user.uid]
      );
      if (!result) throw new Error("uporabnik ni najden v bazi");

      await AsyncStorage.setItem("local_user_id", result.id.toString());
      await AsyncStorage.setItem("user_xp", result.xp.toString());
      await AsyncStorage.setItem("user_level", result.level.toString());
      await AsyncStorage.setItem("user_firestore_id", user.uid);
    };

    await act(async () => {
      await handleLogin();
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    expect(mockGetFirstSync).toHaveBeenCalledWith(
      `SELECT id, xp, level FROM UPORABNIK WHERE firebase_uid = ?`,
      ["user123"]
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("local_user_id", "42");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("user_xp", "100");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("user_level", "2");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("user_firestore_id", "user123");
  });
});
