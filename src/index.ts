import { createServer } from "./server";

const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log(
    `Demo login available at: POST http://localhost:${PORT}/api/demo-login`,
  );
});
