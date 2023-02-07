import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, React } from 'react';
import { Container, Button, Row, Col, Form, FormLabel, Table} from "react-bootstrap";
import io from 'socket.io-client'

export default function App() {

  const [amountFrom, setAmountFrom] = useState(1)
  const [amountTo, setAmountTo] = useState(0)
  const [crypto, setCrypto] = useState('BTC')
  const [currency, setCurrency] = useState('USD')
  const [rate, setRate] = useState(0)
  const [data, setData] = useState([])

  const socket = io('http://localhost:4000')

  useEffect(() => {
    socket.emit('exchange', crypto + '/' + currency)
    socket.on('exchange', (exc) => {
      setRate(exc)
      setAmountTo(amountFrom * exc)
    })
  })

  const changeCrypto = (e) => {
    let value = e.target.value
    setAmountTo(amountFrom * rate)
    setCrypto(value)
  }

  const changeAmountFrom = (e) => {
    let value = e.target.value
    setAmountTo(value * rate)
    setAmountFrom(value)
  }

  const changeCurrency = (e) => {
    let value = e.target.value
    setAmountTo(amountFrom * rate)
    setCurrency(value)
  }

  const changeAmountTo = (e) => {
    let value = e.target.value
    setAmountFrom(value / rate)
    setAmountTo(value)
  }

  const save = () => {
    let now = new Date();
    let datetime = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear() + " @ " + now.getHours() + ':' + now.getMinutes() + ":" + now.getSeconds()
    socket.emit('exchange', crypto + '/' + currency)
    socket.on('exchange', (exc) => {
      setData([
        ...data,
        {
          id: Math.floor(Math.random() * 1000000),
          datetime: datetime,
          currency_from: crypto,
          amount1: amountFrom,
          currency_to: currency,
          amount2: amountFrom * exc,
          type: 'live'
        },
        {
          id: Math.floor(Math.random() * 1000000),
          datetime: datetime,
          currency_from: crypto,
          amount1: amountFrom,
          currency_to: currency,
          amount2: amountTo,
          type: 'exchanged'
        },
      ])
    })
  }

  return (
    <Container>
      <Row style={{ border: "1px solid", padding: "30px", marginTop: "10%" }}>
        <Row>
          <h1>Exchange {crypto} to {currency} / {rate}</h1>
        </Row>
        <Row>
          <Col lg="2">
            <FormLabel>Currency from</FormLabel>
            <Form.Select
              name="crypto"
              value={crypto}
              onChange={changeCrypto}>
              <option value="BTC">Bitcoin</option>
              <option value="ETH">Ethereum</option>
              <option value="LTC">Litecoin</option>
              <option value="ADA">ADA</option>
            </Form.Select>
          </Col>
          <Col lg="3">
            <FormLabel>Amount</FormLabel>
            <Form.Control
              type="number"
              min={0.1}
              id="amountFrom"
              name="amountFrom"
              value={amountFrom}
              onChange={changeAmountFrom}
            />
            <Form.Text id="amountFrom" />
          </Col>
          <Col lg="1" style={{ marginTop: "37px", justifyContent: "center", display: "flex" }}>=</Col>
          <Col lg="2">
            <FormLabel>Currency from</FormLabel>
            <Form.Select
              name="currency"
              value={currency}
              onChange={changeCurrency}>
              <option value="USD">USA Dollar</option>
              <option value="EUR">EURO</option>
              <option value="GBP">Pound</option>
            </Form.Select>
          </Col>
          <Col lg="3">
            <FormLabel>Amount</FormLabel>
            <Form.Control
              type="number"
              min={0.1}
              id="amountTo"
              name="amountTo"
              value={amountTo}
              onChange={changeAmountTo}
            />
            <Form.Text id="amountTo" />
          </Col>
          <Col lg="1" style={{ marginTop: "32px" }}>
            <Button variant="success" onClick={save}>Save</Button>
          </Col>
        </Row>
      </Row>
      <Row style={{ border: "1px solid", padding: "30px", marginTop: "10%" }}>
        <Row>
          <h1>History</h1>
        </Row>
        <Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Currency from</th>
                <th>Amount1</th>
                <th>Currency to</th>
                <th>Amount2</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {data.map(items => {
                return (
                  <tr key={items.id}>
                    <td>{ items.datetime }</td>
                    <td>{ items.currency_from }</td>
                    <td>{ items.amount1 }</td>
                    <td>{ items.currency_to }</td>
                    <td>{ items.amount2 }</td>
                    <td>{ items.type }</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </Row>
    </Container>
  )
}