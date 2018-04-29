"use strict";

// TODO: Documentation

class Router {
	constructor() {
		this._pages = null;
		this._routes = [];
		this._current = null;
	}

	init() {
		// Load all page generators
		this._pages = require("pages");

		// Create routes
		for (let page in this._pages) {
			this._routes.push({
				pattern: new RegExp("^" + page.replace(/:\w+/g, "(\\w+)") + "$"),
				generator: this._pages[page]
			});
		}
	}

	/**
	 * @summary Search requested path and load suitable page (or 404)
	 * @description Gets requested path and checks all route patterns via regex.
	 *
	 * @param {string} path
	 */
	async route(path) {
		// Try to find suitable page pattern & take args
		let args;
		let i = this._routes.length;
		while (i--) {
			let args = path.match(this._routes[i].pattern);
			if (args) break;
		}
		// Page does not exist
		if (i === -1) return APP.getRequest().redirect("/error/404");

		// Is Authorised
		if (!(path.match(/\/authorization\/.*/) || path.match(/\/error\/\d{3}/))) {
			let authorization = await APP._authorization.isAuthorized();
			if (authorization.status === 403)
				return APP.getRequest().redirect("/login");
		}

		// Run load process
		log.trace(`[PENDING] Routing to ${path}`);
		loader.show();
		// Create page instance with its config & args
		this._current = new this._routes[i].generator.page(
			this._routes[i].generator.config,
			args
		);

		// Async rendering
		this._current
			.renderPromise()
			.then(() => {
				log.trace(`[SUCCESS] Routing to ${path}`);
				loader.hide();
			})
			.catch((status = 400) => {
				log.trace(`[FAILURE] Routing to ${path}`);
				loader.hide();
				// Catch all possible statuses from the server
				if (status === 400) APP.getRequest().redirect("/error/400");
				if (status === 500) APP.getRequest().redirect("/error/500");
			});
	}
}

module.exports = Router;
