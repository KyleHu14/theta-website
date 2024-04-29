import { preinit } from "react-dom";
import {
	RarityObjectType,
	FinalScheduleType,
	ProcessedDataType,
	StuType,
} from "./algorithmTypes";

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

//prettier-ignore
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
const processCSV = (stuCSV: string[][]) => {
	// 1. students : object with student key that points to list of available times
	let students: StuType[] = [];

	let days: string[] = []

	let times = new Set()

	/** 
		2.  rarities : object that holds how rare every time in a particular day is
			For example : {
				Monday : {"10-11am" : 5, "11am-12pm" : 10}
			}
	*/
	let rarities: RarityObjectType = {};
	
	for (let col = 2; col < stuCSV[0].length; col++) {
		// 1. Remove whitespace w regex
		let day = stuCSV[0][col].replace(/\s+/g, "")
		
		// 2. Initialize each day as an object, rarities["Monday"] = {}
		rarities[day] = {};

		// 3. Update the days list
		days.push(day)
	}

	// Why is row = 1? Row 0 represents are column titles (Name, Timestamp, Monday, etc.), we can skip this
	// Why is col = 2? Col 0 are the timestamps which can be skipped, Col 1 are the names which aren't needed when looping

	// 3. Loop through CSV, init a stuObj, append stuObj to students
	for (let row = 1; row < stuCSV.length; row++) {
		// 1. Init a stuObj that saves name & freeTimes of a student
		let stuObj: StuType = { name: stuCSV[row][1], freeTimes: [] }

		// 2. Loop through student's available times by checking their days (cols)
		for (let col = 2; col < stuCSV[row].length; col++) {
			// 1. Check if student has available times
			if (stuCSV[row][col] !== "") {
				// 1. Time is in str format : "11am-12pm, 12pm-1pm", need to split
				const timesList = stuCSV[row][col].split(", ");

				timesList.map((time: string) => {
					times.add(time)
				})

				// 2. Transform "Wednesday" & ["11am-12pm", "12pm-1pm"] to ["Wednesday 11am-12pm", "Wednesday 12pm-1pm"]
				stuObj.freeTimes = stuObj.freeTimes.concat(reformatTimes(stuCSV[0][col], timesList))
				
				// 3. Increment the occurence of all times in timesList on the particular day
				updateRarities(stuCSV[0][col].replace(/\s+/g, ""), timesList, rarities)
			}
		}

		// 3. After processing all student times, add to students list
		students.push(stuObj);
	}

	console.log(times)

	// 4. Return everything as an object
	return { students: students, rarities: rarities, days: days }
}

// prettier-ignore
/**
 * Sorts each student's available time based on how rare their available time slots are
 * @param students - A list of lists (tuples) that contains the available time slots of each student
 * @param rarities - An object that holds the rarity of each time slot, the lower the number the more rare it is
 */
const sortStudents = ({ students, rarities, }: {
	students: StuType[];
	rarities: RarityObjectType;
}) => {
	// 1. Sort students by the number of times they are available
	students.sort(
		(stuA, stuB) => stuA.freeTimes.length- stuB.freeTimes.length
	);

	// 2. Sort students.freeTimes by rarity
	//    [0] : means time with LEAST amt of ppl who can work at this time
	for (let studentIndex = 0; studentIndex < students.length; studentIndex++) {
		// 1. Sort the available times by their "rarity" in increasing order
		students[studentIndex].freeTimes.sort(function(time1, time2) {
			// 1. Split "Monday 11am-12pm" so that it becomes ["Monday", "11am-12pm"]
			let [t1Day, ...t1Time] = time1.split(" ").filter(i => i) 
			let [t2Day, ...t2Time] = time2.split(" ").filter(i => i)

			// 2. Return rarities of t1Day at t1Time - rarities of t2Day at t2Time
			//    t1Time.join(" ")
			return rarities[t1Day][t1Time.join(" ")] - rarities[t2Day][t2Time.join(" ")]
		})
	}
};

const preInitFinalSchedule = (rarities: RarityObjectType) => {
	let final: FinalScheduleType = {};

	// 1. For each day & all its times, initialize it in the final schedule as an empty list
	for (const day in rarities) {
		// 1. Need to get days as headers
		for (const time in rarities[day]) {
			final[day + " " + time] = [];
		}
	}

	return final;
};

//prettier-ignore
const scheduleStudents = ( processedData: ProcessedDataType, minStudents: number ) => {
	// 1. Initialize the final schedule to return
	let finalSchedule = preInitFinalSchedule( processedData.rarities )
	
	// 2. While there still students that are available, add them to finalSchedule
    while (processedData.students.length > 0) {
		// 1. Get first student & their time
		let curStu = processedData.students[0]

		// 3. If freeTimes[0] is full, remove the time until we have an open time
		while (curStu.freeTimes.length > 0 && finalSchedule[curStu.freeTimes[0]].length === minStudents) {
			curStu.freeTimes.shift()
		}
		
		if (curStu.freeTimes.length === 0){
			processedData.students.shift()
		} 
		else {
			// 2. Destructure times since times = "Monday 11am-12pm", used for updating rarities
			let [day, timeRange] = curStu.freeTimes[0].trim().split(" ").filter(i => i)

			// 4. Push the student to the schedule
			finalSchedule[curStu.freeTimes[0]].push(curStu.name)

			processedData.rarities[day][timeRange] -= 1

			// 5. Remove the student
			const removeStuIndex = processedData.students.findIndex(stu => stu.name === curStu.name);
			processedData.students.splice(removeStuIndex, 1);
			
			// Resort the student's times array to reflect the updated rarities
			sortStudents(processedData)
		}
    }

	return finalSchedule
};

const convertFormat = (schedule: FinalScheduleType, days: string[]) => {
	const cols = ["Times", "Students"];
	let colData: string[][] = [[], []];
};

const generateSchedule = (stuCSV: string[][], minStudents: number) => {
	// Step 1 : Parse through stuAvail, calculate rarities of each day
	const processedData = processCSV(stuCSV);

	// Step 2 : processedData now has the processed data, let's sort each student by the number of times they are available
	sortStudents(processedData);

	// Step 3 : We can now schedule the students properly
	const finalSchedule = scheduleStudents(processedData, minStudents);

	// Step 4 : Convert finalSchedule into a 2D array format that can be unparsed by papa parse
	convertFormat(finalSchedule, processedData.days);
};

export default generateSchedule;
