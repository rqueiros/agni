export const quizzes = [
  {
    id: 1,
    name: "Variables",
    description: "All about variables...",
    questions: [
      {
        id: 1,
        question: "Whick keyword use to define a block scope variable?",
        image: "",
        answers: ["let", "var", "dim", "set"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question:
          "Declaring a variable without assigning any value gives the variable the value of?",
        image: "",
        answers: ["null", "NaN", "''", "undefined"],
        correctAnswer: 4,
      },
      {
        id: 3,
        question: "Which is the keyword to declare constants?",
        image: "",
        answers: ["constant", "var", "const", "let"],
        correctAnswer: 3,
      },
      {
        id: 4,
        question:
          "Which operator we should use to perform an assignment of a variable?",
        image: "",
        answers: ["====", "===", "=", "=="],
        correctAnswer: 3,
      },
      {
        id: 5,
        question:
          "What is the best name to store the name of a user?",
        image: "",
        answers: ["username", "userName", "name", "nameOfTheUser"],
        correctAnswer: 2,
      },
      {
        id: 6,
        question:
          `What value will be printed on the console?<br><br>
              <samp>
                let name = 'Richard'<br>
                name = 3<br>
                console.log(name)
              </samp>
            `,
        image: "",
        answers: ["Richard", "Richard3", "3", "undefined"],
        correctAnswer: 3,
      },
      {
        id: 7,
        question:
          `What is the only statement correct?<br><br>
              <samp>
                let name = 'Richard'<br>
                let my-name = 'John'<br>
                let 1person = 'Charles'<br>
                let while = 1
              </samp>
            `,
        image: "",
        answers: ["First", "Second", "Third", "Fourth"],
        correctAnswer: 1,
      },
      {
        id: 8,
        question:
          `What type of error occurs with these statements?<br><br>
              <samp>
                {<br>
                &nbsp;&nbsp;let school = 'ESEIG'<br>
                &nbsp;&nbsp;let school = 'ESMAD'<br>
                }
              </samp>
            `,
        image: "",
        answers: ["No error", "Identifier 'school' has already been declared", "Assignments require '=='", "Duplication of names for the same variable"],
        correctAnswer: 2,
      },
      {
        id: 9,
        question:
          `Which variable doesn't follow camelCase naming convention?`,
        image: "",
        answers: ["name", "schoolName", "SchoolDepartmentName", "schoolDepartmentFirstName"],
        correctAnswer: 3,
      },
      {
        id: 10,
        question:
          `What will be the output of this code?<br><br>
            <samp>
              let x = 2<br>
              {<br>
              &nbsp;&nbsp;let x = 3<br>
              }<br>
              console.log(x)
            </samp>
            `,
        image: "",
        answers: ["2", "3", "23", "error"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Data types",
    description: "Quiz on Data Types",
    questions: [
      {
        id: 1,
        question: `What is the output of the following script?<br><br>
            <samp>
            &nbsp;&nbsp;let name = 'Ilya';<br>
            &nbsp;&nbsp;console.log(\`hello \${'name'}\`); 
            </samp>  
          `,
        image: "",
        answers: ["hello name", "hello Ilya", "hello", "error"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question:
          `What is the result of this expression?<br><br>
            <samp>
            &nbsp;&nbsp;console.log('' + 1 + 0) 
            </samp>
            `,
        image: "",
        answers: ["010", "1", "0", "10"],
        correctAnswer: 4,
      },
      {
        id: 3,
        question:
          `What is the result of this expression?<br><br>
            <samp>
            &nbsp;&nbsp;console.log('' - 1 + 0) 
            </samp>
            `,
        image: "",
        answers: ["-10", "-1", "-0", "-Infinity"],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: `What is the result of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log(true + false) 
          </samp>
          `,
        image: "",
        answers: ["true", "false", "0", "1"],
        correctAnswer: 4,
      },
      {
        id: 5,
        question:
          `What is the result of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log(6 / "3") 
          </samp>
          `,
        image: "",
        answers: ["2", "NaN", "63", "error"],
        correctAnswer: 1,
      },
      {
        id: 6,
        question:
          `What is the result of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log(" -9  " + 5) 
          </samp>
          `,
        image: "",
        answers: ["-4", " -9  5", "-95", "14"],
        correctAnswer: 2,
      },
      {
        id: 7,
        question:
          `What is the result of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log(" -9  " - 5) 
          </samp>
          `,
        image: "",
        answers: ["14", "4", "-14", " -9  -5"],
        correctAnswer: 3,
      },
      {
        id: 8,
        question:
          `What is the result of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log(null + 1) 
          </samp>
          `,
        image: "",
        answers: ["null1", "NaN", "1", "null"],
        correctAnswer: 3,
      },
      {
        id: 9,
        question:
          `What is the result of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log(undefined + 1) 
          </samp>
          `,
        image: "",
        answers: ["undefined1", "NaN", "1", "undefined"],
        correctAnswer: 2,
      },
      {
        id: 10,
        question:
          `What is the result of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log(4 + 5 + "px") 
          </samp>
          `,
        image: "",
        answers: ["45px", "NaN", "9px", "error"],
        correctAnswer: 3,
      }
    ],
  },
  {
    id: 3,
    name: "Operators",
    description: "Quiz on Operators",
    questions: [
      {
        id: 1,
        question: `What will be the value of variable res?<br><br>
            <samp>
            &nbsp;&nbsp;let res = '2' === 2 
            </samp>  
          `,
        image: "",
        answers: ["false", "true", "4", "error"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: `What is the result of this expression?<br><br>
            <samp>
            &nbsp;&nbsp;console.log(2 + 3 * 4 / 6) 
            </samp>
            `,
        image: "",
        answers: ["3.33", "2.33", "4", "NaN"],
        correctAnswer: 3,
      },
      {
        id: 3,
        question: `What is the final value of variable a?<br><br>
            <samp>
            &nbsp;&nbsp;let a = 3<br>
            &nbsp;&nbsp;let b = 5<br>
            &nbsp;&nbsp;a += b<br>
            &nbsp;&nbsp;a *= 2 
            </samp>
            `,
        image: "",
        answers: ["10", "8", "64", "16"],
        correctAnswer: 4,
      },
      {
        id: 4,
        question: `What is the final value of variable a?<br><br>
          <samp>
          &nbsp;&nbsp;let a = +'2a'<br>
          &nbsp;&nbsp;a += 1<br>           
          </samp>
          `,
        image: "",
        answers: ["NaN", "undefined", "2a1", "1a"],
        correctAnswer: 4,
      },
      {
        id: 5,
        question: `What are the values of a and x after the code below?<br><br>
          <samp>
          &nbsp;&nbsp;let a = 2;<br>
          &nbsp;&nbsp;let x = 1 + (a *= 2)
          </samp>
          `,
        image: "",
        answers: ["a=4 and x=5", "a=2 and x=3", "a=2 and c=5", "error"],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: `What are the final values of variables a, b, c and c after the code below?<br><br>
          <samp>
          &nbsp;&nbsp;let a = 1, b = 1;<br>
          &nbsp;&nbsp;let c = ++a;<br>
          &nbsp;&nbsp;let d = b++;            
          </samp>
          `,
        image: "",
        answers: ["a=1 and b=1 and c=2 and d=2", "a=1 and b=2 and c=2 and d=1", "a=2 and b=2 and c=2 and d=1", "a=2 and b=2 and c=1 and d=2"],
        correctAnswer: 3,
      },
      {
        id: 7,
        question: `What is the output of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log("ESMAD" > "ESEIG") 
          </samp>
          `,
        image: "",
        answers: ["false", "true", "1", "0"],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: `What is the output of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log(null || 0) 
          </samp>
          `,
        image: "",
        answers: ["null", "0", "true", "false"],
        correctAnswer: 2,
      },
      {
        id: 9,
        question: `What is the output of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log("esmad" && "eseig") 
          </samp>
          `,
        image: "",
        answers: ["esmad", "esmadeseig", "eseig", "true"],
        correctAnswer: 3,
      },
      {
        id: 10,
        question: `What is the output of this expression?<br><br>
          <samp>
          &nbsp;&nbsp;console.log(!!"js") 
          </samp>
          `,
        image: "",
        answers: ["false", "true", "!!js", "error"],
        correctAnswer: 2,
      }
    ],
  },
  {
    id: 4,
    name: "Conditionals",
    description: "Quiz on Conditionals",
    questions: [
      {
        id: 1,
        question: `Will the log be shown in the console?<br><br>
            <samp>
            if ("0") {<br>
            &nbsp;&nbsp;console.log('Hello');<br>
            }             
            </samp>  
          `,
        image: "",
        answers: ["Yes", "No", "Error", "Sometimes"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: `What will be the value of x?<br><br>
            <samp>
            let x = null || 2 || undefined 
            </samp>
            `,
        image: "",
        answers: ["null", "2", "undefined", "null2undefined"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: `What will be the value of y?<br><br>
            <samp>
            let y = undefined || null 
            </samp>
            `,
        image: "",
        answers: ["undefined", "null", "undefinednull", "false"],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: `What will be the value of z?<br><br>
          <samp>
          let z = 33 && true && false && "ESMAD"           
          </samp>
          `,
        image: "",
        answers: ["33", "true", "false", "ESMAD"],
        correctAnswer: 3,
      },
      {
        id: 5,
        question: `The variable b will store what value?<br><br>
          <samp>
          let a = 2;<br>
          let b = typeof(a) == 'number' ? a += 2: a-=2
          </samp>
          `,
        image: "",
        answers: ["-2", "0", "2", "4"],
        correctAnswer: 4,
      },
      {
        id: 6,
        question: `What will be the value of fullName?<br><br>
          <samp>
          let name = '';<br>
          let fullName = name || 'John'          
          </samp>
          `,
        image: "",
        answers: ["nameJohn", "name", "John", "''"],
        correctAnswer: 3,
      },
      {
        id: 7,
        question: `For what value of <code>a</code> do you get the print in the console?<br><br>
          <samp>
          if(a < 10 && (a > 8 && a < 15)) {<br>
          &nbsp;&nbsp;console.log('YES')<br>
          } 
          </samp>
          `,
        image: "",
        answers: ["11", "15", "7", "9"],
        correctAnswer: 4,
      },
      {
        id: 8,
        question: `If <code>b=9</code> do you get the print in the console?<br><br>
          <samp>
          if(b > 10 || (b > 8 && b < 10)) {<br>
          &nbsp;&nbsp;console.log('YES')<br>
          } 
          </samp>
          `,
        image: "",
        answers: ["Yes", "No", "error", "warning"],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: `What is the output of this expression?<br><br>
          <samp>
          console.log("esmad" > "eseig") 
          </samp>
          `,
        image: "",
        answers: ["error", "true", "false", "0"],
        correctAnswer: 2,
      },
      {
        id: 10,
        question: `What is the output of this expression?<br><br>
          <samp>
          console.log(undefined == null) 
          </samp>
          `,
        image: "",
        answers: ["false", "true", "warning", "error"],
        correctAnswer: 2,
      }
    ],
  },
  {
    id: 5,
    name: "Loops",
    description: "Quiz on Loops",
    questions: [
      {
        id: 1,
        question: `What are the logs of this code?<br><br>
            <samp>
            let i = 3;<br>
            while (i) {<br>
            &nbsp;&nbsp;console.log(i--);<br>
            }            
            </samp>  
          `,
        image: "",
        answers: ["3 2 1", "2 1 0", "2 1", "Infinite Cycle"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: `What are the logs of this code?<br><br>
            <samp>
            let i = 0;<br>
            while (++i < 5) console.log( i ); 
            </samp>
            `,
        image: "",
        answers: ["0 1 2 3 4", "1 2 3 4 5", "0 1 2 3 4 5", "1 2 3 4"],
        correctAnswer: 4,
      },
      {
        id: 3,
        question: `What will be the log of this code?<br><br>
            <samp>
            for(i = 0; i < 1; i++) {<br>
            &nbsp;&nbsp;console.log(i)<br>
            } 
            </samp>
            `,
        image: "",
        answers: ["0", "0 1", "1", "Error: i is not defined"],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: `What will be the log of this code?<br><br>
          <samp>
          let i = j = 1;<br>
          do {<br>
          &nbsp;&nbsp;console.log(i*j)<br>
          &nbsp;&nbsp;j++<br>
          } while (i < 3)           
          </samp>
          `,
        image: "",
        answers: ["1 4 9", "1 4", "Infinite cycle", "1"],
        correctAnswer: 3,
      },
      {
        id: 5,
        question: `The variable sum will be logged with what value?<br><br>
          <samp>
          let sum = 0<br>
          for(let i = 0; i < 5; i++) {<br>
          &nbsp;&nbsp;sum = i<br>
          }<br>
          console.log(sum)
          </samp>
          `,
        image: "",
        answers: ["0", "4", "5", "Error: sum not declared"],
        correctAnswer: 2,
      },
      {
        id: 6,
        question: `The variable sum will be logged with what value?<br><br>
          <samp>
          let sum = ''<br>
          for(let i = 'a'; i < 'z'; i++) {<br>
          &nbsp;&nbsp;sum += i<br>
          }<br>
          console.log(sum)          
          </samp>
          `,
        image: "",
        answers: ["abc...z", "34", "a", "''"],
        correctAnswer: 3,
      },
      {
        id: 7,
        question: `What values will be printed in the console?<br><br>
          <samp>
          for (let i = 0; i < 10; i++) {<br>
          &nbsp;&nbsp;if (i % 2 == 0) continue;<br>
          &nbsp;&nbsp;console.log(i); <br>
          }
          </samp>
          `,
        image: "",
        answers: ["1 3 5 7 9", "0 2 4 6 8", "0 1 2 3 4 5 6 7 8 9", "0"],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: `What will be printed in the console?<br><br>
          <samp>
          while(!true) { console.log('ESMAD') }
          </samp>
          `,
        image: "",
        answers: ["Infinite Cycle", "ESMAD", "''", "Error"],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: `What is the output of this code?<br><br>
          <samp>
          let j = 0<br>
          do {<br>
          &nbsp;&nbsp;j += 1;<br>
          &nbsp;&nbsp;console.log(j);<br>
          } while (j < 5); 
          </samp>
          `,
        image: "",
        answers: ["0 1 2 3 4", "1 2 3 4", "1 2 3 4 5", "0 1 2 3 4 5"],
        correctAnswer: 3,
      },
      {
        id: 10,
        question: `What is the output of this code?<br><br>
          <samp>
          for(let i = 0; i < 3; i++) {<br>
          &nbsp;&nbsp;for(let j = 0; j < 3; j++) {<br>
          &nbsp;&nbsp;&nbsp;&nbsp;console.log (i * j)<br>
          &nbsp;&nbsp;}<br>
          } 
          </samp>
          `,
        image: "",
        answers: ["1 2 3 4 5 6 7 8 9", "0 0 0 2 2 2 4 4 4", "0 0 0 1 1 1 2 2 2", "0 0 0 0 1 2 0 2 4"],
        correctAnswer: 4,
      }
    ],
  }

];
