/* Problems that aren't solved 
1. What is the format of the final schedule we are returning? (Maybe CSV?)
2. What is the format of the schedule returned in getBoothTimes? [DONE]
3.  

**/

import {
	RarityObjectType,
	finalScheduleType,
	processedDataType,
	stuType,
} from "./algorithmTypes";


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
const processSchedule = (stuCSV: string[][]) => {
	// [Variable Initialization]
	// 1. availableTimes represents an object with students, each student key points to a list of available times
	let availableTimes: stuType[] = [];

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

		availableTimes.push({ name: stuName, freeTimes: [] });

		// Now let's loop through stuName's available times
		for (let col = 2; col < stuCSV[row].length; col++) {
			// 1. First add the available times to the availableTimes obj
			// 1.1 We need to check that there are available times to add
			if (stuCSV[row][col] !== "") {
				// We will need a split array of times for example : ["11am-12pm", "12-1pm"]
				const timesList = stuCSV[row][col].split(", ");

				// 2. Transform "11am-12pm, 12-1pm" into ["Wednesday 11am-12pm", "Thursday 12pm-1pm"] using reformatTimes
				// 2.1 ADD it to the student's available times list
				availableTimes[availableTimes.length - 1].freeTimes = availableTimes[availableTimes.length - 1].freeTimes.concat(
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
		availableTimes: availableTimes,
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

// prettier-ignore
/**
 * Sorts each student's available time based on how rare their available time slots are
 * @param availableTimes - A list of lists (tuples) that contains the available time slots of each student
 * @param rarities - An object that holds the rarity of each time slot, the lower the number the more rare it is
 */
const sortStudents = ({ availableTimes, rarities, }: {
	availableTimes: stuType[];
	rarities: RarityObjectType;
}) => {
	// 1. Sort students by the number of times they are available
	availableTimes.sort(
		(stuA, stuB) => stuA.freeTimes.length- stuB.freeTimes.length
	);

	// 2. Remove any students that have NO availabilities
    // Nina's Suggestion : "No need to remove a student with no times"
	// while (availableTimes[0].freeTimes.length === 0) {
	// 	availableTimes.shift()
	// }

	// 3. Sort each student's availability list by their rarity
	// prettier-ignore
	for (let studentIndex = 0; studentIndex < availableTimes.length; studentIndex++) {
		// Sort the available times by their "rarity" in increasing order

		availableTimes[studentIndex].freeTimes.sort(function(time1, time2) {
			// For each "Monday 11am-12pm", split it so that it becomes ["Monday", "11am-12pm"]
			let [t1Day, ...t1Time] = time1.split(" ").filter(i => i) 
			let [t2Day, ...t2Time] = time2.split(" ").filter(i => i)

			// We do this weird syntax here since t1/t2 time are actually lists in the case we have times like "11am-12pm (cleaning)", so we need to join them back into 1 string for it to work as a key
			return rarities[t1Day][t1Time.join(" ")] - rarities[t2Day][t2Time.join(" ")]
		})
 
	}

};

/**
 * [Helper Function for sortStudents] : Adds student to finalSchedule[time]
 * @param time - A string in the format of "Monday 11am-12pm"
 * @param student - A string that represents the name of a student
 * @param finalSchedule - The final object that will be returned, keys represents time in the format "Monday 11am-12pm", whereas values are lists with students
 */
const pushSchedule = (times:string[], student: string, finalSchedule: finalScheduleType, processedData: processedDataType) => {
	// At this point, we will make the  assumption that times[0]'s slot in final schedule is not maxxed
	const maxStudents = 4

    if (times.length > 0) {
        // Destructure times..
        let [day, timeRange] = times[0].trim().split(" ").filter(i => i)

        // Edit the processedData object
        processedData.rarities[day][timeRange] -= 1

        // If the time string is in the finalSchedule object, we can just push the student
        if (times[0] in finalSchedule) {
            // The only place where we need to check if an array is len of 5
            if (finalSchedule[times[0]].length === maxStudents) {
                // Go thru all students and remove this current time since its maxxed
                for (let i = 0; i < processedData.availableTimes.length; i++) {
                    // For student i, remove all traces of time[0]
                    let index = processedData.availableTimes[i].freeTimes.indexOf(times[0])
                    if (index !== -1) {
                        processedData.availableTimes[i].freeTimes.splice(index, 1)
                    }
                    
                }
            } else {
                finalSchedule[times[0]].push(student)
            }
        }
        // Otherwise, we need to initialize a list with the student
        else {
            finalSchedule[times[0]] = [student]
        }

    } 
    else {
        console.log(`Empty Times ${student}`)
    }
	
    // Remove the student that we just assigned a time
    const removeStuIndex = processedData.availableTimes.findIndex(obj => obj.name === student);
    processedData.availableTimes.splice(removeStuIndex, 1);

    // Resort the student's times array to reflect the updated rarities
	sortStudents(processedData)
}

//prettier-ignore
const scheduleStudents = (
	processedData: processedDataType,
	minStudents: number
) => {
	// let availableTimes = processedData.availableTimes
	let rarities = processedData.rarities

	let finalSchedule: finalScheduleType = {}


    let moe = 0 
	// Loop through every student
    while (processedData.availableTimes.length > 0 && moe < 73) {
        let firstStu = processedData.availableTimes[0];
        pushSchedule(firstStu.freeTimes, firstStu.name, finalSchedule, processedData)

        moe += 1
    }
    // console.log(processedData)

	return finalSchedule
};

const generateSchedule = (stuCSV: string[][], minStudents:number) => {
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
	const processedData = processSchedule(stuCSV)

	// Step 2 : processedData now has the processed data, let's sort each student by the number of times they are available
	sortStudents(processedData)

	// Step 3 : We can now schedule the students properly
	const finalSchedule = scheduleStudents(processedData, minStudents)

	console.log(finalSchedule)
	console.log(processedData)
};

export default generateSchedule;
