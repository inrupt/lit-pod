/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Quad_Object, Quad, NamedNode, Literal } from "rdf-js";
import { Iri, Thing, Url, UrlString } from "../interfaces";
import {
  asNamedNode,
  isNamedNode,
  isLiteral,
  deserializeBoolean,
  deserializeDatetime,
  deserializeDecimal,
  deserializeInteger,
} from "../datatypes";
import { RDF, XSD } from "@solid/lit-vocab-common-rdfext";

/**
 * @param thing The [[Thing]] to read a URL value from.
 * @param predicate The given Predicate for which you want the URL value.
 * @returns A URL value for the given Predicate, if present, or null otherwise.
 */
export function getUrlOne(
  thing: Thing,
  predicate: Url | UrlString
): UrlString | null {
  const namedNodeMatcher = getNamedNodeMatcher(predicate);

  const matchingQuad = findOne(thing, namedNodeMatcher);

  if (matchingQuad === null) {
    return null;
  }

  return matchingQuad.object;
}
/** @hidden Alias of [[getUrlOne]] for those who prefer IRI terminology. */
export const getIriOne = getUrlOne;

/**
 * @param thing The [[Thing]] to read the URL values from.
 * @param predicate The given Predicate for which you want the URL values.
 * @returns The URL values for the given Predicate.
 */
export function getUrlAll(
  thing: Thing,
  predicate: Url | UrlString
): UrlString[] {
  const iriMatcher = getNamedNodeMatcher(predicate);

  const matchingQuads = findAll(thing, iriMatcher);

  return matchingQuads.map((quad) => quad.object);
}
/** @hidden Alias of [[getUrlAll]] for those who prefer IRI terminology. */
export const getIriAll = getUrlAll;

/**
 * @param thing The [[Thing]] to read a boolean value from.
 * @param predicate The given Predicate for which you want the boolean value.
 * @returns A boolean value for the given Predicate, if present, or null otherwise.
 */
export function getBooleanOne(
  thing: Thing,
  predicate: Url | UrlString
): boolean | null {
  const literalString = getLiteralOneOfType(thing, predicate, XSD.boolean_);

  if (literalString === null) {
    return null;
  }

  return deserializeBoolean(literalString);
}

/**
 * @param thing The [[Thing]] to read the boolean values from.
 * @param predicate The given Predicate for which you want the boolean values.
 * @returns The boolean values for the given Predicate.
 */
export function getBooleanAll(
  thing: Thing,
  predicate: Url | UrlString
): boolean[] {
  const literalStrings = getLiteralAllOfType(thing, predicate, XSD.boolean_);

  return literalStrings
    .map(deserializeBoolean)
    .filter((possibleBoolean) => possibleBoolean !== null) as boolean[];
}

/**
 * @param thing The [[Thing]] to read a datetime value from.
 * @param predicate The given Predicate for which you want the datetime value.
 * @returns A datetime value for the given Predicate, if present, or null otherwise.
 */
export function getDatetimeOne(
  thing: Thing,
  predicate: Url | UrlString
): Date | null {
  const literalString = getLiteralOneOfType(thing, predicate, XSD.dateTime);

  if (literalString === null) {
    return null;
  }

  return deserializeDatetime(literalString);
}

/**
 * @param thing The [[Thing]] to read the datetime values from.
 * @param predicate The given Predicate for which you want the datetime values.
 * @returns The datetime values for the given Predicate.
 */
export function getDatetimeAll(
  thing: Thing,
  predicate: Url | UrlString
): Date[] {
  const literalStrings = getLiteralAllOfType(thing, predicate, XSD.dateTime);

  return literalStrings
    .map(deserializeDatetime)
    .filter((potentialDatetime) => potentialDatetime !== null) as Date[];
}

/**
 * @param thing The [[Thing]] to read a decimal value from.
 * @param predicate The given Predicate for which you want the decimal value.
 * @returns A decimal value for the given Predicate, if present, or null otherwise.
 */
export function getDecimalOne(
  thing: Thing,
  predicate: Url | UrlString
): number | null {
  const literalString = getLiteralOneOfType(thing, predicate, XSD.decimal);

  if (literalString === null) {
    return null;
  }

  return deserializeDecimal(literalString);
}

/**
 * @param thing The [[Thing]] to read the decimal values from.
 * @param predicate The given Predicate for which you want the decimal values.
 * @returns The decimal values for the given Predicate.
 */
export function getDecimalAll(
  thing: Thing,
  predicate: Url | UrlString
): number[] {
  const literalStrings = getLiteralAllOfType(thing, predicate, XSD.decimal);

  return literalStrings
    .map((literalString) => deserializeDecimal(literalString))
    .filter((potentialDecimal) => potentialDecimal !== null) as number[];
}

/**
 * @param thing The [[Thing]] to read an integer value from.
 * @param predicate The given Predicate for which you want the integer value.
 * @returns An integer value for the given Predicate, if present, or null otherwise.
 */
