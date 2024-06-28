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
    transition: 'background-color transparent !important',
  },
  'input:-webkit-autofill:focus': {
    transition: 'background-color transparent !important',
  },
})
