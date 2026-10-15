import { useState } from 'react';

export default function AssessmentCard({ onStart }) {
  const moods = ['😄', '🙂', '😌', '😐', '😟', '😔'];
  
  // State to track the random position of each emoji
  const [positions, setPositions] = useState(moods.map(() => ({ x: 0, y: 0 })));

  // Function to make an emoji jump and then return
  const dodge = (index) => {
    // 1. Move to a random spot
    const x = (Math.random() - 0.5) * 160; 
    const y = (Math.random() - 0.5) * 160;
    
    setPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = { x, y };
      return newPositions;
    });

    // 2. Return to original spot after 800ms
    setTimeout(() => {
      setPositions(prev => {
        const newPositions = [...prev];
        newPositions[index] = { x: 0, y: 0 };
        return newPositions;
      });
    }, 800);
  };

  return (
    <div className="hero-card checkin-card">
      <div className="hero-content">
      <span className="eyebrow">💭 A MOMENT OF CURIOSITY</span>
<h2>What does your mind do when no one's watching?</h2>
<p>Take a playful pause to explore your thinking patterns — how you spot connections, hold memories, and adapt to change.</p>
        <button className="btn-primary" onClick={onStart}>Start assessment →</button>
      </div>
      
      <div className="hero-visual">
        <div className="mood-row">
          {moods.map((m, i) => (
            <span 
              key={i} 
              className="mood-emoji dodging"
              style={{ 
                transform: `translate(${positions[i].x}px, ${positions[i].y}px)` 
              }}
              onMouseEnter={() => dodge(i)} 
              onClick={() => {
                dodge(i);
                onStart(); 
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}