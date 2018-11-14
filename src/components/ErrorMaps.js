import React, {Component} from 'react';

class ErrorMaps extends Component {
    state = {
        show: false,
        timeout: null
    }

    componentDidMount = () => {
        let timeout = window.setTimeout(this.showMessage, 1000);
        this.setState({timeout});
    }

    componentWillUnmount = () => {
        window.clearTimeout(this.state.timeout);
    }

    showMessage = () => {
        this.setState({show: true});
    }

    render = () => {
        return (
           <div>
                {this.state.show
                    ? (
                        <div>
                            <h1>Uh oh! There was an error while loading the map</h1>
                            < p >
                               This is probably due to a network error. Please try  again when you are online.</p>
                        </div>
                    )
                    : (<div><h1>Loading</h1></div>)
            } </div>
        )
    }
}
export default ErrorMaps;
