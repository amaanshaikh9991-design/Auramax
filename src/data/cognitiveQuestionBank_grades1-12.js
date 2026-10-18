/**
 * Cognitive Skills Test Bank — Grades 1–12
 * Source: the supplied Cognitive Skills Test Bank PDF.
 * Educational practice only; not a standardized or clinically validated psychological test.
 *
 * 12 grades x 5 domains x 6 questions = 360 questions.
 * Each item keeps the PDF's wording, domain, answer key and administration note.
 *
 * HOW THE APP USES THIS FILE
 *   - The answer choices (multiple choice) live in ./questionOptions.js, keyed by grade and
 *     question number. The FIRST choice listed there must always equal `answer` below.
 *   - getQuestionsForGrade(grade) (bottom of this file) joins the two, splits "show / hide"
 *     memory items into stimulus + prompt, and shuffles the choices for each student.
 *
 * CORRECTIONS MADE TO THE ORIGINAL BANK (42 edits; every one is listed in CHANGES.md)
 *   Wrong answer keys ..... grade-3-reasoning-6, grade-5-inhibition-24, grade-8-inhibition-20,
 *                           grade-9-memory-8, grade-10-attention-17, grade-10-inhibition-19,
 *                           grade-11-reasoning-2, grade-12-memory-8, grade-12-inhibition-22,
 *                           grade-12-inhibition-23
 *   Flawed question text .. grade-1-memory-9 (corrupted), grade-2-memory-11, grade-6-attention-14,
 *                           grade-8-memory-11, grade-8-attention-13, grade-9-memory-10
 *   Typos .................. grade-10-reasoning-2, grade-12-reasoning-3, grade-12-flexibility-28/29
 *   Notes cleaned .......... administrationNote fields that contained solution working
 */
import { QUESTION_OPTIONS } from './questionOptions.js';

export const DOMAIN_CONFIG = [
  { name: 'Pattern Detective', key: 'reasoning', type: 'reasoning', icon: '🔍' },
  { name: 'Memory Mission', key: 'memory', type: 'memory', icon: '🧩' },
  { name: 'Attention Hunter', key: 'attention', type: 'attention', icon: '🎯' },
  { name: 'Stop-Go Challenge', key: 'inhibition', type: 'inhibition', icon: '🚦' },
  { name: 'Rule Switch', key: 'flexibility', type: 'flexibility', icon: '🔄' }
];

