const questions = [
  "楽しいはずのことが、ただの予定に見える日がありましたか？",
  "気分が沈む、落ちこむ、先のことを考えるのが重い感じがありましたか？",
  "眠れない、途中で起きる、または眠りすぎてしまうことがありましたか？",
  "体は止まっているのに、頭だけ疲れている感じがありましたか？",
  "食べられない、または味より量で埋めてしまうことがありましたか？",
  "自分を責める、普通にできない自分が嫌になることがありましたか？",
  "文章や動画が頭に入らない、同じ所を何度も見返すことがありましたか？",
  "動きが遅くなる、または落ち着かず画面ばかり触ることがありましたか？",
  "消えてしまいたい、自分を傷つけたいと思うことがありましたか？"
];

const options = [
  { label: "まったくない", detail: "0点", value: 0 },
  { label: "数日あった", detail: "1点", value: 1 },
  { label: "半分以上の日にあった", detail: "2点", value: 2 },
  { label: "ほとんど毎日あった", detail: "3点", value: 3 }
];

const ranges = [
  {
    max: 4,
    title: "今は大きく崩れてはいなさそうです",
    copy: "スコア上は軽めの範囲です。ただ、低い点数でも本人にはしんどい日があります。眠り方、返信の重さ、予定を避ける感じが続くなら、早めにメモしておくと後で助けになります。"
  },
  {
    max: 9,
    title: "少しずつ削られている感じがあります",
    copy: "軽い抑うつ症状の目安です。まだ動けるから大丈夫、と押し切りやすい範囲でもあります。返信、食事、風呂、外出のどれかが妙に重いなら、生活の負荷を一段下げる合図かもしれません。"
  },
  {
    max: 14,
    title: "ひとりで説明し続けるには重いです",
    copy: "中くらいの抑うつ症状の目安です。仕事や学校では普通に見えても、帰宅後に何も残らないことがあります。2週間以上続く、生活に支障がある、つらさが増している場合は、相談先につながる価値があります。"
  },
  {
    max: 19,
    title: "早めに外の手を入れたい状態です",
    copy: "やや強い抑うつ症状の目安です。気合いで戻すより、予定を減らす、誰かに状況を共有する、医師やカウンセラーに連絡するほうが現実的です。できれば近日中に相談の予定を作ってください。"
  },
  {
    max: 27,
    title: "今は耐える設計を変えたい状態です",
    copy: "強い抑うつ症状の目安です。ひとりで抱えたまま明日を迎えるより、今日中に誰かへ連絡し、医療機関や相談窓口につながることを優先してください。"
  }
];

let current = 0;
let answers = [];

const startScreen = document.querySelector("#start-screen");
const quizScreen = document.querySelector("#quiz-screen");
const resultScreen = document.querySelector("#result-screen");
const questionText = document.querySelector("#question-text");
const answersEl = document.querySelector("#answers");
const progressBar = document.querySelector("#progress-bar");
const progressLabel = document.querySelector("#progress-label");
const backButton = document.querySelector("#back-button");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");
const scoreValue = document.querySelector("#score-value");
const careBox = document.querySelector("#care-box");
const copyButton = document.querySelector("#copy-button");

document.querySelector("#start-button").addEventListener("click", startQuiz);
document.querySelector("#restart-button").addEventListener("click", resetQuiz);
backButton.addEventListener("click", goBack);
copyButton.addEventListener("click", copyResult);

function startQuiz() {
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  questionText.textContent = questions[current];
  progressLabel.textContent = `${current + 1} / ${questions.length}`;
  progressBar.style.width = `${((current + 1) / questions.length) * 100}%`;
  backButton.disabled = current === 0;
  backButton.style.opacity = current === 0 ? "0.45" : "1";

  answersEl.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.type = "button";
    button.innerHTML = `<span><strong>${option.label}</strong><br><span>${option.detail}</span></span>`;
    button.addEventListener("click", () => chooseAnswer(option.value));
    answersEl.append(button);
  });
}

function chooseAnswer(value) {
  answers[current] = value;

  if (current < questions.length - 1) {
    current += 1;
    renderQuestion();
    return;
  }

  showResult();
}

function goBack() {
  if (current === 0) return;
  current -= 1;
  renderQuestion();
}

function showResult() {
  const score = answers.reduce((total, value) => total + value, 0);
  const range = ranges.find((item) => score <= item.max);
  const selfHarmAnswer = answers[8] ?? 0;

  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  resultTitle.textContent = range.title;
  resultCopy.textContent = range.copy;
  scoreValue.textContent = String(score);

  const urgent = selfHarmAnswer > 0;
  careBox.innerHTML = urgent
    ? `<strong>自分を傷つけたい気持ちが少しでもある場合</strong>
       <span>今この瞬間の安全を優先してください。ひとりでいないで、身近な人、地域の救急窓口、119、110、または相談窓口へ連絡してください。日本国外にいる場合は、その地域の緊急番号や危機支援窓口を使ってください。</span>`
    : `<strong>次の一歩</strong>
       <span>この結果だけで決めつけなくて大丈夫です。ただ、眠り、食事、返信、外出、集中のどれが崩れているかを一言で残すと、相談するときに「何がつらいのか」を渡しやすくなります。</span>`;
}

function resetQuiz() {
  current = 0;
  answers = [];
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

async function copyResult() {
  const score = answers.reduce((total, value) => total + value, 0);
  const text = `こころ観測室の結果: ${score}/27点\n${resultTitle.textContent}\n${resultCopy.textContent}`;

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }
    copyButton.textContent = "コピーしました";
    setTimeout(() => {
      copyButton.textContent = "結果をコピー";
    }, 1600);
  } catch {
    const copied = fallbackCopy(text);
    copyButton.textContent = copied ? "コピーしました" : "コピーできませんでした";
    setTimeout(() => {
      copyButton.textContent = "結果をコピー";
    }, 1600);
  }
}

function fallbackCopy(text) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  return copied;
}
