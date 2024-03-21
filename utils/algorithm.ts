import Student from "./Student";

import { schedule1 } from "./sampleSchedules/schedule1";
import { simpleSchedule } from "./sampleSchedules/simpleSchedule";

// Type for Final Schedule
interface Schedule {
	[date: string]: {
		[time: string]: string[];
	};
}

// Initialization of the final schedule
let finalSchedule: Schedule = {
	"3/28": {
		"10:00-11:00": [],
		"11:00-12:00": [],
		"12:00-13:00": [],
		"13:00-14:00": [],
		"14:00-15:30": [],
	},
	"3/29": {
		"10:00-11:00": [],
		"11:00-12:00": [],
		"12:00-13:00": [],
		"14:00-15:30": [],
	},
	"3/30": {
		"10:00-11:00": [],
		"11:00-12:00": [],
		"12:00-13:00": [],
		"14:00-15:30": [],
	},
	"3/31": {
		"10:00-11:00": [],
		"11:00-12:00": [],
		"12:00-13:00": [],
		"14:00-15:30": [],
	},
	"4/1": {
		"10:00-11:00": [],
		"11:00-12:00": [],
		"12:00-13:00": [],
		"14:00-15:30": [],
	},
};

// Returns an array of objects sorted by increasing availability
const sortStudents = () => {
	let rarity: { [key: string]: number } = {
		"10:00-11:00": 2,
		"11:00-12:00": 1,
		"12:00-13:00": 1,
		"13:00-14:00": 3,
		"14:00-15:30": 3,
	};

	// 1. Sort students by the number of times they are available
	let sortedStudents = simpleSchedule;
	sortedStudents.sort((a, b) => a.numAvail - b.numAvail);

	// 2. Sort each student's availability list by their rarity
	// prettier-ignore
	for (let studentIndex = 0; studentIndex < sortedStudents.length; studentIndex++) {
		// Sort the available times by their "rarity" in increasing order
		sortedStudents[studentIndex].availability.sort(function(a, b) {
			return rarity[a] - rarity[b];
		})
	}

	return sortedStudents;
};

/**
 * Returns the final boothing times
 *
 * The idea of this function is to loop through the entire students object
 * We then assign students based on how "rare" their available times are, the lower the rarity of an available time the more rare it is
 */
const getBoothTimes = () => {
	// Sort the students
	let students = sortStudents();

	// For each student
	for (let studentIndex = 0; studentIndex < students.length; studentIndex++) {
		let curStudent = students[studentIndex];

		// 1. If the student only has one available time, we will automatically put them into their requested time
		if (students[studentIndex].numAvail === 1) {
			// Get the available time ex : "10:00-11:00"
			let availableTime: string = curStudent.availability[0];
			// Push the id of a student into the finalSchedule
			finalSchedule["3/28"][availableTime].push(curStudent.id);
		}

		// 2. Now we need to check students by their times and assign them
	}

	console.log(
		`3/28 Schedule
		10:00 - 11:00 : ${finalSchedule["3/28"]["10:00-11:00"]} 
		11:00-12:00 : ${finalSchedule["3/28"]["11:00-12:00"]}
		12:00-13:00 : ${finalSchedule["3/28"]["12:00-13:00"]}
		14:00-15:30 : ${finalSchedule["3/28"]["14:00-15:30"]}`
	);
};

const getDayRarity = (stuAvail: string[][]) => {
	let dayRarityObj = {
		"10:00-11:00": 0,
		"11:00-12:00": 0,
		"12:00-13:00": 0,
		"13:00-14:00": 0,
		"14:00-15:30": 0,
	};

	let dayRarity = {
		Monday: dayRarityObj,
		Tuesday: dayRarityObj,
		Wednesday: dayRarityObj,
		Thursday: dayRarityObj,
		Friday: dayRarityObj,
	};

	return dayRarity;
};

const generateSchedule = (stuAvail: string[][]) => {
	let timeStampObj = {
		"10:00-11:00": [],
		"11:00-12:00": [],
		"12:00-13:00": [],
		"13:00-14:00": [],
		"14:00-15:30": [],
	};

	let finalSchedule: Schedule = {
		Monday: timeStampObj,
		Tuesday: timeStampObj,
		Wednesday: timeStampObj,
		Thursday: timeStampObj,
		Friday: timeStampObj,
	};

	// Step 1 : Parse through stuAvail and update dayRarity
	const dayRarity = getDayRarity(stuAvail);
};

export default generateSchedule;
