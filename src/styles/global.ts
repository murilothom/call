import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },

  'input:-webkit-autofill': {
    transition: 'background-color 0s 600000s, color 0s 600000s !important',
  },
  'input:-webkit-autofill:focus': {
    transition: 'background-color 0s 600000s, color 0s 600000s !important',
  },
})
