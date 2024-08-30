import CryptoJS from "crypto-js";
import { NextRequest, NextResponse } from "next/server";

const crypto = (dto: { data: string; type: "encrypt" | "decrypt" }) => {
  const { data, type } = dto;
  const secretKey = process.env.CRYPTO_JS_KEY || "";

  if (type === "encrypt") {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  } else {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};

// endpoint
export async function POST(request: NextRequest) {
  try {
    const { data, type } = await request.json();

    if (!data || !type) {
      return NextResponse.json({ error: "There is no data" }, { status: 400 });
    }

    const result = crypto({ data, type });
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error processing data" },
      { status: 500 }
    );
  }
}
