
// LearnJS exercises include all kinds of evaluation challenges such as:
// - code exercises
// - quizzes
// - ...

export const exercises = [
  {
    id: 16,
    name: "Hello World",
    description: "Create a statement that print 'Hello World' in the console.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "console.log('Hello World')",
    tests: [
      {
        input: "log",
        output: "",
        expected: "Hello World",
        type: "log",
      },
      {
        input: "lines",
        output: "",
        expected: "== 1",
        type: "metric",
        subtype: "lines",
      },
    ],
  },
  {
    id: 17,
    name: "Playing with variables",
    description:
      "Declare two variables: <code>admin</code> and <code>name</code>. Assign the value <code>'John'</code> to the variable <code>name</code>. Copy the value from <code>name</code> to <code>admin</code>. Print the value of <code>admin</code> in the console.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "let admin, name\nname = 'John'\nadmin = name\nconsole.log(admin)",
    tests: [
      {
        input: "name",
        output: "",
        expected: "John",
        type: "expression",
      },
      {
        input: "admin==name",
        output: "",
        expected: "true",
        type: "expression",
      },
      {
        input: "occurrences:'John'",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
      {
        input: "log",
        output: "",
        expected: "John",
        type: "log",
      },
    ],
  },
  {
    id: 18,
    name: "The PI value",
    description:
      "Define variables PI and WHITE_COLOR to store the PI and the white color hexadecimal values.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "const PI = 3.14\nconst WHITE_COLOR = '#FFFFFF'",
    tests: [
      {
        input: "typeof(PI)",
        output: "",
        expected: "number",
        type: "expression",
      },
      {
        input: "typeof(WHITE_COLOR)",
        output: "",
        expected: "string",
        type: "expression",
      },
      {
        input: "PI.toFixed(2)",
        output: "",
        expected: "3.14",
        type: "expression",
      },
      {
        input: "WHITE_COLOR",
        output: "",
        expected: "#FFFFFF",
        type: "expression",
      },
      {
        input: "PI=1",
        output: "",
        expected: "error",
        type: "expression",
        subtype: "error"
      }
    ],
  },
  {
    id: 19,
    name: "Quiz about variables!",
    type: "quiz",
    subtype: "quiz",
    quizId: 1,
  },
  {
    id: 20,
    name: "Numbers and Strings",
    description:
      "Define a variable <code>school</code> with a string at your choice. Then, define a variable <code>age</code> with a number at your choice. Try to do all in the same line!",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "let school = 'esmad';\nlet age = 23;\n",
    tests: [
      {
        input: "typeof(school)",
        output: "",
        expected: "string",
        type: "expression",
      },
      {
        input: "typeof(age)",
        output: "",
        expected: "number",
        type: "expression",
      },
      {
        input: "lines",
        output: "",
        expected: "== 1",
        type: "metric",
        subtype: "lines",
      },
    ],
  },

  {
    id: 21,
    name: "Sum two numbers",
    description:
      "Define a variable <code>a</code> with the value <code>2</code>. Then, define a variable <code>b</code> with the value <code>3</code>. Finally, create a variable <code>c</code> with the sum of the two previous variables.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "let a = 2;\nlet b = 3;\nlet c = a + b;",
    tests: [
      {
        input: "a",
        output: "",
        expected: "2",
        type: "expression",
      },
      {
        input: "b",
        output: "",
        expected: "3",
        type: "expression",
      },
      {
        input: "c",
        output: "",
        expected: "5",
        type: "expression",
      },
      {
        input: "occurrences:5",
        output: "",
        expected: "0",
        type: "metric",
        subtype: "occurrences"
      },
    ],
  },
  {
    id: 22,
    name: "Backsticks",
    description:
      "Using <strong>backsticks</strong> present the sentence <code>My name is NAME. I'm AGE years old!</code> through <code>console.log</code> where NAME e AGE should be replaced by the variables <code>name</code> and <code>age</code>, respectively.",
    type: "code",
    subtype: "skeleton",
    skeleton: "// Variables\nlet name = 'Rui';\nlet age = 33;\n",
    code: "// Variables\nlet name = 'Rui';\nlet age = 33;\nconsole.log(`My name is ${name}. I'm ${age} years old!`)",
    tests: [
      {
        input: "name",
        output: "",
        expected: "Rui",
        type: "expression",
      },
      {
        input: "age",
        output: "",
        expected: "33",
        type: "expression",
      },
      {
        input: "occurrences:Rui",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
      {
        input: "log",
        output: "",
        expected: "My name is Rui. I'm 33 years old!",
        type: "log",
      },
    ],
  },
  {
    id: 23,
    name: "Type of variables",
    description:
      "Declare a variable with the name <code>isOpen</code> and assign a boolean value. Print in the console its type using the right operator.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "let isOpen = true;\nconsole.log(typeof isOpen);",
    tests: [
      {
        input: "typeof(isOpen)",
        output: "",
        expected: "boolean",
        type: "expression",
      },
      {
        input: "log",
        output: "",
        expected: "boolean",
        type: "log",
      },
      {
        input: "occurrences:typeof",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
    ],
  },
  {
    id: 24,
    name: "Quiz on data types",
    type: "quiz",
    subtype: "quiz",
    quizId: 2,
  },
  {
    id: 25,
    name: "Division of two numbers",
    description:
      "Calculate the division of these strings (<code>num1</code> and <code>num2</code>) and put the result in a variable called <code>res</code>. Then output the value of the variable using <code>console.log</code>. The result should have 2 decimal places.",
    type: "code",
    subtype: "skeleton",
    skeleton: "// Variables\nlet num1 = '7';\nlet num2 = '3';\n",
    code: "let num1 = '7';\nlet num2 = '3';\nlet res = num1 / num2;\nconsole.log(res.toFixed(2));",
    tests: [
      {
        input: "num1",
        output: "",
        expected: "7",
        type: "expression",
      },
      {
        input: "num2",
        output: "",
        expected: "3",
        type: "expression",
      },
      {
        input: "res",
        output: "",
        expected: "2.3333333333333335",
        type: "expression",
      },
      {
        input: "log",
        output: "",
        expected: "2.33",
        type: "log",
      },
      {
        input: "occurrences:toFixed",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      }
    ]
  },
  {
    id: 26,
    name: "Find the operator",
    description:
      "Use the correct assignment operator that will result in <code>x</code> being 64.",
    type: "code",
    subtype: "skeleton",
    skeleton: "// Variables\nlet x = 4;\nlet y = 3;\nx = x  y;\nconsole.log(x);",
    code: "let x = 4;\nlet y = 3;\nx = x  ** y;\nconsole.log(x);",
    tests: [
      {
        input: "x",
        output: "",
        expected: "64",
        type: "expression",
      },
      {
        input: "y",
        output: "",
        expected: "3",
        type: "expression",
      },
      {
        input: "log",
        output: "",
        expected: "64",
        type: "log",
      },
      {
        input: "occurrences:\\*\\*",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      }
    ]
  },
  {
    id: 27,
    name: "Quiz on operators",
    type: "quiz",
    subtype: "quiz",
    quizId: 3,
  },
  {
    id: 28,
    name: "Help me with this variable!",
    description:
      "Correct this code in order to have the value of variable <code>x</code> correctly output.",
    type: "code",
    subtype: "buggy",
    skeleton: "// Correct the next code\nlet x;\nX = 4;\nconsole.log(x);",
    code: "let x;\nx = 4;\nconsole.log(x);",
    tests: [
      {
        input: "x",
        output: "",
        expected: "4",
        type: "expression",
      },
      {
        input: "log",
        output: "",
        expected: "4",
        type: "log",
      }
    ]
  },
  {
    id: 29,
    name: "What is your age?",
    description:
      "Declare a variable called <code>age</code> and assign your age to it.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "let age = 18;",
    tests: [
      {
        input: "typeof(age)",
        output: "",
        expected: "number",
        type: "expression",
      }
    ]
  },
  {
    id: 42,
    name: "Can I see the movie?",
    description:
      "Declare a variable called <code>age</code> and assign the value 19. Then create a conditional that logs 'You can see the movie' if age is bigger than 18",
    type: "code",
    subtype: "blank",
    skeleton: "let age = 19;\n",
    code: "let age = 19;\nif(age > 18) {\n&nbsp;&nbsp;console.log('You can see the movie')\n}",
    readonly: [1],
    tests: [
      {
        input: "typeof(age)",
        output: "",
        expected: "number",
        type: "expression",
      },
      {
        input: "age",
        output: "",
        expected: "19",
        type: "expression",
      },
      {
        input: "log",
        output: "",
        expected: "You can see the movie",
        type: "log",
      },
      {
        input: "occurrences:if",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
      {
        input: "occurrences:>",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      }
    ]
  },
  {
    id: 43,
    name: "Buy a cake",
    description:
      "John has 20 cents in is pocket. Mary has the double. Define variables <code>johnMoney</code> and <code>maryMoney</code> for both budgets. Calculate the total money of the two friends and store it in a variable called <code>totalMoney</code>. Then, log in the console 'YES' if they have sufficient money based on the value of <code>CAKE_COST</code>, and 'NO', otherwise.",
    type: "code",
    subtype: "blank",
    skeleton: "const CAKE_COST = 65\n",
    code: "const CAKE_COST = 65;\nlet johnMoney = 20;\nlet maryMoney = johnMoney * 2;\nlet totalMoney = johnMoney + maryMoney;\nif(totalMoney >= CAKE_COST) {\nconsole.log('YES');\n} else {\nconsole.log('NO');\n}\n",
    readonly: [1],
    tests: [
      {
        input: "typeof(johnMoney)",
        output: "",
        expected: "number",
        type: "expression",
      },
      {
        input: "typeof(maryMoney)",
        output: "",
        expected: "number",
        type: "expression",
      },
      {
        input: "maryMoney == johnMoney * 2",
        output: "",
        expected: "true",
        type: "expression",
      },
      {
        input: "CAKE_COST",
        output: "",
        expected: "65",
        type: "expression",
      },
      {
        input: "log",
        output: "",
        expected: "NO",
        type: "log",
      },
      {
        input: "occurrences:if",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
      {
        input: "occurrences:else",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
      {
        input: "occurrences:40",
        output: "",
        expected: "0",
        type: "metric",
        subtype: "occurrences"
      }
    ]
  },
  {
    id: 44,
    name: "Are we in 2021?",
    description:
      "Feed a variable called <code>is2021</code>, based on the value of the constant <code>currentYear</code>, with the value 'YES' if we are in 2021, or 'NO' otherwise. You must use the ternary operator!",
    type: "code",
    subtype: "blank",
    skeleton: "const currentYear = new Date().getFullYear();\n",
    code: "const currentYear = new Date().getFullYear();\nlet is2021 = currentYear == 2021 ? 'YES' : 'NO';\n",
    readonly: [1],
    tests: [
      {
        input: "typeof(is2021)",
        output: "",
        expected: "string",
        type: "expression",
      },
      {
        input: "is2021",
        output: "",
        expected: "YES",
        type: "expression",
      },
      {
        input: "occurrences:\\?",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
      {
        input: "lines",
        output: "",
        expected: "== 2",
        type: "metric",
        subtype: "lines",
      },
    ]
  },
  {
    id: 45,
    name: "Grades",
    description:
      "Claire got 8 at Algorithms. Store the grade in a variable called <code>claireGrade</code>. Help Claire to know its status regarding this course. In Algorithms course any grade below 7, the student is 'DISAPPROVED'. Grades equals or greater than 7 and less than 10 the student goes to an 'ORAL'. Any grade equal or greater than 10 the student is 'APPROVED'. Store the Claire's final status in a variable called <code>claireStatus</code> and print it in the console.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "const claireGrade = 8;\nlet claireStatus;\nif(claireGrade < 7) {\nclaireStatus = 'DISAPPROVED';\n }else if(claireGrade < 10) {\nclaireStatus = 'ORAL';\n} else {\nclaireStatus = 'APPROVED';\n}\nconsole.log(claireStatus);\n",
    readonly: [1],
    tests: [
      {
        input: "typeof(claireStatus)",
        output: "",
        expected: "string",
        type: "expression",
      },
      {
        input: "claireStatus",
        output: "",
        expected: "ORAL",
        type: "expression",
      },
      {
        input: "log",
        output: "",
        expected: "ORAL",
        type: "log"
      },
      {
        input: "occurrences:else if",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
    ]
  },
  {
    id: 46,
    name: "Go to the Cinema!",
    description:
      "Anne and Peter went to the cinema. They need to pay 12 euros (<code>totalPrice</code>) for the tickets. If any of them has a cinema card they got a discount of 20% in the total price."
      +
      "Ana doesn't have it, but Pedro has it. Define both variables <code>hasAnneCard</code> and <code>hasPeterCard</code> to represent this."
      +
      "Then using a conditional block calculate the final value that they must pay to go to the cinema and store it in <code>totalPrice</code> variable.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "let totalPrice = 12;\nconst discount = 0.2;\nconst hasAnneCard = false;\nlet hasPeterCard = true;\nif(hasAnneCard || hasPeterCard) {\ntotalPrice -= totalPrice * discount;\n}\n",
    readonly: [1],
    tests: [
      {
        input: "typeof(hasAnneCard)",
        output: "",
        expected: "boolean",
        type: "expression",
      },
      {
        input: "hasAnneCard",
        output: "",
        expected: "false",
        type: "expression",
      },
      {
        input: "typeof(hasPeterCard)",
        output: "",
        expected: "boolean",
        type: "expression",
      },
      {
        input: "hasPeterCard",
        output: "",
        expected: "true",
        type: "expression",
      },
      {
        input: "totalPrice",
        output: "",
        expected: "9.6",
        type: "expression",
      },
    ]
  },
  {
    id: 47,
    name: "Quiz on conditionals",
    type: "quiz",
    subtype: "quiz",
    quizId: 4,
  },
  {
    id: 50,
    name: "One to Nine",
    description:
      "Feed a string variable <code>numbers</code> with the values from 1 to 9 using the keyword <code>while</code>. Finally, log the variable in the console",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "let numbers = '';\nlet i=1;\nwhile(i<10) {\nnumbers = numbers + i;\ni++\n}\nconsole.log(numbers);\n",
    readonly: [1],
    tests: [
      {
        input: "typeof(numbers)",
        output: "",
        expected: "string",
        type: "expression",
      },
      {
        input: "numbers",
        output: "",
        expected: "123456789",
        type: "expression",
      },
      {
        input: "log",
        output: "",
        expected: "123456789",
        type: "log"
      },
      {
        input: "occurrences:while",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
    ]
  },
  {
    id: 51,
    name: "Even numbers",
    description:
      "Calculate the sum of the even numbers between <code>n1</code> and <code>n2</code> and store it in a variable <code>sumEvenNumbers</code>.",
    type: "code",
    subtype: "blank",
    skeleton: "const n1 = 7;\nconst n2 = 22;\n",
    code: "const n1 = 7;\nconst n2 = 22;\nlet sumEvenNumbers = 0;\nfor(let i=n1;i<=n2;i++) {\n  if(i % 2 == 0) {\n    sumEvenNumbers += i;\n  }\n}\n",
    readonly: [1],
    tests: [
      {
        input: "n1",
        output: "",
        expected: "7",
        type: "expression",
      },
      {
        input: "n2",
        output: "",
        expected: "22",
        type: "expression",
      },
      {
        input: "sumEvenNumbers",
        output: "",
        expected: "120",
        type: "expression",
      },
      {
        input: "occurrences:for",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
    ]
  },
  {
    id: 52,
    name: "Descendants",
    description:
      "Calculate the sum of all the descendants of the number stored in <code>n</code>, store the sum in a variable <code>sum</code> and print it in the console.",
    type: "code",
    subtype: "buggy",
    skeleton: "const n1 = 7;\nlet sum = 0;\nfor(let i = n1 - 1; i >= 1; i++) {\n  sum += i;\n}\n",
    code: "const n1 = 7;\nlet sum = 0;\nfor(let i = n1 - 1; i >= 1; i--) {\n  sum += i;\n}\n",
    readonly: [1],
    tests: [
      {
        input: "n1",
        output: "",
        expected: "7",
        type: "expression",
      },
      {
        input: "sum",
        output: "",
        expected: "21",
        type: "expression",
      },
      {
        input: "occurrences:for",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
    ]
  },
  {
    id: 53,
    name: "Let's write symbols",
    description:
      "Complete the code so given a number <code>n</code> and a symbol <code>s</code> it prints in the console <code>s</code>, <code>n</code> times.",
    type: "code",
    subtype: "skeleton",
    skeleton: "const n = 7;\nconst s = '#';\nfor(let i = ; i < ; i++) {\n  console.log();\n}\n",
    code: "const n = 7;\nconst s = '#';\nfor(let i = 1; i <= n ; i++) {\n  console.log(s);\n}\n",
    readonly: [1],
    tests: [
      {
        input: "n",
        output: "",
        expected: "7",
        type: "expression",
      },
      {
        input: "s",
        output: "",
        expected: "#",
        type: "expression",
      },

      {
        input: "log",
        output: "",
        expected: "#######",
        type: "log",
      },
      {
        input: "occurrences:for",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
    ]
  },
  {
    id: 54,
    name: "Quiz on loops",
    type: "quiz",
    subtype: "quiz",
    quizId: 5,
  },
  {
    id: 57,
    name: "Sum two numbers",
    description:
      "Create a function called <code>sum</code>that receives two numbers and return their sum.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "function sum(num1, num2) {\n&nbsp;&nbsp;return num1 + num2;\n}\n",
    readonly: [1],
    tests: [
      {
        input: "7 8",
        output: "",
        expected: "15",
        type: "function",
      },
      {
        input: "-1 1",
        output: "",
        expected: "0",
        type: "function",
      },
      {
        input: "typeof(sum)",
        output: "",
        expected: "function",
        type: "expression",
      },
    ]
  },
  {
    id: 58,
    name: "Sum N numbers",
    description:
      "Create a function called <code>sum</code>that receives several numbers and return their sum.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "function sum(...nums) {\n&nbsp;&nbsp;let result = 0;\n&nbsp;&nbsp;for(let num of nums) {\n&nbsp;&nbsp;&nbsp;&nbsp;result += num;\n&nbsp;&nbsp;}\n&nbsp;&nbsp;return result;\n}\n",
    readonly: [1],
    tests: [
      {
        input: "-1",
        output: "",
        expected: "-1",
        type: "function",
      },
      {
        input: "-1 1 2",
        output: "",
        expected: "2",
        type: "function",
      },
      {
        input: " 1 2 3 4 5",
        output: "",
        expected: "15",
        type: "function",
      },
      {
        input: "typeof(sum)",
        output: "",
        expected: "function",
        type: "expression",
      },
    ]
  },
  {
    id: 59,
    name: "How many arguments?",
    description:
      "Create a function called <code>getNumArguments</code>that returns the number or arguments passed to the function.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "function getNumArguments() {\n&nbsp;&nbsp;return arguments.length;\n}\n",
    readonly: [1],
    tests: [
      {
        input: "-1",
        output: "",
        expected: "1",
        type: "function",
      },
      {
        input: "-1 1 2",
        output: "",
        expected: "3",
        type: "function",
      },
      {
        input: "",
        output: "",
        expected: "0",
        type: "function",
      },
      {
        input: "typeof(getNumArguments)",
        output: "",
        expected: "function",
        type: "expression",
      },
    ]
  },
  {
    id: 60,
    name: "Arrow Cube!",
    description:
      "Create an arrow function <code>calcCube</code> that receives a number and return its cube.",
    type: "code",
    subtype: "blank",
    skeleton: "",
    code: "const calcCube = (num) => num ** 3;\n",
    readonly: [1],
    tests: [
      {
        input: "calcCube(4)",
        output: "",
        expected: "64",
        type: "expression",
      },
      {
        input: "calcCube(0)",
        output: "",
        expected: "0",
        type: "expression",
      },
      {
        input: "calcCube(-2)",
        output: "",
        expected: "-8",
        type: "expression",
      },
      {
        input: "typeof(calcCube)",
        output: "",
        expected: "function",
        type: "expression",
      },
      {
        input: "occurrences:=>",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },
    ]
  },
  {
    id: 61,
    name: "Up up and away!",
    description:
      "Create a function <code>isGrowing</code> that receives three numbers number and returns true if the numbers are in ascending order. Otherwise, the function should return false",
    type: "code",
    subtype: "skeleton",
    skeleton: `function isGrowing(num1, num2, num3) {
  if() {

  } else {

  }
}
`,
    code: `function isGrowing(num1, num2, num3) {
  if(num1 <= num2 && num2 <= num3) {
    return true;  
  } else {
    return false;
  }
}
`,
    readonly: [1],
    tests: [
      {
        input: "3 6 5",
        output: "",
        expected: "false",
        type: "function",
      },
      {
        input: "1 1 1",
        output: "",
        expected: "true",
        type: "function",
      },
      {
        input: "-5 -2 0",
        output: "",
        expected: "true",
        type: "function",
      },


    ]
  },
  {
    id: 62,
    name: "The smallest",
    description:
      "Create a function <code>getSmallest</code> that receives several numbers and returns the smallest number.",
    type: "code",
    subtype: "blank",
    skeleton: ``,
    code: `function getSmallest(...nums) {
  let small = +Infinity
  for(let num of nums) {
    if(num < small) {
      small = num
    }
  }
  return small
}  
`,
    readonly: [1],
    tests: [
      {
        input: "3 6 5",
        output: "",
        expected: "3",
        type: "function",
      },
      {
        input: "1 1 1 12 4",
        output: "",
        expected: "1",
        type: "function",
      },
      {
        input: "0",
        output: "",
        expected: "0",
        type: "function",
      },


    ]
  },
  {
    id: 63,
    name: "Count vogals",
    description:
      "Create a function <code>getNumberVogals</code> that receives a string and returns the number of vogals in it.",
    type: "code",
    subtype: "blank",
    skeleton: ``,
    code: `function getNumberVogals(str) {
  let sum = 0
  str = str.toLowerCase()
  for(let s of str) {
    if(s == 'a' || s == 'e' || s == 'i' || s == 'o' || s == 'u') {
      sum++
    }
  }
  return sum
}  
`,
    readonly: [1],
    tests: [
      {
        input: "getNumberVogals('ESMAD')",
        output: "",
        expected: "2",
        type: "expression",
      },
      {
        input: "getNumberVogals('I lOve PoRtugal!')",
        output: "",
        expected: "6",
        type: "expression",
      },
      {
        input: "getNumberVogals('grrrrrr')",
        output: "",
        expected: "0",
        type: "expression",
      },
      {
        input: "getNumberVogals('')",
        output: "",
        expected: "0",
        type: "expression",
      },
    ]
  },
  {
    id: 64,
    name: "Factorial",
    description:
      "Create a function <code>calcFactorial</code> that receives a number and returs its factorial.",
    type: "code",
    subtype: "blank",
    skeleton: ``,
    code: `function calcFactorial(number) {
  let sum = 1
  for(let i = 1; i <= number; i++) {
    sum = sum * i
  }
  return sum
}  
`,
    readonly: [1],
    tests: [
      {
        input: "calcFactorial(4)",
        output: "",
        expected: "24",
        type: "expression",
      },
      {
        input: "calcFactorial(0)",
        output: "",
        expected: "1",
        type: "expression",
      },
      {
        input: "calcFactorial(1)",
        output: "",
        expected: "1",
        type: "expression",
      },
      {
        input: "calcFactorial(6)",
        output: "",
        expected: "720",
        type: "expression",
      },
    ]
  },
  {
    id: 65,
    name: "The sum of the digits!",
    description:
      "Create a function <code>getDigitsSum</code> that receives a number and returs the sum of its digits.",
    type: "code",
    subtype: "blank",
    skeleton: ``,
    code: `function getDigitsSum(number) {
  let sum = 0
  while(number) {
    sum += number % 10
    number = Math.floor(number / 10)     
  }
  return sum
}  
`,
    readonly: [1],
    tests: [
      {
        input: "getDigitsSum(123)",
        output: "",
        expected: "6",
        type: "expression",
      },
      {
        input: "getDigitsSum(7)",
        output: "",
        expected: "7",
        type: "expression",
      },
      {
        input: "getDigitsSum(37437)",
        output: "",
        expected: "24",
        type: "expression",
      },
    ]
  },
  {
    id: 66,
    name: "Reverse",
    description:
      "Create a function <code>getNumberReverse</code> that receives a number and returs its reverse.",
    type: "code",
    subtype: "blank",
    skeleton: ``,
    code: `function getNumberReverse(number) {
  let str = ''
  while(number) {
    str += number % 10
    number = Math.floor(number / 10)     
  }
  return +str
}  
`,
    readonly: [1],
    tests: [
      {
        input: "getNumberReverse(43)",
        output: "",
        expected: "34",
        type: "expression",
      },
      {
        input: "getNumberReverse(7)",
        output: "",
        expected: "7",
        type: "expression",
      },
      {
        input: "getNumberReverse(2021)",
        output: "",
        expected: "1202",
        type: "expression",
      },
    ]
  },
  {
    id: 70,
    name: "Find and Log",
    description:
      "Using the method <code>getElementById</code> find and fill the text from paragraph <code>myP1</code> to paragraph <code>myP2</code>",
    type: "code",
    html: `<p id='myP1'>Hello World!</p><p id='myP2'></p>`,
    subtype: "blank",
    skeleton: ``,
    code: `
  const myP1 = document.getElementById('myP1').innerHTML;
  document.getElementById('myP2').innerHTML = myP1;
    `,
    readonly: [1],
    tests: [
      {
        input: "docFragment.getElementById('myP2').innerHTML",
        alias: "myP2",
        output: "",
        expected: "Hello World!",
        type: "expression",
      },
      {
        input: "occurrences:getElementById",
        output: "",
        expected: "2",
        type: "metric",
        subtype: "occurrences"
      },

    ]
  },
  {
    id: 71,
    name: "Count rows!",
    description:
      "Using the method <code>querySelectorAll</code> fill the paragraph <code>myP</code> with the number of rows of the table <code>myTable</code>",
    type: "code",
    html: "<table id='myTable'>\n<tr><td>John</td></tr>\n<tr><td>Mary</td></tr>\n<tr><td>Anne</td></tr>\n</table>\n<p id='myP'></p>",
    subtype: "blank",
    skeleton: ``,
    code: `
  const numberRows = document.querySelectorAll('tr').length;
  document.getElementById('myP').innerHTML = numberRows;
    `,
    readonly: [1],
    tests: [
      {
        input: "docFragment.getElementById('myP').innerHTML",
        alias: "myP",
        output: "",
        expected: "3",
        type: "expression",
      },
      {
        input: "occurrences:querySelectorAll",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },

    ]
  },
  {
    id: 72,
    name: "Change ESMAD link",
    description:
      "Change the ESMAD link to 'http://www.esmad.ipp.pt/'",
    type: "code",
    html: "<a href='http://www.isep.ipp.pt'>ISEP</a>\n<a href='http://www.esmad.pt'>Go to the site of ESMAD</a>\n<a href='http://www.iscap.ipp.pt'>ISCAP</a>",
    subtype: "blank",
    skeleton: ``,
    code: `
  const elemA = document.querySelector('a:nth-of-type(2)')
  elemA.href = "http://www.esmad.ipp.pt/";
    `,
    readonly: [1],
    tests: [
      {
        input: "docFragment.querySelector('a:nth-of-type(2)').href",
        alias: "a",
        output: "",
        expected: "http://www.esmad.ipp.pt/",
        type: "expression",
      }
    ]
  },
  {
    id: 73,
    name: "Paint Paint Paint",
    description:
      "Paint all the background of paragraphs of red for those that belong to the class <code>paint</code>.",
    type: "code",
    html: "<p class='paint'>Let's rock!</p>\n<p class='nopaint'>I'm too old for that!</p>\n<p class='paint'>I'm in!</p>\n<p class='paint'>Where will be?</p>\n<p class='nopaint'>I'm not interested!</p>",
    subtype: "blank",
    skeleton: ``,
    code: `
  const ps = document.querySelectorAll('p.paint')
  for(let p of ps) {
    p.style.backgroundColor = 'red'
  }
    `,
    readonly: [1],
    tests: [
      {
        input: "docFragment.querySelectorAll('p.paint')[0].style.backgroundColor",
        alias: "firstParagraph",
        output: "",
        expected: "red",
        type: "expression",
      },
      {
        input: "docFragment.querySelectorAll('p.paint')[1].style.backgroundColor",
        alias: "secondParagraph",
        output: "",
        expected: "red",
        type: "expression",
      },
      {
        input: "docFragment.querySelectorAll('p.paint')[2].style.backgroundColor",
        alias: "thirdParagraph",
        output: "",
        expected: "red",
        type: "expression",
      },
      {
        input: "occurrences:querySelectorAll",
        output: "",
        expected: "1",
        type: "metric",
        subtype: "occurrences"
      },


    ]
  },
  {
    id: 74,
    name: "Move text among paragraphs",
    description:
      "Include the text from the paragraph inside of the div element into the begining of the paragraph outside the div element.",
    type: "code",
    html: "<div>\n<p>Hello</p>\n</div>\n<p id='final'>World</p>",
    subtype: "blank",
    skeleton: ``,
    code: `
  const p1 = document.querySelector('div p')
  const p2 = document.querySelector('p#final')  
  p2.innerHTML = p1.innerHTML + ' ' + p2.innerHTML
  `,
    readonly: [1],
    tests: [
      {
        input: "docFragment.querySelector('p#final').innerHTML",
        alias: "secondParagraph",
        output: "",
        expected: "Hello World",
        type: "expression",
      },
      {
        input: "occurrences:querySelector",
        output: "",
        expected: "2",
        type: "metric",
        subtype: "occurrences"
      },
    ]
  },
  {
    id: 75,
    name: "Add a row",
    description:
      "Create a new row based on the predefined data.",
    type: "code",
    html: "<table id='myTable'>\n<tr><th>Name</th><th>Age</th></tr>\n<tr><td>John</td><td>23</td></tr>\n<tr><td>Mary</td><td>13</td></tr>\n<tr><td>Anne</td><td>45</td></tr>\n</table>",
    subtype: "skeleton",
    skeleton: `let newName = 'Alfred';\nlet newAge = 18`,
    code: "let newName = 'Alfred';\nlet newAge = 18;\ndocument.querySelector('table').innerHTML += `<tr><td>${newName}</td><td>${newAge}</td></tr>`",
    readonly: [1],
    tests: [
      {
        input: "docFragment.querySelectorAll('tr').length",
        alias: "countRows",
        output: "",
        expected: "5",
        type: "expression",
      }
    ]
  },
  {
    id: 76,
    name: "Put a border",
    description:
      "Set a border with 5px, solid and with color red, around elements with a <code>href</code> attribute containing the word 'ipp'",
    type: "code",
    html: "<a href='www.fc.up.pt'>FCUP</a>\n<a href='www.esmad.ipp.pt'>ESMAD</a>\n<a href='www.fe.up.pt'>FEUP</a>",
    subtype: "blank",
    skeleton: ``,
    code: `
  const as = document.querySelectorAll('[href*="ipp"]')
  for(let a of as) {
    a.style.border = "5px solid red"
  } 
    `,
    readonly: [1],
    tests: [
      {
        input: `docFragment.querySelectorAll('[href*="ipp"]')[0].style.border`,
        alias: "checkBorder",
        output: "",
        expected: "5px solid red",
        type: "expression",
      }
    ]
  },
  {
    id: 79,
    name: "Click and go!",
    description:
      "Create a click listener for a button that will show in the paragraph the text included in the input field.",
    type: "code",
    html: "<input type='text' value=''>\n<button>CLICK ME</button>\n<p></p>",
    subtype: "blank",
    skeleton: ``,
    code: `
  const p1 = document.querySelector('button').addEventListener('click', function () {
    const input = document.querySelector('input')  
    document.querySelector('p').innerHTML = input.value  
  })
  `,
    readonly: [1],
    tests: [
      {
        input: "docFragment.querySelector('input').value='ESMAD'; docFragment.querySelector('button').click(); docFragment.querySelector('p').innerHTML",
        alias: "write something in the input",
        output: "",
        expected: "ESMAD",
        type: "expression",
        options: { showExpected: false }
      }
    ]
  }
]