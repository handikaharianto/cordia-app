export type CourseSchedule = {
  "Course ID": string
  "Term Code": string
  "Term Descr": string
  Session: string
  Subject: string
  "Catalog Nbr": string
  Section: string
  "Component Code": string
  "Class Nbr": string
  "Class Association": string
  "Course Title": string
  "Topic ID": string
  "Topic Descr": string
  "Combined Section ID": string
  "Class Status": string
  "Location Code": string
  "Location Descr": string
  "Instruction Mode code": string
  "Instruction Mode Descr": string
  "Meeting Pattern Nbr": string
  "Room Code": string
  "Building Code": string
  Room: string
  "Class Start Time": string
  "Class End Time": string
  Mon: string
  Tues: string
  Wed: string
  Thurs: string
  Fri: string
  Sat: string
  Sun: string
  "Start Date (DD/MM/YYYY)": string
  "End Date (DD/MM/YYYY)": string
  Career: string
  "Dept. Code": string
  "Dept. Descr": string
  "Faculty Code": string
  "Faculty Descr": string
  "Enrollment Capacity": string
  "Current Enrollment": string
  "Waitlist Capacity": string
  "Current Waitlist Total": string
  "Has some/all seats reserved?": string
}

export type Classroom = {
  location_code: string
  location_description: string
  room_code: string
  building_code: string
  room: string
  class_start_time: string
  class_end_time: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
  start_date: string
  end_date: string
  faculty_code: string
  faculty_description: string
}
