var tr = Object.defineProperty;

var or = (r, e, t) =>
  e in r
    ? tr(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
    : (r[e] = t);

var R = (r, e, t) => (or(r, typeof e != "symbol" ? e + "" : e, t), t),
  ur = (r, e, t) => {
    if (!e.has(r)) throw TypeError("Cannot " + t);
  },
  A = (r, e) => {
    if (Object(e) !== e)
      throw TypeError('Cannot use the "in" operator on this value');

    return r.has(e);
  };

var T = (r, e, t) => {
  if (e.has(r))
    throw TypeError("Cannot add the same private member more than once");

  e instanceof WeakSet ? e.add(r) : e.set(r, t);
};

var M = (r, e, t) => (ur(r, e, "access private method"), t);

/**

 * @license

 * Copyright Google LLC All Rights Reserved.

 *

 * Use of this source code is governed by an MIT-style license that can be

 * found in the LICENSE file at https://angular.io/license

 */

function z(r, e) {
  return Object.is(r, e);
}

/**

 * @license

 * Copyright Google LLC All Rights Reserved.

 *

 * Use of this source code is governed by an MIT-style license that can be

 * found in the LICENSE file at https://angular.io/license

 */

let n = null,
  S = !1,
  W = 1;

const P = /* @__PURE__ */ Symbol("SIGNAL");

function C(r) {
  const e = n;

  return (n = r), e;
}

function cr() {
  return n;
}

function nr() {
  return S;
}

const j = {
  version: 0,

  lastCleanEpoch: 0,

  dirty: !1,

  producerNode: void 0,

  producerLastReadVersion: void 0,

  producerIndexOfThis: void 0,

  nextProducerIndex: 0,

  liveConsumerNode: void 0,

  liveConsumerIndexOfThis: void 0,

  consumerAllowSignalWrites: !1,

  consumerIsAlwaysLive: !1,

  producerMustRecompute: () => !1,

  producerRecomputeValue: () => {},

  consumerMarkedDirty: () => {},

  consumerOnSignalRead: () => {},
};

function L(r) {
  if (S)
    throw new Error(
      typeof ngDevMode < "u" && ngDevMode
        ? "Assertion error: signal read during notification phase"
        : ""
    );

  if (n === null) return;

  n.consumerOnSignalRead(r);

  const e = n.nextProducerIndex++;

  if ((g(n), e < n.producerNode.length && n.producerNode[e] !== r && D(n))) {
    const t = n.producerNode[e];

    V(t, n.producerIndexOfThis[e]);
  }

  n.producerNode[e] !== r &&
    ((n.producerNode[e] = r),
    (n.producerIndexOfThis[e] = D(n) ? K(r, n, e) : 0)),
    (n.producerLastReadVersion[e] = r.version);
}

function ir() {
  W++;
}

function H(r) {
  if (!(D(r) && !r.dirty) && !(!r.dirty && r.lastCleanEpoch === W)) {
    if (!r.producerMustRecompute(r) && !dr(r)) {
      (r.dirty = !1), (r.lastCleanEpoch = W);

      return;
    }

    r.producerRecomputeValue(r), (r.dirty = !1), (r.lastCleanEpoch = W);
  }
}

function J(r) {
  if (r.liveConsumerNode === void 0) return;

  const e = S;

  S = !0;

  try {
    for (const t of r.liveConsumerNode) t.dirty || ar(t);
  } finally {
    S = e;
  }
}

function sr() {
  return (n == null ? void 0 : n.consumerAllowSignalWrites) !== !1;
}

function ar(r) {
  var e;

  (r.dirty = !0),
    J(r),
    (e = r.consumerMarkedDirty) == null || e.call(r.wrapper ?? r);
}

function lr(r) {
  return r && (r.nextProducerIndex = 0), C(r);
}

function pr(r, e) {
  if (
    (C(e),
    !(
      !r ||
      r.producerNode === void 0 ||
      r.producerIndexOfThis === void 0 ||
      r.producerLastReadVersion === void 0
    ))
  ) {
    if (D(r))
      for (let t = r.nextProducerIndex; t < r.producerNode.length; t++)
        V(r.producerNode[t], r.producerIndexOfThis[t]);

    for (; r.producerNode.length > r.nextProducerIndex; )
      r.producerNode.pop(),
        r.producerLastReadVersion.pop(),
        r.producerIndexOfThis.pop();
  }
}

function dr(r) {
  g(r);

  for (let e = 0; e < r.producerNode.length; e++) {
    const t = r.producerNode[e],
      a = r.producerLastReadVersion[e];

    if (a !== t.version || (H(t), a !== t.version)) return !0;
  }

  return !1;
}

function K(r, e, t) {
  var a;

  if ((F(r), g(r), r.liveConsumerNode.length === 0)) {
    (a = r.watched) == null || a.call(r.wrapper);

    for (let i = 0; i < r.producerNode.length; i++)
      r.producerIndexOfThis[i] = K(r.producerNode[i], r, i);
  }

  return r.liveConsumerIndexOfThis.push(t), r.liveConsumerNode.push(e) - 1;
}

function V(r, e) {
  var a;

  if (
    (F(r),
    g(r),
    typeof ngDevMode < "u" && ngDevMode && e >= r.liveConsumerNode.length)
  )
    throw new Error(
      `Assertion error: active consumer index ${e} is out of bounds of ${r.liveConsumerNode.length} consumers)`
    );

  if (r.liveConsumerNode.length === 1) {
    (a = r.unwatched) == null || a.call(r.wrapper);

    for (let i = 0; i < r.producerNode.length; i++)
      V(r.producerNode[i], r.producerIndexOfThis[i]);
  }

  const t = r.liveConsumerNode.length - 1;

  if (
    ((r.liveConsumerNode[e] = r.liveConsumerNode[t]),
    (r.liveConsumerIndexOfThis[e] = r.liveConsumerIndexOfThis[t]),
    r.liveConsumerNode.length--,
    r.liveConsumerIndexOfThis.length--,
    e < r.liveConsumerNode.length)
  ) {
    const i = r.liveConsumerIndexOfThis[e],
      y = r.liveConsumerNode[e];

    g(y), (y.producerIndexOfThis[i] = e);
  }
}

function D(r) {
  var e;

  return (
    r.consumerIsAlwaysLive ||
    (((e = r == null ? void 0 : r.liveConsumerNode) == null
      ? void 0
      : e.length) ?? 0) > 0
  );
}

function g(r) {
  r.producerNode ?? (r.producerNode = []),
    r.producerIndexOfThis ?? (r.producerIndexOfThis = []),
    r.producerLastReadVersion ?? (r.producerLastReadVersion = []);
}

function F(r) {
  r.liveConsumerNode ?? (r.liveConsumerNode = []),
    r.liveConsumerIndexOfThis ?? (r.liveConsumerIndexOfThis = []);
}

/**

 * @license

 * Copyright Google LLC All Rights Reserved.

 *

 * Use of this source code is governed by an MIT-style license that can be

 * found in the LICENSE file at https://angular.io/license

 */

function Q(r) {
  if ((H(r), L(r), r.value === G)) throw r.error;

  return r.value;
}

function fr(r) {
  const e = Object.create(hr);

  e.computation = r;

  const t = () => Q(e);

  return (t[P] = e), t;
}

const k = /* @__PURE__ */ Symbol("UNSET"),
  q = /* @__PURE__ */ Symbol("COMPUTING"),
  G = /* @__PURE__ */ Symbol("ERRORED"),
  hr = {
    ...j,

    value: k,

    dirty: !0,

    error: null,

    equal: z,

    producerMustRecompute(r) {
      return r.value === k || r.value === q;
    },

    producerRecomputeValue(r) {
      if (r.value === q) throw new Error("Detected cycle in computations.");

      const e = r.value;

      r.value = q;

      const t = lr(r);

      let a,
        i = !1;

      try {
        (a = r.computation.call(r.wrapper)),
          (i = e !== k && e !== G && r.equal.call(r.wrapper, e, a));
      } catch (y) {
        (a = G), (r.error = y);
      } finally {
        pr(r, t);
      }

      if (i) {
        r.value = e;

        return;
      }

      (r.value = a), r.version++;
    },
  };

/**

 * @license

 * Copyright Google LLC All Rights Reserved.

 *

 * Use of this source code is governed by an MIT-style license that can be

 * found in the LICENSE file at https://angular.io/license

 */

function mr() {
  throw new Error();
}

let wr = mr;

function vr() {
  wr();
}

/**

 * @license

 * Copyright Google LLC All Rights Reserved.

 *

 * Use of this source code is governed by an MIT-style license that can be

 * found in the LICENSE file at https://angular.io/license

 */

function Nr(r) {
  const e = Object.create(yr);

  e.value = r;

  const t = () => (L(e), e.value);

  return (t[P] = e), t;
}

function Cr() {
  return L(this), this.value;
}

function gr(r, e) {
  sr() || vr(), r.equal.call(r.wrapper, r.value, e) || ((r.value = e), Ir(r));
}

const yr = {
  ...j,

  equal: z,

  value: void 0,
};

function Ir(r) {
  r.version++, ir(), J(r);
}

/**

 * @license

 * Copyright 2024 Bloomberg Finance L.P.

 *

 * Licensed under the Apache License, Version 2.0 (the "License");

 * you may not use this file except in compliance with the License.

 * You may obtain a copy of the License at

 *

 *     http://www.apache.org/licenses/LICENSE-2.0

 *

 * Unless required by applicable law or agreed to in writing, software

 * distributed under the License is distributed on an "AS IS" BASIS,

 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

 * See the License for the specific language governing permissions and

 * limitations under the License.

 */

const s = Symbol("node");

let v, w, N;

var B;

((r) => {
  var a, i, Tr, X, O, Sr;

  class e {
    constructor(h, d = {}) {
      T(this, i);

      R(this, a);

      const p = Nr(h)[P];

      if (((this[s] = p), (p.wrapper = this), d)) {
        const m = d.equals;

        m && (p.equal = m),
          (p.watched = d[r.subtle.watched]),
          (p.unwatched = d[r.subtle.unwatched]);
      }
    }

    get() {
      if (!v(this))
        throw new TypeError(
          "Wrong receiver type for Signal.State.prototype.get"
        );

      return Cr.call(this[s]);
    }

    set(h) {
      if (!v(this))
        throw new TypeError(
          "Wrong receiver type for Signal.State.prototype.set"
        );

      if (nr())
        throw new Error(
          "Writes to signals not permitted during Watcher callback"
        );

      const d = this[s];

      gr(d, h);
    }
  }

  (a = s),
    (i = new WeakSet()),
    (Tr = function () {}),
    (v = (h) => A(i, h)),
    (r.State = e);

  class t {
    // Create a Signal which evaluates to the value returned by the callback.

    // Callback is called with this signal as the parameter.

    constructor(h, d) {
      T(this, O);

      R(this, X);

      const p = fr(h)[P];

      if (
        ((p.consumerAllowSignalWrites = !0),
        (this[s] = p),
        (p.wrapper = this),
        d)
      ) {
        const m = d.equals;

        m && (p.equal = m),
          (p.watched = d[r.subtle.watched]),
          (p.unwatched = d[r.subtle.unwatched]);
      }
    }

    get() {
      if (!w(this))
        throw new TypeError(
          "Wrong receiver type for Signal.Computed.prototype.get"
        );

      return Q(this[s]);
    }
  }

  (X = s),
    (O = new WeakSet()),
    (Sr = function () {}),
    (w = (h) => A(O, h)),
    (r.Computed = t),
    ((f) => {
      var rr, E, Or, I, U;

      function h(c) {
        let u,
          o = null;

        try {
          (o = C(null)), (u = c());
        } finally {
          C(o);
        }

        return u;
      }

      f.untrack = h;

      function d(c) {
        var u;

        if (!w(c) && !N(c))
          throw new TypeError(
            "Called introspectSources without a Computed or Watcher argument"
          );

        return (
          ((u = c[s].producerNode) == null
            ? void 0
            : u.map((o) => o.wrapper)) ?? []
        );
      }

      f.introspectSources = d;

      function b(c) {
        var u;

        if (!w(c) && !v(c))
          throw new TypeError(
            "Called introspectSinks without a Signal argument"
          );

        return (
          ((u = c[s].liveConsumerNode) == null
            ? void 0
            : u.map((o) => o.wrapper)) ?? []
        );
      }

      f.introspectSinks = b;

      function p(c) {
        if (!w(c) && !v(c))
          throw new TypeError("Called hasSinks without a Signal argument");

        const u = c[s].liveConsumerNode;

        return u ? u.length > 0 : !1;
      }

      f.hasSinks = p;

      function m(c) {
        if (!w(c) && !N(c))
          throw new TypeError(
            "Called hasSources without a Computed or Watcher argument"
          );

        const u = c[s].producerNode;

        return u ? u.length > 0 : !1;
      }

      f.hasSources = m;

      class Y {
        // When a (recursive) source of Watcher is written to, call this callback,

        // if it hasn't already been called since the last `watch` call.

        // No signals may be read or written during the notify.

        constructor(u) {
          T(this, E);

          T(this, I);

          R(this, rr);

          let o = Object.create(j);

          (o.wrapper = this),
            (o.consumerMarkedDirty = u),
            (o.consumerIsAlwaysLive = !0),
            (o.consumerAllowSignalWrites = !1),
            (o.producerNode = []),
            (this[s] = o);
        }

        // Add these signals to the Watcher's set, and set the watcher to run its

        // notify callback next time any signal in the set (or one of its dependencies) changes.

        // Can be called with no arguments just to reset the "notified" state, so that

        // the notify callback will be invoked again.

        watch(...u) {
          if (!N(this))
            throw new TypeError("Called unwatch without Watcher receiver");

          M(this, I, U).call(this, u);

          const o = this[s];

          o.dirty = !1;

          const x = C(o);

          for (const l of u) L(l[s]);

          C(x);
        }

        // Remove these signals from the watched set (e.g., for an effect which is disposed)

        unwatch(...u) {
          if (!N(this))
            throw new TypeError("Called unwatch without Watcher receiver");

          M(this, I, U).call(this, u);

          const o = this[s];

          g(o);

          let x = [];

          for (let l = 0; l < o.producerNode.length; l++)
            u.includes(o.producerNode[l].wrapper) &&
              (V(o.producerNode[l], o.producerIndexOfThis[l]), x.push(l));

          for (const l of x) {
            const _ = o.producerNode.length - 1;

            if (
              ((o.producerNode[l] = o.producerNode[_]),
              (o.producerIndexOfThis[l] = o.producerIndexOfThis[_]),
              o.producerNode.length--,
              o.producerIndexOfThis.length--,
              o.nextProducerIndex--,
              l < o.producerNode.length)
            ) {
              const er = o.producerIndexOfThis[l],
                $ = o.producerNode[l];

              F($), ($.liveConsumerIndexOfThis[er] = l);
            }
          }
        }

        // Returns the set of computeds in the Watcher's set which are still yet

        // to be re-evaluated

        getPending() {
          if (!N(this))
            throw new TypeError("Called getPending without Watcher receiver");

          return this[s].producerNode
            .filter((o) => o.dirty)
            .map((o) => o.wrapper);
        }
      }

      (rr = s),
        (E = new WeakSet()),
        (Or = function () {}),
        (I = new WeakSet()),
        (U = function (u) {
          for (const o of u)
            if (!w(o) && !v(o))
              throw new TypeError(
                "Called watch/unwatch without a Computed or State argument"
              );
        }),
        (N = (u) => A(E, u)),
        (f.Watcher = Y);

      function Z() {
        var c;

        return (c = cr()) == null ? void 0 : c.wrapper;
      }

      (f.currentComputed = Z),
        (f.watched = Symbol("watched")),
        (f.unwatched = Symbol("unwatched"));
    })(r.subtle || (r.subtle = {}));
})(B || (B = {}));

export { B as Signal };
