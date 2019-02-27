import * as webpack from 'webpack';

/**
 * Composer.
 * Describes a webpack composer function.
 */
export interface Composer {
  (configuration: webpack.Configuration): webpack.Configuration;
}

/**
 * Appends one or more entries.
 *
 * @param entries Entries to append.
 */
export function withEntry(...entries: string[]): Composer {
  return configuration => ({
    ...configuration,
    entry: [...(configuration.entry || []), ...entries],
  });
}

/**
 * Sets the context.
 *
 * @param context Context to set.
 */
export function withContext(context: string): Composer {
  return configuration => ({
    ...configuration,
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
  return configuration => ({
    ...configuration,
    devtool,
  });
}

/**
 * Sets the debug flag.
 *
 * @param debug Debug flag to set.
 */
export function withDebug(debug: boolean): Composer {
  return configuration => ({
    ...configuration,
    debug,
  });
}

/**
 * Sets the mode
 *
 * @param mode Mode to set.
 */
export function withMode(mode: webpack.Configuration['mode']): Composer {
  return configuration => ({
    ...configuration,
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
  return configuration => ({
    ...configuration,
    output: {
      ...(configuration.output || {}),
      ...output,
    },
  });
}

/**
 * Sets the bail flag.
 *
 * @param bail Bail flag to set.
 */
export function withBail(bail: boolean): Composer {
  return configuration => ({
    ...configuration,
    bail,
  });
}

/**
 * Sets the stats.
 *
 * @param stats Stats to set.
 */
export function withStats(stats: webpack.Configuration['stats']): Composer {
  return combine(
    when(
      configuration =>
        typeof configuration.stats === 'object' && typeof stats === 'object',
      configuration => ({
        ...configuration,
        stats: {
          ...(configuration.stats as any),
          ...(stats as any),
        },
      }),
    ),
    when(
      configuration =>
        typeof configuration.stats !== 'object' || typeof stats !== 'object',
      configuration => ({
        ...configuration,
        stats,
      }),
    ),
  );
}

/**
 * Appends one or more plugins.
 *
 * @param plugins Plugins to append.
 */
export function withPlugins(...plugins: webpack.Plugin[]): Composer {
  return configuration => ({
    ...configuration,
    plugins: [...(configuration.plugins || []), ...plugins],
  });
}

/**
 * Appends one or more rules.
 *
 * @param rules Rules to append.
 */
export function withRules(...rules: webpack.Rule[]): Composer {
  return configuration => ({
    ...configuration,
    module: {
      ...configuration.module,
      rules: [
        ...(configuration.module ? configuration.module.rules || [] : []),
        ...rules,
      ],
    },
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
  return configuration => {
    const isFunctionAndTrue =
      typeof condition === 'function' && condition(configuration) === true;
    const isBooleanAndTrue =
      typeof condition === 'boolean' && condition === true;

    if (isBooleanAndTrue || isFunctionAndTrue) {
      return composer(configuration);
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
      (composer, current) => configuration => composer(current(configuration)),
      configuration => configuration,
    );
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
