import { useEffect, useState } from 'react'
import '../styles/WordleGame.css'

export default function WordleGame({ wordData }) {
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [won, setWon] = useState(false)
  const [message, setMessage] = useState('')
  const [letterStates, setLetterStates] = useState({})

  const word = wordData.label.toLowerCase()
  const maxGuesses = 6

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (won) return
      
      if (e.key === 'Enter') {
        handleSubmitGuess()
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1))
      } else if (/^[a-z]$/i.test(e.key)) {
        if (currentGuess.length < word.length) {
          setCurrentGuess(prev => prev + e.key.toLowerCase())
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentGuess, won, word])

  const getLetterState = (letter, guessWord) => {
    // Correct position
    if (word[guessWord.indexOf(letter)] === letter) {
      return 'correct'
    }
    // Wrong position
    if (word.includes(letter)) {
      return 'present'
    }
    // Not in word
    return 'absent'
  }

  const handleSubmitGuess = () => {
    if (currentGuess.length !== word.length) {
      setMessage('Word must be ' + word.length + ' letters')
      setTimeout(() => setMessage(''), 2000)
      return
    }

    const newGuess = currentGuess
    const newGuesses = [...guesses, newGuess]
    setGuesses(newGuesses)

    // Update letter states
    const newLetterStates = { ...letterStates }
    for (let i = 0; i < newGuess.length; i++) {
      const letter = newGuess[i]
      if (word[i] === letter) {
        newLetterStates[letter] = 'correct'
      } else if (word.includes(letter) && newLetterStates[letter] !== 'correct') {
        newLetterStates[letter] = 'present'
      } else if (!newLetterStates[letter]) {
        newLetterStates[letter] = 'absent'
      }
    }
    setLetterStates(newLetterStates)

    if (newGuess === word) {
      setWon(true)
      setMessage('🎉 You won!')
    } else if (newGuesses.length >= maxGuesses) {
      setMessage(`Game Over! The word was: ${word}`)
      setWon(true)
    }

    setCurrentGuess('')
  }

  return (
    <div className="wordle-container">
      <div className="guesses">
        {Array.from({ length: maxGuesses }).map((_, i) => (
          <div key={i} className="guess-row">
            {Array.from({ length: word.length }).map((_, j) => {
              const letter = guesses[i]?.[j] || (i === guesses.length ? currentGuess[j] : '')
              const state = guesses[i] ? getLetterState(guesses[i][j], guesses[i]) : ''
              
              return (
                <div
                  key={j}
                  className={`letter-box ${state} ${letter ? 'filled' : ''}`}
                >
                  {letter?.toUpperCase()}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {message && <p className="message">{message}</p>}

      {!won && (
        <div className="input-section">
          <input
            type="text"
            value={currentGuess.toUpperCase()}
            // onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
            placeholder={`Enter a ${word.length}-letter word`}
            maxLength={word.length}
            autoFocus
          />
          <button onClick={handleSubmitGuess}>
            Guess
          </button>
        </div>
      )}

      {won && (
        <div className="result">
          <h2>Word: <span className="word-label">{word.toUpperCase()}</span></h2>
          <p className="definition">{wordData.definition}</p>
          <a href={wordData.id} target="_blank" rel="noopener noreferrer" className="thesaurus-link">
            View in CROW Thesaurus →
          </a>
        </div>
      )}

      <div className="keyboard">
        <h3>Letters guessed:</h3>
        <div className="letter-grid">
          {Object.entries(letterStates).map(([letter, state]) => (
            <span key={letter} className={`letter-indicator ${state}`}>
              {letter.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
