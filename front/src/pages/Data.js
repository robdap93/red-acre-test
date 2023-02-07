import React from "react";
import { Container, Button, Row, Col, Form, FormLabel } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import io from 'socket.io-client'

const columns = [
  {
    dataField: 'datetime',
    text: 'Date & Time',
    sort: true
  }, 
  {
    dataField: 'currency_from',
    text: 'Currency from',
    sort: true
  }, 
  {
    dataField: 'amount1',
    text: 'Amount1',
    sort: true
  },
  {
    dataField: 'currency_to',
    text: 'Currency to',
    sort: true
  },
  {
    dataField: 'amount2',
    text: 'Amount2',
    sort: true
  },
  {
    dataField: 'type',
    text: 'Type',
    sort: true
  }
];

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            amountFrom:1,
            amountTo:0,
            crypto:'BTC',
            currency:'USD',
            socket:null,
            rate:0,
            products:[]
        }

        this.calculateExchange = this.calculateExchange.bind(this)
        this.handleClickSave = this.handleClickSave.bind(this)
    }

    handleClickSave(event) {
        this.socket.emit('live', this.state.crypto+'/'+this.state.currency)
        let products = this.state.products
        this.socket.on('live', (msg) => {
          
          let now = new Date();
          let datetime = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear()+" @ "+now.getHours()+':'+now.getMinutes()+":"+now.getSeconds()
          products.push({
            id:Math.floor(Math.random() * 1000000),
            datetime:datetime,
            currency_from:this.state.crypto,
            amount1:this.state.amountFrom,
            currency_to:this.state.currency,
            amount2:this.calculateAmountTo(msg, this.state.amountFrom),
            type:'live'
          })
          products.push({
            id:Math.floor(Math.random() * 1000000),
            datetime:datetime,
            currency_from:this.state.crypto,
            amount1:this.state.amountFrom,
            currency_to:this.state.currency,
            amount2:this.state.amountTo,
            type:'exchanged'
          })
  
          
        })
        this.setState({products:products})

        event.preventDefault()
    }

    calculateExchange(event) {

        let value = event.target.value

        let state = {
            ...this.state,
            [event.target.name]:value
        }

        this.socket.emit('exchange', state.crypto+'/'+state.currency)
        this.socket.on('exchange', (msg) => {
          state.rate = msg
          if(event.target.name == "amountTo") {
            state.amountFrom = this.calculateAmountFrom(state.rate, state.amountTo)
          }
          state.amountTo = this.calculateAmountTo(state.rate, state.amountFrom)
          this.setState(state)
        })
    }

    calculateAmountTo(rate, amountFrom) {
      return amountFrom * rate
    }

    calculateAmountFrom(rate, amountTo) {
      return amountTo / rate
    }

    componentDidMount() {
        this.socket = io('http://localhost:4000')
        //const interval = setInterval(() => {
          this.socket.emit('exchange', this.state.crypto+'/'+this.state.currency)
          this.socket.emit('data')
          this.socket.on('data', (data) => {
            this.setState({products:data})
          })
          this.socket.on('exchange', (msg) => {
            console.log(msg)
          this.setState({rate:msg, amountTo:this.calculateAmountTo(msg, this.state.amountFrom)})
        })
        /*},30000)
        return () => clearInterval(interval);*/
        
    }
  
    render() {
        return (
        <Container>
            <Row style={{border:"1px solid",padding:"30px",marginTop:"10%"}}>
                <Row>
                    <h1>Exchange {this.state.crypto} to {this.state.currency} / {this.state.rate}</h1>
                </Row>
                <Row>
                <Col>
                    <FormLabel>Currency from</FormLabel>
                    <Form.Select 
                    name="crypto" 
                    value={this.state.crypto} 
                    onChange={this.calculateExchange}>
                    <option value="BTC">Bitcoin</option>
                    <option value="ETH">Ethereum</option>
                    <option value="LTC">Litecoin</option>
                    </Form.Select>
                </Col>
                <Col>
                    <FormLabel>Amount</FormLabel>
                    <Form.Control
                    type="number"
                    min={0.1}
                    id="amountFrom"
                    name="amountFrom"
                    value={this.state.amountFrom}
                    onChange={this.calculateExchange}
                    />
                    <Form.Text id="amountFrom" />
                </Col>
                <Col md={1} style={{marginTop:"37px", justifyContent:"center", display:"flex"}}>=</Col>
                    <Col>
                        <FormLabel>Currency to</FormLabel>
                        <Form.Select 
                        name="currency" 
                        value={this.state.currency} 
                        onChange={this.calculateExchange}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </Form.Select>
                    </Col>
                <Col>
                    <FormLabel>Amount</FormLabel>
                    <Form.Control
                    type="number"
                    min={0.1}
                    id="amountTo"
                    name="amountTo"
                    value={this.state.amountTo}
                    onChange={this.calculateExchange}
                    />
                    <Form.Text id="amountTo" />
                </Col>
                <Col style={{marginTop:"32px"}}>
                    <Button variant="success" onClick={this.handleClickSave}>Save</Button>
                </Col>
                </Row>
            </Row>

            <Row style={{border:"1px solid",padding:"30px",marginTop:"10%"}}>
              <BootstrapTable keyField='id' data={ this.state.products } columns={ columns }/>
            </Row>
        </Container>
        )
    }
};
  
export default Home;