import React, { useState } from 'react';
import { Typography, Slider, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function Availability(props) {
  const [sliderValue, setSliderValue] = useState(0);
  const [checkboxState, setCheckboxState] = useState([
    { checked: false, name: 'Monday' },
    { checked: false, name: 'Tuesday' },
    { checked: false, name: 'Wednesday' },
    { checked: false, name: 'Thursday' },
    { checked: false, name: 'Friday' },
    { checked: false, name: 'Saturday' },
    { checked: false, name: 'Sunday' },
  ]);

  return (
    <div data-test-id="availability-li">
      <Typography variant="h4" gutterBottom>
        {props.title}
      </Typography>
      <FormGroup className='flex align-top'>
        {checkboxState.map((item, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={item.checked}
                onChange={(e) => {
                  let temp = [...checkboxState];
                  temp[index].checked = e.target.checked;
                  setCheckboxState(temp);
                }}
              />
            }
            label={item.name}
          />
        ))}
      </FormGroup>
    </div>
  )
}