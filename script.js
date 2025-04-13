document.addEventListener("DOMContentLoaded", function () {
  const analyzeButton = document.getElementById("analyzeButton");
  const clearButton = document.getElementById("clearButton");
  const textInput = document.getElementById("textInput");
  const givenSentence = document.getElementById("givenSentence");
  const predictedEmoji = document.getElementById("predictedEmoji");
  const sentimentAccuracy = document.getElementById("sentimentAccuracy");
  const feedbackDiv = document.getElementById("feedback");

  const lexicon = {
    // Positive
    "happy": 0.8,
    "love": 0.9,
    "excited": 0.7,
    "good": 0.6,
    "great": 0.8,
    "best": 1.0,
    "okay": 0.2,
    "amazing": 1.0,
    "wonderful": 1.0,
    "very happy": 1.0,

    // Neutral
    "neutral": 0.0,
    "fine": 0.1,

    // Negative
    "sad": -0.7,
    "disappointed": -0.6,
    "angry": -0.8,
    "bad": -0.5,
    "terrible": -0.9,
    "worst": -1.0,
    "failed": -0.8,
    "furious": -0.9,
    "cut": -0.5,
    "traffic": -0.8,
    "cut me": -0.8,
    "cut me off": -0.5,
    "hate": -1,
    "not happy": -0.8,
    "not good": -0.7,
    "not great": -0.6,
  };

  function getEmoji(sentimentScore) {
    if (sentimentScore >= 0.7) {
      return "\uD83D\uDE00"; // 😀
    } else if (sentimentScore > 0.2) {
      return "\uD83D\uDE42"; // 🙂
    } else if (sentimentScore >= -0.2 && sentimentScore <= 0.2) {
      return "\uD83D\uDE10"; // 😐
    } else if (sentimentScore <= -0.7) {
      return "\uD83D\uDE20"; // 😠
    } else if (sentimentScore < -0.2) {
      return "\uD83D\uDE41"; // 🙁
    }
  }

  function preprocessText(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, "");
  }

  function analyzeSentiment(text) {
    text = preprocessText(text);
    const words = text.split(/\s+/);
    let sentimentScore = 0;
    let matchedWords = 0;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      let score = 0;

      const bigram = i > 0 ? words[i - 1] + " " + word : "";

      if (lexicon[bigram]) {
        score = lexicon[bigram];
        matchedWords++;
      } else if (lexicon[word]) {
        score = lexicon[word];
        matchedWords++;
      }

      // Negation
      if (i > 0 && (words[i - 1] === "not" || words[i - 1] === "no")) {
        score *= -1;
      }

      // Intensifiers
      if (i > 0 && ["very", "really", "extremely"].includes(words[i - 1])) {
        score *= 1.5;
      }

      sentimentScore += score;
    }

    if (matchedWords > 0) {
      sentimentScore /= matchedWords;
    }

    return sentimentScore;
  }

  function getConfidenceLabel(score) {
    const abs = Math.abs(score);
    if (abs >= 0.7) return "Strong";
    if (abs >= 0.4) return "Moderate";
    return "Weak";
  }

  analyzeButton.addEventListener("click", function () {
    const inputText = textInput.value.trim();
    if (!inputText) return;

    givenSentence.textContent = inputText;

    const sentimentScore = analyzeSentiment(inputText);
    const emoji = getEmoji(sentimentScore);
    predictedEmoji.textContent = emoji;

    // Sentiment Accuracy = Confidence Score = |Sentiment Score|
    const confidenceScore = Math.abs(sentimentScore).toFixed(2);
    const confidenceLabel = getConfidenceLabel(sentimentScore);
    sentimentAccuracy.textContent = `${confidenceScore} (${confidenceLabel})`;
  });

  clearButton.addEventListener("click", function () {
    textInput.value = "";
    givenSentence.textContent = "";
    predictedEmoji.textContent = "";
    sentimentAccuracy.textContent = "";
    feedbackDiv.innerHTML = "";
  });
});
