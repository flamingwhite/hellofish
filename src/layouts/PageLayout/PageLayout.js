import React from 'react'
import { IndexLink, Link } from 'react-router'
import PropTypes from 'prop-types'
import './PageLayout.scss';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;



export const PageLayout = ({ children }) => (
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
		<Menu.Item key="2">
			<Link to='/contacts' activeClassName='page-layout__nav-item--active'>Contacts</Link>
		
		</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
	<div style={{ background: '#fff', padding: 24, minHeight: 280 }}> {children} </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      Ant Design ©2016 Created by Ant UED
    </Footer>
  </Layout>

)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout
