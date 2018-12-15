import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { fn1 } from './util';
import '../style/index.less'

class Demo extends Component {
    render() {
        fn1()
        return (
            <div className="box">{this.props.text}</div>
        )
    }
}

ReactDOM.render(
    <Demo text="This is a test" />,
    document.querySelector('.container')
)