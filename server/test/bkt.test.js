const { expect } = require('chai');
const { updateBKT } = require('../src/utils/bkt');

describe('Smart Tutor BKT Logic', () => {

  it('should increase mastery on correct answer', () => {
    const result = updateBKT(0.25, true);
    expect(result).to.be.greaterThan(0.25);
  });

  it('should decrease mastery on incorrect answer', () => {
    const result = updateBKT(0.8, false);
    expect(result).to.be.lessThan(0.8);
  });

  it('should always return a value between 0 and 1', () => {
    const values = [0.01, 0.25, 0.5, 0.9];

    values.forEach(v => {
      expect(updateBKT(v, true)).to.be.within(0, 1);
      expect(updateBKT(v, false)).to.be.within(0, 1);
    });
  });

  it('should match expected known calculation', () => {
    const result = updateBKT(0.25, true);

    expect(result).to.be.closeTo(0.6, 0.01);
  });

  it('should converge toward 1 with repeated correct answers', () => {
    let mastery = 0.25;

    for (let i = 0; i < 20; i++) {
      mastery = updateBKT(mastery, true);
    }

    expect(mastery).to.be.greaterThan(0.95);
  });

  it('should decrease mastery with repeated incorrect answers', () => {
    let mastery = 0.9;

    for (let i = 0; i < 10; i++) {
        mastery = updateBKT(mastery, false);
    }

    expect(mastery).to.be.lessThan(0.5);
  });

  it('should be monotonically increasing with correct answers', () => {
    let mastery = 0.2;

    for (let i = 0; i < 15; i++) {
        const newMastery = updateBKT(mastery, true);
        expect(newMastery).to.be.greaterThan(mastery);
        mastery = newMastery;
    }
  });

  it('should always stay between 0 and 1 over long sequences', () => {
    let mastery = 0.5;

    for (let i = 0; i < 100; i++) {
        const isCorrect = Math.random() > 0.5;
        mastery = updateBKT(mastery, isCorrect);

        expect(mastery).to.be.at.least(0);
        expect(mastery).to.be.at.most(1);
    }
  });
});