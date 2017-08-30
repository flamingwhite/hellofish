import React from 'react'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import HomeView from '../routes/Home/components/HomeView';
import LoginView from '../routes/Login/LoginView';
import ContactsView from '../routes/Contacts/ContactsView';
import EnsureLoginContainer from '../routes/EnsureLoginContainer/EnsureLoginContainer';
import PageLayout from '../layouts/PageLayout';

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
			<Router history={browserHistory}>
				<Route path="/" component={PageLayout}>
					<Route path="home" component={HomeView}/>
					<Route component={EnsureLoginContainer}>
						<IndexRoute component={ContactsView}/>
					</Route>		
				</Route>
				<Route path='login' component={LoginView} />

			</Router>	
        </div>
      </Provider>
    )
  }
}

export default App


//   render () {
//     return (
//       <Provider store={this.props.store}>
//         <div style={{ height: '100%' }}>
//           <Router history={browserHistory} children={this.props.routes} />
//         </div>
//       </Provider>
//     )
//   }