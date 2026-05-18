'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const admins = await strapi.db.query('admin::user').findMany();
    if (admins.length === 0) {
      await strapi.admin.services.user.create({
        firstname: process.env.STRAPI_FIRSTNAME,
        lastname: process.env.STRAPI_LASTNAME,
        email: process.env.STRAPI_EMAIL,
        password: process.env.STRAPI_PASS,
        isActive: true,
        roles: [1],
      });
    }

    const roleService = strapi.service('plugin::users-permissions.role');

    let teacherRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'teacher' } });
    if (!teacherRole) {
      teacherRole = await roleService.createRole({
        name: 'Teacher',
        description: 'Role of Teacher',
        type: 'teacher',
      });
    }

    let studentRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'student' } });
    if (!studentRole) {
      teacherRole = await roleService.createRole({
        name: 'Student',
        description: 'Role for Students',
        type: 'student',
      });
    }

    const teacherPermissions = [
      { action: 'api::class.class.find' },
      { action: 'api::class.class.findOne' },
      { action: 'api::class.class.create' },
      { action: 'api::class.class.update' },
      { action: 'api::class.class.delete' },
      { action: 'api::course.course.find' },
      { action: 'api::course.course.findOne' },
      { action: 'api::course.course.update' },
      { action: 'api::course.course.delete' },
      { action: 'api::evaluative.evaluative.find' },
      { action: 'api::course.course.create' },
      { action: 'api::evaluative.evaluative.findOne' },
      { action: 'api::evaluative.evaluative.create' },
      { action: 'api::evaluative.evaluative.update' },
      { action: 'api::expositive.expositive.find' },
      { action: 'api::expositive.expositive.findOne' },
      { action: 'api::expositive.expositive.create' },
      { action: 'api::expositive.expositive.update' },
      { action: 'api::expositive.expositive.delete' },
      { action: 'api::occurrence.occurrence.find' },
      { action: 'api::evaluative.evaluative.delete' },
      { action: 'api::occurrence.occurrence.findOne' },
      { action: 'api::occurrence.occurrence.create' },
      { action: 'api::occurrence.occurrence.update' },
      { action: 'api::occurrence.occurrence.delete' },
      { action: 'api::question.question.find' },
      { action: 'api::question.question.findOne' },
      { action: 'api::question.question.create' },
      { action: 'api::question.question.update' },
      { action: 'api::question.question.delete' },
      { action: 'api::status.status.find' },
      { action: 'api::status.status.findOne' },
      { action: 'api::status.status.create' },
      { action: 'api::status.status.update' },
      { action: 'api::status.status.delete' },
      { action: 'api::student.student.find' },
      { action: 'api::student.student.findOne' },
      { action: 'api::student.student.create' },
      { action: 'api::student.student.update' },
      { action: 'api::student.student.delete' },
      { action: 'plugin::upload.content-api.find' },
      { action: 'plugin::upload.content-api.findOne' },
      { action: 'plugin::upload.content-api.destroy' },
      { action: 'plugin::upload.content-api.upload' },
      { action: 'plugin::users-permissions.user.create' },
      { action: 'plugin::users-permissions.user.update' },
      { action: 'plugin::users-permissions.user.find' },
      { action: 'plugin::users-permissions.user.findOne' },
      { action: 'plugin::users-permissions.user.destroy' },
      { action: 'plugin::users-permissions.user.me' },
      { action: 'plugin::users-permissions.role.findOne' },
      { action: 'plugin::users-permissions.role.find' },
      { action: 'api::content.content.find' },
      { action: 'api::content.content.sendPrompt' },
      { action: 'api::content.content.sendEmail' },
    ];

    const studentPermissions = [
      { action: 'api::course.course.find' },
      { action: 'api::course.course.findOne' },
      { action: 'api::question.question.find' },
      { action: 'api::question.question.findOne' },
      { action: 'api::status.status.create' },
      { action: 'api::status.status.update' },
      { action: 'plugin::users-permissions.user.find' },
      { action: 'plugin::users-permissions.user.findOne' },
      { action: 'plugin::users-permissions.user.me' },
      { action: 'plugin::users-permissions.role.findOne' },
      { action: 'plugin::users-permissions.role.find' },
    ];

    for (const permission of teacherPermissions) {
      const exists = await strapi.query('plugin::users-permissions.permission').findOne({
        where: {
          role: teacherRole.id,
          action: permission.action,
        },
      });

      if (!exists) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: permission.action,
            role: teacherRole.id,
          },
        });
      }
    }

    for (const permission of studentPermissions) {
      const exists = await strapi.query('plugin::users-permissions.permission').findOne({
        where: {
          role: studentRole.id,
          action: permission.action,
        },
      });

      if (!exists) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: permission.action,
            role: studentRole.id,
          },
        });
      }
    }

    let newUser;
    let newTeacher;
    const users = await strapi.query('plugin::users-permissions.user').findMany();
    if (users.length === 0) {

      newTeacher = await strapi.plugin('users-permissions').service('user').add({
        username: 'Teacher Lastname',
        email: 'teachertest@gmail.com',
        password: '1234567',
        confirmed: true,
        provider: 'local',
        role: teacherRole.id,
      });

      newUser = await strapi.plugin('users-permissions').service('user').add({
        username: 'Student Lastname',
        email: 'studenttest@gmail.com',
        password: '123456',
        confirmed: true,
        provider: 'local',
        role: studentRole.id,
      });
    }

    const classes = await strapi.query('api::class.class').findMany();
    const occurrences = await strapi.query('api::occurrence.occurrence').findMany();

    let klass;
    if (classes.length === 0 && occurrences.length === 0) {
      klass = await strapi.entityService.create('api::class.class', {
        data: {
          name: 'Sample Class',
          delay: 0,
          author: newTeacher.id
        },
      });

      const occurrence = await strapi.entityService.create('api::occurrence.occurrence', {
        data: {
          year: 2026,
          startDate: '2026-05-01',
          endDate: '2026-07-01',
          classes: [klass.id],
          author: newTeacher.id
        },
      });
    }

    const students = await strapi.db.query('api::student.student').findMany();
    if (students.length === 0) {
      await strapi.entityService.create('api::student.student', {
        data: {
          name: 'Student Lastname',
          user: newUser.id,
          class: klass.id
        }
      });
    }
  }
};
