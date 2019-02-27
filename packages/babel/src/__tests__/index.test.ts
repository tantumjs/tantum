import { withBabel } from '../';

describe('withBabel', () => {
  test('should add a default babel rule', () => {
    expect(withBabel()({})).toEqual({
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: 'babel-loader',
          },
        ],
      },
    });
  });

  test('should allow rule overrides', () => {
    const options = {
      presets: ['react'],
    };

    expect(
      withBabel({
        include: /src/,
        options,
      })({}),
    ).toEqual({
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            include: /src/,
            use: 'babel-loader',
            options,
          },
        ],
      },
    });
  });
});
