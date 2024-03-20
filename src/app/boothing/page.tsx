"use client";

// Mantine
import { Button, Center, Container, FileInput } from "@mantine/core";

// React
import { useState } from "react";

// CSS
import css from "./Bothing.module.css";

// Parse
import Papa from "papaparse";

export default function BoothingPage() {
	const [file, setFile] = useState<File | null>(null);

	const generateSchedule = () => {
		// console.log(file);
		if (file) {
			Papa.parse(file, {
				complete: function (results) {
					console.log(results);
				},
			});
		}
	};

	return (
		<Center>
			<div className={css.fileInput}>
				<FileInput
					label="Boothing Availability"
					description="Upload the boothing availability csv file"
					placeholder="boothing.csv"
					value={file}
					onChange={setFile}
				/>

				<Button className={css.generateBtn} onClick={generateSchedule}>
					Generate Schedule
				</Button>
			</div>
		</Center>
	);
}
