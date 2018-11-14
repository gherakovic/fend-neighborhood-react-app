import React, {Component} from 'react';

class ErrorMaps extends Component {
  constructor(props) {
		super(props)
			this.state = {
			error: false
		}

	}

componentDidCatch(error, info) {
    console.log(error, info)
    this.setState({ error: true })
	}

	render() {

		if(this.state.error === true) {
			return (
				<div>
					<h1>Uh oh! The map did not load.</h1>
					<p>Please try again later when you are online.</p>
				</div>
				)
			}
			return this.props.children
		}
}
export default ErrorMaps
