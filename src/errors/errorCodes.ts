export const errorCodes = {
  // Auth Domain
  auth: {
    USER_ALREADY_EXISTS: "auth.user.already.exists",
    USER_NOT_FOUND: "auth.user.not.found",
    INVALID_CREDENTIALS: "auth.invalid.credentials",
    NO_TOKEN_PROVIDED: "auth.no.token.provided",
    INVALID_TOKEN_FORMAT: "auth.invalid.token.format",
    TOKEN_EXPIRED: "auth.token.expired",
    INVALID_TOKEN: "auth.invalid.token",
    AUTHENTICATION_FAILED: "auth.authentication.failed",
  },
  // Stocks Domain
  stocks: {
    SEARCH_TERM_REQUIRED_OR_INVALID: "stocks.search.term.required.or.invalid",
    STOCK_NOT_FOUND: "stocks.not.found",
    CANDLE_API_KEY_NOT_CONFIGURED: "stocks.candle.api.key.not.configured",
    CANDLE_INVALID_INTERVAL: "stocks.candle.invalid.interval",
    CANDLE_INVALID_OUTPUTSIZE: "stocks.candle.invalid.outputsize",
    CANDLE_API_RATE_LIMIT_EXCEEDED: "stocks.candle.api.rate.limit.exceeded",
    CANDLE_API_CONNECTION_ERROR: "stocks.candle.api.connection.error",
    CANDLE_NO_DATA_RETURNED: "stocks.candle.no.data.returned",
  },
  // Portfolios Domain
  portfolio: {
    PORTFOLIO_NAME_REQUIRED: "portfolio.name.required",
    PORTFOLIO_ID_REQUIRED: "portfolio.id.required",
    PORTFOLIO_ALREADY_EXISTS: "portfolio.already.exists",
    PORTFOLIO_NOT_FOUND: "portfolio.not.found",
  },
  // General Domain
  general: {
    BAD_REQUEST: "general.bad.request",
  },
  // Server Domain
  server: {
    INTERNAL_SERVER_ERROR: "server.internal.error",
  },
} as const;
