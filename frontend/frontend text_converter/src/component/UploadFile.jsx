import { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [grammarScore, setGrammarScore] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an audio file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:4000/api/upload",
        formData
      );

      setTranscript(res.data.transcript || "");
      setCorrectedText(res.data.correctedText || "");
      setMistakes(res.data.mistakes || []);
      setGrammarScore(res.data.grammarScore ?? null);
    } catch (err) {
      console.error(err);
      setError("❌ Upload or processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 md:p-10 transition-all">

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-900">
          🎙️ Audio Grammar Checker
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload your audio and get transcription, corrections & grammar score
        </p>

        {/* Upload Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <label className="flex-1 flex items-center justify-center px-5 py-3 border-2 border-dashed border-indigo-400 rounded-xl cursor-pointer hover:bg-indigo-50 transition">
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <span className="text-sm text-gray-700 font-medium">
              {file ? file.name : "🎧 Choose an audio file"}
            </span>
          </label>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Analyze"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 font-medium mb-6">
            {error}
          </div>
        )}

        {/* Grammar Score */}
        {grammarScore !== null && (
          <div className="mb-10">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Grammar Score
              </span>
              <span className="text-sm font-bold text-gray-900">
                {grammarScore}/100
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  grammarScore >= 80
                    ? "bg-green-500"
                    : grammarScore >= 60
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
                style={{ width: `${grammarScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-6">
          {transcript && (
            <div className="bg-gray-100 rounded-xl p-5 shadow">
              <h2 className="font-bold text-lg mb-2">📝 Transcript</h2>
              <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                {transcript}
              </p>
            </div>
          )}

          {correctedText && (
            <div className="bg-green-100 rounded-xl p-5 shadow">
              <h2 className="font-bold text-lg mb-2">✅ Corrected Text</h2>
              <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                {correctedText}
              </p>
            </div>
          )}

          {mistakes.length > 0 && (
            <div className="bg-red-100 rounded-xl p-5 shadow">
              <h2 className="font-bold text-lg mb-4">❌ Grammar Issues</h2>
              <ul className="space-y-3">
                {mistakes.map((m, i) => (
                  <li
                    key={i}
                    className="bg-white rounded-lg p-4 border border-red-300"
                  >
                    <p className="text-sm font-semibold text-red-700 mb-1">
                      {m.message}
                    </p>
                    <p className="text-sm text-gray-800">
                      <b>Incorrect:</b> {m.incorrect} <br />
                      <b>Suggestion:</b> {m.suggestion}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-10">
          Built with React • Tailwind • Whisper • FFmpeg
        </p>
      </div>
    </div>
  );
}