export function getIntegerOne(
  thing: Thing,
  predicate: Url | UrlString
): number | null {
  const literalString = getLiteralOneOfType(thing, predicate, XSD.integer);

  if (literalString === null) {
    return null;
  }

  return deserializeInteger(literalString);
}

/**
 * @param thing The [[Thing]] to read the integer values from.
 * @param predicate The given Predicate for which you want the integer values.
 * @returns The integer values for the given Predicate.
 */
export function getIntegerAll(
  thing: Thing,
  predicate: Url | UrlString
): number[] {
  const literalStrings = getLiteralAllOfType(thing, predicate, XSD.integer);

  return literalStrings
    .map((literalString) => deserializeInteger(literalString))
    .filter((potentialInteger) => potentialInteger !== null) as number[];
}

/**
 * @param thing The [[Thing]] to read a localised string value from.
 * @param predicate The given Predicate for which you want the localised string value.
 * @param locale The desired locale for the string value.
 * @returns A localised string value for the given Predicate, if present in `locale`, or null otherwise.
 */
export function getStringWithLocaleOne(
  thing: Thing,
  predicate: Url | UrlString,
  locale: string
): string | null {
  const localeStringMatcher = getLocaleStringMatcher(predicate, locale);

  const matchingQuad = findOne(thing, localeStringMatcher);

  if (matchingQuad === null) {
    return null;
  }

  return matchingQuad.object.value;
}

/**
 * @param thing The [[Thing]] to read the localised string values from.
 * @param predicate The given Predicate for which you want the localised string values.
 * @param locale The desired locale for the string values.
 * @returns The localised string values for the given Predicate.
 */
export function getStringWithLocaleAll(
  thing: Thing,
  predicate: Url | UrlString,
  locale: string
): string[] {
  const localeStringMatcher = getLocaleStringMatcher(predicate, locale);

  const matchingQuads = findAll(thing, localeStringMatcher);

  return matchingQuads.map((quad) => quad.object.value);
}

/**
 * @param thing The [[Thing]] to read a string value from.
 * @param predicate The given Predicate for which you want the string value.
 * @returns A string value for the given Predicate, if present, or null otherwise.
 */
export function getStringNoLocaleOne(
  thing: Thing,
  predicate: Url | UrlString
): string | null {
  const literalString = getLiteralOneOfType(thing, predicate, XSD.string);

  return literalString;
}

/**
 * @param thing The [[Thing]] to read the string values from.
 * @param predicate The given Predicate for which you want the string values.
 * @returns The string values for the given Predicate.
 */
export function getStringNoLocaleAll(
  thing: Thing,
  predicate: Url | UrlString
): string[] {
  const literalStrings = getLiteralAllOfType(thing, predicate, XSD.string);

  return literalStrings;
}

/**
 * @param thing The [[Thing]] to read a NamedNode value from.
 * @param predicate The given Predicate for which you want the NamedNode value.
 * @returns A NamedNode value for the given Predicate, if present, or null otherwise.
 * @ignore This should not be needed due to the other get*One() functions. If you do find yourself needing it, please file a feature request for your use case.
 */
export function getNamedNodeOne(
  thing: Thing,
  predicate: Url | UrlString
): NamedNode | null {
  const namedNodeMatcher = getNamedNodeMatcher(predicate);

  const matchingQuad = findOne(thing, namedNodeMatcher);

  if (matchingQuad === null) {
    return null;
  }

  return matchingQuad.object;
}

/**
 * @param thing The [[Thing]] to read the NamedNode values from.
 * @param predicate The given Predicate for which you want the NamedNode values.
 * @returns The NamedNode values for the given Predicate.
 * @ignore This should not be needed due to the other get*One() functions. If you do find yourself needing it, please file a feature request for your use case.
 */
export function getNamedNodeAll(
  thing: Thing,
  predicate: Url | UrlString
): NamedNode[] {
  const namedNodeMatcher = getNamedNodeMatcher(predicate);

  const matchingQuads = findAll(thing, namedNodeMatcher);

  return matchingQuads.map((quad) => quad.object);
}

/**
 * @param thing The [[Thing]] to read a Literal value from.
 * @param predicate The given Predicate for which you want the Literal value.
 * @returns A Literal value for the given Predicate, if present, or null otherwise.
 * @ignore This should not be needed due to the other get*One() functions. If you do find yourself needing it, please file a feature request for your use case.
 */
export function getLiteralOne(
  thing: Thing,
  predicate: Url | UrlString
): Literal | null {
  const literalMatcher = getLiteralMatcher(predicate);

  const matchingQuad = findOne(thing, literalMatcher);

  if (matchingQuad === null) {
    return null;
  }

  return matchingQuad.object;
}

