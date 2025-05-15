import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = "us-east-1";

const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

console.log("AWS Access Key:", import.meta.env.VITE_AWS_ACCESS_KEY_ID);
console.log("AWS Secret Key:", import.meta.env.VITE_AWS_SECRET_ACCESS_KEY);

export const dynamoDb = DynamoDBDocumentClient.from(client);
