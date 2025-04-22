<p align="center">
  <img src="https://avatars.githubusercontent.com/u/207241261?s=200&v=4" style="border-radius: 1rem; border: 1px solid #fff;"/>
</p>

<div align="center">

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803.svg?style=for-the-badge&logo=typeorm&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![RxJS](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white)

</div>

# DocomateAI Backend

This is the backend for **DocomateAI**, an AI-based documentation generator and code exploration assistant. It handles user authentication, project/content management, README generation, and AI-powered chat with your codebase.

> 📌 For the complete project including frontend and updates, visit our [GitHub organization](https://github.com/docomate-ai)

---

## Table of Contents

- [DocomateAI Backend](#docomateai-backend)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Requirements:](#requirements)
    - [Local Installation](#local-installation)
  - [Tech stack](#tech-stack)
  - [Author](#author)

---

## Installation

### Requirements:

- Node JS, Nest JS and Typescript.
- API KEYS

  | **API Credentials**  |                      **Website**                       |
  | :------------------: | :----------------------------------------------------: |
  | MongoDb Credentials  | [MongoDb Atlas](https://www.mongodb.com/cloud/atlas/)  |
  | SendGrid Credentials |  [Sendgrid Mail Service](https://sendgrid.com/en-us)   |
  | Jina Embeddingd API  | [Jina v2 Embedding Modal](https://jina.ai/embeddings/) |
  |       Groq API       |     [Groq Console](https://console.groq.com/keys)      |

- To configure environment variables, navigate to the backend directory and copy .env.development.sample to .env.development. Then, paste your API keys from the above links.

### Local Installation

1. **Clone the repository**

   ```
   git clone https://github.com/Docomate-ai/docomate-ai-backend.git
   cd docomate-ai-backend
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.development` file in the root directory. Refer to `.env.development.sample` for structure.

4. **Start the server**
   ```
   npm run start:dev
   ```

---

## Tech stack

|   **Technology**    |                **Tools**                |
| :-----------------: | :-------------------------------------: |
| Server-side Runtime |                 Node.js                 |
|    Web Framework    |         Nest.js with Typescript         |
|      Database       |            MongoDB, TypeORM             |
|   Authentication    |              JWT, Bcryptjs              |
|  AI-based Features  | Groq-sdk, Langchain.js, Jina embeddings |
|     API Testing     |                 Postman                 |
|     Deployment      |                 Heroku                  |

---

## Author

**Gitanshu Sankhla**

- GitHub: [Gitax18](https://github.com/Gitax18)
- Docomate-AI Org: [DocomateAI](https://github.com/docomate-ai)

---

Feel free to contribute, raise issues, or suggest improvements!
