import { StatNamePipe } from './stat-name.pipe';

describe('StatNamePipe', () => {
  
  let pipe: StatNamePipe;

  beforeEach(() => {
    pipe = new StatNamePipe();
  });
  
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "hp" to "HP"', () => {
    const result = pipe.transform('hp');
    expect(result).toBe('HP');
  });

  it('should transform "attack" to "ATK"', () => {
    const result = pipe.transform('attack');
    expect(result).toBe('ATK');
  });

  it('should transform "defense" to "DEF"', () => {
    const result = pipe.transform('defense');
    expect(result).toBe('DEF');
  });

  it('should transform "special-attack" to "SATK"', () => {
    const result = pipe.transform('special-attack');
    expect(result).toBe('SATK');
  });

  it('should transform "special-defense" to "SDEF"', () => {
    const result = pipe.transform('special-defense');
    expect(result).toBe('SDEF');
  });

  it('should transform "speed" to "SPD"', () => {
    const result = pipe.transform('speed');
    expect(result).toBe('SPD');
  });

  it('should leave unknown values unchanged', () => {
    const result = pipe.transform('unknown');
    expect(result).toBe('unknown');
  });
});
