const Koa = require('koa')
const KoaRouter = require('koa-router')
const KoaCors = require('koa-cors')

const { getDatabase, insertNewEntry } = require('./mongo')
const { getHodlers } = require('./ethplorer')
const { dataPointInterval, dbUrl } = require('./config')

async function main() {
  const { collection } = await getDatabase(dbUrl)

  setInterval(updateHodlers(collection), dataPointInterval)

  const koa = await setUpKoa(getHoldersRoute(collection))

  koa.listen(process.env.PORT || 3000)

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