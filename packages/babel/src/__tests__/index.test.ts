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
            options: { presets: [['env', { modules: false }]] },
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
        withBabel(rule => ({
          ...rule,
          include: /src/,
          options,
        })),
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
