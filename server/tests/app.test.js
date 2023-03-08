const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");

jest.setTimeout(15000)

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await cleanupStrapi();
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});

const {userTests} = require("./auth");
userTests()

const {questionTests, questionErrorTests} = require('./question');
questionTests.questionTests()
questionErrorTests.questionErrorTests()

const {expositiveTests, expositiveErrorTests} = require('./expositive');
expositiveTests.expositiveTests()
expositiveErrorTests.expositiveErrorTests()

const {evaluativeTests, evaluativeErrorTests} = require('./evaluative');
evaluativeTests.evaluativeTests()
evaluativeErrorTests.evaluativeErrorTests()

const {courseTests, courseErrorTests} = require('./course');
courseTests.courseTests()
courseErrorTests.courseErrorTests()

const {studentTests, studentErrorTests} = require('./student');
studentTests.studentTests()
studentErrorTests.studentErrorTests()

const {classTests, classErrorTests} = require('./class');
classTests.classTests()
classErrorTests.classErrorTests()

const {occurrenceTests, occurrenceErrorTests} = require('./occurrence');
occurrenceTests.occurrenceTests()
occurrenceErrorTests.occurrenceErrorTests()

const {statusTests, statusErrorTests} = require('./status');
statusTests.statusTests()
statusErrorTests.statusErrorTests()

studentTests.getCourses()




