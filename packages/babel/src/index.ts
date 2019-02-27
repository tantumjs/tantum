import { Composer, withRules } from '@tantum/core';
import webpack = require('webpack');

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
