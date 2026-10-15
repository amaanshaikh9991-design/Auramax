export default function OptionButton({ label, onClick, disabled, state }) {
  const cls = [
    'option-btn',
    state === 'correct' && 'correct',
    state === 'wrong' && 'wrong',
    disabled && 'disabled'
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}