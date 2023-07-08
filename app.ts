import express, { Request, Response } from 'express';

// Create Express app
const app = express();
const port = 6969;

// Define routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
