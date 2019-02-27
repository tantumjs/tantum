import * as webpack from 'webpack';
import merge from 'webpack-merge';
import {
  withEntry,
  withContext,
  withPlugins,
  withRules,
  withDevtool,
  withDebug,
  withBail,
  withMode,
  withOutput,
  when,
  combine,
  whenProduction,
  whenDevelopment,
  withStats,
  compose,
  withResolve,
} from '../';

describe('compose', () => {
  test('should execute composer', () => {
    const composer = jest.fn(configuration => configuration);

    compose(composer);
    expect(composer).toHaveBeenCalledTimes(1);
  });

  test('should execute composer with initial config', () => {
    const composer = jest.fn(configuration => configuration);
    const configuration: webpack.Configuration = {
      module: {
        rules: [],
      },
    };

    compose(
      composer,
      configuration,
    );

    expect(composer).toHaveBeenCalledTimes(1);
    expect(composer.mock.calls[0][0]).toEqual(configuration);
  });

  test('should execute composer with custom merger', () => {
    const composer = jest.fn((configuration, merge) =>
      merge(configuration, {}),
    );

    const merger = jest.fn((...args: webpack.Configuration[]) =>
      merge(...args),
    );

    const configuration: webpack.Configuration = {
      module: {
        rules: [],
      },
    };

    compose(
      composer,
      configuration,
      merger,
    );

    expect(composer).toHaveBeenCalledTimes(1);
    expect(composer).toHaveBeenCalledWith(configuration, merger);
    expect(merger).toHaveBeenCalledTimes(1);
  });
});

describe('withEntry', () => {
  const entry1 = './src';
  const entry2 = './lib';

  test('should add single entry', () => {
    expect(compose(withEntry(entry1))).toEqual({
      entry: [entry1],
    });
  });

  test('should add multiple entries', () => {
    expect(compose(withEntry(entry1, entry2))).toEqual({
      entry: [entry1, entry2],
    });
  });

  test('should append entries', () => {
    expect(
      compose(
        withEntry(entry2),
        { entry: [entry1] },
      ),
    ).toEqual({
      entry: [entry1, entry2],
    });
  });
});

describe('withContext', () => {
  test('should set the context', () => {
    expect(compose(withContext('./'))).toEqual({
      context: './',
    });
  });
});

describe('withDevtool', () => {
  test('should set the devtool', () => {
    expect(compose(withDevtool('source-map'))).toEqual({
      devtool: 'source-map',
    });
  });
});

describe('withDebug', () => {
  test('should set the debug flag', () => {
    expect(compose(withDebug(true))).toEqual({
      debug: true,
    });
  });
});

describe('withBail', () => {
  test('should set the bail flag', () => {
    expect(compose(withBail(true))).toEqual({
      bail: true,
    });
  });
});

describe('withMode', () => {
  test('should set the mode', () => {
    expect(compose(withMode('production'))).toEqual({
      mode: 'production',
    });
  });
});

describe('withStats', () => {
  test('should set the stats', () => {
    expect(compose(withStats('errors-only'))).toEqual({
      stats: 'errors-only',
    });
  });

  test('should override if source stats are an object', () => {
    expect(
      compose(
        withStats('errors-only'),
        { stats: { errorDetails: true } },
      ),
    ).toEqual({
      stats: 'errors-only',
    });
  });

  test('should merge if both are objects', () => {
    expect(
      compose(
        withStats({ assets: true }),
        { stats: { errorDetails: true } },
      ),
    ).toEqual({
      stats: {
        assets: true,
        errorDetails: true,
      },
    });
  });
});

describe('withOutput', () => {
  test('should set the output', () => {
    expect(compose(withOutput({ filename: 'index.js' }))).toEqual({
      output: {
        filename: 'index.js',
      },
    });
  });

  test('should merge the output', () => {
    expect(
      compose(
        withOutput({ filename: 'index.js' }),
        {
          output: {
            filename: 'lib.js',
            path: './build',
          },
        },
      ),
    ).toEqual({
      output: {
        path: './build',
        filename: 'index.js',
      },
    });
  });
});

