/**
 * Multiple-choice options for every question in cognitiveQuestionBank_grades1-12.js
 *
 * Shape:  QUESTION_OPTIONS[grade][questionNumber] = [correct, wrong, wrong, wrong]
 *
 * RULES FOR EDITING THIS FILE
 *   1. The FIRST entry is always the correct answer and must match the bank's `answer`
 *      text exactly. (getQuestionsForGrade shuffles the order for each student.)
 *   2. Keep exactly 4 choices per question so every question has the same 25% guess rate.
 *   3. Question numbers run 1-30 inside each grade:
 *        1-6 reasoning | 7-12 memory | 13-18 attention | 19-24 inhibition | 25-30 flexibility
 */

// Re-usable sets for the many go / no-go style questions in the Stop-Go domain.
const RESPOND = ['Respond', 'Do not respond', 'Respond twice', 'Wait for the next cue'];
const DO_NOT_RESPOND = ['Do not respond', 'Respond', 'Respond twice', 'Wait for the next cue'];
const WITHHOLD = ['Withhold response', 'Respond', 'Respond twice', 'Wait for the next cue'];
const TAP = ['Tap', 'Do not tap', 'Tap twice', 'Wait for the next cue'];
const DO_NOT_TAP = ['Do not tap', 'Tap', 'Tap twice', 'Wait for the next cue'];
const PRESS = ['Press', 'Do not press', 'Press twice', 'Wait for the next cue'];
const DO_NOTHING = ['Do nothing', 'Clap', 'Jump', 'Shout'];
const POSITIONS = ['1st and 3rd', '1st and 2nd', '2nd and 4th', '3rd and 4th'];
const COLOURS = ['red', 'blue', 'green', 'yellow'];

