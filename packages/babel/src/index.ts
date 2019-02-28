import * as webpack from 'webpack';
import { Composer, withRules } from '@tantum/core';

/**
 * Default babel-loader rule.
 */
export const defaultRule: webpack.Rule = {
  test: /\.jsx?$/,
  use: 'babel-loader',
};

/**
 * Adds a babel-loader rule.
 *
 * @param overrideRule Rule overrides.
 */
export function withBabel(overrideRule: webpack.Rule = {}): Composer {
  return withRules({
    ...defaultRule,
    ...overrideRule,
  });
}
