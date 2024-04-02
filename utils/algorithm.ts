/* Problems that aren't solved 
1. What is the format of the final schedule we are returning? (Maybe CSV?)
2. What is the format of the schedule returned in getBoothTimes? [DONE]
3.  

**/

import { AvailableTimesType, RarityObjectType } from "./algorithmTypes";

// Type for Final Schedule
interface Schedule {
	[date: string]: {
		[time: string]: string[];
	};
}

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
	// [Variable Initialization]
	// 1. availableTimes represents an object with students, each student key points to a list of available times
	let availableTimes: AvailableTimesType = {};

	// 2. Rarities represents an object that holds how rare every time in a particular day is
	// 2.1 For example : {
	//		Monday : {"10-11am" : 5, "11am-12pm" : 10}
	// }
	let rarities: RarityObjectType = {};
	// 2.2 Initialize each day ("Monday", "Tuesday", "Wednesday") as an empty object
	for (let col = 2; col < stuCSV[0].length; col++) {
		// Remove all whitespace from an the day
		rarities[stuCSV[0][col].replace(/\s+/g, "")] = {};
	}

	// Why is row = 1? Row 0 represents the column titles, we can skip this
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
				// We will need a split array of times for example : ["11am-12pm", "12-1pm"]
				const timesList = stuCSV[row][col].split(", ");

				// 2. Transform "11am-12pm, 12-1pm" into ["Wednesday 11am-12pm", "Thursday 12pm-1pm"] using reformatTimes
				// 2.1 ADD it to the student's available times list
				availableTimes[stuName] = availableTimes[stuName].concat(
					reformatTimes(stuCSV[0][col], timesList)
				);

				// 3. Update the rarities object
				updateRarities(
					// Once again, remove all white space
					stuCSV[0][col].replace(/\s+/g, ""),
					timesList,
					rarities
				);
			}
		}
	}

	return {
		// Note that we are transforming availableTimes into a list of lists because we care about order
		// An example of an entry would be ["Bob Ho", ["Thursday 11am-12pm"]]
		availableTimes: Object.entries(availableTimes),
		rarities: rarities,
	};
};
/**
 * [Helper Function for processSchedule] :
 * Returns a processed array based on the times paramater in the format of [`Monday time1`, `Monday time2`, etc.]
 * @param day - A string that indicates the day associated with the times list
 * @param times - A string in the formmat of "11am-12pm, 12-1pm"
 */
const reformatTimes = (day: string, times: string[]) => {
	let finalTimes: string[] = [];

	for (let timeIndex = 0; timeIndex < times.length; timeIndex++) {
		finalTimes.push(`${day} ${times[timeIndex]}`);
	}

	return finalTimes;
};

/**
 * [Helper Function for processSchedule] :
 * Updates the rarities object in processSchedule by looping through the times list and incrementing the corresponding counter in rarityObject
 * @param day - A string that indicates the day associated with the times list
 * @param times - A string in the formmat of "11am-12pm, 12-1pm"
 * @param rarityObject - the rarities object in process schedule
 */
const updateRarities = (
	day: string,
	times: string[],
	rarityObject: RarityObjectType
) => {
	for (let timeIndex = 0; timeIndex < times.length; timeIndex++) {
		if (times[timeIndex] in rarityObject[day]) {
			rarityObject[day][times[timeIndex]] += 1;
		} else {
			rarityObject[day][times[timeIndex]] = 1;
		}
	}
};

// Returns an array of objects sorted by increasing availability
// prettier-ignore
const sortStudents = ({ availableTimes, rarities, }: {
	availableTimes: [string, string[]][];
	rarities: RarityObjectType;
}) => {
	// 1. Sort students by the number of times they are available
	availableTimes.sort(
		([, listA], [, listB]) => listA.length - listB.length
	);

	// 2. Remove any students that have NO availabilities
	while (availableTimes[0][1].length === 0) {
		availableTimes.shift();
	}

	// 3. Sort each student's availability list by their rarity
	// prettier-ignore
	for (let studentIndex = 0; studentIndex < availableTimes.length; studentIndex++) {
		// Sort the available times by their "rarity" in increasing order

		availableTimes[studentIndex][1].sort(function(time1, time2) {
			// For each "Monday 11am-12pm", split it so that it becomes ["Monday", "11am-12pm"]
			let [t1Day, ...t1Time] = time1.split(" ").filter(i => i) 
			let [t2Day, ...t2Time] = time2.split(" ").filter(i => i)

			return rarities[t1Day][t1Time.join(" ")] - rarities[t2Day][t2Time.join(" ")];
		})
 
	}
};

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
	const processedData = processSchedule(stuCSV);

	// Step 2 : processedData now has the processed data, let's sort each student by the number of times they are available
	sortStudents(processedData);

	console.log(processedData);
};

export default generateSchedule;
