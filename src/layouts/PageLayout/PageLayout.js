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


