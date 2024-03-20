"use client";

import { useState } from "react";
import { Container, Group, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Navbar.module.css";

import Link from "next/link";

const links = [
	{ link: "/", label: "Home" },
	{ link: "/boothing", label: "Boothing" },
];

export default function Navbar() {
	const [opened, { toggle }] = useDisclosure(false);
	// const [active, setActive] = useState(links[0].link);

	const items = links.map((link) => (
		<Link
			key={link.label}
			href={link.link}
			className={classes.link}
			// data-active={active === link.link || undefined}
			onClick={(event) => {
				// event.preventDefault();
				// setActive(link.link);
				toggle(); // Close the menu when a link is clicked
			}}>
			{link.label}
		</Link>
	));

	return (
		<header className={classes.header}>
			<Container size="md" className={classes.inner}>
				<div>Kappa Alpha Theta</div>
				<Group gap={5} visibleFrom="xs">
					{items}
				</Group>

				{opened && (
					<Group
						gap={5}
						hiddenFrom="xs"
						className={classes.mobileMenu}>
						{items}
					</Group>
				)}

				<Burger
					opened={opened}
					onClick={toggle}
					hiddenFrom="xs"
					size="sm"
				/>
			</Container>
		</header>
	);
}
