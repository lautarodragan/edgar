const SECOND_IN_MS = 1000
const MINUTE_IN_MS = 60 * SECOND_IN_MS

const defaultIfNaN = defaultValue => input => isNaN(input) ? defaultValue : input

const defaultZeroIfNaN = defaultIfNaN(0)

const dataPointInterval = Math.max(defaultZeroIfNaN(process.env.EDGAR_INTERVAL * MINUTE_IN_MS), MINUTE_IN_MS)

const dbPassword = process.env.EDGAR_DB_PASSWORD

const dbUrl = `mongodb+srv://edgar:${dbPassword}@edgar-f7n7n.mongodb.net/edgar?retryWrites=true`

module.exports = {
  dataPointInterval,
  dbUrl,
}