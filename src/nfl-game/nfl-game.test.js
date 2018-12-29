import _ from 'lodash';

import ApiModel from '../api-model/api-model.js';
import NFLTeam from '../nfl-team/nfl-team.js';

import NFLGame from './nfl-game.js';

import { localObject, serverResponse } from './nfl-game.stubs.js';

describe('NFLGame', () => {
  let nflGame;

  beforeEach(() => {
    nflGame = new NFLGame();
  });

  afterEach(() => {
    nflGame = null;
  });

  test('extends ApiModel', () => {
    expect(nflGame).toBeInstanceOf(ApiModel);
  });

  describe('attribute population from server response', () => {
    beforeEach(() => {
      nflGame = NFLGame.buildFromServer(serverResponse);
    });

    test('parses data correctly', () => {
      expect(nflGame).toMatchSnapshot();
    });
  });

  describe('attribute population from local object', () => {
    beforeEach(() => {
      nflGame = NFLGame.buildFromLocal(localObject);
    });

    test('parses data correctly', () => {
      expect(nflGame).toMatchSnapshot();
    });
  });

  describe('responseMap', () => {
    describe('gameStatus', () => {
      describe('manualParse', () => {
        describe('when valid enum key is passed', () => {
          test('switches on numerical enum correctly', () => {
            const gameStatuses = {
              1: 'Game has not started',
              2: 'Game in progress',
              3: 'Game finished'
            };

            expect.hasAssertions();
            _.forEach(gameStatuses, (value, key) => {
              const numKey = _.toNumber(key);
              const status = NFLGame.responseMap.gameStatus.manualParse(numKey);
              expect(status).toBe(value);
            });
          });
        });

        describe('when invalid enum key is passed', () => {
          test('returns error string', () => {
            const status = NFLGame.responseMap.gameStatus.manualParse(-231);
            expect(status).toBe('ERROR: gameStatus not recognized');
          });
        });
      });
    });

    describe('homeTeam', () => {
      test('maps to an NFLTeam', () => {
        const id = 10;
        const team = NFLGame.responseMap.homeTeam.manualParse(id);
        expect(team).toBeInstanceOf(NFLTeam);
      });
    });

    describe('awayTeam', () => {
      test('maps to an NFLTeam', () => {
        const id = 10;
        const team = NFLGame.responseMap.awayTeam.manualParse(id);
        expect(team).toBeInstanceOf(NFLTeam);
      });
    });
  });

  describe('class methods', () => {
    test('throws error', () => {
      expect(() => NFLGame.read()).toThrowError(`${NFLGame.displayName}: read: Cannot call read.`);
    });
  });
});
