import axios from "axios";

export type SentenceListType = {
  pageNum: number;
  sentence: Text;
}

export type ChunkListType = {
  content: Text,
  content_length: number;
  content_tokens: number;
  page_num: number;
};

export const splitChunk=  async (sentenceList: SentenceListType[]) => {
  const res = await axios(`${process.env.CORE_API_ENDPOINT}/split-chunks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { sentenceList },
  });

  const { chunkList } = res.data;
  return chunkList;
}
export const createEmbedding = async (chunks: ChunkListType[], ip: string, fileName: string, apiKey: string) => {
  await axios(`${process.env.CORE_API_ENDPOINT}/embedding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      sentenceList: chunks,
      apiKey,
      ip,
      fileName,
      delay: 0,
    },
  });
}