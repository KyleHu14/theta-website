"use client";

// Mantine
import {
	Button,
	Center,
	FileInput,
	Flex,
	Grid,
	SimpleGrid,
	Title,
} from "@mantine/core";

// React
import { useState } from "react";

// CSS
import css from "./Bothing.module.css";

// Parse
import Papa from "papaparse";
import { ParseResult } from "papaparse";

// Import Algorithm Function
import generateSchedule from "../../../utils/algorithm";

export default function BoothingPage() {
	const [file, setFile] = useState<File | null>(null);
	const [parseObj, setParseObj] = useState([[""]]);

	const handleGenerate = () => {
		if (file) {
			Papa.parse(file, {
				complete: function (results: ParseResult<string[]>) {
					setParseObj(results.data);
					generateSchedule(results.data); // Passing results of PARSED csv into our algorithm.ts function!
				},
			});
		}
	};

	return (
		<Flex direction="column" align="center" justify="center">
			<div className={css.fileInput}>
				<FileInput
					label="Boothing Availability"
					description="Upload the boothing availability csv file"
					placeholder="boothing.csv"
					value={file}
					onChange={setFile}
				/>

				<Button className={css.generateBtn} onClick={handleGenerate}>
					Generate Schedule
				</Button>
			</div>

			{/* prettier-ignore */}
			<div>
				<Title size="h1">Data Received</Title>
				<Grid classNames={{root: css.grid}} columns={7} >
					{parseObj.map((row, rowIndex) =>
						row.map((value, valIndex) => <Grid.Col key={rowIndex+valIndex}className={css.gridCol} span={1}>{value}</Grid.Col>)
					)}
				</Grid>
			</div>
		</Flex>
	);
}
