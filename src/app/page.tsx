"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [word, setWord] = useState('');
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<string[][]>([]);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    fetch('https://trouve-mot.fr/api/random/1')
      .then(response => response.json())
      .then(data => {
        console.log(data[0].name.toUpperCase());
        setWord(data[0].name.toUpperCase())
      })
      .catch(error => console.error('Error fetching the word:', error));
  }, []);

  const handleGuess = () => {
    if (guess.length !== word.length) {
      setError(`Le mot doit avoir ${word.length} lettres.`);
      return;
    }
    if (guess[0].toUpperCase() !== word[0]) {
      setError(`Le mot doit commencer par la lettre ${word[0]}.`);
      return;
    }
    setError(null);

    if (attempts < 6) {
      const newFeedback = [];
      const wordLetters = word.split('');
      const guessLetters = guess.toUpperCase().split('');

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
      setHistory([...history, guess.toUpperCase()]);
      setAttempts(attempts + 1);

      if (guess.toUpperCase() === word) {
        setError('Vous avez trouvé le mot !');
      } else if (attempts + 1 === 6) {
        setError(`Vous avez épuisé vos essais. Le mot était ${word}.`);
      }
    }
    setGuess('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <h1 className="text-4xl font-bold mb-4">Tusmo</h1>
      <div className="flex space-x-2">
        {word.split('').map((letter, i) => (
          <span key={i} className="p-2 border border-gray-300 rounded text-white">
            {i === 0 ? letter : '_'}
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="Devinez le mot"
        value={guess}
        onChange={(e) => setGuess(e.target.value.toUpperCase())}
        className="mb-2 p-2 border border-gray-300 rounded text-black"
        maxLength={word.length}
        disabled={attempts >= 6}
      />
      <button
        onClick={handleGuess}
        className="p-2 bg-blue-500 text-white rounded"
        disabled={attempts >= 6}
      >
        Deviner
      </button>
      {error && <div className="mt-2 text-red-500">{error}</div>}
      <div className="mt-4">
        {history.map((guess, index) => (
          <div key={index} className="flex space-x-2">
            {feedback[index].map((color, i) => (
              <span key={i} className={`p-2 border border-gray-300 rounded ${color}`}>
                {guess[i]}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-4">Nombre d’essais restants: {6 - attempts}</p>
    </div>
  );
}
