/* eslint-env mocha */

import expect from 'expect.js'
import { resolve } from 'path'

import { gather } from '../src'

const basic = resolve.bind(null, __dirname, '../fixtures/basic-project')

describe('gather', () => {
  it('discovers the packages that paths belong to', async () => {
    const { project, unresolved } = await gather({
      projectRoot: basic(),
      modulePaths: [
        basic('index.js'),
        basic('node_modules/array-flatten/index.js'),
        basic('node_modules/left-pad/index.js'),
        basic('node_modules/left-pad/node_modules/repeat/index.js'),
      ],
    })

    expect(unresolved).to.be(null)
    expect(project)
      .to.have.property('name', 'basic-project')
      .and.have.property('version', '1.2.3')
      .and.have.property('licenses')
    expect(project.licenses).to.eql(['Apache-2.0'])
    expect(project.children).to.have.length(2)

    const flatten = project.children.find(c => c.name === 'array-flatten')
    expect(flatten)
      .to.be.an('object')
      .and.have.property('name', 'array-flatten')
      .and.have.property('version', '0.1.0')
      .and.have.property('licenses')
    expect(flatten.licenses).to.eql(['MIT'])
    expect(flatten.children).to.eql([])

    const leftpad = project.children.find(c => c.name === 'left-pad')
    expect(leftpad)
      .to.be.an('object')
      .and.have.property('name', 'left-pad')
      .and.have.property('version', '0.1.0')
      .and.have.property('licenses')
    expect(leftpad.licenses).to.eql(['Apache-2.0'])
    expect(leftpad.children).to.have.length(1)

    const repeat = leftpad.children[0]
    expect(repeat)
      .to.be.an('object')
      .and.have.property('name', 'repeat')
      .and.have.property('version', '0.2.0')
      .and.have.property('licenses')
    expect(repeat.licenses).to.eql(['UNKNOWN'])
    expect(repeat.children).to.have.length(0)
  })

  it('ignores packages that do not match a module path', async () => {
    const { project, unresolved } = await gather({
      projectRoot: basic(),
      modulePaths: [
        basic('index.js'),
        // basic('node_modules/array-flatten/index.js'),
        basic('node_modules/left-pad/index.js'),
        basic('node_modules/left-pad/node_modules/repeat/index.js'),
      ],
    })

    expect(unresolved).to.be(null)
    expect(project.children).to.have.length(1)
    expect(project.children[0]).to.have.property('name', 'left-pad')
    expect(project.children[0].children).to.have.length(1)
    expect(project.children[0].children[0]).to.have.property('name', 'repeat')
  })

  it('reports paths that do not match a package', async () => {
    const { unresolved } = await gather({
      projectRoot: basic(),
      modulePaths: [
        basic('index.js'),
        basic('node_modules/left-pad/index.js'),
        basic('node_modules/left-pad/node_modules/repeat/index.js'),
        basic('node_modules/unkown-dep/someOther.js'),
      ],
    })

    expect(unresolved).to.eql([basic('node_modules/unkown-dep/someOther.js')])
  })
})
