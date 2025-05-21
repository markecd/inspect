import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }}/>;
}
//tu not daj stvari ki se morajo zrenderat pred vsem drugim(fonti...)
