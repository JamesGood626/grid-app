module.exports = 'test-file-stub'

// The moduleNameMapper section works a bit like webpack
// rules, and tells Jest how to handle imports. You are
// mainly concerned here with mocking static file imports,
// which Jest can’t handle. A mock is a dummy module that
// is used instead of the real module inside tests. It is
// good when you have something that you can’t or don’t want
// to test. You can mock anything, and here you are mocking
// assets rather than code. For stylesheets you need to use
// the package identity-obj-proxy. For all other assets you
// need to use a manual mock called fileMock.js. You need to
// create this yourself. The convention is to create a directory
// called __mocks__ in the root directory for this. Note the pair
// of double underscores in the name.
