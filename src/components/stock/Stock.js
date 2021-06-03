import React, { Component } from 'react';
import '../../css/stock/stock.css'
import Grafico from '../Grafico';

class Stock extends Component {

    constructor(props) {
        super(props);
        const { symbol, price } = this.props.dati
        this.state = { symbol, price, datatrade: 'xxxx-xx-xx 16:00:00', ckrealtime:'',datigrafico:[{datetime:'16:00:00',price:price}],showgrafico:false };
        console.log('1f) FIGLIO Creo istanza');
    }

    static getDerivedStateFromProps(np, ps) {
        if (np.dati.symbol !== ps.symbol) {
            return { nome: np.dati.symbol, price: np.dati.price }
        }
        return null;
    }

    componentDidMount() {
        console.log('3f) FIGLIO DidMount ');
    }

    componentDidUpdate() {
        console.log('4f) FIGLIO Update ');
        
    }

    // aggiornoStock = () => {
    //     const valore = this.state.valore + 10
    //     this.setState({ valore })
    // }
    eliminoStock = () => {
        this.props.eliminoStock(this.props.dati.symbol)
    }
    startCheckElemento = () => {
        this.timer = setInterval(() => this.getNewElementi(), 2000)
    }
    stopCheckElemento = () => {
        clearInterval(this.timer);
    }
    // componentWillMount =() => {
    //     clearInterval(this.timer);
    // }
    startRealtime =()=> {
        const ckrt = this.state.ckrealtime === 'checked' ? '' : 'checked';
        if(ckrt === 'checked'){
           this.startCheckElemento();
        }else {
            this.stopCheckElemento();
        }
        this.setState({ ckrealtime: ckrt }) 
    }

    //teste
    getNewElementi = () => {
        const url = `https://intraday.worldtradingdata.com/api/v1/intraday?symbol=${this.props.dati.symbol}&range=1&interval=1&api_token=nkJO34lXP5DdL4VvGCwQlPhpFGohUvQFnZ2nQXYvOUqMPL9XWEWRolfZSUy2`;
        fetch(url)
            .then(r => r.json())
            .then(r => {
                const { intraday } = r;
                const timeprice = Object.entries(intraday)[0];
                const datatrade = timeprice[0];
                const price = timeprice[1].open;
                const datigrafico = [...this.state.datigrafico,{datetime:datatrade.substring(11),price:price}]
                this.setState({ price, datatrade,datigrafico })

            })
            .catch((error) => {
                console.log('Fetch failed', error)
            })

    }
    showGrafico =()=> {
        this.setState({showgrafico:!this.state.showgrafico})
    }

    render() {
        console.log('2f) FIGLIO Render');
        const diff = (this.state.price - this.props.dati.price).toFixed(2)
        const percentuale = (diff / this.props.dati.price) * 100;
        return (
            <div className="stock col-md-6 p-3">
                <div className="bodystock">
                    <i className="fas fa-times-circle closebtn" onClick={this.eliminoStock}></i>
                    <div className="row">
                        <div className="col-sm">
                            <h2 className='giallo'>{this.props.dati.symbol}</h2>
                            <p>Nasdaq</p>
                        </div>
                        <div className="col-sm">
                            <h2>{this.state.price}</h2>
                            <p>{this.state.datatrade.substring(11)}</p>
                        </div>
                        <div className="col-sm">
                            <h2>{diff}</h2>
                            <p style={{ color: 'green' }}>{percentuale.toFixed(1)} %</p>
                        </div>
                        <div className="col-sm">
                            <p><i className="fas fa-chart-line fa-2x" onClick={this.showGrafico}></i></p>
                            <label className="bs-switch">
                                <input type="checkbox" checked={this.state.ckrealtime} onChange={this.startRealtime}/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="bodygrafico">
                    <div className="row">
                        <div className="col-sm">
                            {this.state.showgrafico &&<Grafico data={this.state.datigrafico} chiusura={this.props.dati.price}/>}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Stock
