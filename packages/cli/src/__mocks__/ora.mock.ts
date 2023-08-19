const texts: string[] = []

const createMockOra = () => ({
  start: jest.fn(),
  set text(text: string) {
    texts.push(text)
  },
  succeed: jest.fn(),
  stopAndPersist: jest.fn(),
  fail: jest.fn()
})

let mockOra: ReturnType<typeof createMockOra> = createMockOra()

jest.mock('ora', () => {
  mockOra = createMockOra()
  return () => mockOra
})

beforeEach(() => {
  mockOra.start.mockImplementation(function (this: any) {
    return this
  })

  mockOra.succeed.mockImplementation(function (this: any) {
    return this
  })

  mockOra.stopAndPersist.mockImplementation(function (this: any) {
    return this
  })

  mockOra.fail.mockImplementation(function (this: any) {
    return this
  })
})

export { mockOra }