export const cognitiveQuestionBank = {
  "1": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "A toy train has red, blue, red, blue carriages. What color is the next carriage?",
        "administrationNote": null,
        "answer": "red",
        "id": "grade-1-reasoning-1",
        "grade": 1
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "Mia sees 1, 2, 3, __ shells in a row. What number comes next?",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-1-reasoning-2",
        "grade": 1
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "Which shape completes the repeating sequence: circle, triangle, square, circle, triangle, __?",
        "administrationNote": null,
        "answer": "square",
        "id": "grade-1-reasoning-3",
        "grade": 1
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "A bird visits the branch every other day: Monday, Wednesday, Friday, __. Which day is next?",
        "administrationNote": null,
        "answer": "Sunday",
        "id": "grade-1-reasoning-4",
        "grade": 1
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "Which picture-word does not belong: apple, banana, carrot, grape?",
        "administrationNote": null,
        "answer": "carrot",
        "id": "grade-1-reasoning-5",
        "grade": 1
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "A tower has 2 blocks on the first level, 4 on the second, and 6 on the third. How many on the fourth?",
        "administrationNote": null,
        "answer": "8",
        "id": "grade-1-reasoning-6",
        "grade": 1
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Look at these for 8 seconds: kite, spoon, moon. Hide them. Which one could fly?",
        "administrationNote": "Show/hide stimulus.",
        "answer": "kite",
        "id": "grade-1-memory-7",
        "grade": 1
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Read aloud: 4, 1, 7. Hide it. What was the middle number?",
        "administrationNote": "Read once, then ask.",
        "answer": "1",
        "id": "grade-1-memory-8",
        "grade": 1
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Show: cat, ball, flower, sun, hat. Hide it. Which item was in the middle?",
        "administrationNote": "Use pictures or words.",
        "answer": "flower",
        "id": "grade-1-memory-9",
        "grade": 1
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Read: 'Sam put a red book under the chair.' What color was the book?",
        "administrationNote": "Read once.",
        "answer": "red",
        "id": "grade-1-memory-10",
        "grade": 1
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Show for 8 seconds: circle, star, triangle, square. Hide it. Which shape came last?",
        "administrationNote": "Show/hide stimulus.",
        "answer": "square",
        "id": "grade-1-memory-11",
        "grade": 1
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Read: 'At the park, Ava saw a duck and fed it bread.' What animal did Ava see?",
        "administrationNote": "Read once.",
        "answer": "duck",
        "id": "grade-1-memory-12",
        "grade": 1
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "Listen to these words: cat, sun, dog, cup, dog. How many times did you hear 'dog'?",
        "administrationNote": "Read slowly.",
        "answer": "2",
        "id": "grade-1-attention-13",
        "grade": 1
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "On a page, find every letter M among M N W M V M. How many M's?",
        "administrationNote": "Use printed symbols if possible.",
        "answer": "3",
        "id": "grade-1-attention-14",
        "grade": 1
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Which word is written exactly as requested: SUN, SNU, SUNN?",
        "administrationNote": null,
        "answer": "SUN",
        "id": "grade-1-attention-15",
        "grade": 1
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "Count the objects named in this line: ball, kite, ball, book, ball.",
        "administrationNote": "Count all items.",
        "answer": "5",
        "id": "grade-1-attention-16",
        "grade": 1
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Spot the different symbol: ○ ○ ○ ● ○.",
        "administrationNote": null,
        "answer": "●",
        "id": "grade-1-attention-17",
        "grade": 1
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Listen for the word 'blue' in this list: red, green, blue, yellow, blue. How many?",
        "administrationNote": null,
        "answer": "2",
        "id": "grade-1-attention-18",
        "grade": 1
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Game rule: touch your head when you hear an animal. Cue: tiger.",
        "administrationNote": null,
        "answer": "Touch head",
        "id": "grade-1-inhibition-19",
        "grade": 1
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "Game rule: freeze when you hear a food. Cue: STOP.",
        "administrationNote": null,
        "answer": "Do not freeze; STOP is not food",
        "id": "grade-1-inhibition-20",
        "grade": 1
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Walk in place while the teacher taps slowly; stop when the tapping stops. What do you do when tapping stops?",
        "administrationNote": null,
        "answer": "Stop walking",
        "id": "grade-1-inhibition-21",
        "grade": 1
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Say your name when you see a green card; do nothing for a red card. Card: red.",
        "administrationNote": null,
        "answer": "Do nothing",
        "id": "grade-1-inhibition-22",
        "grade": 1
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "Rule: clap for a loud sound, stay still for a quiet sound. Sound: quiet.",
        "administrationNote": null,
        "answer": "Stay still",
        "id": "grade-1-inhibition-23",
        "grade": 1
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Rule: jump for a star card, stand still for a moon card. Card: moon.",
        "administrationNote": null,
        "answer": "Stand still",
        "id": "grade-1-inhibition-24",
        "grade": 1
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Round 1: sort by color. A yellow banana goes in which group? Round 2: sort by food type—where does it go?",
        "administrationNote": null,
        "answer": "yellow group; then fruit group",
        "id": "grade-1-flexibility-25",
        "grade": 1
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "First say the animal sound for a cow. Now switch: name the animal, not its sound. What is it?",
        "administrationNote": null,
        "answer": "cow",
        "id": "grade-1-flexibility-26",
        "grade": 1
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "When you see a circle, say 'round'; when you see a square, say 'corners'. What do you say for a square?",
        "administrationNote": null,
        "answer": "corners",
        "id": "grade-1-flexibility-27",
        "grade": 1
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "Change the rule: first point to the biggest object; now point to the smallest. Among a book, a bus, and a button, which is smallest?",
        "administrationNote": null,
        "answer": "button",
        "id": "grade-1-flexibility-28",
        "grade": 1
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Sort toys by size, then switch to sorting by whether they roll. Does a ball go in the roll group?",
        "administrationNote": null,
        "answer": "yes",
        "id": "grade-1-flexibility-29",
        "grade": 1
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "Say 'day' for sun and 'night' for moon. Switch labels: say 'night' for sun and 'day' for moon. What do you say for sun now?",
        "administrationNote": null,
        "answer": "night",
        "id": "grade-1-flexibility-30",
        "grade": 1
      }
    ]
  },
  "2": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "A bead string goes yellow, yellow, green, yellow, yellow, green. What are the next two beads?",
        "administrationNote": null,
        "answer": "yellow, yellow",
        "id": "grade-2-reasoning-1",
        "grade": 2
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "Complete the count by fives: 5, 10, 15, __.",
        "administrationNote": null,
        "answer": "20",
        "id": "grade-2-reasoning-2",
        "grade": 2
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "A shape turns from point-up triangle to point-down triangle, then point-up. What comes next?",
        "administrationNote": null,
        "answer": "point-down triangle",
        "id": "grade-2-reasoning-3",
        "grade": 2
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "Which does not fit the group: spoon, fork, plate, sock?",
        "administrationNote": null,
        "answer": "sock",
        "id": "grade-2-reasoning-4",
        "grade": 2
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "The number of dots goes 1, 3, 5, 7. How many dots are next?",
        "administrationNote": null,
        "answer": "9",
        "id": "grade-2-reasoning-5",
        "grade": 2
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "A week pattern repeats school, school, home. If today is the second school day, what is tomorrow?",
        "administrationNote": null,
        "answer": "home",
        "id": "grade-2-reasoning-6",
        "grade": 2
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Remember: 6, 2, 9, 5. What was the first and last number?",
        "administrationNote": "Read once.",
        "answer": "6 and 5",
        "id": "grade-2-memory-7",
        "grade": 2
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show: apple, key, sock, drum. Hide it. Which object could make music?",
        "administrationNote": "Show/hide.",
        "answer": "drum",
        "id": "grade-2-memory-8",
        "grade": 2
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Read: 'The yellow bus stopped beside the library at noon.' Where did the bus stop?",
        "administrationNote": "Read once.",
        "answer": "beside the library",
        "id": "grade-2-memory-9",
        "grade": 2
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Show for 10 seconds: ▲ ● ■ ★. Hide it. Which symbol was second?",
        "administrationNote": "Show/hide.",
        "answer": "●",
        "id": "grade-2-memory-10",
        "grade": 2
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Read: 3, 8, 1, 6. Hide it. Which list shows the numbers backward?",
        "administrationNote": "Read once.",
        "answer": "6, 1, 8, 3",
        "id": "grade-2-memory-11",
        "grade": 2
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Show: red, blue, green, yellow. Hide it. Name the colors in the original order.",
        "administrationNote": "Show/hide.",
        "answer": "red, blue, green, yellow",
        "id": "grade-2-memory-12",
        "grade": 2
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "Count only the animals: chair, rabbit, table, horse, spoon, bird.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-2-attention-13",
        "grade": 2
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Find the number that appears exactly twice: 4, 7, 4, 8, 9, 4, 7.",
        "administrationNote": null,
        "answer": "7",
        "id": "grade-2-attention-14",
        "grade": 2
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Which pair differs by one letter: CAT/CUT, DOG/DOG, SUN/SUN?",
        "administrationNote": null,
        "answer": "CAT/CUT",
        "id": "grade-2-attention-15",
        "grade": 2
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "Count words with exactly three letters: ant, flower, map, sun, pencil.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-2-attention-16",
        "grade": 2
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Find the only word with the letter 'p': lake, pond, river, stream.",
        "administrationNote": null,
        "answer": "pond",
        "id": "grade-2-attention-17",
        "grade": 2
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Read carefully: 2 + 3 = 5; 4 + 1 = 5; 3 + 3 = 7. Which equation is incorrect?",
        "administrationNote": null,
        "answer": "3 + 3 = 7",
        "id": "grade-2-attention-18",
        "grade": 2
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Tap the desk for a fruit, but not for a vehicle. Cue: bicycle.",
        "administrationNote": null,
        "answer": "Do not tap",
        "id": "grade-2-inhibition-19",
        "grade": 2
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "Raise one finger for an odd number, hands down for an even number. Cue: 6.",
        "administrationNote": null,
        "answer": "Hands down",
        "id": "grade-2-inhibition-20",
        "grade": 2
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "When the teacher says 'day', stretch; when they say 'night', freeze. Cue: night.",
        "administrationNote": null,
        "answer": "Freeze",
        "id": "grade-2-inhibition-21",
        "grade": 2
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Say 'yes' for a true animal fact, stay silent for a false one: 'A fish lives in a tree.'",
        "administrationNote": null,
        "answer": "Stay silent",
        "id": "grade-2-inhibition-22",
        "grade": 2
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "Follow the rhythm: clap-clap, then pause. When should you pause?",
        "administrationNote": null,
        "answer": "After two claps",
        "id": "grade-2-inhibition-23",
        "grade": 2
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Respond only when a sentence ends with a question mark. 'Where is my bag.'",
        "administrationNote": null,
        "answer": "Do not respond",
        "id": "grade-2-inhibition-24",
        "grade": 2
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: name the color of a card. Rule B: name its shape. A blue triangle—what is the answer under Rule B?",
        "administrationNote": null,
        "answer": "triangle",
        "id": "grade-2-flexibility-25",
        "grade": 2
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Sort numbers into less than 5 and 5 or more. Switch to odd/even. Where does 8 go under the new rule?",
        "administrationNote": null,
        "answer": "even",
        "id": "grade-2-flexibility-26",
        "grade": 2
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "First clap for animals. Switch: clap for things that can fly. Cue: eagle. What do you do?",
        "administrationNote": null,
        "answer": "clap",
        "id": "grade-2-flexibility-27",
        "grade": 2
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "Rule A: say the first letter of a word. Rule B: say the last letter. For 'frog', what is the answer under Rule B?",
        "administrationNote": null,
        "answer": "g",
        "id": "grade-2-flexibility-28",
        "grade": 2
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Sort objects by what they are made of; then switch to living/nonliving. Is a wooden chair living?",
        "administrationNote": null,
        "answer": "nonliving",
        "id": "grade-2-flexibility-29",
        "grade": 2
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "Use 'up' for down and 'down' for up. What do you say when the arrow points up?",
        "administrationNote": null,
        "answer": "down",
        "id": "grade-2-flexibility-30",
        "grade": 2
      }
    ]
  },
  "3": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "Complete the sequence: 4, 8, 12, 16, __.",
        "administrationNote": null,
        "answer": "20",
        "id": "grade-3-reasoning-1",
        "grade": 3
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "A pattern alternates a small star and two large stars. After small, large, large, small, large, large, what comes next?",
        "administrationNote": null,
        "answer": "small star",
        "id": "grade-3-reasoning-2",
        "grade": 3
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "Find the odd one out: 16, 25, 36, 48, 49.",
        "administrationNote": null,
        "answer": "48",
        "id": "grade-3-reasoning-3",
        "grade": 3
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "A number machine doubles an input. What comes out for input 7?",
        "administrationNote": null,
        "answer": "14",
        "id": "grade-3-reasoning-4",
        "grade": 3
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "Letters skip one each time: A, C, E, G, __.",
        "administrationNote": null,
        "answer": "I",
        "id": "grade-3-reasoning-5",
        "grade": 3
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "A tiled path repeats 3 red tiles then 1 white tile. What color is tile 8?",
        "administrationNote": null,
        "answer": "white",
        "id": "grade-3-reasoning-6",
        "grade": 3
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'Nina packed a sandwich, an orange, and a bottle of water.' What drink did she pack?",
        "administrationNote": "Read once.",
        "answer": "water",
        "id": "grade-3-memory-7",
        "grade": 3
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show 5 words for 10 seconds: garden, pencil, tiger, window, bread. Which word was fourth?",
        "administrationNote": "Show/hide.",
        "answer": "window",
        "id": "grade-3-memory-8",
        "grade": 3
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Read: 5, 9, 2, 7, 4. Repeat only the numbers in odd positions.",
        "administrationNote": "Read once.",
        "answer": "5, 2, 4",
        "id": "grade-3-memory-9",
        "grade": 3
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Show: 12, 24, 31, 8. Hide it. What was the largest number?",
        "administrationNote": "Show/hide.",
        "answer": "31",
        "id": "grade-3-memory-10",
        "grade": 3
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Read: 'First wash the apple, then slice it, then place it on a plate.' What happened immediately before it went on the plate?",
        "administrationNote": "Read once.",
        "answer": "slice it",
        "id": "grade-3-memory-11",
        "grade": 3
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Show for 10 seconds: sun, moon, sun, star, moon. Which word appeared twice?",
        "administrationNote": "Show/hide.",
        "answer": "sun and moon",
        "id": "grade-3-memory-12",
        "grade": 3
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "Count the vowels in this string: B A T E R O P.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-3-attention-13",
        "grade": 3
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Which number is repeated consecutively: 5, 2, 2, 8, 3, 9?",
        "administrationNote": null,
        "answer": "2",
        "id": "grade-3-attention-14",
        "grade": 3
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Find the word that is not a color: teal, coral, violet, ladder.",
        "administrationNote": null,
        "answer": "ladder",
        "id": "grade-3-attention-15",
        "grade": 3
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "Count how many times the letter S appears in MISSISSIPPI.",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-3-attention-16",
        "grade": 3
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Which time is later: 10:45, 10:35, 10:40?",
        "administrationNote": null,
        "answer": "10:45",
        "id": "grade-3-attention-17",
        "grade": 3
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Find the spelling error: separate, calendar, recieve, familiar.",
        "administrationNote": null,
        "answer": "recieve",
        "id": "grade-3-attention-18",
        "grade": 3
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Stand when you hear a word that rhymes with 'cake'; stay seated otherwise. Cue: lake.",
        "administrationNote": null,
        "answer": "Stand",
        "id": "grade-3-inhibition-19",
        "grade": 3
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "Rule: touch left ear for a number over 10, do nothing for 10 or less. Cue: 8.",
        "administrationNote": null,
        "answer": "Do nothing",
        "id": "grade-3-inhibition-20",
        "grade": 3
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Do the action only after the word 'please': 'Jump, please jump.' When should you jump?",
        "administrationNote": null,
        "answer": "After 'please jump'",
        "id": "grade-3-inhibition-21",
        "grade": 3
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Count aloud on each beat, but skip counting on every third beat. What number is skipped in 1–6?",
        "administrationNote": null,
        "answer": "3 and 6",
        "id": "grade-3-inhibition-22",
        "grade": 3
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "Squeeze your hands for a mammal, relax for a bird. Cue: eagle.",
        "administrationNote": null,
        "answer": "Relax",
        "id": "grade-3-inhibition-23",
        "grade": 3
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Tap only if the statement is correct: 'A square has four sides.'",
        "administrationNote": null,
        "answer": "Tap",
        "id": "grade-3-inhibition-24",
        "grade": 3
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: add 2 to a number. Switch to Rule B: subtract 2. What is the output for 9 under Rule B?",
        "administrationNote": null,
        "answer": "7",
        "id": "grade-3-flexibility-25",
        "grade": 3
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Sort words by number of letters. Switch to alphabetical order. Which comes first: peach or pear?",
        "administrationNote": null,
        "answer": "peach",
        "id": "grade-3-flexibility-26",
        "grade": 3
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "Rule A: say the opposite of hot/cold. Switch: say a synonym instead. For 'cold', give a synonym.",
        "administrationNote": null,
        "answer": "chilly",
        "id": "grade-3-flexibility-27",
        "grade": 3
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "In round one, circle multiples of 2. In round two, underline multiples of 3. What should happen to 12 in round two?",
        "administrationNote": null,
        "answer": "underline 12",
        "id": "grade-3-flexibility-28",
        "grade": 3
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Sort shapes by corners. Switch to number of equal sides. Which feature would you use for an equilateral triangle?",
        "administrationNote": null,
        "answer": "three equal sides",
        "id": "grade-3-flexibility-29",
        "grade": 3
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "Rule A: convert hours to minutes. Switch: convert minutes to hours. Convert 180 minutes under Rule B.",
        "administrationNote": null,
        "answer": "3 hours",
        "id": "grade-3-flexibility-30",
        "grade": 3
      }
    ]
  },
  "4": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "What is the missing number: 7, 14, 21, __, 35?",
        "administrationNote": null,
        "answer": "28",
        "id": "grade-4-reasoning-1",
        "grade": 4
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "A sequence adds 2, then 4, then 6, then 8. Starting at 1, what are the first four terms?",
        "administrationNote": null,
        "answer": "1, 3, 7, 13",
        "id": "grade-4-reasoning-2",
        "grade": 4
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "Which fraction is the next step in this pattern: 1/2, 2/4, 3/6, __?",
        "administrationNote": null,
        "answer": "4/8",
        "id": "grade-4-reasoning-3",
        "grade": 4
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "In a code, CAT becomes DBU (each letter moves forward one). How does DOG change?",
        "administrationNote": null,
        "answer": "EPH",
        "id": "grade-4-reasoning-4",
        "grade": 4
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "A pattern repeats circle, square, square, triangle. What is the 11th shape?",
        "administrationNote": null,
        "answer": "square",
        "id": "grade-4-reasoning-5",
        "grade": 4
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "Which number does not follow the rule 'multiply by 3': 2, 6, 18, 54, 160?",
        "administrationNote": null,
        "answer": "160",
        "id": "grade-4-reasoning-6",
        "grade": 4
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'Leo left home at 8:10, reached school at 8:35, and returned at 3:00.' How long was the trip to school?",
        "administrationNote": "Read once.",
        "answer": "25 minutes",
        "id": "grade-4-memory-7",
        "grade": 4
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show 6 letters: R, T, A, M, P, L. Hide it. Which letter was third?",
        "administrationNote": "Show/hide.",
        "answer": "A",
        "id": "grade-4-memory-8",
        "grade": 4
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Read: 14, 3, 21, 8, 17. Repeat them from smallest to largest.",
        "administrationNote": "Read once.",
        "answer": "3, 8, 14, 17, 21",
        "id": "grade-4-memory-9",
        "grade": 4
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Show: compass, candle, feather, coin, shell. Which object was directly before coin?",
        "administrationNote": "Show/hide.",
        "answer": "feather",
        "id": "grade-4-memory-10",
        "grade": 4
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Read a short story: 'A storm delayed the train, so Mira waited in the station café and called her uncle.' Where did Mira wait?",
        "administrationNote": "Read once.",
        "answer": "station café",
        "id": "grade-4-memory-11",
        "grade": 4
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Show: 2, 4, 6, 8, 10. Hide it. What is the sum of the first and last numbers?",
        "administrationNote": "Show/hide.",
        "answer": "12",
        "id": "grade-4-memory-12",
        "grade": 4
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "Count the numbers greater than 20: 12, 24, 19, 31, 20, 28.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-4-attention-13",
        "grade": 4
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Which word has exactly two vowels: planet, sky, education, queue?",
        "administrationNote": null,
        "answer": "planet",
        "id": "grade-4-attention-14",
        "grade": 4
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Identify the two identical codes: A6B9, A6B8, A6B9, AGB9.",
        "administrationNote": null,
        "answer": "1st and 3rd",
        "id": "grade-4-attention-15",
        "grade": 4
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "In the sentence 'The small brown fox crossed the road,' how many words have five letters?",
        "administrationNote": null,
        "answer": "2",
        "id": "grade-4-attention-16",
        "grade": 4
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Spot the incorrect multiplication: 6×4=24; 7×3=21; 8×5=45.",
        "administrationNote": null,
        "answer": "8×5=45",
        "id": "grade-4-attention-17",
        "grade": 4
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Count the letters between D and K in the alphabet.",
        "administrationNote": null,
        "answer": "6",
        "id": "grade-4-attention-18",
        "grade": 4
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Do a silent thumbs-up for a multiple of 3, but not for a multiple of 2. Cue: 12.",
        "administrationNote": null,
        "answer": "No thumbs-up",
        "id": "grade-4-inhibition-19",
        "grade": 4
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "Say the opposite action: when told 'stand', remain seated; when told 'sit', stand. Cue: sit.",
        "administrationNote": null,
        "answer": "Stand",
        "id": "grade-4-inhibition-20",
        "grade": 4
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Respond to a color only if it is not red. Cue: red.",
        "administrationNote": null,
        "answer": "Do not respond",
        "id": "grade-4-inhibition-21",
        "grade": 4
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Read each word aloud except words that start with S: sun, tree, star, cloud. Which words should be skipped?",
        "administrationNote": null,
        "answer": "sun and star",
        "id": "grade-4-inhibition-22",
        "grade": 4
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "When a bell rings once, tap; when it rings twice, do nothing. The bell rings twice. What do you do?",
        "administrationNote": null,
        "answer": "Do nothing",
        "id": "grade-4-inhibition-23",
        "grade": 4
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Do the movement only if the number is odd and below 10. Cue: 9.",
        "administrationNote": null,
        "answer": "Move",
        "id": "grade-4-inhibition-24",
        "grade": 4
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: multiply by 3; Rule B: add 3. Apply Rule B to 7.",
        "administrationNote": null,
        "answer": "10",
        "id": "grade-4-flexibility-25",
        "grade": 4
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Sort fractions below 1 and above 1. Switch to fractions equal to 1 versus not equal to 1. Classify 5/5 under the new rule.",
        "administrationNote": null,
        "answer": "equal to 1",
        "id": "grade-4-flexibility-26",
        "grade": 4
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "First encode each letter one step forward. Switch to one step backward. Encode D under the new rule.",
        "administrationNote": null,
        "answer": "C",
        "id": "grade-4-flexibility-27",
        "grade": 4
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "Rule A: report the tens digit. Rule B: report the ones digit. For 684, what is the answer under Rule B?",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-4-flexibility-28",
        "grade": 4
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Sort animals by habitat. Switch to vertebrate/invertebrate. Where does an earthworm go?",
        "administrationNote": null,
        "answer": "invertebrate",
        "id": "grade-4-flexibility-29",
        "grade": 4
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "Rule A: read a word forward. Rule B: read it backward. What is 'STOP' under Rule B?",
        "administrationNote": null,
        "answer": "POTS",
        "id": "grade-4-flexibility-30",
        "grade": 4
      }
    ]
  },
  "5": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "Complete: 2, 6, 12, 20, 30, __.",
        "administrationNote": null,
        "answer": "42",
        "id": "grade-5-reasoning-1",
        "grade": 5
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "Find the missing term: 81, 27, 9, __, 1.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-5-reasoning-2",
        "grade": 5
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "A symbol code uses ▲=3 and ■=5. What is ▲×■ + 2?",
        "administrationNote": null,
        "answer": "17",
        "id": "grade-5-reasoning-3",
        "grade": 5
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "Which pair follows the same relation as seed:tree? egg:bird, wheel:road, page:book?",
        "administrationNote": null,
        "answer": "egg:bird",
        "id": "grade-5-reasoning-4",
        "grade": 5
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "A sequence alternates ×2 and +3: 2, 4, 7, 14, 17, __.",
        "administrationNote": null,
        "answer": "34",
        "id": "grade-5-reasoning-5",
        "grade": 5
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "If each polygon gains one side, what comes after a hexagon?",
        "administrationNote": null,
        "answer": "heptagon",
        "id": "grade-5-reasoning-6",
        "grade": 5
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'The museum opened at ten. The class visited the dinosaur room first and the planetarium last.' Which room did they visit first?",
        "administrationNote": "Read once.",
        "answer": "dinosaur room",
        "id": "grade-5-memory-7",
        "grade": 5
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show 7 digits for 12 seconds: 3, 8, 1, 6, 4, 9, 2. Repeat the sequence backward.",
        "administrationNote": "Show/hide.",
        "answer": "2, 9, 4, 6, 1, 8, 3",
        "id": "grade-5-memory-8",
        "grade": 5
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Show: copper, violet, cedar, silver, amber. Which word was third?",
        "administrationNote": "Show/hide.",
        "answer": "cedar",
        "id": "grade-5-memory-9",
        "grade": 5
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Read: 'Asha spent $4 on a notebook and $3 on a pen from a $10 note.' How much change did she receive?",
        "administrationNote": "Read once.",
        "answer": "$3",
        "id": "grade-5-memory-10",
        "grade": 5
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Show: ▲, ▲, ●, ■, ●, ★. How many circles appeared?",
        "administrationNote": "Show/hide.",
        "answer": "2",
        "id": "grade-5-memory-11",
        "grade": 5
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Read: 'The recipe needs two eggs after the flour is sifted but before the milk is added.' What step comes after adding eggs?",
        "administrationNote": "Read once.",
        "answer": "add the milk",
        "id": "grade-5-memory-12",
        "grade": 5
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "Count the prime numbers: 9, 11, 15, 17, 21, 23.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-5-attention-13",
        "grade": 5
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Which item is alphabetically out of order: amber, birch, cedar, apple, elm?",
        "administrationNote": null,
        "answer": "apple",
        "id": "grade-5-attention-14",
        "grade": 5
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Find the exact duplicate: R8T2K, R8T2X, RBT2K, R8T2K.",
        "administrationNote": null,
        "answer": "1st and 4th",
        "id": "grade-5-attention-15",
        "grade": 5
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "How many words in 'Bright birds build nests' begin with B?",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-5-attention-16",
        "grade": 5
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Which calculation is wrong: 12²=144; 9²=81; 7²=48; 5²=25?",
        "administrationNote": null,
        "answer": "7²=48",
        "id": "grade-5-attention-17",
        "grade": 5
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Count the odd digits in 8 1 4 7 0 3 6 9 2.",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-5-attention-18",
        "grade": 5
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "For each number, say 'go' unless it is divisible by 4. Cue: 16.",
        "administrationNote": null,
        "answer": "Remain silent / no 'go'",
        "id": "grade-5-inhibition-19",
        "grade": 5
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "Rule: respond to a shape's number of sides, but do not respond to circles. Cue: circle.",
        "administrationNote": null,
        "answer": "Do not respond",
        "id": "grade-5-inhibition-20",
        "grade": 5
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Tap once for a prime number, twice for a composite number. Cue: 1.",
        "administrationNote": null,
        "answer": "Do not tap; 1 is neither",
        "id": "grade-5-inhibition-21",
        "grade": 5
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Ignore any instruction preceded by 'Simon says'. The instruction is 'Simon says clap'. What do you do?",
        "administrationNote": null,
        "answer": "Do not clap",
        "id": "grade-5-inhibition-22",
        "grade": 5
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "Say the months in order, but stay silent on months beginning with J. Which months are skipped?",
        "administrationNote": null,
        "answer": "January, June, July",
        "id": "grade-5-inhibition-23",
        "grade": 5
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Respond only when a word has an even number of letters. Cue: focus.",
        "administrationNote": null,
        "answer": "Do not respond",
        "id": "grade-5-inhibition-24",
        "grade": 5
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: classify a number as prime/composite. Rule B: classify as even/odd. Under Rule B, classify 29.",
        "administrationNote": null,
        "answer": "odd",
        "id": "grade-5-flexibility-25",
        "grade": 5
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "A code shifts letters +2. Switch to −2. Decode FJ under the new rule.",
        "administrationNote": null,
        "answer": "DH",
        "id": "grade-5-flexibility-26",
        "grade": 5
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "Sort triangles by angle type. Switch to side type. A triangle with three equal sides belongs to which group?",
        "administrationNote": null,
        "answer": "equilateral",
        "id": "grade-5-flexibility-27",
        "grade": 5
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "Rule A: calculate perimeter of a square. Rule B: calculate area. For side length 5, give the Rule B answer.",
        "administrationNote": null,
        "answer": "25 square units",
        "id": "grade-5-flexibility-28",
        "grade": 5
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Classify each word by first letter. Switch to last letter. Where does 'river' go under the new rule?",
        "administrationNote": null,
        "answer": "R group",
        "id": "grade-5-flexibility-29",
        "grade": 5
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "Rule A: double a value then add 1. Rule B: halve an even value. Apply Rule B to 48.",
        "administrationNote": null,
        "answer": "24",
        "id": "grade-5-flexibility-30",
        "grade": 5
      }
    ]
  },
  "6": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "Complete the sequence: 1, 4, 10, 19, 31, __.",
        "administrationNote": null,
        "answer": "46",
        "id": "grade-6-reasoning-1",
        "grade": 6
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "A number is multiplied by 4 then reduced by 5. The result is 27. What was the number?",
        "administrationNote": null,
        "answer": "8",
        "id": "grade-6-reasoning-2",
        "grade": 6
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "Which does not fit: 8, 27, 64, 100, 125?",
        "administrationNote": null,
        "answer": "100",
        "id": "grade-6-reasoning-3",
        "grade": 6
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "A code reverses a word then shifts each letter forward one. What does CAT become?",
        "administrationNote": null,
        "answer": "UBD",
        "id": "grade-6-reasoning-4",
        "grade": 6
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "Find the next pair: AZ, BY, CX, DW, __.",
        "administrationNote": null,
        "answer": "EV",
        "id": "grade-6-reasoning-5",
        "grade": 6
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "The pattern uses 2 blue, 3 yellow, 4 blue, 5 yellow tiles. How many tiles are in the next blue group?",
        "administrationNote": null,
        "answer": "6",
        "id": "grade-6-reasoning-6",
        "grade": 6
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'The debate began after lunch, lasted 45 minutes, and was followed by a 15-minute break.' How long after lunch did the break end?",
        "administrationNote": "Read once; specify lunch end is the starting point.",
        "answer": "60 minutes",
        "id": "grade-6-memory-7",
        "grade": 6
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show 6 words: orbit, velvet, copper, meadow, prism, harbor. Say them backward.",
        "administrationNote": "Show/hide.",
        "answer": "harbor, prism, meadow, copper, velvet, orbit",
        "id": "grade-6-memory-8",
        "grade": 6
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Read: 9, 2, 7, 4, 1, 8. Repeat only the even numbers in order.",
        "administrationNote": "Read once.",
        "answer": "2, 4, 8",
        "id": "grade-6-memory-9",
        "grade": 6
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Show: 18, 25, 13, 31, 22. Hide it. What was the second-largest number?",
        "administrationNote": "Show/hide.",
        "answer": "25",
        "id": "grade-6-memory-10",
        "grade": 6
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Read: 'The blue folder was inside the drawer, beneath a map, beside a ruler.' What was beside the folder?",
        "administrationNote": "Read once.",
        "answer": "a ruler",
        "id": "grade-6-memory-11",
        "grade": 6
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Show for 12 seconds: 4, 7, 1, 9, 2. Hide it. Add the first two and last two digits.",
        "administrationNote": "Show/hide.",
        "answer": "22",
        "id": "grade-6-memory-12",
        "grade": 6
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "How many numbers are divisible by 5: 35, 42, 60, 71, 95, 103, 120?",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-6-attention-13",
        "grade": 6
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Which word has letters in alphabetical order: almost, planet, bring, water?",
        "administrationNote": null,
        "answer": "almost",
        "id": "grade-6-attention-14",
        "grade": 6
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Find the mismatch in pairs: 3:9, 4:16, 5:25, 6:30.",
        "administrationNote": null,
        "answer": "6:30",
        "id": "grade-6-attention-15",
        "grade": 6
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "Count the consonants in the word 'cognitive'.",
        "administrationNote": null,
        "answer": "5",
        "id": "grade-6-attention-16",
        "grade": 6
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Which line contains a repeated word: 'we learn daily'; 'read and think'; 'look look closely'; 'solve with care'?",
        "administrationNote": null,
        "answer": "look look closely",
        "id": "grade-6-attention-17",
        "grade": 6
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "How many distinct letters are in BALLOON?",
        "administrationNote": null,
        "answer": "5",
        "id": "grade-6-attention-18",
        "grade": 6
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Respond only to numbers that are multiples of 3 but not 2. Cue: 15.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-6-inhibition-19",
        "grade": 6
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "When a command is spoken in a whisper, follow it; when spoken normally, ignore it. Normal voice: 'raise your hand'.",
        "administrationNote": null,
        "answer": "Do not raise hand",
        "id": "grade-6-inhibition-20",
        "grade": 6
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Say the color of the ink, not the printed word. Word BLUE printed in red ink. What should you say?",
        "administrationNote": "Use colored cards.",
        "answer": "red",
        "id": "grade-6-inhibition-21",
        "grade": 6
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Read the sequence 1–10 aloud but suppress every number containing the digit 1. Which numbers are suppressed?",
        "administrationNote": null,
        "answer": "1 and 10",
        "id": "grade-6-inhibition-22",
        "grade": 6
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "Tap when a word is a verb, but inhibit tapping for nouns. Cue: 'carefully'.",
        "administrationNote": null,
        "answer": "Do not tap; adverb",
        "id": "grade-6-inhibition-23",
        "grade": 6
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Do the action only if the prior cue was a triangle. Prior cue: square; current cue: clap.",
        "administrationNote": null,
        "answer": "Do not clap",
        "id": "grade-6-inhibition-24",
        "grade": 6
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: translate a point (x,y) one unit right. Rule B: one unit down. Under Rule B, where does (3,4) go?",
        "administrationNote": null,
        "answer": "(3,3)",
        "id": "grade-6-flexibility-25",
        "grade": 6
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Classify expressions by number of terms. Switch to degree. What is the degree of 4x³+2x−7?",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-6-flexibility-26",
        "grade": 6
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "Rule A: round to nearest ten. Rule B: round to nearest hundred. Under Rule B, round 648.",
        "administrationNote": null,
        "answer": "600",
        "id": "grade-6-flexibility-27",
        "grade": 6
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "Sort angles as acute/right/obtuse. Switch to complementary/supplementary. Two angles are 35° and 55°; how are they related?",
        "administrationNote": null,
        "answer": "complementary",
        "id": "grade-6-flexibility-28",
        "grade": 6
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Encode numbers as Roman numerals. Switch to Arabic numerals. Convert XLIV under Rule B.",
        "administrationNote": null,
        "answer": "44",
        "id": "grade-6-flexibility-29",
        "grade": 6
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "Rule A: find factors of 18. Rule B: find multiples of 18. Give two positive multiples under Rule B.",
        "administrationNote": null,
        "answer": "18 and 36",
        "id": "grade-6-flexibility-30",
        "grade": 6
      }
    ]
  },
  "7": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "Find the next number: 5, 11, 19, 29, 41, __.",
        "administrationNote": null,
        "answer": "55",
        "id": "grade-7-reasoning-1",
        "grade": 7
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "A sequence follows n²−1 for n=1,2,3,... What is the 6th term?",
        "administrationNote": null,
        "answer": "35",
        "id": "grade-7-reasoning-2",
        "grade": 7
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "If 3 maps to 10, 5 maps to 16, and 8 maps to 25, what rule is used?",
        "administrationNote": null,
        "answer": "multiply by 3 and add 1",
        "id": "grade-7-reasoning-3",
        "grade": 7
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "Choose the pair with the same relationship: thermometer:temperature; compass:direction; telescope:distance?",
        "administrationNote": null,
        "answer": "compass:direction",
        "id": "grade-7-reasoning-4",
        "grade": 7
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "What is the next letter: Z, W, S, N, H, __?",
        "administrationNote": null,
        "answer": "A",
        "id": "grade-7-reasoning-5",
        "grade": 7
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "A pattern repeats 1 square, 2 circles, 3 triangles, then starts over. What is item 14?",
        "administrationNote": null,
        "answer": "circle",
        "id": "grade-7-reasoning-6",
        "grade": 7
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'The expedition moved east for two days, turned north on day three, and reached camp on day four.' In which direction did it turn?",
        "administrationNote": "Read once.",
        "answer": "north",
        "id": "grade-7-memory-7",
        "grade": 7
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show 8 digits: 4, 9, 1, 7, 3, 8, 2, 6. Repeat only the digits in positions 2, 4, 6, and 8.",
        "administrationNote": "Show/hide.",
        "answer": "9, 7, 8, 6",
        "id": "grade-7-memory-8",
        "grade": 7
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Show: granite, linen, cobalt, maple, quartz, amber. Which word was immediately after cobalt?",
        "administrationNote": "Show/hide.",
        "answer": "maple",
        "id": "grade-7-memory-9",
        "grade": 7
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Read: 'A student recorded 12, 15, 11, and 18 pages across four days.' What was the total number of pages?",
        "administrationNote": "Read once.",
        "answer": "56",
        "id": "grade-7-memory-10",
        "grade": 7
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Show: A, C, F, J, O. Hide it. Which letter was fourth?",
        "administrationNote": "Show/hide.",
        "answer": "J",
        "id": "grade-7-memory-11",
        "grade": 7
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Read: 'The lab sample was cooled, labeled, and stored in a dark cabinet.' What was done immediately before storage?",
        "administrationNote": "Read once.",
        "answer": "labeled",
        "id": "grade-7-memory-12",
        "grade": 7
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "Count the multiples of 4: 14, 16, 20, 22, 28, 30, 36.",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-7-attention-13",
        "grade": 7
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Find the outlier in the sequence of months: April, June, September, Tuesday, November.",
        "administrationNote": null,
        "answer": "Tuesday",
        "id": "grade-7-attention-14",
        "grade": 7
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Which code is different: 7Q2M, 7Q2M, 7O2M, 7Q2M?",
        "administrationNote": null,
        "answer": "7O2M",
        "id": "grade-7-attention-15",
        "grade": 7
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "How many words contain a silent letter: knee, table, write, apple, lamb?",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-7-attention-16",
        "grade": 7
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Find the false statement: 13 is prime; 21 is composite; 29 is prime; 39 is prime.",
        "administrationNote": null,
        "answer": "39 is prime",
        "id": "grade-7-attention-17",
        "grade": 7
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Count the letter pairs that are adjacent in the alphabet: AB, DF, MN, RT, XY.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-7-attention-18",
        "grade": 7
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Rule: respond to primes, except prime numbers greater than 10. Cue: 13.",
        "administrationNote": null,
        "answer": "Do not respond",
        "id": "grade-7-inhibition-19",
        "grade": 7
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "For each word, tap if it has exactly two syllables, but inhibit taps for words ending in -ing. Cue: running.",
        "administrationNote": null,
        "answer": "Do not tap",
        "id": "grade-7-inhibition-20",
        "grade": 7
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Alternate between responding and withholding: respond to the first tone, withhold the second, repeat. Tone number 5?",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-7-inhibition-21",
        "grade": 7
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Say the letter's alphabet position unless the letter is a vowel. Cue: E.",
        "administrationNote": null,
        "answer": "Do not give a number",
        "id": "grade-7-inhibition-22",
        "grade": 7
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "Only press if the equation is true and the result is odd: 3×5=15.",
        "administrationNote": null,
        "answer": "Press",
        "id": "grade-7-inhibition-23",
        "grade": 7
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "In a go/no-go sequence, respond to every shape except a red triangle. Cue: red triangle.",
        "administrationNote": null,
        "answer": "Withhold response",
        "id": "grade-7-inhibition-24",
        "grade": 7
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: multiply by 2 then add 1. Rule B: square then subtract 1. Apply Rule B to 5.",
        "administrationNote": null,
        "answer": "24",
        "id": "grade-7-flexibility-25",
        "grade": 7
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Classify statements by fact/opinion. Switch to claim/evidence. 'The survey included 200 students' is which?",
        "administrationNote": null,
        "answer": "evidence",
        "id": "grade-7-flexibility-26",
        "grade": 7
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "Rule A: map letters to alphabet positions. Rule B: map positions to letters. Under Rule B, decode 20-5-1.",
        "administrationNote": null,
        "answer": "TEA",
        "id": "grade-7-flexibility-27",
        "grade": 7
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "Sort quadrilaterals by parallel sides. Switch to diagonals. What property do diagonals of a rectangle have?",
        "administrationNote": null,
        "answer": "equal length and bisect each other",
        "id": "grade-7-flexibility-28",
        "grade": 7
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Rule A: find mean. Rule B: find median. For 2, 5, 8, 11, 14, give Rule B result.",
        "administrationNote": null,
        "answer": "8",
        "id": "grade-7-flexibility-29",
        "grade": 7
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "A diagram rule first reflects across the x-axis, then switches to reflection across the y-axis. Under the new rule, where does (−2,3) go?",
        "administrationNote": null,
        "answer": "(2,3)",
        "id": "grade-7-flexibility-30",
        "grade": 7
      }
    ]
  },
  "8": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "Complete: 2, 3, 5, 8, 12, 17, __.",
        "administrationNote": null,
        "answer": "23",
        "id": "grade-8-reasoning-1",
        "grade": 8
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "A sequence multiplies by 2 and subtracts 1 each time: 3, 5, 9, 17, __.",
        "administrationNote": null,
        "answer": "33",
        "id": "grade-8-reasoning-2",
        "grade": 8
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "If f(x)=x²−2, what is f(5)?",
        "administrationNote": null,
        "answer": "23",
        "id": "grade-8-reasoning-3",
        "grade": 8
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "Which number is inconsistent with the others: 121, 144, 169, 196, 225, 250?",
        "administrationNote": null,
        "answer": "250",
        "id": "grade-8-reasoning-4",
        "grade": 8
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "A code shifts letters backward by two. What does MATH become?",
        "administrationNote": null,
        "answer": "KYRF",
        "id": "grade-8-reasoning-5",
        "grade": 8
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "In a sequence, each term is the sum of the previous two: 2, 7, 9, 16, 25, __.",
        "administrationNote": null,
        "answer": "41",
        "id": "grade-8-reasoning-6",
        "grade": 8
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'The team scored 14 points in round one, 9 in round two, lost 3 points to a penalty, then scored 11.' What was the final total?",
        "administrationNote": "Read once.",
        "answer": "31",
        "id": "grade-8-memory-7",
        "grade": 8
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show 7 words: canyon, silk, magnet, orchard, bronze, lantern, tide. Recall words in alphabetical order.",
        "administrationNote": "Show/hide.",
        "answer": "bronze, canyon, lantern, magnet, orchard, silk, tide",
        "id": "grade-8-memory-8",
        "grade": 8
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Show 6 digits: 2, 5, 8, 1, 4, 7. Repeat the first three in reverse, then the last three in reverse.",
        "administrationNote": "Show/hide.",
        "answer": "8, 5, 2, 7, 4, 1",
        "id": "grade-8-memory-9",
        "grade": 8
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Read: 'The report was drafted Monday, edited Tuesday, checked Wednesday, and submitted Thursday.' What happened on Wednesday?",
        "administrationNote": "Read once.",
        "answer": "checked",
        "id": "grade-8-memory-10",
        "grade": 8
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Show: 16, 4, 22, 9, 13, 6. Hide it. Name the two numbers closest to 10.",
        "administrationNote": "Show/hide.",
        "answer": "9 and 13",
        "id": "grade-8-memory-11",
        "grade": 8
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Read: 'A code uses the sequence north, east, east, south, west.' How many east instructions were given?",
        "administrationNote": "Read once.",
        "answer": "2",
        "id": "grade-8-memory-12",
        "grade": 8
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "Count the integers whose squares are below 40: 2, 5, 6, 7, 8.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-8-attention-13",
        "grade": 8
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Which item is not a unit of energy: joule, calorie, watt-hour, pascal?",
        "administrationNote": null,
        "answer": "pascal",
        "id": "grade-8-attention-14",
        "grade": 8
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Identify the exact duplicate code: XZ-418, XZ-481, XZ-418, X2-418.",
        "administrationNote": null,
        "answer": "1st and 3rd",
        "id": "grade-8-attention-15",
        "grade": 8
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "How many words in 'careful observation prevents avoidable errors' end in -able?",
        "administrationNote": null,
        "answer": "1",
        "id": "grade-8-attention-16",
        "grade": 8
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Which equality is incorrect: 15% of 200=30; 20% of 90=18; 12% of 50=8.",
        "administrationNote": null,
        "answer": "12% of 50=8",
        "id": "grade-8-attention-17",
        "grade": 8
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Count the numbers with exactly two factors: 2, 9, 11, 15, 17, 21.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-8-attention-18",
        "grade": 8
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Respond to a number if it is divisible by 5 but not 10. Cue: 35.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-8-inhibition-19",
        "grade": 8
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "Follow the instruction only if it contains exactly four words: 'Please close the door now.'",
        "administrationNote": null,
        "answer": "Do not follow it",
        "id": "grade-8-inhibition-20",
        "grade": 8
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Tap for a correct statement, inhibit for an incorrect one: 'Every square is a rectangle.'",
        "administrationNote": null,
        "answer": "Tap",
        "id": "grade-8-inhibition-21",
        "grade": 8
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Say the previous number in the sequence, but do not answer when the cue is zero. Cue: 0.",
        "administrationNote": null,
        "answer": "Do not answer",
        "id": "grade-8-inhibition-22",
        "grade": 8
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "Respond only when a word has a silent letter. Cue: honest.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-8-inhibition-23",
        "grade": 8
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Rule: react to an arrow pointing up, but withhold if it is blue. Cue: blue upward arrow.",
        "administrationNote": null,
        "answer": "Withhold response",
        "id": "grade-8-inhibition-24",
        "grade": 8
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: solve 2x+3=11. Rule B: solve 3x−2=13. Give x under Rule B.",
        "administrationNote": null,
        "answer": "5",
        "id": "grade-8-flexibility-25",
        "grade": 8
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Sort words by prefix. Switch to suffix. In 'careless', which suffix determines the group?",
        "administrationNote": null,
        "answer": "-less",
        "id": "grade-8-flexibility-26",
        "grade": 8
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "Rule A: convert Celsius to Fahrenheit. Rule B: Fahrenheit to Celsius. Convert 68°F under Rule B.",
        "administrationNote": null,
        "answer": "20°C",
        "id": "grade-8-flexibility-27",
        "grade": 8
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "Classify a triangle by sides. Switch to angle classification. A triangle with angles 90°, 35°, 55° is what type?",
        "administrationNote": null,
        "answer": "right triangle",
        "id": "grade-8-flexibility-28",
        "grade": 8
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Rule A: find the greatest common factor. Rule B: find the least common multiple. For 6 and 8, give Rule B result.",
        "administrationNote": null,
        "answer": "24",
        "id": "grade-8-flexibility-29",
        "grade": 8
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "A code first reverses a string, then switches to keeping original order. Under the new rule, transform ABCD.",
        "administrationNote": null,
        "answer": "ABCD",
        "id": "grade-8-flexibility-30",
        "grade": 8
      }
    ]
  },
  "9": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "Find the next term: 4, 9, 19, 39, 79, __.",
        "administrationNote": null,
        "answer": "159",
        "id": "grade-9-reasoning-1",
        "grade": 9
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "A pattern follows a(n)=3n²−2. What is a(5)?",
        "administrationNote": null,
        "answer": "73",
        "id": "grade-9-reasoning-2",
        "grade": 9
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "If the first difference sequence is 3, 5, 7, 9, what is the next difference?",
        "administrationNote": null,
        "answer": "11",
        "id": "grade-9-reasoning-3",
        "grade": 9
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "Which relation matches author:novel? composer:symphony, actor:stage, chef:restaurant?",
        "administrationNote": null,
        "answer": "composer:symphony",
        "id": "grade-9-reasoning-4",
        "grade": 9
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "A binary pattern reads 1, 10, 11, 100, 101, __ (base two).",
        "administrationNote": null,
        "answer": "110",
        "id": "grade-9-reasoning-5",
        "grade": 9
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "A transformation maps (x,y) to (y,−x). Where does (3,−2) map?",
        "administrationNote": null,
        "answer": "(−2, −3)",
        "id": "grade-9-reasoning-6",
        "grade": 9
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'A cyclist rode 18 km before noon and 23 km after noon, then returned 7 km by bus.' How many kilometers were cycled?",
        "administrationNote": "Read once.",
        "answer": "41 km",
        "id": "grade-9-memory-7",
        "grade": 9
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show for 12 seconds: 3, 1, 4, 1, 5, 9, 2. Recall the digits at prime-numbered positions.",
        "administrationNote": null,
        "answer": "1, 4, 5, 2",
        "id": "grade-9-memory-8",
        "grade": 9
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Show: basalt, jade, spruce, ivory, onyx, birch. Which words were the first and fifth?",
        "administrationNote": "Show/hide.",
        "answer": "basalt and onyx",
        "id": "grade-9-memory-9",
        "grade": 9
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Read: 'A code key says A=1, B=2, C=3, D=4. The message is 2-1-4-3.' What word does it spell?",
        "administrationNote": "Read once; code is intentionally a recall-plus-decoding task.",
        "answer": "BADC",
        "id": "grade-9-memory-10",
        "grade": 9
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Read: 'The experiment had a control group of 20 and two treatment groups of 18 and 17.' How many participants were there?",
        "administrationNote": "Read once.",
        "answer": "55",
        "id": "grade-9-memory-11",
        "grade": 9
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Show: 11, 5, 19, 8, 14, 2. Hide it. Recall the sequence from largest to smallest.",
        "administrationNote": "Show/hide.",
        "answer": "19, 14, 11, 8, 5, 2",
        "id": "grade-9-memory-12",
        "grade": 9
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "How many of these are perfect squares: 36, 45, 64, 81, 90, 100?",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-9-attention-13",
        "grade": 9
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Which term is a physics quantity rather than a chemical element: neon, force, iron, helium?",
        "administrationNote": null,
        "answer": "force",
        "id": "grade-9-attention-14",
        "grade": 9
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Find the exact matching string: N7P4Q9 / N7P4O9 / N7P4Q9 / N7P4Q8.",
        "administrationNote": null,
        "answer": "1st and 3rd",
        "id": "grade-9-attention-15",
        "grade": 9
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "Count the words with a prefix in 'rewrite, preview, careful, dislike, unhappy'.",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-9-attention-16",
        "grade": 9
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Which claim is numerically wrong: 0.4=40%; 3/5=60%; 0.08=8%; 1/4=20%?",
        "administrationNote": null,
        "answer": "1/4=20%",
        "id": "grade-9-attention-17",
        "grade": 9
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Count the integers from 10 to 30 inclusive divisible by both 2 and 3.",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-9-attention-18",
        "grade": 9
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Respond to composite numbers below 20, but withhold for even numbers. Cue: 15.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-9-inhibition-19",
        "grade": 9
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "For a word-color task, say the ink color, but withhold if the word and ink color match. GREEN printed in green.",
        "administrationNote": null,
        "answer": "Withhold response",
        "id": "grade-9-inhibition-20",
        "grade": 9
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Respond only if a fraction is greater than 1. Cue: 7/5.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-9-inhibition-21",
        "grade": 9
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Follow a command only when it is the second command in a pair. Pair: 'touch nose', 'raise hand'. What do you do?",
        "administrationNote": null,
        "answer": "Raise hand",
        "id": "grade-9-inhibition-22",
        "grade": 9
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "Tap for valid chemical symbols, withhold for invalid ones. Cue: Na.",
        "administrationNote": null,
        "answer": "Tap",
        "id": "grade-9-inhibition-23",
        "grade": 9
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Suppress any response to numbers in the Fibonacci sequence. Cue: 13.",
        "administrationNote": null,
        "answer": "Withhold response",
        "id": "grade-9-inhibition-24",
        "grade": 9
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: differentiate x³. Switch to integrate x². Give the indefinite integral under Rule B.",
        "administrationNote": null,
        "answer": "x³/3 + C",
        "id": "grade-9-flexibility-25",
        "grade": 9
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Sort data by correlation direction. Switch to correlation strength. A coefficient of −0.92 indicates what?",
        "administrationNote": null,
        "answer": "strong negative correlation",
        "id": "grade-9-flexibility-26",
        "grade": 9
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "Rule A: use the quadratic formula. Rule B: factor the expression. Factor x²−9 under Rule B.",
        "administrationNote": null,
        "answer": "(x−3)(x+3)",
        "id": "grade-9-flexibility-27",
        "grade": 9
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "Classify a statement as inductive or deductive. Switch to valid/invalid argument. If all mammals breathe and whales are mammals, what follows?",
        "administrationNote": null,
        "answer": "whales breathe; valid deduction",
        "id": "grade-9-flexibility-28",
        "grade": 9
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Rule A: express 0.375 as a fraction. Rule B: express 3/8 as a decimal. Give Rule B result.",
        "administrationNote": null,
        "answer": "0.375",
        "id": "grade-9-flexibility-29",
        "grade": 9
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "A transformation rotates a point 90° clockwise. Switch to 180° rotation. Where does (4,−1) go under the new rule?",
        "administrationNote": null,
        "answer": "(−4,1)",
        "id": "grade-9-flexibility-30",
        "grade": 9
      }
    ]
  },
  "10": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "Complete: 1, 2, 6, 24, 120, __.",
        "administrationNote": null,
        "answer": "720",
        "id": "grade-10-reasoning-1",
        "grade": 10
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "If a sequence follows a(n)=2a(n−1)+3 and a(1)=1, find a(4).",
        "administrationNote": null,
        "answer": "29",
        "id": "grade-10-reasoning-2",
        "grade": 10
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "A function maps x to (x−1)/(x+1). What is the output for x=3?",
        "administrationNote": null,
        "answer": "1/2",
        "id": "grade-10-reasoning-3",
        "grade": 10
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "Which term breaks the pattern of consecutive prime numbers: 11, 13, 17, 19, 23, 27, 31?",
        "administrationNote": null,
        "answer": "27",
        "id": "grade-10-reasoning-4",
        "grade": 10
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "A code maps each letter to its alphabet position and adds the positions. What is the score for BAD?",
        "administrationNote": null,
        "answer": "7",
        "id": "grade-10-reasoning-5",
        "grade": 10
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "Find the next ordered pair if each step adds (−2, 3): (5,1), (3,4), (1,7), __.",
        "administrationNote": null,
        "answer": "(−1, 10)",
        "id": "grade-10-reasoning-6",
        "grade": 10
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'A train left at 13:25 and arrived at 15:05 after a 10-minute stop.' How long was it moving?",
        "administrationNote": "Read once.",
        "answer": "1 hour 30 minutes",
        "id": "grade-10-memory-7",
        "grade": 10
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show 8 symbols: ○, △, □, ☆, △, ○, ☆, □. Which symbols appeared twice?",
        "administrationNote": "Show/hide.",
        "answer": "all four symbols",
        "id": "grade-10-memory-8",
        "grade": 10
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Read: 'The article cites a survey from 2022, a census from 2020, and a forecast for 2028.' Which source is oldest?",
        "administrationNote": "Read once.",
        "answer": "the 2020 census",
        "id": "grade-10-memory-9",
        "grade": 10
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Show 7 numbers: 21, 13, 34, 8, 5, 55, 3. Recall the numbers that are Fibonacci numbers.",
        "administrationNote": "Show/hide; all listed values are Fibonacci numbers.",
        "answer": "21, 13, 34, 8, 5, 55, 3",
        "id": "grade-10-memory-10",
        "grade": 10
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Read: 'A box contains 4 black, 6 white, and 3 gray cards.' How many cards are not white?",
        "administrationNote": "Read once.",
        "answer": "7",
        "id": "grade-10-memory-11",
        "grade": 10
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Show: L, Q, B, T, M, A. Hide it. State the letters in reverse alphabetical order.",
        "administrationNote": "Show/hide.",
        "answer": "T, Q, M, L, B, A",
        "id": "grade-10-memory-12",
        "grade": 10
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "How many values are negative: −4, 0, 2, −1, −7, 5, 0?",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-10-attention-13",
        "grade": 10
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Which is not a trigonometric function: sine, cosine, tangent, median?",
        "administrationNote": null,
        "answer": "median",
        "id": "grade-10-attention-14",
        "grade": 10
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Find the exact duplicate: 4F-29A, 4F-29B, 4F-29A, 4E-29A.",
        "administrationNote": null,
        "answer": "1st and 3rd",
        "id": "grade-10-attention-15",
        "grade": 10
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "Count the words with a Greek-derived science prefix: microscope, biology, telephone, notebook.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-10-attention-16",
        "grade": 10
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Which statement is false: 2³=8; √81=9; 5!=120; 3⁴=64?",
        "administrationNote": null,
        "answer": "3⁴=64",
        "id": "grade-10-attention-17",
        "grade": 10
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Count the primes between 20 and 40 inclusive.",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-10-attention-18",
        "grade": 10
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Respond to a number if it is prime or divisible by 4, but not both. Cue: 16.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-10-inhibition-19",
        "grade": 10
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "In a conflict task, say the font color and ignore the written color word: RED printed in blue. What do you say?",
        "administrationNote": "Use colored cards.",
        "answer": "blue",
        "id": "grade-10-inhibition-20",
        "grade": 10
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Do not respond to any instruction that follows a false statement. Statement: '2+2=5.' Instruction: 'clap'.",
        "administrationNote": null,
        "answer": "Do not clap",
        "id": "grade-10-inhibition-21",
        "grade": 10
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Respond only to angles greater than 90° and less than 180°. Cue: 135°.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-10-inhibition-22",
        "grade": 10
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "In a 1-back task, press if the current digit matches the previous digit: 4, 7, 7. What happens on the third digit?",
        "administrationNote": null,
        "answer": "Press",
        "id": "grade-10-inhibition-23",
        "grade": 10
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Say 'valid' for a correctly balanced pair of brackets, otherwise remain silent: (a+b).",
        "administrationNote": null,
        "answer": "Say valid",
        "id": "grade-10-inhibition-24",
        "grade": 10
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: calculate log base 10 of 1000. Switch to log base 2 of 32. Give the new answer.",
        "administrationNote": null,
        "answer": "5",
        "id": "grade-10-flexibility-25",
        "grade": 10
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Classify a matrix by dimensions. Switch to determinant for a 2×2 matrix [[2,1],[5,3]]. Give the new result.",
        "administrationNote": null,
        "answer": "1",
        "id": "grade-10-flexibility-26",
        "grade": 10
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "Rule A: solve a linear equation. Rule B: solve a quadratic equation x²−5x+6=0. Give the Rule B solutions.",
        "administrationNote": null,
        "answer": "2 and 3",
        "id": "grade-10-flexibility-27",
        "grade": 10
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "A data rule first finds range. Switch to interquartile range for data 1, 2, 3, 4, 5, 6, 7, 8. Give the result using median-of-halves.",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-10-flexibility-28",
        "grade": 10
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Rule A: calculate simple interest on $100 at 5% for 2 years. Switch to compound annually. What is the final balance under Rule B?",
        "administrationNote": null,
        "answer": "$110.25",
        "id": "grade-10-flexibility-29",
        "grade": 10
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "A code maps a letter to its alphabet index. Switch to index modulo 5, with A=1. What remainder does letter H (8) produce?",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-10-flexibility-30",
        "grade": 10
      }
    ]
  },
  "11": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "Find the next term: 2, 5, 10, 17, 26, __.",
        "administrationNote": null,
        "answer": "37",
        "id": "grade-11-reasoning-1",
        "grade": 11
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "A sequence is defined by a(n)=a(n−1)+2n, with a(1)=1. Find a(4).",
        "administrationNote": null,
        "answer": "19",
        "id": "grade-11-reasoning-2",
        "grade": 11
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "If g(x)=2x²−3x, calculate g(−2).",
        "administrationNote": null,
        "answer": "14",
        "id": "grade-11-reasoning-3",
        "grade": 11
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "Which statement is the logical negation of 'All triangles have three sides'?",
        "administrationNote": null,
        "answer": "At least one triangle does not have three sides",
        "id": "grade-11-reasoning-4",
        "grade": 11
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "A pattern alternates a 90° clockwise rotation and a reflection across the y-axis. What must be tracked to predict the next image?",
        "administrationNote": null,
        "answer": "Both the operation order and the current orientation",
        "id": "grade-11-reasoning-5",
        "grade": 11
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "Find the missing value: (2, 5), (3, 10), (4, 17), (5, __), where y=x²+1.",
        "administrationNote": null,
        "answer": "26",
        "id": "grade-11-reasoning-6",
        "grade": 11
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'The researcher sampled 24 plants, excluded 3 damaged ones, and divided the rest equally among 3 trays.' How many plants per tray?",
        "administrationNote": "Read once.",
        "answer": "7",
        "id": "grade-11-memory-7",
        "grade": 11
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show 8 digits: 9, 2, 6, 1, 7, 4, 3, 8. Recall digits in positions 1, 3, 5, and 7, in reverse order.",
        "administrationNote": "Show/hide.",
        "answer": "3, 7, 6, 9",
        "id": "grade-11-memory-8",
        "grade": 11
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Read: 'The meeting was moved from Tuesday to Friday, but the deadline stayed two days after the meeting.' What day is the deadline?",
        "administrationNote": "Read once.",
        "answer": "Sunday",
        "id": "grade-11-memory-9",
        "grade": 11
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Show 6 terms: delta, vector, scalar, matrix, tensor, angle. Recall them in reverse order.",
        "administrationNote": "Show/hide.",
        "answer": "angle, tensor, matrix, scalar, vector, delta",
        "id": "grade-11-memory-10",
        "grade": 11
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Read: 'A portfolio rose 8%, fell 3%, then rose 2%.' What was the simple net percentage change, ignoring compounding?",
        "administrationNote": "Read once.",
        "answer": "7%",
        "id": "grade-11-memory-11",
        "grade": 11
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Show: 2, 6, 12, 20, 30, 42. Hide it. Recall the fourth and sixth terms and add them.",
        "administrationNote": "Show/hide.",
        "answer": "62",
        "id": "grade-11-memory-12",
        "grade": 11
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "How many entries have units of power: joule, watt, kilowatt, newton, megawatt?",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-11-attention-13",
        "grade": 11
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Which formula has a mismatched unit: speed=distance/time; density=mass/volume; force=mass×acceleration; energy=mass×velocity?",
        "administrationNote": null,
        "answer": "energy=mass×velocity",
        "id": "grade-11-attention-14",
        "grade": 11
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Find the exact duplicate: AB-73-KL, AB-37-KL, AB-73-KL, A8-73-KL.",
        "administrationNote": null,
        "answer": "1st and 3rd",
        "id": "grade-11-attention-15",
        "grade": 11
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "Count the distinct prime factors of 60.",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-11-attention-16",
        "grade": 11
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Which line has a punctuation error: 'Wait, please.'; 'What time is it?'; 'Its raining.'; 'Wonderful!'",
        "administrationNote": null,
        "answer": "Its raining.",
        "id": "grade-11-attention-17",
        "grade": 11
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "How many solutions satisfy x²=16 over the real numbers?",
        "administrationNote": null,
        "answer": "2",
        "id": "grade-11-attention-18",
        "grade": 11
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Respond only to odd composite integers between 10 and 30. Cue: 21.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-11-inhibition-19",
        "grade": 11
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "For each equation, respond if the result is negative. Cue: 4−9.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-11-inhibition-20",
        "grade": 11
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "Ignore a command if it contradicts the first rule: first rule says stay seated; command says stand up.",
        "administrationNote": null,
        "answer": "Stay seated",
        "id": "grade-11-inhibition-21",
        "grade": 11
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Respond to a word if its letters are in alphabetical order, but withhold for words with repeated letters. Cue: almost.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-11-inhibition-22",
        "grade": 11
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "In a 2-back task, press if the current symbol matches the one two positions earlier: A, B, A. What happens on the third symbol?",
        "administrationNote": null,
        "answer": "Press",
        "id": "grade-11-inhibition-23",
        "grade": 11
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Tap only if a statement is both grammatically correct and factually true: 'Water freezes at 0°C under standard pressure.'",
        "administrationNote": null,
        "answer": "Tap",
        "id": "grade-11-inhibition-24",
        "grade": 11
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: differentiate sin x. Switch to differentiate cos x. Give the new derivative.",
        "administrationNote": null,
        "answer": "−sin x",
        "id": "grade-11-flexibility-25",
        "grade": 11
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Classify a sequence as arithmetic/geometric. Switch to find its common ratio. For 3, 6, 12, 24, give the ratio.",
        "administrationNote": null,
        "answer": "2",
        "id": "grade-11-flexibility-26",
        "grade": 11
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "Rule A: use a permutation. Switch to a combination: choose 2 people from 5. How many ways?",
        "administrationNote": null,
        "answer": "10",
        "id": "grade-11-flexibility-27",
        "grade": 11
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "A physics problem first uses v=u+at. Switch to s=ut+½at². For u=0, a=2, t=3, find s.",
        "administrationNote": null,
        "answer": "9 m",
        "id": "grade-11-flexibility-28",
        "grade": 11
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Classify a hypothesis test result by p-value. Switch to compare with α=0.05. If p=0.03, what is the decision?",
        "administrationNote": null,
        "answer": "Reject the null hypothesis",
        "id": "grade-11-flexibility-29",
        "grade": 11
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "Rule A: write a complex number in a+bi form. Switch to find its modulus. For 3+4i, give the new result.",
        "administrationNote": null,
        "answer": "5",
        "id": "grade-11-flexibility-30",
        "grade": 11
      }
    ]
  },
  "12": {
    "reasoning": [
      {
        "number": 1,
        "domain": "reasoning",
        "question": "A sequence has nth term n³−n. Find the 5th term.",
        "administrationNote": null,
        "answer": "120",
        "id": "grade-12-reasoning-1",
        "grade": 12
      },
      {
        "number": 2,
        "domain": "reasoning",
        "question": "For a geometric sequence with first term 3 and ratio 2, find the 7th term.",
        "administrationNote": null,
        "answer": "192",
        "id": "grade-12-reasoning-2",
        "grade": 12
      },
      {
        "number": 3,
        "domain": "reasoning",
        "question": "If a(n)=a(n−1)+a(n−2), with a(1)=2 and a(2)=3, find a(6).",
        "administrationNote": null,
        "answer": "21",
        "id": "grade-12-reasoning-3",
        "grade": 12
      },
      {
        "number": 4,
        "domain": "reasoning",
        "question": "A mapping sends (x,y) to (−y,x). What transformation is this about the origin?",
        "administrationNote": null,
        "answer": "90° counterclockwise rotation",
        "id": "grade-12-reasoning-4",
        "grade": 12
      },
      {
        "number": 5,
        "domain": "reasoning",
        "question": "Find the next term: 1, 4, 10, 20, 35, __.",
        "administrationNote": null,
        "answer": "56",
        "id": "grade-12-reasoning-5",
        "grade": 12
      },
      {
        "number": 6,
        "domain": "reasoning",
        "question": "A sequence has constant second differences and begins 2, 7, 16, 29, 46. Find the next term.",
        "administrationNote": null,
        "answer": "67",
        "id": "grade-12-reasoning-6",
        "grade": 12
      }
    ],
    "memory": [
      {
        "number": 7,
        "domain": "memory",
        "question": "Read: 'A project began on 4 March and lasted 19 days, counting the start date as day one.' What was the final date?",
        "administrationNote": "Read once.",
        "answer": "22 March",
        "id": "grade-12-memory-7",
        "grade": 12
      },
      {
        "number": 8,
        "domain": "memory",
        "question": "Show 9 digits: 8, 3, 1, 9, 4, 7, 2, 6, 5. Recall the digits in odd positions, in reverse order.",
        "administrationNote": "Show/hide.",
        "answer": "5, 2, 4, 1, 8",
        "id": "grade-12-memory-8",
        "grade": 12
      },
      {
        "number": 9,
        "domain": "memory",
        "question": "Read: 'A sample has 40 observations; 25 are in category A, 9 in B, and the remainder in C.' How many are in C?",
        "administrationNote": "Read once.",
        "answer": "6",
        "id": "grade-12-memory-9",
        "grade": 12
      },
      {
        "number": 10,
        "domain": "memory",
        "question": "Show: theorem, premise, inference, evidence, conclusion, counterexample. Recall the words in the order they appeared, skipping every second word.",
        "administrationNote": "Show/hide.",
        "answer": "theorem, inference, conclusion",
        "id": "grade-12-memory-10",
        "grade": 12
      },
      {
        "number": 11,
        "domain": "memory",
        "question": "Read: 'A lab temperature fell 4°C, rose 9°C, then fell 2°C from an initial 18°C.' What was the final temperature?",
        "administrationNote": "Read once.",
        "answer": "21°C",
        "id": "grade-12-memory-11",
        "grade": 12
      },
      {
        "number": 12,
        "domain": "memory",
        "question": "Show for 15 seconds: 17, 23, 11, 29, 14, 31, 19. Recall the values from smallest to largest.",
        "administrationNote": "Show/hide.",
        "answer": "11, 14, 17, 19, 23, 29, 31",
        "id": "grade-12-memory-12",
        "grade": 12
      }
    ],
    "attention": [
      {
        "number": 13,
        "domain": "attention",
        "question": "How many numbers in {−3, −1, 0, 2, 4, 9} are nonnegative and even?",
        "administrationNote": null,
        "answer": "3",
        "id": "grade-12-attention-13",
        "grade": 12
      },
      {
        "number": 14,
        "domain": "attention",
        "question": "Which is not a probability value: 0, 0.35, 1, 1.2?",
        "administrationNote": null,
        "answer": "1.2",
        "id": "grade-12-attention-14",
        "grade": 12
      },
      {
        "number": 15,
        "domain": "attention",
        "question": "Find the exact duplicate: 91C7-AB, 91C7-BA, 91C7-AB, 9IC7-AB.",
        "administrationNote": null,
        "answer": "1st and 3rd",
        "id": "grade-12-attention-15",
        "grade": 12
      },
      {
        "number": 16,
        "domain": "attention",
        "question": "How many distinct prime factors does 210 have?",
        "administrationNote": null,
        "answer": "4",
        "id": "grade-12-attention-16",
        "grade": 12
      },
      {
        "number": 17,
        "domain": "attention",
        "question": "Which derivative is incorrect: d(x²)/dx=2x; d(3x)/dx=3; d(5)/dx=0; d(x³)/dx=2x²?",
        "administrationNote": null,
        "answer": "d(x³)/dx=2x²",
        "id": "grade-12-attention-17",
        "grade": 12
      },
      {
        "number": 18,
        "domain": "attention",
        "question": "Count the integers in [−5, 5] whose absolute value is 3.",
        "administrationNote": null,
        "answer": "2",
        "id": "grade-12-attention-18",
        "grade": 12
      }
    ],
    "inhibition": [
      {
        "number": 19,
        "domain": "inhibition",
        "question": "Respond to integers whose absolute value is prime, except if the integer is negative. Cue: 17.",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-12-inhibition-19",
        "grade": 12
      },
      {
        "number": 20,
        "domain": "inhibition",
        "question": "A rule says answer 'true' only if a statement is true and its preceding statement was false. Previous statement true; current statement true. Respond?",
        "administrationNote": null,
        "answer": "Do not answer 'true'",
        "id": "grade-12-inhibition-20",
        "grade": 12
      },
      {
        "number": 21,
        "domain": "inhibition",
        "question": "In a color-word interference task, name ink color and withhold if the word is a color matching the ink. BLUE printed in yellow.",
        "administrationNote": null,
        "answer": "Say yellow",
        "id": "grade-12-inhibition-21",
        "grade": 12
      },
      {
        "number": 22,
        "domain": "inhibition",
        "question": "Respond to a number if it is divisible by exactly two distinct primes. Cue: 30.",
        "administrationNote": null,
        "answer": "Do not respond",
        "id": "grade-12-inhibition-22",
        "grade": 12
      },
      {
        "number": 23,
        "domain": "inhibition",
        "question": "Use a 2-back rule: respond if current letter matches the letter two positions earlier. A, C, B, A. What happens at the fourth letter?",
        "administrationNote": null,
        "answer": "Do not respond",
        "id": "grade-12-inhibition-23",
        "grade": 12
      },
      {
        "number": 24,
        "domain": "inhibition",
        "question": "Respond only if the statement is logically valid: 'If P implies Q, and P is true, then Q is true.'",
        "administrationNote": null,
        "answer": "Respond",
        "id": "grade-12-inhibition-24",
        "grade": 12
      }
    ],
    "flexibility": [
      {
        "number": 25,
        "domain": "flexibility",
        "question": "Rule A: find the derivative of eˣ. Switch to integrate eˣ. Give the indefinite integral.",
        "administrationNote": null,
        "answer": "eˣ + C",
        "id": "grade-12-flexibility-25",
        "grade": 12
      },
      {
        "number": 26,
        "domain": "flexibility",
        "question": "Classify a series as convergent/divergent. Switch to find the sum of 1+1/2+1/4+... to infinity.",
        "administrationNote": null,
        "answer": "2",
        "id": "grade-12-flexibility-26",
        "grade": 12
      },
      {
        "number": 27,
        "domain": "flexibility",
        "question": "Rule A: compute a dot product. Switch to cross product. For i × j, give the result.",
        "administrationNote": null,
        "answer": "k",
        "id": "grade-12-flexibility-27",
        "grade": 12
      },
      {
        "number": 28,
        "domain": "flexibility",
        "question": "A probability task first finds P(A). Switch to conditional probability. If P(A∩B)=0.2 and P(B)=0.5, find P(A|B).",
        "administrationNote": null,
        "answer": "0.4",
        "id": "grade-12-flexibility-28",
        "grade": 12
      },
      {
        "number": 29,
        "domain": "flexibility",
        "question": "Rule A: solve a 2×2 linear system. Switch to find the determinant of [[3,2],[4,5]].",
        "administrationNote": null,
        "answer": "7",
        "id": "grade-12-flexibility-29",
        "grade": 12
      },
      {
        "number": 30,
        "domain": "flexibility",
        "question": "Classify a differential equation by order. Switch to solve dy/dx=3x² with y(0)=2. Give y(x).",
        "administrationNote": null,
        "answer": "y=x³+2",
        "id": "grade-12-flexibility-30",
        "grade": 12
      }
    ]
  }
};

