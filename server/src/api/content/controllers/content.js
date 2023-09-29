'use strict';

/**
 * A set of functions called "actions" for `content`
 */

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  async find(ctx, next) {
    try {
      const populate = ctx.query.populate
      let data 
      if (typeof (populate) == "string" && populate == "newContents"){
        data = await strapi
          .service("api::content.content")
          .getNewContents();
      } else {
        data = await strapi
          .service("api::content.content")
          .get(ctx.query);
      }
      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
  async sendPrompt(ctx, next){
    try {
      const data = ctx.request.body.data

      let prompt = "Create a JavaScript programming exercise with the description: " + data.description

      const schema = {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of the exercise"
          },
          "statement": {
            "type": "string",
            "description": "Statement for the exercise"
          },
          "solution": {
            "type": "string",
            "description": "Solution code for the exercise in JavaScript"
          },
          "tests": {
            "type": "array",
            "description": "Input, output tests to verify the student`s solution",
            "minItems": 3,
            "items": {
              "type": "object",
              "properties": {
                "input": {
                  "type": "string" ,
                  "description": "input for the test"
                },
                "expected": {
                  "type": "string" ,
                  "description": "expected output for the test"
                } 
              },
              "required": ["input", "expected"] 
            },
          } 
        },
        "required": ["name", "statement", "solution", "tests"]
      }
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages : [
          { role : "assistant" , content : "I am a teacher to help you create JavaScript programming exercises" } ,
          { role : "user" , content : prompt }],
        functions: [{ name: "set_exercise", parameters: schema }],
        function_call: { name: "set_exercise" }
      });
      ctx.body = chatCompletion.choices[0].message
    } catch (err){
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
  async sendEmail(ctx, next) {
    try {
      let data = ctx.request.body.data
      let data2 = await strapi
          .service("api::content.content")
          .sendEmail(data);
      ctx.body = data2
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  }
};
