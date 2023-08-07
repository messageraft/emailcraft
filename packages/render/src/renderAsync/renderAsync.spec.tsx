import * as React from 'react'
import { renderAsync } from './renderAsync'
import { Template } from '../test/Template'
import { Preview } from '../test/Preview'
import ReactDOMServer from 'react-dom/server'

const mockRenderToReadableStream = (
  component: React.ReactNode
  ): Promise<ReactDOMServer.ReactDOMServerReadableStream> => {
  const encoder = new TextEncoder()
  const markup = ReactDOMServer.renderToString(
    component as React.ReactElement
    )

  let done = false

  return Promise.resolve({
    allReady: Promise.resolve(),
    [Symbol.asyncIterator]: () => ({
      next: () => {
        if (done) {
          return Promise.resolve({ done: true, value: undefined })
        }

        done = true

        return Promise.resolve({
          done: false,
          value: encoder.encode(markup)
        })
      }
    })
  }) as any
}

describe('renderAsync using renderToStaticMarkup', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  it('converts a React component into HTML', async () => {
    const actualOutput = await renderAsync(<Template firstName="Petros" />)

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><h1>Welcome, Petros!</h1><img src=\\"img/test.png\\" alt=\\"test\\"/><p>Thanks for trying our product. We&#x27;re thrilled to have you on board!</p>"`
    )
  })

  it('converts a React component into PlainText', async () => {
    const actualOutput = await renderAsync(<Template firstName="Petros" />, {
      plainText: true
    })

    expect(actualOutput).toMatchInlineSnapshot(`
      "WELCOME, PETROS!

      Thanks for trying our product. We're thrilled to have you on board!"
    `)
  })

  it('converts to plain text and removes reserved ID', async () => {
    const actualOutput = await renderAsync(<Preview />, {
      plainText: true
    })

    expect(actualOutput).toMatchInlineSnapshot(
      `"THIS SHOULD BE RENDERED IN PLAIN TEXT"`
    )
  })
})

describe('renderAsync using renderToReadableStream', () => {
  const renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup
  const renderToReadableStream = ReactDOMServer.renderToReadableStream

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetModules()
    ;(ReactDOMServer.renderToStaticMarkup as unknown as undefined) = undefined
    ReactDOMServer.renderToReadableStream = mockRenderToReadableStream
  })

  afterEach(() => {
    ReactDOMServer.renderToStaticMarkup = renderToStaticMarkup
    ReactDOMServer.renderToReadableStream = renderToReadableStream
  })

  it('converts a React component into HTML', async () => {
    const actualOutput = await renderAsync(<Template firstName="Petros" />)

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><h1>Welcome, Petros!</h1><img src=\\"img/test.png\\" alt=\\"test\\"/><p>Thanks for trying our product. We&#x27;re thrilled to have you on board!</p>"`
    )
  })

  it('converts a React component into PlainText', async () => {
    const actualOutput = await renderAsync(<Template firstName="Petros" />, {
      plainText: true
    })

    expect(actualOutput).toMatchInlineSnapshot(`
      "WELCOME, PETROS!

      Thanks for trying our product. We're thrilled to have you on board!"
    `)
  })

  it('converts to plain text and removes reserved ID', async () => {
    const actualOutput = await renderAsync(<Preview />, {
      plainText: true
    })

    expect(actualOutput).toMatchInlineSnapshot(
      `"THIS SHOULD BE RENDERED IN PLAIN TEXT"`
    )
  })
})
