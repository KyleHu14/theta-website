// Mantine
import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "../../theme";

// React
import React from "react";

// Components
import Navbar from "../components/Navbar/Navbar";

// Globals css
import "./globals.css";

export const metadata = {
	title: "Kappa Alpha Theta @ UCI",
	description: "",
};

export default function RootLayout({ children }: { children: any }) {
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
				<link rel="shortcut icon" href="/favicon.svg" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
				/>
			</head>
			<body>
				<MantineProvider theme={theme}>
					<Navbar />
					{children}
				</MantineProvider>
			</body>
		</html>
	);
}
