import React from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

/**
 * FilterBar component for selecting country and category.
 * @param {Function} setCategory - Function to set the news category.
 * @param {Function} setCountry - Function to set the news country.
 */
function FilterBar({ setCategory, setCountry }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 2 }}>
      <FormControl variant="outlined" sx={{ minWidth: 150, marginRight: 2 }}> {/* Changed variant to 'outlined' */}
        <InputLabel id="country-select-label">Country</InputLabel>
        <Select
          labelId="country-select-label"
          onChange={(e) => setCountry(e.target.value)}
          defaultValue="us"
          label="Country">
          <MenuItem value="us">United States</MenuItem>
          <MenuItem value="ca">Canada</MenuItem>
          <MenuItem value="gb">United Kingdom</MenuItem>
          <MenuItem value="fr">France</MenuItem>
          <MenuItem value="de">Germany</MenuItem>
          <MenuItem value="it">Italy</MenuItem>
          <MenuItem value="es">Spain</MenuItem>
          <MenuItem value="cn">China</MenuItem>
          <MenuItem value="jp">Japan</MenuItem>
          <MenuItem value="kr">South Korea</MenuItem>
          <MenuItem value="in">India</MenuItem>
          <MenuItem value="br">Brazil</MenuItem>
          <MenuItem value="ru">Russia</MenuItem>
          <MenuItem value="au">Australia</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" sx={{ minWidth: 150 }}> {/* Changed variant to 'outlined' */}
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          onChange={(e) => setCategory(e.target.value)}
          defaultValue="business"
          label="Category" >
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="entertainment">Entertainment</MenuItem>
          <MenuItem value="general">General</MenuItem>
          <MenuItem value="health">Health</MenuItem>
          <MenuItem value="science">Science</MenuItem>
          <MenuItem value="sports">Sports</MenuItem>
          <MenuItem value="technology">Technology</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default FilterBar;
