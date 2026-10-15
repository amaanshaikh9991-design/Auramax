const moods = [
  { value: "great", emoji: "😄", label: "Great" },
  { value: "good", emoji: "🙂", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "low", emoji: "😕", label: "Low" },
  { value: "rough", emoji: "😞", label: "Rough" },
];

function MoodSelector({ value, onChange }) {
  return (
    <div className="ui-mood-selector">
      {moods.map((mood) => {
        const selected = value === mood.value;

        return (
          <button
            key={mood.value}
            type="button"
            className={`ui-mood-option ${
              selected ? "selected" : ""
            }`}
            onClick={() => onChange?.(mood.value)}
            aria-pressed={selected}
          >
            <span className="ui-mood-emoji">{mood.emoji}</span>
            <span className="ui-mood-label">{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default MoodSelector;