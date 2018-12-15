import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Demo extends Component {
    render() {
        return (
            <div className="box">{this.props.text}</div>
        )
    }
}

ReactDOM.render(
    <Demo text="This is a test" />,
    document.querySelector('.container')
)