export const QUESTION_OPTIONS = {
  // ------------------------------------------------------------------ GRADE 1
  1: {
    1: COLOURS,
    2: ['4', '5', '3', '6'],
    3: ['square', 'circle', 'triangle', 'star'],
    4: ['Sunday', 'Thursday', 'Saturday', 'Tuesday'],
    5: ['carrot', 'apple', 'banana', 'grape'],
    6: ['8', '7', '9', '10'],
    7: ['kite', 'spoon', 'moon', 'none of them'],
    8: ['1', '4', '7', '3'],
    9: ['flower', 'cat', 'ball', 'sun'],
    10: COLOURS,
    11: ['square', 'circle', 'star', 'triangle'],
    12: ['duck', 'dog', 'cat', 'frog'],
    13: ['2', '1', '3', '4'],
    14: ['3', '2', '4', '5'],
    15: ['SUN', 'SNU', 'SUNN', 'None of them'],
    16: ['5', '3', '4', '6'],
    17: ['●', '○', '◐', '■'],
    18: ['2', '1', '3', '4'],
    19: ['Touch head', 'Do nothing', 'Clap hands', 'Stand up'],
    20: ['Do not freeze; STOP is not food', 'Freeze', 'Freeze and count to ten', 'Touch your head'],
    21: ['Stop walking', 'Walk faster', 'Jump', 'Clap'],
    22: DO_NOTHING,
    23: ['Stay still', 'Clap', 'Jump', 'Shout'],
    24: ['Stand still', 'Jump', 'Clap', 'Spin around'],
    25: ['yellow group; then fruit group', 'red group; then fruit group', 'yellow group; then vegetable group', 'blue group; then toy group'],
    26: ['cow', 'dog', 'sheep', 'duck'],
    27: ['corners', 'round', 'sides', 'flat'],
    28: ['button', 'book', 'bus', 'they are all the same'],
    29: ['yes', 'no', 'only if it is small', 'only if it is heavy'],
    30: ['night', 'day', 'sun', 'moon']
  },

  // ------------------------------------------------------------------ GRADE 2
  2: {
    1: ['yellow, yellow', 'green, yellow', 'yellow, green', 'green, green'],
    2: ['20', '25', '18', '16'],
    3: ['point-down triangle', 'point-up triangle', 'square', 'circle'],
    4: ['sock', 'spoon', 'fork', 'plate'],
    5: ['9', '8', '10', '11'],
    6: ['home', 'school', 'library', 'park'],
    7: ['6 and 5', '2 and 9', '6 and 9', '2 and 5'],
    8: ['drum', 'apple', 'key', 'sock'],
    9: ['beside the library', 'inside the library', 'beside the school', 'behind the library'],
    10: ['●', '▲', '■', '★'],
    11: ['6, 1, 8, 3', '3, 8, 1, 6', '6, 8, 1, 3', '1, 6, 3, 8'],
    12: ['red, blue, green, yellow', 'blue, red, green, yellow', 'red, green, blue, yellow', 'yellow, green, blue, red'],
    13: ['3', '2', '4', '6'],
    14: ['7', '4', '8', '9'],
    15: ['CAT/CUT', 'DOG/DOG', 'SUN/SUN', 'None of them'],
    16: ['3', '2', '4', '5'],
    17: ['pond', 'lake', 'river', 'stream'],
    18: ['3 + 3 = 7', '2 + 3 = 5', '4 + 1 = 5', 'All are correct'],
    19: ['Do not tap', 'Tap the desk', 'Tap twice', 'Clap'],
    20: ['Hands down', 'Raise one finger', 'Raise two fingers', 'Clap'],
    21: ['Freeze', 'Stretch', 'Jump', 'Clap'],
    22: ['Stay silent', 'Say "yes"', 'Say "no"', 'Clap'],
    23: ['After two claps', 'After one clap', 'After three claps', 'Before the first clap'],
    24: DO_NOT_RESPOND,
    25: ['triangle', 'blue', 'square', 'circle'],
    26: ['even', 'odd', 'less than 5', '5 or more'],
    27: ['clap', 'stay still', 'stomp', 'spin'],
    28: ['g', 'f', 'r', 'o'],
    29: ['nonliving', 'living', 'a plant', 'an animal'],
    30: ['down', 'up', 'left', 'right']
  },

  // ------------------------------------------------------------------ GRADE 3
  3: {
    1: ['20', '18', '24', '22'],
    2: ['small star', 'large star', 'two small stars', 'three large stars'],
    3: ['48', '16', '25', '49'],
    4: ['14', '12', '21', '16'],
    5: ['I', 'H', 'F', 'J'],
    6: ['white', 'red', 'blue', 'black'],
    7: ['water', 'sandwich', 'orange', 'apple'],
    8: ['window', 'tiger', 'pencil', 'bread'],
    9: ['5, 2, 4', '9, 7', '5, 9, 2, 7, 4', '2, 7, 4'],
    10: ['31', '24', '12', '8'],
    11: ['slice it', 'wash the apple', 'eat the apple', 'peel it'],
    12: ['sun and moon', 'sun only', 'moon only', 'star and moon'],
    13: ['3', '2', '4', '5'],
    14: ['2', '5', '8', '9'],
    15: ['ladder', 'teal', 'coral', 'violet'],
    16: ['4', '3', '5', '2'],
    17: ['10:45', '10:35', '10:40', '10:30'],
    18: ['recieve', 'separate', 'calendar', 'familiar'],
    19: ['Stand', 'Stay seated', 'Clap', 'Jump'],
    20: ['Do nothing', 'Touch left ear', 'Touch right ear', 'Clap'],
    21: ["After 'please jump'", "Right away on the first 'jump'", 'Never jump', 'Jump twice'],
    22: ['3 and 6', '3 only', '6 only', '2 and 4'],
    23: ['Relax', 'Squeeze your hands', 'Clap', 'Jump'],
    24: TAP,
    25: ['7', '11', '9', '12'],
    26: ['peach', 'pear', 'both at the same time', 'neither'],
    27: ['chilly', 'hot', 'warm', 'boiling'],
    28: ['underline 12', 'circle 12', 'do nothing to 12', 'cross out 12'],
    29: ['three equal sides', 'two equal sides', 'four corners', 'no equal sides'],
    30: ['3 hours', '180 hours', '30 hours', '1 hour']
  },

  // ------------------------------------------------------------------ GRADE 4
  4: {
    1: ['28', '27', '30', '24'],
    2: ['1, 3, 7, 13', '1, 2, 4, 8', '1, 3, 5, 7', '1, 3, 6, 10'],
    3: ['4/8', '4/6', '3/8', '5/10'],
    4: ['EPH', 'DPH', 'EOG', 'CNF'],
    5: ['square', 'circle', 'triangle', 'pentagon'],
    6: ['160', '54', '18', '6'],
    7: ['25 minutes', '35 minutes', '50 minutes', '30 minutes'],
    8: ['A', 'T', 'M', 'R'],
    9: ['3, 8, 14, 17, 21', '21, 17, 14, 8, 3', '3, 8, 14, 21, 17', '8, 3, 14, 17, 21'],
    10: ['feather', 'candle', 'shell', 'compass'],
    11: ['station café', 'at home', 'on the train', "at her uncle's house"],
    12: ['12', '10', '14', '16'],
    13: ['3', '2', '4', '5'],
    14: ['planet', 'sky', 'education', 'queue'],
    15: POSITIONS,
    16: ['2', '1', '3', '4'],
    17: ['8×5=45', '6×4=24', '7×3=21', 'None of them'],
    18: ['6', '7', '5', '8'],
    19: ['No thumbs-up', 'Thumbs-up', 'Two thumbs-up', 'Clap'],
    20: ['Stand', 'Sit', 'Stay seated', 'Jump'],
    21: ['Do not respond', 'Respond', 'Respond twice', 'Say "red"'],
    22: ['sun and star', 'tree and cloud', 'star and cloud', 'sun and tree'],
    23: ['Do nothing', 'Tap once', 'Tap twice', 'Clap'],
    24: ['Move', 'Do not move', 'Move twice', 'Wait for the next number'],
    25: ['10', '21', '4', '14'],
    26: ['equal to 1', 'below 1', 'above 1', 'not equal to 1'],
    27: ['C', 'E', 'D', 'A'],
    28: ['4', '6', '8', '684'],
    29: ['invertebrate', 'vertebrate', 'land animal', 'water animal'],
    30: ['POTS', 'STOP', 'SPOT', 'TOPS']
  },

  // ------------------------------------------------------------------ GRADE 5
  5: {
    1: ['42', '40', '36', '44'],
    2: ['3', '6', '4', '2'],
    3: ['17', '15', '8', '13'],
    4: ['egg:bird', 'wheel:road', 'page:book', 'none of them'],
    5: ['34', '21', '20', '30'],
    6: ['heptagon', 'octagon', 'pentagon', 'nonagon'],
    7: ['dinosaur room', 'planetarium', 'museum shop', 'library'],
    8: ['2, 9, 4, 6, 1, 8, 3', '3, 8, 1, 6, 4, 9, 2', '2, 9, 4, 1, 6, 8, 3', '2, 4, 9, 6, 1, 8, 3'],
    9: ['cedar', 'violet', 'silver', 'amber'],
    10: ['$3', '$4', '$7', '$6'],
    11: ['2', '1', '3', '4'],
    12: ['add the milk', 'sift the flour', 'add the eggs again', 'stop cooking'],
    13: ['3', '2', '4', '5'],
    14: ['apple', 'amber', 'birch', 'elm'],
    15: ['1st and 4th', '1st and 3rd', '2nd and 3rd', '2nd and 4th'],
    16: ['3', '2', '4', '1'],
    17: ['7²=48', '12²=144', '9²=81', '5²=25'],
    18: ['4', '3', '5', '6'],
    19: ["Remain silent / no 'go'", "Say 'go'", "Say 'go' twice", 'Clap'],
    20: ['Do not respond', 'Say "0 sides"', 'Say "1 side"', 'Say "circle"'],
    21: ['Do not tap; 1 is neither', 'Tap once', 'Tap twice', 'Tap three times'],
    22: ['Do not clap', 'Clap', 'Clap twice', 'Say "Simon says"'],
    23: ['January, June, July', 'January, July', 'June, July, August', 'January, June'],
    24: DO_NOT_RESPOND,
    25: ['odd', 'even', 'prime', 'composite'],
    26: ['DH', 'HL', 'EI', 'FJ'],
    27: ['equilateral', 'isosceles', 'scalene', 'right-angled'],
    28: ['25 square units', '20 units', '10 square units', '25 units'],
    29: ['R group', 'E group', 'V group', 'I group'],
    30: ['24', '97', '49', '12']
  },

  // ------------------------------------------------------------------ GRADE 6
  6: {
    1: ['46', '43', '45', '48'],
    2: ['8', '7', '9', '6'],
    3: ['100', '8', '27', '125'],
    4: ['UBD', 'DBU', 'TAC', 'UCD'],
    5: ['EV', 'EW', 'FV', 'DV'],
    6: ['6', '5', '7', '8'],
    7: ['60 minutes', '45 minutes', '15 minutes', '30 minutes'],
    8: [
      'harbor, prism, meadow, copper, velvet, orbit',
      'orbit, velvet, copper, meadow, prism, harbor',
      'harbor, prism, copper, meadow, velvet, orbit',
      'harbor, meadow, prism, copper, velvet, orbit'
    ],
    9: ['2, 4, 8', '9, 7, 1', '2, 4', '8, 4, 2'],
    10: ['25', '31', '22', '18'],
    11: ['a ruler', 'a map', 'the drawer', 'a book'],
    12: ['22', '11', '20', '13'],
    13: ['4', '3', '5', '6'],
    14: ['almost', 'planet', 'bring', 'water'],
    15: ['6:30', '3:9', '4:16', '5:25'],
    16: ['5', '4', '6', '9'],
    17: ['look look closely', 'we learn daily', 'read and think', 'solve with care'],
    18: ['5', '7', '4', '6'],
    19: RESPOND,
    20: ['Do not raise hand', 'Raise your hand', 'Raise both hands', 'Whisper the command'],
    21: COLOURS,
    22: ['1 and 10', '1 only', '10 only', '1, 5 and 10'],
    23: ['Do not tap; adverb', 'Tap; verb', 'Tap; noun', 'Do not tap; noun'],
    24: ['Do not clap', 'Clap', 'Clap twice', 'Wait and clap later'],
    25: ['(3,3)', '(4,4)', '(2,4)', '(4,3)'],
    26: ['3', '2', '4', '1'],
    27: ['600', '650', '640', '700'],
    28: ['complementary', 'supplementary', 'vertical', 'adjacent'],
    29: ['44', '46', '64', '54'],
    30: ['18 and 36', '9 and 18', '2 and 9', '6 and 3']
  },

  // ------------------------------------------------------------------ GRADE 7
  7: {
    1: ['55', '53', '52', '57'],
    2: ['35', '36', '37', '25'],
    3: ['multiply by 3 and add 1', 'multiply by 2 and add 4', 'add 7', 'multiply by 3 and subtract 1'],
    4: ['compass:direction', 'thermometer:temperature', 'telescope:distance', 'none of them'],
    5: ['A', 'B', 'Z', 'C'],
    6: ['circle', 'square', 'triangle', 'star'],
    7: ['north', 'east', 'south', 'west'],
    8: ['9, 7, 8, 6', '4, 1, 3, 2', '9, 1, 3, 2', '9, 7, 6, 8'],
    9: ['maple', 'linen', 'quartz', 'cobalt'],
    10: ['56', '55', '46', '54'],
    11: ['J', 'F', 'O', 'C'],
    12: ['labeled', 'cooled', 'stored', 'dated'],
    13: ['4', '3', '5', '7'],
    14: ['Tuesday', 'April', 'June', 'November'],
    15: ['7O2M', '7Q2M', '7Q2N', 'All are the same'],
    16: ['3', '2', '4', '5'],
    17: ['39 is prime', '13 is prime', '21 is composite', '29 is prime'],
    18: ['3', '2', '4', '5'],
    19: DO_NOT_RESPOND,
    20: DO_NOT_TAP,
    21: RESPOND,
    22: ['Do not give a number', 'Say 5', 'Say 6', 'Say 1'],
    23: PRESS,
    24: WITHHOLD,
    25: ['24', '11', '26', '10'],
    26: ['evidence', 'claim', 'opinion', 'fact'],
    27: ['TEA', 'SEA', 'TAE', 'EAT'],
    28: [
      'equal length and bisect each other',
      'perpendicular and unequal',
      'unequal and do not bisect each other',
      'equal length and always perpendicular'
    ],
    29: ['8', '7', '9', '11'],
    30: ['(2,3)', '(−2,−3)', '(2,−3)', '(3,−2)']
  },

  // ------------------------------------------------------------------ GRADE 8
  8: {
    1: ['23', '22', '24', '25'],
    2: ['33', '31', '34', '35'],
    3: ['23', '27', '25', '21'],
    4: ['250', '121', '196', '225'],
    5: ['KYRF', 'OCVJ', 'LYSG', 'KZRF'],
    6: ['41', '39', '43', '40'],
    7: ['31', '37', '34', '28'],
    8: [
      'bronze, canyon, lantern, magnet, orchard, silk, tide',
      'bronze, canyon, magnet, lantern, orchard, silk, tide',
      'canyon, bronze, lantern, magnet, orchard, silk, tide',
      'tide, silk, orchard, magnet, lantern, canyon, bronze'
    ],
    9: ['8, 5, 2, 7, 4, 1', '1, 4, 7, 8, 5, 2', '7, 4, 1, 8, 5, 2', '8, 5, 2, 1, 4, 7'],
    10: ['checked', 'drafted', 'edited', 'submitted'],
    11: ['9 and 13', '4 and 16', '13 and 16', '6 and 9'],
    12: ['2', '1', '3', '4'],
    13: ['3', '2', '4', '5'],
    14: ['pascal', 'joule', 'calorie', 'watt-hour'],
    15: POSITIONS,
    16: ['1', '0', '2', '3'],
    17: ['12% of 50=8', '15% of 200=30', '20% of 90=18', 'None of them'],
    18: ['3', '2', '4', '5'],
    19: RESPOND,
    20: ['Do not follow it', 'Follow it', 'Follow it twice', 'Follow it only if asked again'],
    21: TAP,
    22: ['Do not answer', 'Say 0', 'Say −1', 'Say 1'],
    23: RESPOND,
    24: WITHHOLD,
    25: ['5', '4', '6', '7'],
    26: ['-less', 'care', '-ful', '-ness'],
    27: ['20°C', '154.4°C', '36°C', '68°C'],
    28: ['right triangle', 'acute triangle', 'obtuse triangle', 'equilateral triangle'],
    29: ['24', '2', '48', '12'],
    30: ['ABCD', 'DCBA', 'BCDA', 'ACBD']
  },

  // ------------------------------------------------------------------ GRADE 9
  9: {
    1: ['159', '157', '160', '119'],
    2: ['73', '75', '13', '148'],
    3: ['11', '10', '12', '9'],
    4: ['composer:symphony', 'actor:stage', 'chef:restaurant', 'none of them'],
    5: ['110', '1000', '111', '102'],
    6: ['(−2, −3)', '(2, 3)', '(−2, 3)', '(2, −3)'],
    7: ['41 km', '48 km', '34 km', '18 km'],
    8: ['1, 4, 5, 2', '1, 4, 9', '3, 1, 5, 2', '1, 4, 5, 9'],
    9: ['basalt and onyx', 'basalt and birch', 'jade and onyx', 'spruce and onyx'],
    10: ['BADC', 'BACD', 'ABCD', 'BDAC'],
    11: ['55', '38', '35', '58'],
    12: ['19, 14, 11, 8, 5, 2', '2, 5, 8, 11, 14, 19', '19, 14, 11, 5, 8, 2', '11, 5, 19, 8, 14, 2'],
    13: ['4', '3', '5', '6'],
    14: ['force', 'neon', 'iron', 'helium'],
    15: POSITIONS,
    16: ['4', '3', '5', '2'],
    17: ['1/4=20%', '0.4=40%', '3/5=60%', '0.08=8%'],
    18: ['4', '3', '5', '6'],
    19: RESPOND,
    20: ['Withhold response', 'Say "green"', 'Say "GREEN"', 'Say "blue"'],
    21: RESPOND,
    22: ['Raise hand', 'Touch nose', 'Do both', 'Do neither'],
    23: TAP,
    24: WITHHOLD,
    25: ['x³/3 + C', '3x² + C', 'x³ + C', '2x + C'],
    26: ['strong negative correlation', 'weak negative correlation', 'strong positive correlation', 'no correlation'],
    27: ['(x−3)(x+3)', '(x−3)²', '(x+3)²', '(x−9)(x+1)'],
    28: [
      'whales breathe; valid deduction',
      'whales breathe; invalid deduction',
      'whales do not breathe; valid deduction',
      'whales are fish; valid deduction'
    ],
    29: ['0.375', '3/8', '0.38', '0.325'],
    30: ['(−4,1)', '(4,−1)', '(1,4)', '(−1,−4)']
  },

  // ------------------------------------------------------------------ GRADE 10
  10: {
    1: ['720', '240', '360', '600'],
    2: ['29', '13', '27', '31'],
    3: ['1/2', '2', '1/4', '3/4'],
    4: ['27', '23', '19', '31'],
    5: ['7', '6', '8', '9'],
    6: ['(−1, 10)', '(1, 10)', '(−1, 9)', '(−3, 10)'],
    7: ['1 hour 30 minutes', '1 hour 40 minutes', '1 hour 50 minutes', '1 hour 20 minutes'],
    8: ['all four symbols', '○ and △ only', '□ and ☆ only', 'none of the symbols'],
    9: ['the 2020 census', 'the 2022 survey', 'the 2028 forecast', 'all are equally old'],
    10: [
      '21, 13, 34, 8, 5, 55, 3',
      '21, 13, 34, 8, 5, 55',
      '13, 34, 8, 5, 55, 3',
      '21, 34, 8, 55'
    ],
    11: ['7', '6', '10', '13'],
    12: ['T, Q, M, L, B, A', 'A, B, L, M, Q, T', 'T, Q, L, M, B, A', 'L, Q, B, T, M, A'],
    13: ['3', '2', '4', '5'],
    14: ['median', 'sine', 'cosine', 'tangent'],
    15: POSITIONS,
    16: ['3', '2', '4', '1'],
    17: ['3⁴=64', '2³=8', '√81=9', '5!=120'],
    18: ['4', '3', '5', '6'],
    19: RESPOND,
    20: ['blue', 'red', 'green', 'yellow'],
    21: ['Do not clap', 'Clap', 'Clap twice', 'Say "2+2=5"'],
    22: RESPOND,
    23: PRESS,
    24: ['Say valid', 'Stay silent', 'Say invalid', 'Say error'],
    25: ['5', '3', '4', '6'],
    26: ['1', '11', '−1', '6'],
    27: ['2 and 3', '1 and 6', '−2 and −3', '−2 and 3'],
    28: ['4', '3', '5', '7'],
    29: ['$110.25', '$110.00', '$105.00', '$100.25'],
    30: ['3', '8', '2', '4']
  },

  // ------------------------------------------------------------------ GRADE 11
  11: {
    1: ['37', '36', '35', '38'],
    2: ['19', '21', '17', '20'],
    3: ['14', '2', '8', '−14'],
    4: [
      'At least one triangle does not have three sides',
      'No triangle has three sides',
      'All triangles have more than three sides',
      'Some triangles have three sides'
    ],
    5: [
      'Both the operation order and the current orientation',
      'Only the first rotation',
      'Only the reflection',
      'The colour of the shape'
    ],
    6: ['26', '25', '24', '27'],
    7: ['7', '8', '21', '6'],
    8: ['3, 7, 6, 9', '9, 6, 7, 3', '2, 1, 4, 8', '8, 4, 1, 2'],
    9: ['Sunday', 'Saturday', 'Thursday', 'Monday'],
    10: [
      'angle, tensor, matrix, scalar, vector, delta',
      'delta, vector, scalar, matrix, tensor, angle',
      'angle, tensor, scalar, matrix, vector, delta',
      'angle, matrix, tensor, scalar, vector, delta'
    ],
    11: ['7%', '13%', '9%', '5%'],
    12: ['62', '72', '50', '54'],
    13: ['3', '2', '4', '5'],
    14: [
      'energy=mass×velocity',
      'speed=distance/time',
      'density=mass/volume',
      'force=mass×acceleration'
    ],
    15: POSITIONS,
    16: ['3', '2', '4', '5'],
    17: ['Its raining.', 'Wait, please.', 'What time is it?', 'Wonderful!'],
    18: ['2', '1', '4', '0'],
    19: RESPOND,
    20: RESPOND,
    21: ['Stay seated', 'Stand up', 'Stand up slowly', 'Ask the teacher'],
    22: RESPOND,
    23: PRESS,
    24: TAP,
    25: ['−sin x', 'sin x', 'cos x', '−cos x'],
    26: ['2', '3', '1/2', '4'],
    27: ['10', '20', '5', '25'],
    28: ['9 m', '6 m', '18 m', '12 m'],
    29: [
      'Reject the null hypothesis',
      'Fail to reject the null hypothesis',
      'Accept the alternative as proven',
      'The test is inconclusive'
    ],
    30: ['5', '7', '25', '1']
  },

  // ------------------------------------------------------------------ GRADE 12
  12: {
    1: ['120', '125', '60', '124'],
    2: ['192', '96', '384', '189'],
    3: ['21', '13', '34', '18'],
    4: [
      '90° counterclockwise rotation',
      '90° clockwise rotation',
      '180° rotation',
      'reflection in the y-axis'
    ],
    5: ['56', '52', '54', '50'],
    6: ['67', '63', '65', '71'],
    7: ['22 March', '23 March', '21 March', '24 March'],
    8: ['5, 2, 4, 1, 8', '8, 1, 4, 2, 5', '2, 4, 1, 8', '3, 9, 7, 6'],
    9: ['6', '9', '16', '34'],
    10: [
      'theorem, inference, conclusion',
      'premise, evidence, counterexample',
      'theorem, premise, inference',
      'inference, conclusion, counterexample'
    ],
    11: ['21°C', '15°C', '23°C', '11°C'],
    12: [
      '11, 14, 17, 19, 23, 29, 31',
      '31, 29, 23, 19, 17, 14, 11',
      '11, 14, 17, 23, 19, 29, 31',
      '11, 17, 14, 19, 23, 29, 31'
    ],
    13: ['3', '2', '4', '5'],
    14: ['1.2', '0', '0.35', '1'],
    15: POSITIONS,
    16: ['4', '3', '5', '7'],
    17: ['d(x³)/dx=2x²', 'd(x²)/dx=2x', 'd(3x)/dx=3', 'd(5)/dx=0'],
    18: ['2', '1', '3', '4'],
    19: RESPOND,
    20: ["Do not answer 'true'", "Answer 'true'", "Answer 'true' twice", 'Wait for the next statement'],
    21: ['Say yellow', 'Say blue', 'Withhold response', 'Say green'],
    22: DO_NOT_RESPOND,
    23: DO_NOT_RESPOND,
    24: RESPOND,
    25: ['eˣ + C', 'eˣ', 'xeˣ + C', 'e^(x+1) + C'],
    26: ['2', '1', '1/2', '4'],
    27: ['k', '−k', 'j', '0'],
    28: ['0.4', '0.1', '0.7', '2.5'],
    29: ['7', '23', '−7', '1'],
    30: ['y=x³+2', 'y=x³', 'y=3x²+2', 'y=x³+C']
  }
};
