import React from "react";
import { useUserStats } from "@/modules/gamification/contexts/UserStatsContext";
import { render } from "@testing-library/react-native";


jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

describe("UserStatsContext hook", () => {
  it("vrže napako, če hook ni znotraj providerja", () => {
    const TestComponent = () => {
      useUserStats(); 
      return null;
    };

    
    expect(() => render(<TestComponent />)).toThrow(
      "useUserStats must be used within UserStatsProvider"
    );
  });
});
