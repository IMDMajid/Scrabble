import { TestBed } from '@angular/core/testing';
import { RandomBonusesService } from './random-bonuses.service';

describe('RandomBonusesService', () => {
  let service: RandomBonusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomBonusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of all bonuses values with right quantities and a different other from initial one', () => {
    let bonuses = service.shuffleBonuses();
    let bonusesLength = bonuses.length;
    expect(bonusesLength).toEqual(service.bonusesPositions.size);
    expect(bonuses).not.toEqual(Array.from(service.bonusesPositions.values()));
  });

  it('should return a map of all bonuses values shuffled', () => {
    const unshuffledBonuses = new Map<string, string>(service.bonusesPositions);
    service.shuffleBonusesPositions();
    const shuffledBonuses = new Map<string, string>(service.bonusesPositions);
    expect(shuffledBonuses).not.toEqual(unshuffledBonuses);
    expect(shuffledBonuses.size).toEqual(unshuffledBonuses.size);
  });
});
