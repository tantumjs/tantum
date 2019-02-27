import * as webpack from 'webpack';
import merge from 'webpack-merge';

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
 * Appends one or more entries.
 *
 * @param entries Entries to append.
 */
export function withEntry(...entries: string[]): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      entry: entries,
    });
}

/**
 * Sets the context.
 *
 * @param context Context to set.
 */
export function withContext(context: string): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      context,
    });
}

/**
 * Sets the devtool.
 *
 * @param context Devtool to set.
 */
export function withDevtool(
  devtool: webpack.Configuration['devtool'],
): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      devtool,
    });
}

/**
 * Sets the debug flag.
 *
 * @param debug Debug flag to set.
 */
export function withDebug(debug: boolean): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      debug,
    });
}

/**
 * Sets the mode
 *
 * @param mode Mode to set.
 */
export function withMode(mode: webpack.Configuration['mode']): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      mode,
    });
}

/**
 * Sets the output.
 *
 * @param output Output to set.
 *
 */
export function withOutput(output: webpack.Output): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      output,
    });
}

/**
 * Sets the bail flag.
 *
 * @param bail Bail flag to set.
 */
export function withBail(bail: boolean): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      bail,
    });
}

/**
 * Sets the stats.
 *
 * @param stats Stats to set.
 */
export function withStats(stats: webpack.Configuration['stats']): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      stats,
    });
}

/**
 * Appends one or more plugins.
 *
 * @param plugins Plugins to append.
 */
export function withPlugins(...plugins: webpack.Plugin[]): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      plugins,
    });
}

/**
 * Appends one or more rules.
 *
 * @param rules Rules to append.
 */
export function withRules(...rules: webpack.Rule[]): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      module: {
        rules,
      },
    });
}

/**
 * Sets resolve values.
 *
 * @param resolve Resolve to set.
 */
export function withResolve(resolve: webpack.Resolve): Composer {
  return (configuration, merge) =>
    merge(configuration, {
      resolve,
    });
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
