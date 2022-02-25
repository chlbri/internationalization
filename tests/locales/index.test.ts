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
  it('For English', () => {
    const intern = new Internationalization('tests', 'locales', 'en');
    intern.initSync();
    expect(intern.jsons).toStrictEqual({ en: expecteds.en });
  });

  it('For French', () => {
    const intern = new Internationalization('tests', 'locales', 'fr');
    intern.initSync();
    expect(intern.jsons).toStrictEqual({ fr: expecteds.fr });
  });

  it('For Both french and english', () => {
    const intern = new Internationalization('tests', 'locales');
    intern.initSync();
    expect(intern.jsons).toStrictEqual(expecteds);
  });
});

describe('Async Translation', () => {
  it('For English', async () => {
    const intern = new Internationalization('tests', 'locales', 'en');
    await intern.init();
    expect(intern.jsons).toStrictEqual({ en: expecteds.en });
  });

  it('For French', async () => {
    const intern = new Internationalization('tests', 'locales', 'fr');
    await intern.init();
    expect(intern.jsons).toStrictEqual({ fr: expecteds.fr });
  });

  it('For Both french and english', async () => {
    const intern = new Internationalization('tests', 'locales');
    await intern.init();
    expect(intern.jsons).toStrictEqual(expecteds);
  });
});
