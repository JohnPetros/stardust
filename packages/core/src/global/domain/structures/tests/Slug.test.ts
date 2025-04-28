import { ValidationError } from "../../errors";
import { Slug } from "../Slug";

describe('Slug structure', () => {
  it('should be created from a value with more 1 characters', () => {
    expect(() => Slug.create('jp')).not.toThrow(ValidationError);
    expect(() => Slug.create('j')).toThrow(ValidationError);
  })

  it('should slugify the given value', () => {
    expect(Slug.create('Leonel Sanches').value).toBe('leonel-sanches');
    expect(Slug.create('  Leonel   Sanches  ').value).toBe('leonel-sanches');
    expect(Slug.create('Leonel!@# Sanches$$%').value).toBe('leonel-sanches');
    expect(Slug.create('Léonél Sánchez').value).toBe('leonel-sanchez');
    expect(Slug.create('LEONEL SANCHES').value).toBe('leonel-sanches');
    expect(Slug.create('Leonel-Sanches').value).toBe('leonel-sanches');
    expect(Slug.create('Leonel    Sanches    Junior').value).toBe('leonel-sanches-junior');
  })

  it('should deslugify the given value', () => {
    expect(Slug.deslugify('leonel-sanches')).toBe('leonel sanches');
    expect(Slug.deslugify('leonel-sanches-junior')).toBe('leonel sanches junior');
    expect(Slug.deslugify('leonel')).toBe('leonel');
    expect(Slug.deslugify('leonel-sanches-junior-da-silva')).toBe('leonel sanches junior da silva');
  });
})
