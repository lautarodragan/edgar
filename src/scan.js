const { getDatabase, insertNewEntry } = require('./mongo')
const { getHodlers } = require('./ethplorer')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const KoaCors = require('koa-cors')

const defaultIfNaN = defaultValue => input => isNaN(input) ? defaultValue : input

const defaultZeroIfNaN = defaultIfNaN(0)

const dataPointInterval = Math.max(defaultZeroIfNaN(process.env.EDGAR_INTERVAL), 5000)

async function main() {
  const dbPassword = process.env.EDGAR_DB_PASSWORD
  const dbUrl = `mongodb+srv://edgar:${dbPassword}@edgar-f7n7n.mongodb.net/edgar?retryWrites=true`

  const { mongoClient, collection } = await getDatabase(dbUrl)

  setInterval(updateHodlers(collection), dataPointInterval)
  // await updateHodlers(collection)()

  const koa = await setUpKoa(getHoldersRoute(collection))

  koa.listen(process.env.PORT || 3000)

  // await mongoClient.close()
}

function handleErrors(error) {
  console.error(error)
  process.exit(1)
}

const updateHodlers = (collection) => async () => {
  const hodlers = await getHodlers()
  await insertNewEntry(collection, hodlers)
}

async function setUpKoa(getHolders) {
  const koa = new Koa()
  const koaRouter = new KoaRouter()

  koaRouter.get('/', getHolders)

  koa.use(KoaCors())

  koa.use(koaRouter.allowedMethods())
  koa.use(koaRouter.routes())

  return koa
}

const getHoldersRoute = (collection) => async (context, next) => {
  const entries = await collection.find({}, {projection: {_id: false, holders: true, date: true}}).toArray()
  context.body = entries
}

main().catch(handleErrors)