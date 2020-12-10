import { getGlobalObject } from '@sentry-csii/utils';
import { JSDOM } from 'jsdom';

/**
 * Injects DOM properties into node global object.
 *
 * Useful for running tests where some of the tested code applies to @sentry-csii/node and some applies to @sentry-csii/browser
 * (e.g. tests in @sentry-csii/tracing or @sentry-csii/hub). Note that not all properties from the browser `window` object are
 * available.
 *
 * @param properties The names of the properties to add
 */
export function addDOMPropertiesToGlobal(properties: string[]): void {
  // we have to add things into the real global object (rather than mocking the return value of getGlobalObject)
  // because there are modules which call getGlobalObject as they load, which is too early for jest to intervene
  const { window } = new JSDOM('', { url: 'http://dogs.are.great/' });
  const global = getGlobalObject<NodeJS.Global & Window>();

  properties.forEach(prop => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (global as any)[prop] = window[prop];
  });
}

/**
 * Returns the symbol with the given description being used as a key in the given object.
 *
 * In the case where there are multiple symbols in the object with the same description, it throws an error.
 *
 * @param obj The object whose symbol-type key you want
 * @param description The symbol's descriptor
 * @returns The first symbol found in the object with the given description, or undefined if not found.
 */
export function getSymbolObjectKeyByName(obj: Record<string | symbol, any>, description: string): symbol | undefined {
  const symbols = Object.getOwnPropertySymbols(obj);

  const matches = symbols.filter(sym => sym.toString() === `Symbol(${description})`);

  if (matches.length > 1) {
    throw new Error(`More than one symbol key found with description '${description}'.`);
  }

  return matches[0] || undefined;
}
