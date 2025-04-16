import { InferenceClient } from '@huggingface/inference';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class EmbeddingsService {
  private token: string | undefined;
  private jinaApi: string | undefined;
  constructor(private configService: ConfigService) {
    this.token = this.configService.get<string>('HF_TOKEN');
    this.jinaApi = this.configService.get<string>('JINA_API');
  }

  async HF_GenerateEmbeddings(data: string) {
    const HFClient = new InferenceClient(this.token);
    const embeddings = await HFClient.featureExtraction({
      model: 'BAAI/bge-large-en-v1.5',
      inputs: data,
      provider: 'hf-inference',
    });

    return embeddings;
  }

  async JINA_GenerateEmbeddings(data: string[]) {
    const embeddings = await axios.post(
      'https://api.jina.ai/v1/embeddings',
      {
        model: 'jina-clip-v2',
        input: data.map((text) => ({ text })),
      },
      {
        headers: {
          Authorization: `Bearer ${this.jinaApi}`,
        },
      },
    );
    return embeddings;
  }

  async splitData(data: string) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 4500,
      chunkOverlap: 500,
    });

    const output = (await splitter.createDocuments([data])).map(
      (doc) => doc.pageContent,
    );
    return output;
  }

  async generateEmbeddingsData(data: string) {
    const splittedData = await this.splitData(data);
    /**
    // ### Below is the implementation with HuggingFace BaaI embedding model
    const embeddings = await Promise.all(
      splittedData.map(async (chunk) => {
        const embds = await this.HF_GenerateEmbeddings(chunk);
        return embds;
        }),
        );
    */

    // ### Below is the implementation with Jina embedding model
    const jinaRes = await this.JINA_GenerateEmbeddings(splittedData);
    const embeddings = jinaRes.data.data.map((obj: any) => obj.embedding);
    return [splittedData, embeddings];
  }
}
