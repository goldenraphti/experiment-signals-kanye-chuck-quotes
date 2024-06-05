# Signals experimentation

- using signal-polyfill

  - https://github.com/tc39/proposal-signals
  - https://github.com/proposal-signals/signal-polyfill/tree/main
  - awesome (but deep dive) article from the gang behind the standardinzation group for TC39: https://eisenbergeffect.medium.com/a-tc39-proposal-for-signals-f0bedd37a335

- Code for actual polyfill:
  - signal: https://www.npmjs.com/package/signal-polyfill?activeTab=code
  - effect: https://github.com/proposal-signals/signal-polyfill/tree/main?tab=readme-ov-file#creating-a-simple-effect

## Random thoughts

- another model for reactivity, different than hooks, easier I think. More like what we think of reactivity when we start coding I'd believe. More intuitive.

- avoid function callback hell. You set your variable similarly to React hook
  React: setState("") & then setQuote("blabla")
  Signal: new Signal.State("") & then quote.set("blabla")

DOM API:
displayQuote(saveQuote(displayNewQuote(fetchQuote))); // exagerating, but you get the gist of it

Signal

```
effect(() => displayQuote(newQuote))
effect(() => displaySavedQuotes(listSavedQuotes))
```

Called automatically whenever it's modified

Computed values.
If have variables depending of other variables, use Signal.Computed, so it updates automatically, without effect.
Once again, it's very close to what we would expect when we started learning coding I think.

```
var a = 0;
var b = a * 2;
// b = 0
a = 1
// with signals: b = 2; It became reactive.
```

```
const quotesAmount = new Signal.Computed(quotesList.get().length);
```

Easier control of side effect, standardized in the browser.
If it's just a one place one flow changes script, then not extremely useful VS cascade hell, just functions calling functions would be enough.
But when start having variables that can impact other places, in other files, then it can be very tedious in vanilla JS to achieve this. You quickly end up spaghetti code.
With signals it ends up easier to read & understand (no callback hell), and less chances to keep state in sync (since it takes care of it automatically);

Your variables become automatically reactive. Which is great.
Nevertheless, this is JS side. Your DOM isn't JS. So you still need to connect some functions to the effect in order to keep your DOM in sync and have your changes reflected in the UI. Which is a difference VS the JS frameworks which makes this part easy, leveraging jsx for example. But it becomes much easier. And we could imagine it will make their work much easier too, and decrease the libraries sizes since the reactivity part will be made natively by the browser.

- State - derived state - effect
- old concept
- all frameworks except React
- React doesn't like it because it goes against it's philosophy, and React thought leadership has always felt they were right and others were wrong, kinda dogma-style. And here Signals bring in mutation, when React is all about pure functions (when I hear pure, in life, I want to puke).
- React is 1 way data flow, top-down, no-mutation, no distinction between first render and next renders.
- Signals are about fine-grained reactivity. Not all components need to render because 1 variable has changed (no props drilling)
- Signals = only state relationships. Independant of any component rendering system (hence why the "effect" method is not part of the proposal specs (yet?),. It is thought that JS frameworks themselves should take care of it and ajust it to their own rendering mechanisms.)
- Biggest wins: perf, tracability, readibility (see SolidJS devtools. Click a variable and visualize the dependancy graph, it shows sources & observers, direct & indirect)

## Concept

The signal concept is neither Push, nor pull, it's a lazy "Push Then Pull". It marks as "dirty" the sink, but avoid doing recalculations until necessary.

```
effect(() => node.textContent = parity.get());
// The effect's callback is run and the node's text is updated with "odd"
// The effect watches the callback's source (parity) for dirty changes.

counter.set(2);
// The counter dirties its sinks, resulting in the effect being
// marked as potentially dirty, so a "pull" is scheduled.
// The scheduler begins to re-evaluate the effect callback by pulling parity.
// parity begins to evaluate by pulling isEven.
// isEven pulls counter, resulting in a changed value for isEven.
// Because isEven has changed, parity must be re-computed.
// Because parity has changed, the effect runs and the text updates to "even"

counter.set(4);
// The counter dirties its sinks, resulting in the effect being
// marked as potentially dirty, so a "pull" is scheduled.
// The scheduler begins to re-evaluate the effect callback by pulling parity.
// parity begins to evaluate by pulling isEven.
// isEven pulls counter, resulting in the same value for isEven as before.
// isEven is marked clean.
// Because isEven is clean, parity is marked clean.
// Because parity is clean, the effect doesn't run and the text is unaffected.
```

- used in React -> less re-renders since not rerun the function each time, simply the variable updates itself.
- BUT it's a change in the mental model & forces you to re-think how to write your code, since the function does not re-render. Therefore, ternary operators for instance do not work.

## Resources

Cool Youtube video:

- Disclaimer, extremely cringe clickbaity thumbnail & title, but the rest is good. Explaining the article for the standardized Signals: https://www.youtube.com/watch?v=JvE_xQVIFF0

- youtube using signals-preact library in react, showing how to use them AND why it's better performance wise than hooks since you do not need to lift up state and re-render everything under the closest common parent component and all its children components each time a shared variable updates: https://www.youtube.com/watch?v=SO8lBVWF2Y8
