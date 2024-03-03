import fs from "fs";
import path from "path";

export default function envHandler(req, res) {
    try {
        // Check if .env.local is present
		const filePath = path.join(process.cwd(), ".env.local");
        const fileExists = fs.existsSync(filePath);
        // Respond true if file is there
		res.status(200).json({ fileExists });
	} catch (error) {
		// Respond with false if is not there
		res.status(200).json({ fileExists: false });
	}
}
