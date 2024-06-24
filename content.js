function ai(s, t) {
  const d = [];
  const n = s.length;
  const m = t.length;

  if (n === 0) return m;
  if (m === 0) return n;

  for (let i = 0; i <= n; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (let j = 0; j <= m; j++) {
    d[0][j] = j;
  }

  for (let j = 1; j <= m; j++) {
    for (let i = 1; i <= n; i++) {
      if (s.charAt(i - 1) == t.charAt(j - 1)) {
        d[i][j] = d[i - 1][j - 1];
      } else {
        d[i][j] = Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]) + 1;
      }
    }
  }

  return d[n][m];
}

function fillForms(data) {
  const questionAnswerMap = new Map(Object.entries(data));
  console.log("Wypełnianie formularza...");

  const answers = document.querySelectorAll('[class="answer"]');

  console.log(answers);

  answers.forEach((question) => {
    const answerBox = question.querySelector('[dir="ltr"]');

    console.log(answerBox);

    // if (title) {
    //   const distance = Array.from(questionAnswerMap.keys()).map((answer) =>
    //     ai(title.innerText.toLowerCase(), answer)
    //   );
    //   const minDistance = Math.min(...distance);
    //   const closestAnswer = Array.from(questionAnswerMap.keys())[
    //     distance.indexOf(minDistance)
    //   ];

    //   const inputField = question.querySelector(
    //     'input[aria-label="Single line text"]'
    //   );
    //   if (inputField) {
    //     console.log(
    //       `Pytanie na tekst: ${
    //         title.innerText
    //       } z odpowiedzią: ${questionAnswerMap.get(closestAnswer)}`
    //     );
    //     inputField.value = questionAnswerMap.get(closestAnswer);
    //     inputField.dispatchEvent(new Event("input", { bubbles: true }));
    //     inputField.dispatchEvent(new Event("change", { bubbles: true }));
    //   } else {
    //     const choiceItems = question.querySelectorAll(
    //       '[data-automation-id="choiceItem"]'
    //     );
    //     if (choiceItems.length > 0) {
    //       console.log(
    //         `Pytanie z wyborem: ${title.innerText} z ${choiceItems.length} opcjami`
    //       );
    //       const answer = questionAnswerMap.get(closestAnswer);
    //       const choiceItem = Array.from(choiceItems).find((choiceItem) =>
    //         choiceItem.innerText.toLowerCase().includes(answer.toLowerCase())
    //       );
    //       console.log(
    //         `Wybieranie odpowiedzi: ${answer} z ${Array.from(choiceItems)
    //           .map((choiceItem) => choiceItem.innerText)
    //           .join(", ")}`
    //       );
    //       console.log(choiceItem);
    //       if (choiceItem) {
    //         const field = choiceItem.querySelector('input[type="radio"]');
    //         field.click();
    //       } else {
    //         console.log(`Nie znaleziono odpowiedzi: ${answer}`);
    //       }
    //     } else {
    //       console.log(
    //         `Pytanie bez rozpoznanej formy odpowiedzi: ${title.innerText}`
    //       );
    //     }
    //   }
    //}
  });
}

fetch(chrome.runtime.getURL("data.json"))
  .then((response) => response.json())
  .then((data) => {
    fillForms(data);
  })
  .catch((error) => console.error("Error fetching data:", error));
