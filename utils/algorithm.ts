import {
	RarityObjectType,
	finalScheduleType,
	processedDataType,
	stuType,
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
const processSchedule = (stuCSV: string[][]) => {
	// 1. students : object with student key that points to list of available times
	let students: stuType[] = [];

	/** 
		2.  rarities : object that holds how rare every time in a particular day is
			For example : {
				Monday : {"10-11am" : 5, "11am-12pm" : 10}
			}
	*/
	let rarities: RarityObjectType = {};
	
	// Initialize each day as an object, rarities["Monday"] = {}
	for (let col = 2; col < stuCSV[0].length; col++) {
		// Remove whitespace w regex
		rarities[stuCSV[0][col].replace(/\s+/g, "")] = {};
	}

	// Why is row = 1? Row 0 represents are column titles (Name, Timestamp, Monday, etc.), we can skip this
	// Why is col = 2? Col 0 are the timestamps which can be skipped, Col 1 are the names which aren't needed when looping

	// 3. Loop through CSV, init a stuObj, append stuObj to students
	for (let row = 1; row < stuCSV.length; row++) {
		// 1. Init a stuObj that saves name & freeTimes of a student
		let stuObj: stuType = { name: stuCSV[row][1], freeTimes: [] }

		// 2. Loop through student's available times by checking their days (cols)
		for (let col = 2; col < stuCSV[row].length; col++) {
			// 1. Check if student has available times
			if (stuCSV[row][col] !== "") {
				// 1. Time is in str format : "11am-12pm, 12pm-1pm", need to split
				const timesList = stuCSV[row][col].split(", ");

				// 2. Transform "Wednesday" & ["11am-12pm", "12pm-1pm"] to ["Wednesday 11am-12pm", "Wednesday 12pm-1pm"]
				stuObj.freeTimes = stuObj.freeTimes.concat(reformatTimes(stuCSV[0][col], timesList))
				
				// 3. Increment the occurence of all times in timesList on the particular day
				updateRarities(stuCSV[0][col].replace(/\s+/g, ""), timesList, rarities)
			}
		}

		// 3. After processing all student times, add to students list
		students.push(stuObj);
	}

	// 4. Return everything as an object
	return { students: students, rarities: rarities }
}

// prettier-ignore
/**
 * Sorts each student's available time based on how rare their available time slots are
 * @param students - A list of lists (tuples) that contains the available time slots of each student
 * @param rarities - An object that holds the rarity of each time slot, the lower the number the more rare it is
 */
const sortStudents = ({ students, rarities, }: {
	students: stuType[];
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

/**
 * [Helper Function for sortStudents] : Adds student to finalSchedule[time]
 * @param time - A string in the format of "Monday 11am-12pm"
 * @param student - A string that represents the name of a student
 * @param finalSchedule - The final object that will be returned, keys represents time in the format "Monday 11am-12pm", whereas values are lists with students
 */
const pushSchedule = (times:string[], student: string, finalSchedule: finalScheduleType, processedData: processedDataType, minStudents: number) => {
    // 1. First check if the student is available
	if (times.length > 0) {
        // 1. Destructure times since times = "Monday 11am-12pm"
        let [day, timeRange] = times[0].trim().split(" ").filter(i => i)

        // 2. Update rarities since this student will be added to day at time timeRange
        processedData.rarities[day][timeRange] -= 1

        // 3. If the time string is in the finalSchedule object, we can just push the student
        if (times[0] in finalSchedule) {
            // The only place where we need to check if an array is len of 5
            if (finalSchedule[times[0]].length === minStudents) {
                // Go thru all students and remove this current time since its maxxed
                for (let i = 0; i < processedData.students.length; i++) {
                    // For student i, remove all traces of time[0]
                    let index = processedData.students[i].freeTimes.indexOf(times[0])
                    if (index !== -1) {
                        processedData.students[i].freeTimes.splice(index, 1)
                    }
                }
            } else {
                finalSchedule[times[0]].push(student)
            }
        }
        // 4. Otherwise, we need to initialize a list with the student
        else {
            finalSchedule[times[0]] = [student]
        }

    } 
	// 2. We have encountered a student with no availability, this is an edge case
    else {
        console.log(`Empty Times ${student}`)
    }
	
    // Remove the student that we just assigned a time
    const removeStuIndex = processedData.students.findIndex(obj => obj.name === student);
    processedData.students.splice(removeStuIndex, 1);

    // Resort the student's times array to reflect the updated rarities
	sortStudents(processedData)
}

//prettier-ignore
const scheduleStudents = ( processedData: processedDataType, minStudents: number ) => {
	// 1. Initialize the final schedule to return
	let finalSchedule: finalScheduleType = {}


	// 2. While there still students that are available, add them to finalSchedule
    while (processedData.students.length > 0) {
        let firstStu = processedData.students[0];
        pushSchedule(firstStu.freeTimes, firstStu.name, finalSchedule, processedData, minStudents)
    }

	return finalSchedule
};

const generateSchedule = (stuCSV: string[][], minStudents:number) => {
	// Step 1 : Parse through stuAvail, calculate rarities of each day
	const processedData = processSchedule(stuCSV)

	// Step 2 : processedData now has the processed data, let's sort each student by the number of times they are available
	sortStudents(processedData)

	// Step 3 : We can now schedule the students properly
	const finalSchedule = scheduleStudents(processedData, minStudents)

	console.log(finalSchedule)
};

export default generateSchedule;
