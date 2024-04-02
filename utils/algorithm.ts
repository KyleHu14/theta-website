/* Problems that aren't solved 
1. What is the format of the final schedule we are returning? (Maybe CSV?)
2. What is the format of the schedule returned in getBoothTimes? [DONE]
3.  

**/

import { availTimes } from "./algorithmTypes";
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
		"10:00-11:00": ["Bob Ho", "Samatha Jones"],
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
			finalSchedule["3/28"][availableTime].push("Bob Ho");
		}

		// 2. Now we need to check students by their times and assign them
		// 2.1 Loop through their available times, let available time be called a
		// 2.2 Loop UNTIL we find time a that is open in the schedule
		// Note : available times is sorted by rarity already, no need to worry about that
	}

	console.log(
		`3/28 Schedule
		10:00 - 11:00 : ${finalSchedule["3/28"]["10:00-11:00"]} 
		11:00-12:00 : ${finalSchedule["3/28"]["11:00-12:00"]}
		12:00-13:00 : ${finalSchedule["3/28"]["12:00-13:00"]}
		14:00-15:30 : ${finalSchedule["3/28"]["14:00-15:30"]}`
	);
};

/**
 * This function performs the following :
 * 1. Calculate the rarities of each day
 * 2. Generate an object of each student and their available days
 * 3. Find the unique days
 * 4. Find the unique times
 *
 * @param stuAvail - A 2D list of the CSV file, where row 0 represents the column titles and data actually starts at row 1, col 0 represents time stamps
 * @returns
 */
const processSchedule = (stuCSV: string[][]) => {
	// availableTimes represents an object with students, each student key points to a list of available times
	let availableTimes: availTimes = {};

	// Why is row = 1? Row 1 represents the column titles, we can skip this
	// Why is col = 2? Col 0 are the timestamps which can be skipped, Col 1 are the names which aren't needed when looping
	for (let row = 1; row < stuCSV.length; row++) {

		// Perform pre initialization by
		// 1. Getting student's name first
		// 2. Initializing their available times list as empty
		let stuName = stuCSV[row][1]; 
		availableTimes[stuName] = [];

		// Now let's loop through stuName's available times
		for (let col = 2; col < stuCSV[row].length; col++) {
			
			// 1. First add the available times to the availableTimes obj
			// 1.1 We need to check that there are available times to add
			if (stuCSV[row][col] !== "not available") {
				// 2. Transform "11am-12pm, 12-1pm" into ["Wednesday 11am-12pm", "Thursday 12pm-1pm"] using reformatTimes
				// 2.1 ADD it to the student's available times list
				availableTimes[stuName] = availableTimes[stuName].concat(reformatTimes(stuCSV[0][col], stuCSV[row][col]));
			}
		}
	}

	console.log(availableTimes)

	return 0;
};
/**
 * Returns a processed array based on the times paramater in the format of [`Monday time1`, `Monday time2`, etc.]
 * @param day - A string that indicates the day associated with the times list
 * @param times - A string in the formmat of "11am-12pm, 12-1pm"
 */
const reformatTimes = (day: string, times: string) => {
	let finalTimes: string[] = []

	const timesList = times.split(", ")

	for (let timeIndex = 0; timeIndex < timesList.length; timeIndex++ ){
		finalTimes.push(day + timesList[timeIndex])
	}

	return finalTimes
}

const generateSchedule = (stuCSV: string[][]) => {
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

	// Task 1 :
	// 1. Go through the entire "stuAvail" 2D array parse thru it
	// 2. Generate the rarities of times of each day

	/* 
		Task 2 : 
	 	1. Make the final output array to have this format :
	 	[
			("Monday 10-11" : ["Bob Ho", "Tim Chou"]), 
			("Monday 11-12" : ["Bob Ho", "Tim Chou"]),
			("Tuesday 10-11" : ["Bob Moe", "Tim Joe"]),
			....
		]
	**/

	// Step 1 : Parse through stuAvail, calculate rarities of each day
	const processRes = processSchedule(stuCSV);
};

export default generateSchedule;
