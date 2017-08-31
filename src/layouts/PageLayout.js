import React, {Component} from 'react'
import { IndexLink, Link, browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import { Layout, Menu } from 'antd';
import {signoutWithFirebase} from '../store/fireConnection';
import './PageLayout.scss';
import '../../node_modules/antd/dist/antd.css';


const { Header, Content, Footer } = Layout;

class PageLayout extends Component {
	constructor(props) {
		super(props);
		this.signOut = this.signOut.bind(this);
		
	}

	signOut() {
		console.log('trying to signout');
		signoutWithFirebase();
		browserHistory.push('/login');
	}

	render() {
		const { children } = this.props;
		const { signOut } = this;
		return (
			<Layout className="layout">
				<Header>
				<div className="logo" />
				<Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={['1']}
					style={{ lineHeight: '64px' }}
				>
					<Menu.Item key="1"><IndexLink to="/">Home</IndexLink></Menu.Item>
					<Menu.Item key="3" className="pull-right"><span onClick={signOut}>Sign Out</span></Menu.Item>

				</Menu>
				</Header>
				<Content style={{ padding: '0 50px' }}>
					<div className="content-body" >{children}</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>
				Designed For Moira
				</Footer>
			</Layout>
		)

	}
}



export const aPageLayout = ({ children }) => (
	<Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
		<Menu.Item key="1">
			<IndexLink to='/' activeClassName='page-layout__nav-item--active'>Home</IndexLink>
			{' · '}
		</Menu.Item>
		<button onClick={signOut}> Sign Out</button>

      </Menu>
    </Header>
    <Content style={{}}>
	<div style={{ background: '#fff', padding: 18, paddingTop:5, minHeight: 280 }}> {children} </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      Designed For Moira
    </Footer>
  </Layout>

)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout;


