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

import { foaf, schema } from "rdf-namespaces";
import {
  fetchLitDataset,
  setThing,
  getThingOne,
  getStringUnlocalizedOne,
  setDatetime,
  setStringUnlocalized,
  saveLitDatasetAt,
} from "./index";

describe("End-to-end tests", () => {
  it("should be able to read and update data in a Pod", async () => {
    const randomNick = "Random nick " + Math.random();

    const dataset = await fetchLitDataset(
      "https://lit-e2e-test.inrupt.net/public/lit-solid-core-test.ttl"
    );
    const existingThing = getThingOne(
      dataset,
      "https://lit-e2e-test.inrupt.net/public/lit-solid-core-test.ttl#thing1"
    );

    expect(getStringUnlocalizedOne(existingThing, foaf.name)).toBe(
      "Thing for first end-to-end test"
    );

    let updatedThing = setDatetime(
      existingThing,
      schema.dateModified,
      new Date()
    );
    updatedThing = setStringUnlocalized(updatedThing, foaf.nick, randomNick);

    const updatedDataset = setThing(dataset, updatedThing);
    const savedDataset = await saveLitDatasetAt(
      "https://lit-e2e-test.inrupt.net/public/lit-solid-core-test.ttl",
      updatedDataset
    );

    const savedThing = getThingOne(
      savedDataset,
      "https://lit-e2e-test.inrupt.net/public/lit-solid-core-test.ttl#thing1"
    );
    expect(getStringUnlocalizedOne(savedThing, foaf.name)).toBe(
      "Thing for first end-to-end test"
    );
    expect(getStringUnlocalizedOne(savedThing, foaf.nick)).toBe(randomNick);
  });
});
