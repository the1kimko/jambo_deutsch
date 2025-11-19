import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonModules } from '../src/data/lessons.js';
import { flashcardSeed } from '../src/data/flashcards.js';
import { activitySeed } from '../src/data/activities.js';
import { partnerSeed } from '../src/data/partners.js';
import { MODULES } from '../src/utils/constants.js';

test('lesson modules cover every configured module', () => {
  const lessonIds = new Set(lessonModules.map((lesson) => lesson.moduleId));
  MODULES.forEach((moduleId) => {
    assert.ok(
      lessonIds.has(moduleId),
      `Missing lesson entry for module ${moduleId}`
    );
  });
});

test('flashcards align with known modules', () => {
  flashcardSeed.forEach((card) => {
    assert.ok(
      MODULES.includes(card.moduleId),
      `Flashcard module ${card.moduleId} is unknown`
    );
  });
});

test('activities cover at least three modules', () => {
  const modules = new Set(activitySeed.map((activity) => activity.module));
  assert.ok(modules.size >= 3, 'Activities should cover multiple modules');
});

test('partner seed has diverse entries', () => {
  assert.ok(partnerSeed.length >= 3, 'Seed at least three partners');
  partnerSeed.forEach((partner) => {
    assert.ok(partner.name, 'Partner requires name');
    assert.ok(partner.location, 'Partner requires location');
  });
});
