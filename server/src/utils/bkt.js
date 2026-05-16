const T = 0.10;
const G = 0.2;
const S = 0.25;

function updateBKT(oldMastery, isCorrect) {
  let posterior;

  if (isCorrect) {
    posterior =
      (oldMastery * (1 - S)) /
      (oldMastery * (1 - S) + (1 - oldMastery) * G);
  } else {
    posterior =
      (oldMastery * S) /
      (oldMastery * S + (1 - oldMastery) * (1 - G));
  }

  return posterior + (1 - posterior) * T;
}

module.exports = { updateBKT };