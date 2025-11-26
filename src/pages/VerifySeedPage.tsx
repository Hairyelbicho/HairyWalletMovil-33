import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifySeedPage() {
  const navigate = useNavigate();
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
  const [questions, setQuestions] = useState<number[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState("");

  /** ---------------------------------------------------------
   * 1. Cargar frase desde almacenamiento temporal
   * --------------------------------------------------------- */
  useEffect(() => {
    const savedMnemonic = localStorage.getItem("hairywallet:tempMnemonic");

    if (!savedMnemonic) {
      navigate("/welcome");
      return;
    }

    const raw = JSON.parse(savedMnemonic);
    const words = Array.isArray(raw) ? raw : raw.split(" ");

    setMnemonicWords(words);

    /** ---------------------------------------------------------
     * 2. Seleccionar 3 palabras aleatorias sin repetir
     * --------------------------------------------------------- */
    const positions = new Set<number>();
    while (positions.size < 3) {
      positions.add(Math.floor(Math.random() * 12)); // para 12 palabras
    }

    setQuestions(Array.from(positions));
  }, [navigate]);

  /** ---------------------------------------------------------
   * 3. Validación de respuestas
   * --------------------------------------------------------- */
  const handleVerify = () => {
    setError("");

    for (const pos of questions) {
      const correct = mnemonicWords[pos].trim().toLowerCase();
      const user = (answers[pos] || "").trim().toLowerCase();

      if (correct !== user) {
        setError("? Una o más palabras no son correctas. Inténtalo de nuevo.");
        return;
      }
    }

    // Verificación correcta ? continuar al dashboard
    navigate("/seed-phrase");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <i className="ri-shield-check-fill text-3xl text-white"></i>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Verificar Frase Semilla
            </h1>
            <p className="text-purple-200">
              Para mayor seguridad, confirma estas palabras
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4">
              <p className="text-red-300 font-semibold">{error}</p>
            </div>
          )}

          {/* QUESTIONS */}
          <div className="space-y-6 mb-6">
            {questions.map((pos, index) => (
              <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                <label className="text-purple-200 font-semibold text-sm block mb-2">
                  Palabra #{pos + 1}
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder={`Escribe la palabra #${pos + 1}`}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [pos]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>

          {/* BOTÓN */}
          <button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg"
          >
            Verificar
          </button>

          {/* TIP DE SEGURIDAD */}
          <div className="mt-6 bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
            <div className="flex space-x-3">
              <i className="ri-lightbulb-line text-xl text-blue-300"></i>
              <p className="text-xs text-blue-200">
                Este paso asegura que realmente has guardado tu frase semilla.  
                Sin ella, nadie podrá ayudarte a recuperar tu wallet.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}