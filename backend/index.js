import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs"
import { checkGrammar } from "./service/grammarService.js"
import { transcribeAudio } from "./service/audioService.js"

dotenv.config();

const app = express();

app.use(cors({
    origin:'*',
    methods:['GET','PUT','POST','DELETE'],
    allowedHeaders:['Content-Type']
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(process.cwd(),"uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination:(_, __, cb) => cb(null, uploadDir),
    filename: (_,file,cb) =>
        cb(null,Date.now() + path.extname(file.originalname))
})

const upload = multer({storage})

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { transcript } = await transcribeAudio(req.file.path);
    const grammarScore = Math.max(
      0,
      100 - grammarResult.mistakes.length * 5
      );

       return res.json({
       transcript,
       correctedText: grammarResult.correctedText,
       mistakes: grammarResult.mistakes,
       grammarScore
      });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process file" });
  }
});

const PORT= process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server running on PORT no ${PORT}`)
});


app.post('/api/transcribe',async(req,res)=>{
    try {
        const {path: filePath} = req.body;
        if(!filePath){
            return res.status(400).json({error:"File path is required"});
        }
        const result = await transcribeAudio(filePath);
        return res.json({
            success:true,
            transcript
        });
    } catch (error) {
        console.error("TRANSCRIPTION ERROR:", error);
    return res.status(500).json({
        error: "Failed to transcribe audio",
        details: error.message
    });
}
});