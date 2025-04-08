import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import fs from "fs";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode
  dotenv.config({ path: `.env.${mode}` });

  return {
    plugins: [react()],
    server: {
      open: true,
      https: {
        key: fs.readFileSync("C:/Users/ASUS/Downloads/localhost-key.pem"), // Đường dẫn đến file key của bạn
        cert: fs.readFileSync("C:/Users/ASUS/Downloads/localhost.pem"), // Đường dẫn đến file cert của bạn
      },
    },
  };
});
