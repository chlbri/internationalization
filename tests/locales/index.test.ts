import Internationalization from '../../src';
import en1 from './en/common.json';
import en2 from './en/common_copy.json';
import fr1 from './fr/common.json';
import fr2 from './fr/common_copy.json';

const expecteds = {
  en: { common: en1, common_copy: en2 },
  fr: { common: fr1, common_copy: fr2 },
};

describe('Sync Translation', () => {
  it.concurrent('Nothing when not intialized', () => {
    const intern = new Internationalization('tests', 'locales', 'en');
    expect(intern.jsons).toStrictEqual({});
  });
  it.concurrent('For English, translations are created', () => {
    const intern = new Internationalization('tests', 'locales', 'en');
    intern.initSync();
    expect(intern.jsons).toStrictEqual({ en: expecteds.en });
  });

  it.concurrent('For French, translations are created', () => {
    const intern = new Internationalization('tests', 'locales', 'fr');
    intern.initSync();
    expect(intern.jsons).toStrictEqual({ fr: expecteds.fr });
  });

  it.concurrent(
    'For Both french and english, translations are created',
    () => {
      const intern = new Internationalization('tests', 'locales');
      intern.initSync();
      expect(intern.jsons).toStrictEqual(expecteds);
    },
  );
});

describe('Async Translation', () => {
  it.concurrent('For English, translations are created', async () => {
    const intern = new Internationalization('tests', 'locales', 'en');
    await intern.init();
    expect(intern.jsons).toStrictEqual({ en: expecteds.en });
  });

  it.concurrent('For French, translations are created', async () => {
    const intern = new Internationalization('tests', 'locales', 'fr');
    await intern.init();
    expect(intern.jsons).toStrictEqual({ fr: expecteds.fr });
  });

  it.concurrent(
    'For Both french and english, translations are created',
    async () => {
      const intern = new Internationalization('tests', 'locales');
      await intern.init();
      expect(intern.jsons).toStrictEqual(expecteds);
    },
  );
});

describe('Tests for returning the key', () => {
  const intern = new Internationalization('tests', 'locales');
  intern.initSync();

  it.concurrent('Return Nothing when the key is not registered', () => {
    const notRegitered1 = 'not.registered1.com';
    const notRegitered2 = 'not.registered2.com';

    expect(intern.getByKey(notRegitered1)).toBeUndefined();
    expect(intern.getByKey(notRegitered2)).toBeUndefined();
  });

  describe('Return the right string when the key is registered', () => {
    const regitered2 = 'common.main.features.features[0].title';
    const regitered3 = 'common.main.features.features[1].imageRatio';
    const regitered1 = 'common.main.features.title';
    const regitered4 = 'common_copy.main2.features.title';
    describe('For English', () => {
      const intern = new Internationalization('tests', 'locales');
      intern.initSync();

      it.concurrent('en.common.main.features.title', () => {
        expect(intern.getByKey(regitered1)).toBe('Features');
      });
      it.concurrent('en.common.main.features.features[0].title', () => {
        expect(intern.getByKey(regitered2)).toBe('Bookmark in on click');
      });
      it.concurrent(
        'en.common.main.features.features[1].imageRatio',
        () => {
          expect(intern.getByKey(regitered3)).toBe('aspect-478/393');
        },
      );
      it.concurrent('en.common_copy.main2.features.title', () => {
        expect(intern.getByKey(regitered4)).toBe('Features2');
      });
    });
    describe('For French', () => {
      const intern = new Internationalization('tests', 'locales');
      intern.initSync();
      intern.changeLocale('fr');

      it.concurrent('fr.common.main.features.title', () => {
        expect(intern.getByKey(regitered1)).toBe('Services');
      });
      it.concurrent('fr.common.main.features.features[0].title', () => {
        expect(intern.getByKey(regitered2)).toBe('A propos');
      });
      it.concurrent(
        'fr.common.main.features.features[1].imageRatio',
        () => {
          expect(intern.getByKey(regitered3)).toBe('aspect-478/393');
        },
      );
      it.concurrent('fr.common_copy.main2.features.title', () => {
        expect(intern.getByKey(regitered4)).toBe('Services2');
      });
    });
  });
});
