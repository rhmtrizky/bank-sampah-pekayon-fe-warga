/// <reference types="react" />

/**
 * Global type definitions
 */

declare namespace JSX {
  interface Element
    extends React.ReactElement<
      unknown,
      string | React.JSXElementConstructor<unknown>
    > {}
  interface IntrinsicElements extends React.JSX.IntrinsicElements {}
}
