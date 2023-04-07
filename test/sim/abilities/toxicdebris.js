'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

// tests are derived from the following post and related quotes:
// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9417627
describe('Toxic Debris', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should only trigger on physical moves', function () {
		battle = common.createBattle([[
			{species: 'glimmora', ability: 'toxicdebris', moves: ['splash']},
		], [
			{species: 'hatterene', ability: 'magicguard', moves: ['dazzlinggleam']},
		]]);

		battle.makeChoices();
		assert.equal(!!(battle.p1.sideConditions.toxicspikes), false);
		assert.equal(!!(battle.p1.sideConditions.toxicspikes), false);
	});

	it(`should set up Toxic Spikes on the side of the opponent, not necessarily the target, in a double battle`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'glimmora', ability: 'toxicdebris', moves: ['splash']},
			{species: 'pikachu', moves: ['tackle']},
		], [
			{species: 'squirtle', moves: ['splash']},
			{species: 'bulbasaur', moves: ['splash']},
		]]);

		battle.makeChoices('move splash, move tackle -1', 'move splash, move splash');

		assert.equal(!!(battle.p1.sideConditions.toxicspikes), false);
		assert.equal(battle.p2.sideConditions.toxicspikes?.layers, 1);
	});

	it('should not have its Toxic Spikes bounced back by Magic Bounce', function () {
		battle = common.createBattle([[
			{species: 'glimmora', ability: 'toxicdebris', moves: ['splash']},
		], [
			{species: 'hatterene', ability: 'magicguard', moves: ['tackle']},
		]]);

		battle.makeChoices();
		assert.equal(!!(battle.p1.sideConditions.toxicspikes), false);
		assert.equal(battle.p2.sideConditions.toxicspikes?.layers, 1);
	});
});
