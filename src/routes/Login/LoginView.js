import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Icon, Input, Button, message } from 'antd';
import {signinWithFirebase} from '../../store/fireConnection';
import {browserHistory} from 'react-router';
import './LoginView.scss';


@connect(
	state => ({
		isLoggedIn: state.auth.loggedIn,
		user: state.auth.user
	})
)
class LoginView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
		this.handleLogin = this.handleLogin.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		
	}
	componentWillMount() {
		console.log('hello props login', this.props);
		if (this.props.isLoggedIn) {
			console.log('you already logged in');
			browserHistory.push('/')
		}

	}

	handleLogin(e) {
		e.preventDefault();
		const { username, password } = this.state;
		console.log('loginwith', username, password);
		signinWithFirebase(username, password)
			.then(user => {
				console.log('user logged in', user);
				browserHistory.push('/');
			})
			.catch(err => message.error(err.message))

		
	}
	handleInputChange(field, v) {
		this.setState({
			[field]: v.target.value
		});
	}

	render() {
		const { handleLogin, handleInputChange } = this;
		console.log('username, pass', this.state);
		const { username, password } = this.state;
		if (this.props.isLoggedIn) {
			console.log(' render you already logged in');
			browserHistory.push('/')
			return null;
		}
		return (
			<div style={{ padding: 10 }}>
			  <div className="login-page">
			  <div className="form">
				  <h2 className="login-header">Contacts Management</h2>
				  <p className="login-author">By Yong</p>
				  
				  <form className="login-form" onSubmit={handleLogin}>
					<input type="text" placeholder="email" onChange={v=>handleInputChange('username', v)}/>
					<input type="password" placeholder="password" onChange={v => handleInputChange('password', v)}/>
					<button type="submit">login</button>
					<p className="message"> <a style={{cursor:'default'}}>Hope you like it :)</a></p>
				</form>
			  </div>
			</div>
			  <footer><a href="#"><img src="https://www.polymer-project.org/images/logos/p-logo.svg"/></a>
				<p>You Gotta Love <a href="#" >Moira</a></p>
			  </footer>



			</div>
		);
	}
}

export default LoginView;
