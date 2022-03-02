import Internationalization from '../../src';
import en1 from './en/common.json';
import en2 from './en/common_copy.json';
import fr1 from './fr/common.json';
import fr2 from './fr/common_copy.json';

const expecteds = {
  en: { common: en1, common_copy: en2 },
  fr: { common: fr1, common_copy: fr2 },
};

async function usePrepareEn() {
  const intern = new Internationalization('tests', 'locales');
  await intern.init();
  return intern.getByKey;
}

async function usePrepareFr() {
  const intern = new Internationalization('tests', 'locales');
  await intern.init();
  intern.changeLocale('fr');
  return intern.getByKey;
}

describe('Async Translation', () => {
  it.concurrent('For English, translations are created', async () => {
    const intern = new Internationalization('tests', 'locales', 'en');
    await intern.init();
    expect(intern._jsons).toStrictEqual({ en: expecteds.en });
  });

  it.concurrent('For French, translations are created', async () => {
    const intern = new Internationalization('tests', 'locales', 'fr');
    await intern.init();
    expect(intern._jsons).toStrictEqual({ fr: expecteds.fr });
  });

  it.concurrent(
    'For Both french and english, translations are created',
    async () => {
      const intern = new Internationalization('tests', 'locales');
      await intern.init();
      expect(intern._jsons).toStrictEqual(expecteds);
    },
  );
});

describe('Tests for returning the key', () => {
  it('Return Nothing when the key is not registered', async () => {
    const notRegitered1 = 'not.registered1.com';
    const notRegitered2 = 'not.registered2.com';
    const getKey = await usePrepareEn();

    expect(getKey(notRegitered1)).toBeUndefined();
    expect(getKey(notRegitered2)).toBeUndefined();
  });

  describe('Return the right string when the key is registered', () => {
    const regitered2 = 'common.main.features.features[0].title';
    const regitered3 = 'common.main.features.features[1].imageRatio';
    const regitered1 = 'common.main.features.title';
    const regitered4 = 'common_copy.main2.features.title';
    describe('For English', () => {
      it('common.main.features.title', async () => {
        const getKey = await usePrepareEn();
        expect(getKey(regitered1)).toBe('Features');
      });
      it('en.common.main.features.features[0].title', async () => {
        const getKey = await usePrepareEn();
        expect(getKey(regitered2)).toBe('Bookmark in on click');
      });
      it('en.common.main.features.features[1].imageRatio', async () => {
        const getKey = await usePrepareEn();
        expect(getKey(regitered3)).toBe('aspect-478/393');
      });
      it('en.common_copy.main2.features.title', async () => {
        const getKey = await usePrepareEn();
        expect(getKey(regitered4)).toBe('Features2');
      });
    });

    describe('For French', () => {
      it('fr.common.main.features.title', async () => {
        const getKey = await usePrepareFr();
        expect(getKey(regitered1)).toBe('Services');
      });
      it('fr.common.main.features.features[0].title', async () => {
        const getKey = await usePrepareFr();
        expect(getKey(regitered2)).toBe('A propos');
      });
      it('fr.common.main.features.features[1].imageRatio', async () => {
        const getKey = await usePrepareFr();
        expect(getKey(regitered3)).toBe('aspect-478/393');
      });
      it('fr.common_copy.main2.features.title', async () => {
        const getKey = await usePrepareFr();
        expect(getKey(regitered4)).toBe('Services2');
      });
    });
  });
});
