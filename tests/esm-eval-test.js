/*global System, beforeEach, afterEach, describe, it*/

import { expect } from "mocha-es6";

import { getSystem, removeSystem } from "lively.modules/src/system.js";
import { runEval } from "../index.js";

var dir = System.normalizeSync("lively.vm/tests/test-resources/"),
    testProjectDir = dir + "es6-project/",
    module1 = testProjectDir + "file1.js",
    module2 = testProjectDir + "file2.js",
    module3 = testProjectDir + "file3.js",
    module4 = testProjectDir + "file4.js";

describe("eval", () => {

  var S;
  beforeEach(function() {
    S = getSystem('test', { baseURL: dir });
    return S.import(module1);
  });

  afterEach(() => removeSystem("test"));

  it("inside of module", async () => {
    var result = await runEval("1 + z + x", {System: S, targetModule: module1});
    expect(result.value).equals(6)
  });

  it("sets this", async () => {
    var result = await runEval("1 + this.x", {System: S, targetModule: module1, context: {x: 2}});
    expect(result.value).equals(3);
  })

  it("**", () =>
    S.import(module1)
      .then(() => runEval("z ** 4", {System: S, targetModule: module1})
      .then(result => expect(result).property("value").to.equal(16))));

  it("awaits async function", async () => {
    await S.import(module4);
    var result = await runEval("await foo(3)", {System: S, targetModule: module4});
    await expect(result).property("value").to.equal(3);
  })

  it("nests await", async () => {
    await S.import(module4)
    var result = await runEval("await ('a').toUpperCase()", {System: S, targetModule: module4});
    expect(result).property("value").to.equal("A")
  })

});
