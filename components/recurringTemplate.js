import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Slider, FormGroup, FormControlLabel, Checkbox, TableCell, Table, TableHead, TableRow, TableBody, Button} from '@mui/material';



/**
 * Monday [true, true, false, false]
 * Tuesday [true, true, false, false]
 * ..
 * 
 */

export default function Availability(props) {
  //const [sliderValue, setSliderValue] = useState(0);
  const generateTimeslots = () => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const times = ["morning", "afternoon", "evening", "lateNight"];
    
    const result = {};
    
    days.forEach(day => {
      result[day] = {};
      times.forEach(time => {
        result[day][time] = false;
      })
    })
    
    return result;
  }

  const [checkboxState, setCheckboxState] = useState(generateTimeslots());
  
  return (<AvailabilityTable table={checkboxState} setCheckboxState={setCheckboxState} ></AvailabilityTable>)
}

function AvailabilityTable({ table, setCheckboxState}) {
  const rows = Object.keys(table);
  
  return (
    <div>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Day</TableCell>
          <TableCell>Morning</TableCell>
          <TableCell>Afternoon</TableCell>
          <TableCell>Evening</TableCell>
          <TableCell>Late Night</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (<TableRow key={index}> 
          <TableCell>{row}</TableCell>
          {Object.keys(table[row]).map((time, index) => (<TableCell key={index}>{<Checkbox checked={table[row][time]} onChange={e => {
            let temp = {...table};
            temp[row][time] = e.target.checked;
            setCheckboxState(temp);
          }}></Checkbox>}</TableCell>))}
        </TableRow>))}
      </TableBody>
    </Table>
    <Button onClick={() => handleSubmit(table)}>Submit</Button>
    </div>
  );
}

// onClick={() => handleSubmit(recurringSchedule)}
// {monday: {morning: true, afternoon: true, evening: false, lateNight: false}, tuesday: {morning: true, afternoon: true, evening: false, lateNight: false}, wednesday: {morning: true, afternoon: true, evening: false, lateNight: false}, thursday: {morning: true, afternoon: true, evening: false, lateNight: false}, friday: {morning: true, afternoon: true, evening: false, lateNight: false}, saturday: {morning: true, afternoon: true, evening: false, lateNight: false}, sunday: {morning: true, afternoon: true, evening: false, lateNight: false}

const handleSubmit = async (recurringSchedule) => {

  //const addAvailabilityToDataBase = await axios.post('/api/createRecurringTemplate', {data: {recurringSchedule}})
  console.log(recurringSchedule)
}


// Back End
export async function getServerSideProps(req) {
  // Connect to DB
  const prisma = new PrismaClient()
  
  // Disconnnect
  await prisma.$disconnect()

}


