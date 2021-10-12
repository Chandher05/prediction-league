`use strict`

module.exports = {
	STATUS_CODE: {
		SUCCESS_STATUS: 200,
		CREATED_SUCCESSFULLY_STATUS: 201,
		ACCEPTED_STATUS: 202,
		NO_CONTENT_STATUS: 204,
		BAD_REQUEST_ERROR_STATUS: 400,
		UNAUTHORIZED_ERROR_STATUS: 401,
		FORBIDDEN_ERROR_STATUS: 403,
		NOT_FOUND_STATUS: 404,
		CONFLICT_ERROR_STATUS: 409,
		UNPROCESSABLE_ENTITY_STATUS: 422,
		INTERNAL_SERVER_ERROR_STATUS: 500,
		MOVED_PERMANENTLY: 301,
	},
	MESSAGES: {
		USER_NOT_FOUND: 'User not found',
		USER_ALREADY_EXISTS: 'Username is taken',
		AUTHORIZATION_FAILED: 'Authorization failed',
		USER_VALUES_MISSING: 'Email must be provided',
	}
}