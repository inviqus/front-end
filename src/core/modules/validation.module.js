"use strict";
/**
 * @summary Provides an interface for validation
 * @module Validation
 * @example <caption> how to inclued validation module </caption>
 * const validation = require("validation.module")
 */

/**
 * @description Determine whether email is valid.
 * @param {string} email - Users email
 * @return {boolean} - Email is valid
 */
module.exports.email = email => {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
};

/**
 * @description Determine whether pass is valid.
 * @param {string} pass - Users password
 * @return {boolean} - Pass is valid
 */
module.exports.pass = pass => {
	var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
	return re.test(pass.toLowerCase());
};

/**
 * @description Determine whether username is valid.
 * @param {string} username - Users username
 * @return {boolean} - Username is valid
 */
module.exports.username = username => {
	var re = /^[a-zA-Z0-9\-\_]+$/;
	return re.test(username.toLowerCase());
};
