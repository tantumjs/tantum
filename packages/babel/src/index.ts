import * as webpack from 'webpack';
import { Composer, withRules } from '@tantum/core';

/**
 * Adds a babel-loader rule.
 *
 * @param overrideRule Rule overrides.
 */
export function withBabel(
  customize: (rule: webpack.Rule) => webpack.Rule = rule => rule,
): Composer {
  return withRules(
    customize({
      test: /\.jsx?$/,
      use: 'babel-loader',
      options: { presets: [['env', { modules: false }]] },
    }),
  );
}
