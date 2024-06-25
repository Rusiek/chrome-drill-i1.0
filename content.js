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
      if (s.charAt(i - 1) === t.charAt(j - 1)) {
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

  const questionElements = document.querySelectorAll('.qtext');

  questionElements.forEach((questionElement, questionIndex) => {
    const questionText = questionElement.innerText.trim();

    console.log("Pytanie ze strony:", questionText);

    let closestQuestion = null;
    let minDistance = Infinity;

    questionAnswerMap.forEach((value, key) => {
      const distance = ai(questionText.toLowerCase(), value.Q.toLowerCase());
      if (distance < minDistance) {
        minDistance = distance;
        closestQuestion = value;
      }
    });

    console.log("Najbardziej pasujące pytanie z JSON:", closestQuestion.Q);
    console.log("Odpowiedzi z JSON:", closestQuestion.A);

    if (minDistance > 10) {
      console.error("Nie udało się znaleźć odpowiedzi na pytanie:", questionText);
      return;
    }

    const answerElements = questionElement.parentElement.querySelectorAll('.answer .d-flex.w-auto');
    answerElements.forEach((answerElement, answerIndex) => {
      let answerText = answerElement.innerText.trim();
      let minAnswerDistance = Infinity;
      let closestAnswerSign = '';

      for (let answerKey in closestQuestion.A) {
        if (closestQuestion.A.hasOwnProperty(answerKey)) {
          const answerData = closestQuestion.A[answerKey];
          if (answerData && answerData.length > 1) {
            const distance = ai(answerText.toLowerCase(), answerData[1].toLowerCase());
            if (distance < minAnswerDistance) {
              minAnswerDistance = distance;
              closestAnswerSign = answerData[0];
            }
          } else {
            console.error(`Invalid answer data format for key ${answerKey}:`, answerData);
          }
        }
      }

      console.log("Odpowiedź ze strony:", answerText);
      console.log("Najbliższa odpowiedź z JSON:", closestAnswerSign);
      console.log("Odległość:", minAnswerDistance);

      // Opóźnienie 3 sekundy dla każdego checkboxa
      const checkbox = answerElement.closest('.r0, .r1').querySelector('input[type="checkbox"]');
      if (checkbox) {
        setTimeout(() => {
          if (minAnswerDistance < 10 && closestAnswerSign === '+') {
            checkbox.checked = true;
          }
        }, (questionIndex * answerElements.length + answerIndex + 1) * 3000); // Opóźnienie 3 sekundy dla każdego checkboxa
      }
    });
  });
}

const jsonUrl = chrome.runtime.getURL("output.json");

fetch(jsonUrl)
  .then((response) => response.json())
  .then((data) => {
    fillForms(data);
  })
  .catch((error) => console.error("Error fetching data:", error));