/* ------------------------------------------------------------------------- *
 *  Helpers used by getQuestionsForGrade()
 * ------------------------------------------------------------------------- */

/**
 * Memory questions are written as ONE sentence block, e.g.
 *   "Show: cat, ball, flower. Hide it. Which item was in the middle?"
 * The app needs them in two parts: the stimulus (shown, then hidden) and the
 * prompt (asked afterwards). This splits them.
 *
 * Returns { stimulus, prompt }. `stimulus` is null if the text can't be split.
 */
export function splitMemoryQuestion(text) {
  // Split into sentences. The lookbehind keeps a closing quote with its sentence.
  const sentences = text
    .split(/(?<=[.?!]['’"]?)\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean)
    // "Hide it." / "Hide them." is an instruction for the teacher, not content.
    .filter((s) => !/^Hide (it|them)\.?$/i.test(s));

  if (sentences.length < 2) return { stimulus: null, prompt: text };

  const prompt = sentences[sentences.length - 1];
  let stimulus = sentences
    .slice(0, -1)
    .join(' ')
    .replace(/^[^:]*:\s*/, '') // drop the "Show 6 words for 10 seconds:" lead-in
    .replace(/^['‘"“]/, '') // drop quotes around a read-aloud passage
    .replace(/['’"”]$/, '')
    .trim();

  // "kite, spoon, moon." -> "kite, spoon, moon" (only for simple lists)
  if (!/[.!?]\s/.test(stimulus)) stimulus = stimulus.replace(/\.$/, '');

  return { stimulus, prompt };
}

/** How long the stimulus stays on screen. Uses the bank's own "for N seconds" when present. */
function stimulusSecondsFor(originalText, stimulus, grade) {
  const explicit = originalText.match(/for (\d+) seconds/i);
  if (explicit) return Number(explicit[1]);
  const tokens = stimulus.split(/\s+/).length;
  const seconds = Math.min(20, Math.max(6, 4 + Math.round(tokens * 0.7)));
  return grade <= 3 ? seconds + 4 : seconds; // youngest students get a little longer
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Options are shuffled for each student, so classmates can't compare "the answer is B"
 * and the correct answer is equally likely to land in any position.
 */
function orderOptions(options) {
  return shuffle(options);
}

/**
 * Return one grade's 30 questions as a flat list for CognitiveTest.jsx.
 *
 * Fields the app uses:
 *   q            full original wording (saved to results / CSV / PDF)
 *   prompt       what is shown while the student answers
 *   stimulus     text to show then hide (memory items only, otherwise null)
 *   stimulusSeconds
 *   options      4 answer choices, already ordered
 *   answerIndex  index of the correct choice inside `options`
 *   answerText   the correct answer as text
 *   moduleKey / type   domain key: reasoning | memory | attention | inhibition | flexibility
 *   idx          position inside its domain (0-5)
 */
export function getQuestionsForGrade(grade) {
  const level = Math.min(12, Math.max(1, Number(grade) || 1));
  const groups = cognitiveQuestionBank[String(level)];
  if (!groups) return [];

  return DOMAIN_CONFIG.flatMap((module) =>
    (groups[module.key] ?? []).map((question, domainIndex) => {
      const choices = QUESTION_OPTIONS[level]?.[question.number];
      if (!choices || !choices.includes(question.answer)) {
        // The bank and the options file must stay in sync (see questionOptions.js).
        throw new Error(`Missing or inconsistent answer options for ${question.id}`);
      }

      const split =
        question.domain === 'memory'
          ? splitMemoryQuestion(question.question)
          : { stimulus: null, prompt: question.question };

      const options = orderOptions(choices);

      return {
        ...question,
        q: question.question,
        prompt: split.prompt,
        stimulus: split.stimulus,
        stimulusSeconds: split.stimulus
          ? stimulusSecondsFor(question.question, split.stimulus, level)
          : 0,
        options,
        answerIndex: options.indexOf(question.answer),
        answerText: question.answer,
        module: module.name,
        moduleKey: module.key,
        type: module.key,
        idx: domainIndex
      };
    })
  );
}

/** All grades, each split into the five domains. */
export const QuestionBank = cognitiveQuestionBank;
