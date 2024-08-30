export const fetchCryptography = async (dto: {
  data: string;
  type: "encrypt" | "decrypt";
}): Promise<string | undefined> => {
  try {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      console.error("Error on API call");
    }

    const responseData = await response.json();
    return responseData.result;
  } catch (error) {
    console.error("Cryptography error:", error);
    throw new Error(error?.toString());
  }
};
