import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import temp from './temp.jpg'

const cities = [
  'Tokyo',
  'Delhi',
  'Shanghai',
  'Dhaka',
  'Sao Paulo',
  'Mexico City',
  'Cario',
  'Beijing',
  'Mumbai',
  'Osaka',
  'Hyderabad'
]
function App() {
  const [input, setInput] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [weathers, setWeathers] = useState<string[] | null>(null);

  useEffect(() => {
    const fetechData = async () => {
      if (selectedCity) {
        setLoading(true);
        setError('');
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=0392ac5f476046523beba2f6cc9d53e4`
          const weatherData = await axios.get(url);
          const { feels_like, humidity, pressure, temp, temp_max, temp_min } = weatherData.data.main;
          const { name } = weatherData.data;
          const { speed } = weatherData.data.wind;
          const { main } = weatherData.data.weather[0];
          setWeathers([feels_like, humidity, pressure, temp, temp_max, temp_min, name, main, speed])
          console.log(weatherData);
        } catch (error) {
          console.log(error);
          setError('Something Went Wrong while Fetchiing Data');
        } finally {
          setLoading(false);
        }
      }
    }
    fetechData();

  }, [selectedCity])



  const handleSelectedCity = (city: string) => {
    setSelectedCity(city);
    setInput('')
    setResults([]);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setInput(e.target.value)
    const filteredCities = cities.filter(city =>
      city.toLowerCase().includes(input.toLowerCase())
    );
    if (e.target.value === '') {
      setResults([]);
      setWeathers(null);
    } else {
      setResults(filteredCities);
    }

  }

  return (
    <div className="bg-slate-400 h-screen   flex-column justify-center items-center">
      <div className='pt-8 text-center'>
        <input value={input} className='p-2 outline-0 border-hidden rounded-sm' type="text" placeholder='Enter the City name' onChange={handleInputChange} />
        <div>
          {results.length > 0 && <ul>
            {results.map((result, index) => (
              <li className='hover:cursor-pointer' key={index} onClick={() => handleSelectedCity(result)}>
                {result}
              </li>
            ))}
          </ul>}
        </div>

      </div>
      <div className='mt-10'>
        {loading ? <h1 className='text-center'>loading....</h1> : (''
        )}
        {error ? <h1 className='text-center'>{error}</h1> : ''}
        {weathers && (
          <div>
            <h1 className='text-2xl text-center font-bold '>Weather in {weathers[6]}</h1>
            <div className='w-screen text-center flex justify-around font-serif'>
              <div className='p-6 flex text-center'>
                <div className='flex-col'>
                  <h1 className='font-normal'>Temperature</h1>
                  <h1 className=''> {weathers[3]}°</h1>
                </div>
                <img src={temp} className='w-14' alt='img' />

              </div>
              <div>
                <div className='p-6 pb-0  flex'>
                  <h1 className='font-normal font-serif'>Max   {weathers[4]}°</h1>
                </div>
                <div className='p-6 py-0 flex font-serif'><h1 className='font-normal'>Min   {weathers[5]}°</h1>
                </div>
              </div>

            </div>
            <div className='flex flex-wrap font-serif justify-center'>
              <div className='p-6'>Humidity: {weathers[1]}%</div>
              <div className='p-6'>Pressure: {weathers[2]} hPa</div>
              <div className='p-6'>Wind Speed: {weathers[8]} m/s</div>
              <div className='p-6'>Weather: {weathers[7]}</div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;


