const COLORS = [
  { name: 'Red', emoji: '🔴' },
  { name: 'Blue', emoji: '🔵' },
  { name: 'Green', emoji: '🟢' },
  { name: 'Yellow', emoji: '🟡' },
  { name: 'Purple', emoji: '🟣' },
  { name: 'Orange', emoji: '🟠' }
];

const SHAPES = [
  { name: 'Circle', emoji: '⚪' },
  { name: 'Star', emoji: '⭐' },
  { name: 'Triangle', emoji: '🔺' },
  { name: 'Diamond', emoji: '🔷' },
  { name: 'Heart', emoji: '❤️' },
  { name: 'Square', emoji: '🟥' }
];

export const ModuleConfig = [
  { name: 'A — Pattern Detective', key: 'reasoning', type: 'reasoning', icon: '🔍' },
  { name: 'B — Memory Mission', key: 'memory', type: 'memory', icon: '🧩' },
  { name: 'C — Attention Hunter', key: 'attention', type: 'attention', icon: '🎯' },
  { name: 'D — Stop-Go Challenge', key: 'inhibition', type: 'inhibition', icon: '🚦' },
  { name: 'E — Rule Switch', key: 'flexibility', type: 'flexibility', icon: '🔄' }
];

export function createQuestionsForGrade(grade) {
  const level = Math.min(12, Math.max(5, Number(grade) || 5));
  const advanced = level >= 9;
  const reasoning = createReasoningQuestions(level);
  const memory = createMemoryQuestions(level);
  const attention = createAttentionQuestions(level);
  const inhibition = createInhibitionQuestions(advanced);
  const flexibility = createFlexibilityQuestions(advanced);

  return ModuleConfig.flatMap((module) =>
    ({ reasoning, memory, attention, inhibition, flexibility })[module.type].map(
      (question, index) => ({
        ...question,
        module: module.name,
        moduleKey: module.key,
        type: module.type,
        idx: index
      })
    )
  );
}

export const QuestionBank = Object.fromEntries(
  ModuleConfig.map((module) => [
    module.type,
    createQuestionsForGrade(5).filter((question) => question.type === module.type)
  ])
);

function createReasoningQuestions(grade) {
  const step = grade - 2;
  const factor = grade <= 6 ? 2 : 3;
  const squareStart = grade - 5;
  const wordProblemCount = grade + 4;
  const ratioBase = grade + 2;
  const makeOptions = (answer, offsets, correctIndex = 0) => {
    const values = offsets.map((offset) => answer + offset);
    values.splice(correctIndex, 0, answer);
    return { options: values.map(String), answer: correctIndex };
  };

  const sequenceQuestion = (id, prompt, sequence, answer, offsets) => {
    const questionNumber = Number(id.slice(-1));
    const choices = makeOptions(answer, offsets, (grade + questionNumber) % 4);
    return {
      id,
      q: `${prompt} ${sequence.join(' → ')} → ?`,
      options: choices.options,
      answer: choices.answer
    };
  };

  return [
    sequenceQuestion(
      'reasoning-1',
      'Find the next number:',
      [step, step * 2, step * 3, step * 4],
      step * 5,
      [step * 2, -1, 1]
    ),
    sequenceQuestion(
      'reasoning-2',
      'Find the next number:',
      [2, 2 * factor, 2 * factor ** 2, 2 * factor ** 3],
      2 * factor ** 4,
      [factor, -2, 2]
    ),
    sequenceQuestion(
      'reasoning-3',
      'The numbers are consecutive squares. What comes next?',
      [squareStart ** 2, (squareStart + 1) ** 2, (squareStart + 2) ** 2],
      (squareStart + 3) ** 2,
      [grade, -grade, 1]
    ),
    sequenceQuestion(
      'reasoning-4',
      'The gaps increase by 2 each time. Find the next number:',
      [grade, grade + 2, grade + 6, grade + 12],
      grade + 20,
      [2, -2, 10]
    ),
    (() => {
      const advancedQuestion = grade >= 9;
      const price = grade * 50;
      const answer = advancedQuestion ? price * 0.9 : wordProblemCount * 4;
      const choices = makeOptions(
        answer,
        advancedQuestion ? [price / 10, -price / 10, grade * 7] : [4, -4, 8],
        (grade + 1) % 4
      );
      return {
        id: 'reasoning-5',
        q: advancedQuestion
          ? `A book costs ₹${price} and is discounted by 10%. What is its sale price?`
          : `A school club packs ${wordProblemCount} kits with 4 pencils in each kit. How many pencils are needed?`,
        options: choices.options,
        answer: choices.answer
      };
    })(),
    (() => {
      const advancedQuestion = grade >= 9;
      const answer = advancedQuestion ? grade : ratioBase * 3;
      const choices = makeOptions(
        answer,
        advancedQuestion ? [1, -1, 2] : [3, -3, 6],
        (grade + 2) % 4
      );
      return {
        id: 'reasoning-6',
        q: advancedQuestion
          ? `Three more than twice a number is ${grade * 2 + 3}. What is the number?`
          : `A recipe uses ${ratioBase} cups of flour for one batch. How many cups are needed for 3 batches?`,
        options: choices.options,
        answer: choices.answer
      };
    })()
  ];
}

