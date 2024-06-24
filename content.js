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

  // Znajdź wszystkie elementy z klasą "qtext"
  const questionElements = document.querySelectorAll('.qtext');

  questionElements.forEach((questionElement) => {
    // Wyciągnij treść pytania z elementu
    const questionText = questionElement.innerText.trim();

    // Wyświetl treść pytania w konsoli
    console.log("Pytanie ze strony:", questionText);

    // Porównaj pytanie ze strony z pytaniami z JSON'a
    let closestQuestion = null;
    let minDistance = Infinity;

    questionAnswerMap.forEach((value, key) => {
      const distance = ai(questionText.toLowerCase(), value.Q.toLowerCase());
      if (distance < minDistance) {
        minDistance = distance;
        closestQuestion = value;
      }
    });

    // Wyświetl najbliższe pytanie i odpowiedzi z JSON'a
    console.log("Najbardziej pasujące pytanie z JSON:", closestQuestion.Q);
    console.log("Odpowiedzi z JSON:", closestQuestion.A);

    // Sprawdź odpowiedzi
    const answerElements = questionElement.parentElement.querySelectorAll('.answer .d-flex.w-auto');
    answerElements.forEach((answerElement) => {
      const answerText = answerElement.innerText.trim();
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

      // Jeśli odległość jest mniejsza niż 40, zmień kolor odpowiedzi
      if (minAnswerDistance < 7) {
        if (closestAnswerSign === '+') {
          answerElement.style.color = 'green';
        } else if (closestAnswerSign === '-') {
          answerElement.style.color = 'red';
        }
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
