// Only comments and no code by ChatGPT

import fsPromises from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "db/questions.json");

export default async function handler(req, res) {
	if (req.method === "GET") {
		/* 
            GET Requests: 
            When a GET request is received, the handler reads the questions JSON file located in the 'data' directory of the project's current working directory. It parses this file from JSON into a JavaScript object. If this operation is successful, it logs the fetched questions to the console for debugging purposes and sends them back to the requester with a 200 OK HTTP status code, encapsulated in a JSON response. 
            */
		const fileData = await fsPromises.readFile(filePath);
		const questionsData = JSON.parse(fileData);
		console.log("Questions read from state:", questionsData);
		res.status(200).json(questionsData);
	} else if (req.method === "POST") {
		try {
			/* POST Requests:
            For POST requests, the handler aims to update the questions JSON file with new data received in the request body. It first attempts to parse the incoming JSON payload into a JavaScript object. If parsing is successful, it logs the new questions data for debugging and then serializes this data back into a JSON string. This string is then written to the questions file, effectively updating its contents. A successful write operation results in a 200 OK response to the requester, indicating that the questions were updated successfully. If any errors occur during this process, such as during parsing or writing, the handler catches these exceptions, logs them for debugging, and returns a 500 Internal Server Error status code with an appropriate error message. */
			const questions = req.body;
			const parsedQuestions = JSON.parse(questions);
			const newQuestions = parsedQuestions;
			console.log("Questions written to state:", newQuestions);
			const updatedQuestion = JSON.stringify(newQuestions);
			await fsPromises.writeFile(filePath, updatedQuestion);
			res.status(200).json({ message: "Questions updated successfully" });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Error storing data" });
		}
	}
}
