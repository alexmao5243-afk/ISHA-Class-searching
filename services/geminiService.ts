
import { GoogleGenAI, Type } from "@google/genai";
import { SearchParams, Course, IshaCenter } from "../types";

export const searchIshaCourses = async (params: SearchParams): Promise<{ courses: Course[]; centers: IshaCenter[]; sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const searchTarget = params.category === "其他" ? params.customKeyword : params.category;
  
  // 強化搜尋提示，嚴格限定資料來源 domain
  const query = `
    【嚴格限制資料來源】
    你必須且只能使用以下兩個網址及其延伸頁面作為資料來源，嚴禁引用任何其他網站的資訊：
    1. 課程資料來源：https://isha.org.tw/Msite/tech/serch.aspx
    2. 職訓中心聯絡資訊來源：https://isha.org.tw/Msite/tech/tech_center.aspx

    任務 1 (課程檢索)：
    請在 https://isha.org.tw/Msite/tech/serch.aspx 網站上尋找「中華民國工業安全衛生協會」的課程。
    - 目標關鍵字：「${searchTarget}」
    - ${params.category === "其他" ? "特別注意：由於使用者輸入了自定義關鍵字，請利用語意分析，檢索與此關鍵字『意思接近』、『類似領域』或『語意相關』的 ISHA 課程。" : ""}
    - ${params.isRefresher ? "回訓需求：檢索時必須在課程名稱中包含『在職』二字。" : "初訓需求：請檢索正式的初訓或管理職課程。"}
    - 日期區間：${params.startDate} 到 ${params.endDate}
    - 目標縣市：${params.city}

    任務 2 (職訓中心聯絡資訊)：
    請到 https://isha.org.tw/Msite/tech/tech_center.aspx 網站上，檢索與「${params.city}」地區相對應的所有「中華民國工業安全衛生協會」職訓中心聯絡資訊。
    - 必須包含：職訓中心名稱、詳細地址、連絡電話。

    請將以上兩項任務的結果整合為一個 JSON 物件回傳。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "課程完整名稱" },
                  date: { type: Type.STRING, description: "上課日期" },
                  city: { type: Type.STRING, description: "開課城市" },
                  centerName: { type: Type.STRING, description: "開課的職訓中心名稱" },
                  address: { type: Type.STRING, description: "職訓中心詳細地址" },
                  link: { type: Type.STRING, description: "該課程在 isha.org.tw 上的報名網址" }
                },
                required: ["name", "date", "city", "centerName", "address", "link"]
              }
            },
            centers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "職訓中心完整名稱" },
                  address: { type: Type.STRING, description: "詳細地址" },
                  phone: { type: Type.STRING, description: "連絡電話" }
                },
                required: ["name", "address", "phone"]
              },
              description: "從 tech_center.aspx 檢索到的該縣市相關職訓中心聯絡方式"
            }
          },
          required: ["courses", "centers"]
        }
      },
    });

    const data = JSON.parse(response.text || '{"courses":[], "centers":[]}');
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      courses: (data.courses || []).map((c: any, index: number) => ({
        ...c,
        id: `course-${index}`,
        isRefresher: params.isRefresher
      })),
      centers: data.centers || [],
      sources
    };
  } catch (error) {
    console.error("Gemini search failed:", error);
    throw error;
  }
};
