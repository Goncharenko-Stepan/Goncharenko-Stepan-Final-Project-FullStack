import { axiosInstance } from "./index.js";

export const checkJWTToken = async () => {
  try {
    const result = await axiosInstance.get("/auth/checkAccessToken");

    console.log("Result: ", result);

    return result.data.message === "Token is valid";
  } catch (error) {
    console.error("Token is invalid", error);
    return false;
  }
};
