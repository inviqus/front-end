"use strict";

// TODO: Documentation

const configuration = require("app.config");

class Page {
	/**
	 * @summary Abstract class for routes
	 * @description Defines a basic interface for rendering, etc. for each route.
	 * @class
	 *
	 * @param {object} config - Page config
	 * @param {object} args - Arguments from the URL
	 *
	 * @returns {Page} Page instance
	 */
	constructor(config, args) {
		log.trace(`Creating instance of "${args[0]}" page`);
		this._config = config;
		this._name = "";
		this._template = null;
		this._components = null;
		this._args = args;
		this._templateDefault = require("routes/default/page.ejs");

		this.init();
	}

	// ----------------------------------------------------------------------------------------------
	// Public functions
	// ----------------------------------------------------------------------------------------------

	init() {
		this._components = require("components.js");
	}

	/**
	 * @summary Load
	 * @description das
	 */
	async load() {
		loader.show();
		log.trace(`[PENDING] PageLoad process "${this._args[0]}"`);

		// Render process
		try {
			await this.__render();
		} catch (e) {
			log.trace(`[FAILURE] PageLoad process "${path}"`);
			loader.hide();

			// We have global error
			if (e instanceof error.RequestError) throw e;

			// We have PageRenderError
			if (e instanceof error.PageRenderError) {
				let err = new error.PageLoadError(this._args[0], e.status, e.hash, e.note);
				APP.getRequest().redirect("/error/400");
				throw err;
			}
		}

		// Handlers
		this.__handlers();

		log.trace(`[SUCCESS] PageLoad process "${this._args[0]}"`);
		loader.hide();
	}

	// ----------------------------------------------------------------------------------------------
	// Private auto running fuctions (see this.load();)
	// ----------------------------------------------------------------------------------------------

	/**
	 * @summary todo
	 * @description Asynchronous function. May throw PageRenderError.
	 *
	 * @example <caption>Throw an PageRenderError.</caption>
	 * throw new error.PageRenderError()
	 */
	async __render() {
		// Render
		this._getRoot().innerHTML = this._templateDefault({
			_data: {
				requestedUrl: JSON.stringify(this._getRouteUrl(), null, "  "),
				args: JSON.stringify(this._getArgs(), null, "  "),
				localization: JSON.stringify(this._getLocalization(), null, "  ")
			}
		});
	}

	/**
	 * @summary Define all user events for elements.
	 * @description Synchronous function. Run after the __render async function.
	 *
	 * @example <caption>Function example</caption>
	 * document.getElementById("sign-in").addEventListener("click", () => {
	 * 	this._sendAuthorizationForm();
	 * });
	 */
	__handlers() {}

	// ----------------------------------------------------------------------------------------------
	// Private functions
	// ----------------------------------------------------------------------------------------------

	_getRoot() {
		let id = this._config.root || configuration.pages.root;
		return document.getElementById(id);
	}

	_getComponent() {
		return this._components;
	}

	_getLocalization() {
		return APP.getLocalization().getPhrases();
	}

	_getArgs() {
		return this._args;
	}

	_getRouteUrl() {
		return this._args[0];
	}

	renderContent() {}
}

module.exports = Page;
