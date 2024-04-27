"use client";

// Mantine
import {
	Button,
	FileInput,
	Flex,
	Grid,
	NumberInput,
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

// file-saver
import { saveAs } from "file-saver";

export default function BoothingPage() {
	// useStates for files & parsing
	const [file, setFile] = useState<File | null>(null);
	const [parseObj, setParseObj] = useState([[""]]);

	// Titles
	const [title, setTitle] = useState("Upload a CSV File");

	// Minimum # of students
	const [minStudents, setMinStudents] = useState<number>(5);

	const handleGenerate = () => {
		if (file) {
			Papa.parse(file, {
				complete: function (results: ParseResult<string[]>) {
					setTitle("CSV Data");
					setParseObj(results.data);
					generateSchedule(results.data, minStudents); // Passing results of PARSED csv into our algorithm.ts function!
				},
			});
		}
	};

	const handleDownloadCSV = () => {
		var csv = Papa.unparse({
			fields: ["Column 1", "Column 2"],
			data: [
				["foo", "bar"],
				["abc", "def"],
			],
		});

		var csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });

		saveAs(csvData, "file.csv");
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

				<NumberInput
					classNames={{ root: css.mTop }}
					label="Minimum # of People per Time Slot"
					description="Input any digit, default is 5"
					value={minStudents}
					onChange={(value) => setMinStudents(Number(value))}
				/>

				<Button className={css.mTop} onClick={handleGenerate}>
					Generate Schedule
				</Button>

				<Button className={css.mTop} onClick={handleDownloadCSV}>
					Download Schedule
				</Button>
			</div>

			{/* prettier-ignore */}
			<div>
				<Title classNames={{root: css.title}}size="h1">{title}</Title>
				{parseObj.length > 1 && (
					<Grid classNames={{root: css.grid}} columns={6} >
						{parseObj.map((row, rowIndex) =>
							row.map((value, valIndex) => <Grid.Col key={rowIndex+valIndex}className={css.gridCol} span={1}>{value}</Grid.Col>)
						)}
					</Grid>
				)}
				
			</div>
		</Flex>
	);
}
