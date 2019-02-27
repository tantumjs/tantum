import * as webpack from 'webpack';
import merge from 'webpack-merge';

/**
 * Merger.
 * Function used by composers to merge configuration values.
 */
export interface Merger {
  (...configurations: webpack.Configuration[]): webpack.Configuration;
}

/**
 * Composer.
 * Describes a webpack composer function.
 */
export interface Composer {
  (configuration: webpack.Configuration, merge: Merger): webpack.Configuration;
}

/**
 * Internal composer for simple values.
 *
 * @param property Property to set.
 * @param value Value to set.
 */
function withProperty<K extends keyof webpack.Configuration>(
  property: K,
  value: webpack.Configuration[K],
): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      [property]: value,
    });
}

/**
 * Appends one or more entries.
 *
 * @param entries Entries to append.
 */
export function withEntry(...entries: string[]): Composer {
  return withProperty('entry', entries);
}

/**
 * Sets the context.
 *
 * @param context Context to set.
 */
export function withContext(context: string): Composer {
  return withProperty('context', context);
}

/**
 * Sets the devtool.
 *
 * @param context Devtool to set.
 */
export function withDevtool(
  devtool: webpack.Configuration['devtool'],
): Composer {
  return withProperty('devtool', devtool);
}

/**
 * Sets the debug flag.
 *
 * @param debug Debug flag to set.
 */
export function withDebug(debug: boolean): Composer {
  return withProperty('debug', debug);
}

/**
 * Sets the mode
 *
 * @param mode Mode to set.
 */
export function withMode(mode: webpack.Configuration['mode']): Composer {
  return withProperty('mode', mode);
}

/**
 * Sets the output.
 *
 * @param output Output to set.
 *
 */
export function withOutput(output: webpack.Output): Composer {
  return withProperty('output', output);
}

/**
 * Sets the bail flag.
 *
 * @param bail Bail flag to set.
 */
export function withBail(bail: boolean): Composer {
  return withProperty('bail', bail);
}

/**
 * Sets the stats.
 *
 * @param stats Stats to set.
 */
export function withStats(stats: webpack.Configuration['stats']): Composer {
  return withProperty('stats', stats);
}

/**
 * Appends one or more plugins.
 *
 * @param plugins Plugins to append.
 */
export function withPlugins(...plugins: webpack.Plugin[]): Composer {
  return withProperty('plugins', plugins);
}

/**
 * Sets the module.
 *
 * @param module Module to set.
 */
export function withModule(module: webpack.Module): Composer {
  return withProperty('module', module);
}

/**
 * Appends one or more rules.
 *
 * @param rules Rules to append.
 */
export function withRules(...rules: webpack.Rule[]) {
  return withModule({
    rules,
  });
}

/**
 * Sets resolve values.
 *
 * @param resolve Resolve to set.
 */
export function withResolve(resolve: webpack.Resolve): Composer {
  return withProperty('resolve', resolve);
}

/**
 * Executes the given composer only if the given condition returns true.
 * The condition can either be a boolean value or a callback which returns a boolean value.
 * The latter will receive the current configuration as the first parameter.
 *
 * @param condition Callback or boolean value.
 * @param composer Composer to execute.
 */
export function when(
  condition: boolean | ((configuration: webpack.Configuration) => boolean),
  composer: Composer,
): Composer {
  return (configuration, merge) => {
    const isFunctionAndTrue =
      typeof condition === 'function' && condition(configuration) === true;
    const isBooleanAndTrue =
      typeof condition === 'boolean' && condition === true;

    if (isBooleanAndTrue || isFunctionAndTrue) {
      return composer(configuration, merge);
    }

    return configuration;
  };
}

/**
 * Combines multiple composers into a single one.
 *
 * @param composers Composers to combine.
 */
export function combine(...composers: Composer[]): Composer {
  return composers
    .reverse()
    .reduce(
      (composer, current) => (configuration, merge) =>
        composer(current(configuration, merge), merge),
      configuration => configuration,
    );
}

/**
 * Executes the given composer with an optional initial configuration or a custom merger.
 *
 * @param composer Composer to run.
 * @param initial Initial configuration.
 * @param merger Merger function to use.
 */
export function compose(
  composer: Composer,
  initial: webpack.Configuration = {},
  merger: Merger = merge,
) {
  return composer(initial, merger);
}

/**
 * Executes the given composer only when the mode of the configuration is currently set to production.
 *
 * @param composer Composer to execute in production mode.
 */
export function whenProduction(composer: Composer) {
  return when(configuration => configuration.mode === 'production', composer);
}

/**
 * Executes the given composer only when the mode of the configuration is currently set to development.
 *
 * @param composer Composer to execute in development mode
 */
export function whenDevelopment(composer: Composer) {
  return when(configuration => configuration.mode === 'development', composer);
}
