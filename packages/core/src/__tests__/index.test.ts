import * as webpack from 'webpack';
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
} from '../';

describe('withEntry', () => {
  const entry1 = './src';
  const entry2 = './lib';

  test('should add single entry', () => {
    expect(withEntry(entry1)({})).toEqual({
      entry: [entry1],
    });
  });

  test('should add multiple entries', () => {
    expect(withEntry(entry1, entry2)({})).toEqual({
      entry: [entry1, entry2],
    });
  });

  test('should append entries', () => {
    expect(withEntry(entry2)({ entry: [entry1] })).toEqual({
      entry: [entry1, entry2],
    });
  });
});

describe('withContext', () => {
  test('should set the context', () => {
    expect(withContext('./')({})).toEqual({
      context: './',
    });
  });
});

describe('withDevtool', () => {
  test('should set the devtool', () => {
    expect(withDevtool('source-map')({})).toEqual({
      devtool: 'source-map',
    });
  });
});

describe('withDebug', () => {
  test('should set the debug flag', () => {
    expect(withDebug(true)({})).toEqual({
      debug: true,
    });
  });
});

describe('withBail', () => {
  test('should set the bail flag', () => {
    expect(withBail(true)({})).toEqual({
      bail: true,
    });
  });
});

describe('withMode', () => {
  test('should set the mode', () => {
    expect(withMode('production')({})).toEqual({
      mode: 'production',
    });
  });
});

describe('withStats', () => {
  test('should set the stats', () => {
    expect(withStats('errors-only')({})).toEqual({
      stats: 'errors-only',
    });
  });

  test('should override if source stats are an object', () => {
    expect(withStats('errors-only')({ stats: { errorDetails: true } })).toEqual(
      {
        stats: 'errors-only',
      },
    );
  });

  test('should merge if both are objects', () => {
    expect(
      withStats({ assets: true })({ stats: { errorDetails: true } }),
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
    expect(withOutput({ filename: 'index.js' })({})).toEqual({
      output: {
        filename: 'index.js',
      },
    });
  });

  test('should merge the output', () => {
    expect(
      withOutput({ filename: 'index.js' })({
        output: {
          filename: 'lib.js',
          path: './build',
        },
      }),
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
    expect(withPlugins(plugin1)({})).toEqual({
      plugins: [plugin1],
    });
  });

  test('should add multiple plugins', () => {
    expect(withPlugins(plugin1, plugin2)({})).toEqual({
      plugins: [plugin1, plugin2],
    });
  });

  test('should append plugins', () => {
    const plugin1 = new webpack.ProgressPlugin();
    const plugin2 = new webpack.SourceMapDevToolPlugin();

    expect(withPlugins(plugin2)({ plugins: [plugin1] })).toEqual({
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
    expect(withRules(rule1)({ module: {} } as any)).toEqual({
      module: {
        rules: [rule1],
      },
    });
  });

  test('should add multiple rules', () => {
    expect(withRules(rule1, rule2)({})).toEqual({
      module: {
        rules: [rule1, rule2],
      },
    });
  });

  test('should append plugins', () => {
    expect(withRules(rule2)({ module: { rules: [rule1] } })).toEqual({
      module: {
        rules: [rule1, rule2],
      },
    });
  });
});

describe('when', () => {
  test('should execute composer only when true', () => {
    expect(when(true, withEntry('./src'))({})).toEqual({
      entry: ['./src'],
    });

    expect(when(false, withEntry('./src'))({})).toEqual({});
  });

  test('should execute composer only when function returns true', () => {
    const isTrue = jest.fn().mockReturnValue(true);
    const isFalse = jest.fn().mockReturnValue(false);

    expect(when(isTrue, withEntry('./src'))({ context: './' })).toEqual({
      context: './',
      entry: ['./src'],
    });

    expect(when(isFalse, withEntry('./src'))({ context: './' })).toEqual({
      context: './',
    });

    expect(isTrue).toHaveBeenCalledWith({ context: './' });
    expect(isFalse).toHaveBeenCalledWith({ context: './' });
  });
});

describe('combine', () => {
  test('should combine multiple composers into a single one', () => {
    const withEntryAndContext = combine(withEntry('./src'), withContext('./'));

    expect(withEntryAndContext({})).toEqual({
      context: './',
      entry: ['./src'],
    });
  });
});

describe('whenProduction', () => {
  test('should execute composer in production only', () => {
    expect(
      whenProduction(withEntry('./src'))({
        mode: 'production',
      }),
    ).toEqual({
      mode: 'production',
      entry: ['./src'],
    });

    expect(whenProduction(withEntry('./src'))({})).toEqual({});
  });
});

describe('whenDevelopment', () => {
  test('should execute composer in development only', () => {
    expect(
      whenDevelopment(withEntry('./src'))({
        mode: 'development',
      }),
    ).toEqual({
      mode: 'development',
      entry: ['./src'],
    });

    expect(
      whenDevelopment(withEntry('./src'))({
        mode: 'production',
      }),
    ).toEqual({
      mode: 'production',
    });
  });
});
