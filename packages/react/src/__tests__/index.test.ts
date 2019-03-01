import { withReact } from '../';
import { compose, withMode, combine } from '@tantum/core';

describe('withReact', () => {
  test('should add a default react rule', () => {
    expect(compose(combine(withMode('production'), withReact()))).toEqual({
      mode: 'production',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: 'babel-loader',
            options: { presets: [['env', { modules: false }], 'react'] },
          },
        ],
      },
    });
  });

  test('should add hot loader when development', () => {
    expect(compose(combine(withMode('development'), withReact()))).toEqual({
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: 'babel-loader',
            options: {
              presets: [
                ['env', { modules: false }],
                'react',
                'react-hot-loader/babel',
              ],
            },
          },
        ],
      },
    });
  });

  test('should allow rule overrides', () => {
    const options = {
      presets: [['env', { modules: false }], 'react'],
    };

    expect(
      compose(
        combine(
          withMode('production'),
          withReact(rule => ({
            ...rule,
            include: /src/,
            options,
          })),
        ),
      ),
    ).toEqual({
      mode: 'production',
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
