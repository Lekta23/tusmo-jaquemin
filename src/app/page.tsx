"use client";

import React, { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [initialWord, setInitialWord] = useState('');
  const [word, setWord] = useState('');
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<string[][]>([]);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const fetchRandomWord = () => {
    fetch('https://trouve-mot.fr/api/random/1')
      .then(response => response.json())
      .then(data => {
        const fetchedWord = data[0].name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        console.log(fetchedWord);
        setWord(fetchedWord);
        setInitialWord(fetchedWord);
        resetGame();
      })
      .catch(error => console.error('Error fetching the word:', error));
  };

  const resetGame = () => {
    setGuess('');
    setFeedback([]);
    setAttempts(0);
    setError(null);
    setHistory([]);
  };

  const handleGuess = () => {
    const fullGuess = word[0] + guess;
    if (fullGuess.length !== word.length) {
      setError(`Le mot doit avoir ${word.length} lettres.`);
      return;
    }
    if (fullGuess[0] !== word[0]) {
      setError(`Le mot doit commencer par la lettre ${word[0]}.`);
      return;
    }
    setError(null);

    if (attempts < 6) {
      const newFeedback = [];
      const wordLetters = word.split('');
      const guessLetters = fullGuess.split('');

      for (let i = 0; i < guessLetters.length; i++) {
        if (guessLetters[i] === wordLetters[i]) {
          newFeedback.push('bg-red-500');
        } else if (wordLetters.includes(guessLetters[i])) {
          newFeedback.push('bg-yellow-500');
        } else {
          newFeedback.push('bg-blue-500');
        }
      }

      setFeedback([...feedback, newFeedback]);
      setHistory([...history, fullGuess]);
      setAttempts(attempts + 1);

      if (fullGuess === word) {
        setError('Vous avez trouvé le mot !');
      } else if (attempts + 1 === 6) {
        setError(`Vous avez épuisé vos essais. Le mot était ${word}.`);
      }
    }
    setGuess('');
  };

  const handleRestart = () => {
    fetchRandomWord();
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (attempts >= 6) return;

      const { key } = e;
      if (key.length === 1 && key.match(/[a-z]/i)) {
        setGuess((prevGuess) => {
          const newGuess = prevGuess + key.toUpperCase();
          if (newGuess.length >= word.length - 1) {
            return newGuess.slice(0, word.length - 1);
          }
          return newGuess;
        });
      } else if (key === 'Backspace') {
        setGuess((prevGuess) => {
          if (prevGuess.length > 0) {
            return prevGuess.slice(0, -1);
          }
          return prevGuess;
        });
      } else if (key === 'Enter') {
        handleGuess();
      }
    },
    [word, attempts, handleGuess]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <h1 className="text-4xl font-bold mb-4">Tusmo</h1>
      <div className="flex space-x-2 mb-4">
        <span className="p-2 border border-gray-300 rounded text-white">{word[0]}</span>
        {Array.from({ length: word.length - 1 }).map((_, i) => (
          <span key={i} className="p-2 border border-gray-300 rounded text-white">
            {guess[i] || '_'}
          </span>
        ))}
      </div>
<div>
  <button
    onClick={handleGuess}
    className="p-2 bg-blue-500 text-white rounded"
    disabled={attempts >= 6}
  >
    Deviner
  </button>
</div>
<div className="mt-4">
  <button
    onClick={handleRestart}
    className="p-2 bg-green-500 text-white rounded flex items-center"
  >
    Recommencer
  </button>
</div>


      {error && <div className="mt-2 text-red-500">{error}</div>}
      <div className="mt-4">
        {history.map((pastGuess, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            {feedback[index].map((color, i) => (
              <span key={i} className={`w-10 h-10 text-center font-bold p-2 rounded ${color}`}>
                {pastGuess[i]}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-4">Nombre d’essais restants: {6 - attempts}</p>
    </div>
  );
}
