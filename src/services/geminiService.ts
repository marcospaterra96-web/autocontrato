import { GoogleGenAI, Type } from "@google/genai";
import { ContractData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function extractDataFromDocuments(images: { mimeType: string; data: string }[]): Promise<Partial<ContractData>> {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Você é um assistente especializado em extração de dados de documentos brasileiros (CNH, CRLV e Comprovante de Residência).
    Analise as imagens fornecidas e extraia as seguintes informações para preencher um contrato de aluguel de veículo:

    - Nome completo do locatário
    - CPF do locatário
    - RG do locatário
    - Endereço completo (Rua, número, bairro, cidade, estado, CEP)
    - Marca do veículo
    - Modelo do veículo
    - Cor do veículo
    - Combustível (Flex, Gasolina, Álcool, Diesel)
    - Placa do veículo
    - RENAVAM do veículo
    - CHASSIS do veículo
    - Nome que consta no documento do veículo (Proprietário/Financiado)

    Retorne os dados estritamente no formato JSON seguindo este esquema:
    {
      "locatarioNome": string,
      "locatarioCpf": string,
      "locatarioRg": string,
      "locatarioEndereco": string,
      "veiculoMarca": string,
      "veiculoModelo": string,
      "veiculoCor": string,
      "veiculoCombustivel": string,
      "veiculoPlaca": string,
      "veiculoRenavam": string,
      "veiculoChassis": string,
      "veiculoNomeFinanciado": string
    }
  `;

  const contents = [
    { text: prompt },
    ...images.map(img => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.data
      }
    }))
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locatarioNome: { type: Type.STRING },
            locatarioCpf: { type: Type.STRING },
            locatarioRg: { type: Type.STRING },
            locatarioEndereco: { type: Type.STRING },
            veiculoMarca: { type: Type.STRING },
            veiculoModelo: { type: Type.STRING },
            veiculoCor: { type: Type.STRING },
            veiculoCombustivel: { type: Type.STRING },
            veiculoPlaca: { type: Type.STRING },
            veiculoRenavam: { type: Type.STRING },
            veiculoChassis: { type: Type.STRING },
            veiculoNomeFinanciado: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return {};
  } catch (error) {
    console.error("Erro na extração de dados com Gemini:", error);
    return {};
  }
}
