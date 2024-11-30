import { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { updateJobField } from '../../store/PostJobSlice';

const JobSite2 = () => {
  const [minPay, setMinPay] = useState('');
  const [maxPay, setMaxPay] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const dispatch = useDispatch();

  const handleMinPayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMinPay(value);
      dispatch(updateJobField({ field: 'minSalary', value: parseInt(value, 10) }));
    }
  };

  const handleMaxPayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMaxPay(value);
      dispatch(updateJobField({ field: 'maxSalary', value: parseInt(value, 10) }));
    }
  };

  const handleStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
    dispatch(updateJobField({ field: 'location', value: `${e.target.value}, ${city}` }));
  };

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    dispatch(updateJobField({ field: 'location', value: `${state}, ${e.target.value}` }));
  };

  const handleJobDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    dispatch(updateJobField({ field: 'description', value: e.target.value }));
  };

  const isPayValid = () => {
    const min = parseInt(minPay, 10);
    const max = parseInt(maxPay, 10);
    return min >= 0 && max >= 0 && min < max;
  };

  return (
    <main className="pt-9 flex flex-col justify-start items-center gap-4">
        <div className="w-[60vw] px-28 py-1 bg-white rounded-2xl flex justify-between items-center">
            <div >
                <h1 className="text-[1.57rem] font-semibold mb-2">Add pay and benefit</h1>
            </div>
            <div>
                <img src="/createJob.svg" alt="Create Job" />
            </div>
        </div>
        <div className="w-[60vw] px-28 py-10 bg-white rounded-2xl">
            <h2 className="text-xl font-medium">Pay</h2>
            <h4>Review the pay estimated for your job and adjust as needed. Check your local minium wage</h4>
            <div className="flex gap-1 items-center w-[50%] text-4xl ">
                <input
                type="text"
                placeholder="Minimum"
                value={minPay}
                onChange={handleMinPayChange}
                className="placeholder:text-xl text-xl font-medium border-2 border-[#B0B0B0] rounded-lg w-full px-4 py-2 mt-3"
                />-
                <input
                type="text"
                placeholder="Maximum"
                value={maxPay}
                onChange={handleMaxPayChange}
                className="placeholder:text-xl text-xl font-medium border-2 border-[#B0B0B0] rounded-lg w-full px-4 py-2 mt-3"
                />
            </div>
            {!isPayValid() && <p className="text-red-500">Minimum pay should be less than maximum pay and both should be positive numbers.</p>}
        </div>
        <div className="w-[60vw] px-28 py-10 bg-white rounded-2xl">
            <h2 className="text-xl font-medium">Location</h2>
            <div className="flex gap-10 items-center">
                <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={handleStateChange}
                    className="placeholder:text-xl text-xl font-medium border-2 border-[#B0B0B0] rounded-lg w-full px-4 py-2 mt-3"
                />
                <input
                    type="text"
                    placeholder="city"
                    value={city}
                    onChange={handleCityChange}
                    className="placeholder:text-xl text-xl font-medium border-2 border-[#B0B0B0] rounded-lg w-full px-4 py-2 mt-3"
                />
            </div>
        </div>
        <div className="w-[60vw] px-28 py-10 bg-white rounded-2xl">
            <h2 className="text-xl font-medium">Skills required for this job</h2>
            <textarea
                name="job-description"
                rows={10}
                placeholder='Job description here...'
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                className="w-full h-56 border-2 border-[#B0B0B0] rounded-lg px-4 py-2 mt-3 text-xl font-medium resize-none"
                style={{ resize: 'none' }}
            ></textarea>
        </div>
    </main>
  )
}

export default JobSite2