const expect = require('chai').expect
const server = require('../index')

const expected = {
  myapplication: [{
    version: '1.0',
    lastcommitsha: 'abcdef01234567890',
    description: 'ciao come va'
  }]
}

describe('test', () => {
  it('returns expected payload', () => {
    expect(expected.myapplication[0].version).to.equal('1.0')
  })
})

