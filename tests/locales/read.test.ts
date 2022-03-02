import readDir from '../../src/read';

it('Read JSON', async () => {
  const data = await readDir({
    dir: 'tests',
    extension: 'json',
  });
  // console.log(data);
  expect(data).toHaveLength(4);
});
it('Read JSON with absolute', async () => {
  const data = await readDir({
    dir: 'tests',
    extension: 'json',
    absolutify: true,
  });
  // console.log(data);
  expect(data).toHaveLength(4);
});