function createMemoryQuestions(grade) {
  const symbols = ['🐱', '🍎', '🚗', '⭐', '🌳', '🐶', '🍋', '🚲', '🐸', '🎈', '📘', '🌙'];
  const sequenceLength = Math.min(8, Math.ceil(grade / 2) + 2);

  return Array.from({ length: 6 }, (_, questionIndex) => {
    const length = Math.min(sequenceLength + (questionIndex % 2), symbols.length);
    const start = (grade + questionIndex * 2) % symbols.length;
    const sequence = Array.from(
      { length },
      (_, index) => symbols[(start + index * (questionIndex + 1)) % symbols.length]
    );
    const answerIndex = (grade + questionIndex) % length;
    const answer = sequence[answerIndex];
    const distractors = symbols.filter((symbol) => !sequence.includes(symbol)).slice(0, 3);
    const answerOptionIndex = (grade + questionIndex) % 4;
    const options = [...distractors];
    options.splice(answerOptionIndex, 0, answer);

    return {
      id: `memory-${questionIndex + 1}`,
      sequence,
      question: `Which object was shown ${ordinal(answerIndex + 1)}?`,
      options,
      answer: answerOptionIndex
    };
  });
}

function createAttentionQuestions(grade) {
  const symbols = ['🔵', '🔺', '🟢', '🟡', '🔴', '🟣', '🔷'];
  const target = '⭐';
  const gridLength = 16 + grade;
  const targetInterval = Math.max(3, 7 - Math.floor((grade - 5) / 2));

  return Array.from({ length: 6 }, (_, questionIndex) => {
    const symbolsInGrid = Array.from({ length: gridLength }, (_, index) => {
      if ((index + questionIndex * 2) % targetInterval === 0) return target;
      return symbols[(index * 3 + questionIndex + grade) % symbols.length];
    });
    return {
      id: `attention-${questionIndex + 1}`,
      instruction: `Click every ${target} you can find. Do not click other symbols.`,
      symbols: symbolsInGrid,
      target
    };
  });
}

function createInhibitionQuestions(advanced) {
  const colorOptions = advanced
    ? ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange']
    : ['Red', 'Blue', 'Green', 'Yellow'];
  const colorNames = colorOptions.map((color) => color.toLowerCase());

  return Array.from({ length: 6 }, (_, index) => {
    const wordIndex = index % colorNames.length;
    const inkIndex = (wordIndex + 1 + (index % 2)) % colorNames.length;
    return {
      id: `inhibition-${index + 1}`,
      word: colorNames[wordIndex].toUpperCase(),
      color: colorNames[inkIndex],
      question: 'What COLOR is this word written in?',
      options: colorOptions,
      answer: inkIndex
    };
  });
}

function createFlexibilityQuestions(advanced) {
  const itemCount = advanced ? 6 : 4;

  return Array.from({ length: 6 }, (_, index) => {
    const sortByColor = index % 2 === 0;
    const targetIndex = (index + 1) % itemCount;
    const target = sortByColor ? COLORS[index % COLORS.length] : SHAPES[index % SHAPES.length];
    const options = sortByColor ? COLORS : SHAPES;
    const distractors = options.filter((option) => option.name !== target.name);
    const items = Array.from({ length: itemCount }, (_, itemIndex) => {
      if (itemIndex === targetIndex) return { emoji: target.emoji, value: target.name };
      const distractorIndex = itemIndex > targetIndex ? itemIndex - 1 : itemIndex;
      const distractor = distractors[(distractorIndex + index) % distractors.length];
      return { emoji: distractor.emoji, value: distractor.name };
    });

    return {
      id: `flexibility-${index + 1}`,
      rule: `Sort by ${sortByColor ? 'COLOR' : 'SHAPE'} — pick the ${target.name.toUpperCase()} item`,
      items,
      answer: targetIndex
    };
  });
}

function ordinal(value) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = value % 100;
  return `${value}${suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]}`;
}