describe('withPlugins', () => {
  const plugin1 = new webpack.ProgressPlugin();
  const plugin2 = new webpack.SourceMapDevToolPlugin();

  test('should add single plugin', () => {
    expect(compose(withPlugins(plugin1))).toEqual({
      plugins: [plugin1],
    });
  });

  test('should add multiple plugins', () => {
    expect(compose(withPlugins(plugin1, plugin2))).toEqual({
      plugins: [plugin1, plugin2],
    });
  });

  test('should append plugins', () => {
    const plugin1 = new webpack.ProgressPlugin();
    const plugin2 = new webpack.SourceMapDevToolPlugin();

    expect(
      compose(
        withPlugins(plugin2),
        { plugins: [plugin1] },
      ),
    ).toEqual({
      plugins: [plugin1, plugin2],
    });
  });
});

describe('withRules', () => {
  const rule1: webpack.Rule = {
    test: /\.js$/,
    use: 'babel-loader',
  };

  const rule2: webpack.Rule = {
    test: /\.ts$/,
    use: 'ts-loader',
  };

  test('should add single rule', () => {
    expect(
      compose(
        withRules(rule1),
        { module: {} } as any,
      ),
    ).toEqual({
      module: {
        rules: [rule1],
      },
    });
  });

  test('should add multiple rules', () => {
    expect(compose(withRules(rule1, rule2))).toEqual({
      module: {
        rules: [rule1, rule2],
      },
    });
  });

  test('should append plugins', () => {
    expect(
      compose(
        withRules(rule2),
        { module: { rules: [rule1] } },
      ),
    ).toEqual({
      module: {
        rules: [rule1, rule2],
      },
    });
  });
});

describe('withResolve', () => {
  test('should add resolve values', () => {
    expect(
      compose(
        withResolve({
          modules: [__dirname],
        }),
      ),
    ).toEqual({
      resolve: {
        modules: [__dirname],
      },
    });
  });
});

describe('when', () => {
  test('should execute composer only when true', () => {
    expect(compose(when(true, withEntry('./src')))).toEqual({
      entry: ['./src'],
    });

    expect(compose(when(false, withEntry('./src')))).toEqual({});
  });

  test('should execute composer only when function returns true', () => {
    const isTrue = jest.fn().mockReturnValue(true);
    const isFalse = jest.fn().mockReturnValue(false);

    expect(
      compose(
        when(isTrue, withEntry('./src')),
        { context: './' },
      ),
    ).toEqual({
      context: './',
      entry: ['./src'],
    });

    expect(
      compose(
        when(isFalse, withEntry('./src')),
        { context: './' },
      ),
    ).toEqual({
      context: './',
    });

    expect(isTrue).toHaveBeenCalledWith({ context: './' });
    expect(isFalse).toHaveBeenCalledWith({ context: './' });
  });
});

describe('combine', () => {
  test('should combine multiple composers into a single one', () => {
    const withEntryAndContext = combine(withEntry('./src'), withContext('./'));

    expect(compose(withEntryAndContext)).toEqual({
      context: './',
      entry: ['./src'],
    });
  });
});

describe('whenProduction', () => {
  test('should execute composer in production only', () => {
    expect(
      compose(
        whenProduction(withEntry('./src')),
        {
          mode: 'production',
        },
      ),
    ).toEqual({
      mode: 'production',
      entry: ['./src'],
    });

    expect(compose(whenProduction(withEntry('./src')))).toEqual({});
  });
});

describe('whenDevelopment', () => {
  test('should execute composer in development only', () => {
    expect(
      compose(
        whenDevelopment(withEntry('./src')),
        {
          mode: 'development',
        },
      ),
    ).toEqual({
      mode: 'development',
      entry: ['./src'],
    });

    expect(
      compose(
        whenDevelopment(withEntry('./src')),
        {
          mode: 'production',
        },
      ),
    ).toEqual({
      mode: 'production',
    });
  });
});
