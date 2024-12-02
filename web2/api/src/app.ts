import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Invoice } from './services/invoice'
import { Quotation } from './services/quotation'
import { Receipt } from './services/receipt'
import { Auth } from './services/auth'
import { Database } from "./persistence/nedb"

const app = express()
const invoiceDb = new Database('invoice')
const quotationDb = new Database('quotation')
const receiptDb = new Database('receipt')

app.disable('x-powered-by')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const serverErrorHandler = (res: Response) => {
  return (error: any) => {
    try {
      if (error.status === 401) {
        res.status(error.status).json(error.message)
        return
      }
      throw error
    } catch (e: any) {
      console.error(e)
      res.status(500).json({ error: e.toString() })
    }
  }
}

app.get('/', (_req: Request, res: Response) => res.send('Hello World!'))

app.get('/invoices/:year', (req: Request, res: Response) => {
  new Invoice(invoiceDb).all(req.params.year).then((invoices) => {
    res.json(invoices)
  })
})

app.get('/invoice/:invoiceNumber', (req: Request, res: Response) => {
  new Invoice(invoiceDb).get(req.params.invoiceNumber).then((inv) => {
    res.json(inv)
  })
})

app.put('/invoice/:invoiceNumber/', (req: Request, res: Response) => {
  new Invoice(invoiceDb)
    .update(req.body)
    .then(() => {
      res.json(req.body)
    })
    .catch(serverErrorHandler(res))
})

app.post('/invoices/', (req: Request, res: Response) => {
  new Invoice(invoiceDb)
    .save(req.body)
    .then((id) => {
      res.json(id)
    })
    .catch(serverErrorHandler(res))
})

// Similar updates for quotations and receipts endpoints...

app.post('/login/', (req: Request, res: Response) => {
  new Auth()
    .login(req.body.password)
    .then((out) => {
      res.json(out)
    })
    .catch(serverErrorHandler(res))
})

export default app 