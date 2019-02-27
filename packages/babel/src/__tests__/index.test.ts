import { withBabel } from '../';
import { compose } from '@tantum/core';

describe('withBabel', () => {
  test('should add a default babel rule', () => {
    expect(compose(withBabel())).toEqual({
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
      compose(
        withBabel({
          include: /src/,
          options,
        }),
      ),
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