/**
 * @param thing The [[Thing]] to read the Literal values from.
 * @param predicate The given Predicate for which you want the Literal values.
 * @returns The Literal values for the given Predicate.
 * @ignore This should not be needed due to the other get*All() functions. If you do find yourself needing it, please file a feature request for your use case.
 */
export function getLiteralAll(
  thing: Thing,
  predicate: Url | UrlString
): Literal[] {
  const literalMatcher = getLiteralMatcher(predicate);

  const matchingQuads = findAll(thing, literalMatcher);

  return matchingQuads.map((quad) => quad.object);
}

type QuadWithObject<Object extends Quad_Object> = Quad & { object: Object };
type Matcher<Object extends Quad_Object> = (
  quad: Quad
) => quad is QuadWithObject<Object>;

/**
 * @param thing The [[Thing]] to extract a Quad from.
 * @param matcher Callback function that returns a boolean indicating whether a given Quad should be included.
 * @returns First Quad in `thing` for which `matcher` returned true.
 */
function findOne<Object extends Quad_Object>(
  thing: Thing,
  matcher: Matcher<Object>
): QuadWithObject<Object> | null {
  for (const quad of thing) {
    if (matcher(quad)) {
      return quad;
    }
  }
  return null;
}

/**
 * @param thing The [[Thing]] to extract Quads from.
 * @param matcher Callback function that returns a boolean indicating whether a given Quad should be included.
 * @returns All Quads in `thing` for which `matcher` returned true.
 */
function findAll<Object extends Quad_Object>(
  thing: Thing,
  matcher: Matcher<Object>
): QuadWithObject<Object>[] {
  const matched: QuadWithObject<Object>[] = [];
  for (const quad of thing) {
    if (matcher(quad)) {
      matched.push(quad);
    }
  }
  return matched;
}

function getNamedNodeMatcher(predicate: Url | UrlString): Matcher<NamedNode> {
  const predicateNode = asNamedNode(predicate);

  const matcher = function matcher(
    quad: Quad
  ): quad is QuadWithObject<NamedNode> {
    return predicateNode.equals(quad.predicate) && isNamedNode(quad.object);
  };
  return matcher;
}

function getLiteralMatcher(predicate: Url | UrlString): Matcher<Literal> {
  const predicateNode = asNamedNode(predicate);

  const matcher = function matcher(
    quad: Quad
  ): quad is QuadWithObject<Literal> {
    return predicateNode.equals(quad.predicate) && isLiteral(quad.object);
  };
  return matcher;
}

type LiteralOfType<Iri> = Literal & {
  datatype: { value: Iri };
};
function getLiteralOfTypeMatcher(
  predicate: Url | UrlString,
  datatype: Iri
): Matcher<LiteralOfType<Iri>> {
  const predicateNode = asNamedNode(predicate);

  const matcher = function matcher(
    quad: Quad
  ): quad is QuadWithObject<LiteralOfType<Iri>> {
    return (
      predicateNode.equals(quad.predicate) &&
      isLiteral(quad.object) &&
      quad.object.datatype === datatype
    );
  };
  return matcher;
}

type LiteralLocaleString = Literal & {
  datatype: { value: typeof RDF.langString };
  language: string;
};
function getLocaleStringMatcher(
  predicate: Url | UrlString,
  locale: string
): Matcher<LiteralLocaleString> {
  const predicateNode = asNamedNode(predicate);

  const matcher = function matcher(
    quad: Quad
  ): quad is QuadWithObject<LiteralLocaleString> {
    return (
      predicateNode.equals(quad.predicate) &&
      isLiteral(quad.object) &&
      quad.object.datatype === RDF.langString &&
      quad.object.language.toLowerCase() === locale.toLowerCase()
    );
  };
  return matcher;
}

/**
 * @param thing The [Thing]] to read a Literal of the given type from.
 * @param predicate The given Predicate for which you want the Literal value.
 * @param literalType Set type of the Literal data.
 * @returns The stringified value for the given Predicate and type, if present, or null otherwise.
 */
function getLiteralOneOfType(
  thing: Thing,
  predicate: Url | UrlString,
  literalType: Iri
): string | null {
  const literalOfTypeMatcher = getLiteralOfTypeMatcher(predicate, literalType);

  const matchingQuad = findOne(thing, literalOfTypeMatcher);

  if (matchingQuad === null) {
    return null;
  }

  return matchingQuad.object.value;
}

/**
 * @param thing The [Thing]] to read the Literals of the given type from.
 * @param predicate The given Predicate for which you want the Literal values.
 * @param literalType Set type of the Literal data.
 * @returns The stringified values for the given Predicate and type.
 */
function getLiteralAllOfType(
  thing: Thing,
  predicate: Url | UrlString,
  literalType: Iri
): string[] {
  const literalOfTypeMatcher = getLiteralOfTypeMatcher(predicate, literalType);

  const matchingQuads = findAll(thing, literalOfTypeMatcher);

  return matchingQuads.map((quad) => quad.object.value);
}
