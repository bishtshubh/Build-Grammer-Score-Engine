import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const FFMPEG = "C:/Users/DELL/Downloads/ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe";
const WHISPER = "whisper"; // or full path

export const transcribeAudio = async (filePath) => {
  const wavFile = filePath.replace(path.extname(filePath), ".wav");
  const outDir = path.dirname(wavFile);

  execSync(
    `"${FFMPEG}" -y -i "${filePath}" -ar 16000 -ac 1 "${wavFile}"`,
    { stdio: "inherit" }
  );

  execSync(
    `"${WHISPER}" "${wavFile}" --model small --language en --output_format txt --output_dir "${outDir}"`,
    { stdio: "inherit" }
  );

  const txtFile = wavFile.replace(".wav", ".txt");
  if (!fs.existsSync(txtFile)) {
    throw new Error("Transcription file not created by Whisper");
  }

  const transcript = fs.readFileSync(txtFile, "utf-8").trim();

  try {
    fs.unlinkSync(filePath);
    fs.unlinkSync(wavFile);
  } catch {}

  return { transcript };
};
