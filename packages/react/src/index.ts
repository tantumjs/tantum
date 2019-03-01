import * as webpack from 'webpack';
import { withBabel } from '@tantum/babel';
import {
  Composer,
  whenDevelopment,
  combine,
  whenProduction,
} from '@tantum/core';

/**
 * Adds a babel-loader rule configured for react usage.
 *
 * @param overrideRule Rule overrides.
 */
export function withReact(
  customize: (rule: webpack.Rule) => webpack.Rule = rule => rule,
): Composer {
  return combine(
    whenProduction(
      withBabel(rule =>
        customize({
          ...rule,
          options: {
            presets: [['env', { modules: false }], 'react'],
          },
        }),
      ),
    ),
    whenDevelopment(
      withBabel(rule =>
        customize({
          ...rule,
          options: {
            presets: [
              ['env', { modules: false }],
              'react',
              'react-hot-loader/babel',
            ],
          },
        }),
      ),
    ),
  );
}
