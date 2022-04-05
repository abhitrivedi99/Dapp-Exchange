/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

const Navbar = ({ address }) => {
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
			<a className="navbar-brand" href="#">
				DAPP Exchange
			</a>

			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					{address && (
						<a
							className="nav-link small"
							href={`https://etherscan.io/address/${address}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							{address} <span className="sr-only">(current)</span>
						</a>
					)}
				</li>
			</ul>
		</nav>
	)
}

export default Navbar
