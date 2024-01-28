import "dotenv/config";
import app from "./app.js";

// Start the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  // console.log(`Server is Listening on http://localhost:${PORT}`);
});