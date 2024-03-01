// api/userscore.js
import fsPromises from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "db/userscore.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const fileData = await fsPromises.readFile(filePath);
      const scoreData = JSON.parse(fileData);
      res.status(200).json(scoreData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error reading score data" });
    }
  } else if (req.method === "POST") {
    try {
      const { username, score } = req.body;
      // Read existing scores
      const fileData = await fsPromises.readFile(filePath);
      const scoreData = JSON.parse(fileData);
      // Add new score
      scoreData.scores.push({ username, score });
      // Write updated scores back to file
      await fsPromises.writeFile(filePath, JSON.stringify(scoreData));
      res.status(200).json({ message: "Score updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating score data" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Temizleme işlemi
      await fsPromises.writeFile(filePath, JSON.stringify({ scores: [] }));
      res.status(200).json({ message: "User scores cleared successfully." });
    } catch (error) {
      console.error("Error clearing user scores:", error);
      res.status(500).json({ message: "Failed to clear user scores." });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
