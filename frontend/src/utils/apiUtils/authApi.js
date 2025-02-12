import { axiosInstance } from "./index.js";

export const checkJWTToken = async () => {
  try {
    const result = await axiosInstance.get("/auth/checkAccessToken");
    return result.data.message === "Token is valid";
  } catch (error) {
    console.error("Token is invalid", error);
    return false;
  }
};
