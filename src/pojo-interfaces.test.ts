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

import { describe, it, expect } from "@jest/globals";
import { dataset } from "@rdfjs/dataset";
import * as fc from "fast-check";
import { DataFactory } from "n3";
import {
  serializeBoolean,
  serializeDatetime,
  serializeDecimal,
  serializeInteger,
  xmlSchemaTypes,
} from "./datatypes";
import { fromRdfJsDataset, toRdfJsDataset } from "./pojo-interfaces";

describe("fromRdfJsDataset", () => {
  const fcNamedNode = fc.webUrl().map((url) => DataFactory.namedNode(url));
  const fcString = fc.string().map((value) => DataFactory.literal(value));
  const fcInteger = fc
    .integer()
    .map((value) =>
      DataFactory.literal(
        serializeInteger(value),
        DataFactory.namedNode(xmlSchemaTypes.integer)
      )
    );
  const fcDecimal = fc
    .float()
    .map((value) =>
      DataFactory.literal(
        serializeDecimal(value),
        DataFactory.namedNode(xmlSchemaTypes.decimal)
      )
    );
  const fcDatetime = fc
    .date()
    .map((value) =>
      DataFactory.literal(
        serializeDatetime(value),
        DataFactory.namedNode(xmlSchemaTypes.dateTime)
      )
    );
  const fcBoolean = fc
    .boolean()
    .map((value) =>
      DataFactory.literal(
        serializeBoolean(value),
        DataFactory.namedNode(xmlSchemaTypes.boolean)
      )
    );
  const fcLangString = fc
    .tuple(
      fc.string(),
      fc.oneof(fc.constant("nl-NL"), fc.constant("en-GB"), fc.constant("fr"))
    )
    .map(([value, lang]) => DataFactory.literal(value, lang));
  const fcArbitraryLiteral = fc
    .tuple(fc.string(), fc.webUrl())
    .map(([value, dataType]) =>
      DataFactory.literal(value, DataFactory.namedNode(dataType))
    );
  const fcLiteral = fc.oneof(
    fcString,
    fcInteger,
    fcDecimal,
    fcDatetime,
    fcBoolean,
    fcLangString,
    fcArbitraryLiteral
  );
  // To check: not sure whether this generates new blank nodes every time.
  const fcBlankNode = fc.constant(null).map(() => DataFactory.blankNode());
  const fcDefaultGraph = fc.constant(DataFactory.defaultGraph());
  const fcGraph = fc.oneof(fcDefaultGraph, fcNamedNode);
  const fcQuadSubject = fc.oneof(fcNamedNode, fcBlankNode);
  const fcQuadPredicate = fcNamedNode;
  const fcQuadObject = fc.oneof(fcNamedNode, fcLiteral, fcBlankNode);
  const fcQuad = fc
    .tuple(fcQuadSubject, fcQuadPredicate, fcQuadObject, fcGraph)
    .map(([subject, predicate, object, graph]) =>
      DataFactory.quad(subject, predicate, object, graph)
    );
  const fcTerm = fc.oneof(fcNamedNode, fcLiteral, fcBlankNode, fcQuad);
  const fcDataset = fc.set(fcQuad).map((quads) => dataset(quads));

  it("can represent all Quads", () => {
    const blankNode1 = DataFactory.blankNode();
    const blankNode2 = DataFactory.blankNode();
    const subject1Iri = "https://some.pod/resource#subject1";
    const subject1 = DataFactory.namedNode(subject1Iri);
    const subject2Iri = "https://some.pod/resource#subject2";
    const subject2 = DataFactory.namedNode(subject2Iri);
    const predicate1Iri = "https://some.vocab/predicate1";
    const predicate1 = DataFactory.namedNode(predicate1Iri);
    const predicate2Iri = "https://some.vocab/predicate2";
    const predicate2 = DataFactory.namedNode(predicate2Iri);
    const literalStringValue = "Some string";
    const literalString = DataFactory.literal(
      literalStringValue,
      DataFactory.namedNode(xmlSchemaTypes.string)
    );
    const literalLangStringValue = "Some lang string";
    const literalLangStringLocale = "en-gb";
    const literalLangString = DataFactory.literal(
      literalLangStringValue,
      literalLangStringLocale
    );
    const literalIntegerValue = "42";
    const literalInteger = DataFactory.literal(
      literalIntegerValue,
      DataFactory.namedNode(xmlSchemaTypes.integer)
    );
    const defaultGraph = DataFactory.defaultGraph();
    const acrGraphIri = "https://some.pod/resource?ext=acr";
    const acrGraph = DataFactory.namedNode(acrGraphIri);

    const quads = [
      DataFactory.quad(subject1, predicate1, literalString, defaultGraph),
      DataFactory.quad(subject1, predicate1, literalLangString, defaultGraph),
      DataFactory.quad(subject1, predicate1, literalInteger, defaultGraph),
      DataFactory.quad(subject1, predicate2, subject2, defaultGraph),
      DataFactory.quad(subject2, predicate1, blankNode1, acrGraph),
      DataFactory.quad(subject2, predicate1, blankNode2, acrGraph),
      DataFactory.quad(blankNode1, predicate1, literalString, acrGraph),
      DataFactory.quad(blankNode2, predicate1, literalString, acrGraph),
      DataFactory.quad(blankNode2, predicate1, literalInteger, acrGraph),
      DataFactory.quad(blankNode2, predicate2, literalInteger, acrGraph),
    ];
    const rdfJsDataset = dataset(quads);

    expect(fromRdfJsDataset(rdfJsDataset)).toStrictEqual({
      type: "Dataset",
      graphs: {
        default: {
          resolvedSubject: {
            [subject1Iri]: {
              url: subject1Iri,
              type: "Subject",
              predicates: {
                [predicate1Iri]: {
                  literals: {
                    [xmlSchemaTypes.string]: [literalStringValue],
                    [xmlSchemaTypes.integer]: [literalIntegerValue],
                  },
                  langStrings: {
                    [literalLangStringLocale]: [literalLangStringValue],
                  },
                },
                [predicate2Iri]: {
                  namedNodes: [subject2Iri],
                },
              },
            },
          },
          localSubject: {},
        },
        [acrGraphIri]: {
          resolvedSubject: {
            [subject2Iri]: {
              url: subject2Iri,
              type: "Subject",
              predicates: {
                [predicate1Iri]: {
                  blankNodes: [
                    {
                      [predicate1Iri]: {
                        literals: {
                          [xmlSchemaTypes.string]: [literalStringValue],
                        },
                      },
                    },
                    {
                      [predicate1Iri]: {
                        literals: {
                          [xmlSchemaTypes.string]: [literalStringValue],
                          [xmlSchemaTypes.integer]: [literalIntegerValue],
                        },
                      },
                      [predicate2Iri]: {
                        literals: {
                          [xmlSchemaTypes.integer]: [literalIntegerValue],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          localSubject: {},
        },
      },
    });
  });
});

describe("toRdfJsDataset", () => {
  const isNotEmpty = (value: object) => {
    if (typeof value !== "object") {
      return false;
    }
    if (value === null) {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return Object.keys(value).length > 0;
  };
  const fcLiterals = fc
    .dictionary(fc.webUrl(), fc.set(fc.string(), { minLength: 1 }))
    .filter(isNotEmpty);
  const fcLangStrings = fc
    .dictionary(
      fc.hexaString({ minLength: 1 }).map((str) => str.toLowerCase()),
      fc.set(fc.string(), { minLength: 1 })
    )
    .filter(isNotEmpty);
  const fcNamedNodes = fc.set(fc.webUrl(), { minLength: 1 });
  const fcLocalNodes = fc.set(fc.string(), { minLength: 1 });
  const fcObjects = fc
    .record(
      {
        literals: fcLiterals,
        langStrings: fcLangStrings,
        namedNodes: fcNamedNodes,
        localNodes: fcLocalNodes,
        // blankNodes: fcBlankNodes,
      },
      { withDeletedKeys: true }
    )
    .filter(isNotEmpty);
  const fcPredicates = fc.dictionary(fc.webUrl(), fcObjects).filter(isNotEmpty);
  // Unfortunately I haven't figured out how to generate the recursive blank node
  // structures with fast-check yet:
  // const fcPredicates = fc.letrec(tie => ({
  //   predicates: fc.dictionary(fc.webUrl(), tie("objects")).filter(isNotEmpty),
  //   objects: fc.record(
  //     {
  //       literals: fcLiterals,
  //       langStrings: fcLangStrings,
  //       namedNodes: fcNamedNodes,
  //       localNodes: fcLocalNodes,
  //       blankNodes: tie("blankNodes").filter(value => isNotEmpty(value as object)),
  //     }
  //   ),
  //   blankNodes: fc.option(tie("predicates"), { maxDepth: 2, depthIdentifier: "blankNode" }),
  //   // blankNodes: fc.oneof({ maxDepth: 1 }, tie("leaf"), tie("nodes")),
  //   // leaf: fc.constant({}),
  //   // nodes: tie("predicates"),
  // })).predicates;
  const fcResolvedSubject = fc
    .dictionary(
      fc.webUrl(),
      fc.record({
        type: fc.constant("Subject"),
        url: fc.webUrl(),
        predicates: fcPredicates,
      })
    )
    .map((resolvedSubject) => {
      Object.keys(resolvedSubject).forEach((resolvedSubjectIri) => {
        resolvedSubject[resolvedSubjectIri].url = resolvedSubjectIri;
      });
      return resolvedSubject;
    });
  const fcLocalSubject = fc
    .dictionary(
      fc.string(),
      fc.record({
        type: fc.constant("Subject"),
        name: fc.string(),
        predicates: fcPredicates,
      })
    )
    .map((localSubject) => {
      Object.keys(localSubject).forEach((localSubjectName) => {
        localSubject[localSubjectName].name = localSubjectName;
      });
      return localSubject;
    });
  const fcGraph = fc.oneof(
    fc.record({
      resolvedSubject: fcResolvedSubject.filter(isNotEmpty),
      localSubject: fcLocalSubject,
    }),
    fc.record({
      resolvedSubject: fcResolvedSubject,
      localSubject: fcLocalSubject.filter(isNotEmpty),
    })
  );
  const fcDataset = fc.record({
    type: fc.constant("Dataset"),
    graphs: fc.dictionary(
      fc.oneof(fc.constant("default"), fc.webUrl()),
      fcGraph
    ),
  });

  it("loses no data when serialising and deserialising to RDF/JS Datasets", () => {
    const runs = process.env.CI ? 100 : 1;
    expect.assertions(runs + 2);

    const fcResult = fc.check(
      fc.property(fcDataset, (dataset) => {
        expect(
          sortObject(fromRdfJsDataset(toRdfJsDataset(dataset as any)))
        ).toStrictEqual(sortObject(dataset));
      }),
      { numRuns: runs }
    );

    expect(fcResult.counterexample).toBeNull();
    expect(fcResult.failed).toBe(false);
  });
});

function sortObject(value: Record<string, any>): Record<string, any> {
  if (typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return [...value].sort();
  }
  if (value === null) {
    return value;
  }
  const keys = Object.keys(value);
  keys.sort();

  return keys.reduce(
    (newObject, key) => ({ ...newObject, [key]: sortObject(value[key]) }),
    {}
  );
}
