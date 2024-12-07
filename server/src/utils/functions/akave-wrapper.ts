import axios from "axios";

const AKAVE_BASE_URL = "http://localhost:8000";

export async function akaveWrapper(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data: any,
  reqHeaders?: any
) {
  try {
    const response = await axios({
      method,
      url: `${AKAVE_BASE_URL}/${endpoint}`,
      data,
      headers: {
        reqHeaders,
      },
    });
    return response.data;
  } catch (error: any) {
    return `Error executing request: ${error.message}`;
  }
}
