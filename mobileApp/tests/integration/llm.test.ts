import { getModelResponse, Message } from "@/modules/llm/services/getResponseService";

describe("Integration test: LLM response", () => {
    it("llm response", async () => {
        const messages: Message[] = [{role: "user", content: `samo napiši besedo "test"`}];

        const response = await getModelResponse(messages);

        expect(typeof response).toBe("string");
        expect(response.toLowerCase()).toContain("test");
        expect(response.length).toBeGreaterThan(0);
    });
})