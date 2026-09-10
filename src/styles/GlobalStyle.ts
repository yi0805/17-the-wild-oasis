import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
:root {
  &, &.light-mode {
    color-scheme: light;
    --color-grey-0: #ffffff;
    --color-grey-50: #f5f7f5;
    --color-grey-100: #edf1ee;
    --color-grey-200: #dde4df;
    --color-grey-300: #c5cec8;
    --color-grey-400: #96a29b;
    --color-grey-500: #69766f;
    --color-grey-600: #4b5852;
    --color-grey-700: #2f3b35;
    --color-grey-800: #1c2722;
    --color-grey-900: #111a16;

    --color-brand-50: #eef7f3;
    --color-brand-100: #d8ebe2;
    --color-brand-200: #b4d7c6;
    --color-brand-500: #347b62;
    --color-brand-600: #28634f;
    --color-brand-700: #205041;
    --color-brand-800: #193f34;
    --color-brand-900: #123128;

    --color-blue-100: #e8f1f7;
    --color-blue-700: #315f7c;
    --color-green-100: #e4f3eb;
    --color-green-700: #2e6b4a;
    --color-yellow-100: #fbf0d9;
    --color-yellow-700: #825b24;
    --color-silver-100: #edf0ee;
    --color-silver-700: #56615c;
    --color-indigo-100: #eeeafa;
    --color-indigo-700: #65558e;
    --color-red-100: #fbe9e7;
    --color-red-700: #a94442;
    --color-red-800: #873533;

    --color-app-background: #f5f7f5;
    --color-surface: #ffffff;
    --color-surface-secondary: #f8faf8;
    --color-surface-elevated: #ffffff;
    --color-text-primary: #1c2722;
    --color-text-secondary: #69766f;
    --color-border-subtle: #e3e9e5;
    --color-border-strong: #cbd4ce;
    --color-accent: #b68a4a;
    --color-accent-soft: #f7eedf;
    --color-on-brand: #ffffff;
    --color-on-danger: #ffffff;
    --color-danger-surface: #a94442;
    --color-danger-hover: #873533;
    --color-focus-ring: rgba(52, 123, 98, 0.24);
    --backdrop-color: rgba(17, 26, 22, 0.42);

    --shadow-sm: 0 1px 2px rgba(25, 48, 38, 0.05);
    --shadow-md: 0 1.2rem 3.2rem rgba(25, 48, 38, 0.09);
    --shadow-lg: 0 2.4rem 5.6rem rgba(17, 32, 25, 0.18);

    --image-grayscale: 0;
    --image-opacity: 100%;
  }

  &.dark-mode {
    color-scheme: dark;
    --color-grey-0: #17201d;
    --color-grey-50: #101715;
    --color-grey-100: #202b27;
    --color-grey-200: #2d3a35;
    --color-grey-300: #3d4c46;
    --color-grey-400: #6d7c75;
    --color-grey-500: #9aa9a2;
    --color-grey-600: #bac6c0;
    --color-grey-700: #d9e2dd;
    --color-grey-800: #edf2ef;
    --color-grey-900: #f7faf8;

    --color-brand-50: #edf8f3;
    --color-brand-100: #24483b;
    --color-brand-200: #315e4d;
    --color-brand-500: #63a98d;
    --color-brand-600: #34735b;
    --color-brand-700: #2b604c;
    --color-brand-800: #326451;
    --color-brand-900: #284f41;

    --color-blue-100: #1e3543;
    --color-blue-700: #a9d0e7;
    --color-green-100: #1f3b2f;
    --color-green-700: #a8d8bd;
    --color-yellow-100: #44351f;
    --color-yellow-700: #efd39d;
    --color-silver-100: #2b3531;
    --color-silver-700: #c4cec9;
    --color-indigo-100: #342f49;
    --color-indigo-700: #cfc4eb;
    --color-red-100: #462827;
    --color-red-700: #efaaa6;
    --color-red-800: #c97874;

    --color-app-background: #101715;
    --color-surface: #17201d;
    --color-surface-secondary: #1b2622;
    --color-surface-elevated: #202b27;
    --color-text-primary: #edf2ef;
    --color-text-secondary: #9aa9a2;
    --color-border-subtle: #27342f;
    --color-border-strong: #3b4a44;
    --color-accent: #d0aa6d;
    --color-accent-soft: #3c3223;
    --color-on-brand: #ffffff;
    --color-on-danger: #ffffff;
    --color-danger-surface: #843e3b;
    --color-danger-hover: #6f3331;
    --color-focus-ring: rgba(99, 169, 141, 0.3);
    --backdrop-color: rgba(5, 10, 8, 0.72);

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.25);
    --shadow-md: 0 1.2rem 3.2rem rgba(0, 0, 0, 0.28);
    --shadow-lg: 0 2.4rem 5.6rem rgba(0, 0, 0, 0.4);

    --image-grayscale: 6%;
    --image-opacity: 94%;
  }

  --border-radius-tiny: 4px;
  --border-radius-sm: 7px;
  --border-radius-md: 10px;
  --border-radius-lg: 14px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  font-size: 62.5%;
}

body {
  min-height: 100vh;
  background-color: var(--color-app-background);
  color: var(--color-grey-700);
  font-family: "Segoe UI", Inter, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.6rem;
  line-height: 1.5;
  transition: color 0.2s ease, background-color 0.2s ease;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-100);
  color: var(--color-grey-500);
}

input:focus-visible,
button:focus-visible,
textarea:focus-visible,
select:focus-visible,
a:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-focus-ring);
}

button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

img {
  max-width: 100%;
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

::selection {
  background-color: var(--color-brand-200);
  color: var(--color-grey-900);
}

* {
  scrollbar-color: var(--color-grey-300) transparent;
  scrollbar-width: thin;
}
`;

export default GlobalStyle;
