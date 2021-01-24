import React from 'react';
import ReactDOM from 'react-dom';
import css from './Colt.css';

/* generated <%=generationDate%> */

/**
 * the application-class for the main document.
 */
// eslint-disable-next-line no-unused-vars
class App extends React.Component{
	/**
	 * ctor
	 * @param {Object} props the properties for this instance
	 */
	constructor(props){
		super(props);
		this.state = {};
	}

	/** show the application-page. */
	render(){
		return (<div><Header className={css.cssHeader}/><NavBar/><PageBody/><Footer/></div>);
	}
}
/** header */
// eslint-disable-next-line no-unused-vars
class Header extends React.Component{
	constructor(props){
		super(props);
		// console.log('props are:' + props);
		console.log(`PROPS=${props}`);
		this.state = {};
	}

	/** show the header. */
	render(){
		return (<div><h1>Header</h1></div>);
	}
}
/** NavBar */
// eslint-disable-next-line no-unused-vars
class NavBar extends React.Component{
	/** show the navigation-bar. */
	render(){
		return (<div><h1>NavBar</h1></div>);
	}
}

/** page-body */
// eslint-disable-next-line no-unused-vars
class PageBody extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			people: [
				{ name: 'Joe', id: 22 },
				{ name: 'Mary', id: 22 },
			]
		};
	}

	/** show the body. */
	render(){
		console.log(`PEOPPLE=${this.state.people}`);
		return (<div>
			<h1>PageBody</h1>
			<h2>test</h2>
			<h3>test3</h3>
			<h4>test4</h4>
		 {this.state.people.map(({ id, name }) => (
				<div key={id}> {name}</div>
			))}
		</div>);
	}
}
/** page-footer */
// eslint-disable-next-line no-unused-vars
class Footer extends React.Component{
	/** show the footer. */
	render(){
		return (<div><h1>Footer</h1></div>);
	}
}

class AppCSS extends React.Component{
	constructor(props){
		super(props);

		this.state = { clicks: 0, hidden: false };

		this.handleIncreaseClicks = this.handleIncreaseClicks.bind(this);
		this.handleButtonDisplay = this.handleButtonDisplay.bind(this);
	}

	handleIncreaseClicks(){
		this.setState((state) => ({ clicks: state.clicks + 1 }));
	}

	handleButtonDisplay(){
		this.setState((state) => ({ hidden: !state.hidden }));
	}

	render(){
		return (
			<React.Fragment>
				<div className={`container ${this.state.hidden ? 'hide-me' : ''}`}>
					<p className="label">Clicks:</p>
					<button
						className="clicks"
						onClick={this.handleIncreaseClicks}
					>
						{this.state.clicks}
					</button>
					<br />
				</div>
				<button
					className="hide-show-button"
					onClick={this.handleButtonDisplay}
				>
					{this.state.hidden ? 'Show' : 'Hide'} Clicks
				</button>
			</React.Fragment>
		);
	}
}
ReactDOM.render(
	<div>
		<App />
	</div>, document.getElementById('root'));
