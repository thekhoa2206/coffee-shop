import React, { useState } from "react";
import DatePicker from "./DatePicker";

const FilterDatePicker = () => {
  const [date, setDate] = useState<Date | null>();
  return (
    <DatePicker
      value={date}
      format="DD/MM/YYYY"
      onChange={setDate}
      selectMonth
      defaultValue={new Date("2000-02-27")}
      maxDate={new Date()}
      textFieldProps={{ style: { paddingTop: 0, width: "100%" } }}
    />
  );
};
export default FilterDatePicker;
